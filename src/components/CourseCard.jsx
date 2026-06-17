"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronDown, FiBookOpen, FiAward, FiBriefcase } from "react-icons/fi";

export default function CourseCard({
  title,
  price,
  duration,
  learnList,
  extraTopics,
  syllabus,
  isPopular,
  hasGST = false,
  mode = "online",
  slug,
  image,
  certifications,
  placement,
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleSync = (e) => {
      setIsOpen(e.detail);
    };
    window.addEventListener("syncSyllabusToggle", handleSync);
    return () => window.removeEventListener("syncSyllabusToggle", handleSync);
  }, []);

  const handleToggle = () => {
    const newState = !isOpen;
    // Broadcast state to sync all other CourseCards instantly
    window.dispatchEvent(
      new CustomEvent("syncSyllabusToggle", { detail: newState })
    );
    setIsOpen(newState);
  };

  const isOnline = mode === "online";
  const theme = isOnline 
    ? {
        borderPopular: "border border-border shadow-[0_8px_30px_rgba(11,92,255,0.06)] hover:shadow-[0_20px_50px_rgba(11,92,255,0.12)] hover:border-[#0B5CFF]/30",
        borderNormal: "border border-border shadow-[0_8px_30px_rgba(11,92,255,0.06)] hover:shadow-[0_20px_50px_rgba(11,92,255,0.12)] hover:border-[#0B5CFF]/30",
        ribbonBg: "bg-[#0B5CFF]",
        textPrimary: "text-[#0B5CFF]",
        checkColor: "before:text-[#0B5CFF]",
        btnPopular: "bg-[#0B5CFF] border-2 border-transparent text-white hover:bg-[#084BCE] hover:-translate-y-0.5 shadow-[0_4px_15px_rgba(11,92,255,0.25)]",
        btnNormal: "bg-transparent text-[#0B5CFF] border-2 border-[#0B5CFF] hover:bg-[#0B5CFF] hover:text-white hover:-translate-y-0.5",
      }
    : {
        borderPopular: "border border-border shadow-[0_8px_30px_rgba(16,185,129,0.06)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.12)] hover:border-primary/30",
        borderNormal: "border border-border shadow-[0_8px_30px_rgba(16,185,129,0.06)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.12)] hover:border-primary/30",
        ribbonBg: "bg-primary",
        textPrimary: "text-primary",
        checkColor: "before:text-primary",
        btnPopular: "bg-primary border-2 border-transparent text-white hover:bg-primary-hover hover:-translate-y-0.5 shadow-glow",
        btnNormal: "bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white hover:-translate-y-0.5",
      };

  return (
    <div
      className={`relative flex flex-col rounded-3xl bg-white text-left transition-all duration-300 hover:-translate-y-2 ${
        isPopular ? theme.borderPopular : theme.borderNormal
      }${isOpen ? " self-start" : ""}`}
    >
      {/* Popular Ribbon */}
      {isPopular && (
        <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 ${theme.ribbonBg} text-white text-[0.72rem] font-black px-4 py-1.5 rounded-full tracking-wider uppercase whitespace-nowrap z-10 shadow-sm`}>
          Most Popular
        </div>
      )}

      {/* Clickable image + title area */}
      {slug ? (
        <Link href={slug} className="block group/card">
          {image && (
            <div className="relative w-full h-[200px] rounded-t-3xl overflow-hidden shrink-0">
              <Image
                src={image}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover/card:scale-105"
              />
            </div>
          )}
        </Link>
      ) : (
        image && (
          <div className="relative w-full h-[200px] rounded-t-3xl overflow-hidden shrink-0">
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        )
      )}

      <div className="flex flex-col h-full p-7 pb-9">
        {/* Title & Duration */}
        {slug ? (
          <Link href={slug} className={`text-[1.3rem] font-extrabold text-heading mb-2 leading-snug block hover:${theme.textPrimary} transition-colors duration-200`}>
            {title}
          </Link>
        ) : (
          <h3 className="text-[1.3rem] font-extrabold text-heading mb-2 leading-snug">
            {title}
          </h3>
        )}
        
        <div className="flex items-center gap-2 text-[0.92rem] text-heading font-bold mb-4">
          <span className="text-body font-semibold">Duration:</span>
          <span>{duration}</span>
        </div>



        {/* Divider */}
        <div className="w-full h-px bg-border mb-5" />

        {/* Features */}
        <h4 className="text-[0.78rem] font-extrabold tracking-widest uppercase text-body mb-4 flex items-center gap-2">
          <FiBookOpen className={`${theme.textPrimary} text-sm`} /> What You'll Learn
        </h4>
        
        <ul className="flex flex-col gap-2.5 mb-6 list-none p-0">
          {learnList.map((item, idx) => (
            <li
              key={idx}
              className={`text-[0.9rem] text-body leading-snug flex items-start gap-2 relative before:content-['✓'] before:font-[800] before:text-[0.85rem] before:mt-[1px] before:flex-shrink-0 ${theme.checkColor}`}
            >
              {item}
            </li>
          ))}
          {extraTopics && (
            <li className={`text-[0.9rem] font-semibold text-heading flex items-start gap-2 relative before:content-['✓'] before:font-[800] before:text-[0.85rem] before:mt-[1px] before:flex-shrink-0 ${theme.checkColor}`}>
              {extraTopics}
            </li>
          )}
        </ul>

        {/* Syllabus Accordion */}
        {syllabus && syllabus.length > 0 && (
          <div className="border-t border-border pt-5 mb-6 mt-auto">
            <button
              className="flex items-center justify-between gap-2 w-full bg-transparent border-none text-[0.88rem] font-bold text-heading cursor-pointer py-1.5 font-[inherit]"
              onClick={handleToggle}
              aria-expanded={isOpen}
            >
              <span>View Full Syllabus</span>
              <FiChevronDown
                className={`text-lg text-body transition-transform duration-300 ${
                  isOpen ? `rotate-180 ${theme.textPrimary}` : ""
                }`}
              />
            </button>

            <div
              className={`syllabus-content-wrapper ${isOpen ? "open" : ""}`}
            >
              <div className="syllabus-content text-left">
                {syllabus.map((mod, idx) => (
                <div key={idx} className="mt-4">
                  <h5 className="text-[0.88rem] text-heading mb-2 leading-snug">
                    {mod.title.includes(":") ? (
                      <>
                        <span className="font-bold">{mod.title.split(":")[0]}:</span>
                        <span className="font-normal ml-1">{mod.title.split(":")[1]}</span>
                      </>
                    ) : (
                      <span className="font-semibold">{mod.title}</span>
                    )}
                  </h5>
                  <ul className="list-none text-[0.82rem] text-body flex flex-col gap-1.5 p-0">
                    {mod.topics.map((t, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-1.5 leading-snug"
                      >
                        <span className="text-border font-bold text-gray-400">•</span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
        )}

        {/* CTA Buttons */}
        <div className="mt-auto grid grid-cols-1 min-[450px]:grid-cols-2 md:grid-cols-1 xl:grid-cols-2 gap-3 w-full">
          <button
            onClick={(e) => {
              e.preventDefault();
              window.dispatchEvent(new CustomEvent("openBookDemo", { detail: { courseName: title } }));
            }}
            className={`inline-flex items-center justify-center rounded-[36px] py-3.5 px-4 font-bold text-[0.88rem] leading-tight transition-all duration-300 whitespace-nowrap cursor-pointer w-full ${
              isPopular ? theme.btnPopular : theme.btnNormal
            }`}
          >
            Book Free Demo
          </button>
          
          {slug ? (
            <Link
              href={slug}
              className="inline-flex items-center justify-center rounded-[36px] py-3.5 px-4 font-bold text-[0.88rem] leading-tight transition-all duration-300 bg-transparent border-2 border-black/50 text-heading hover:border-primary hover:text-primary whitespace-nowrap w-full text-center"
            >
              View Details
            </Link>
          ) : (
            <a
              href="#fees"
              className="inline-flex items-center justify-center rounded-[36px] py-3.5 px-4 font-bold text-[0.88rem] leading-tight transition-all duration-300 bg-transparent border-2 border-black/50 text-heading hover:border-primary hover:text-primary whitespace-nowrap w-full text-center"
            >
              View Fee
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
