import { useEffect, useState } from "react";

interface Props {
  willFail: boolean;
  onDone: (success: boolean) => void;
}

/**
 * Full-screen dark "Connecting Securely" loader.
 * 3 seconds → fires onDone exactly once.
 * Back button blocked.
 */
export default function ProcessingScreen({ willFail, onDone }: Props) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (done) return;
      setDone(true);
      onDone(!willFail);
    }, 3000);

    const onPop = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", onPop);

    return () => {
      clearTimeout(t);
      window.removeEventListener("popstate", onPop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-full flex-col bg-[#0b0b0d]">
      <div className="flex flex-1 flex-col items-center justify-center px-8">
        {/* Bigger lavender pill loader */}
        <div className="relative h-10 w-32 overflow-hidden rounded-full bg-[#1e1235]">
          <span className="loader-dot absolute top-1.5 left-1.5 h-7 w-7 rounded-full bg-[#9d4edd]" />
        </div>
        <p className="mt-6 text-[18px] font-bold tracking-tight text-white">
          Connecting Securely
        </p>
      </div>

      <p className="pb-6 text-center text-[12px] text-white/50">
        Note: Do not press back or close the app
      </p>

      <div className="flex justify-center bg-[#0b0b0d] pb-2">
        <div className="h-1 w-24 rounded-full bg-white/20" />
      </div>
    </div>
  );
}
