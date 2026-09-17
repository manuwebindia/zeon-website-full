"use client";

import { FaCheckCircle, FaGraduationCap } from "react-icons/fa";
import NextBatchDate from "../NextBatchDate";
import DimensionalSwitchSlider from "@/components/ui/dimensional-switch-slider";

export default function HeroSection({ nextBatchDate }) {
  return (
        <section className="pt-24 pb-8 md:pt-28 md:pb-10 lg:pt-32 lg:pb-12 xl:pt-36 xl:pb-16 bg-white xl:bg-zeon-banner bg-no-repeat bg-center bg-cover relative overflow-x-hidden">
          <div className="w-full max-w-[1200px] mx-auto px-6 flex items-center justify-between gap-14 max-[1024px]:flex-col max-[1024px]:text-center max-[1024px]:gap-0">
            {/* Left Box (Desktop wrapper, bypassed on Mobile) */}
            <div className="flex-1 max-w-[540px] max-[1024px]:contents">
              
              {/* TOP SECTION (Mobile: Above Image) */}
              <div className="animate-fade-in-up max-[1024px]:order-1 max-[1024px]:flex max-[1024px]:flex-col max-[1024px]:items-center max-[1024px]:w-full">
                {/* Admission Badge */}
                <div className="inline-flex items-center gap-2 bg-primary-light text-primary border border-primary/12 rounded-full px-4 py-1.5 text-[0.78rem] font-bold tracking-wide mb-7">
                  <span className="w-[7px] h-[7px] bg-primary rounded-full inline-block shadow-[0_0_8px_var(--color-primary)] animate-pulse-badge" />
                  Next batch starts on <NextBatchDate serverDate={nextBatchDate} />
                </div>

                {/* Headline */}
                <h1 className="text-[clamp(2.2rem,4.5vw,3.0rem)] font-extrabold leading-[1.15] text-heading mb-5 tracking-tight drop-shadow-sm">
                  Become a{" "}
                  <span className="text-transparent bg-clip-text bg-primary">Certified Digital Marketer</span>{" "}
                  with 100% Placement Support
                </h1>

                {/* Sub-copy */}
                <p className="text-base !text-[#333333] leading-[1.7] mb-8 max-w-[560px] max-[1024px]:max-w-full max-[1024px]:mb-0">
                  Start your career with Kerala&apos;s most practical, job-driven
                  Digital Marketing Program. Real projects. Real skills. Real jobs.
                </p>
              </div>

              {/* BOTTOM SECTION (Mobile: Below Image) */}
              <div className="animate-fade-in-up max-[1024px]:order-3 max-[1024px]:flex max-[1024px]:flex-col max-[1024px]:items-center max-[1024px]:w-full">
                {/* Feature Pills */}
                <div className="flex gap-2.5 flex-nowrap mb-8 max-[1024px]:justify-center">
                  <span className="inline-flex items-center gap-1.5 sm:gap-2 bg-primary-light text-primary border-primary/12 rounded-full px-3 sm:px-4 py-2 text-[0.7rem] sm:text-[0.8rem] font-semibold transition-colors duration-300 ">
                    <FaCheckCircle /> 100% Placement Support
                  </span>
                  <span className="inline-flex items-center gap-1.5 sm:gap-2 bg-primary-light text-primary border-primary/12 rounded-full px-3 sm:px-4 py-2 text-[0.7rem] sm:text-[0.8rem] font-semibold transition-colors duration-300 ">
                    <FaGraduationCap /> Internship Included
                  </span>
                </div>

                {/* CTAs */}
                <div className="flex gap-3 flex-col sm:flex-row sm:flex-nowrap max-[1024px]:justify-center max-[1024px]:w-full max-[1024px]:max-w-[400px]">
                  <a
                    href="#counsellor"
                    className="inline-flex items-center justify-center px-7 py-3.5 rounded-full font-semibold text-base bg-primary text-white shadow-glow transition-all duration-300 hover:bg-primary-hover hover:shadow-glow-hover hover:-translate-y-0.5 whitespace-nowrap w-full sm:w-auto"
                  >
                    Talk to our Counsellor
                  </a>
                  <a
                    href="#demo"
                    className="inline-flex items-center justify-center px-7 py-3.5 rounded-full font-semibold text-base bg-transparent text-heading border border-black/50 transition-all duration-300 hover:border-primary hover:text-primary hover:bg-primary-light whitespace-nowrap w-full sm:w-auto"
                  >
                    Book a Free Demo Class
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Image & Orbs */}
            <div className="flex-[0_0_min(520px,46%)] min-[1025px]:max-w-[520px] relative z-10 max-[1024px]:flex-none max-[1024px]:w-full max-[1024px]:max-w-[540px] max-[1024px]:mx-auto max-[1024px]:order-2 max-[1024px]:my-8">
              {/* Premium Glow Orbs */}
              <div className="absolute top-10 -left-10 w-[200px] h-[200px] bg-primary/20 rounded-full blur-3xl z-[-1] animate-pulse-glow" />
              <div className="absolute -bottom-10 -right-10 w-[250px] h-[250px] bg-[#ff8c4a]/20 rounded-full blur-3xl z-[-1] animate-pulse-glow hover:bg-primary/30" />
              
              <DimensionalSwitchSlider
                infinite
                direction="horizontal"
                autoplay
                autoplayDelay={2600}
                textColor="#ffffff"
                textSize={30}
                cardWidth={680}
                cardHeight={460}
                cardBorderRadius={16}
              />
            </div>
          </div>
        </section>
  );
}


