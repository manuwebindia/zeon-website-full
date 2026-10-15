"use client";

import React from "react";

export default function BookDemoButton({
  courseName = "Free Live Demo Class",
  className = "",
  children,
}) {
  const handleClick = (e) => {
    e.preventDefault();
    window.dispatchEvent(
      new CustomEvent("openBookDemo", {
        detail: { courseName },
      })
    );
  };

  return (
    <button onClick={handleClick} className={className} type="button">
      {children}
    </button>
  );
}
