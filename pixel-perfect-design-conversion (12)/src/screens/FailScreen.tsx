interface Props {
  onRetry: () => void;
  onHome: () => void;
}

export default function FailScreen({ onRetry, onHome }: Props) {
  return (
    <div className="flex h-full flex-col bg-[#0b0b0d]">
      <div className="flex flex-1 flex-col items-center justify-center px-8">
        {/* Red X circle */}
        <div className="pop relative flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg">
          <svg
            viewBox="0 0 24 24"
            className="h-10 w-10"
            fill="none"
            stroke="#dc2626"
            strokeWidth={3.2}
            strokeLinecap="round"
          >
            <path d="M7 7l10 10M17 7L7 17" className="draw-check" />
          </svg>
        </div>
        <h1 className="mt-5 text-[22px] font-bold text-white">Payment Failed</h1>
        <p className="mt-2 max-w-[260px] text-center text-[13.5px] leading-relaxed text-white/55">
          Your transaction could not be completed. No money was deducted from your account.
        </p>
      </div>

      <div className="space-y-2.5 px-6 pb-6">
        <button
          onClick={onRetry}
          className="w-full rounded-xl bg-[#9d4edd] py-4 text-[15px] font-bold text-white transition hover:brightness-110 active:scale-[0.99]"
        >
          Try Again
        </button>
        <button
          onClick={onHome}
          className="w-full rounded-xl bg-white/5 py-4 text-[15px] font-semibold text-white/80 transition hover:bg-white/10 active:scale-[0.99]"
        >
          Go Home
        </button>
      </div>

      <div className="flex justify-center bg-black py-2">
        <div className="h-1 w-24 rounded-full bg-white/40" />
      </div>
    </div>
  );
}
