import { useState } from "react";
import {
  ArrowRight,
  Backspace,
  Check,
  ChevronLeft,
  ChevronRight,
  IconGoldSave,
  IconWallet,
  QuestionCircle,
  SBIKeyhole,
  UPILogo,
} from "../components/Icons";
import { formatINR } from "../store/WalletContext";

export function CheckBalanceScreen({
  onBack,
  onBank,
}: {
  onBack: () => void;
  onBank: () => void;
}) {
  return (
    <div className="flex h-full flex-col bg-[#0b0b0d] text-white">
      <header className="flex h-12 items-center gap-2.5 px-3">
        <button
          onClick={onBack}
          aria-label="Back"
          className="flex h-8 w-8 items-center justify-center rounded-full transition active:bg-white/10"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-[17px] font-bold">Check Balance</h1>
        <QuestionCircle className="ml-auto h-5 w-5 text-white/85" />
      </header>

      <main className="flex-1 px-4 pt-2.5">
        <button className="relative flex h-20 w-full items-center overflow-hidden rounded-2xl bg-[#202024] px-4 text-left ring-1 ring-white/[0.06] transition active:scale-[0.99]">
          <div className="relative z-10 max-w-[72%]">
            <p className="text-[13px] font-bold text-white">Start saving in Gold at ₹10</p>
            <p className="mt-0.5 text-[11px] text-white/55">100% secure, easy to buy!</p>
            <span className="mt-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-slate-800">
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>
          <IconGoldSave className="absolute -right-1 bottom-0 h-20 w-20" />
        </button>

        <div className="mt-4 space-y-0.5">
          <button
            onClick={onBank}
            className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition hover:bg-white/[0.03] active:bg-white/[0.06]"
          >
            <SBIKeyhole className="h-9 w-9 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-medium">State Bank of India - 4416</p>
              <p className="text-[12px] text-white/55">Bank Account</p>
            </div>
            <ChevronRight className="h-4 w-4 text-white/50" />
          </button>

          <button className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition hover:bg-white/[0.03]">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#3d1a6b]">
              <IconWallet className="h-7 w-7" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-medium">PhonePe Wallet</p>
              <p className="text-[12px] text-white/55">Balance: ₹0</p>
              <p className="mt-0.5 text-[11px] text-emerald-400">% Earn up to 2% cashback</p>
            </div>
            <ChevronRight className="h-4 w-4 text-white/50" />
          </button>

          <button className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition hover:bg-white/[0.03]">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-300 text-[9px] font-bold text-white">
              RuPay
            </span>
            <p className="flex-1 text-[15px] font-medium">RuPay Credit Card</p>
            <span className="text-[12px] font-bold text-[#b66cff]">Link Now</span>
          </button>

          <button className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition hover:bg-white/[0.03]">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/60 text-[20px] font-light">
              +
            </span>
            <div className="flex-1">
              <p className="text-[15px] font-medium">Add new payment method</p>
              <p className="text-[11px] text-white/55">Bank Account, UPI Lite & more</p>
            </div>
            <ChevronRight className="h-4 w-4 text-white/50" />
          </button>
        </div>

        <div className="mt-3 rounded-2xl bg-gradient-to-r from-[#28103f] to-[#641347] px-4 py-3 ring-1 ring-white/[0.07]">
          <p className="text-[10px] font-semibold text-[#d9b7ff]">SECURE BANKING</p>
          <p className="mt-1 text-[14px] font-bold">Check balance safely, anytime</p>
          <p className="mt-0.5 text-[11px] text-white/60">Your UPI PIN stays private and encrypted.</p>
        </div>
      </main>
    </div>
  );
}

