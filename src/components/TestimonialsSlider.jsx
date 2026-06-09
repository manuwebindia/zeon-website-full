"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { FaStar, FaPlayCircle, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

const testimonials = [
  {
    id: 1,
    videoId: "lyLnCVILa7w",
    quote: '"Zeon Academy helped me gain industry-ready skills that got me placed within weeks."',
    name: "Micha & Akshlin",
    role: "Digital Marketing Graduate",
  },
  {
    id: 2,
    videoId: "C6Ek7rJvw6g",
    quote: '"Hands-on project work and trainer support set me apart in interviews."',
    name: "Rohit, Ahalia & Linsha",
    role: "Digital Marketing Graduate",
  },
  {
    id: 3,
    videoId: "9k2zSUHTY_A",
    quote: '"Practical learning and placement guidance changed my career trajectory."',
    name: "Abhinav, Sneha & Neeraj",
    role: "Digital Marketing Graduate",
  },
  {
    id: 4,
    videoId: "uSv5G3y_UV8",
    quote: '"The comprehensive curriculum and real projects prepared me for the industry."',
    name: "Linsha",
    role: "Digital Marketing Graduate",
  },
  {
    id: 5,
    videoId: "BV-7RaPJ0DQ",
    quote: '"Supportive trainers and a real project experience—this course changed my career."',
    name: "Joyal",
    role: "Digital Marketing Graduate",
  },
  {
    id: 6,
    videoId: "IQqtg4M-vsg",
    quote: '"Amazing learning experience with practical focus."',
    name: "Anupama",
    role: "Digital Marketing Graduate",
  },
];

export default function TestimonialsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);
  const [activeVideo, setActiveVideo] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const maxIndex = testimonials.length - cardsToShow;

  useEffect(() => {
    const updateCardsToShow = () => {
      if (window.innerWidth < 768) setCardsToShow(1);
      else if (window.innerWidth < 1024) setCardsToShow(2);
      else setCardsToShow(3);
    };
    updateCardsToShow();
    window.addEventListener("resize", updateCardsToShow);
    return () => window.removeEventListener("resize", updateCardsToShow);
  }, []);

  // Reset index if it goes out of bounds when resizing
  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, Math.max(0, maxIndex)));
  }, [cardsToShow, maxIndex]);

  useEffect(() => {
    if (activeVideo) return;
    const slideTimer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(slideTimer);
  }, [cardsToShow, activeVideo, maxIndex]);

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
    <>
      {/* Slider Container */}
      <div
        className="overflow-hidden relative w-full cursor-grab active:cursor-grabbing select-none"
        ref={containerRef}
      >
        <motion.div
          className="flex"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={(e, info) => {
            setIsDragging(false);
            handleDragEnd(e, info);
          }}
          animate={{ x: getXOffset(currentIndex) }}
          transition={{ type: "spring", stiffness: 300, damping: 35 }}
        >
          {testimonials.map((t, index) => (
            <div
              className="px-3 md:px-4 box-border flex-shrink-0"
              key={index}
              style={{ width: `${100 / cardsToShow}%` }}
            >
              <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-card flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                {/* Thumbnail */}
                <div
                  className="relative w-full pb-[56.25%] bg-black overflow-hidden group"
                  onClick={() => !isDragging && setActiveVideo(t.videoId)}
                  role="button"
                  tabIndex={0}
                  style={{ cursor: isDragging ? "grabbing" : "pointer" }}
                >
                  <Image
                    src={`https://img.youtube.com/vi/${t.videoId}/hqdefault.jpg`}
                    alt={`Thumbnail for ${t.name}`}
                    width={480}
                    height={360}
                    className="absolute inset-0 w-full h-full object-cover opacity-90 transition-all duration-400 group-hover:scale-105 group-hover:opacity-70"
                    unoptimized
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 z-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-80" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[2] text-white opacity-90 transition-all duration-500 group-hover:scale-125 group-hover:text-white">
                    <div className="absolute inset-0 bg-primary/40 rounded-full blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse-glow" />
                    <FaPlayCircle className="text-[3.5rem] drop-shadow-[0_4px_15px_rgba(0,0,0,0.6)] relative z-10" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 text-left flex flex-col flex-1">
                  <div className="flex gap-1 text-gold mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                  <p className="text-[1.05rem] text-body leading-relaxed italic mb-6 flex-1">
                    {t.quote}
                  </p>
                  <h4 className="text-xl font-extrabold text-heading mb-1">
                    {t.name}
                  </h4>
                  <span className="text-[0.9rem] text-primary font-semibold">
                    {t.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Indicators */}
        <div className="flex justify-center gap-3 mt-8">
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

      {/* Video Popup Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[9999] flex items-center justify-center p-8 animate-fade-in"
          onClick={() => setActiveVideo(null)}
        >
          <button
            className="absolute top-6 right-8 bg-transparent border-none text-white text-[2.5rem] cursor-pointer transition-all duration-300 z-[10000] hover:text-primary hover:scale-110"
            onClick={() => setActiveVideo(null)}
          >
            <FaTimes />
          </button>
          <div
            className="w-full max-w-[900px] bg-black rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full pb-[56.25%]">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo}?autoplay=1&rel=0`}
                title="Zeon Academy Student Testimonial"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                className="absolute inset-0 w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
