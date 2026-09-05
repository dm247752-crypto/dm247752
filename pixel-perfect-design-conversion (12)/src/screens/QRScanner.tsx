import { useCallback, useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { BHIMLogo, ChevronLeft, QRIcon, Torch, UPILogo, UploadImage } from "../components/Icons";
import { playScanBeep } from "../utils/sound";
import type { Merchant } from "../utils/upi";
import { parseScanned } from "../utils/upi";

interface NativeBarcodeDetector {
  detect: (source: HTMLVideoElement | HTMLCanvasElement | ImageBitmap) => Promise<{ rawValue: string }[]>;
}

type BarcodeDetectorConstructor = new (options?: { formats?: string[] }) => NativeBarcodeDetector;

const CAMERA_CONSTRAINTS: MediaStreamConstraints[] = [
  {
    video: {
      facingMode: { exact: "environment" },
      width: { ideal: 1280 },
      height: { ideal: 720 },
    },
    audio: false,
  },
  {
    video: {
      facingMode: { ideal: "environment" },
      width: { ideal: 1280 },
      height: { ideal: 720 },
    },
    audio: false,
  },
  { video: { facingMode: "environment" }, audio: false },
  { video: true, audio: false },
];

function cameraErrorMessage(error: unknown): string {
  const name = error instanceof DOMException ? error.name : "CameraError";
  const ua = navigator.userAgent || "";
  const inWebView =
    /; ?wv\)/i.test(ua) || /Median|GoNative/i.test(ua) || !!(window as unknown as { median?: unknown }).median;
  if (!window.isSecureContext) {
    return "Camera needs HTTPS. Open the app from Netlify/Median HTTPS, not a local file or http link.";
  }
  if (inWebView && (name === "NotAllowedError" || name === "SecurityError" || name === "CameraError")) {
    return "This app's WebView is blocking the camera even though the Android app permission is Allowed. In your Median.co dashboard, open the app → Native Features / Permissions and turn ON Camera access, then rebuild and reinstall the APK. A phone-level permission alone does not unlock camera for WebView apps.";
  }
  if (name === "NotAllowedError" || name === "SecurityError") {
    return "Camera permission is blocked for this site/app. Open Chrome site settings and allow Camera, then tap Enable Camera.";
  }
  if (name === "NotFoundError" || name === "OverconstrainedError") {
    return "Back camera not found. Trying any available camera failed.";
  }
  if (name === "NotReadableError" || name === "AbortError") {
    return "Camera is busy in another app. Close other camera apps and try again.";
  }
  return "Camera could not start. Tap Enable Camera or upload a QR image.";
}

interface Props {
  onBack: () => void;
  onMerchant: (m: Merchant) => void;
}

/**
 * Universal UPI QR scanner — real camera (jsQR real-time decode), torch,
 * gallery upload, permission handling and instant auto-navigation to Pay.
 */
