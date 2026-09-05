import { useState } from "react";
import { ChevronLeft } from "../components/Icons";
import { formatINR, useWallet } from "../store/WalletContext";
import { resolveIdentity } from "../utils/upi";

interface Props {
  mode: "mobile" | "upi";
  onBack: () => void;
  /** Receives the EXACT amount string the user typed ("500" | "99.5" | "99.50"). */
  onConfirm: (name: string, sub: string, amountStr: string) => void;
}

export default function TransferForm({ mode, onBack, onConfirm }: Props) {
  const { balance } = useWallet();

  // UPI mode: free text fields
  const [manualName, setManualName] = useState("");
  const [manualUpi, setManualUpi] = useState("");

  // Mobile mode: only a 10-digit number
  const [phone, setPhone] = useState("");

  const [amount, setAmount] = useState("");

  // Preserve the user's exact input; only digits + a single optional decimal point.
  const sanitize = (v: string) => v.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1").slice(0, 10);
  const amt = Number(amount);
  const insufficient = amt > 0 && amt > balance;

  // Validation
  const valid =
    mode === "upi"
      ? manualName.trim().length > 0 && manualUpi.trim().length > 0 && amt > 0
      : /^\d{10}$/.test(phone.replace(/\s/g, "")) && amt > 0;

  const handlePay = () => {
    if (!valid || insufficient) return;

    if (mode === "upi") {
      onConfirm(manualName.trim(), manualUpi.trim(), amount);
    } else {
      // Mobile number mode — we still allow a resolved contact if the user typed a known number
      const resolved = resolveIdentity(phone);
      const name = resolved ? resolved.name : "Mobile User";
      const sub = phone.replace(/\s/g, "");
      onConfirm(name, sub, amount);
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#0b0b0d]">
      {/* Purple header */}
      <div className="bg-[#3d1a6b] px-4 pt-3 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/10 active:scale-95"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <span className="text-[19px] font-semibold text-white">
            {mode === "mobile" ? "To Mobile Number" : "To Bank & Self A/c"}
          </span>
        </div>
      </div>

      <div className="px-3 pt-4">
        {/* Identity input */}
        <div className="screen-in rounded-2xl bg-[#17171a] p-4">
          {mode === "upi" ? (
            <>
              <label className="text-[11px] font-semibold tracking-wide text-white/50 uppercase">
                Name
              </label>
              <input
                type="text"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                placeholder="Enter recipient name"
                className="mt-1.5 w-full bg-transparent text-[17px] font-medium text-white outline-none placeholder:text-white/30"
              />

              <label className="mt-4 block text-[11px] font-semibold tracking-wide text-white/50 uppercase">
                UPI ID / VPA
              </label>
              <input
                type="text"
                value={manualUpi}
                onChange={(e) => setManualUpi(e.target.value)}
                placeholder="e.g. name@bank"
                className="mt-1.5 w-full bg-transparent text-[17px] font-medium text-white outline-none placeholder:text-white/30"
              />
            </>
          ) : (
            <>
              <label className="text-[11px] font-semibold tracking-wide text-white/50 uppercase">
                Mobile number
              </label>
              <input
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="e.g. 9829012345"
                className="mt-1.5 w-full bg-transparent text-[17px] font-medium text-white outline-none placeholder:text-white/30"
              />
            </>
          )}

          {/* Amount */}
          <div className="mt-4">
            <label className="text-[11px] font-semibold tracking-wide text-white/50 uppercase">
              Amount
            </label>
            <div className="mt-1.5 focus-within:border-[#a06de0] flex items-center gap-2 rounded-xl border-2 border-[#8b1abf] bg-[#170d2c] px-3.5 py-3.5 transition">
              <span className="text-[20px] font-medium text-white">₹</span>
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(sanitize(e.target.value))}
                placeholder="0"
                className="w-full bg-transparent text-[20px] font-medium text-white outline-none placeholder:text-white/30"
              />
            </div>
          </div>
        </div>

        {/* Balance hint */}
        <p className="mt-3 text-[12px] text-white/50">
          Paying from SBI Savings ••••1920 · Balance ₹{formatINR(balance)}
        </p>
        {insufficient && (
          <p className="fade-in mt-1 text-[12px] font-semibold text-red-400">
            Insufficient balance — only ₹{formatINR(balance)} available
          </p>
        )}
      </div>

      <div className="flex-1" />

      {/* Pay button */}
      <button
        onClick={handlePay}
        disabled={!valid || insufficient}
        className={`py-5 text-center text-[15px] font-bold tracking-wide text-white transition ${
          valid && !insufficient
            ? "bg-[#b39ddb] text-[#1a0b2e] hover:bg-[#c1b0e2] active:scale-[0.99]"
            : "cursor-not-allowed bg-[#b39ddb]/40 text-white/60"
        }`}
      >
        CONFIRM & PAY
      </button>

      <div className="flex justify-center bg-black py-2">
        <div className="h-1 w-24 rounded-full bg-white/40" />
      </div>
    </div>
  );
}
