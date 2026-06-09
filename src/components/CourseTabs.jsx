"use client";

import { useState } from "react";
import { FaChalkboardTeacher, FaVideo } from "react-icons/fa";

export default function CourseTabs({ offlineCourses, onlineCourses }) {
  const [activeTab, setActiveTab] = useState("online");

  return (
    <>
      <div className="flex justify-center mb-10">
        <div className="inline-flex bg-white p-1.5 rounded-full border border-border/60">
          <button 
            onClick={() => setActiveTab("online")}
            className={`flex items-center gap-2.5 px-6 sm:px-8 py-3 rounded-full font-bold text-[0.95rem] transition-all duration-300 ${
              activeTab === "online" 
                ? "bg-[#0B5CFF] text-white shadow-[0_4px_15px_rgba(11,92,255,0.3)]" 
                : "text-body hover:text-heading"
            }`}
          >
            <div className={`flex items-center justify-center w-[26px] h-[26px] rounded-[8px] shadow-sm transition-colors duration-300 ${activeTab === "online" ? "bg-white text-[#0B5CFF]" : "bg-[#0B5CFF] text-white"}`}>
              <FaVideo className="text-[12px] inherit-text" fill="currentColor" />
            </div>
            Online Courses
          </button>

          <button 
            onClick={() => setActiveTab("offline")}
            className={`flex items-center gap-2.5 px-6 sm:px-8 py-3 rounded-full font-bold text-[0.95rem] transition-all duration-300 ${
              activeTab === "offline" 
                ? "bg-[#37d366] text-white shadow-[0_4px_15px_rgba(16,185,129,0.3)]" 
                : "text-body hover:text-heading"
            }`}
          >
            <div className={`flex items-center justify-center w-[26px] h-[26px] rounded-[8px] shadow-sm transition-colors duration-300 ${activeTab === "offline" ? "bg-white text-[#37d366]" : "bg-[#37d366] text-white"}`}>
              <FaChalkboardTeacher className="text-[12px] inherit-text" fill="currentColor" />
            </div>
            Offline Courses
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up" key={activeTab}>
        {activeTab === "offline" ? offlineCourses : onlineCourses}
      </div>
    </>
  );
}
