"use client";

import { useEffect, useRef, useState } from "react";
import { FaChalkboardTeacher, FaVideo } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";

const TABS = [
  { id: "online", label: "Online Courses", Icon: FaVideo },
  { id: "offline", label: "Offline Courses", Icon: FaChalkboardTeacher },
];

function TabIcon({ Icon, active }) {
  return (
    <div
      className={`flex items-center justify-center w-[26px] h-[26px] rounded-[8px] shadow-sm transition-colors duration-300 ${
        active ? "bg-white text-[#D40303]" : "bg-[#D40303] text-white"
      }`}
    >
      <Icon className="text-[12px]" fill="currentColor" />
    </div>
  );
}

export default function CourseTabs({ offlineCourses, onlineCourses }) {
  const [activeTab, setActiveTab] = useState("online");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const active = TABS.find((tab) => tab.id === activeTab) ?? TABS[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectTab = (tabId) => {
    setActiveTab(tabId);
    setDropdownOpen(false);
  };

  return (
    <>
      {/* Mobile dropdown */}
      <div className="md:hidden flex justify-center mb-10 px-1" ref={dropdownRef}>
        <div className="relative w-full max-w-sm">
          <button
            type="button"
            onClick={() => setDropdownOpen((open) => !open)}
            aria-expanded={dropdownOpen}
            aria-haspopup="listbox"
            className="w-full flex items-center justify-between gap-3 px-4 py-3.5 bg-white border border-border rounded-2xl font-bold text-[0.95rem] text-heading shadow-sm"
          >
            <span className="flex items-center gap-2.5">
              <TabIcon Icon={active.Icon} active />
              {active.label}
            </span>
            <FiChevronDown
              className={`text-body shrink-0 transition-transform duration-200 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {dropdownOpen && (
            <ul
              role="listbox"
              className="absolute top-[calc(100%+0.5rem)] left-0 right-0 z-20 bg-white border border-border rounded-2xl shadow-lg overflow-hidden"
            >
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <li key={tab.id} role="option" aria-selected={isActive}>
                    <button
                      type="button"
                      onClick={() => selectTab(tab.id)}
                      className={`w-full flex items-center gap-2.5 px-4 py-3.5 text-left font-bold text-[0.95rem] transition-colors ${
                        isActive
                          ? "bg-[#D40303] text-white"
                          : "text-body hover:bg-surface hover:text-heading"
                      }`}
                    >
                      <TabIcon Icon={tab.Icon} active={isActive} />
                      {tab.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Desktop tabs */}
      <div className="hidden md:flex justify-center mb-10">
        <div className="inline-flex bg-white p-1.5 rounded-full border border-border/60">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-6 sm:px-8 py-3 rounded-full font-bold text-[0.95rem] transition-all duration-300 ${
                  isActive
                    ? "bg-[#D40303] text-white shadow-[0_4px_15px_rgba(212,3,3,0.3)]"
                    : "text-body hover:text-heading"
                }`}
              >
                <TabIcon Icon={tab.Icon} active={isActive} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up"
        key={activeTab}
      >
        {activeTab === "offline" ? offlineCourses : onlineCourses}
      </div>
    </>
  );
}
