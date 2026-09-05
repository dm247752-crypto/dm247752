import { Bell, Clock, Home, HomeOutline, ScanGlyph, Search } from "./Icons";

export type Tab = "home" | "search" | "alerts" | "history";

interface Props {
  active: Tab;
  onNavigate: (tab: Tab) => void;
  onScan: () => void;
}

export default function BottomNav({ active, onNavigate, onScan }: Props) {
  const Item = ({
    id,
    label,
    icon,
  }: {
    id: Tab;
    label: string;
    icon: React.ReactNode;
  }) => {
    const isActive = active === id;
    return (
      <button
        onClick={() => onNavigate(id)}
        className={`group flex flex-1 flex-col items-center justify-center gap-1 py-2 transition ${
          isActive ? "text-white" : "text-white/60 hover:text-white"
        }`}
      >
        <span className="transition-transform group-hover:-translate-y-0.5">{icon}</span>
        <span className={`text-[11px] ${isActive ? "font-semibold" : "font-normal"}`}>{label}</span>
      </button>
    );
  };

  return (
    <div className="relative border-t border-white/5 bg-[#0c0c10] px-2 pt-1 pb-2">
      <div className="flex items-end">
        <Item
          id="home"
          label="Home"
          icon={active === "home" ? <Home className="h-6 w-6" /> : <HomeOutline className="h-6 w-6" />}
        />
        <Item id="search" label="Search" icon={<Search className="h-6 w-6" />} />

        <div className="relative -mt-6 flex flex-1 justify-center">
          <button
            onClick={onScan}
            className="qr-glow flex h-14 w-14 items-center justify-center rounded-full bg-[#9d4edd] transition-transform hover:scale-105 active:scale-95"
            aria-label="Scan"
          >
            <ScanGlyph className="h-7 w-7 text-white" />
          </button>
        </div>

        <Item id="alerts" label="Alerts" icon={<Bell className="h-6 w-6" />} />
        <Item id="history" label="History" icon={<Clock className="h-6 w-6" />} />
      </div>
      <div className="mx-auto mt-1 h-1 w-24 rounded-full bg-white/40" />
    </div>
  );
}
