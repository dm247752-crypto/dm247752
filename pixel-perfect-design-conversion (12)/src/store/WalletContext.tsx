import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  flushRetryQueue,
  insertTransactionDurable,
  listAllTransactions,
  seedIfEmpty,
  softDeleteTransaction,
  type NewTransaction,
  type TransactionRecord,
} from "../db/transactionsDb";

export type Bank = "sbi" | "gpay";

/** UI-facing transaction shape (mapped from permanent ledger). */
export interface Txn {
  id: string;
  type: "sent" | "received";
  name: string;
  sub: string;
  amount: number;
  amountStr: string;
  ts: number;
  bank: Bank;
  txnId: string;
  utr: string;
  avatar?: string;
  live?: boolean;
  note?: string | null;
  status?: string;
  paymentMethod?: string;
  sourceAccount?: string;
  dateTimeIso?: string;
}

const BALANCE_KEY = "ppe_wallet_balance_v4";
const HOUR = 3_600_000;
const DAY = 86_400_000;

const rnd = (n: number) =>
  Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join("");

function bankFromSource(src: string | null | undefined): Bank {
  if (!src) return "sbi";
  const s = src.toLowerCase();
  if (s.includes("gpay") || s.includes("g pay") || s.includes("google")) return "gpay";
  return "sbi";
}

function recordToTxn(r: TransactionRecord, live = false): Txn {
  return {
    id: r.id,
    type: r.type === "paid" ? "sent" : "received",
    name: r.counterparty_name,
    sub: r.counterparty_upi || r.source_account || "",
    amount: r.amount,
    amountStr: r.amountStr || String(r.amount),
    ts: Date.parse(r.date_time) || Date.now(),
    bank: bankFromSource(r.source_account),
    txnId: r.id,
    utr: r.transaction_ref,
    avatar: r.counterparty_avatar ?? undefined,
    live,
    note: r.note,
    status: r.status,
    paymentMethod: r.payment_method,
    sourceAccount: r.source_account,
    dateTimeIso: r.date_time,
  };
}

function seedNewTxns(): NewTransaction[] {
  const now = Date.now();
  const mk = (
    type: "paid" | "received",
    name: string,
    upi: string,
    amountStr: string,
    ago: number,
    source: string,
    avatar?: string
  ): NewTransaction => {
    const amount = Number(amountStr.replace(/,/g, ""));
    const iso = new Date(now - ago).toISOString();
    return {
      type,
      amount,
      amountStr,
      currency: "INR",
      counterparty_name: name,
      counterparty_upi: upi,
      counterparty_avatar: avatar ?? null,
      source_account: source,
      source_account_logo: null,
      destination_account: type === "paid" ? upi : "SBI ••1920",
      transaction_ref: rnd(12),
      payment_method: "upi",
      date_time: iso,
      note: null,
      category: "transfer",
      metadata: JSON.stringify({ seeded: true }),
      status: "success",
    };
  };

  return [
    mk("paid", "Hazari Lal Meena", "98290 12345", "500", 25 * 60_000, "SBI ••1920"),
    mk("received", "Chhote Lal Meena", "XXXXXXXX2822", "500", 3 * HOUR, "G Pay"),
    mk("paid", "LOKESH SAINI", "97994 55210", "25", DAY + 4 * HOUR, "SBI ••1920"),
    mk("received", "XXXXXXXX2822", "XXXXXXXX2822@okaxis", "1,500", DAY + 2 * HOUR, "G Pay"),
    mk(
      "received",
      "≋ S 檽onu ≋ 👤",
      "91670 12884",
      "100",
      2 * DAY + 3 * HOUR,
      "G Pay",
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=200&q=80"
    ),
    mk("received", "Ankit Library", "ankitlibrary@ybl", "200", 10 * DAY, "SBI ••1920"),
    mk("paid", "Mr Mohammad Makabul", "94141 20338", "140", 10 * DAY + 2 * HOUR, "SBI ••1920"),
    mk("paid", "Bhageerath Singh", "99286 71150", "60", 10 * DAY + 5 * HOUR, "SBI ••1920"),
    mk("received", "Mayank Meena", "XXXXXXXX4411", "10", 10 * DAY + 7 * HOUR, "SBI ••1920"),
    mk("received", "Kamla Devi", "kamladevi@okhdfcbank", "200", 12 * DAY, "G Pay"),
    mk("paid", "Sharma Kirana Store", "sharmakirana@okaxis", "230", 34 * DAY, "SBI ••1920"),
    mk("received", "Patan Pharmacy", "patanpharma@ybl", "120", 41 * DAY, "SBI ••1920"),
  ];
}

function readBalance(): number {
  try {
    const v = localStorage.getItem(BALANCE_KEY);
    if (v != null) {
      const n = Number(v);
      if (Number.isFinite(n)) return n;
    }
  } catch {
    /* ignore */
  }
  return 7540;
}

function writeBalance(n: number) {
  try {
    localStorage.setItem(BALANCE_KEY, String(n));
  } catch {
    /* ignore */
  }
}