export default function QRScanner({ onBack, onMerchant }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<NativeBarcodeDetector | null>(null);
  const foundRef = useRef<Merchant | null>(null);
  const lastScan = useRef(0);
  const navTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [camError, setCamError] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [torchOk, setTorchOk] = useState(true);
  const [found] = useState<Merchant | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanStatus, setScanStatus] = useState("Starting camera…");
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Beep + vibrate, flash a "detected" state, then navigate to Pay instantly. */
  const markFound = useCallback(
    (m: Merchant) => {
      if (foundRef.current) return;
      foundRef.current = m;
      navigator.vibrate?.(120);
      playScanBeep();
      onMerchant(m);
    },
    [onMerchant]
  );

  const startCamera = useCallback(async () => {
    setCamError(false);
    setCameraOn(false);
    setError(null);
    setScanStatus("Starting camera…");
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setScanStatus("Camera API unavailable in this browser/WebView");
      setError("This browser/WebView does not expose camera access. Use HTTPS Chrome or enable Camera permission in Median.");
      setCamError(true);
      return;
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    const video = videoRef.current;
    if (!video) return;
    let lastError: unknown = null;
    try {
      // Prefer Android's native accelerated QR detector when the browser exposes it.
      // Its absence or constructor failure must never stop the jsQR camera fallback.
      try {
        const Detector = (window as unknown as { BarcodeDetector?: BarcodeDetectorConstructor })
          .BarcodeDetector;
        detectorRef.current = Detector ? new Detector({ formats: ["qr_code"] }) : null;
      } catch {
        detectorRef.current = null;
      }
      let stream: MediaStream | null = null;
      for (const constraints of CAMERA_CONSTRAINTS) {
        try {
          stream = await navigator.mediaDevices.getUserMedia(constraints);
          break;
        } catch (e) {
          lastError = e;
        }
      }
      if (!stream) throw lastError ?? new Error("No camera stream");
      streamRef.current = stream;
      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;
      video.srcObject = stream;
      video.setAttribute("playsinline", "true");
      video.setAttribute("autoplay", "true");
      await video.play();
      setCameraOn(true);
      setScanStatus("Scanning for any UPI QR…");
      retryCountRef.current = 0;
    } catch (e) {
      const msg = cameraErrorMessage(e ?? lastError);
      setScanStatus(msg);
      setError(msg);
      setCamError(true); // permission denied / no camera → graceful prompt card

      // Cold-start WebViews / camera HAL sometimes fail the FIRST request even when
      // permission is truly granted. Silently auto-retry a few times before giving up.
      if (retryCountRef.current < 3) {
        retryCountRef.current += 1;
        retryTimerRef.current = setTimeout(() => {
          void startCamera();
        }, 1200 * retryCountRef.current);
      }
    }
  }, []);

  /* Auto-retry when the page/app regains focus — covers the common case where the
     user leaves to Settings, grants Camera permission, then comes back. */
  useEffect(() => {
    const retryIfNeeded = () => {
      if (document.visibilityState === "visible" && camError && !foundRef.current) {
        void startCamera();
      }
    };
    document.addEventListener("visibilitychange", retryIfNeeded);
    window.addEventListener("focus", retryIfNeeded);
    return () => {
      document.removeEventListener("visibilitychange", retryIfNeeded);
      window.removeEventListener("focus", retryIfNeeded);
    };
  }, [camError, startCamera]);

  /* Watch the Permissions API (where supported) and auto-restart the instant it flips to granted. */
  useEffect(() => {
    let status: PermissionStatus | null = null;
    const onChange = () => {
      if (status?.state === "granted" && camError) void startCamera();
    };
    navigator.permissions
      ?.query({ name: "camera" as PermissionName })
      .then((s) => {
        status = s;
        s.addEventListener("change", onChange);
      })
      .catch(() => {});
    return () => status?.removeEventListener("change", onChange);
  }, [camError, startCamera]);

  /* Real-time continuous frame analysis */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let raf = 0;
    let alive = true;
    let scanBusy = false;

    const decodeFrame = async () => {
      if (scanBusy || foundRef.current || video.readyState < 2 || !video.videoWidth) return;
      scanBusy = true;
      try {
        // Chrome/Android's hardware scanner is substantially faster and more reliable.
        if (detectorRef.current) {
          const detected = await detectorRef.current.detect(video);
          if (detected[0]?.rawValue) {
            markFound(parseScanned(detected[0].rawValue));
            return;
          }
        }

        // Portable fallback: resize the video frame before jsQR analysis. Large native
        // camera frames otherwise make scanning too slow on entry-level Android phones.
        const canvas = canvasRef.current;
        if (!canvas) return;
        const maxSide = 960;
        const scale = Math.min(1, maxSide / Math.max(video.videoWidth, video.videoHeight));
        canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
        canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(img.data, img.width, img.height, { inversionAttempts: "attemptBoth" });
        if (code?.data) markFound(parseScanned(code.data));
      } catch {
        // A detector can throw for an in-flight video frame; continue scanning.
      } finally {
        scanBusy = false;
      }
    };

    const tick = () => {
      if (!alive || foundRef.current) return;
      raf = requestAnimationFrame(tick);
      const now = performance.now();
      if (now - lastScan.current < 115 || video.readyState < 2 || !video.videoWidth) return;
      lastScan.current = now;
      void decodeFrame();
    };

    void startCamera();
    tick();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (navTimer.current) clearTimeout(navTimer.current);
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, [markFound, startCamera]);

  /* Torch — toggles the real camera LED if the hardware supports it */
  const toggleTorch = useCallback(async () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track) return;
    try {
      const caps = (track.getCapabilities ? track.getCapabilities() : {}) as { torch?: boolean };
      if (!caps.torch) {
        setTorchOk(false);
        return;
      }
      const next = !torchOn;
      await track.applyConstraints({
        advanced: [{ torch: next }] as unknown as MediaTrackConstraintSet[],
      });
      setTorchOn(next);
    } catch {
      setTorchOk(false);
    }
  }, [torchOn]);

  /* Gallery upload → decode the QR from the image (with upscale attempts) */
  const decodeImage = useCallback(
    (file: File) => {
      setError(null);
      const url = URL.createObjectURL(file);
      const img = new Image();
      const run = (w: number, h: number): boolean => {
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return false;
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(img, 0, 0, w, h);
        const data = ctx.getImageData(0, 0, w, h);
        const code = jsQR(data.data, w, h, { inversionAttempts: "attemptBoth" });
        if (code?.data) {
          markFound(parseScanned(code.data));
          return true;
        }
        return false;
      };
      img.onload = () => {
        const max = Math.max(img.width, img.height);
        const attempts: [number, number][] =
          max > 900
            ? [
                [Math.round((900 * img.width) / max), Math.round((900 * img.height) / max)],
                [img.width, img.height],
              ]
            : [
                [img.width * 2, img.height * 2], // upscale tiny screenshots
                [img.width, img.height],
              ];
        let ok = false;
        for (const [w, h] of attempts) {
          ok = run(w, h);
          if (ok) break;
        }
        if (!ok) setError("No QR code found in that image. Try a clearer photo.");
        URL.revokeObjectURL(url);
      };
      img.onerror = () => {
        setError("Could not read that image.");
        URL.revokeObjectURL(url);
      };
      img.src = url;
    },
    [markFound]
  );



  return (
    <div className="relative h-full overflow-hidden bg-black">
      <video
        ref={videoRef}
        playsInline
        muted
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
          found ? "opacity-20" : "opacity-100"
        }`}
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Dark overlay with a clear viewfinder cutout + Controls below it */}
      {!found && !camError && (
        <>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="relative h-60 w-60 rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]">
              <div className="absolute top-0 left-0 h-10 w-10 rounded-tl-2xl border-t-4 border-l-4 border-[#b39ddb]" />
              <div className="absolute top-0 right-0 h-10 w-10 rounded-tr-2xl border-t-4 border-r-4 border-[#b39ddb]" />
              <div className="absolute bottom-0 left-0 h-10 w-10 rounded-bl-2xl border-b-4 border-l-4 border-[#b39ddb]" />
              <div className="absolute right-0 bottom-0 h-10 w-10 rounded-br-2xl border-r-4 border-b-4 border-[#b39ddb]" />
              {cameraOn && <div className="scan-line" />}
            </div>
          </div>

          {/* Interactive controls row directly below the viewfinder cutout box */}
          <div className="absolute left-0 right-0 top-[calc(50%+140px)] z-10 flex justify-center gap-6">
            <button
              onClick={toggleTorch}
              disabled={!torchOk}
              aria-label="Torch"
              className={`flex h-12 w-12 items-center justify-center rounded-full backdrop-blur transition active:scale-90 disabled:opacity-40 ${
                torchOn ? "bg-[#fbbf24] text-black" : "bg-black/45 text-white ring-1 ring-white/10"
              }`}
            >
              <Torch on={torchOn} className="h-5 w-5" />
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              aria-label="Upload QR from gallery"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition active:scale-90 ring-1 ring-white/10"
            >
              <UploadImage className="h-5 w-5" />
            </button>
          </div>
        </>
      )}

      {/* Top header: back · title */}
      <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between px-3 pt-3">
        <button
          onClick={onBack}
          aria-label="Close scanner"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition hover:bg-black/60 active:scale-95"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="pt-1.5 text-center">
          <p className="text-[20px] font-bold text-white drop-shadow">Scan any QR</p>
          <p className="mt-0.5 text-[13px] text-white/70">
            PhonePe • Google Pay • Paytm • BHIM • Merchants
          </p>
        </div>
        <div className="h-10 w-10" />
      </div>

      {/* Bottom hint + BHIM & UPI logos */}
      {!found && !camError && (
        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-4 px-10 pb-10">
          {error && (
            <p className="fade-in rounded-lg bg-red-500/25 px-3 py-1.5 text-center text-[12px] font-medium text-red-300">
              {error}
            </p>
          )}
          <div className="text-center">
            <p className="text-[13px] leading-relaxed text-white/85 drop-shadow">
              {cameraOn
                ? "Point your camera at any UPI QR code — we'll detect the merchant & amount instantly"
                : "Starting your camera…"}
            </p>
            <p className="mt-1 text-[11px] text-[#d8c5f4]">{scanStatus}</p>
          </div>

          {/* BHIM and UPI logos inline */}
          <div className="mt-2 flex items-center justify-center gap-3 opacity-90">
            <BHIMLogo className="h-8 w-20 shrink-0" />
            <div className="h-5 w-px bg-white/20 shrink-0" />
            <UPILogo className="h-8 w-18 shrink-0" />
          </div>
        </div>
      )}

      {/* Camera permission card (without demo merchant) */}
      {camError && !found && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/85 px-6">
          <div className="fade-up w-full rounded-2xl bg-[#17171a] p-5 text-center ring-1 ring-white/10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#26262c]">
              <QRIcon className="h-6 w-6 text-[#b39ddb]" />
            </div>
            <h3 className="mt-3 text-[17px] font-bold text-white">Camera access needed</h3>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/60">
              {error || "Allow camera permission in your browser or device settings to scan QR codes, then try again."}
            </p>
            <p className="mt-2 rounded-lg bg-white/5 px-3 py-2 text-[11px] leading-relaxed text-white/45">
              Android tip: open Chrome → site settings → Camera → Allow. In Median APK, enable
              Camera permission in app settings and rebuild the APK.
            </p>
            <button
              onClick={() => void startCamera()}
              className="mt-4 w-full rounded-xl bg-[#9d4edd] py-3 text-[14px] font-bold text-white transition hover:brightness-110 active:scale-[0.98]"
            >
              Enable Camera
            </button>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => fileRef.current?.click()}
                className="flex-1 rounded-xl bg-white/5 py-3 text-[12.5px] font-semibold text-white/80 transition hover:bg-white/10"
              >
                Upload QR image
              </button>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) decodeImage(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
