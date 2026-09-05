import BottomSheet from "./BottomSheet";
import { SBILogo, WalletPlus } from "./Icons";
import { formatINR, relTime, useWallet } from "../store/WalletContext";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CheckBalanceSheet({ open, onClose }: Props) {
  const { balance, transactions, addTxn } = useWallet();

  const addMoney = (n: number) => {
    addTxn({
      type: "received",
      name: "Card •••• 4421",
      sub: "Money added to SBI ••••1920",
      amount: n,
      amountStr: String(n),
      bank: "sbi",
      live: true,
    });
  };

  return (
    <BottomSheet open={open} onClose={onClose} title="Check Balance">
      <div className="px-4 pt-2">
        {/* Account row */}
        <div className="flex items-center gap-3 rounded-2xl bg-[#1e1e22] p-3.5">
          <SBILogo className="h-10 w-10" />
          <div className="flex-1">
            <p className="text-[14px] font-bold text-white">State Bank of India</p>
            <p className="text-[12px] text-white/55">Savings Account ••••1920</p>
          </div>
          <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold text-emerald-400">
            Active
          </span>
        </div>

        {/* Balance */}
        <div className="mt-4 text-center">
          <p className="text-[11px] font-semibold tracking-widest text-white/45 uppercase">
            Available Balance
          </p>
          <p className="mt-1 text-[36px] font-bold tracking-tight text-white tabular-nums">
            ₹{formatINR(balance)}
          </p>
          <p className="mt-1 text-[11px] text-white/45">
            IFSC: SBIN0001920 · Updated just now
          </p>
        </div>

        {/* Add money */}
        <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#1e1e22] p-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#8b1abf]">
              <WalletPlus className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-white">Add Money</p>
              <p className="text-[11px] text-white/45">Card •••• 4421</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            {[100, 500, 1000].map((n) => (
              <button
                key={n}
                onClick={() => addMoney(n)}
                className="rounded-full bg-white/5 px-3 py-1.5 text-[11px] font-bold text-[#b39ddb] transition hover:bg-white/10 active:scale-95"
              >
                +{n.toLocaleString("en-IN")}
              </button>
            ))}
          </div>
        </div>

        {/* Recent */}
        <p className="mt-5 mb-2 text-[11px] font-semibold tracking-widest text-white/45 uppercase">
          Recent Activity
        </p>
        <div className="divide-y divide-white/5 rounded-2xl bg-[#1e1e22]">
          {transactions.slice(0, 3).map((t) => (
            <div key={t.id} className="flex items-center gap-3 px-3.5 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-white">{t.name}</p>
                <p className="text-[11px] text-white/45">{relTime(t.ts)}</p>
              </div>
              <span
                className={`text-[13px] font-bold tabular-nums ${t.type === "sent" ? "text-red-400" : "text-emerald-400"}`}
              >
                {t.type === "sent" ? "−" : "+"} ₹{t.amountStr}
              </span>
            </div>
          ))}
        </div>
      </div>
    </BottomSheet>
  );
}
