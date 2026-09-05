/**
 * Permanent payment history ledger (IndexedDB).
 * Survives app close, refresh, OS restart, and most storage cleanups.
 * Soft-delete only — hard DELETE is never used for user history.
 */

export type TxnType = "paid" | "received";
export type TxnStatus = "success" | "failed" | "pending" | "refunded" | "deleted";
export type PaymentMethod = "upi" | "card" | "netbanking" | "wallet";

export interface TransactionRecord {
  id: string;
  type: TxnType;
  amount: number;
  amountStr: string;
  currency: string;
  counterparty_name: string;
  counterparty_upi: string | null;
  counterparty_avatar: string | null;
  source_account: string;
  source_account_logo: string | null;
  destination_account: string | null;
  transaction_ref: string;
  status: TxnStatus;
  payment_method: PaymentMethod;
  /** UTC ISO-8601 */
  date_time: string;
  note: string | null;
  category: string | null;
  metadata: string | null;
  created_at: string;
  updated_at: string;
}

export type NewTransaction = Omit<TransactionRecord, "id" | "created_at" | "updated_at" | "status"> & {
  id?: string;
  status?: TxnStatus;
};

const DB_NAME = "ppe_permanent_ledger_v1";
const DB_VERSION = 1;
const STORE = "transactions";
const RETRY_KEY = "ppe_txn_retry_queue_v1";
const BACKUP_KEY = "ppe_txn_backup_v1";

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB unavailable"));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const os = db.createObjectStore(STORE, { keyPath: "id" });
        os.createIndex("date_time", "date_time", { unique: false });
        os.createIndex("counterparty_name", "counterparty_name", { unique: false });
        os.createIndex("transaction_ref", "transaction_ref", { unique: true });
        os.createIndex("status", "status", { unique: false });
        os.createIndex("type", "type", { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("IDB open failed"));
  });
}

function idbReq<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("IDB request failed"));
  });
}

function idbTxDone(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("IDB tx failed"));
    tx.onabort = () => reject(tx.error ?? new Error("IDB tx aborted"));
  });
}

/* ── Retry queue (localStorage) for failed inserts ── */
function readRetryQueue(): NewTransaction[] {
  try {
    const raw = localStorage.getItem(RETRY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as NewTransaction[]) : [];
  } catch {
    return [];
  }
}

function writeRetryQueue(items: NewTransaction[]) {
  try {
    localStorage.setItem(RETRY_KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
}

function enqueueRetry(item: NewTransaction) {
  const q = readRetryQueue();
  if (q.some((x) => x.transaction_ref === item.transaction_ref)) return;
  q.push(item);
  writeRetryQueue(q);
}

/** Mirror latest snapshot for extra durability (not source of truth). */
function writeBackup(rows: TransactionRecord[]) {
  try {
    localStorage.setItem(BACKUP_KEY, JSON.stringify({ t: Date.now(), rows }));
  } catch {
    /* ignore quota */
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function toRecord(input: NewTransaction): TransactionRecord {
  const now = new Date().toISOString();
  if (!(input.amount > 0)) throw new Error("Amount must be positive");
  if (!input.transaction_ref?.trim()) throw new Error("transaction_ref required");
  return {
    id: input.id ?? `TXN-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${uuid().slice(0, 8).toUpperCase()}`,
    type: input.type,
    amount: input.amount,
    amountStr: input.amountStr,
    currency: input.currency || "INR",
    counterparty_name: input.counterparty_name,
    counterparty_upi: input.counterparty_upi ?? null,
    counterparty_avatar: input.counterparty_avatar ?? null,
    source_account: input.source_account,
    source_account_logo: input.source_account_logo ?? null,
    destination_account: input.destination_account ?? null,
    transaction_ref: input.transaction_ref,
    status: input.status ?? "success",
    payment_method: input.payment_method || "upi",
    date_time: input.date_time || now,
    note: input.note ?? null,
    category: input.category ?? null,
    metadata: input.metadata ?? null,
    created_at: now,
    updated_at: now,
  };
}

/** Atomic insert. UNIQUE on transaction_ref prevents double-pay duplicates. */
export async function insertTransaction(input: NewTransaction): Promise<TransactionRecord> {
  const record = toRecord(input);
  const db = await openDb();
  try {
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    const idx = store.index("transaction_ref");
    const existing = await idbReq(idx.get(record.transaction_ref));
    if (existing) {
      await idbTxDone(tx);
      return existing as TransactionRecord; // INSERT OR IGNORE semantics
    }
    store.put(record);
    await idbTxDone(tx);
    // refresh backup snapshot (best-effort)
    void listAllTransactions().then(writeBackup);
    return record;
  } finally {
    db.close();
  }
}

/**
 * Insert with retry (1s, 3s, 9s). On total failure, enqueue for next launch.
 * Call this at the same moment the success screen mounts / chime plays.
 */
export async function insertTransactionDurable(
  input: NewTransaction,
  onRetryToast?: (msg: string) => void
): Promise<TransactionRecord | null> {
  const delays = [0, 1000, 3000, 9000];
  let lastErr: unknown;
  for (let i = 0; i < delays.length; i++) {
    if (delays[i] > 0) {
      onRetryToast?.("Saving history…");
      await sleep(delays[i]);
    }
    try {
      return await insertTransaction(input);
    } catch (e) {
      lastErr = e;
    }
  }
  enqueueRetry(input);
  console.warn("[ledger] insert failed after retries; queued", lastErr);
  return null;
}

/** Flush any queued inserts (call on app boot). */
export async function flushRetryQueue(): Promise<number> {
  const q = readRetryQueue();
  if (!q.length) return 0;
  const remaining: NewTransaction[] = [];
  let ok = 0;
  for (const item of q) {
    try {
      await insertTransaction(item);
      ok++;
    } catch {
      remaining.push(item);
    }
  }
  writeRetryQueue(remaining);
  return ok;
}

export async function listAllTransactions(includeDeleted = false): Promise<TransactionRecord[]> {
  const db = await openDb();
  try {
    const tx = db.transaction(STORE, "readonly");
    const store = tx.objectStore(STORE);
    const all = (await idbReq(store.getAll())) as TransactionRecord[];
    await idbTxDone(tx);
    const rows = includeDeleted ? all : all.filter((r) => r.status !== "deleted");
    rows.sort((a, b) => (a.date_time < b.date_time ? 1 : -1));
    return rows;
  } finally {
    db.close();
  }
}

export async function softDeleteTransaction(id: string): Promise<void> {
  const db = await openDb();
  try {
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    const row = (await idbReq(store.get(id))) as TransactionRecord | undefined;
    if (!row) {
      await idbTxDone(tx);
      return;
    }
    row.status = "deleted";
    row.updated_at = new Date().toISOString();
    store.put(row);
    await idbTxDone(tx);
    void listAllTransactions(true).then(writeBackup);
  } finally {
    db.close();
  }
}

export async function countTransactions(): Promise<number> {
  const db = await openDb();
  try {
    const tx = db.transaction(STORE, "readonly");
    const n = await idbReq(tx.objectStore(STORE).count());
    await idbTxDone(tx);
    return n;
  } finally {
    db.close();
  }
}

/** Seed permanent DB once if empty (first install). */
export async function seedIfEmpty(seeds: NewTransaction[]): Promise<void> {
  const n = await countTransactions().catch(() => 0);
  if (n > 0) return;
  for (const s of seeds) {
    try {
      await insertTransaction({ ...s, status: s.status ?? "success" });
    } catch {
      /* ignore unique / validation */
    }
  }
}
