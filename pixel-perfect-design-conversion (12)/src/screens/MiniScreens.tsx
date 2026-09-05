import { useState } from "react";
import {
  ArrowDownLeft,
  ArrowRight,
  Bell,
  IconBike,
  IconCar,
  IconDailyGold,
  IconHealth,
  IconLife,
  MapPin,
  Search,
  Storefront,
  TrendingUp,
} from "../components/Icons";
import TxnRow from "../components/TxnRow";
import { useWallet, type Txn } from "../store/WalletContext";

/* ---------------- SEARCH ---------------- */
export function SearchScreen({
  onOpen,
  onContact,
}: {
  onOpen: (t: Txn) => void;
  onContact: (t: Txn) => void;
}) {
  const { transactions } = useWallet();
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const list = transactions.filter(
    (t) =>
      !query ||
      t.name.toLowerCase().includes(query) ||
      t.sub.toLowerCase().includes(query) ||
      t.amountStr.includes(query)
  );

  return (
    <div className="no-scrollbar h-full overflow-y-auto bg-[#0d0d12]">
      <div className="px-4 pt-2 pb-4">
        <h1 className="text-[26px] font-bold text-white">Search</h1>
        <div className="mt-3 flex items-center gap-3 rounded-full bg-[#1c1c24] px-4 py-3 transition focus-within:ring-2 focus-within:ring-[#8b1abf]/60">
          <Search className="h-5 w-5 shrink-0 text-white/60" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search people, UPI IDs, amounts…"
            className="w-full bg-transparent text-[14px] text-white outline-none placeholder:text-white/40"
          />
        </div>
      </div>

      <p className="mb-1 px-5 text-[11px] font-semibold tracking-widest text-white/40 uppercase">
        {query ? "Results" : "Recent activity"}
      </p>
      <div className="px-1 pb-6">
        {list.map((t) => (
          <TxnRow key={t.id} txn={t} onOpen={onOpen} onContact={onContact} />
        ))}
        {list.length === 0 && (
          <p className="px-2 py-8 text-center text-[13px] text-white/40">Nothing found for “{q}”</p>
        )}
      </div>
    </div>
  );
}

