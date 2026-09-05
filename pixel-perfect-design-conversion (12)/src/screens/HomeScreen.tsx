import { useEffect, useMemo, useRef, useState } from "react";
import BottomSheet from "../components/BottomSheet";
import {
  ArrowRight,
  ChevronRight,
  IconBalance,
  IconBike,
  IconBuyGold,
  IconBuyPlatinum,
  IconCar,
  IconCreditScore,
  IconDailyGold,
  IconDailySilver,
  IconElectricity,
  IconGoldLoan,
  IconGoldSave,
  IconHealth,
  IconLPG,
  IconLife,
  IconLoanRepay,
  IconMFLoan,
  IconMobileRecharge,
  IconMutualFunds,
  IconPersonalLoan,
  IconToBank,
  IconToMobile,
  IconTuition,
  IconWallet,
  ProfilePerson,
  QuestionCircle,
  ScanGlyph,
  Storefront,
  TrendingUp,
} from "../components/Icons";

interface Props {
  onTransfer: (mode: "mobile" | "upi") => void;
  onScan: () => void;
  onCheckBalance: () => void;
  onInsurance: () => void;
  onStores: () => void;
  onWealth: () => void;
}

interface Tile {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

function Section({
  title,
  tiles,
  banner,
  delay = 0,
}: {
  title: string;
  tiles: Tile[];
  banner?: { text: string; icon: React.ReactNode };
  delay?: number;
}) {
  return (
    <div className="reveal" data-reveal style={{ transitionDelay: `${delay}ms` }}>
      <h2 className="mb-3 text-[17px] font-bold text-white">{title}</h2>
      <div className="grid grid-cols-4 gap-2">
        {tiles.map((t) => (
          <button
            key={t.label}
            onClick={t.onClick}
            className="group flex flex-col items-center gap-1.5 rounded-2xl bg-[#17171a] p-2.5 transition hover:bg-[#1e1e22] active:scale-95"
          >
            <div className="flex h-12 w-12 items-center justify-center transition-transform group-hover:scale-110">
              {t.icon}
            </div>
            <span className="text-center text-[12px] font-medium leading-tight whitespace-pre-line text-white/90">
              {t.label}
            </span>
          </button>
        ))}
      </div>
      {banner && (
        <div className="mt-2 grid grid-cols-[1fr_auto] gap-2">
          <div className="flex items-center justify-between rounded-xl bg-[#17171a] px-3.5 py-3">
            <span className="text-[13.5px] font-medium text-white/90">{banner.text}</span>
            <div className="h-6 w-6">{banner.icon}</div>
          </div>
          <button className="flex items-center gap-1 rounded-xl bg-[#17171a] px-4 py-3 text-[13px] font-semibold text-[#b39ddb] transition hover:bg-[#1e1e22]">
            More <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

const TICKER_BASE = [
  { s: "NIFTY 50", p: 24512.3, d: 0.62 },
  { s: "SENSEX", p: 80435.6, d: 0.54 },
  { s: "RELIANCE", p: 2954.4, d: 1.21 },
  { s: "TCS", p: 3812.1, d: -0.43 },
  { s: "HDFCBANK", p: 1642.8, d: 0.87 },
  { s: "INFY", p: 1588.2, d: -0.28 },
  { s: "ICICIBANK", p: 1104.5, d: 0.94 },
  { s: "SBIN", p: 842.3, d: 1.05 },
];

export default function HomeScreen({
  onTransfer,
  onScan,
  onCheckBalance,
  onInsurance,
  onStores,
  onWealth,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [referOpen, setReferOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  /* ── Live share-market data (random-walk, updates every 2.5s) ── */
  const [series, setSeries] = useState<number[]>(() => {
    const arr: number[] = [];
    let v = 24500;
    for (let i = 0; i < 40; i++) {
      v += (Math.random() - 0.48) * 30;
      arr.push(v);
    }
    return arr;
  });
  const [ticks, setTicks] = useState(TICKER_BASE);

  useEffect(() => {
    const i = setInterval(() => {
      setSeries((s) => {
        const next = s[s.length - 1] + (Math.random() - 0.48) * 34;
        return [...s.slice(1), next];
      });
      setTicks((ts) =>
        ts.map((t) => {
          const dp = (Math.random() - 0.5) * 0.06;
          return { ...t, p: t.p * (1 + dp / 100), d: t.d + dp };
        })
      );
    }, 2500);
    return () => clearInterval(i);
  }, []);

  const niftyNow = series[series.length - 1];
  const niftyChange = niftyNow - series[0];
  const niftyPct = (niftyChange / series[0]) * 100;
  const niftyUp = niftyChange >= 0;

  const chartPoints = useMemo(() => {
    const min = Math.min(...series);
    const max = Math.max(...series);
    const span = max - min || 1;
    return series.map((v, i) => `${(i / (series.length - 1)) * 100},${36 - ((v - min) / span) * 32}`).join(" ");
  }, [series]);

  const copyCode = () => {
    navigator.clipboard?.writeText("DIGAMBAR100");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const els = root.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("in-view");
        });
      },
      { root, threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const quickActions: Tile[] = [
    { label: "To Mobile\nNumber", icon: <IconToMobile className="h-14 w-14" />, onClick: () => onTransfer("mobile") },
    { label: "To Bank &\nSelf A/c", icon: <IconToBank className="h-14 w-14" />, onClick: () => onTransfer("upi") },
    { label: "PhonePe\nWallet", icon: <IconWallet className="h-14 w-14" />, onClick: onCheckBalance },
    { label: "Check\nBalance", icon: <IconBalance className="h-14 w-14" />, onClick: onCheckBalance },
  ];

  return (
    <div className="relative flex h-full flex-col">
      <div ref={scrollRef} className="no-scrollbar flex-1 overflow-y-auto">
        {/* ── Purple hero ─────────────────────────────── */}
        <div className="hero-grid">
          <div className="flex items-center justify-between px-4 pt-2 pb-0">
            <div className="relative">
              {/* Profile picture — purple squircle with white person icon */}
              <button
                aria-label="Profile"
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-b from-[#a855f7] to-[#8b2fd6] ring-2 ring-white/15 transition active:scale-95"
              >
                <ProfilePerson className="h-7 w-7 text-white" />
              </button>
              {/* QR scanner badge */}
              <button
                onClick={onScan}
                aria-label="Scan QR"
                className="absolute -right-1.5 -bottom-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#9d4edd] ring-2 ring-[#5b21b6] transition hover:brightness-110 active:scale-90"
              >
                <ScanGlyph className="h-3.5 w-3.5 text-white" strokeWidth={2.6} />
              </button>
            </div>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition hover:bg-white/10"
              aria-label="Help"
            >
              <QuestionCircle className="h-7 w-7" />
            </button>
          </div>

          {/* ── LIVE SHARE MARKET AD (no balance) ─────────── */}
          <div className="px-5 pt-0 pb-2">
            <div className="flex items-center justify-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c8f169] opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#c8f169]" />
              </span>
              <span className="text-[10px] font-bold tracking-[0.18em] text-[#c8f169] uppercase">
                Live · share.market
              </span>
            </div>

            <h2 className="mt-1 text-center text-[18px] leading-tight font-extrabold tracking-tight text-white">
              Trade share market <span className="text-[#c8f169]">from just ₹100</span>
            </h2>

            {/* Live NIFTY chart card */}
            <div className="mt-1.5 rounded-xl bg-[#241046]/70 px-3 py-2 ring-1 ring-white/10 backdrop-blur">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-wide text-white/60 uppercase">
                  NIFTY 50
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10.5px] font-bold tabular-nums ${
                    niftyUp ? "bg-emerald-500/20 text-[#4ade80]" : "bg-red-500/20 text-[#f87171]"
                  }`}
                >
                  {niftyUp ? "▲" : "▼"} {Math.abs(niftyPct).toFixed(2)}%
                </span>
              </div>
              <p className="mt-0.5 text-[18px] leading-none font-extrabold text-white tabular-nums">
                {niftyNow.toLocaleString("en-IN", { maximumFractionDigits: 1 })}
              </p>
              <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="mt-1 h-7 w-full">
                <polyline
                  points={`0,40 ${chartPoints} 100,40`}
                  fill={niftyUp ? "rgba(200,241,105,0.14)" : "rgba(248,113,113,0.14)"}
                  stroke="none"
                />
                <polyline
                  points={chartPoints}
                  fill="none"
                  stroke={niftyUp ? "#c8f169" : "#f87171"}
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Scrolling live ticker */}
            <div className="mt-1.5 overflow-hidden rounded-full bg-black/30 ring-1 ring-white/10">
              <div className="marquee flex w-max gap-6 py-1 pr-6">
                {[...ticks, ...ticks].map((t, i) => (
                  <span key={i} className="flex items-center gap-1.5 whitespace-nowrap text-[11px] font-semibold">
                    <span className="text-white/75">{t.s}</span>
                    <span className="text-white tabular-nums">{t.p.toLocaleString("en-IN", { maximumFractionDigits: 1 })}</span>
                    <span className={t.d >= 0 ? "text-[#4ade80]" : "text-[#f87171]"}>
                      {t.d >= 0 ? "▲" : "▼"} {Math.abs(t.d).toFixed(2)}%
                    </span>
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-2.5 flex items-center justify-center gap-3">
              <button
                onClick={onWealth}
                className="flex items-center gap-2 rounded-full bg-[#c8f169] px-5 py-2 text-[13px] font-extrabold text-[#1a2e05] shadow-lg shadow-[#c8f169]/20 transition hover:brightness-105 active:scale-95"
              >
                Open Free Demat
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1.5 text-center text-[10.5px] text-white/50">
              5x leverage on intraday · Zero brokerage · SEBI registered
            </p>
          </div>
        </div>
        <div className="h-4 bg-gradient-to-b from-[#250b4d] to-transparent" />

        {/* ── Money Transfers ─────────────────────────── */}
        <div className="flex items-center justify-between px-4 pt-1 pb-2">
          <h2 className="text-[17px] font-bold text-white">Money Transfers</h2>
          <button
            onClick={() => setReferOpen(true)}
            className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#7c2d12] to-[#c2571f] px-3 py-1.5 text-[12px] font-bold text-white transition hover:brightness-110 active:scale-95"
          >
            <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#f97316] text-[10px] font-extrabold text-[#7c2d12]">
              ₹
            </span>
            Refer <ArrowRight className="h-3 w-3" /> ₹100
          </button>
        </div>

        <div className="mb-3 grid grid-cols-4 gap-1 px-3">
          {quickActions.map((a, i) => (
            <button
              key={i}
              onClick={a.onClick}
              className="group flex flex-col items-center gap-2 rounded-2xl p-2 transition active:scale-95"
            >
              <div className="transition-transform group-hover:-translate-y-1 group-hover:scale-105">
                {a.icon}
              </div>
              <span className="text-center text-[13.5px] font-medium leading-tight whitespace-pre-line text-white">
                {a.label}
              </span>
            </button>
          ))}
        </div>

        {/* Promo cards */}
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-4">
          {[
            { icon: "💵", tint: "bg-emerald-500/20", label: "Daily Mutual Fund SIP @ ₹10" },
            { icon: "💳", tint: "bg-orange-500/20", label: "Enjoy ₹0 Joining Fee Credit Card" },
            { icon: "🎁", tint: "bg-sky-500/20", label: "100+ rewards awaiting you" },
          ].map((p, i) => (
            <div
              key={i}
              className="flex min-w-[250px] items-center gap-2.5 rounded-xl border border-white/[0.06] bg-[#17171a] px-3 py-2.5 transition hover:border-white/15"
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-base ${p.tint}`}>
                {p.icon}
              </div>
              <span className="truncate text-[12.5px] font-medium text-white/90">{p.label}</span>
            </div>
          ))}
        </div>

        {/* Sections */}
        <div className="space-y-5 px-4 pb-6">
          <Section
            title="Recharge & Bills"
            tiles={[
              { label: "Mobile\nRecharge", icon: <IconMobileRecharge className="h-11 w-11" /> },
              { label: "Tuition\nFees", icon: <IconTuition className="h-11 w-11" /> },
              { label: "Electricity\nBill", icon: <IconElectricity className="h-11 w-11" /> },
              { label: "Loan\nRepayment", icon: <IconLoanRepay className="h-11 w-11" /> },
            ]}
            banner={{ text: "Book an LPG cylinder", icon: <IconLPG className="h-7 w-7" /> }}
          />

          <div className="h-px bg-white/5" />

          <Section
            title="Loans"
            delay={80}
            tiles={[
              { label: "Personal\nLoan", icon: <IconPersonalLoan className="h-11 w-11" /> },
              { label: "Mutual\nFunds Loan", icon: <IconMutualFunds className="h-11 w-11" /> },
              { label: "Gold\nLoan", icon: <IconGoldLoan className="h-11 w-11" /> },
              { label: "Credit\nScore", icon: <IconCreditScore className="h-11 w-11" /> },
            ]}
            banner={{ text: "MF loans starting 10% p.a.", icon: <IconMFLoan className="h-7 w-7" /> }}
          />

          <div className="h-px bg-white/5" />

          <Section
            title="Gold, Silver & Platinum"
            delay={120}
            tiles={[
              { label: "Daily Gold\nwith ₹10", icon: <IconDailyGold className="h-11 w-11" /> },
              { label: "Buy\nGold", icon: <IconBuyGold className="h-11 w-11" /> },
              { label: "Daily Silver\nwith ₹10", icon: <IconDailySilver className="h-11 w-11" /> },
              { label: "Buy\nPlatinum", icon: <IconBuyPlatinum className="h-11 w-11" /> },
            ]}
            banner={{ text: "Start savings in Gold at ₹10", icon: <IconGoldSave className="h-7 w-7" /> }}
          />

          {/* Rewards banner */}
          <div
            className="reveal relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#3d0d5c] via-[#5f259f] to-[#8b1c5c] p-4"
            data-reveal
          >
            <div className="relative z-10 max-w-[70%]">
              <p className="text-[12px] font-medium text-white/70">Did you know?</p>
              <div className="mt-1 flex items-center gap-2">
                <p className="text-[15px] font-bold text-white">100+ Rewards await you</p>
                <button className="flex h-6 w-6 items-center justify-center rounded-full bg-white transition hover:scale-110">
                  <ArrowRight className="h-3.5 w-3.5 text-[#5f259f]" />
                </button>
              </div>
            </div>
            <div className="absolute -right-2 -bottom-2 text-6xl">🎁</div>
            <div className="absolute top-2 right-16 text-lg">✨</div>
            <div className="absolute right-6 bottom-3 text-sm">✨</div>
            <div className="mt-4 flex gap-1">
              <div className="h-0.5 w-8 rounded-full bg-white" />
              <div className="h-0.5 w-8 rounded-full bg-white/30" />
              <div className="h-0.5 w-8 rounded-full bg-white/30" />
              <div className="h-0.5 w-8 rounded-full bg-white/30" />
            </div>
          </div>

          {/* Nearby stores + Wealth quick links */}
          <div className="space-y-2.5">
            <button
              onClick={onStores}
              className="flex w-full items-center gap-3 rounded-xl bg-[#17171a] px-4 py-3.5 transition hover:bg-[#1e1e22] active:scale-[0.99]"
            >
              <Storefront className="h-5 w-5 shrink-0 text-[#b39ddb]" />
              <span className="flex-1 text-left text-[13.5px] font-medium text-white/90">
                Nearby stores in Patan ka Bass
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-white/50" />
            </button>
            <button
              onClick={onWealth}
              className="flex w-full items-center gap-3 rounded-xl bg-[#17171a] px-4 py-3.5 transition hover:bg-[#1e1e22] active:scale-[0.99]"
            >
              <TrendingUp className="h-5 w-5 shrink-0 text-emerald-400" />
              <span className="flex-1 text-left text-[13.5px] font-medium text-white/90">
                Wealth — grow your money daily
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-white/50" />
            </button>
          </div>

          <div className="h-px bg-white/5" />

          <Section
            title="Insurance"
            delay={80}
            tiles={[
              { label: "Bike", icon: <IconBike className="h-11 w-11" /> },
              { label: "Car", icon: <IconCar className="h-11 w-11" /> },
              { label: "Health", icon: <IconHealth className="h-11 w-11" /> },
              { label: "LIC/Life", icon: <IconLife className="h-11 w-11" /> },
            ]}
          />

          <button
            onClick={onInsurance}
            className="flex w-full items-center justify-between rounded-xl bg-[#17171a] px-4 py-3.5 transition hover:bg-[#1e1e22]"
          >
            <span className="text-[13px] font-medium text-white/90">Explore all insurance</span>
            <ChevronRight className="h-4 w-4 text-white/60" />
          </button>
        </div>
        <div className="pb-4" />
      </div>

      {/* Refer & Earn sheet */}
      <BottomSheet open={referOpen} onClose={() => setReferOpen(false)} title="Refer & Earn">
        <div className="px-4 pt-2 text-center">
          <div className="mx-auto w-fit rounded-xl bg-[#1e1e22] px-7 py-3 ring-1 ring-[#c2571f]/40">
            <p className="text-[10px] font-semibold tracking-widest text-white/50">YOUR CODE</p>
            <p className="text-[20px] font-extrabold text-[#f9a86b]">DIGAMBAR100</p>
          </div>
          <p className="mx-auto mt-3 max-w-[260px] text-[12.5px] leading-relaxed text-white/60">
            Share this code — both of you get{" "}
            <span className="font-bold text-white">₹100</span> after their first ₹500 payment.
          </p>
          <button
            onClick={copyCode}
            className="mt-4 w-full rounded-xl bg-[#b39ddb] py-3 text-[14px] font-bold text-[#1a0b2e] transition hover:bg-[#c1b0e2] active:scale-[0.99]"
          >
            {copied ? "Code copied ✓" : "Copy Code"}
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}
