import { useState } from "react";
import { Backspace, Check, SBIKeyhole, UPILogo } from "../components/Icons";
import { primeAudio } from "../utils/sound";

interface Props {
  amount: string;
  name: string;
  onSubmit: (pin: string) => void;
}

export default function PinScreen({ amount, name, onSubmit }: Props) {
  const [pin, setPin] = useState("");
  const [shaking, setShaking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const twoDec = Number(amount).toFixed(2);

  const fire = () => {
    if (submitting || shaking || pin.length !== 6) return;
    if (pin === "000000") {
      setShaking(true);
      navigator.vibrate?.([90, 60, 90]);
      setTimeout(() => {
        setPin("");
        setShaking(false);
      }, 620);
      return;
    }
    setSubmitting(true);
    primeAudio();
    onSubmit(pin);
  };

  // NO auto-submit — only fire on checkmark button press
  const press = (v: string) => {
    if (submitting || shaking) return;
    if (v === "back") setPin((p) => p.slice(0, -1));
    else if (v === "ok") fire();
    else if (pin.length < 6) setPin((p) => p + v);
  };

  const Key = ({ label, onClick }: { label: React.ReactNode; onClick: () => void }) => (
    <button
      onClick={onClick}
      className="flex h-16 w-full items-center justify-center text-[40px] font-medium text-[#0022aa] transition active:bg-[#c9c9c9]/50"
    >
      {label}
    </button>
  );

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="bg-white px-4 pt-1.5">
        <div className="flex items-center gap-3">
          <SBIKeyhole className="h-9 w-9 shrink-0" />
          <h2 className="text-[17px] leading-tight font-semibold text-[#1a1a2e]">
            State Bank of India
            <br />
            XXXX1920
          </h2>
          <UPILogo className="ml-auto mt-0.5 h-9 w-20 shrink-0" />
        </div>

        <div className="-mx-4 mt-1.5 bg-[#e8e8e8] px-4 py-1.5">
          <div className="flex items-center justify-between text-[14px]">
            <span className="text-slate-500">To:</span>
            <span className="max-w-[190px] truncate text-right font-semibold text-[#1a1a2e]">
              {name.length > 10 ? `${name.slice(0, 10)}…` : name}
            </span>
          </div>
          <div className="mt-0.5 flex items-center justify-between text-[14px]">
            <span className="text-slate-500">Sending:</span>
            <span className="font-semibold text-[#1a1a2e] tabular-nums">₹{twoDec}</span>
          </div>
        </div>

        <p className="mt-2.5 text-center text-[14px] tracking-[1px] text-[#1a1a2e]">
          ENTER 6-DIGIT UPI PIN
        </p>
      </div>

      <div className="flex-1 bg-white px-6">
        {/* 6 PIN dots — fill as user types */}
        <div className={`mx-auto mt-7 flex max-w-[260px] justify-between ${shaking ? "shake" : ""}`}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex h-10 w-10 items-center justify-center"
            >
              {i < pin.length ? (
                <div className="h-4 w-4 rounded-full bg-[#0022aa] transition-transform scale-100 animate-[pop_200ms_ease]" />
              ) : (
                <div className="h-0.5 w-8 rounded bg-[#c0c0c0]" />
              )}
            </div>
          ))}
        </div>

        <div className="mx-auto mt-8 flex max-w-[320px] items-center gap-3 rounded-xl bg-[#f5e6b8] p-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e8920c]">
            <span className="text-lg font-bold text-white">!</span>
          </div>
          <p className="flex-1 text-center text-[13px] leading-snug font-semibold text-[#4a4a4a]">
            You are transferring money from your State Bank Of India account to {name}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-px bg-[#cfcfcf]">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((n) => (
          <div key={n} className="bg-[#e0e0e0]">
            <Key label={n} onClick={() => press(n)} />
          </div>
        ))}
        <div className="bg-[#e0e0e0]">
          <button
            onClick={() => press("back")}
            aria-label="Delete"
            className="flex h-[60px] w-full items-center justify-center transition active:bg-[#c9c9c9]/50"
          >
            <Backspace className="h-7 w-9" />
          </button>
        </div>
        <div className="bg-[#e0e0e0]">
          <Key label="0" onClick={() => press("0")} />
        </div>
        <div className="bg-[#e0e0e0]">
          <button
            onClick={() => press("ok")}
            disabled={submitting || pin.length !== 6}
            aria-label="Submit PIN"
            className="flex h-[60px] w-full items-center justify-center transition active:bg-[#c9c9c9]/50"
          >
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-full transition ${
                pin.length === 6 ? "bg-[#0022aa]" : "bg-[#0022aa]/30"
              }`}
            >
              <Check className="h-6 w-6 text-white" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
