"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ScrollReveal({ 
  children, 
  direction = "up", 
  delay = 0, 
  duration = 0.45,
  distance = 50,
  className = "" 
}) {
  const ref = useRef(null);

  useEffect(() => {
    // Only register on the client side
    gsap.registerPlugin(ScrollTrigger);

    let yOffset = direction === "up" ? distance : direction === "down" ? -distance : 0;
    let xOffset = direction === "left" ? distance : direction === "right" ? -distance : 0;

    // Use a small timeout to ensure the DOM is fully painted and measured
    const timer = setTimeout(() => {
      const anim = gsap.fromTo(
        ref.current,
        { opacity: 0, y: yOffset, x: xOffset },
        {
          opacity: 1,
          y: 0,
          x: 0,
          duration: duration,
          delay: delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 88%", // Trigger when top of element hits 85% from top of viewport
            toggleActions: "play none none reverse", // Play on scroll down, reverse on scroll up
          },
        }
      );

      return () => {
        anim.scrollTrigger?.kill();
        anim.kill();
      };
    }, 100);

    return () => clearTimeout(timer);
  }, [direction, delay, duration, distance]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
