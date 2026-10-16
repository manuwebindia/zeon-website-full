"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import BookDemoButton from "./BookDemoButton";
import { CheckCircle2, Award, Sparkles, TrendingUp } from "lucide-react";

/**
 * BottomCtaBanner
 * Compact landscape poster CTA:
 * - Brand red canvas with fine diagonal hatch texture
 * - Bold poster typography with reduced vertical footprint
 * - Students artwork from /students.svg on the right
 * - Integrated floating trust points directly over/beside the artwork
 * - High-contrast action buttons
 */
export default function BottomCtaBanner({
  badge = "START YOUR JOURNEY",
  headingMain = "FIND YOUR PERFECT",
  headingSub = "MARKETING CAREER",
  description = "Join Kerala's leading agency-powered digital marketing institute. Learn live campaigns, get certified, and secure 100% placement support.",
  primaryText = "Book Free Demo Class",
  primaryHref = null, // If null, opens BookDemoModal
  secondaryText = "Explore Programs",
  secondaryHref = "/course",
  statsBadge = "100% Placement",
  className = "",
}) {
  return (
    <section className={`py-6 sm:py-8 md:py-10 bg-white overflow-hidden ${className}`}>
      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="relative rounded-[24px] md:rounded-[32px] bg-primary overflow-hidden shadow-[0_16px_40px_rgba(255,51,51,0.24)] border-2 sm:border-4 border-white/20">
          
          {/* ── BACKGROUND TEXTURE: Fine Diagonal Hatching ── */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `repeating-linear-gradient(
                -45deg,
                rgba(255, 255, 255, 0.4) 0px,
                rgba(255, 255, 255, 0.4) 1.5px,
                transparent 1.5px,
                transparent 8px
              )`,
            }}
          />

          {/* Radial ambient glow orbs */}
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-white/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-black/20 blur-3xl pointer-events-none" />

          {/* Vector Decorative Clouds */}
          <div className="absolute top-3 left-6 sm:left-10 opacity-70 pointer-events-none">
            <svg width="56" height="28" viewBox="0 0 68 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M18 34H56C62.6274 34 68 28.6274 68 22C68 15.6569 63.0783 10.4578 56.8402 10.024C55.086 4.25417 49.7115 0 43.3333 0C37.8966 0 33.1537 3.08985 30.7937 7.62507C29.2801 6.60251 27.4526 6 25.4878 6C20.4074 6 16.2308 9.9406 15.867 14.939C6.98592 15.4219 0 22.8465 0 31.875C0 33.0487 0.119253 34 0.354167 34H18Z"
                fill="white"
                fillOpacity="0.85"
              />
            </svg>
          </div>

          <div className="absolute top-4 right-8 sm:right-16 opacity-60 pointer-events-none hidden sm:block">
            <svg width="46" height="24" viewBox="0 0 54 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M14 28H45C49.9706 28 54 23.9706 54 19C54 14.2477 50.3242 10.3433 45.6575 10.0192C44.2536 4.41738 39.2132 0 33.2 0C28.2974 0 24.1165 2.89069 22.1804 7.07823C20.916 6.13677 19.3499 5.56667 17.6538 5.56667C13.4357 5.56667 9.98634 8.78847 9.61054 12.8718C4.26942 13.3441 0 17.8488 0 23.3333C0 24.9667 0.3533 26.5167 0.990234 27.9167L14 28Z"
                fill="white"
                fillOpacity="0.85"
              />
            </svg>
          </div>

          {/* ── MAIN CONTENT CONTAINER (Tightened vertical padding) ── */}
          <div className="relative z-10 px-5 py-6 sm:px-8 sm:py-7 md:px-10 md:py-8 lg:px-12 lg:py-9 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
            
            {/* ── LEFT: Typography & Copy (Top pill removed to reduce height) ── */}
            <div className="flex-1 text-center lg:text-left max-w-xl">
              
              {/* Poster Heading: Ultra-Bold White Lettering */}
              <h2 className="text-white font-black tracking-tight leading-[1.02] text-[1.9rem] sm:text-[2.4rem] md:text-[2.85rem] lg:text-[3.1rem] uppercase drop-shadow-[0_3px_10px_rgba(0,0,0,0.18)]">
                <span className="block">{headingMain}</span>
                <span className="block text-white/95">{headingSub}</span>
              </h2>

              {/* Sub-paragraph */}
              <p className="mt-3 text-[0.92rem] sm:text-[0.98rem] text-white/90 font-medium leading-relaxed max-w-lg mx-auto lg:mx-0">
                {description}
              </p>

              {/* ── ACTION BUTTONS ── */}
              <div className="mt-5 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
                {primaryHref ? (
                  <Link
                    href={primaryHref}
                    className="w-full sm:w-auto px-7 py-3 rounded-full bg-white text-primary font-black text-[0.95rem] shadow-[0_8px_20px_rgba(0,0,0,0.18)] hover:bg-heading hover:text-white hover:scale-[1.02] active:scale-95 transition-all duration-300 text-center"
                  >
                    {primaryText}
                  </Link>
                ) : (
                  <BookDemoButton
                    courseName="Free Live Demo Class"
                    className="w-full sm:w-auto px-7 py-3 rounded-full bg-white text-primary font-black text-[0.95rem] shadow-[0_8px_20px_rgba(0,0,0,0.18)] hover:bg-heading hover:text-white hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer text-center"
                  >
                    {primaryText}
                  </BookDemoButton>
                )}

                <Link
                  href={secondaryHref}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/80 text-white font-extrabold text-[0.95rem] hover:bg-white hover:text-primary hover:border-white transition-all duration-300 text-center"
                >
                  {secondaryText} →
                </Link>
              </div>
            </div>

            {/* ── RIGHT: Students Illustration with Integrated Trust Points ── */}
            <div className="relative shrink-0 w-full lg:w-[460px] max-w-[480px] flex flex-col items-center justify-center pt-2 sm:pt-0">
              
              <div className="relative w-full max-w-[420px] mx-auto flex items-center justify-center">
                
                {/* Floating Trust Point 1: Top-Left */}
                <div className="absolute -top-2 left-0 sm:-top-3 sm:-left-2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-[0_8px_20px_rgba(0,0,0,0.18)] border border-white/70 text-heading text-[0.72rem] sm:text-[0.78rem] font-bold">
                  <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 size={12} className="stroke-[3]" />
                  </span>
                  <span className="whitespace-nowrap">100% Placement Support</span>
                </div>

                {/* Floating Trust Point 2: Top-Right */}
                <div className="absolute top-2 -right-1 sm:top-3 sm:-right-2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-heading/95 backdrop-blur-md shadow-[0_8px_20px_rgba(0,0,0,0.22)] border border-white/20 text-white text-[0.72rem] sm:text-[0.78rem] font-bold">
                  <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                    <Award size={12} className="stroke-[2.5]" />
                  </span>
                  <span className="whitespace-nowrap">Agency Internship</span>
                </div>

                {/* Students Vector SVG Illustration */}
                <div className="relative z-10 w-full max-w-[340px] sm:max-w-[390px] aspect-[1200/900] flex items-center justify-center">
                  <Image
                    src="/students.svg"
                    alt="Zeon Academy Students"
                    width={560}
                    height={420}
                    className="w-full h-full object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.2)]"
                    priority
                  />
                </div>

                {/* Floating Trust Point 3: Bottom-Left / Center */}
                <div className="absolute -bottom-2 left-2 sm:-bottom-2.5 sm:left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-[0_8px_20px_rgba(0,0,0,0.18)] border border-white/70 text-heading text-[0.72rem] sm:text-[0.78rem] font-bold">
                  <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                    <Sparkles size={11} className="stroke-[2.5]" />
                  </span>
                  <span className="whitespace-nowrap">No Prior Experience Needed</span>
                </div>

                {/* Extra Stats Badge: Bottom-Right */}
                {statsBadge && (
                  <div className="hidden sm:flex absolute -bottom-2 right-1 sm:-bottom-2.5 sm:right-2 z-20 items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-light/95 backdrop-blur-md shadow-[0_8px_20px_rgba(0,0,0,0.15)] border border-primary/20 text-primary text-[0.72rem] sm:text-[0.78rem] font-black">
                    <TrendingUp size={12} className="stroke-[3]" />
                    <span className="whitespace-nowrap">{statsBadge}</span>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
