import { BatteryLow, SignalBars } from "./Icons";

interface Props {
  time?: string;
  battery?: number;
  network?: string;
  tone?: "dark" | "light" | "green" | "purple" | "hero";
}

const TONES: Record<NonNullable<Props["tone"]>, { text: string; bg: string; border: string }> = {
  dark: { text: "text-white", bg: "bg-[#0b0b0d]", border: "border-white" },
  hero: { text: "text-white", bg: "bg-[#5b21b6]", border: "border-white" },
  purple: { text: "text-white", bg: "bg-[#3b1a5e]", border: "border-white" },
  green: { text: "text-white", bg: "bg-[#137243]", border: "border-white" },
  light: { text: "text-slate-900", bg: "bg-white", border: "border-slate-900" },
};

export default function StatusBar({
  time = "9:17",
  battery = 41,
  network = "4G",
  tone = "dark",
}: Props) {
  const s = TONES[tone];
  return (
    <div
      className={`flex h-8 shrink-0 items-center justify-between px-5 pt-1.5 text-[13px] font-semibold ${s.text} ${s.bg}`}
    >
      <span className="tabular-nums">{time}</span>
      <div className="flex items-center gap-1.5">
        <span
          className={`rounded-[3px] border px-1 text-[8px] font-bold leading-[10px] ${s.border} ${s.text}`}
        >
          VoLTE
        </span>
        <span className="text-[9px] font-bold">{network}</span>
        <SignalBars className="h-2.5 w-4" />
        <BatteryLow className="h-3 w-6" />
        <span className="tabular-nums">{battery}%</span>
      </div>
    </div>
  );
}
