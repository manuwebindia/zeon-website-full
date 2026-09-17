"use client";

import React from "react";
import dynamic from "next/dynamic";
import ScrollReveal from "../ScrollReveal";
import CourseTestimonials from "../CourseTestimonials";

const TestimonialsSlider = dynamic(() => import("../TestimonialsSlider"), {
  ssr: false,
});

export default function TestimonialsSection({
  badge = "Reviews",
  title = (
    <>
      What Our Students Say About{" "}
      <span className="text-primary">Zeon Academy</span>
    </>
  ),
  subtitle = "Real experiences from students who completed the Digital Marketing Career Program.",
  showVideos = true,
  showGoogleReviews = true,
  className = "",
  id = "testimonials",
}) {
  return (
    <section
      id={id}
      className={`py-10 md:py-14 lg:py-16 xl:py-20 bg-white relative overflow-hidden ${className}`}
    >
      <div className="w-full max-w-[1200px] mx-auto px-6 text-center">
        {/* Section Header */}
        <ScrollReveal direction="up" distance={30}>
          <div className="text-center mb-[4.5rem] max-w-6xl mx-auto">
            {badge && (
              <span className="inline-block text-primary text-[0.85rem] font-semibold mb-5 tracking-[0.2em] uppercase">
                {badge}
              </span>
            )}
            {title && (
              <h2 className="text-[clamp(2.2rem,4vw,3rem)] font-extrabold text-heading mb-4 leading-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-[1.15rem] text-body leading-relaxed font-medium">
                {subtitle}
              </p>
            )}
          </div>
        </ScrollReveal>

        {/* Video Testimonials Slider */}
        {showVideos && (
          <ScrollReveal direction="up" distance={30} delay={0.1}>
            <div className={showGoogleReviews ? "mb-12 md:mb-14" : ""}>
              <TestimonialsSlider />
            </div>
          </ScrollReveal>
        )}

        {/* Google Reviews Integration */}
        {showGoogleReviews && (
          <ScrollReveal direction="up" distance={30} delay={0.15}>
            <div className={showVideos ? "pt-8 border-t border-slate-200/80" : ""}>
              <CourseTestimonials />
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
