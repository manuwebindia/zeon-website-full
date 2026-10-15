"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

export default function FAQAccordion({ faqs = [] }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="w-full divide-y divide-border border-y border-border">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className="transition-colors">
            <button
              type="button"
              onClick={() => toggleFAQ(index)}
              className="flex items-center justify-between w-full py-4 md:py-5 text-left bg-transparent border-none cursor-pointer group focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="text-[1.05rem] md:text-[1.12rem] font-bold text-heading pr-6 leading-snug group-hover:text-primary transition-colors">
                {faq.question}
              </span>
              <FiChevronDown
                className={`text-xl shrink-0 transition-transform duration-300 ${
                  isOpen ? "rotate-180 text-primary" : "text-heading/70 group-hover:text-primary"
                }`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? "grid-rows-[1fr] opacity-100 pb-5" : "grid-rows-[0fr] opacity-0 pb-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="text-[0.95rem] md:text-[1rem] text-body leading-relaxed font-normal pr-8">
                  {faq.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
