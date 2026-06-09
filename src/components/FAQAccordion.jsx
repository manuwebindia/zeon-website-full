"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

export default function FAQAccordion({ faqs }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-[850px] mx-auto space-y-4">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className={`bg-white border rounded-2xl transition-all duration-300 overflow-hidden ${
              isOpen
                ? "border-primary/30 shadow-[0_10px_25px_rgba(255,68,68,0.05)]"
                : "border-border hover:border-primary/20 shadow-[0_4px_15px_rgba(0,0,0,0.01)]"
            }`}
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="flex items-center justify-between w-full p-6 text-left font-[inherit] bg-transparent border-none cursor-pointer focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="text-[1.1rem] font-bold text-heading pr-4 leading-snug">
                {faq.question}
              </span>
              <span
                className={`w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-body shrink-0 transition-all duration-300 ${
                  isOpen ? "bg-primary text-white border-transparent rotate-180" : ""
                }`}
              >
                <FiChevronDown className="text-lg" />
              </span>
            </button>
            <div
              className={`transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-[500px] opacity-100 border-t border-border/60" : "max-h-0 opacity-0 pointer-events-none"
              }`}
            >
              <div className="p-6 text-[0.98rem] text-body leading-relaxed font-medium bg-[#fcfdfe]">
                {faq.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