export function BalancePinScreen({
  onBack,
  onVerified,
}: {
  onBack: () => void;
  onVerified: () => void;
}) {
  const [pin, setPin] = useState("");
  const [shaking, setShaking] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = () => {
    if (pin.length !== 6 || submitting || shaking) return;
    if (pin === "000000") {
      setShaking(true);
      navigator.vibrate?.([80, 50, 80]);
      setTimeout(() => {
        setPin("");
        setShaking(false);
      }, 600);
      return;
    }
    setSubmitting(true);
    onVerified();
  };

  const press = (key: string) => {
    if (submitting || shaking) return;
    if (key === "back") setPin((p) => p.slice(0, -1));
    else if (key === "ok") submit();
    else if (pin.length < 6) setPin((p) => p + key);
  };

  return (
    <div className="flex h-full flex-col bg-white text-[#11152b]">
      <div className="px-4 pt-1.5">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="-ml-2 flex h-8 w-8 items-center justify-center rounded-full active:bg-slate-100">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <SBIKeyhole className="h-8 w-8" />
          <div>
            <p className="text-[15px] font-semibold">State Bank of India</p>
            <p className="text-[13px]">XXXX4416</p>
          </div>
          <UPILogo className="ml-auto h-8 w-20" />
        </div>
        <div className="-mx-4 mt-1.5 bg-[#e8e8e8] px-4 py-1.5">
          <div className="flex justify-between text-[13px]">
            <span className="text-slate-500">Request:</span>
            <span className="font-semibold">Check Account Balance</span>
          </div>
        </div>
        <p className="mt-2.5 text-center text-[14px] tracking-[1px]">ENTER 6-DIGIT UPI PIN</p>
      </div>

      <div className="flex-1 px-6">
        <div className={`mx-auto mt-7 flex max-w-[260px] justify-between ${shaking ? "shake" : ""}`}>
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="flex h-9 w-9 items-center justify-center">
              {i < pin.length ? (
                <span className="h-4 w-4 rounded-full bg-[#0022aa]" />
              ) : (
                <span className="h-0.5 w-8 rounded bg-[#bfc2c8]" />
              )}
            </span>
          ))}
        </div>

        <div className="mx-auto mt-8 flex max-w-[310px] items-center gap-2.5 rounded-xl bg-[#f5e6b8] p-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e8920c] font-bold text-white">!</span>
          <p className="text-center text-[12px] font-semibold leading-snug text-[#4a4a4a]">
            Enter your UPI PIN to securely check your State Bank of India account balance
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-px bg-[#cfcfcf]">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((n) => (
          <button
            key={n}
            onClick={() => press(n)}
            className="flex h-[58px] items-center justify-center bg-[#e0e0e0] text-[34px] font-medium text-[#0022aa] active:bg-[#c9c9c9]"
          >
            {n}
          </button>
        ))}
        <button onClick={() => press("back")} className="flex h-[58px] items-center justify-center bg-[#e0e0e0]">
          <Backspace className="h-7 w-9" />
        </button>
        <button onClick={() => press("0")} className="flex h-[58px] items-center justify-center bg-[#e0e0e0] text-[34px] text-[#0022aa]">
          0
        </button>
        <button
          onClick={() => press("ok")}
          disabled={pin.length !== 6 || submitting}
          className="flex h-[58px] items-center justify-center bg-[#e0e0e0]"
        >
          <span className={`flex h-12 w-12 items-center justify-center rounded-full ${pin.length === 6 ? "bg-[#0022aa]" : "bg-[#0022aa]/30"}`}>
            <Check className="h-6 w-6 text-white" />
          </span>
        </button>
      </div>
    </div>
  );
}

export function BalanceSuccessScreen({
  balance,
  onDone,
}: {
  balance: number;
  onDone: () => void;
}) {
  return (
    <div className="flex h-full flex-col bg-[#0b0b0d]">
      <div className="flex flex-col items-center bg-[#1f7a3a] px-4 pt-8 pb-8 text-center">
        <div className="pop flex h-16 w-16 items-center justify-center rounded-full bg-white">
          <Check className="h-9 w-9 text-[#1f7a3a]" strokeWidth={3.2} />
        </div>
        <h1 className="mt-3 text-[18px] font-bold text-white">Balance Checked Successfully</h1>
        <p className="mt-1 text-[12px] text-white/75">State Bank of India ••••4416</p>
      </div>

      <main className="flex-1 px-4 pt-4">
        <section className="rounded-2xl bg-[#19191d] px-4 py-5 text-center ring-1 ring-white/[0.07]">
          <div className="mx-auto flex w-fit items-center gap-2">
            <SBIKeyhole className="h-8 w-8" />
            <span className="text-[13px] font-medium text-white/70">Available Balance</span>
          </div>
          <p className="mt-2 text-[31px] font-bold tracking-tight text-white tabular-nums">₹{formatINR(balance)}</p>
          <p className="mt-1 text-[11px] text-white/40">Updated just now</p>
        </section>

        <section className="relative mt-4 overflow-hidden rounded-2xl bg-gradient-to-r from-[#280b48] via-[#5a1768] to-[#9d2959] px-4 py-5">
          <div className="relative z-10 max-w-[62%]">
            <span className="rounded bg-white/10 px-2 py-1 text-[10px] font-semibold text-[#f6d5ff]">DAILY SAVINGS</span>
            <h2 className="mt-2 text-[20px] leading-tight font-bold text-[#ffd166]">Save ₹10 every day</h2>
            <p className="mt-1 text-[12px] text-white/75">Grow your savings in 24K Gold</p>
            <button className="mt-3 rounded-full bg-[#ffd166] px-4 py-2 text-[11px] font-bold text-[#3a2200]">Start Saving</button>
          </div>
          <IconGoldSave className="absolute -right-2 bottom-1 h-36 w-36" />
        </section>
      </main>

      <button onClick={onDone} className="mx-4 mb-4 h-12 rounded-xl bg-[#9d4edd] text-[14px] font-bold text-white active:scale-[0.99]">
        DONE
      </button>
    </div>
  );
}