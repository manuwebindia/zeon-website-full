"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { FaTimes, FaWhatsapp, FaTag, FaChevronUp } from "react-icons/fa";

/* ─── Constants ──────────────────────────────────── */
const OFFER_CODE      = "OFFER-2026";
const PHONE           = "917558888252";
const DURATION_MS     = 5 * 60 * 1000; // 5 minutes
const LS_EXPIRE_KEY   = "zeon_offer_expiry";
const LS_CLOSED_KEY   = "zeon_offer_closed";  // user hit X permanently
const LS_MINI_KEY     = "zeon_offer_minimised";
const POPUP_DELAY_MS  = 2000;           // show popup 2 s after page load

function buildWhatsAppUrl() {
  const msg = `Hi! I'd like to claim my exclusive offer using code *${OFFER_CODE}*. Could you please share the details about the Digital Marketing course and next batch schedule?`;
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;
}

function formatTime(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/* ─── Confetti Canvas Component ─────────────────── */
function ConfettiCanvas({ active }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.width = window.innerWidth;
        height = canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);

    const colors = [
      "#FF4444", "#3B82F6", "#25D366", "#FBBF24",
      "#A78BFA", "#EC4899", "#10B981", "#F59E0B"
    ];

    const particles = [];
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * -height - 20,
        r: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 5,
        tiltAngleIncremental: Math.random() * 0.05 + 0.02,
        tiltAngle: Math.random() * Math.PI,
        vy: Math.random() * 3 + 2,
        vx: Math.random() * 1.5 - 0.75,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      let activeParticles = 0;

      particles.forEach((p) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += p.vy;
        p.x += p.vx + Math.sin(p.tiltAngle) * 0.4;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.tiltAngle);
        ctx.fillStyle = p.color;

        ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);

        ctx.restore();

        if (p.y < height + 20) {
          activeParticles++;
        }
      });

      if (activeParticles > 0) {
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[200000] w-full h-full"
    />
  );
}

