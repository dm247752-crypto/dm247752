import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/* ---------- UI icons ---------- */
export const ChevronLeft = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

export const ChevronRight = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M9 18l6-6-6-6" />
  </svg>
);

export const ChevronDown = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const ArrowRight = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

export const ArrowUpRight = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M7 17L17 7M8 7h9v9" />
  </svg>
);

export const ArrowDownLeft = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M17 7L7 17M16 17H7V8" />
  </svg>
);

export const Search = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </svg>
);

export const Sliders = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <line x1="4" y1="8" x2="14" y2="8" />
    <circle cx="17" cy="8" r="2" />
    <line x1="20" y1="8" x2="20" y2="8" />
    <line x1="4" y1="16" x2="8" y2="16" />
    <circle cx="11" cy="16" r="2" />
    <line x1="14" y1="16" x2="20" y2="16" />
  </svg>
);

export const Home = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 3.2 3 10.5V21h6v-6h6v6h6V10.5L12 3.2z" />
  </svg>
);

export const HomeOutline = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3V10.5z" />
  </svg>
);

export const Bell = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M6 8a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </svg>
);

export const Clock = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const QuestionCircle = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9.5a2.5 2.5 0 1 1 3.6 2.25c-.8.4-1.1.9-1.1 1.75V14" />
    <circle cx="12" cy="17" r="0.8" fill="currentColor" />
  </svg>
);

export const Copy = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V6a2 2 0 0 1 2-2h9" />
  </svg>
);

export const Share = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="6" cy="12" r="2.2" />
    <circle cx="18" cy="6" r="2.2" />
    <circle cx="18" cy="18" r="2.2" />
    <path d="M8 11l8-4M8 13l8 4" />
  </svg>
);

export const ChatHelp = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M4 12a8 8 0 1 1 3.5 6.6L4 20l1.4-3.5A8 8 0 0 1 4 12z" />
    <path d="M9 10.5a3 3 0 1 1 4.4 2.7c-.9.4-1.4.9-1.4 1.8" />
    <circle cx="12" cy="17" r="0.7" fill="currentColor" />
  </svg>
);

export const Receipt = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z" />
    <path d="M9 8h6M9 12h6M9 16h4" />
  </svg>
);

export const SwapArrows = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M8 7H4l3-3M4 7l4 4" />
    <path d="M16 17h4l-3 3M20 17l-4-4" />
  </svg>
);

export const Split = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M12 5v6M12 11l-4 4v4M12 11l4 4v4" />
  </svg>
);

export const Shield = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="#16a34a" {...p}>
    <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3z" />
    <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export const Download = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M12 4v11m0 0l-4-4m4 4l4-4M5 20h14" />
  </svg>
);

export const Backspace = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="#0022aa" {...p}>
    <path d="M8 5h13a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8L1 12l7-7z" />
    <path d="M12 9l5 6M17 9l-5 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

export const Check = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M5 12l5 5L20 7" />
  </svg>
);

/* ---------- Status bar mini glyphs ---------- */
export const SignalBars = (p: IconProps) => (
  <svg viewBox="0 0 20 12" fill="currentColor" {...p}>
    <path d="M0 12h3V8H0v4zm5 0h3V5H5v7zm5 0h3V2h-3v10z" opacity="0.95" />
    <path d="M15 12h3V0h-3v12z" opacity="0.35" />
  </svg>
);

export const BatteryLow = (p: IconProps) => (
  <svg viewBox="0 0 26 12" {...p}>
    <rect x="0.5" y="0.5" width="22" height="11" rx="2" fill="none" stroke="currentColor" strokeWidth="1" />
    <rect x="23" y="3.5" width="2" height="5" rx="0.5" fill="currentColor" />
    <rect x="2" y="2" width="8" height="8" rx="1" fill="#ef4444" />
  </svg>
);

