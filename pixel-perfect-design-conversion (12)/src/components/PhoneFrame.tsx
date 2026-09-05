import type { ReactNode } from "react";

export default function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] w-full bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(95,37,159,0.35),transparent_60%),radial-gradient(900px_500px_at_90%_100%,rgba(139,92,246,0.15),transparent_60%),#050507] py-0 md:py-10">
      {/* Desktop headline */}
      <div className="mx-auto mb-8 hidden max-w-3xl px-6 text-center md:block">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Live prototype · Interactive UPI flow
        </div>
        <h1 className="bg-gradient-to-br from-white to-white/60 bg-clip-text text-4xl font-bold tracking-tight text-transparent lg:text-5xl">
          A payment experience, rebuilt for the web
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-white/60 lg:text-base">
          Tap the tiles, send ₹500 to Digambar, enter any 6-digit PIN, and watch the full transaction ripple through.
        </p>
      </div>

      <div className="relative mx-auto w-full max-w-[400px] px-0 md:px-4">
        {/* Phone bezel — hidden on mobile */}
        <div className="phone-shadow relative overflow-hidden rounded-none bg-black md:rounded-[42px] md:border md:border-white/10 md:p-[10px]">
          <div className="relative h-[100dvh] w-full overflow-hidden rounded-none bg-[#0b0b0d] md:aspect-[9/19.5] md:h-auto md:max-h-[860px] md:rounded-[34px]">
            {children}
          </div>
        </div>

        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-x-10 -bottom-16 hidden h-24 rounded-full bg-purple-500/40 blur-3xl md:block" />
      </div>

      <p className="mx-auto mt-6 hidden max-w-xs text-center text-xs text-white/40 md:block">
        Not affiliated with PhonePe · UI recreation for design study
      </p>
    </div>
  );
}
