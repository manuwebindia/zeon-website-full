"use client";

import { useState } from "react";
import Image from "next/image";
import {
  // Feather / utility icons (already used)
  FiArrowRight,
  FiRefreshCw,
  FiCheck,
  FiBarChart2,
  FiShoppingCart,
  FiStar,
  FiBook,
  FiEye,
  FiUsers,
  FiFileText,
  FiTrendingUp,
  FiDollarSign,
  FiAward,
  FiBriefcase,
  FiTarget,
  FiEdit3,
  FiZap,
  FiPieChart,
  FiMessageSquare,
} from "react-icons/fi";

import {
  // Lucide icons replacing emojis
  LuTarget,          // Q1 emoji (🎯)
  LuBookOpen,        // Q2 emoji (📚)
  LuRocket,          // Q3 emoji (🚀)
  LuPenLine,         // Content & Brand Strategist result
  LuChartBar,        // Performance Marketing result
  LuBriefcase,       // Digital Sales result
  LuTrophy,          // Entrepreneur result
} from "react-icons/lu";

const questions = [
  {
    id: 1,
    label: "Question 1 of 3",
    question: "What excites you the most?",
    HeaderIcon: LuTarget,
    options: [
      { id: "a", text: "Creating content & storytelling", icon: FiEdit3 },
      { id: "b", text: "Numbers, analytics & strategy",  icon: FiBarChart2 },
      { id: "c", text: "Selling & convincing people",    icon: FiShoppingCart },
      { id: "d", text: "Building my own brand",          icon: FiStar },
    ],
  },
  {
    id: 2,
    label: "Question 2 of 3",
    question: "How do you prefer to learn?",
    HeaderIcon: LuBookOpen,
    options: [
      { id: "a", text: "Hands-on projects",       icon: FiZap },
      { id: "b", text: "Watching & taking notes",  icon: FiEye },
      { id: "c", text: "Group discussions",        icon: FiUsers },
      { id: "d", text: "Self-paced reading",       icon: FiFileText },
    ],
  },
  {
    id: 3,
    label: "Question 3 of 3",
    question: "Your dream outcome in 6 months?",
    HeaderIcon: LuRocket,
    options: [
      { id: "a", text: "A high-paying agency job",  icon: FiBriefcase },
      { id: "b", text: "Freelance ₹50K+/month",     icon: FiDollarSign },
      { id: "c", text: "Run my own brand/agency",   icon: FiAward },
      { id: "d", text: "Promotion at current job",  icon: FiTrendingUp },
    ],
  },
];

const getResult = (answers) => {
  const [q1, q2] = answers;
  if (q1 === "a" || q2 === "b") {
    return {
      role: "Content & Brand Strategist",
      ResultIcon: LuPenLine,
      desc: "You have a natural flair for storytelling and building brand identity. Content marketing, SEO writing, and brand strategy are your sweet spots.",
      color: "from-[#FF4444] to-[#ff8c4a]",
      stats: [
        { icon: FiTrendingUp, label: "Avg. Salary", value: "₹6–18 LPA" },
        { icon: FiTarget,     label: "Top Skill",   value: "SEO & Content" },
        { icon: FiStar,       label: "Demand",      value: "High" },
      ],
    };
  }
  if (q1 === "b" || q2 === "a") {
    return {
      role: "Performance Marketing Specialist",
      ResultIcon: LuChartBar,
      desc: "Data excites you and you love optimizing campaigns for ROI. Google Ads, Meta Ads, and analytics dashboards are where you'll thrive.",
      color: "from-[#6366f1] to-[#8b5cf6]",
      stats: [
        { icon: FiTrendingUp, label: "Avg. Salary", value: "₹8–22 LPA" },
        { icon: FiTarget,     label: "Top Skill",   value: "Google & Meta Ads" },
        { icon: FiStar,       label: "Demand",      value: "Very High" },
      ],
    };
  }
  if (q1 === "c") {
    return {
      role: "Digital Sales & Funnel Expert",
      ResultIcon: LuBriefcase,
      desc: "You're a natural closer. Email funnels, landing pages, and conversion optimization will help you build an unstoppable income stream.",
      color: "from-[#0ea5e9] to-[#6366f1]",
      stats: [
        { icon: FiTrendingUp, label: "Avg. Salary", value: "₹7–20 LPA" },
        { icon: FiTarget,     label: "Top Skill",   value: "CRO & Funnels" },
        { icon: FiStar,       label: "Demand",      value: "Explosive" },
      ],
    };
  }
  return {
    role: "Entrepreneur & Agency Owner",
    ResultIcon: LuTrophy,
    desc: "You think big. Full-stack digital marketing combined with business strategy will help you launch and scale your own brand or agency.",
    color: "from-[#10b981] to-[#0ea5e9]",
    stats: [
      { icon: FiTrendingUp, label: "Earnings",  value: "Unlimited" },
      { icon: FiTarget,     label: "Top Skill", value: "Full-Stack DM" },
      { icon: FiStar,       label: "Freedom",   value: "Maximum" },
    ],
  };
};