/* ---------- Header quick-action icons (purple tiles at top) ---------- */
export const IconToMobile = (p: IconProps) => (
  <svg viewBox="0 0 64 64" {...p}>
    <defs>
      <linearGradient id="pg1" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#7b3fb8" />
        <stop offset="1" stopColor="#5f259f" />
      </linearGradient>
    </defs>
    <rect x="6" y="6" width="52" height="52" rx="26" fill="url(#pg1)" />
    <rect x="22" y="16" width="20" height="32" rx="4" fill="#e9d8fd" />
    <rect x="24" y="19" width="16" height="22" rx="2" fill="#c4a6ef" />
    <circle cx="32" cy="44" r="1.5" fill="#5f259f" />
    <circle cx="46" cy="14" r="4" fill="#22c55e" />
  </svg>
);

export const IconToBank = (p: IconProps) => (
  <svg viewBox="0 0 64 64" {...p}>
    <defs>
      <linearGradient id="pg2" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#7b3fb8" />
        <stop offset="1" stopColor="#5f259f" />
      </linearGradient>
    </defs>
    <rect x="6" y="6" width="52" height="52" rx="26" fill="url(#pg2)" />
    <path d="M32 14 18 22h28L32 14z" fill="#e9d8fd" />
    <rect x="18" y="24" width="28" height="2" fill="#e9d8fd" />
    <rect x="20" y="28" width="3" height="14" fill="#e9d8fd" />
    <rect x="27" y="28" width="3" height="14" fill="#e9d8fd" />
    <rect x="34" y="28" width="3" height="14" fill="#e9d8fd" />
    <rect x="41" y="28" width="3" height="14" fill="#e9d8fd" />
    <rect x="17" y="43" width="30" height="3" fill="#e9d8fd" />
  </svg>
);

export const IconWallet = (p: IconProps) => (
  <svg viewBox="0 0 64 64" {...p}>
    <defs>
      <linearGradient id="pg3" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#7b3fb8" />
        <stop offset="1" stopColor="#5f259f" />
      </linearGradient>
    </defs>
    <rect x="6" y="6" width="52" height="52" rx="26" fill="url(#pg3)" />
    <rect x="16" y="22" width="32" height="22" rx="3" fill="#e9d8fd" />
    <path d="M16 26h32v6H36a3 3 0 0 0 0 6h12v6H16z" fill="#c4a6ef" />
    <text x="32" y="34" textAnchor="middle" fontSize="10" fontWeight="700" fill="#5f259f">₹</text>
  </svg>
);

export const IconBalance = (p: IconProps) => (
  <svg viewBox="0 0 64 64" {...p}>
    <defs>
      <linearGradient id="pg4" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#7b3fb8" />
        <stop offset="1" stopColor="#5f259f" />
      </linearGradient>
    </defs>
    <rect x="6" y="6" width="52" height="52" rx="26" fill="url(#pg4)" />
    <rect x="20" y="16" width="24" height="32" rx="3" fill="#e9d8fd" />
    <rect x="22" y="18" width="20" height="28" rx="2" fill="#c4a6ef" />
    <text x="32" y="36" textAnchor="middle" fontSize="14" fontWeight="800" fill="#5f259f">₹</text>
  </svg>
);

/* ---------- Category icons ---------- */
export const IconMobileRecharge = (p: IconProps) => (
  <svg viewBox="0 0 64 64" {...p}>
    <rect x="18" y="10" width="28" height="44" rx="5" fill="#1e3a8a" stroke="#2563eb" strokeWidth="1" />
    <rect x="21" y="14" width="22" height="30" rx="2" fill="#0b1e4a" />
    <path d="M34 20l-8 12h6l-2 8 8-12h-6l2-8z" fill="#facc15" />
  </svg>
);

