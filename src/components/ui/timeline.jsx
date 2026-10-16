"use client";

import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function useGSAP(callback, options = {}) {
  const deps = options.dependencies ?? [];
  const scope = options.scope;
  const ctxRef = useRef(null);
  const cleanupRef = useRef(undefined);

  useIsomorphicLayoutEffect(() => {
    const el =
      scope && typeof scope === "object" && "current" in scope
        ? scope.current
        : scope;
    ctxRef.current = gsap.context(() => {}, el ?? undefined);
    return () => {
      cleanupRef.current?.();
      cleanupRef.current = undefined;
      ctxRef.current?.revert();
      ctxRef.current = null;
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!ctxRef.current) return;
    cleanupRef.current?.();
    const ret = ctxRef.current.add(callback);
    cleanupRef.current = typeof ret === "function" ? ret : undefined;
  }, deps);
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(callback) {
  if (typeof window === "undefined") return () => {};
  const mediaQueryList = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQueryList.addEventListener("change", callback);
  return () => mediaQueryList.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.(REDUCED_MOTION_QUERY)?.matches ?? false;
}

function getServerReducedMotionSnapshot() {
  return false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot,
  );
}

export const defaultMilestones = [
  {
    id: "2019-beginning",
    year: "2019",
    title: "The Beginning",
    content:
      "ZEON Academy was established to develop industry-relevant digital marketing skills.",
    isTop: true,
    galleryImages: [
      "/uploads/gallery/q-and-a-with-zeon-students-0.webp",
      "/uploads/gallery/q-and-a-with-zeon-students-1.webp",
      "/about/zeon-aboutus.jpeg",
    ],
  },
  {
    id: "2020-change",
    year: "2020",
    title: "Adapting to Change",
    content:
      "The academy introduced online learning to continue delivering training during the pandemic.",
    isTop: false,
    galleryImages: [
      "/uploads/gallery/q-and-a-with-zeon-students-5.webp",
      "/uploads/gallery/birthday-celebration-1.webp",
      "/uploads/gallery/birthday-celebration-2.webp",
    ],
  },
  {
    id: "today-expanding",
    year: "Today",
    title: "Expanding Learning Opportunities",
    content:
      "The academy serves aspiring digital marketers and working professionals seeking to develop their skills.",
    isTop: true,
    galleryImages: [
      "/uploads/gallery/graduation-day-2025-0.webp",
      "/uploads/gallery/graduation-day-2025-3.webp",
      "/uploads/gallery/graduation-day-2025-8.webp",
    ],
  },
];

/**
 * OverlappingImageStack
 * Displays a 2-3 image overlapping card stack where each image is partially visible behind the other.
 * Autoplays cycling the top card every 1.5 seconds while hovered.
 * Uses Next.js Image with small responsive sizes to save bandwidth.
 */
