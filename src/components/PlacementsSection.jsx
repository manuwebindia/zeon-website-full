"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const placements = [
  { name: "Naveen K George", role: "Digital Marketing Executive", company: "INMAKES INFOTECH", image: "/placements/naveen.webp" },
  { name: "Elsa Rose Biju", role: "Content Writer & Creator", company: "NEYNDRA SOLUTIONS", image: "/placements/elsa.webp" },
  { name: "Saniga Suresh", role: "SEO Executive", company: "REATEAM HACKER ACADEMY", image: "/placements/sanigha.webp" },
  { name: "Ann Mariya Sojan", role: "Digital Marketing Executive", company: "AIVES AUSTRALIA", image: "/placements/ann.webp" },
  { name: "Rohit Nair S D", role: "Social Media Marketer", company: "SHIFT AUTOMOTIVE", image: "/placements/rohit.webp" },
  { name: "Micah Mark Shelji", role: "Content Creator cum Video Editor", company: "COVERSUN CURTAINS", image: "/placements/micah.webp" },
  { name: "Sneha Josy", role: "Digital Marketing & Social Media Executive", company: "VARDHAKI", image: "/placements/sneha.webp" },
];

export default function PlacementsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(4);
  const containerRef = useRef(null);
  const maxIndex = placements.length - cardsToShow;

  useEffect(() => {
    const updateCardsToShow = () => {
      if (window.innerWidth < 640) setCardsToShow(1);
      else if (window.innerWidth < 1024) setCardsToShow(2);
      else if (window.innerWidth < 1280) setCardsToShow(3);
      else setCardsToShow(4);
    };
    updateCardsToShow();
    window.addEventListener("resize", updateCardsToShow);
    return () => window.removeEventListener("resize", updateCardsToShow);
  }, []);

  // Reset index if out of bounds on resize
  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, Math.max(0, maxIndex)));
  }, [cardsToShow, maxIndex]);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(slideTimer);
  }, [cardsToShow, maxIndex]);

  const getXOffset = useCallback((index) => {
    if (!containerRef.current) return 0;
    const cardWidth = containerRef.current.offsetWidth / cardsToShow;
    return -(index * cardWidth);
  }, [cardsToShow]);

  const handleDragEnd = (event, info) => {
    const threshold = 60;
    if (info.offset.x < -threshold && currentIndex < maxIndex) {
      setCurrentIndex((prev) => prev + 1);
    } else if (info.offset.x > threshold && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <section className="py-10 md:py-14 lg:py-16 xl:py-20 bg-white overflow-hidden">
      <div className="w-full max-w-[1200px] mx-auto px-6 relative">
        <div className="text-center mb-[4.5rem] max-w-[750px] mx-auto">
          <span className="inline-block text-primary text-[0.85rem] font-semibold mb-5 tracking-[0.2em] uppercase">
            Placements
          </span>
          <h2 className="text-[clamp(2.2rem,4vw,3rem)] font-extrabold text-heading mb-4 leading-tight">
            Our Success <span className="text-primary">Stories</span>
          </h2>
          <p className="text-[1.15rem] text-body leading-relaxed font-medium">
            Meet our recent graduates who upgraded their careers and secured placements at top companies.
          </p>
        </div>

        <div
          className="overflow-hidden relative w-full py-4 -my-4 cursor-grab active:cursor-grabbing select-none"
          ref={containerRef}
        >
          <motion.div
            className="flex"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            animate={{ x: getXOffset(currentIndex) }}
            transition={{ type: "spring", stiffness: 300, damping: 35 }}
          >
            {placements.map((student, i) => (
              <div
                key={i}
                className="px-3 md:px-4 box-border flex-shrink-0"
                style={{ width: `${100 / cardsToShow}%` }}
              >
                <div className="relative bg-white rounded-[20px] p-6 pt-10 flex flex-col items-center text-center shadow-card border border-border/40 hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300 h-full">
                  {/* Placed Ribbon */}
                  <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden rounded-tr-[20px] z-10 pointer-events-none">
                    <div className="absolute top-5 -right-7 w-36 rotate-45 transform bg-primary py-1.5 text-center text-[0.65rem] font-extrabold tracking-widest text-white shadow-sm">
                      PLACED
                    </div>
                  </div>

                  {/* Avatar Wrapper */}
                  <div className="w-[200px] h-[200px] relative mb-5">
                    <div className="absolute inset-0 rounded-[12px] border-2 border-border/40" />
                    <Image
                      src={student.image}
                      alt={student.name}
                      width={200}
                      height={200}
                      className="block rounded-[12px] w-full object-cover"
                      draggable={false}
                    />
                  </div>

                  {/* Info */}
                  <h3 className="text-heading font-bold text-[1.1rem] mb-1">
                    {student.name}
                  </h3>
                  <p className="text-body font-medium text-[0.95rem] mb-5">
                    {student.role}
                  </p>

                  {/* Divider */}
                  <div className="w-full h-[1px] bg-border/40 mt-auto mb-4" />

                  {/* Company */}
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-body text-[0.65rem] font-bold uppercase tracking-widest opacity-60">
                      Placed At
                    </span>
                    <p className="text-primary font-bold text-[0.75rem] tracking-wider uppercase text-center">
                      {student.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-3 mt-10">
          {Array.from({ length: Math.max(1, maxIndex + 1) }).map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded cursor-pointer transition-all duration-300 ${
                idx === currentIndex
                  ? "bg-primary w-[60px]"
                  : "bg-border w-[40px] hover:bg-body/30"
              }`}
              onClick={() => setCurrentIndex(idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