export default function CareerQuiz() {
  const [step, setStep]           = useState(1);
  const [answers, setAnswers]     = useState([]);
  const [selected, setSelected]   = useState(null);
  const [animating, setAnimating] = useState(false);

  const result   = step === 4 ? getResult(answers) : null;
  const currentQ = step >= 1 && step <= 3 ? questions[step - 1] : null;

  const handleSelect = (optionId) => {
    if (selected || animating) return;
    setSelected(optionId);
    setTimeout(() => {
      setAnimating(true);
      setTimeout(() => {
        const newAnswers = [...answers, optionId];
        setAnswers(newAnswers);
        if (step < 3) {
          setStep(step + 1);
          setSelected(null);
        } else {
          setStep(4);
        }
        setAnimating(false);
      }, 200);
    }, 350);
  };

  const handleRetake = () => {
    setStep(1);
    setAnswers([]);
    setSelected(null);
  };

  return (
    <section className="py-10 md:py-14 lg:py-16 xl:py-20 bg-surface bg-dots-pattern border-t border-border">
      <div className="w-full max-w-[1200px] mx-auto px-6">

        {/* Section Header */}
        <div className="text-center mb-12 max-w-5xl mx-auto">
          <span className="inline-block text-primary text-[0.85rem] font-semibold mb-4 tracking-[0.2em] uppercase">
            Career Discovery
          </span>
          <h2 className="text-[clamp(2rem,4vw,2.8rem)] font-extrabold text-heading mb-4 leading-tight">
            Find Your Perfect Marketing{" "}
            <span className="text-transparent bg-clip-text bg-primary">
              Career
            </span>
          </h2>
          <p className="text-[1.05rem] text-body leading-relaxed font-medium">
            Answer 3 quick questions and we&apos;ll show you the role you&apos;re built for.
          </p>
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch max-w-6xl mx-auto">
          {/* Left Column: Image Card */}
          <div className="lg:col-span-5 flex flex-col justify-stretch">
            <div className="relative rounded-3xl overflow-hidden shadow-card border border-border bg-white p-0 h-full flex flex-col items-center justify-center min-h-[350px] lg:min-h-[480px]">
              <Image
                src="/thinking.webp"
                alt="Student receiving certificate"
                width={600}
                height={500}
                className="w-full h-full object-cover rounded-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
              />
            </div>
          </div>

          {/* Right Column: Quiz Card */}
          <div className="lg:col-span-7 flex flex-col justify-stretch">
            <div className="bg-white border border-border rounded-3xl shadow-card overflow-hidden h-full flex flex-col justify-between">

            {/* ─── QUESTIONS ─── */}
            {step >= 1 && step <= 3 && currentQ && (
              <div className={`transition-opacity duration-200 ${animating ? "opacity-0" : "opacity-100"}`}>

                {/* Dark header panel */}
                <div className="bg-[#161B2A] px-8 md:px-12 pt-8 pb-10 relative overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

                  {/* Progress bar */}
                  <div className="h-1 bg-white/10 rounded-full w-full mb-8">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-[#ff8c4a] rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${(step / 3) * 100}%` }}
                    />
                  </div>

                  <div className="relative z-10 flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-[0.75rem] font-bold text-white/50 uppercase tracking-[0.2em]">
                          {currentQ.label}
                        </span>
                        <div className="flex gap-1.5 ml-1">
                          {[1, 2, 3].map((i) => (
                            <span
                              key={i}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                i < step
                                  ? "bg-primary"
                                  : i === step
                                  ? "bg-primary scale-125 ring-2 ring-primary/30"
                                  : "bg-white/20"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <h3 className="text-[1.5rem] md:text-[1.8rem] font-extrabold text-white leading-tight">
                        {currentQ.question}
                      </h3>
                    </div>

                    {/* Lucide icon replacing emoji */}
                    <div className="shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center shadow-lg">
                      <currentQ.HeaderIcon className="text-white text-[1.8rem] md:text-[2rem]" strokeWidth={1.5} />
                    </div>
                  </div>
                </div>

                {/* Options grid */}
                <div className="p-8 md:p-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentQ.options.map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = selected === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleSelect(opt.id)}
                          className={`group relative flex items-center gap-4 px-5 py-4 rounded-2xl border-2 font-semibold text-[0.95rem] transition-all duration-300 cursor-pointer text-left ${
                            isSelected
                              ? "border-primary bg-primary-light shadow-[0_0_0_4px_rgba(255,68,68,0.08)]"
                              : "border-border bg-white hover:border-primary/30 hover:shadow-[0_20px_40px_rgba(255,68,68,0.08)] hover:-translate-y-0.5"
                          }`}
                        >
                          {/* Homepage-style icon bubble: primary-light → primary on select/hover */}
                          <span className={`shrink-0 w-[46px] h-[46px] rounded-xl flex items-center justify-center text-[1.2rem] border transition-all duration-500 ${
                            isSelected
                              ? "bg-primary text-white border-primary/10 scale-110 shadow-[0_8px_20px_rgba(255,68,68,0.3)]"
                              : "bg-primary-light text-primary border-primary/10 group-hover:bg-primary group-hover:text-white group-hover:scale-110 group-hover:shadow-[0_8px_20px_rgba(255,68,68,0.3)]"
                          }`}>
                            <Icon strokeWidth={2} />
                          </span>

                          <span className={`leading-snug flex-1 transition-colors duration-200 ${
                            isSelected ? "text-primary" : "text-heading"
                          }`}>
                            {opt.text}
                          </span>

                          {isSelected && (
                            <FiCheck className="absolute right-4 top-1/2 -translate-y-1/2 text-primary text-lg" strokeWidth={3} />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <p className="mt-6 text-center text-[0.8rem] text-body/60 font-medium">
                    Tap an option to continue — no right or wrong answers
                  </p>
                </div>
              </div>
            )}

            {/* ─── RESULT ─── */}
            {step === 4 && result && (
              <div className="animate-fade-in">
                {/* Gradient banner */}
                <div className={`bg-gradient-to-br ${result.color} px-8 md:px-12 pt-10 pb-12 text-center relative overflow-hidden`}>
                  <div className="absolute -top-10 -right-10 w-44 h-44 bg-white/15 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="relative z-10">
                    {/* Lucide icon replacing result emoji */}
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg">
                        <result.ResultIcon className="text-white text-[2rem]" strokeWidth={1.5} />
                      </div>
                    </div>
                    <p className="text-white/80 font-semibold text-[0.82rem] uppercase tracking-[0.25em] mb-2">
                      You&apos;re built to be a
                    </p>
                    <h3 className="text-[1.8rem] md:text-[2.2rem] font-extrabold text-white leading-tight">
                      {result.role}
                    </h3>
                  </div>
                </div>

                {/* Stats strip */}
                <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
                  {result.stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <div key={i} className="flex flex-col items-center gap-1.5 py-4 px-3">
                        <Icon className="text-primary text-[1.1rem]" strokeWidth={2} />
                        <span className="text-[0.72rem] font-semibold text-body uppercase tracking-wide">{stat.label}</span>
                        <span className="text-[0.88rem] font-extrabold text-heading">{stat.value}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Description + CTAs */}
                <div className="p-8 md:p-10">
                  <p className="text-body text-[1.02rem] leading-relaxed font-medium mb-8 text-left max-w-2xl mx-auto">
                    {result.desc}{" "}
                    <span className="font-bold text-heading">
                      Get a personalised 90-day roadmap to land your first role or freelancing client.
                    </span>
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
                    <a
                      href="/#apply"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-8 bg-primary text-white font-bold text-[0.98rem] rounded-full shadow-glow transition-all duration-300 hover:bg-primary-hover hover:shadow-glow-hover hover:-translate-y-0.5 text-center"
                    >
                      Get My Free Roadmap <FiArrowRight className="text-lg" />
                    </a>
                    <button
                      onClick={handleRetake}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 pr-8 pl-3 bg-transparent border-2 border-border text-body font-bold text-[0.98rem] rounded-full transition-all duration-300 hover:border-primary hover:text-primary text-center"
                    >
                      <FiRefreshCw className="text-base" /> Retake
                    </button>
                  </div>
                </div>
              </div>
            )}

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
