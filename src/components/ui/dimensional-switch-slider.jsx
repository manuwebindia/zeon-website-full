"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase);
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;

const DEFAULT_ITEMS = [
  { image: "/hero/graduation2025.webp", text: "27k+ LinkedIn Jobs" },
  { image: "/hero/Hero02.webp", text: "100% Placements" },
  { image: "/hero/Hero03.webp", text: "Agency Internships" },
  { image: "/hero/Hero04.webp", text: "₹10 LPA Packages" },
];

const DEFAULT_EASE = "cubic-bezier(1, -0.001, 0.159, 0.838)";
const CUBIC_BEZIER_RE = /^cubic-bezier\(\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^)]+)\)$/;

function resolveEase(ease) {
  const match = ease.match(CUBIC_BEZIER_RE);
  if (!match) return ease;

  const id = `ease-${match.slice(1, 5).join("_").replace(/[^\d.-]/g, "n")}`;
  if (!CustomEase.get(id)) {
    CustomEase.create(id, match.slice(1, 5).join(","));
  }
  return id;
}

function toCssLength(value) {
  if (typeof value === "number") {
    return `${value}px`;
  }
  return value;
}

const EASE = "power4.inOut";
const DURATION = 0.9;
const TEXT_TRANSLATE_PERCENT = 40;
const TEXT_ROTATE_DEG = 45;
const OUTGOING_DURATION = DURATION * 0.45;
const VERTICAL_TEXT_TRANSLATE_PERCENT = 40;
const VERTICAL_TEXT_ROTATE_DEG = 45;
const VERTICAL_TEXT_ROTATE_REVERSED = true;
const VERTICAL_TEXT_TRANSLATE_REVERSED = true;
const VERTICAL_OUTGOING_DURATION = DURATION * 0.45;
const TEXT_Z = 60;