function OverlappingImageStack({ images = [], isTop, isHovered, className = "" }) {
  const stackImages = images.slice(0, 3);
  const total = stackImages.length;
  const [activeIdx, setActiveIdx] = useState(0);

  // Autoplay top card cycle in 1.5 seconds while hovered or active on mobile
  useEffect(() => {
    if (!isHovered || total <= 1) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % total);
    }, 1500);
    return () => clearInterval(interval);
  }, [isHovered, total]);

  if (total === 0) return null;

  return (
    <div
      className={`relative w-[180px] sm:w-[220px] md:w-[240px] h-[120px] sm:h-[150px] md:h-[160px] z-[9999999] ${className}`}
    >
      {stackImages.map((src, originalIdx) => {
        const position = (originalIdx - activeIdx + total) % total;
        const zIndex = total - position;

        const xOffset = position === 0 ? 0 : position === 1 ? 16 : 30;
        const yOffset =
          position === 0
            ? 0
            : position === 1
            ? isTop
              ? -12
              : 12
            : isTop
            ? -22
            : 22;
        const rotation =
          position === 0
            ? isTop
              ? -1.5
              : 1.5
            : position === 1
            ? isTop
              ? 4
              : -4
            : isTop
            ? -3
            : 3;
        const scale = position === 0 ? 1 : position === 1 ? 0.92 : 0.85;
        const opacity = position === 0 ? 1 : position === 1 ? 0.92 : 0.74;

        return (
          <motion.div
            key={src}
            style={{ zIndex: 9999999 + zIndex }}
            animate={{
              x: xOffset,
              y: yOffset,
              rotate: rotation,
              scale: scale,
              opacity: opacity,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 24,
            }}
            className="absolute inset-0 bg-white p-1 sm:p-1.5 pb-2 rounded-xl shadow-[0_16px_35px_rgba(0,0,0,0.3)] border border-slate-200/90 overflow-hidden"
          >
            <div className="relative w-full h-full rounded-lg overflow-hidden bg-slate-100">
              <Image
                src={src}
                alt="Zeon milestone memory"
                fill
                sizes="(max-width: 640px) 190px, (max-width: 768px) 220px, 240px"
                quality={70}
                className="w-full h-full object-cover select-none"
                priority={position === 0}
              />
              {position === 0 && (
                <div className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-white text-[0.62rem] sm:text-[0.68rem] font-bold flex items-center gap-1 shadow-sm z-10">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span>
                    {activeIdx + 1}/{total}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/**
 * MilestoneCard
 * Renders an interactive milestone card with stem & dot on the horizontal axis.
 * On hover: renders the overlapping image stack in a React Portal directly on document.body
 * so it completely overlaps the fixed navbar without being trapped by any stacking context.
 */
function MilestoneCard({ item, isTop, activeStyle, mutedTextStyle }) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState(null);
  const images = item.galleryImages || [];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isHovered || !cardRef.current) return;
    const updateCoords = () => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      setCoords({
        left: rect.left,
        top: rect.top,
        bottom: rect.bottom,
        width: rect.width,
      });
    };
    updateCoords();
    window.addEventListener("scroll", updateCoords, { passive: true });
    window.addEventListener("resize", updateCoords, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateCoords);
      window.removeEventListener("resize", updateCoords);
    };
  }, [isHovered]);

  const popupPortalContent = mounted && typeof document !== "undefined" && (
    <AnimatePresence>
      {isHovered && images.length > 0 && coords && (
        <motion.div
          initial={{
            opacity: 0,
            y: isTop ? 18 : -18,
            scale: 0.85,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
              type: "spring",
              stiffness: 360,
              damping: 24,
            },
          }}
          exit={{
            opacity: 0,
            y: isTop ? 10 : -10,
            scale: 0.9,
            transition: {
              duration: 0.16,
              ease: "easeOut",
            },
          }}
          style={{
            position: "fixed",
            left: Math.max(
              12,
              Math.min(
                coords.left + 10,
                (typeof window !== "undefined" ? window.innerWidth : 1200) - 256,
              ),
            ),
            top: isTop
              ? Math.max(12, coords.top - 170)
              : Math.min(
                  coords.bottom + 14,
                  (typeof window !== "undefined" ? window.innerHeight : 800) - 175,
                ),
            zIndex: 9999999,
          }}
          className="pointer-events-none filter drop-shadow-2xl"
        >
          {/* Overlapping Stack Component */}
          <OverlappingImageStack
            images={images}
            isTop={isTop}
            isHovered={isHovered}
          />

          {/* Pointer arrow pointing to card */}
          <div
            className={`absolute left-8 w-3 h-3 bg-white border-slate-200 rotate-45 transform ${
              isTop
                ? "bottom-[-6px] border-b border-r"
                : "top-[-6px] border-t border-l"
            }`}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div
      ref={cardRef}
      className={`relative w-[260px] sm:w-[300px] md:w-[340px] h-full flex flex-col pl-6 sm:pl-7 shrink-0 transition-colors group cursor-pointer ${
        isHovered ? "z-[999999]" : "z-10"
      } ${isTop ? "justify-start pt-2 pb-5" : "justify-end pt-5 pb-2"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Stem & Center Rail Node Dot ── */}
      <div className="w-full absolute left-0 bottom-0 top-0 h-full pointer-events-none">
        {isTop ? (
          <div className="absolute left-0 bottom-0 w-full h-full flex flex-col items-start justify-end pointer-events-none">
            <div
              className={`h-[88%] w-[2px] rounded-full jl-${item.id}`}
              style={{
                ...activeStyle,
                transformOrigin: "bottom center",
              }}
            />
            <div
              className={`w-3.5 h-3.5 -translate-x-1/2 translate-y-1/2 relative rounded-full jd-${item.id} shadow-[0_0_12px_rgba(255,51,51,0.85)] shrink-0`}
              style={activeStyle}
            />
          </div>
        ) : (
          <div className="absolute left-0 top-0 w-full h-full flex flex-col items-start justify-start pointer-events-none">
            <div
              className={`w-3.5 h-3.5 -translate-x-1/2 -translate-y-1/2 relative rounded-full jd-${item.id} shadow-[0_0_12px_rgba(255,51,51,0.85)] shrink-0`}
              style={activeStyle}
            />
            <div
              className={`h-[88%] w-[2px] rounded-full jl-${item.id}`}
              style={{
                ...activeStyle,
                transformOrigin: "top center",
              }}
            />
          </div>
        )}
      </div>

      {/* ── Milestone Card Content (Revealed on scroll) ── */}
      <div className="space-y-1.5 flex flex-col">
        {/* TOP MILESTONE: Photo stack positioned ABOVE the content */}
        {isTop && images.length > 0 && (
          <div className={`photo-${item.id} block sm:hidden pb-1.5 z-10`}>
            <OverlappingImageStack
              images={images}
              isTop={isTop}
              isHovered={true}
              className="w-[165px] h-[105px]"
            />
          </div>
        )}

        {/* Year Badge + Small grey hint text */}
        <div className="flex items-center gap-2">
          <div
            className={`badge-${item.id} inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[0.72rem] sm:text-[0.78rem] font-black uppercase tracking-wider transition-all duration-300 border ${
              isHovered
                ? "bg-primary text-white border-primary shadow-sm scale-105"
                : "bg-primary/10 text-primary border-primary/20 group-hover:bg-primary/15"
            }`}
          >
            <span>{item.year}</span>
          </div>

          <span
            className={`hint-${item.id} hidden sm:inline-block text-[0.68rem] sm:text-[0.72rem] italic text-slate-400 group-hover:text-slate-600 transition-colors font-medium select-none`}
          >
            • Hover to Reveal
          </span>
        </div>

        {/* Title */}
        <h4
          className={`title-${item.id} text-[1.1rem] sm:text-[1.25rem] font-black leading-tight text-heading group-hover:text-primary transition-colors duration-200`}
        >
          {item.title}
        </h4>

        {/* Description */}
        <p
          className={`desc-${item.id} text-[0.82rem] sm:text-[0.88rem] leading-relaxed text-body font-medium`}
          style={mutedTextStyle}
        >
          {item.content}
        </p>

        {/* BOTTOM MILESTONE: Photo stack positioned BELOW the content */}
        {!isTop && images.length > 0 && (
          <div className={`photo-${item.id} block sm:hidden pt-1.5 z-10`}>
            <OverlappingImageStack
              images={images}
              isTop={isTop}
              isHovered={true}
              className="w-[165px] h-[105px]"
            />
          </div>
        )}
      </div>

      {/* Render Hover Portal directly to document.body so the popup overlaps the fixed navbar */}
      {mounted && typeof document !== "undefined" && createPortal(popupPortalContent, document.body)}
    </div>
  );
}

export default function Timeline({
  badge = "OUR JOURNEY",
  title = "Built to Bridge Learning and Industry.",
  periodLabel = "2019 — Present",
  textColor = "#191919",
  mutedTextColor = "#64748B",
  activeColor = "#FF3333",
  backgroundColor = "#FFFFFF",
  imageUrl = "/about/zeon-aboutus.jpeg",
  imageAlt = "Zeon Academy Students and Mentors in Kochi",
  milestones = defaultMilestones,
}) {
  const sectionRef = useRef(null);
  const wholeSliderRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  const sectionStyle = {
    color: textColor,
    backgroundColor,
  };
  const activeStyle = {
    backgroundColor: activeColor,
  };
  const mutedTextStyle = {
    color: mutedTextColor,
  };

  const item2019 = milestones.find((m) => m.year === "2019") || milestones[0];
  const item2020 = milestones.find((m) => m.year === "2020") || milestones[1];
  const itemToday = milestones.find((m) => m.year === "Today") || milestones[2];

  useGSAP(
    () => {
      const section = sectionRef.current;
      const slider = wholeSliderRef.current;
      if (!section || !slider) return;

      const getDistance = () => {
        const extra = window.innerWidth < 640 ? 60 : 120;
        return Math.max(0, slider.scrollWidth - window.innerWidth + extra);
      };

      if (reducedMotion) {
        // Accessibility fallback: everything visible immediately
        gsap.set(".journey-line", { width: "100%" });
        milestones.forEach((item) => {
          gsap.set(`.jl-${item.id}`, { scaleY: 1 });
          gsap.set(`.jd-${item.id}`, { scale: 1 });
          gsap.set(
            [
              `.badge-${item.id}`,
              `.hint-${item.id}`,
              `.title-${item.id}`,
              `.desc-${item.id}`,
              `.photo-${item.id}`,
            ],
            {
              opacity: 1,
              y: 0,
            },
          );
        });
        return;
      }

      // ── Initial State: Timeline starts hidden until scrolled ──
      gsap.set(".journey-line", { width: "0%" });
      milestones.forEach((item) => {
        gsap.set(`.jl-${item.id}`, { scaleY: 0 });
        gsap.set(`.jd-${item.id}`, { scale: 0 });
        gsap.set(
          [
            `.badge-${item.id}`,
            `.hint-${item.id}`,
            `.title-${item.id}`,
            `.desc-${item.id}`,
            `.photo-${item.id}`,
          ],
          {
            opacity: 0,
            y: item.isTop ? -16 : 16,
          },
        );
      });

      const scrollDistance = getDistance();
      const pinDistance = Math.max(1600, scrollDistance * 1.35);

      // ── Master GSAP Timeline Scrubbed to Vertical Page Scroll ──
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          pinSpacing: true,
          start: "top top",
          end: () => `+=${pinDistance}`,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 1. Horizontal slider track movement
      masterTl.to(
        slider,
        {
          x: () => -getDistance(),
          ease: "none",
          duration: 10,
        },
        0,
      );

      // 2. Central red progress line expanding across the track
      masterTl.to(
        ".journey-line",
        {
          width: "100%",
          ease: "none",
          duration: 10,
        },
        0,
      );

      // 3. Milestone 1 (2019) reveal on scroll (at ~15% - 28% scroll progress)
      if (item2019) {
        masterTl
          .to(
            `.jd-${item2019.id}`,
            { scale: 1, ease: "back.out(2)", duration: 0.5 },
            1.2,
          )
          .to(
            `.jl-${item2019.id}`,
            { scaleY: 1, ease: "power2.out", duration: 0.9 },
            1.3,
          )
          .to(
            [
              `.badge-${item2019.id}`,
              `.hint-${item2019.id}`,
              `.title-${item2019.id}`,
              `.desc-${item2019.id}`,
              `.photo-${item2019.id}`,
            ],
            { opacity: 1, y: 0, ease: "power2.out", stagger: 0.08, duration: 0.8 },
            1.6,
          );
      }

      // 4. Milestone 2 (2020) reveal on scroll (at ~42% - 58% scroll progress)
      if (item2020) {
        masterTl
          .to(
            `.jd-${item2020.id}`,
            { scale: 1, ease: "back.out(2)", duration: 0.5 },
            4.2,
          )
          .to(
            `.jl-${item2020.id}`,
            { scaleY: 1, ease: "power2.out", duration: 0.9 },
            4.3,
          )
          .to(
            [
              `.badge-${item2020.id}`,
              `.hint-${item2020.id}`,
              `.title-${item2020.id}`,
              `.desc-${item2020.id}`,
              `.photo-${item2020.id}`,
            ],
            { opacity: 1, y: 0, ease: "power2.out", stagger: 0.08, duration: 0.8 },
            4.6,
          );
      }

      // 5. Milestone 3 (Today) reveal on scroll (at ~72% - 88% scroll progress)
      if (itemToday) {
        masterTl
          .to(
            `.jd-${itemToday.id}`,
            { scale: 1, ease: "back.out(2)", duration: 0.5 },
            7.2,
          )
          .to(
            `.jl-${itemToday.id}`,
            { scaleY: 1, ease: "power2.out", duration: 0.9 },
            7.3,
          )
          .to(
            [
              `.badge-${itemToday.id}`,
              `.hint-${itemToday.id}`,
              `.title-${itemToday.id}`,
              `.desc-${itemToday.id}`,
              `.photo-${itemToday.id}`,
            ],
            { opacity: 1, y: 0, ease: "power2.out", stagger: 0.08, duration: 0.8 },
            7.6,
          );
      }

      const handleResize = () => {
        ScrollTrigger.refresh();
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    },
    { dependencies: [reducedMotion], scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="journey"
      className="relative w-full h-screen min-h-[640px] max-h-[920px] bg-white border-y border-border flex items-center overflow-x-clip overflow-y-visible z-20"
      style={sectionStyle}
    >
      <div className="w-full h-full flex items-center overflow-x-clip overflow-y-visible py-4 sm:py-6">
        <div
          ref={wholeSliderRef}
          className="flex items-center gap-8 sm:gap-12 will-change-transform shrink-0 overflow-visible"
          style={{
            // Symmetrically aligned to match the site's max-w-[1200px] px-6 container on both left and right
            paddingLeft: "max(1.5rem, calc((100vw - 1200px) / 2 + 1.5rem))",
            paddingRight: "max(1.5rem, calc((100vw - 1200px) / 2 + 1.5rem))",
          }}
        >
          {/* Lead Photo Card: hidden on mobile, visible on tablet & desktop */}
          <div className="hidden sm:block relative shrink-0 w-[240px] sm:w-[320px] md:w-[360px] h-[440px] sm:h-[500px] md:h-[540px] overflow-hidden rounded-2xl shadow-xl border border-border/80 group bg-slate-100">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes="(max-width: 640px) 240px, (max-width: 768px) 320px, 360px"
              quality={70}
              priority
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 select-none"
            />
          </div>

          {/* Timeline Milestones Area */}
          <div className="relative h-[440px] sm:h-[500px] md:h-[540px] flex flex-col justify-between shrink-0 overflow-visible">
            {/* ── Center Horizontal Rail & Glowing Line ── */}
            <div className="w-full absolute left-0 top-[50%] -translate-y-1/2 flex items-center h-fit pointer-events-none z-10">
              {/* Full width background rail */}
              <div className="w-full absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-slate-200 rounded-full" />

              {/* Start node dot */}
              <div
                className="w-3.5 h-3.5 rounded-full shadow-[0_0_12px_rgba(255,51,51,0.8)] shrink-0 relative z-10"
                style={activeStyle}
              />

              {/* Active progress glowing red line that expands on scroll */}
              <div
                className="h-[2px] w-[0%] rounded-full journey-line shadow-[0_0_10px_rgba(255,51,51,0.6)] relative z-10"
                style={activeStyle}
              />

              {/* End node dot on the far right */}
              <div
                className="w-3.5 h-3.5 rounded-full shadow-[0_0_12px_rgba(255,51,51,0.8)] shrink-0 ml-auto relative z-10"
                style={activeStyle}
              />
            </div>

            {/* ── TOP ROW: Title Column + 2019 (Top) + Spacer + Today (Top) ── */}
            <div className="flex h-[48%] items-end justify-start gap-8 sm:gap-12 pb-2 overflow-visible">
              {/* Left Title Column matching site-wide section header typography */}
              <div className="w-[280px] sm:w-[360px] md:w-[400px] shrink-0 pb-3 pr-4">
                <span className="inline-block text-primary text-[0.85rem] font-bold mb-3 tracking-[0.2em] uppercase">
                  {badge}
                </span>
                <h2 className="text-[2rem] sm:text-[2.4rem] md:text-[2.7rem] font-extrabold text-heading leading-[1.18] mb-2">
                  Built to Bridge <span className="text-primary">Learning and Industry.</span>
                </h2>
              </div>

              {/* Top Milestones Track: 2019 (Col 1) | Spacer for 2020 (Col 2) | Today (Col 3) */}
              <div className="flex items-end overflow-visible">
                {/* Column 1: Milestone 2019 (Top) */}
                {item2019 && (
                  <MilestoneCard
                    item={item2019}
                    isTop={true}
                    activeStyle={activeStyle}
                    mutedTextStyle={mutedTextStyle}
                  />
                )}

                {/* Column 2: Spacer above Milestone 2020 */}
                <div className="w-[260px] sm:w-[300px] md:w-[340px] shrink-0 h-full pointer-events-none" />

                {/* Column 3: Milestone Today (Top) */}
                {itemToday && (
                  <MilestoneCard
                    item={itemToday}
                    isTop={true}
                    activeStyle={activeStyle}
                    mutedTextStyle={mutedTextStyle}
                  />
                )}
              </div>
            </div>

            {/* ── BOTTOM ROW: Period Column + Spacer + 2020 (Bottom) + Spacer ── */}
            <div className="flex h-[48%] items-start justify-start gap-8 sm:gap-12 pt-2 overflow-visible">
              {/* Left Period Column */}
              <div className="w-[280px] sm:w-[360px] md:w-[400px] shrink-0 pt-3 pr-4">
                <p
                  className="text-[1.15rem] sm:text-[1.25rem] font-extrabold tracking-wide text-heading mb-3"
                  style={mutedTextStyle}
                >
                  {periodLabel}
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[0.82rem] font-bold">
                  <span>Scroll to explore timeline</span>
                  <span className="animate-pulse">→</span>
                </div>
                
              </div>

              {/* Bottom Milestones Track: Spacer for 2019 (Col 1) | 2020 (Col 2) | Spacer for Today (Col 3) */}
              <div className="flex items-start overflow-visible">
                {/* Column 1: Spacer below Milestone 2019 */}
                <div className="w-[260px] sm:w-[300px] md:w-[340px] shrink-0 h-full pointer-events-none" />

                {/* Column 2: Milestone 2020 (Bottom) */}
                {item2020 && (
                  <MilestoneCard
                    item={item2020}
                    isTop={false}
                    activeStyle={activeStyle}
                    mutedTextStyle={mutedTextStyle}
                  />
                )}

                {/* Column 3: Spacer below Milestone Today */}
                <div className="w-[260px] sm:w-[300px] md:w-[340px] shrink-0 h-full pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
