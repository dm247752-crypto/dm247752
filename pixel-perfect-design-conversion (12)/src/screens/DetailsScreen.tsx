import { useState } from "react";
import {
  AxisLogo,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  DocList,
  QuestionCircle,
  SBIAppLogo,
  Shield,
  UPILogo,
} from "../components/Icons";
import { fullStamp, type Txn } from "../store/WalletContext";

interface Props {
  /** Any transaction — fresh payment OR a past one opened from history. */
  txn: Txn;
  onBack: () => void;
  onSendAgain: (t: Txn) => void;
  onHistory: () => void;
}

const thin = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function SendAgainIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[19px] w-[19px] text-[#A78BFA]" {...thin}>
      <path d="M7 17L17 7" />
      <path d="M9.5 7H17v7.5" />
    </svg>
  );
}

function HistoryClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[19px] w-[19px] text-[#A78BFA]" {...thin}>
      <circle cx="12" cy="12" r="7.2" />
      <path d="M12 7.8v4.6l3 1.8" />
    </svg>
  );
}

function SplitExpenseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[19px] w-[19px] text-[#A78BFA]" {...thin}>
      <path d="M12 19v-8" />
      <path d="M12 11c-2.6 0-4-1.5-4-4" />
      <path d="M8 7 6.4 8.6" />
      <path d="M8 7l1.6 1.6" />
      <path d="M12 11c2.6 0 4-1.5 4-4" />
      <path d="M16 7l-1.6 1.6" />
      <path d="M16 7l1.6 1.6" />
    </svg>
  );
}

function ShareReceiptIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[19px] w-[19px] text-[#A78BFA]" {...thin}>
      <circle cx="7" cy="12" r="2" />
      <circle cx="17" cy="7" r="2" />
      <circle cx="17" cy="17" r="2" />
      <path d="M8.8 11.1l6.4-3.2" />
      <path d="M8.8 12.9l6.4 3.2" />
    </svg>
  );
}

function CopyThinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[17px] w-[17px] text-[#A78BFA]" {...thin}>
      <rect x="8" y="8" width="10" height="10" rx="2" />
      <path d="M6 15.5V6.8A1.8 1.8 0 0 1 7.8 5H16" />
    </svg>
  );
}

function makePhonePeTxnId(ts: number, ref: string) {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, "0");
  const dd = pad(d.getDate());
  const mm = pad(d.getMonth() + 1);
  const yy = String(d.getFullYear()).slice(-2);
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  const ss = pad(d.getSeconds());
  const tail = (ref.replace(/\D/g, "") + "0000000000").slice(0, 10);
  return `T${dd}${mm}${yy}${hh}${mi}${ss}${tail}`;
}