/* ---------------- ALERTS ---------------- */
export function AlertsScreen() {
  const items = [
    {
      icon: <ArrowDownLeft className="h-5 w-5 text-emerald-400" />,
      title: "Payment received",
      sub: "₹1,500 from Chhote Lal Meena",
      time: "Today · 09:12",
    },
    {
      icon: <span className="text-lg">🪙</span>,
      title: "Cashback earned",
      sub: "10 coins on your kirana purchase",
      time: "Yesterday",
    },
    {
      icon: <span className="text-lg">📈</span>,
      title: "Trade with 5x leverage",
      sub: "Now live on share.market — start with ₹100",
      time: "19 Jun",
    },
    {
      icon: <span className="text-lg">🎁</span>,
      title: "100+ rewards unlocked",
      sub: "Redeem them in the rewards store",
      time: "18 Jun",
    },
  ];

  return (
    <div className="no-scrollbar h-full overflow-y-auto">
      <div className="flex items-center justify-between px-4 pt-2 pb-4">
        <h1 className="text-[26px] font-bold text-white">Alerts</h1>
        <Bell className="h-6 w-6 text-white/60" />
      </div>
      <div className="space-y-2.5 px-4 pb-6">
        {items.map((a, i) => (
          <div
            key={i}
            className="fade-up flex items-start gap-3 rounded-2xl bg-[#17171a] p-3.5 transition hover:bg-[#1e1e22]"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#26262c]">
              {a.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-bold text-white">{a.title}</p>
              <p className="mt-0.5 text-[12px] leading-snug text-white/55">{a.sub}</p>
            </div>
            <span className="shrink-0 text-[10px] text-white/40">{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- STORES ---------------- */
const STORES = [
  { name: "Sharma Kirana Store", cat: "Groceries", dist: "0.2 km", vpa: "sharmakirana@okaxis" },
  { name: "Patan Pharmacy", cat: "Pharmacy", dist: "0.4 km", vpa: "patanpharma@ybl" },
  { name: "Meena Sweets & Namkeen", cat: "Sweets", dist: "0.6 km", vpa: "meenasweets@okhdfcbank" },
  { name: "Gupta Auto Garage", cat: "Services", dist: "0.9 km", vpa: "guptagarage@paytm" },
  { name: "Alwar Petrol Pump", cat: "Fuel", dist: "1.2 km", vpa: "alwarbpcl@okicici" },
];

export function StoresScreen({ onPick }: { onPick: (s: { name: string; sub: string }) => void }) {
  return (
    <div className="no-scrollbar h-full overflow-y-auto">
      <div className="px-4 pt-2 pb-4">
        <h1 className="text-[26px] font-bold text-white">Stores</h1>
        <p className="mt-1 flex items-center gap-1.5 text-[12px] text-white/55">
          <MapPin className="h-3.5 w-3.5" /> Patan ka Bass, Alwar
        </p>
      </div>
      <div className="space-y-2.5 px-4 pb-6">
        {STORES.map((s, i) => (
          <div
            key={s.name}
            className="fade-up flex items-center gap-3 rounded-2xl bg-[#17171a] p-3.5 transition hover:bg-[#1e1e22]"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#26262c]">
              <Storefront className="h-6 w-6 text-[#b39ddb]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-bold text-white">{s.name}</p>
              <p className="text-[11px] text-white/50">
                {s.cat} · {s.dist} away
              </p>
            </div>
            <button
              onClick={() => onPick({ name: s.name, sub: s.vpa })}
              className="rounded-full bg-[#b39ddb] px-4 py-2 text-[12px] font-bold text-[#1a0b2e] transition hover:bg-white active:scale-95"
            >
              Pay
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- INSURANCE ---------------- */
export function InsuranceScreen() {
  const tiles = [
    { label: "Bike", icon: <IconBike className="h-11 w-11" /> },
    { label: "Car", icon: <IconCar className="h-11 w-11" /> },
    { label: "Health", icon: <IconHealth className="h-11 w-11" /> },
    { label: "LIC/Life", icon: <IconLife className="h-11 w-11" /> },
  ];
  return (
    <div className="no-scrollbar h-full overflow-y-auto">
      <div className="px-4 pt-2 pb-4">
        <h1 className="text-[26px] font-bold text-white">Insurance</h1>
        <p className="mt-1 text-[12px] text-white/55">Protection plans starting at ₹250/month</p>
      </div>
      <div className="grid grid-cols-4 gap-2 px-4">
        {tiles.map((t, i) => (
          <button
            key={t.label}
            className="group fade-up flex flex-col items-center gap-1.5 rounded-2xl bg-[#17171a] p-3 transition hover:bg-[#1e1e22] active:scale-95"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="transition-transform group-hover:scale-110">{t.icon}</div>
            <span className="text-[12px] font-medium text-white/90">{t.label}</span>
          </button>
        ))}
      </div>
      <div className="px-4 mt-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#3d0d5c] to-[#8b1c5c] p-4">
          <p className="text-[12px] font-medium text-white/70">Get insured in 60 seconds</p>
          <p className="mt-1 text-[16px] font-bold text-white">Instant quotes, paperless policies</p>
          <button className="mt-3 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12px] font-bold text-[#5f259f] transition hover:scale-105 active:scale-95">
            Get a Quote <ArrowRight className="h-3.5 w-3.5" />
          </button>
          <div className="absolute -right-3 -bottom-3 text-6xl opacity-80">🛡️</div>
        </div>
        <div className="mt-3 flex items-center justify-between rounded-xl bg-[#17171a] px-4 py-3.5">
          <div>
            <p className="text-[13px] font-semibold text-white">Compare 14 insurers</p>
            <p className="text-[11px] text-white/45">Accident · Health · Vehicle · Life</p>
          </div>
          <span className="text-[12px] font-bold text-[#b39ddb]">Explore</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- WEALTH ---------------- */
export function WealthScreen() {
  const products = [
    { title: "Daily Gold", sub: "Start with just ₹10", tag: "24K" },
    { title: "Mutual Fund SIP", sub: "From ₹10 / day", tag: "SIP" },
    { title: "NPS +", sub: "Retire happily", tag: "NPS" },
  ];
  return (
    <div className="no-scrollbar h-full overflow-y-auto">
      <div className="px-4 pt-2 pb-4">
        <h1 className="text-[26px] font-bold text-white">Wealth</h1>
        <p className="mt-1 text-[12px] text-white/55">Grow your money, one day at a time</p>
      </div>

      <div className="px-4">
        <div className="fade-up relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#5f259f] via-[#3d0d5c] to-[#1a0b2e] p-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold tracking-widest text-white/60 uppercase">
              Estimated Value
            </p>
            <TrendingUp className="h-4 w-4 text-emerald-300" />
          </div>
          <p className="mt-2 text-[28px] font-bold text-white tabular-nums">₹12,340.50</p>
          <p className="text-[12px] font-semibold text-emerald-300">+ ₹142.30 (1.17%) today</p>
          <div className="absolute -right-4 -bottom-4 h-28 w-28 rounded-full bg-[#b39ddb]/20 blur-2xl" />
        </div>
      </div>

      <div className="mt-4 space-y-2.5 px-4 pb-6">
        {products.map((p, i) => (
          <div
            key={p.title}
            className="fade-up flex items-center gap-3 rounded-2xl bg-[#17171a] p-3.5 transition hover:bg-[#1e1e22]"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#26262c]">
              <IconDailyGold className="h-8 w-8" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-bold text-white">{p.title}</p>
              <p className="text-[11px] text-white/50">{p.sub}</p>
            </div>
            <button className="rounded-full bg-[#b39ddb] px-4 py-2 text-[12px] font-bold text-[#1a0b2e] transition hover:bg-white active:scale-95">
              Start
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
