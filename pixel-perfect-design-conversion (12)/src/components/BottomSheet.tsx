import type { ReactNode } from "react";
import { Close } from "./Icons";

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function BottomSheet({ open, onClose, title, children }: Props) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-40">
      <div className="fade-in absolute inset-0 bg-black/65 backdrop-blur-[2px]" onClick={onClose} />
      <div className="sheet-up absolute inset-x-0 bottom-0 max-h-[85%] overflow-y-auto rounded-t-3xl bg-[#17171a] pb-5 ring-1 ring-white/10">
        <div className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-white/20" />
        {title && (
          <div className="flex items-center justify-between px-4 pt-3">
            <h2 className="text-[16px] font-bold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/70 transition hover:bg-white/10"
            >
              <Close className="h-4 w-4" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
