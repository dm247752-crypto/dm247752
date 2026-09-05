import { useCallback, useEffect, useRef, useState } from "react";
import BottomNav, { type Tab } from "./components/BottomNav";
import PhoneFrame from "./components/PhoneFrame";
import {
  AlertsScreen,
  InsuranceScreen,
  SearchScreen,
  StoresScreen,
  WealthScreen,
} from "./screens/MiniScreens";
import ContactHistoryScreen from "./screens/ContactHistoryScreen";
import {
  BalancePinScreen,
  BalanceSuccessScreen,
  CheckBalanceScreen,
} from "./screens/BalanceFlow";
import DetailsScreen from "./screens/DetailsScreen";
import FailScreen from "./screens/FailScreen";
import HistoryScreen from "./screens/HistoryScreen";
import HomeScreen from "./screens/HomeScreen";
import MerchantCheckout from "./screens/MerchantCheckout";
import PinScreen from "./screens/PinScreen";
import ProcessingScreen from "./screens/ProcessingScreen";
import QRScanner from "./screens/QRScanner";
import SuccessScreen from "./screens/SuccessScreen";
import TransferForm from "./screens/TransferForm";
import { WalletProvider, useWallet, type Txn } from "./store/WalletContext";
import { playSuccessChime, resetChime } from "./utils/sound";
import type { Merchant } from "./utils/upi";

type Screen =
  | "home"
  | "scanner"
  | "checkout"
  | "transfer"
  | "pin"
  | "processing"
  | "greenflash"
  | "success"
  | "checkbalance"
  | "balancepin"
  | "balancesuccess"
  | "failed"
  | "details"
  | "contact"
  | "stores"
  | "insurance"
  | "wealth"
  | "search"
  | "alerts"
  | "history";

interface Draft {
  name: string;
  sub: string;
  /** Exact string the user typed — "500" | "1000" | "99.5" | "99.50". */
  amountStr: string;
  /** Numeric value — balance math only. */
  value: number;
}

const NAV_SCREENS: Screen[] = ["home", "search", "alerts", "history"];