const DimensionalSwitchSlider = ({
  items = DEFAULT_ITEMS,
  infinite = true,
  ease = DEFAULT_EASE,
  textColor = "#ffffff",
  cardClassName = "max-md:w-[85vw]! max-md:h-[75vw]! max-[1024px]:w-[85vw]! max-[1024px]:h-[55vw]!",
  cardWidth = 680,
  cardHeight = 460,
  direction = "horizontal",
  textSize = 24,
  cardBorderRadius = 16,
  autoplay = true,
  autoplayDelay = 2600,
} = {}) => {
  const isVertical = direction === "vertical";
  const flipAxis = isVertical ? "rotateX" : "rotateY";
  const flipperRef = useRef(null);
  const prevTextRef = useRef(null);
  const nextTextRef = useRef(null);
  const showingNextRef = useRef(false);
  const isAnimatingRef = useRef(false);
  const rotationRef = useRef(0);
  const resolvedEase = useMemo(() => resolveEase(ease), [ease]);
  const resolvedCardWidth = toCssLength(cardWidth);
  const resolvedCardHeight = toCssLength(cardHeight);
  const resolvedTextSize = typeof textSize === "number" ? `clamp(1rem, 4.2vw, ${textSize}px)` : textSize;
  const resolvedCardBorderRadius = toCssLength(cardBorderRadius);
  const [frontIndex, setFrontIndex] = useState(0);
  const [backIndex, setBackIndex] = useState(items.length > 1 ? 1 : 0);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    gsap.set([prevTextRef.current, nextTextRef.current], { z: TEXT_Z });
  }, []);

  useEffect(() => {
    gsap.killTweensOf([flipperRef.current, prevTextRef.current, nextTextRef.current]);

    const wasShowingNext = showingNextRef.current;
    rotationRef.current = wasShowingNext ? 180 : 0;
    gsap.set(flipperRef.current, { rotateX: 0, rotateY: 0, [flipAxis]: rotationRef.current });

    const visibleRef = wasShowingNext ? nextTextRef : prevTextRef;
    const hiddenRef = wasShowingNext ? prevTextRef : nextTextRef;
    gsap.set(visibleRef.current, { xPercent: 0, yPercent: 0, rotateX: 0, rotateY: 0, opacity: 1 });
    gsap.set(hiddenRef.current, { xPercent: 0, yPercent: 0, rotateX: 0, rotateY: 0, opacity: 0 });

    isAnimatingRef.current = false;
  }, [direction, flipAxis]);

  const flipTo = useCallback(
    (dir, newIndex) => {
      const goingNext = dir === "next";
      if (isAnimatingRef.current) return;
      const wasShowingNext = showingNextRef.current;
      flushSync(() => {
        setCurrentIndex(newIndex);
        if (wasShowingNext) {
          setFrontIndex(newIndex);
        } else {
          setBackIndex(newIndex);
        }
      });

      showingNextRef.current = !wasShowingNext;

      const outgoingRef = wasShowingNext ? nextTextRef : prevTextRef;
      const incomingRef = wasShowingNext ? prevTextRef : nextTextRef;
      const flipGoingNext = isVertical ? !goingNext : goingNext;
      rotationRef.current += flipGoingNext ? 180 : -180;
      const rotateValue = rotationRef.current;
      if (prefersReducedMotion()) {
        gsap.set(flipperRef.current, { [flipAxis]: rotateValue });
        gsap.set(outgoingRef.current, {
          xPercent: 0,
          yPercent: 0,
          rotateX: 0,
          rotateY: 0,
          opacity: 0,
        });
        gsap.set(incomingRef.current, {
          xPercent: 0,
          yPercent: 0,
          rotateX: 0,
          rotateY: 0,
          opacity: 1,
        });
        isAnimatingRef.current = false;
        return;
      }

      isAnimatingRef.current = true;

      const tl = gsap.timeline({
        defaults: { duration: DURATION, ease: EASE },
        onComplete: () => {
          isAnimatingRef.current = false;
        },
      });

      // Card flip
      tl.to(
        flipperRef.current,
        { [flipAxis]: rotateValue, ease: resolvedEase, duration: 0.7 },
        0
      );
      const textTl = gsap.timeline();

      if (isVertical) {
        const rotateGoingNext = VERTICAL_TEXT_ROTATE_REVERSED ? !goingNext : goingNext;
        const translateGoingNext = VERTICAL_TEXT_TRANSLATE_REVERSED ? !goingNext : goingNext;

        const outgoingEndRotate = rotateGoingNext
          ? VERTICAL_TEXT_ROTATE_DEG
          : -VERTICAL_TEXT_ROTATE_DEG;
        const outgoingEndY = translateGoingNext
          ? -VERTICAL_TEXT_TRANSLATE_PERCENT * 2
          : VERTICAL_TEXT_TRANSLATE_PERCENT * 2;
        const incomingStartRotate = rotateGoingNext
          ? -VERTICAL_TEXT_ROTATE_DEG
          : VERTICAL_TEXT_ROTATE_DEG;
        const incomingStartY = translateGoingNext
          ? VERTICAL_TEXT_TRANSLATE_PERCENT * 2
          : -VERTICAL_TEXT_TRANSLATE_PERCENT * 2;

        textTl.to(
          outgoingRef.current,
          {
            yPercent: outgoingEndY,
            rotateX: outgoingEndRotate,
            duration: VERTICAL_OUTGOING_DURATION * 1.5,
            ease: resolvedEase,
          },
          0
        );
        textTl.to(outgoingRef.current, { opacity: 0, delay: -0.3, duration: 0 });
        textTl.fromTo(
          incomingRef.current,
          { yPercent: incomingStartY, rotateX: incomingStartRotate, opacity: 0 },
          {
            yPercent: 0,
            rotateX: 0,
            opacity: 1,
            duration: VERTICAL_OUTGOING_DURATION * 1.5,
            ease: resolvedEase,
          },
          0.15
        );
      } else {
        const outgoingEndRotate = goingNext ? TEXT_ROTATE_DEG : -TEXT_ROTATE_DEG;
        const outgoingEndX = goingNext
          ? TEXT_TRANSLATE_PERCENT
          : -TEXT_TRANSLATE_PERCENT;
        const incomingStartRotate = goingNext ? -TEXT_ROTATE_DEG : TEXT_ROTATE_DEG;
        const incomingStartX = goingNext
          ? -TEXT_TRANSLATE_PERCENT
          : TEXT_TRANSLATE_PERCENT;

        textTl.to(
          outgoingRef.current,
          {
            xPercent: outgoingEndX,
            rotateY: outgoingEndRotate,
            duration: OUTGOING_DURATION * 1.5,
            ease: resolvedEase,
          },
          0
        );
        textTl.to(outgoingRef.current, { opacity: 0, delay: -0.3, duration: 0 });
        textTl.fromTo(
          incomingRef.current,
          { xPercent: incomingStartX, rotateY: incomingStartRotate, opacity: 0 },
          {
            xPercent: 0,
            rotateY: 0,
            opacity: 1,
            duration: OUTGOING_DURATION * 1.5,
            ease: resolvedEase,
          },
          0.15
        );
      }

      tl.add(textTl, 0);
    },
    [flipAxis, isVertical, resolvedEase]
  );

  const switchTo = useCallback(
    (dir) => {
      const goingNext = dir === "next";
      const wasShowingNext = showingNextRef.current;
      const currentVisibleIndex = wasShowingNext ? backIndex : frontIndex;
      const rawIndex = currentVisibleIndex + (goingNext ? 1 : -1);
      const newIndex = infinite
        ? ((rawIndex % items.length) + items.length) % items.length
        : rawIndex;

      if (!infinite && (newIndex < 0 || newIndex >= items.length)) return;

      flipTo(dir, newIndex);
    },
    [backIndex, flipTo, frontIndex, infinite, items.length]
  );

  useEffect(() => {
    if (!autoplay || autoplayDelay <= 0 || prefersReducedMotion()) return;

    const intervalId = window.setInterval(() => {
      switchTo("next");
    }, autoplayDelay);

    return () => window.clearInterval(intervalId);
  }, [autoplay, autoplayDelay, switchTo]);

  const goToIndex = useCallback(
    (targetIndex) => {
      if (targetIndex === currentIndex) return;

      let dir;
      if (infinite) {
        const forwardDistance =
          ((targetIndex - currentIndex) % items.length + items.length) %
          items.length;
        dir = forwardDistance <= items.length - forwardDistance ? "next" : "prev";
      } else {
        dir = targetIndex > currentIndex ? "next" : "prev";
      }

      flipTo(dir, targetIndex);
    },
    [currentIndex, flipTo, infinite, items.length]
  );

  return (
    <div className="flex flex-col items-center justify-center w-full relative">
      <div
        className={`dimensional-card relative overflow-hidden ${cardClassName}`}
        style={{ perspective: "1000px", width: resolvedCardWidth, height: resolvedCardHeight, borderRadius: resolvedCardBorderRadius }}
      >
        <div ref={flipperRef} className="relative h-full w-full transform-3d">
          {/* Front face */}
          <div
            className="absolute inset-0 h-full w-full overflow-hidden backface-hidden prev-card-face shadow-2xl"
            style={{ borderRadius: resolvedCardBorderRadius }}
          >
            <Image
              src={items[frontIndex].image}
              fill
              sizes="(max-width: 1024px) 90vw, 680px"
              className="object-cover"
              alt={items[frontIndex].text}
              priority
              quality={100}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/05 to-transparent pointer-events-none z-1" />
          </div>
          <div
            className={`absolute inset-0 h-full w-full overflow-hidden backface-hidden next-card-face shadow-2xl ${
              isVertical ? "rotate-x-180" : "rotate-y-180"
            }`}
            style={{ borderRadius: resolvedCardBorderRadius }}
          >
            <Image
              src={items[backIndex].image}
              fill
              sizes="(max-width: 1024px) 90vw, 680px"
              className="object-cover"
              alt={items[backIndex].text}
              quality={100}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/05 to-transparent pointer-events-none z-1" />
          </div>
        </div>

        {/* Text Card positioned at bottom inside the card */}
        <div
          className="absolute z-10 flex items-center justify-center w-[58%] max-w-[360px] sm:w-[45%] sm:max-w-[340px] h-[48px] sm:h-[52px] bottom-13 sm:bottom-16 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            perspective: "1000px",
          }}
        >
          {/* Front rotating card */}
          <div
            ref={prevTextRef}
            className="absolute inset-0 flex items-center justify-center text-center font-extrabold tracking-tight prev-text px-3 sm:px-4 bg-black/65 backdrop-blur-md shadow-2xl border border-white/20 whitespace-nowrap overflow-hidden"
            style={{
              color: textColor,
              fontSize: resolvedTextSize,
              borderRadius: "14px",
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
          >
            {items[frontIndex].text}
          </div>

          {/* Next rotating card */}
          <div
            ref={nextTextRef}
            className="absolute inset-0 flex items-center justify-center text-center font-extrabold tracking-tight next-text opacity-0 px-3 sm:px-4 bg-black/65 backdrop-blur-md shadow-2xl border border-white/20 whitespace-nowrap overflow-hidden"
            style={{
              color: textColor,
              fontSize: resolvedTextSize,
              borderRadius: "14px",
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
          >
            {items[backIndex].text}
          </div>
        </div>

        {/* Controls inside the card at bottom */}
        <div className="flex items-center justify-center gap-4 z-20 absolute bottom-3.5 sm:bottom-4 left-1/2 -translate-x-1/2 w-full">
          <button
            type="button"
            onClick={() => switchTo("prev")}
            aria-label="Previous Slide"
            disabled={!infinite && currentIndex === 0}
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white backdrop-blur-md shadow-md transition-all duration-300 ease-in-out hover:bg-primary hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Dots */}
          <div className="flex gap-2 items-center">
            {items.map((item, idx) => (
              <button
                key={item.text}
                type="button"
                onClick={() => goToIndex(idx)}
                aria-label={`Go to ${item.text}`}
                aria-current={idx === currentIndex}
                className={`h-2 rounded-full transition-all duration-300 ease-in-out cursor-pointer ${
                  idx === currentIndex
                    ? "w-6 bg-primary shadow-sm"
                    : "w-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => switchTo("next")}
            aria-label="Next Slide"
            disabled={!infinite && currentIndex === items.length - 1}
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white backdrop-blur-md shadow-md transition-all duration-300 ease-in-out hover:bg-primary hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DimensionalSwitchSlider;
