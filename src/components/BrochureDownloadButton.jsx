"use client";

import React from "react";

export default function BrochureDownloadButton({ brochureUrl, courseName, className, children }) {
  const handleClick = (e) => {
    e.preventDefault();
    window.dispatchEvent(
      new CustomEvent("openDownloadBrochure", {
        detail: { brochureUrl, courseName }
      })
    );
  };

  return (
    <button onClick={handleClick} className={className} type="button">
      {children}
    </button>
  );
}
