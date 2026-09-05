export interface Merchant {
  name: string;
  sub: string;
  verified: boolean;
  kind: "upi" | "mobile" | "merchant";
  /** Pre-set amount encoded in the QR (upi://…&am=…) — shown exactly as-is, if present. */
  amount?: string;
}

export const KNOWN_MERCHANTS: { q: string; name: string; sub: string }[] = [
  { q: "9829012345", name: "Hazari Lal Meena", sub: "98290 12345" },
  { q: "9799234567", name: "Chhote Lal Meena", sub: "97992 34567" },
  { q: "9414012345", name: "Kamla Devi", sub: "94140 12345" },
  { q: "6377473840@pthdfc", name: "Digambar Meena", sub: "6377473840@pthdfc" },
  { q: "6377473840@ybl", name: "Digambar Meena", sub: "6377473840@ybl" },
  { q: "hazarilal@okaxis", name: "Hazari Lal Meena", sub: "hazarilal@okaxis" },
  { q: "chhotelal@ybl", name: "Chhote Lal Meena", sub: "chhotelal@ybl" },
  { q: "kamladevi@okhdfcbank", name: "Kamla Devi", sub: "kamladevi@okhdfcbank" },
];

export function prettyVpa(vpa: string): string {
  const local = (vpa.split("@")[0] ?? vpa).replace(/[._-]+/g, " ");
  return local
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, "");
  return d.length === 10 ? d.replace(/(\d{5})(\d{5})/, "$1 $2") : raw;
}

/** Resolve a typed mobile number / UPI ID to a known or inferred identity. */
export function resolveIdentity(raw: string): Merchant | null {
  const q = raw.replace(/[\s-]/g, "").toLowerCase();
  if (!q) return null;
  const hit = KNOWN_MERCHANTS.find((k) => k.q === q);
  if (hit) {
    return {
      name: hit.name,
      sub: hit.sub,
      verified: true,
      kind: /^\d{10}$/.test(q) ? "mobile" : "upi",
    };
  }
  if (/^\d{10}$/.test(q)) {
    return { name: "Verified Mobile User", sub: formatPhone(raw), verified: true, kind: "mobile" };
  }
  if (/^[\w.-]{2,}@[a-z]{2,}$/i.test(q)) {
    return { name: prettyVpa(raw), sub: raw, verified: true, kind: "upi" };
  }
  return null;
}

/* ── Internal: Extract all UPI params from a URI string ──────────── */

/** Decode all values — handles +, %20, %2B etc. */
function decodeVal(v: string): string {
  try {
    return decodeURIComponent(v.replace(/\+/g, " "));
  } catch {
    return v.replace(/\+/g, " ");
  }
}

/** Known param aliases used by different UPI apps */
const PA_ALIASES = ["pa", "vpa", "payeevpa", "payeeaddr", "payee_address"];
const PN_ALIASES = ["pn", "merchant", "payeename", "name", "payee_name", "mcc_name"];
const AM_ALIASES = ["am", "amount", "txnamount", "transactionamount"];
const TN_ALIASES = ["tn", "note", "transactionnote", "message"];

function extractFromQueryString(qs: string): { pa: string; pn: string; am: string; tn: string; raw: Map<string, string> } {
  // If there's a '?', we only want the part AFTER the '?' to correctly parse keys
  const queryPart = qs.includes("?") ? qs.slice(qs.indexOf("?") + 1) : qs;
  const raw = new URLSearchParams(queryPart);
  const map = new Map<string, string>();
  raw.forEach((value, key) => {
    const k = key.toLowerCase();
    const v = decodeVal(value);
    map.set(k, v);
  });

  const get = (aliases: string[]): string => {
    for (const alias of aliases) {
      const v = map.get(alias);
      if (v && v.trim()) return v.trim();
    }
    return "";
  };

  return {
    pa: get(PA_ALIASES),
    pn: get(PN_ALIASES),
    am: get(AM_ALIASES),
    tn: get(TN_ALIASES),
    raw: map,
  };
}

/** Try to extract a VPA-like pattern from plain text. */
function extractVpaFromText(text: string): string | null {
  // Match VPA pattern: something@something (e.g., shopname@okaxis, merchant@ybl)
  const vpaMatch = text.match(/[\w.+-]+@[a-zA-Z0-9._-]+/);
  return vpaMatch ? vpaMatch[0] : null;
}

/** Try to extract a 10-digit phone number from plain text. */
function extractPhoneFromText(text: string): string | null {
  const digits = text.replace(/\D/g, "");
  // Look for 10-digit Indian mobile number
  const phoneMatch = digits.match(/(\d{10})/);
  return phoneMatch ? phoneMatch[0] : null;
}

/* ── Parse raw QR text ───────────────────────────────────────────── */

/**
 * Parse ANY valid UPI QR text. Handles:
 * - upi://pay?pa=X&pn=X&am=X&... (standard)
 * - gpay://upi/... (Google Pay)
 * - paytm://... (Paytm)
 * - bharatqr://... (BharatQR)
 * - https://... links containing UPI params
 * - Plain VPA text like "merchant@okaxis"
 * - Plain phone numbers like "9829012345"
 * - Plain merchant name text (best-effort)
 */