/** 1-second full green screen with checkmark + date/time, then auto-proceeds to receipt */
function GreenFlash({ onDone }: { onDone: () => void }) {
  const [stamp] = useState(() => {
    const d = new Date();
    return {
      time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
      date: d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
    };
  });

  useEffect(() => {
    const t = setTimeout(onDone, 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-full flex-col items-center justify-center bg-[#1f7a3a]">
      <div className="pop flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg">
        <svg
          viewBox="0 0 24 24"
          className="h-11 w-11"
          fill="none"
          stroke="#1f7a3a"
          strokeWidth={3.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12l5 5L20 7" className="draw-check" />
        </svg>
      </div>
      <h1 className="mt-5 text-[22px] font-bold text-white">Payment Successful</h1>
      <p className="mt-1 text-[15px] font-medium text-[#facc15]">
        {stamp.date} at {stamp.time}
      </p>
    </div>
  );
}

function AppInner() {
  const { addTxn, balance, toast } = useWallet();
  const [screen, setScreen] = useState<Screen>("home");
  const [transferMode, setTransferMode] = useState<"mobile" | "upi">("mobile");
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [viewTxn, setViewTxn] = useState<Txn | null>(null); // txn shown on details screen
  const [contact, setContact] = useState<Txn | null>(null); // person on contact-history screen
  const [detailsOrigin, setDetailsOrigin] = useState<"success" | "history" | "contact">("history");
  const [willFail, setWillFail] = useState(false);
  const [preAmount, setPreAmount] = useState<string | undefined>(undefined); // from QR `am`
  const submittingRef = useRef(false); // duplicate-submission guard

  /* ── Payment flow ─────────────────────────────────── */
  const startPin = useCallback((d: Draft) => {
    resetChime(); // arm the one-shot success sound for this attempt
    submittingRef.current = false;
    setDraft(d);
    setScreen("pin");
  }, []);

  const handlePinSubmit = useCallback((pin: string) => {
    if (submittingRef.current) return; // block double-tap / duplicate submits
    submittingRef.current = true;
    setWillFail(pin === "000000");
    setScreen("processing");
  }, []);

  const handleProcessingDone = useCallback(
    (success: boolean) => {
      if (!submittingRef.current) return;
      submittingRef.current = false;
      if (success && draft) {
        // PERMANENT ledger write at the same moment as success chime / screen.
        // IndexedDB insert is durable (retry queue if disk fails). Never skipped offline.
        const created = addTxn({
          type: "sent",
          name: draft.name,
          sub: draft.sub,
          amount: draft.value,
          amountStr: draft.amountStr,
          bank: "sbi",
          live: true,
          category: "transfer",
          metadata: { channel: "in_app_upi", flow: "pin_confirmed" },
        });
        setViewTxn(created);
        playSuccessChime(); // exactly once per successful payment
        setScreen("greenflash"); // 1s green flash → then receipt
      } else {
        setScreen("failed"); // no sound, no deduction
      }
    },
    [draft, addTxn]
  );

  /* ── History navigation ───────────────────────────── */
  const openTxn = useCallback(
    (t: Txn) => {
      setViewTxn(t);
      setDetailsOrigin(screen === "contact" ? "contact" : "history");
      setScreen("details");
    },
    [screen]
  );

  const openContact = useCallback((t: Txn) => {
    setContact(t);
    setScreen("contact");
  }, []);

  const detailsBack = useCallback(() => {
    setScreen(
      detailsOrigin === "success" ? "success" : detailsOrigin === "contact" ? "contact" : "history"
    );
  }, [detailsOrigin]);

  const sendAgain = useCallback((t: Txn) => {
    setMerchant({ name: t.name, sub: t.sub, verified: true, kind: "upi" });
    setPreAmount(undefined);
    setScreen("checkout");
  }, []);

  /* Stable callback so the scanner's camera effect never restarts on re-render. */
  const handleMerchant = useCallback((m: Merchant) => {
    setMerchant(m);
    setPreAmount(m.amount); // auto-fill `am` from the QR, if present
    setScreen("checkout");
  }, []);

  const showBottomNav = NAV_SCREENS.includes(screen);
  const activeTab = (NAV_SCREENS.includes(screen) ? screen : "home") as Tab;
  // Smooth FADE between Pay → PIN → Connecting → Success; slide elsewhere.
  const wrapperAnim = ["pin", "processing", "greenflash", "success"].includes(screen) ? "fade-screen" : "screen-in";

  return (
    <PhoneFrame>
      <div className="relative flex h-full flex-col">
        <div key={screen} className={`${wrapperAnim} flex min-h-0 flex-1 flex-col overflow-hidden`}>
          {screen === "home" && (
            <HomeScreen
              onTransfer={(m) => {
                setTransferMode(m);
                setScreen("transfer");
              }}
              onScan={() => setScreen("scanner")}
              onCheckBalance={() => setScreen("checkbalance")}
              onInsurance={() => setScreen("insurance")}
              onStores={() => setScreen("stores")}
              onWealth={() => setScreen("wealth")}
            />
          )}
          {screen === "scanner" && (
            <QRScanner onBack={() => setScreen("home")} onMerchant={handleMerchant} />
          )}
          {screen === "checkout" && merchant && (
            <MerchantCheckout
              merchant={merchant}
              onBack={() => setScreen("scanner")}
              initialAmount={preAmount}
              onConfirm={(amountStr) =>
                startPin({ name: merchant.name, sub: merchant.sub, amountStr, value: Number(amountStr) })
              }
            />
          )}
          {screen === "transfer" && (
            <TransferForm
              mode={transferMode}
              onBack={() => setScreen("home")}
              onConfirm={(name, sub, amountStr) =>
                startPin({ name, sub, amountStr, value: Number(amountStr) })
              }
            />
          )}
          {screen === "pin" && draft && (
            <PinScreen amount={draft.amountStr} name={draft.name} onSubmit={handlePinSubmit} />
          )}
          {screen === "processing" && (
            <ProcessingScreen willFail={willFail} onDone={handleProcessingDone} />
          )}
          {screen === "greenflash" && <GreenFlash onDone={() => setScreen("success")} />}
          {screen === "checkbalance" && (
            <CheckBalanceScreen onBack={() => setScreen("home")} onBank={() => setScreen("balancepin")} />
          )}
          {screen === "balancepin" && (
            <BalancePinScreen onBack={() => setScreen("checkbalance")} onVerified={() => setScreen("balancesuccess")} />
          )}
          {screen === "balancesuccess" && (
            <BalanceSuccessScreen balance={balance} onDone={() => setScreen("home")} />
          )}
          {screen === "failed" && (
            <FailScreen
              onRetry={() => setScreen("pin")}
              onHome={() => {
                setDraft(null);
                setScreen("home");
              }}
            />
          )}
          {screen === "success" && draft && (
            <SuccessScreen
              name={draft.name}
              sub={draft.sub}
              amount={draft.amountStr}
              onDone={() => {
                setDraft(null);
                setScreen("home");
              }}
              onDetails={() => {
                setDetailsOrigin("success");
                setScreen("details");
              }}
            />
          )}
          {screen === "details" && viewTxn && (
            <DetailsScreen
              txn={viewTxn}
              onBack={detailsBack}
              onSendAgain={sendAgain}
              onHistory={() => setScreen("history")}
            />
          )}
          {screen === "contact" && contact && (
            <ContactHistoryScreen
              contact={contact}
              onBack={() => setScreen("history")}
              onOpen={openTxn}
              onContact={openContact}
            />
          )}
          {screen === "stores" && (
            <StoresScreen
              onPick={(s) => {
                setMerchant({ ...s, verified: true, kind: "upi" });
                setPreAmount(undefined);
                setScreen("checkout");
              }}
            />
          )}
          {screen === "insurance" && <InsuranceScreen />}
          {screen === "wealth" && <WealthScreen />}
          {screen === "search" && <SearchScreen onOpen={openTxn} onContact={openContact} />}
          {screen === "alerts" && <AlertsScreen />}
          {screen === "history" && <HistoryScreen onOpen={openTxn} onContact={openContact} />}
        </div>

        {showBottomNav && (
          <BottomNav active={activeTab} onNavigate={setScreen} onScan={() => setScreen("scanner")} />
        )}

        {/* Global durable-save toast (e.g. "Saving history…") */}
        {toast && (
          <div className="fade-in pointer-events-none absolute bottom-24 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-[#1c1c24] px-4 py-2 text-[12px] font-semibold text-white shadow-lg ring-1 ring-white/10">
            {toast}
          </div>
        )}
      </div>
    </PhoneFrame>
  );
}

export default function App() {
  return (
    <WalletProvider>
      <AppInner />
    </WalletProvider>
  );
}
