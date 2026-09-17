"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ScrollReveal({ 
  children, 
  direction = "up", 
  delay = 0, 
  duration = 0.35,
  distance = 25,
  start = "top 96%",
  once = true,
  className = "" 
}) {
  const ref = useRef(null);

  useEffect(() => {
    // Only register on the client side
    gsap.registerPlugin(ScrollTrigger);

    let yOffset = direction === "up" ? distance : direction === "down" ? -distance : 0;
    let xOffset = direction === "left" ? distance : direction === "right" ? -distance : 0;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: yOffset, x: xOffset },
        {
          opacity: 1,
          y: 0,
          x: 0,
          duration: duration,
          delay: delay,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current,
            start: start,
            once: once,
            toggleActions: once ? "play none none none" : "play none none reverse",
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [direction, delay, duration, distance, start, once]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
