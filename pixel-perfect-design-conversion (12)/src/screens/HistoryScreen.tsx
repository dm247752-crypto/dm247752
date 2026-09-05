import { useEffect, useMemo, useState } from "react";
import { Download, QuestionCircle, Search, Sliders } from "../components/Icons";
import BottomSheet from "../components/BottomSheet";
import TxnRow from "../components/TxnRow";
import { groupByMonth, useWallet, type Txn } from "../store/WalletContext";

interface Props {
  onOpen: (t: Txn) => void;
  onContact: (t: Txn) => void;
}

type TypeFilter = "all" | "sent" | "received";

export default function HistoryScreen({ onOpen, onContact }: Props) {
  const { transactions, softDelete, toast } = useWallet();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [menuTxn, setMenuTxn] = useState<Txn | null>(null);
  const [page, setPage] = useState(1);
  const [, setTick] = useState(0);
  const PAGE = 50;

  // Keep relative timestamps ("X mins ago") live.
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(i);
  }, []);

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (typeFilter !== "all" && t.type !== typeFilter) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.sub.toLowerCase().includes(q) ||
        t.amountStr.includes(q) ||
        t.utr.includes(q) ||
        (t.note ?? "").toLowerCase().includes(q)
      );
    });
  }, [transactions, q, typeFilter]);

  const visible = filtered.slice(0, page * PAGE);
  const groups = groupByMonth(visible);
  const hasMore = visible.length < filtered.length;

  const exportStatements = () => {
    const header = "id,type,name,upi,amount,currency,ref,status,date_time,source\n";
    const rows = filtered
      .map((t) =>
        [
          t.id,
          t.type,
          JSON.stringify(t.name),
          JSON.stringify(t.sub),
          t.amount,
          "INR",
          t.utr,
          t.status ?? "success",
          t.dateTimeIso ?? new Date(t.ts).toISOString(),
          JSON.stringify(t.sourceAccount ?? ""),
        ].join(",")
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `phonepe-statements-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const confirmDelete = async () => {
    if (!menuTxn) return;
    const ok = window.confirm(
      "Delete this transaction from history?\n\nThis is a soft-delete (recoverable in DB). Confirm to continue."
    );
    if (!ok) return;
    await softDelete(menuTxn.id);
    setMenuTxn(null);
  };

  const copyRef = async () => {
    if (!menuTxn) return;
    await navigator.clipboard?.writeText(menuTxn.utr);
    setMenuTxn(null);
  };

  return (
    <div className="relative flex h-full flex-col bg-[#0d0d12]">
      {/* Top-right help */}
      <div className="flex items-center justify-end px-4 pt-3">
        <button className="rounded-full p-1.5 text-white/80 transition hover:bg-white/5" aria-label="Help">
          <QuestionCircle className="h-6 w-6" />
        </button>
      </div>

      {/* Title + My Statements */}
      <div className="flex items-center justify-between px-4 pb-4">
        <h1 className="text-[24px] font-bold text-white">History</h1>
        <button
          onClick={exportStatements}
          className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-white/5 active:scale-95"
        >
          <Download className="h-4 w-4" />
          My Statements
        </button>
      </div>

      {/* Search & filter bar */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-3 rounded-full bg-[#1c1c24] px-4 py-3 transition focus-within:ring-1 focus-within:ring-[#9d4edd]/50">
          <Search className="h-5 w-5 shrink-0 text-white/50" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search name, amount, UTR, note…"
            className="w-full bg-transparent text-[14px] text-white outline-none placeholder:text-white/50"
          />
          <div className="h-5 w-px shrink-0 bg-white/15" />
          <button onClick={() => setFilterOpen(true)} aria-label="Filters" className="text-white/60 transition hover:text-white">
            <Sliders className="h-5 w-5" />
          </button>
        </div>
        {typeFilter !== "all" && (
          <div className="mt-2 flex items-center gap-2">
            <span className="rounded-full bg-[#9d4edd]/20 px-3 py-1 text-[11px] font-semibold text-[#c4b5fd]">
              {typeFilter === "sent" ? "Paid only" : "Received only"}
            </span>
            <button
              onClick={() => setTypeFilter("all")}
              className="text-[11px] font-semibold text-white/50 underline"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Scrollable, month-grouped list */}
      <div
        className="no-scrollbar flex-1 overflow-y-auto"
        onScroll={(e) => {
          const el = e.currentTarget;
          if (el.scrollTop + el.clientHeight >= el.scrollHeight - 80 && hasMore) {
            setPage((p) => p + 1);
          }
        }}
      >
        {groups.map((g) => (
          <section key={g.label}>
            <div className="sticky top-0 z-[1] bg-[#17171a] px-4 py-3">
              <span className="text-[15px] font-medium text-white/80">{g.label}</span>
            </div>
            <div className="divide-y divide-white/5">
              {g.items.map((t) => (
                <div
                  key={t.id}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setMenuTxn(t);
                  }}
                  onTouchStart={(e) => {
                    const target = e.currentTarget;
                    const timer = window.setTimeout(() => setMenuTxn(t), 480);
                    const clear = () => {
                      window.clearTimeout(timer);
                      target.removeEventListener("touchend", clear);
                      target.removeEventListener("touchmove", clear);
                    };
                    target.addEventListener("touchend", clear);
                    target.addEventListener("touchmove", clear);
                  }}
                >
                  <TxnRow txn={t} onOpen={onOpen} onContact={onContact} />
                </div>
              ))}
            </div>
          </section>
        ))}
        {filtered.length === 0 && (
          <p className="px-4 py-12 text-center text-[13px] text-white/40">
            {q ? `No transactions match “${query}”` : "No transactions yet"}
          </p>
        )}
        {hasMore && (
          <button
            onClick={() => setPage((p) => p + 1)}
            className="mx-auto my-4 block rounded-full bg-white/5 px-4 py-2 text-[12px] font-semibold text-white/70"
          >
            Load more
          </button>
        )}
        <div className="pb-4" />
      </div>

      {/* Filter sheet */}
      <BottomSheet open={filterOpen} onClose={() => setFilterOpen(false)} title="Filter">
        <div className="space-y-2 px-4 pt-3 pb-2">
          {(
            [
              ["all", "All transactions"],
              ["sent", "Paid to"],
              ["received", "Received from"],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              onClick={() => {
                setTypeFilter(k);
                setPage(1);
                setFilterOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-[14px] font-semibold transition ${
                typeFilter === k ? "bg-[#9d4edd]/25 text-white" : "bg-white/5 text-white/80 hover:bg-white/10"
              }`}
            >
              {label}
              {typeFilter === k && <span className="text-[#c4b5fd]">✓</span>}
            </button>
          ))}
        </div>
      </BottomSheet>

      {/* Long-press context menu */}
      <BottomSheet open={!!menuTxn} onClose={() => setMenuTxn(null)} title="Transaction">
        {menuTxn && (
          <div className="space-y-2 px-4 pt-2 pb-2">
            <p className="mb-2 truncate text-[13px] text-white/55">
              {menuTxn.name} · ₹{menuTxn.amountStr}
            </p>
            <button
              onClick={copyRef}
              className="w-full rounded-xl bg-white/5 px-4 py-3 text-left text-[14px] font-semibold text-white transition hover:bg-white/10"
            >
              Copy UPI Ref ({menuTxn.utr})
            </button>
            <button
              onClick={async () => {
                await navigator.clipboard?.writeText(
                  `${menuTxn.type === "sent" ? "Paid" : "Received"} ₹${menuTxn.amountStr} ${menuTxn.type === "sent" ? "to" : "from"} ${menuTxn.name}\nUTR: ${menuTxn.utr}`
                );
                setMenuTxn(null);
              }}
              className="w-full rounded-xl bg-white/5 px-4 py-3 text-left text-[14px] font-semibold text-white transition hover:bg-white/10"
            >
              Share
            </button>
            <button
              onClick={confirmDelete}
              className="w-full rounded-xl bg-red-500/15 px-4 py-3 text-left text-[14px] font-semibold text-red-300 transition hover:bg-red-500/25"
            >
              Delete (soft-delete, recoverable)
            </button>
          </div>
        )}
      </BottomSheet>

      {/* Toast from durable save retries */}
      {toast && (
        <div className="fade-in absolute bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#1c1c24] px-4 py-2 text-[12px] font-semibold text-white shadow-lg ring-1 ring-white/10">
          {toast}
        </div>
      )}
    </div>
  );
}
