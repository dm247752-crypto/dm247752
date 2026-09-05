import { useEffect, useRef, useState } from "react";
import { Check, ChevronLeft, Close, QuestionCircle, SBIKeyhole, UPILogo } from "../components/Icons";
import type { Merchant } from "../utils/upi";

interface Props {
  merchant: Merchant;
  onBack: () => void;
  /** Receives the EXACT amount string the user typed ("500" | "99.5" | "99.50"). */
  onConfirm: (amountStr: string) => void;
  /** Amount pre-filled from a scanned QR (upi://…&am=…); empty = user types. */
  initialAmount?: string;
}

/**
 * SCREEN 1 — "Pay" screen (shown right after QR scan) + SCREEN 1b — bottom sheet.
 * Amount is displayed exactly as the user typed it (no forced decimals here).
 */
export default function MerchantCheckout({ merchant, onBack, onConfirm, initialAmount }: Props) {
  const [amount, setAmount] = useState(initialAmount ?? "");
  const [message, setMessage] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const amountRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef(false);

  // Digits + a single dot, max 2 decimal places; third decimal digit is rejected.
  const sanitize = (v: string) => {
    let s = v.replace(/[^0-9.]/g, "");
    const i = s.indexOf(".");
    if (i !== -1) s = s.slice(0, i) + "." + s.slice(i + 1).replace(/\./g, "").slice(0, 2);
    return s.slice(0, 10);
  };

  const amt = Number(amount);
  const valid = amt > 0;

  // Auto-focus the amount field so the numeric keyboard opens right after the scan.
  useEffect(() => {
    const t = setTimeout(() => amountRef.current?.focus(), 300);
    return () => clearTimeout(t);
  }, []);

  const openSheet = () => {
    if (valid) setSheetOpen(true);
  };

  const confirm = () => {
    if (!valid || submitRef.current) return; // double-tap guard
    submitRef.current = true;
    onConfirm(amount);
  };

  return (
    <div className="relative flex h-full flex-col bg-[#0d0618]">
      {/* ── Top app bar ─────────────────────────────────── */}
      <div className="flex h-14 shrink-0 items-center gap-3 bg-[#3b1a5e] px-4">
        <button
          onClick={onBack}
          aria-label="Back"
          className="flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/10 active:scale-95"
        >
          <ChevronLeft className="h-7 w-7" strokeWidth={2.4} />
        </button>
        <span className="text-[22px] font-bold text-white">Pay</span>
        <button
          aria-label="Help"
          className="ml-auto flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/10"
        >
          <QuestionCircle className="h-6 w-6" />
        </button>
      </div>

      {/* ── Recipient card ──────────────────────────────── */}
      <div className="px-3 pt-3">
        <div className="rounded-2xl border border-[#2a1a40] bg-[#1c1030] p-4">
          {/* Row 1: recipient */}
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#7b2d8e] text-[22px] font-bold text-white">
              {merchant.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h3 className="text-[18px] font-bold text-white">{merchant.name}</h3>
              <p className="truncate text-[14px] text-[#a0a0b0]">{merchant.sub}</p>
            </div>
          </div>

          {/* Row 2: amount (tap-to-focus, numeric keyboard) */}
          <div className="mt-4 flex items-center gap-2 rounded-xl border-2 border-[#9d4edd] px-3.5 py-3.5">
            <span className="text-[22px] text-white">₹</span>
            <input
              ref={amountRef}
              type="text"
              inputMode="decimal"
              autoFocus
              value={amount}
              onChange={(e) => setAmount(sanitize(e.target.value))}
              placeholder="0"
              className="w-full bg-transparent text-[22px] text-white caret-white outline-none placeholder:text-white/40"
            />
          </div>

          {/* Row 3: message (QWERTY keyboard) */}
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a message (optional)"
            className="mt-2.5 w-full rounded-xl border border-[#4a2a6a] bg-transparent px-3.5 py-3 text-[14px] text-white caret-[#9d4edd] outline-none placeholder:text-[#6a5a7a]"
          />
        </div>
      </div>

      <div className="flex-1" />

      {/* ── PROCEED TO PAY (fixed) ──────────────────────── */}
      <button
        onClick={openSheet}
        disabled={!valid}
        className={`h-16 shrink-0 text-[16px] font-bold tracking-[1px] text-white transition active:scale-[0.99] ${
          valid ? "bg-[#9d4edd] hover:brightness-110" : "cursor-not-allowed bg-[#9d4edd]/40"
        }`}
      >
        PROCEED TO PAY
      </button>

      <div className="flex justify-center bg-black py-2">
        <div className="h-1 w-24 rounded-full bg-white/40" />
      </div>

      {/* ══ SCREEN 1b — BOTTOM SHEET ═════════════════════ */}
      {sheetOpen && (
        <div className="absolute inset-0 z-40">
          <div className="fade-in absolute inset-0 bg-black/60" onClick={() => setSheetOpen(false)} />
          <div className="sheet-up absolute inset-x-0 bottom-0 rounded-t-2xl bg-[#1c1030]">
            <div className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-white/20" />

            {/* Row 1 */}
            <div className="flex items-center justify-between px-4 pt-2">
              <span className="text-[18px] text-white">Total Payable</span>
              <div className="flex items-center gap-2">
                <span className="text-[28px] font-bold text-white tabular-nums">₹{amount}</span>
                <button
                  onClick={() => setSheetOpen(false)}
                  aria-label="Close"
                  className="flex h-7 w-7 items-center justify-center text-white/80 transition hover:text-white"
                >
                  <Close className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="my-3 h-px bg-[#2a1a40]" />

            {/* Row 2: bank account card */}
            <div className="mx-3 rounded-xl bg-[#2a1a40] p-3">
              <div className="flex items-center gap-3">
                <SBIKeyhole className="h-10 w-10 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[16px] font-medium text-white">State Bank Of India - 1920</p>
                  <p className="mt-0.5 text-[13px] text-[#a0a0b0]">Bank Account</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <UPILogo className="h-6 w-14" />
                  <div className="flex items-center gap-1.5">
                    <span className="text-[20px] font-bold text-white tabular-nums">₹{amount}</span>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#22c55e]">
                      <Check className="h-3 w-3 text-white" strokeWidth={3.5} />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="my-3 h-px bg-[#2a1a40]" />

            {/* Add UPI Account */}
            <button className="mx-auto mb-3 block px-4 text-[15px] font-medium text-[#9d4edd] transition hover:brightness-125">
              Add UPI Account
            </button>

            {/* PAY button */}
            <button
              onClick={confirm}
              className="mx-3 flex h-14 w-[calc(100%-1.5rem)] items-center justify-center rounded-full bg-[#9d4edd] text-[20px] font-bold text-white transition hover:brightness-110 active:scale-[0.99]"
            >
              PAY ₹{amount}
            </button>
            <div className="pb-3" />
          </div>
        </div>
      )}
    </div>
  );
}
