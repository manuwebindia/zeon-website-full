"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { FaTimes, FaWhatsapp, FaTag, FaChevronUp } from "react-icons/fa";

const DEFAULT_POPUP = {
  enabled: true,
  delaySeconds: 2,
  durationMinutes: 5,
  badgeText: "Limited Time Offer",
  headline: "Get",
  headlineAccent: "₹3,000 OFF",
  subtitle: "on Your Digital Marketing Course",
  description: "Use code at enquiry — seats are limited!",
  offerCode: "OFFER-2026",
  ctaText: "Claim Offer on WhatsApp",
  secondaryCtaText: "Not Now",
  footerText: "No spam · Code sent instantly via WhatsApp",
  whatsappPhone: "917558888252",
  miniBannerText: "Exclusive Offer Expiring Soon!",
  miniBannerTextMobile: "Offer Expiring Soon!",
  miniBannerCta: "CLAIM",
};

const LS_EXPIRE_KEY = "zeon_offer_expiry";
const LS_MINI_KEY = "zeon_offer_minimised";

function formatTime(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function OfferPopup() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const [mounted, setMounted] = useState(false);
  const [popupConfig, setPopupConfig] = useState(DEFAULT_POPUP);
  const [showPopup, setShowPopup] = useState(false);
  const [minimised, setMinimised] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_POPUP.durationMinutes * 60 * 1000);
  const [expired, setExpired] = useState(false);
  const [pulseMini, setPulseMini] = useState(false);

  const intervalRef = useRef(null);
  const pulseTimer = useRef(null);

  const durationMs = (popupConfig.durationMinutes || 5) * 60 * 1000;
  const popupDelayMs = (popupConfig.delaySeconds ?? 2) * 1000;

  const buildWhatsAppUrl = useCallback(() => {
    const msg = `Hi! I'd like to claim my exclusive offer using code *${popupConfig.offerCode}*. Could you please share the details about the Digital Marketing course and next batch schedule?`;
    return `https://wa.me/${popupConfig.whatsappPhone}?text=${encodeURIComponent(msg)}`;
  }, [popupConfig.offerCode, popupConfig.whatsappPhone]);

  useEffect(() => {
    setMounted(true);
    if (isAdmin) return;

    fetch("/api/offers?type=popup")
      .then((res) => res.json())
      .then((data) => {
        if (data?.popup) {
          setPopupConfig({ ...DEFAULT_POPUP, ...data.popup });
          setTimeLeft((data.popup.durationMinutes || 5) * 60 * 1000);
        }
      })
      .catch(() => {});
  }, [isAdmin]);

  useEffect(() => {
    if (!mounted || !popupConfig.enabled || isAdmin) return;

    const todayStr = new Date().toDateString();

    if (localStorage.getItem("zeon_offer_last_closed_date") === todayStr) {
      setDismissed(true);
      return;
    }

    if (localStorage.getItem("zeon_offer_last_shown_date") === todayStr) {
      if (localStorage.getItem(LS_MINI_KEY) === "1") {
        setMinimised(true);
        const expiry = Number(localStorage.getItem(LS_EXPIRE_KEY));
        const remaining = expiry - Date.now();
        if (remaining <= 0) {
          setExpired(true);
          setTimeLeft(0);
        } else {
          setTimeLeft(remaining);
        }
      } else {
        setDismissed(true);
      }
      return;
    }

    setTimeLeft(durationMs);

    const delay = setTimeout(() => {
      setShowPopup(true);
      localStorage.setItem("zeon_offer_last_shown_date", todayStr);
      localStorage.setItem(LS_EXPIRE_KEY, String(Date.now() + durationMs));
    }, popupDelayMs);

    return () => clearTimeout(delay);
  }, [mounted, popupConfig.enabled, durationMs, popupDelayMs, isAdmin]);

  useEffect(() => {
    if (dismissed || expired) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1000;
        if (next <= 0) {
          clearInterval(intervalRef.current);
          setExpired(true);
          localStorage.removeItem(LS_MINI_KEY);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [dismissed, expired]);

  useEffect(() => {
    if (!minimised) return;
    const schedPulse = () => {
      setPulseMini(true);
      pulseTimer.current = setTimeout(() => {
        setPulseMini(false);
        pulseTimer.current = setTimeout(schedPulse, 6000);
      }, 800);
    };
    pulseTimer.current = setTimeout(schedPulse, 3000);
    return () => clearTimeout(pulseTimer.current);
  }, [minimised]);

  useEffect(() => {
    if (isAdmin) {
      document.documentElement.classList.remove("has-mini-banner");
      return;
    }

    if (minimised && !expired && !dismissed) {
      document.documentElement.classList.add("has-mini-banner");
    } else {
      document.documentElement.classList.remove("has-mini-banner");
    }
    return () => document.documentElement.classList.remove("has-mini-banner");
  }, [minimised, expired, dismissed, isAdmin]);

  const handleMinimise = useCallback(() => {
    setShowPopup(false);
    setMinimised(true);
    localStorage.setItem(LS_MINI_KEY, "1");
  }, []);

  const handleClose = useCallback(() => {
    setShowPopup(false);
    setMinimised(false);
    setDismissed(true);
    localStorage.setItem("zeon_offer_last_closed_date", new Date().toDateString());
    localStorage.removeItem(LS_MINI_KEY);
    localStorage.removeItem(LS_EXPIRE_KEY);
  }, []);

  const handleExpand = useCallback(() => {
    setMinimised(false);
    setShowPopup(true);
    localStorage.removeItem(LS_MINI_KEY);
  }, []);

  const handleClaim = useCallback(() => {
    window.open(buildWhatsAppUrl(), "_blank", "noopener,noreferrer");
  }, [buildWhatsAppUrl]);

  if (!mounted || isAdmin || !popupConfig.enabled) return null;
  if (dismissed) return null;

  const miniBanner = minimised && !expired ? (
    <div
      className={`fixed top-0 left-0 right-0 h-10 md:h-11 z-[999] transition-transform duration-300 ${pulseMini ? "scale-[1.005]" : "scale-100"}`}
      style={{
        background: "linear-gradient(90deg, #851010 0%, #a81818 25%, #d62f2f 45%, #FF4444 50%, #d62f2f 55%, #a81818 75%, #851010 100%)",
        backgroundSize: "300% 100%",
        animation: "shimmer-banner 4s linear infinite",
      }}
    >
      <div className="max-w-[1200px] mx-auto h-full flex items-center justify-between gap-3 px-4">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <FaTag className="text-white/95 text-[0.9rem] sm:text-base shrink-0" />
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-white font-bold text-[0.78rem] sm:text-[0.88rem] truncate">
              <span className="hidden sm:inline">{popupConfig.miniBannerText}</span>
              <span className="inline sm:hidden">{popupConfig.miniBannerTextMobile}</span>
            </span>
            <span className="font-black tracking-widest bg-black/20 border border-white/10 rounded px-1.5 py-0.5 text-[0.75rem] sm:text-[0.82rem] text-white shrink-0 ml-1">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
        <button
          onClick={handleExpand}
          className="flex items-center gap-1.5 bg-dark text-white font-black text-[0.75rem] sm:text-[0.82rem] px-3 sm:px-4 py-1.5 rounded-full shadow-lg transition-all duration-200 hover:scale-105 hover:bg-black shrink-0 whitespace-nowrap cursor-pointer"
        >
          <FaChevronUp size={10} />
          {popupConfig.miniBannerCta}
        </button>
        <button onClick={handleClose} aria-label="Close offer" className="text-white/80 hover:text-white transition-colors p-1 shrink-0 ml-1 cursor-pointer">
          <FaTimes size={14} />
        </button>
      </div>
    </div>
  ) : null;

  const popup = showPopup && !expired ? (
    <div
      className="fixed inset-0 z-[100000] flex items-center justify-center p-4 sm:p-6"
      style={{ background: "rgba(0,0,0,0.50)", backdropFilter: "blur(6px)" }}
      onClick={handleMinimise}
    >
      <div
        className="relative w-full max-w-[420px] rounded-3xl overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.15)] animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "linear-gradient(145deg, #ffffff 0%, #fffefe 60%, #fffcfc 100%)",
          border: "1px solid rgba(255,68,68,0.15)",
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#FF4444] to-transparent" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(255,68,68,0.05) 0%, transparent 65%)" }} />

        <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 z-30">
          <button onClick={handleMinimise} aria-label="Close offer" className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-200 cursor-pointer">
            <FaTimes size={14} />
          </button>
        </div>

        <div className="relative z-10 px-6 pt-10 pb-7 text-center">
          <div className="inline-flex items-center gap-1.5 bg-[#FF4444]/10 border border-[#FF4444]/20 text-[#FF4444] text-[0.72rem] font-extrabold tracking-[0.18em] uppercase px-3.5 py-1 rounded-full mb-5">
            <FaTag size={9} />
            {popupConfig.badgeText}
          </div>

          <h2 className="text-heading text-[1.85rem] sm:text-[2.1rem] font-extrabold leading-tight mb-1">
            {popupConfig.headline}{" "}
            <span className="text-[#FF4444]">{popupConfig.headlineAccent}</span>
          </h2>
          <p className="text-body text-[1rem] sm:text-[1.1rem] font-bold mb-1">{popupConfig.subtitle}</p>
          <p className="text-body/60 text-[0.82rem] mb-6">{popupConfig.description}</p>

          <div className="flex items-center justify-center gap-3 mb-7">
            <div className="flex-1 max-w-[220px] flex items-center justify-center py-3 px-5 rounded-xl border-2 border-dashed border-[#FF4444]/40 bg-[#FF4444]/5">
              <span className="text-[#FF4444] text-[1.4rem] font-black tracking-[0.2em]">{popupConfig.offerCode}</span>
            </div>
          </div>

          <div className="mb-7">
            <p className="text-body/50 text-[0.75rem] mb-2.5 font-semibold uppercase tracking-widest">Offer expires in</p>
            <div className="flex items-center justify-center gap-3">
              <div className="flex flex-col items-center">
                <div className="bg-gray-50 border border-gray-150 rounded-xl px-4 py-2.5 min-w-[60px] text-center">
                  <span className="text-heading text-[2rem] sm:text-[2.2rem] font-black tabular-nums leading-none">
                    {String(Math.floor(Math.max(0, timeLeft) / 60000)).padStart(2, "0")}
                  </span>
                </div>
                <span className="text-body/45 text-[0.65rem] font-semibold uppercase tracking-widest mt-1.5">min</span>
              </div>
              <span className="text-[#FF4444] text-[2rem] font-black leading-none mb-4 animate-pulse">:</span>
              <div className="flex flex-col items-center">
                <div className="bg-gray-50 border border-gray-150 rounded-xl px-4 py-2.5 min-w-[60px] text-center">
                  <span className="text-heading text-[2rem] sm:text-[2.2rem] font-black tabular-nums leading-none">
                    {String(Math.floor((Math.max(0, timeLeft) % 60000) / 1000)).padStart(2, "0")}
                  </span>
                </div>
                <span className="text-body/45 text-[0.65rem] font-semibold uppercase tracking-widest mt-1.5">sec</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleClaim}
            className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl font-black text-[1rem] text-white transition-all duration-300 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #25D366 0%, #1ebe5d 100%)",
              boxShadow: "0 8px 28px rgba(37,211,102,0.22), 0 2px 0 rgba(255,255,255,0.1) inset",
            }}
          >
            <FaWhatsapp size={20} />
            {popupConfig.ctaText}
          </button>

          <button
            onClick={handleMinimise}
            className="w-full mt-3 py-3 rounded-2xl font-bold text-[0.9rem] text-body/60 hover:text-body border border-border/80 hover:border-border hover:bg-surface active:scale-95 transition-all duration-200 cursor-pointer"
          >
            {popupConfig.secondaryCtaText}
          </button>

          <p className="text-body/40 text-[0.72rem] mt-4 leading-relaxed">
            🔒 {popupConfig.footerText}
          </p>
        </div>
      </div>
    </div>
  ) : null;

  return createPortal(
    <>
      {popup}
      {miniBanner}
    </>,
    document.body
  );
}