/* ── Time helpers ─────────────────────────────────────────────────── */
export const formatINR = (n: number) =>
  n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function relTime(ts: number, now = Date.now()): string {
  const diff = now - ts;
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "Just now";
  if (min < 60) return `${min} min${min > 1 ? "s" : ""} ago`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  const d = new Date(ts);
  return `${d.getDate()} ${d.toLocaleDateString("en-GB", { month: "short" })}`;
}

export interface MonthGroup {
  label: string;
  items: Txn[];
}

export function groupByMonth(txns: Txn[]): MonthGroup[] {
  const groups: MonthGroup[] = [];
  let key = "";
  for (const t of txns) {
    const d = new Date(t.ts);
    const k = `${d.getFullYear()}-${d.getMonth()}`;
    if (k !== key) {
      key = k;
      groups.push({
        label: d.toLocaleDateString("en-GB", { month: "long", year: "numeric" }),
        items: [],
      });
    }
    groups[groups.length - 1].items.push(t);
  }
  return groups;
}

export function fullStamp(ts: number) {
  const d = new Date(ts);
  return {
    time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
    date: d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
  };
}

export function liveDateParts() {
  return fullStamp(Date.now());
}

/* ── Context ──────────────────────────────────────────────────────── */
interface WalletCtx {
  balance: number;
  transactions: Txn[];
  ready: boolean;
  toast: string | null;
  addTxn: (t: {
    type: "sent" | "received";
    name: string;
    sub: string;
    amount: number;
    amountStr: string;
    bank?: Bank;
    live?: boolean;
    note?: string;
    category?: string;
    metadata?: Record<string, unknown>;
  }) => Txn;
  softDelete: (id: string) => Promise<void>;
  reload: () => Promise<void>;
}

const WalletContext = createContext<WalletCtx | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(readBalance);
  const [transactions, setTransactions] = useState<Txn[]>([]);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2800);
  }, []);

  const reload = useCallback(async () => {
    const rows = await listAllTransactions(false);
    setTransactions(rows.map((r) => recordToTxn(r)));
  }, []);

  // Boot: flush retry queue → seed if empty → load ledger
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await flushRetryQueue();
        await seedIfEmpty(seedNewTxns());
        if (cancelled) return;
        await reload();
      } catch (e) {
        console.warn("[wallet] boot ledger failed", e);
        showToast("History storage unavailable — using session only");
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reload, showToast]);

  const addTxn = useCallback<WalletCtx["addTxn"]>(
    (t) => {
      if (!(t.amount > 0)) {
        throw new Error("Amount must be positive");
      }
      const iso = new Date().toISOString();
      const ref = rnd(12);
      const id = `TXN-${iso.slice(0, 10).replace(/-/g, "")}-${rnd(6).toUpperCase()}`;
      const source =
        t.bank === "gpay" || t.type === "received" ? (t.bank === "gpay" ? "G Pay" : "SBI ••1920") : "SBI ••1920";

      // Optimistic UI row (instant success screen)
      const optimistic: Txn = {
        id,
        type: t.type,
        name: t.name,
        sub: t.sub,
        amount: t.amount,
        amountStr: t.amountStr,
        ts: Date.now(),
        bank: t.bank ?? (t.type === "sent" ? "sbi" : "gpay"),
        txnId: id,
        utr: ref,
        live: t.live,
        note: t.note ?? null,
        status: "success",
        paymentMethod: "upi",
        sourceAccount: source,
        dateTimeIso: iso,
      };

      setTransactions((prev) => [optimistic, ...prev]);
      setBalance((b) => {
        const next = t.type === "sent" ? b - t.amount : b + t.amount;
        writeBalance(next);
        return next;
      });

      // Permanent durable write — same moment as success chime / screen
      const payload: NewTransaction = {
        id,
        type: t.type === "sent" ? "paid" : "received",
        amount: t.amount,
        amountStr: t.amountStr,
        currency: "INR",
        counterparty_name: t.name,
        counterparty_upi: t.sub || null,
        counterparty_avatar: null,
        source_account: source,
        source_account_logo: null,
        destination_account: t.type === "sent" ? t.sub : "SBI ••1920",
        transaction_ref: ref,
        payment_method: "upi",
        date_time: iso,
        note: t.note ?? null,
        category: t.category ?? "transfer",
        metadata: JSON.stringify({
          appVersion: "1.0.0",
          device: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 120) : "web",
          ...t.metadata,
        }),
        status: "success",
      };

      void insertTransactionDurable(payload, showToast).then((saved) => {
        if (saved && saved.id !== optimistic.id) {
          // reconcile if DB assigned different identity (shouldn't with our id)
          setTransactions((prev) =>
            prev.map((row) => (row.id === optimistic.id ? recordToTxn(saved, true) : row))
          );
        }
      });

      return optimistic;
    },
    [showToast]
  );

  const softDelete = useCallback(
    async (id: string) => {
      await softDeleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      showToast("Transaction removed from history");
    },
    [showToast]
  );

  const value = useMemo(
    () => ({ balance, transactions, ready, toast, addTxn, softDelete, reload }),
    [balance, transactions, ready, toast, addTxn, softDelete, reload]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used inside WalletProvider");
  return ctx;
}
