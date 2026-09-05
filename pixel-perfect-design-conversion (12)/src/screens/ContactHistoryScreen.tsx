import { ChevronLeft } from "../components/Icons";
import TxnRow from "../components/TxnRow";
import { groupByMonth, useWallet, type Txn } from "../store/WalletContext";

interface Props {
  /** Any txn of the chosen contact — carries name, sub and avatar. */
  contact: Txn;
  onBack: () => void;
  onOpen: (t: Txn) => void;
  onContact: (t: Txn) => void;
}

/** SCREEN 2 — all past transactions with one specific contact, newest first. */
export default function ContactHistoryScreen({ contact, onBack, onOpen, onContact }: Props) {
  const { transactions } = useWallet();
  const txns = transactions.filter((t) => t.name === contact.name);
  const groups = groupByMonth(txns);
  const sentTotal = txns.filter((t) => t.type === "sent").reduce((s, t) => s + t.amount, 0);
  const recTotal = txns.filter((t) => t.type === "received").reduce((s, t) => s + t.amount, 0);

  return (
    <div className="flex h-full flex-col bg-[#0d0d12]">
      {/* Header */}
      <div className="flex items-center gap-3 px-3 pt-3 pb-3">
        <button
          onClick={onBack}
          aria-label="Back"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition hover:bg-white/10 active:scale-95"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#7b2d8e] text-[16px] font-bold text-white">
          <span>{contact.name.charAt(0).toUpperCase()}</span>
          {contact.avatar && (
            <img
              src={contact.avatar}
              alt={contact.name}
              className="absolute inset-0 h-full w-full rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}
        </span>
        <div className="min-w-0">
          <h1 className="truncate text-[17px] font-bold text-white">{contact.name}</h1>
          <p className="truncate text-[12px] text-white/55">{contact.sub}</p>
        </div>
      </div>

      {/* Summary chips */}
      <div className="mx-4 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-[#1c1c24] px-3.5 py-2.5">
          <p className="text-[11px] text-white/50">You sent</p>
          <p className="text-[15px] font-bold text-white tabular-nums">
            ₹{sentTotal.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="rounded-xl bg-[#1c1c24] px-3.5 py-2.5">
          <p className="text-[11px] text-white/50">You received</p>
          <p className="text-[15px] font-bold text-[#4ade80] tabular-nums">
            + ₹{recTotal.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Chronological list */}
      <div className="no-scrollbar mt-2 flex-1 overflow-y-auto">
        {groups.map((g) => (
          <section key={g.label}>
            <div className="bg-[#17171a] px-4 py-3">
              <span className="text-[15px] font-medium text-white/80">{g.label}</span>
            </div>
            <div className="divide-y divide-white/5">
              {g.items.map((t) => (
                <TxnRow key={t.id} txn={t} onOpen={onOpen} onContact={onContact} />
              ))}
            </div>
          </section>
        ))}
        {txns.length === 0 && (
          <p className="px-4 py-12 text-center text-[13px] text-white/40">
            No transactions with {contact.name} yet.
          </p>
        )}
        <div className="pb-4" />
      </div>
    </div>
  );
}