export default function DetailsScreen({ txn, onBack, onSendAgain, onHistory }: Props) {
  const [copied, setCopied] = useState<string | null>(null);
  const [stamp] = useState(() => fullStamp(txn.ts));
  const sent = txn.type === "sent";
  const phonePeTxnId = makePhonePeTxnId(txn.ts, txn.utr);

  const copy = (v: string, key: string) => {
    navigator.clipboard?.writeText(v);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const actions = [
    { icon: <SendAgainIcon />, label: "Send Again", go: () => onSendAgain(txn) },
    { icon: <HistoryClockIcon />, label: "View History", go: onHistory },
    { icon: <SplitExpenseIcon />, label: "Split Expense" },
    { icon: <ShareReceiptIcon />, label: "Share Receipt" },
  ];

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#0d0d0d]">
      {/* Forest green header */}
      <header className="shrink-0 bg-[#2f9138] px-3 pt-2 pb-2">
        <div className="flex items-start gap-1.5">
          <button
            onClick={onBack}
            aria-label="Back"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white transition hover:bg-white/10 active:scale-95"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
          </button>
          <div className="min-w-0">
            <h1 className="text-[17px] leading-tight font-bold text-white">Transaction Successful</h1>
            <p className="text-[11.5px] text-white/85">
              {stamp.time} on {stamp.date}
            </p>
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-3 py-1.5">
        {/* Details card */}
        <section className="shrink-0 rounded-2xl bg-[#171717] px-3.5 py-2 ring-1 ring-white/5">
          <p className="text-[13.5px] font-bold text-white/85">{sent ? "Paid to" : "Received from"}</p>
          <div className="mt-1.5 flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-[#a855f7] to-[#8b2fd6] text-[16px] font-bold text-white">
              {txn.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-[15px] font-medium text-white">{txn.name}</h2>
              <p className="truncate text-[12px] text-white/55">{txn.sub}</p>
            </div>
            <p className={`text-[15px] font-bold whitespace-nowrap tabular-nums ${sent ? "text-white" : "text-[#4ade80]"}`}>
              {sent ? `₹${txn.amountStr}` : `+ ₹${txn.amountStr}`}
            </p>
          </div>

          <div className="my-1.5 h-px bg-white/10" />

          <dl className="space-y-1 text-[12px]">
            <div className="flex items-center gap-2">
              <dt className="w-[92px] shrink-0 text-white/50">Banking Name</dt>
              <span className="text-white/50">:</span>
              <dd className="flex min-w-0 items-center gap-1.5 text-white">
                <span className="truncate">{txn.name}</span>
                <Shield className="h-3.5 w-3.5 shrink-0" />
              </dd>
            </div>
          </dl>

          <div className="my-1.5 h-px bg-white/10" />

          {/* Transfer Details (expandable) */}
          <details open className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between py-0.5">
              <span className="flex items-center gap-2.5 text-[15px] font-medium text-white">
                <DocList className="h-[18px] w-[18px] shrink-0 text-white/90" />
                Transfer Details
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-white/70 transition group-open:rotate-180" />
            </summary>

            <div className="mt-1.5 space-y-2">
              <div>
                <p className="text-[12px] text-white/60">PhonePe Transaction ID</p>
                <div className="mt-0.5 flex items-center justify-between gap-2">
                  <span className="min-w-0 break-all text-[13px] font-medium text-white">{phonePeTxnId}</span>
                  <button
                    onClick={() => copy(phonePeTxnId, "tx")}
                    aria-label="Copy Transaction ID"
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition hover:bg-white/5 active:scale-90"
                  >
                    {copied === "tx" ? (
                      <span className="text-[12px] font-bold text-emerald-400">✓</span>
                    ) : (
                      <CopyThinIcon />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <p className="text-[12px] text-white/60">{sent ? "Debited from" : "Credited to"}</p>
                <div className="mt-1 flex items-center gap-2.5">
                  <SBIAppLogo className="h-8 w-8 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[15.5px] font-medium text-white">XXXXXXXX9566</span>
                      <span className={`text-[15px] font-medium whitespace-nowrap tabular-nums ${sent ? "text-white" : "text-[#4ade80]"}`}>
                        {sent ? `₹${txn.amountStr}` : `+ ₹${txn.amountStr}`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[14px] text-white/55">UTR: {txn.utr}</span>
                      <button
                        onClick={() => copy(txn.utr, "utr")}
                        aria-label="Copy UTR"
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition hover:bg-white/5 active:scale-90"
                      >
                        {copied === "utr" ? (
                          <span className="text-[11px] font-bold text-emerald-400">✓</span>
                        ) : (
                          <CopyThinIcon />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </details>

          <div className="my-1.5 h-px bg-white/10" />

          {/* Action row */}
          <div className="grid grid-cols-4 gap-2 bg-[#0F0F13]/0">
            {actions.map((a) => (
              <button
                key={a.label}
                onClick={a.go}
                className="group flex flex-col items-center gap-1 py-0.5"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2E1B4D] transition group-hover:bg-[#37235a] group-active:scale-95">
                  {a.icon}
                </span>
                <span className="text-center text-[11px] font-medium leading-tight text-[#C9C9D1]">
                  {a.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Support bar */}
        <button className="mt-1.5 flex h-10 w-full shrink-0 items-center gap-2.5 rounded-xl bg-[#171717] px-3.5 ring-1 ring-white/5 transition hover:bg-[#1f1f1f] active:scale-[0.99]">
          <QuestionCircle className="h-[18px] w-[18px] shrink-0 text-white" />
          <span className="text-[13px] font-medium text-white">Contact PhonePe Support</span>
          <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-white/50" />
        </button>

        {/* Powered by */}
        <footer className="mt-auto flex shrink-0 flex-col items-center gap-0.5 pt-1.5 pb-0.5">
          <span className="text-[10px] text-white/50">Powered by</span>
          <div className="flex items-center gap-2.5">
            <UPILogo className="h-5 w-12" />
            <AxisLogo className="h-3.5 w-18" />
          </div>
        </footer>
      </div>
    </div>
  );
}