export const IconTuition = (p: IconProps) => (
  <svg viewBox="0 0 64 64" {...p}>
    <path d="M10 18h44v30H10z" fill="#fff" stroke="#e5e7eb" />
    <path d="M32 18v30" stroke="#9ca3af" />
    <path d="M14 22h14M14 26h14M14 30h10M36 22h14M36 26h14M36 30h10" stroke="#93c5fd" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M40 12l8 8-18 18-8-2 2-8L40 12z" fill="#ef4444" />
    <path d="M40 12l8 8-3 3-8-8 3-3z" fill="#fbbf24" />
  </svg>
);

export const IconElectricity = (p: IconProps) => (
  <svg viewBox="0 0 64 64" {...p}>
    <path d="M22 42h20v6a4 4 0 0 1-4 4h-12a4 4 0 0 1-4-4v-6z" fill="#94a3b8" />
    <path d="M18 30a14 14 0 1 1 28 0c0 6-4 9-6 12H24c-2-3-6-6-6-12z" fill="#fde047" />
    <path d="M20 30a12 12 0 1 1 24 0c0 4-3 7-5 10H25c-2-3-5-6-5-10z" fill="#fef9c3" />
    <path d="M26 46h12M26 48h12" stroke="#475569" strokeWidth="1.4" />
    <path d="M32 22v6l-4 4h6l-2 6" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconLoanRepay = (p: IconProps) => (
  <svg viewBox="0 0 64 64" {...p}>
    <path d="M22 20c0-3 3-5 10-5s10 2 10 5v6c0 3-3 5-10 5s-10-2-10-5v-6z" fill="#a16207" />
    <path d="M14 32c0-6 8-10 18-10s18 4 18 10v10c0 6-8 10-18 10s-18-4-18-10V32z" fill="#b45309" />
    <path d="M14 32c0 6 8 10 18 10s18-4 18-10" fill="none" stroke="#78350f" strokeWidth="1" />
    <text x="32" y="42" textAnchor="middle" fontSize="14" fontWeight="800" fill="#fef3c7">₹</text>
    <rect x="40" y="40" width="14" height="14" rx="2" fill="#3b82f6" />
    <text x="47" y="51" textAnchor="middle" fontSize="8" fontWeight="700" fill="#fff">31</text>
    <rect x="40" y="40" width="14" height="4" fill="#ef4444" />
  </svg>
);

export const IconLPG = (p: IconProps) => (
  <svg viewBox="0 0 64 64" {...p}>
    <rect x="26" y="8" width="12" height="8" rx="2" fill="#9ca3af" />
    <rect x="24" y="14" width="16" height="6" rx="2" fill="#6b7280" />
    <path d="M20 20h24v34a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4V20z" fill="#dc2626" />
    <path d="M20 24h24" stroke="#7f1d1d" />
  </svg>
);

export const IconPersonalLoan = (p: IconProps) => (
  <svg viewBox="0 0 64 64" {...p}>
    <circle cx="26" cy="20" r="7" fill="#f97316" />
    <path d="M14 46c0-8 6-12 12-12s12 4 12 12v4H14v-4z" fill="#7c3aed" />
    <ellipse cx="46" cy="42" rx="9" ry="10" fill="#a16207" />
    <text x="46" y="48" textAnchor="middle" fontSize="14" fontWeight="800" fill="#fef3c7">₹</text>
  </svg>
);

export const IconMutualFunds = (p: IconProps) => (
  <svg viewBox="0 0 64 64" {...p}>
    <rect x="10" y="30" width="8" height="20" rx="1" fill="#14b8a6" />
    <rect x="20" y="22" width="8" height="28" rx="1" fill="#14b8a6" />
    <rect x="30" y="14" width="8" height="36" rx="1" fill="#14b8a6" />
    <ellipse cx="48" cy="42" rx="8" ry="10" fill="#a16207" />
    <text x="48" y="47" textAnchor="middle" fontSize="12" fontWeight="800" fill="#fef3c7">₹</text>
  </svg>
);

export const IconGoldLoan = (p: IconProps) => (
  <svg viewBox="0 0 64 64" {...p}>
    <path d="M14 40c4-6 12-10 18-10s10 2 14 6" fill="none" stroke="#c2410c" strokeWidth="6" strokeLinecap="round" />
    <ellipse cx="36" cy="22" rx="10" ry="4" fill="none" stroke="#f59e0b" strokeWidth="4" />
    <ellipse cx="42" cy="30" rx="10" ry="4" fill="none" stroke="#fbbf24" strokeWidth="4" />
    <ellipse cx="20" cy="46" rx="9" ry="10" fill="#a16207" />
    <text x="20" y="52" textAnchor="middle" fontSize="12" fontWeight="800" fill="#fef3c7">₹</text>
    <path d="M52 12l2 4 4 1-4 1-2 4-2-4-4-1 4-1 2-4z" fill="#fde047" />
  </svg>
);

export const IconCreditScore = (p: IconProps) => (
  <svg viewBox="0 0 64 64" {...p}>
    <path d="M10 42a22 22 0 0 1 44 0" fill="none" stroke="#e5e7eb" strokeWidth="5" strokeLinecap="round" />
    <path d="M10 42a22 22 0 0 1 8-17" fill="none" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" />
    <path d="M18 25a22 22 0 0 1 14-6" fill="none" stroke="#f97316" strokeWidth="5" strokeLinecap="round" />
    <path d="M32 19a22 22 0 0 1 14 6" fill="none" stroke="#eab308" strokeWidth="5" strokeLinecap="round" />
    <path d="M46 25a22 22 0 0 1 8 17" fill="none" stroke="#22c55e" strokeWidth="5" strokeLinecap="round" />
    <path d="M32 42l10-12" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
    <circle cx="32" cy="42" r="2.5" fill="#111827" />
    <rect x="22" y="46" width="20" height="10" rx="1" fill="#f59e0b" />
    <text x="32" y="53" textAnchor="middle" fontSize="7" fontWeight="800" fill="#fff">FREE</text>
  </svg>
);

export const IconDailyGold = (p: IconProps) => (
  <svg viewBox="0 0 64 64" {...p}>
    <ellipse cx="32" cy="18" rx="14" ry="4" fill="#dc2626" />
    <path d="M18 18v28a4 4 0 0 0 4 4h20a4 4 0 0 0 4-4V18" fill="#3b82f6" />
    <ellipse cx="32" cy="18" rx="14" ry="4" fill="#ef4444" />
    <circle cx="26" cy="34" r="6" fill="#f59e0b" />
    <circle cx="34" cy="38" r="6" fill="#fbbf24" />
    <path d="M40 24l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" fill="#fef3c7" />
  </svg>
);

export const IconBuyGold = (p: IconProps) => (
  <svg viewBox="0 0 64 64" {...p}>
    <path d="M14 14h30l6 6v30a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2V14z" fill="#f59e0b" />
    <path d="M44 14v6h6" fill="#fbbf24" />
    <text x="30" y="38" textAnchor="middle" fontSize="12" fontWeight="800" fill="#7c2d12">24K</text>
  </svg>
);

export const IconDailySilver = (p: IconProps) => (
  <svg viewBox="0 0 64 64" {...p}>
    <ellipse cx="32" cy="18" rx="14" ry="4" fill="#dc2626" />
    <path d="M18 18v28a4 4 0 0 0 4 4h20a4 4 0 0 0 4-4V18" fill="#3b82f6" />
    <ellipse cx="32" cy="18" rx="14" ry="4" fill="#ef4444" />
    <circle cx="26" cy="34" r="6" fill="#d1d5db" />
    <circle cx="34" cy="38" r="6" fill="#e5e7eb" />
    <path d="M40 24l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" fill="#fff" />
  </svg>
);

export const IconBuyPlatinum = (p: IconProps) => (
  <svg viewBox="0 0 64 64" {...p}>
    <circle cx="32" cy="34" r="16" fill="none" stroke="#9ca3af" strokeWidth="6" />
    <circle cx="32" cy="34" r="16" fill="none" stroke="#d1d5db" strokeWidth="2" />
  </svg>
);

export const IconBike = (p: IconProps) => (
  <svg viewBox="0 0 64 64" {...p}>
    <circle cx="18" cy="46" r="8" fill="#1f2937" />
    <circle cx="18" cy="46" r="3" fill="#9ca3af" />
    <circle cx="46" cy="46" r="8" fill="#1f2937" />
    <circle cx="46" cy="46" r="3" fill="#9ca3af" />
    <path d="M14 40l10-14h14l6 12" fill="#8b5cf6" />
    <path d="M28 18h10l4 8H24l4-8z" fill="#f97316" />
    <path d="M22 40h20" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const IconCar = (p: IconProps) => (
  <svg viewBox="0 0 64 64" {...p}>
    <path d="M8 40l4-10c1-3 3-4 6-4h28c3 0 5 1 6 4l4 10v8H8v-8z" fill="#3b82f6" />
    <path d="M14 30l3-6h30l3 6H14z" fill="#93c5fd" opacity="0.5" />
    <circle cx="20" cy="48" r="5" fill="#111827" />
    <circle cx="44" cy="48" r="5" fill="#111827" />
    <circle cx="20" cy="48" r="2" fill="#6b7280" />
    <circle cx="44" cy="48" r="2" fill="#6b7280" />
  </svg>
);

export const IconHealth = (p: IconProps) => (
  <svg viewBox="0 0 64 64" {...p}>
    <path d="M18 22h28v28a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4V22z" fill="#ef4444" />
    <path d="M24 16h16v6H24z" fill="#dc2626" />
    <path d="M30 30h4v6h6v4h-6v6h-4v-6h-6v-4h6v-6z" fill="#fff" />
  </svg>
);

export const IconLife = (p: IconProps) => (
  <svg viewBox="0 0 64 64" {...p}>
    <path d="M32 12c-12 4-18 10-18 22 0 6 4 12 10 14v4h16v-4c6-2 10-8 10-14 0-12-6-18-18-22z" fill="#14b8a6" />
    <circle cx="44" cy="46" r="8" fill="#8b5cf6" />
    <path d="M40 46l3 3 5-6" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconMFLoan = (p: IconProps) => (
  <svg viewBox="0 0 64 64" {...p}>
    <ellipse cx="32" cy="34" rx="18" ry="14" fill="#a16207" />
    <ellipse cx="32" cy="30" rx="18" ry="10" fill="#b45309" />
    <path d="M14 38c4-4 12-8 18-8s14 4 18 8" fill="none" stroke="#78350f" />
    <rect x="20" y="42" width="24" height="10" rx="2" fill="#ec4899" />
    <path d="M20 46h24" stroke="#be185d" />
  </svg>
);

export const IconGoldSave = (p: IconProps) => (
  <svg viewBox="0 0 64 64" {...p}>
    <circle cx="22" cy="28" r="7" fill="#f59e0b" />
    <circle cx="34" cy="34" r="9" fill="#fbbf24" />
    <circle cx="46" cy="30" r="6" fill="#f59e0b" />
    <ellipse cx="34" cy="46" rx="20" ry="4" fill="#78350f" opacity="0.4" />
    <path d="M50 18l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" fill="#fef3c7" />
  </svg>
);

/* ---------- Small icons ---------- */
export const RupeeIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M18 4H6v2h4c1.4 0 2.6.6 3.3 2H6v2h7.9c-.4 1.8-1.9 3-3.9 3H6v2.4L13.6 22h3.2l-7.5-7h1c3 0 5.4-1.9 5.9-5H18V8h-3c-.3-.7-.8-1.5-1.4-2H18V4z" />
  </svg>
);

export const UPILogo = (p: IconProps) => (
  <svg viewBox="0 0 320 126" {...p}>
    {/* UPI wordmark matching the provided grey italic logo */}
    <g transform="skewX(-12)">
      <path
        d="M24 25h23L34 72c-2 9 2 13 12 13h20c10 0 15-4 18-13l13-47h23l-15 55c-4 14-15 21-34 21H40C18 101 8 90 14 68L24 25z"
        fill="#747474"
      />
      <path
        d="M112 25h78c18 0 26 10 21 27-5 17-18 27-37 27h-48l-7 22H95l22-76zm28 19-5 17h38c8 0 13-3 15-8 2-6-1-9-9-9h-39z"
        fill="#747474"
      />
      <path d="M221 25h24l-22 76h-24l22-76z" fill="#747474" />
    </g>
    {/* Orange + green forward mark */}
    <path d="M250 22l42 42-42 42V22z" fill="#f58220" />
    <path d="M274 22l30 42-30 42 37-42-37-42z" fill="#008a4b" />
    <text x="8" y="122" fontFamily="Arial, Helvetica, sans-serif" fontSize="20" fontStyle="italic" fontWeight="700" fill="#3f3f3f" letterSpacing="0.3">
      UNIFIED PAYMENTS INTERFACE
    </text>
  </svg>
);

export const SBILogo = (p: IconProps) => (
  <svg viewBox="0 0 40 40" {...p}>
    <circle cx="20" cy="20" r="19" fill="#fff" stroke="#1e40af" strokeWidth="1" />
    <circle cx="20" cy="20" r="14" fill="#1e40af" />
    <path d="M15 12l5 5m0 0l5-5m-5 5v14m-5-5h10" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" fill="none" />
  </svg>
);

/* Official circular SBI logo — white squircle, blue circle, white pin */
export const SBIAppLogo = (p: IconProps) => (
  <svg viewBox="0 0 40 40" {...p}>
    <rect x="2" y="2" width="36" height="36" rx="11" fill="#fff" />
    <circle cx="20" cy="20" r="13.5" fill="#1553b5" />
    <circle cx="20" cy="14.8" r="2.7" fill="#fff" />
    <rect x="18.9" y="17" width="2.2" height="10" rx="1.1" fill="#fff" />
  </svg>
);

/* SBI circular logo — solid #003399 circle with a white keyhole slit (Pay sheet / PIN pad) */
export const SBIKeyhole = (p: IconProps) => (
  <svg viewBox="0 0 40 40" {...p}>
    <circle cx="20" cy="20" r="19" fill="#003399" />
    <circle cx="20" cy="13.6" r="4.1" fill="#fff" />
    <rect x="17.9" y="16.4" width="4.2" height="12.4" rx="2.1" fill="#fff" />
  </svg>
);

/* Flat scanner glyph — corner brackets + 2x2 QR dot squares (bottom-nav scan button) */
export const ScanGlyph = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M4 8V6a2 2 0 0 1 2-2h2" />
    <path d="M16 4h2a2 2 0 0 1 2 2v2" />
    <path d="M4 16v2a2 2 0 0 0 2 2h2" />
    <path d="M20 16v2a2 2 0 0 1-2 2h-2" />
    <rect x="7.6" y="7.6" width="3.7" height="3.7" rx="0.9" fill="currentColor" stroke="none" />
    <rect x="12.7" y="7.6" width="3.7" height="3.7" rx="0.9" fill="currentColor" stroke="none" />
    <rect x="7.6" y="12.7" width="3.7" height="3.7" rx="0.9" fill="currentColor" stroke="none" />
    <rect x="12.7" y="12.7" width="3.7" height="3.7" rx="0.9" fill="currentColor" stroke="none" />
  </svg>
);

/* Profile person — filled head + shoulder arc (purple squircle avatar) */
export const ProfilePerson = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="12" cy="8.2" r="3.4" fill="currentColor" stroke="none" />
    <path d="M5.2 19.6c1.5-3.4 4.1-5 6.8-5s5.3 1.6 6.8 5" />
  </svg>
);