/* ─── Main Component ─────────────────────────────── */
export default function OfferPopup() {
  const [mounted,     setMounted]     = useState(false);
  const [showPopup,   setShowPopup]   = useState(false);
  const [minimised,   setMinimised]   = useState(false);
  const [dismissed,   setDismissed]   = useState(false); // permanent X
  const [timeLeft,    setTimeLeft]    = useState(DURATION_MS);
  const [expired,     setExpired]     = useState(false);
  const [pulseMini,   setPulseMini]   = useState(false);

  const intervalRef  = useRef(null);
  const pulseTimer   = useRef(null);

  /* ── initialise state ── */
  useEffect(() => {
    setMounted(true);
    setTimeLeft(DURATION_MS);

    // Show popup after delay
    const delay = setTimeout(() => setShowPopup(true), POPUP_DELAY_MS);
    return () => clearTimeout(delay);
  }, []);

  /* ── countdown tick ── */
  useEffect(() => {
    if (dismissed || expired) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1000;
        if (next <= 0) {
          clearInterval(intervalRef.current);
          setExpired(true);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [dismissed, expired]);

  /* ── pulse animation when minimised ── */
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

  /* ── toggle body/html class for mini banner spacing ── */
  useEffect(() => {
    if (minimised && !expired && !dismissed) {
      document.documentElement.classList.add("has-mini-banner");
    } else {
      document.documentElement.classList.remove("has-mini-banner");
    }
    return () => {
      document.documentElement.classList.remove("has-mini-banner");
    };
  }, [minimised, expired, dismissed]);

  /* ── handlers ── */
  const handleMinimise = useCallback(() => {
    setShowPopup(false);
    setMinimised(true);
  }, []);

  const handleClose = useCallback(() => {
    setShowPopup(false);
    setMinimised(false);
    setDismissed(true);
  }, []);

  const handleExpand = useCallback(() => {
    setMinimised(false);
    setShowPopup(true);
  }, []);

  const handleClaim = useCallback(() => {
    window.open(buildWhatsAppUrl(), "_blank", "noopener,noreferrer");
  }, []);

  /* ── don't render anything until hydrated ── */
  if (!mounted) return null;

  /* ── permanently dismissed ── */
  if (dismissed) return null;

  /* ── MINIMISED BANNER (under header banner) ── */
  const miniBanner = minimised && !expired ? (
    <div
      className={`fixed top-0 left-0 right-0 h-10 md:h-11 z-[999] transition-transform duration-300 ${
        pulseMini ? "scale-[1.005]" : "scale-100"
      }`}
      style={{
        background: "linear-gradient(90deg, #851010 0%, #a81818 25%, #d62f2f 45%, #FF4444 50%, #d62f2f 55%, #a81818 75%, #851010 100%)",
        backgroundSize: "300% 100%",
        animation: "shimmer-banner 4s linear infinite",
      }}
    >
      <div className="max-w-[1200px] mx-auto h-full flex items-center justify-between gap-3 px-4">
        {/* Left */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <FaTag className="text-white/95 text-[0.9rem] sm:text-base shrink-0" />
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-white font-bold text-[0.78rem] sm:text-[0.88rem] truncate">
              <span className="hidden sm:inline">Exclusive Offer Expiring Soon!</span>
              <span className="inline sm:hidden">Offer Expiring Soon!</span>
            </span>
            <span className="font-black tracking-widest bg-black/20 border border-white/10 rounded px-1.5 py-0.5 text-[0.75rem] sm:text-[0.82rem] text-white shrink-0 ml-1">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Claim button */}
        <button
          onClick={handleExpand}
          className="flex items-center gap-1.5 bg-dark text-white font-black text-[0.75rem] sm:text-[0.82rem] px-3 sm:px-4 py-1.5 rounded-full shadow-lg transition-all duration-200 hover:scale-105 hover:bg-black shrink-0 whitespace-nowrap cursor-pointer"
        >
          <FaChevronUp size={10} />
          CLAIM
        </button>

        {/* Close */}
        <button
          onClick={handleClose}
          aria-label="Close offer"
          className="text-white/80 hover:text-white transition-colors p-1 shrink-0 ml-1 cursor-pointer"
        >
          <FaTimes size={14} />
        </button>
      </div>
    </div>
  ) : null;

  /* ── POPUP MODAL ── */
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
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#FF4444] to-transparent" />

        {/* Background radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(255,68,68,0.05) 0%, transparent 65%)",
          }}
        />

        {/* Decorative circles */}
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(255,68,68,0.3), transparent)" }} />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(255,68,68,0.3), transparent)" }} />

        {/* Action buttons — top-right */}
        <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 z-30">
          {/* Close */}
          <button
            onClick={handleMinimise}
            aria-label="Close offer"
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-200 cursor-pointer"
          >
            <FaTimes size={14} />
          </button>
        </div>

        {/* ── Content ── */}
        <div className="relative z-10 px-6 pt-10 pb-7 text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-[#FF4444]/10 border border-[#FF4444]/20 text-[#FF4444] text-[0.72rem] font-extrabold tracking-[0.18em] uppercase px-3.5 py-1 rounded-full mb-5">
            <FaTag size={9} />
            Limited Time Offer
          </div>

          {/* Headline */}
          <h2 className="text-heading text-[1.85rem] sm:text-[2.1rem] font-extrabold leading-tight mb-1">
            Get <span className="text-[#FF4444]">₹3,000 OFF</span>
          </h2>
          <p className="text-body text-[1rem] sm:text-[1.1rem] font-bold mb-1">
            on Your Digital Marketing Course
          </p>
          <p className="text-body/60 text-[0.82rem] mb-6">
            Use code at enquiry — seats are limited!
          </p>

          {/* Code box */}
          <div className="flex items-center justify-center gap-3 mb-7">
            <div
              className="flex-1 max-w-[220px] flex items-center justify-center py-3 px-5 rounded-xl border-2 border-dashed border-[#FF4444]/40 bg-[#FF4444]/5"
              style={{ boxShadow: "0 8px 24px rgba(255,68,68,0.04)" }}
            >
              <span className="text-[#FF4444] text-[1.4rem] font-black tracking-[0.2em]">
                {OFFER_CODE}
              </span>
            </div>
          </div>

          {/* Countdown */}
          <div className="mb-7">
            <p className="text-body/50 text-[0.75rem] mb-2.5 font-semibold uppercase tracking-widest">
              Offer expires in
            </p>
            <div className="flex items-center justify-center gap-3">
              {/* Minutes */}
              <div className="flex flex-col items-center">
                <div className="bg-gray-50 border border-gray-150 rounded-xl px-4 py-2.5 min-w-[60px] text-center"
                  style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,1)" }}>
                  <span className="text-heading text-[2rem] sm:text-[2.2rem] font-black tabular-nums leading-none">
                    {String(Math.floor(Math.max(0, timeLeft) / 60000)).padStart(2, "0")}
                  </span>
                </div>
                <span className="text-body/45 text-[0.65rem] font-semibold uppercase tracking-widest mt-1.5">min</span>
              </div>

              {/* Colon */}
              <span className="text-[#FF4444] text-[2rem] font-black leading-none mb-4 animate-pulse">:</span>

              {/* Seconds */}
              <div className="flex flex-col items-center">
                <div className="bg-gray-50 border border-gray-150 rounded-xl px-4 py-2.5 min-w-[60px] text-center"
                  style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,1)" }}>
                  <span className="text-heading text-[2rem] sm:text-[2.2rem] font-black tabular-nums leading-none">
                    {String(Math.floor((Math.max(0, timeLeft) % 60000) / 1000)).padStart(2, "0")}
                  </span>
                </div>
                <span className="text-body/45 text-[0.65rem] font-semibold uppercase tracking-widest mt-1.5">sec</span>
              </div>
            </div>
          </div>

          {/* CTA — WhatsApp */}
          <button
            onClick={handleClaim}
            className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl font-black text-[1rem] text-white transition-all duration-300 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #25D366 0%, #1ebe5d 100%)",
              boxShadow: "0 8px 28px rgba(37,211,102,0.22), 0 2px 0 rgba(255,255,255,0.1) inset",
            }}
          >
            <FaWhatsapp size={20} />
            Claim Offer on WhatsApp
          </button>

          {/* Not Now button */}
          <button
            onClick={handleMinimise}
            className="w-full mt-3 py-3 rounded-2xl font-bold text-[0.9rem] text-body/60 hover:text-body border border-border/80 hover:border-border hover:bg-surface active:scale-95 transition-all duration-200 cursor-pointer"
          >
            Not Now
          </button>

          <p className="text-body/40 text-[0.72rem] mt-4 leading-relaxed">
            🔒 No spam · Code: <strong className="text-body/60">{OFFER_CODE}</strong> · Sent instantly via WhatsApp
          </p>
        </div>
      </div>
    </div>
  ) : null;

  return createPortal(
    <>
      {showPopup && <ConfettiCanvas active={showPopup} />}
      {popup}
      {miniBanner}
    </>,
    document.body
  );
}
