"use client";

import React, { useEffect, useRef } from "react";

export default function CourseTestimonials() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && !containerRef.current.querySelector("script")) {
      const script = document.createElement("script");
      script.src = "https://cdn.trustindex.io/loader.js?9c0b1567339790054b7640bd9eb";
      script.defer = true;
      script.async = true;
      containerRef.current.appendChild(script);
    }
  }, []);

  return (
    <div ref={containerRef} className="trustindex-wrapper w-full">
      {/* Trustindex will inject its iframe/widget here */}
    </div>
  );
}
