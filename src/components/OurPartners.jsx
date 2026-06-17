"use client";

import React from "react";
import Image from "next/image";

const allPartners = [
  "/partners/adox-global-1.webp",
  "/partners/Auctor_Logo_1024x724-01-1024x724.webp",
  "/partners/capsdata-3.webp",
  "/partners/classis-digital-6.webp",
  "/partners/edbe-logo.webp",
  "/partners/evolux_logo-768x384.webp",
  "/partners/findmyhostel.webp",
  "/partners/first-reach-6.webp",
  "/partners/global-visa-logo.webp",
  "/partners/ieie.webp",
  "/partners/IMG-20230404-WA0001.webp",
  "/partners/ishkhan-4.webp",
  "/partners/kerala-paints-5.webp",
  "/partners/log_3.webp",
  "/partners/logo_10.webp",
  "/partners/logo_4.webp",
  "/partners/logo_6.webp",
  "/partners/logo_8.webp",
  "/partners/logo_9.webp",
  "/partners/logo_anata.webp",
  "/partners/logos-02-01-1024x724.webp",
  "/partners/logos-02-02-1024x724.webp",
  "/partners/maad-concepts.webp",
  "/partners/maruti-suzuki 1.webp",
  "/partners/oppiatec-logo.webp",
  "/partners/pepebbq.webp",
  "/partners/peraka.webp",
  "/partners/whiteswan-2.webp",
  "/partners/wistora.webp",
  "/partners/zenesty.webp",
];

const row1 = allPartners.slice(0, 10);
const row2 = allPartners.slice(10, 20);
const row3 = allPartners.slice(20);

function MarqueeRow({ items, direction = "left", speed = "40s" }) {
  /* 2 copies needed for seamless infinite scroll with translateX(-50%) */
  const duplicatedItems = [...items, ...items];

  return (
    <div className="marquee-wrapper overflow-hidden w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <div
        className={`marquee-track ${
          direction === "right" ? "marquee-reverse" : ""
        }`}
        style={{ animationDuration: speed }}
      >
        {duplicatedItems.map((imgSrc, idx) => (
          <div
            key={idx}
            className="w-[220px] h-[90px] bg-white rounded-xl mx-4 flex items-center justify-center p-6 shadow-card border border-border shrink-0 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-card-hover md:w-[220px] md:h-[90px] max-md:w-[180px] max-md:h-[75px] max-md:mx-3"
          >
            <Image
              src={imgSrc}
              alt="Hiring Partner"
              width={0}
              height={0}
              sizes="120px"
              loading="lazy"
              style={{
                width: "auto",
                height: "48px",
                maxWidth: "100%",
                objectFit: "contain",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OurPartners() {
  return (
    <section className="py-10 md:py-14 lg:py-16 xl:py-20 bg-surface overflow-hidden">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-[4.5rem] max-w-[750px] mx-auto relative">
          <span className="inline-block text-primary text-[0.85rem] font-semibold mb-5 tracking-[0.2em] uppercase">
            Placements
          </span>
          <h2 className="text-[clamp(2.2rem,4vw,3rem)] font-extrabold text-heading mb-4 leading-tight">
            100+ <span className="text-primary">Hiring Partners</span>
          </h2>
          <p className="text-[1.15rem] text-body leading-relaxed font-medium">
            Our students are placed and working successfully in top companies.
          </p>
        </div>
      </div>

      <div className="relative flex flex-col gap-6 mt-14 mb-10 overflow-hidden">
        {/* Fading transparent edges */}
        <div className="marquee-fade-left absolute top-0 bottom-0 left-0 w-[15%] z-10 pointer-events-none" />
        <div className="marquee-fade-right absolute top-0 bottom-0 right-0 w-[15%] z-10 pointer-events-none" />

        <MarqueeRow items={row1} direction="left" speed="35s" />
        <MarqueeRow items={row2} direction="right" speed="30s" />
        <MarqueeRow items={row3} direction="left" speed="40s" />
      </div>

      <div className="w-full max-w-[1200px] mx-auto px-6">
        <p className="text-center text-[1.1rem] font-semibold text-body opacity-80">
          And many more companies across India...
        </p>
      </div>
    </section>
  );
}