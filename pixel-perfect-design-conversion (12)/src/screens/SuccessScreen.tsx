import { useEffect, useRef, useState } from "react";
import { Receipt, Share } from "../components/Icons";
import { liveDateParts } from "../store/WalletContext";

const ADS = [
  "/images/ad-loan.jpg",
  "/images/ad-emi.jpg",
  "/images/ad-share.jpg",
];

interface Props {
  name: string;
  sub: string;
  /** Exact user-typed amount string, e.g. "500" | "99.5" | "99.50" — shown verbatim. */
  amount: string;
  onDone: () => void;
  onDetails: () => void;
}

export default function SuccessScreen({ name, sub, amount, onDone, onDetails }: Props) {
  const [stamp] = useState(liveDateParts);
  const [adIdx, setAdIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);

  // Auto-rotate ads every 4s
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setAdIdx((i) => (i + 1) % ADS.length);
    }, 4000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="flex h-full flex-col bg-[#0b0b0d]">
      {/* Green header */}
      <div className="relative shrink-0 overflow-hidden bg-[#1f7a3a] px-4 pt-5 pb-14">
        <div className="mx-auto flex flex-col items-center">
          <div className="pop relative flex h-[68px] w-[68px] items-center justify-center rounded-full bg-white shadow-lg">
            <svg
              viewBox="0 0 24 24"
              className="h-9 w-9"
              fill="none"
              stroke="#1f7a3a"
              strokeWidth={3.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12l5 5L20 7" className="draw-check" />
            </svg>
          </div>
          <h1 className="mt-3 text-[19px] font-bold text-white">Payment Successful</h1>
          <p className="mt-1 text-[13px] font-medium text-[#facc15]">
            {stamp.date} at {stamp.time}
          </p>
        </div>
      </div>

      {/* Receipt card */}
      <div className="fade-up -mt-9 flex min-h-0 flex-1 flex-col px-3 pb-2">
        <div className="shrink-0 rounded-2xl bg-[#17171a] p-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-2xl bg-[#4ac3e6] text-[21px] font-bold text-white">
              {name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-[16px] font-bold text-white">{name}</h3>
              <p className="truncate text-[11.5px] text-white/70">{sub}</p>
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="text-[18px] font-bold text-white tabular-nums">
                  ₹{amount}
                </span>
                <button className="shrink-0 text-[11.5px] font-medium text-[#b39ddb] underline underline-offset-4 hover:text-white">
                  Split Expense
                </button>
              </div>
            </div>
          </div>

          <div className="mt-2.5 h-px bg-white/10" />

          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              onClick={onDetails}
              className="flex items-center justify-center gap-2 rounded-xl py-1.5 transition hover:bg-white/5 active:scale-95"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#7b3fb8]">
                <Receipt className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-[11.5px] font-semibold text-[#b39ddb]">View Details</span>
            </button>
            <button className="flex items-center justify-center gap-2 rounded-xl py-1.5 transition hover:bg-white/5 active:scale-95">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#7b3fb8]">
                <Share className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-[11.5px] font-semibold text-[#b39ddb]">Share Receipt</span>
            </button>
          </div>
        </div>

        {/* Ad carousel */}
        <div
          className="fade-up relative mt-2.5 min-h-0 flex-1 overflow-hidden rounded-2xl"
          style={{ animationDelay: "180ms" }}
        >
          <div
            className="flex h-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${adIdx * 100}%)` }}
          >
            {ADS.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Ad ${i + 1}`}
                className="h-full w-full shrink-0 object-cover"
                draggable={false}
              />
            ))}
          </div>

          {/* Dots */}
          <div className="absolute right-0 bottom-2.5 left-0 flex justify-center gap-1.5">
            {ADS.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setAdIdx(i);
                  if (timerRef.current) clearInterval(timerRef.current);
                  timerRef.current = setInterval(() => {
                    setAdIdx((j) => (j + 1) % ADS.length);
                  }, 4000);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  i === adIdx ? "w-5 bg-white" : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Done button */}
      <button
        onClick={onDone}
        className="h-12 shrink-0 border-t border-white/5 bg-[#17171a] text-center text-[14px] font-bold tracking-wide text-[#b39ddb] transition hover:bg-[#1e1e22] active:scale-[0.99]"
      >
        DONE
      </button>
    </div>
  );
}
