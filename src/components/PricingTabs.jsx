"use client";

import { useState } from "react";
import {
  FaChalkboardTeacher,
  FaArrowRight,
  FaVideo,
  FaWhatsapp,
} from "react-icons/fa";

export default function PricingTabs() {
  const [activeTab, setActiveTab] = useState("online");

  const isOnline = activeTab === "online";
  const theme = isOnline
    ? {
        borderPopular:
          "border-2 border-[#0B5CFF] shadow-[0_8px_30px_rgba(11,92,255,0.1)] hover:shadow-[0_20px_50px_rgba(11,92,255,0.15)]",
        borderNormal:
          "border-2 border-[#0B5CFF] shadow-[0_8px_30px_rgba(11,92,255,0.1)] hover:shadow-[0_20px_50px_rgba(11,92,255,0.15)]",
        ribbonBg: "bg-[#0B5CFF]",
        textPrimary: "text-[#0B5CFF]",
        bgPrimary: "bg-[#0B5CFF]",
        bgPrimary10: "bg-[#0B5CFF]/10",
        bgPrimary5: "bg-[#0B5CFF]/5",
        borderPrimary20: "border-[#0B5CFF]/20",
        btnPopular:
          "bg-[#0B5CFF] text-white hover:bg-[#084BCE] hover:-translate-y-0.5 shadow-[0_4px_15px_rgba(11,92,255,0.25)]",
        btnNormal:
          "bg-transparent text-[#0B5CFF] border-2 border-[#0B5CFF] hover:bg-[#0B5CFF] hover:text-white hover:-translate-y-0.5",
      }
    : {
        borderPopular:
          "border-2 border-[#37d366] shadow-[0_8px_30px_rgba(16,185,129,0.1)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.15)]",
        borderNormal:
          "border-2 border-[#37d366] shadow-[0_8px_30px_rgba(16,185,129,0.1)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.15)]",
        ribbonBg: "bg-[#37d366]",
        textPrimary: "text-[#37d366]",
        bgPrimary: "bg-[#37d366]",
        bgPrimary10: "bg-[#37d366]/10",
        bgPrimary5: "bg-[#37d366]/5",
        borderPrimary20: "border-[#37d366]/20",
        btnPopular:
          "bg-[#37d366] text-white hover:bg-[#059669] hover:-translate-y-0.5 shadow-[0_4px_15px_rgba(16,185,129,0.25)]",
        btnNormal:
          "bg-transparent text-[#37d366] border-2 border-[#37d366] hover:bg-[#37d366] hover:text-white hover:-translate-y-0.5",
      };

  return (
    <div>
      {/* Tabs Switcher */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex bg-surface p-1.5 rounded-full border border-border/60">
          <button
            onClick={() => setActiveTab("online")}
            className={`flex items-center gap-2.5 px-6 sm:px-8 py-3 rounded-full font-bold text-[0.95rem] transition-all duration-300 ${
              activeTab === "online"
                ? "bg-[#0B5CFF] text-white shadow-[0_4px_15px_rgba(11,92,255,0.3)]"
                : "text-body hover:text-heading"
            }`}
          >
            <div
              className={`flex items-center justify-center w-[26px] h-[26px] rounded-[8px] shadow-sm transition-colors duration-300 ${activeTab === "online" ? "bg-white text-[#0B5CFF]" : "bg-[#0B5CFF] text-white"}`}
            >
              <FaVideo
                className="text-[12px] inherit-text"
                fill="currentColor"
              />
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
            <div
              className={`flex items-center justify-center w-[26px] h-[26px] rounded-[8px] shadow-sm transition-colors duration-300 ${activeTab === "offline" ? "bg-white text-[#37d366]" : "bg-[#37d366] text-white"}`}
            >
              <FaChalkboardTeacher
                className="text-[12px] inherit-text"
                fill="currentColor"
              />
            </div>
            Offline Courses
          </button>
        </div>
      </div>

      {/* Pricing Grid */}
      <div
        className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr_1fr] gap-7 max-lg:grid-cols-1 max-lg:max-w-[500px] max-lg:mx-auto animate-fade-in-up"
        key={activeTab}
      >
        {/* Card 1 - Most Popular */}
        <div
          className={`bg-white rounded-2xl p-7 pb-10 relative flex flex-col transition-all duration-300 ${theme.borderPopular}`}
        >
          <div
            className={`absolute -top-3.5 left-1/2 -translate-x-1/2 ${theme.ribbonBg} text-white text-[0.78rem] font-extrabold px-5 py-1.5 rounded-full tracking-wider uppercase whitespace-nowrap`}
          >
            Most Popular
          </div>
          <h3 className="text-[1.15rem] font-extrabold text-heading mb-4 mt-2 leading-snug flex flex-col gap-1">
            <span
              className={`text-[0.75rem] ${theme.textPrimary} tracking-widest font-bold uppercase`}
            >
              {activeTab} Program
            </span>
            Advanced Digital Marketing
          </h3>
          <div className="flex items-baseline gap-0.5 mb-1">
            <span className={`text-[1.4rem] font-bold ${theme.textPrimary}`}>
              ₹
            </span>
            <span className="text-[2.8rem] font-black text-heading leading-none">
              {activeTab === "offline" ? "28,000" : "23,000"}
            </span>
          </div>
          <p className="text-[0.9rem] text-body mb-5">
            • 2 Months + 1 Month Internship
          </p>
          {/* One-Time Payment Offer */}
          <div
            className={`${theme.bgPrimary5} rounded-[12px] py-3.5 px-4 border ${theme.borderPrimary20} mb-6 relative overflow-hidden`}
          >
            <div
              className={`absolute top-0 right-0 w-20 h-20 ${theme.bgPrimary10} rounded-bl-full z-0`}
            />
            <div className="relative z-10 flex items-center justify-between gap-2">
              <div>
                <span
                  className={`inline-block ${theme.ribbonBg} text-white text-[0.6rem] font-black px-2 py-0.5 rounded-sm uppercase tracking-widest mb-1 shadow-sm`}
                >
                  Save ₹3,000
                </span>
                <p className="text-[0.8rem] text-heading font-extrabold uppercase tracking-wide">
                  One-Time Pay
                </p>
              </div>
              <div className="flex items-baseline gap-0.5 text-right">
                <span
                  className={`text-[1.1rem] font-bold ${theme.textPrimary}`}
                >
                  ₹
                </span>
                <span className="text-[1.9rem] font-black text-heading leading-none">
                  {activeTab === "offline" ? "25,000" : "20,000"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-5">
            <div className="h-px bg-border flex-1" />
            <span className="text-[0.65rem] font-bold text-body/60 uppercase tracking-widest">
              Or Pay with
            </span>
            <div className="h-px bg-border flex-1" />
          </div>

          <p className="text-[0.8rem] font-bold text-body uppercase tracking-wider mb-4 hidden">
            Pay in 3 Easy Installments
          </p>

          {/* Installment Row */}
          {activeTab === "offline" ? (
            <div className="flex flex-col gap-2.5 mb-7 flex-1">
              {/* 1st Installment */}
              <div className="bg-surface rounded-[10px] p-3 px-3.5 border border-border">
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[0.7rem] font-medium px-2 py-0.5 rounded-full ${theme.bgPrimary10} ${theme.textPrimary} tracking-wider inline-block`}
                  >
                    1<sup>st</sup> Installment
                  </span>
                  <span className="text-[0.7rem] text-body font-semibold">
                    Advance
                  </span>
                </div>
                <div className="flex items-end justify-between mt-1.5">
                  <div className="text-[1.2rem] font-black text-heading leading-none">
                    ₹10,000
                  </div>
                  <p className="text-[0.67rem] text-body text-right max-w-[100px]">
                    Confirms your seat
                  </p>
                </div>
              </div>
              {/* 2nd Installment */}
              <div className="bg-surface rounded-[10px] p-3 px-3.5 border border-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[0.7rem] font-medium px-2 py-0.5 rounded-full bg-black/7 text-body tracking-wider inline-block">
                    2<sup>nd</sup> Installment
                  </span>
                  <span className="text-[0.7rem] text-body font-semibold">
                    Within 20 Days
                  </span>
                </div>
                <div className="flex items-end justify-between mt-1.5">
                  <div className="text-[1.2rem] font-black text-heading leading-none">
                    ₹10,000
                  </div>
                  <p className="text-[0.67rem] text-body text-right max-w-[100px]">
                    Within 20 days of enrollment
                  </p>
                </div>
              </div>
              {/* 3rd Installment */}
              <div className="bg-surface rounded-[10px] p-3 px-3.5 border border-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[0.7rem] font-medium px-2 py-0.5 rounded-full bg-black/7 text-body tracking-wider inline-block">
                    3<sup>rd</sup> Installment
                  </span>
                  <span className="text-[0.7rem] text-body font-semibold">
                    Next 20 Days
                  </span>
                </div>
                <div className="flex items-end justify-between mt-1.5">
                  <div className="text-[1.2rem] font-black text-heading leading-none">
                    ₹8,000
                  </div>
                  <p className="text-[0.67rem] text-body text-right max-w-[100px]">
                    Within the following 20 days
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 mb-7 flex-1">
              {/* 1st Installment */}
              <div className="bg-surface rounded-[10px] p-3 px-3.5 border border-border">
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[0.7rem] font-medium px-2 py-0.5 rounded-full ${theme.bgPrimary10} ${theme.textPrimary} tracking-wider inline-block`}
                  >
                    1<sup>st</sup> Installment
                  </span>
                  <span className="text-[0.7rem] text-body font-semibold">
                    Advance
                  </span>
                </div>
                <div className="flex items-end justify-between mt-1.5">
                  <div className="text-[1.2rem] font-black text-heading leading-none">
                    ₹5,000
                  </div>
                  <p className="text-[0.67rem] text-body text-right max-w-[100px]">
                    Confirms your seat
                  </p>
                </div>
              </div>
              {/* 2nd Installment */}
              <div className="bg-surface rounded-[10px] p-3 px-3.5 border border-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[0.7rem] font-medium px-2 py-0.5 rounded-full bg-black/7 text-body tracking-wider inline-block">
                    2<sup>nd</sup> Installment
                  </span>
                  <span className="text-[0.7rem] text-body font-semibold">
                    Within 20 days
                  </span>
                </div>
                <div className="flex items-end justify-between mt-1.5">
                  <div className="text-[1.2rem] font-black text-heading leading-none">
                    ₹10,000
                  </div>
                  <p className="text-[0.67rem] text-body text-right max-w-[100px]">
                    Within 20 days of enrollment
                  </p>
                </div>
              </div>
              {/* 3rd Installment */}
              <div className="bg-surface rounded-[10px] p-3 px-3.5 border border-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[0.7rem] font-medium px-2 py-0.5 rounded-full bg-black/7 text-body tracking-wider inline-block">
                    3<sup>rd</sup> Installment
                  </span>
                  <span className="text-[0.7rem] text-body font-semibold">
                    Next 20 Days
                  </span>
                </div>
                <div className="flex items-end justify-between mt-1.5">
                  <div className="text-[1.2rem] font-black text-heading leading-none">
                    ₹8,000
                  </div>
                  <p className="text-[0.67rem] text-body text-right max-w-[100px]">
                    Within the following 20 days
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-auto flex flex-col sm:flex-row gap-3 w-full">
            {/* <a
              href="#apply"
              className={`flex-1 flex items-center justify-center gap-2 rounded-[36px] py-3.5 px-2 font-bold text-[0.85rem] sm:text-[0.9rem] whitespace-nowrap transition-all duration-300 ${theme.btnPopular}`}
            >
              Full Payment <FaArrowRight className="text-[0.8rem] shrink-0" />
            </a> */}
            <a
              href={`https://wa.me/917558888252?text=${encodeURIComponent("Hi, I’ve checked the fee structure. I would like to know more details about the admission process and next steps. Course: Advanced Digital Marketing, Course Mode: " + activeTab)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 rounded-[36px] py-3.5 px-2 font-bold text-[0.85rem] sm:text-[0.9rem] whitespace-nowrap transition-all duration-300 bg-[#19be55] text-white hover:bg-[#37d366] shadow-[0_4px_15px_rgba(37,211,102,0.25)] hover:-translate-y-0.5"
            >
              <FaWhatsapp className="text-[1.1rem] shrink-0" /> Enquire Now
            </a>
          </div>
        </div>

        {/* Card 2 */}
        <div
          className={`bg-white rounded-2xl p-7 pb-10 relative flex flex-col transition-all duration-300 ${theme.borderNormal}`}
        >
          <h3 className="text-[1.15rem] font-extrabold text-heading mb-4 mt-2 leading-snug flex flex-col gap-1">
            <span className="text-[0.75rem] text-body tracking-widest font-bold uppercase">
              {activeTab} Program
            </span>
            SEO Specialist Course
          </h3>
          <div className="flex items-baseline gap-0.5 mb-1">
            <span className={`text-[1.4rem] font-bold ${theme.textPrimary}`}>
              ₹
            </span>
            <span className="text-[2.8rem] font-black text-heading leading-none">
              {activeTab === "offline" ? "14,999" : "11,999"}
            </span>
            {/* <span className="text-[0.9rem] font-bold text-body/90 ml-1">+GST</span> */}
          </div>
          <p className="text-[0.9rem] text-body mb-5">• 15 Days Program</p>
          <div className="h-px bg-border mb-5" />
          <p className="text-[0.85rem] font-bold text-body uppercase tracking-wider mb-4">
            One-Time Payment
          </p>
          <div className="bg-surface rounded-[10px] p-3.5 border border-border mb-7 flex-1">
            <div className="flex items-center justify-between flex-wrap gap-1 mb-2">
              <span
                className={`text-[0.72rem] font-medium px-2.5 py-0.5 rounded-full ${theme.bgPrimary10} ${theme.textPrimary} tracking-wider`}
              >
                Full Amount
              </span>
            </div>
            <div className="text-[1.4rem] font-black text-heading mb-1">
              ₹{activeTab === "offline" ? "14,999" : "11,999"}
            </div>
            <p className="text-[0.78rem] text-body leading-snug">
              Confirms your seat immediately
            </p>
          </div>
          <a
            href={`https://wa.me/917558888252?text=${encodeURIComponent("Hi, I’ve checked the fee structure. I would like to know more details about the admission process and next steps. Course: SEO Specialist Course, Course Mode: " + activeTab)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto flex items-center justify-center gap-2 w-full rounded-[36px] py-4 px-8 font-bold text-[0.95rem] transition-all duration-300 bg-[#19be55] text-white hover:bg-[#37d366] shadow-[0_4px_15px_rgba(37,211,102,0.25)] hover:-translate-y-0.5"
          >
            <FaWhatsapp className="text-[1.1rem]" /> Enquire Now
          </a>
        </div>

        {/* Card 3 */}
        <div
          className={`bg-white rounded-2xl p-7 pb-10 relative flex flex-col transition-all duration-300 ${theme.borderNormal}`}
        >
          <h3 className="text-[1.15rem] font-extrabold text-heading mb-4 mt-2 leading-snug flex flex-col gap-1">
            <span className="text-[0.75rem] text-body tracking-widest font-bold uppercase">
              {activeTab} Program
            </span>
            AD Specialist Course
          </h3>
          <div className="flex items-baseline gap-0.5 mb-1">
            <span className={`text-[1.4rem] font-bold ${theme.textPrimary}`}>
              ₹
            </span>
            <span className="text-[2.8rem] font-black text-heading leading-none">
              {activeTab === "offline" ? "13,999" : "9,999"}
            </span>
            {/* <span className="text-[0.9rem] font-bold text-body/90 ml-1">+GST</span> */}
          </div>
          <p className="text-[0.9rem] text-body mb-5">• 10 Days Program</p>
          <div className="h-px bg-border mb-5" />
          <p className="text-[0.85rem] font-bold text-body uppercase tracking-wider mb-4">
            One-Time Payment
          </p>
          <div className="bg-surface rounded-[10px] p-3.5 border border-border mb-7 flex-1">
            <div className="flex items-center justify-between flex-wrap gap-1 mb-2">
              <span
                className={`text-[0.72rem] font-medium px-2.5 py-0.5 rounded-full ${theme.bgPrimary10} ${theme.textPrimary} tracking-wider`}
              >
                Full Amount
              </span>
            </div>
            <div className="text-[1.4rem] font-black text-heading mb-1">
              ₹{activeTab === "offline" ? "13,999" : "9,999"}
            </div>
            <p className="text-[0.78rem] text-body leading-snug">
              Confirms your seat immediately
            </p>
          </div>
          <a
            href={`https://wa.me/917558888252?text=${encodeURIComponent("Hi, I’ve checked the fee structure. I would like to know more details about the admission process and next steps. Course: AD Specialist Course, Course Mode: " + activeTab)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto flex items-center justify-center gap-2 w-full rounded-[36px] py-4 px-8 font-bold text-[0.95rem] transition-all duration-300 bg-[#19be55] text-white hover:bg-[#37d366] shadow-[0_4px_15px_rgba(37,211,102,0.25)] hover:-translate-y-0.5"
          >
            <FaWhatsapp className="text-[1.1rem]" /> Enquire Now
          </a>
        </div>
      </div>
    </div>
  );
}