export const BHIMLogo = (p: IconProps) => (
  <svg viewBox="0 0 100 40" {...p}>
    <text x="10" y="26" fontFamily="Arial" fontSize="20" fontWeight="900" fontStyle="italic" fill="#e65100" letterSpacing="0.5">
      B<tspan fill="#fff">HI</tspan><tspan fill="#2e7d32">M</tspan>
    </text>
    <path d="M70 10l12 10-12 10V10z" fill="#e65100" />
    <path d="M78 10l12 10-12 10V10z" fill="#2e7d32" />
  </svg>
);

/* Minimalist document / checklist sheet in a white stroke box */
export const DocList = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="3.2" />
    <path d="M12.8 8h4.4M12.8 12h4.4M12.8 16h4.4" />
    <circle cx="8.1" cy="8" r="0.7" fill="currentColor" stroke="none" />
    <circle cx="8.1" cy="12" r="0.7" fill="currentColor" stroke="none" />
    <circle cx="8.1" cy="16" r="0.7" fill="currentColor" stroke="none" />
  </svg>
);

export const GPayLogo = (p: IconProps) => (
  <svg viewBox="0 0 60 22" {...p}>
    <circle cx="6" cy="11" r="6" fill="#4285F4" />
    <path d="M6 5v12" stroke="#fff" strokeWidth="1.5" />
    <text x="16" y="15" fontFamily="Arial" fontSize="11" fontWeight="600" fill="#5f6368">Pay</text>
  </svg>
);

