"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

const steps = [
  {
    num: "01",
    title: "Fill Online Form",
    desc: "Complete the admission form with your personal details and required documents to initiate the process.",
  },
  {
    num: "02",
    title: "Pay First Installment",
    desc: "Secure your seat by paying an initial fee of ₹5,000 through our secure payment system.",
  },
  {
    num: "03",
    title: "Get Confirmation",
    desc: "Receive your admission confirmation along with batch details and schedule via call or whatsapp.",
  },
  {
    num: "04",
    title: "Start Learning",
    desc: "Join your batch, meet your expert trainers, and begin your digital marketing journey right away.",
  },
];

export default function AdmissionTimeline() {
  const [visible, setVisible] = useState([]);
  const refs = useRef([]);

  useEffect(() => {
    const observers = refs.current.map((el, i) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting)
            setVisible((prev) =>
              prev.includes(i) ? prev : [...prev, i]
            );
        },
        { threshold: 0.2 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <div className="flex bg-[#201e1e] rounded-[32px] overflow-hidden mt-14 shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
      {/* Left side image - hidden on mobile */}
      <div className="hidden xl:block flex-[0_0_35%] min-w-[320px] relative p-10 pr-0">
        <div className="w-full h-full rounded-3xl overflow-hidden relative shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
          <Image
            src="/web-pic.webp"
            alt="Student learning digital marketing"
            quality={100}
            unoptimized
            fill
            style={{ objectFit: "cover", objectPosition: "center top" }}
          />
        </div>
      </div>

      {/* Right side content */}
      <div className="flex-1 p-8 md:py-14 md:px-14 md:pl-14 flex flex-col">
        <div className="flex flex-col">
          {steps.map((step, i) => (
            <div
              key={i}
              ref={(el) => (refs.current[i] = el)}
              className={`flex items-start gap-6 md:gap-8 py-8 md:py-10 border-b-2 border-dashed border-white/15 opacity-0 translate-y-5 transition-all duration-600 group ${
                i === 0 ? "pt-0" : ""
              } ${visible.includes(i) ? "!opacity-100 !translate-y-0" : ""} max-sm:flex-col max-sm:gap-4 max-sm:py-8`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="text-[2.5rem] font-extrabold leading-none shrink-0 min-w-[60px] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 transition-all duration-300 group-hover:from-primary group-hover:to-[#ff8c4a] drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] group-hover:drop-shadow-[0_0_15px_rgba(255,68,68,0.4)]">
                {step.num}
              </div>
              <div className="flex-1">
                <h4 className="text-[1.15rem] font-bold text-white mb-2 transition-colors duration-300 group-hover:text-primary">
                  {step.title}
                </h4>
                <p className="text-[0.95rem] text-white/70 leading-relaxed m-0">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 flex items-center justify-between gap-8 max-sm:flex-col max-sm:items-start">
          <p className="text-base text-white leading-snug font-medium m-0">
            Begin your career
            <br />
            transformation right now.
          </p>
          <a
            href="#apply"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-base bg-primary text-white shadow-glow transition-all duration-300 hover:bg-primary-hover hover:shadow-glow-hover hover:-translate-y-0.5 border-none"
          >
            Apply Now
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 448 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