export function parseScanned(text: string): Merchant {
  const t = text.trim();

  /* ── Step 1: Handle known URI schemes ─────────────── */

  // Standard UPI scheme: upi://pay?pa=...&pn=...
  if (/^upi:\/\//i.test(t)) {
    const qIdx = t.indexOf("?");
    const qs = qIdx >= 0 ? t.slice(qIdx + 1) : "";
    const { pa, pn, am, tn } = extractFromQueryString(qs);
    return buildResult(pa, pn, am, tn, t);
  }

  // Google Pay: gpay://upi/... or gpay://...?pa=...
  if (/^gpay:\/\//i.test(t)) {
    const qIdx = t.indexOf("?");
    const qs = qIdx >= 0 ? t.slice(qIdx + 1) : "";
    const { pa, pn, am, tn } = extractFromQueryString(qs);
    return buildResult(pa, pn, am, tn, t);
  }

  // Paytm: paytm://... or paytmqr://... or paytmmp://...
  if (/^paytm[a-z]*:\/\//i.test(t)) {
    const qIdx = t.indexOf("?");
    const qs = qIdx >= 0 ? t.slice(qIdx + 1) : "";
    const { pa, pn, am, tn } = extractFromQueryString(qs);
    return buildResult(pa, pn, am, tn, t);
  }

  // BHIM: bhim://...
  if (/^bhim:\/\//i.test(t)) {
    const qIdx = t.indexOf("?");
    const qs = qIdx >= 0 ? t.slice(qIdx + 1) : "";
    const { pa, pn, am, tn } = extractFromQueryString(qs);
    return buildResult(pa, pn, am, tn, t);
  }

  // BharatQR / generic https with UPI params
  if (/^https?:\/\//i.test(t)) {
    try {
      const url = new URL(t);
      // Check if the URL contains UPI-related params
      const pa = url.searchParams.get("pa") ?? url.searchParams.get("vpa") ?? "";
      const pn = url.searchParams.get("pn") ?? url.searchParams.get("merchant") ?? "";
      const am = url.searchParams.get("am") ?? url.searchParams.get("amount") ?? "";
      const tn = url.searchParams.get("tn") ?? "";
      if (pa || pn) {
        return buildResult(pa, pn, am, tn, t);
      }
      // Maybe the URL itself has a VPA embedded
      const vpaFromUrl = extractVpaFromText(url.hostname + url.pathname);
      if (vpaFromUrl) {
        return buildResult(vpaFromUrl, "", "", "", t);
      }
    } catch {
      // Not a valid URL, fall through
    }
  }

  /* ── Step 2: Plain text that looks like a UPI URI (no scheme) ─── */
  // e.g. "pa=merchant@okaxis&pn=Merchant+Name&am=500"
  if (t.includes("pa=") || t.includes("pn=")) {
    const qs = t.startsWith("?") ? t.slice(1) : t;
    const { pa, pn, am, tn } = extractFromQueryString(qs);
    if (pa || pn) return buildResult(pa, pn, am, tn, t);
  }

  /* ── Step 3: Check known merchants ───────────────── */
  const knownHit = resolveIdentity(t);
  if (knownHit) return knownHit;

  /* ── Step 4: Plain VPA in the text ────────────────── */
  const vpa = extractVpaFromText(t);
  if (vpa) {
    const knownVpa = resolveIdentity(vpa);
    if (knownVpa) return knownVpa;
    return {
      name: prettyVpa(vpa),
      sub: vpa,
      verified: true,
      kind: "upi",
    };
  }

  /* ── Step 5: Plain phone number ───────────────────── */
  const phone = extractPhoneFromText(t);
  if (phone) {
    const knownPhone = resolveIdentity(phone);
    if (knownPhone) return knownPhone;
    return {
      name: "Verified Mobile User",
      sub: formatPhone(phone),
      verified: true,
      kind: "mobile",
    };
  }

  /* ── Step 6: If the text itself looks like it might have merchant name info ── */
  // Some QR codes are just plain text with a name — try to use it
  if (t.length >= 2 && t.length <= 80 && !t.includes("http")) {
    // Could be a plain merchant name
    return {
      name: t.length > 30 ? t.slice(0, 30) : t,
      sub: t,
      verified: false,
      kind: "merchant",
    };
  }

  return {
    name: "Scanned Merchant",
    sub: t.length > 30 ? t.slice(0, 30) + "…" : t,
    verified: false,
    kind: "merchant",
  };
}

/* ── Helper: build Merchant from extracted UPI params ────────────── */

function buildResult(pa: string, pn: string, am: string, tn: string, raw: string): Merchant {
  const cleanPa = decodeVal(pa);
  const cleanPn = decodeVal(pn);
  const cleanAm = am.trim();
  const cleanTn = decodeVal(tn);

  // Extract merchant name from the most reliable source
  let name = "";
  let sub = "";

  if (cleanPn) {
    // We have an explicit merchant name from the QR — this is the best source
    name = cleanPn;
  } else if (cleanPa) {
    // No name in QR, infer from VPA
    name = prettyVpa(cleanPa);
  }

  if (cleanPa) {
    sub = cleanPa;
  } else {
    sub = raw.length > 40 ? raw.slice(0, 40) + "…" : raw;
  }

  // Validate amount
  const hasAmount = /^\d+(\.\d{1,2})?$/.test(cleanAm) && Number(cleanAm) > 0;

  // If name is still empty, try to extract from transaction note
  if (!name && cleanTn) {
    name = cleanTn.length > 30 ? cleanTn.slice(0, 30) : cleanTn;
  }

  return {
    name: name || "Scanned Merchant",
    sub,
    verified: true,
    kind: "upi",
    amount: hasAmount ? cleanAm : undefined,
  };
}

export const DEMO_MERCHANTS: { name: string; sub: string; amount?: string }[] = [
  { name: "Sharma Kirana Store", sub: "sharmakirana@okaxis", amount: "149" },
  { name: "Patan Pharmacy", sub: "patanpharma@ybl", amount: "230" },
  { name: "Meena Sweets & Namkeen", sub: "meenasweets@okhdfcbank" },
  { name: "Gupta Auto Garage", sub: "guptagarage@paytm", amount: "10" },
];