export const AxisLogo = (p: IconProps) => (
  <svg viewBox="0 0 100 24" {...p}>
    <path d="M6 20l8-16 8 16h-4l-2-4h-4l-2 4H6z" fill="#a11d33" />
    <text x="24" y="17" fontFamily="Arial" fontSize="12" fontWeight="700" fill="#a11d33" letterSpacing="0.5">
      AXIS BANK
    </text>
  </svg>
);

export const QRIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M4 8V6a2 2 0 0 1 2-2h2M20 8V6a2 2 0 0 0-2-2h-2M4 16v2a2 2 0 0 0 2 2h2M20 16v2a2 2 0 0 1-2 2h-2" />
    <rect x="8" y="8" width="8" height="8" rx="1.5" strokeWidth={1.8} />
  </svg>
);

export const MapPin = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M12 21s-7-5.3-7-11a7 7 0 1 1 14 0c0 5.7-7 11-7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

export const Storefront = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M4 9l1.5-4h13L20 9" />
    <path d="M4 9a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0" />
    <path d="M5 11v8h14v-8" />
    <path d="M9 19v-4h4v4" />
  </svg>
);

export const TrendingUp = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M3 17l6-6 4 4 8-8" />
    <path d="M15 7h6v6" />
  </svg>
);

export const UploadImage = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <circle cx="9" cy="10" r="1.6" />
    <path d="M5 17l4.5-4 3 2.5L16 12l4 4" />
  </svg>
);

export const WalletPlus = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="3" y="6" width="18" height="14" rx="3" />
    <path d="M3 10h18" />
    <path d="M12 13v4M10 15h4" />
  </svg>
);

export const Close = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const Torch = ({ on = false, ...p }: IconProps & { on?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.9}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...p}
  >
    <path d="M9 2h6v2l-2 4v12a2 2 0 0 1-2 2 2 2 0 0 1-2-2V8L9 4V2z" fill={on ? "currentColor" : "none"} />
    <line x1="12" y1="12" x2="12" y2="14" />
    {on && (
      <g strokeWidth={1.4}>
        <path d="M5.5 4.5 4 3" />
        <path d="M18.5 4.5 20 3" />
        <path d="M12 1.5V.5" />
      </g>
    )}
  </svg>
);
