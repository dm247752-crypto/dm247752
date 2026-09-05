import { ArrowDownLeft, ArrowUpRight, GPayLogo, SBIKeyhole } from "./Icons";
import { relTime, type Txn } from "../store/WalletContext";

interface Props {
  txn: Txn;
  /** Tap on the row body → transaction details. */
  onOpen: (t: Txn) => void;
  /** Tap on the avatar/icon → that person's history. */
  onContact: (t: Txn) => void;
}

/** PhonePe-style transaction row with dynamic relative timestamp. */
export default function TxnRow({ txn, onOpen, onContact }: Props) {
  const sent = txn.type === "sent";
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(txn)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(txn);
        }
      }}
      className={`flex w-full cursor-pointer items-center gap-3 px-4 py-4 text-left transition hover:bg-white/[0.03] active:bg-white/[0.05] ${
        txn.live ? "fade-up" : ""
      }`}
    >
      {/* Left: avatar (photo) or arrow squircle */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onContact(txn);
        }}
        aria-label={`History with ${txn.name}`}
        className="shrink-0 transition active:scale-90"
      >
        {txn.avatar ? (
          /* Contact with photo → circular profile image (letter fallback) */
          <span className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-[#21212a] text-[16px] font-bold text-white">
            <span>{txn.name.charAt(0).toUpperCase()}</span>
            <img
              src={txn.avatar}
              alt={txn.name}
              className="absolute inset-0 h-full w-full rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </span>
        ) : (
          /* Arrow squircle — debit ↗ / credit ↙ */
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#21212a] text-white">
            {sent ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
          </span>
        )}
      </button>

      {/* Middle: tag / name / relative time */}
      <div className="min-w-0 flex-1">
        <p className="text-[12px] text-white/55">{sent ? "Paid to" : "Received from"}</p>
        <p className="truncate text-[16px] font-bold text-white">{txn.name}</p>
        <p className="mt-0.5 text-[12px] text-white/45">{relTime(txn.ts)}</p>
      </div>

      {/* Right: amount + bank indicator */}
      <div className="shrink-0 text-right">
        <p className={`text-[15px] font-bold whitespace-nowrap tabular-nums ${sent ? "text-white" : "text-[#4ade80]"}`}>
          {sent ? `₹${txn.amountStr}` : `+ ₹${txn.amountStr}`}
        </p>
        <div className="mt-0.5 flex items-center justify-end gap-1 text-[11px] text-white/50">
          <span>{sent ? "Debited from" : "Credited to"}</span>
          {txn.bank === "sbi" ? <SBIKeyhole className="h-4 w-4" /> : <GPayLogo className="h-3.5 w-10" />}
        </div>
      </div>
    </div>
  );
}
