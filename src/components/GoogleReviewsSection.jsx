"use client";

import React from "react";
import GoogleReviewsWidget from "./GoogleReviewsWidget";
import ScrollReveal from "./ScrollReveal";

export default function GoogleReviewsSection({
  className = "",
  containerClassName = "w-full max-w-[1200px] mx-auto px-6",
  badge = "Google Verified",
  title = "Student Reviews on Google",
  subtitle = "Real ratings and experiences shared by our graduates on Google Business Profile.",
  showHeader = false,
  withScrollReveal = true,
  id = "google-reviews",
}) {
  const content = (
    <div className={containerClassName}>
      {showHeader && (
        <div className="text-center mb-8 max-w-2xl mx-auto">
          {badge && (
            <span className="inline-block text-primary text-[0.8rem] font-bold mb-3 tracking-[0.2em] uppercase bg-primary-light px-3.5 py-1 rounded-full border border-primary/15">
              {badge}
            </span>
          )}
          {title && (
            <h2 className="text-[clamp(1.8rem,3.5vw,2.4rem)] font-extrabold text-heading mb-3 leading-tight">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-[1rem] text-body leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <GoogleReviewsWidget />
    </div>
  );

  return (
    <section id={id} className={`py-10 md:py-14 bg-white relative overflow-hidden ${className}`}>
      {withScrollReveal ? (
        <ScrollReveal direction="up" distance={30}>
          {content}
        </ScrollReveal>
      ) : (
        content
      )}
    </section>
  );
}
