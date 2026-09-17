"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiArrowRight,
  FiRefreshCw,
  FiChevronRight,
  FiUsers,
} from "react-icons/fi";
import {
  LuSearch,
  LuMegaphone,
  LuRocket,
  LuBriefcase,
  LuRepeat,
  LuSparkles,
  LuChartBar,
  LuSprout,
  LuBookOpen,
  LuWrench,
  LuTrophy,
  LuTarget,
} from "react-icons/lu";

const questions = [
  {
    id: 1,
    label: "Question 1 of 3",
    question: "What excites you the most?",
    sub: "Choose the area of digital marketing that interests you most.",
    HeaderIcon: LuSparkles,
    options: [
      {
        id: "seo",
        text: "Improving Search Rankings",
        subtitle: "Keywords, Google rankings & website visibility",
        icon: LuSearch,
      },
      {
        id: "ads",
        text: "Running Ads & Getting Results",
        subtitle: "Google Ads, Meta Ads & paid campaigns",
        icon: LuMegaphone,
      },
      {
        id: "explore",
        text: "Exploring Digital Marketing",
        subtitle: "SEO, social media, content, ads & more",
        icon: LuRocket,
      },
    ],
  },
  {
    id: 2,
    label: "Question 2 of 3",
    question: "What is your main goal?",
    sub: "What is your main goal after learning digital marketing?",
    HeaderIcon: LuTarget,
    options: [
      {
        id: "career",
        text: "Build a Career",
        subtitle: "Develop skills for a digital marketing job",
        icon: LuBriefcase,
      },
      {
        id: "switch",
        text: "Switch to Digital Marketing",
        subtitle: "Start a new and exciting career",
        icon: LuRepeat,
      },
      {
        id: "specialist",
        text: "Become a Specialist",
        subtitle: "Master a specific area and grow your expertise",
        icon: LuRocket,
      },
      {
        id: "business",
        text: "Grow My Business",
        subtitle: "Use digital marketing to attract customers and grow",
        icon: LuChartBar,
      },
    ],
  },
  {
    id: 3,
    label: "Question 3 of 3",
    question: "How much do you already know?",
    sub: "Tell us about your current digital marketing experience.",
    HeaderIcon: LuBookOpen,
    options: [
      {
        id: "beginner",
        text: "I'm a Complete Beginner",
        subtitle: "I'm starting from scratch",
        icon: LuSprout,
      },
      {
        id: "basics",
        text: "I Know the Basics",
        subtitle: "I have some knowledge of digital marketing",
        icon: LuBookOpen,
      },
      {
        id: "practical",
        text: "I Have Practical Experience",
        subtitle: "I've worked on campaigns, websites or marketing activities",
        icon: LuWrench,
      },
      {
        id: "working",
        text: "I Already Work in Digital Marketing",
        subtitle: "I want to upgrade and specialize my skills",
        icon: LuTrophy,
      },
    ],
  },
];

const courses = {
  seo: {
    role: "SEO Specialist Course",
    ResultIcon: LuSearch,
    desc: "Become an SEO expert and master the skills needed to improve website visibility, rankings and organic traffic.",
    color: "from-primary to-[#ff8c4a]",
    suited: ["Students", "Freshers", "Career Changers", "Marketing Professionals"],
  },
  ads: {
    role: "AD Specialist Course",
    ResultIcon: LuMegaphone,
    desc: "Master Google Ads and Meta Ads to create, manage and optimize high-performing advertising campaigns.",
    color: "from-[#6366f1] to-[#8b5cf6]",
    suited: ["Students", "Freshers", "Career Changers", "Entrepreneurs", "Working Professionals"],
  },
  advanced: {
    role: "Advanced Digital Marketing Course",
    ResultIcon: LuRocket,
    desc: "Build a complete digital marketing skill set and learn how different marketing channels work together to drive business growth.",
    color: "from-[#10b981] to-[#0ea5e9]",
    suited: ["Aspiring Digital Marketers", "Freelancers", "Business Owners", "Marketing Professionals"],
  },
};

// q1: seo | ads | explore
// q2: career | switch | specialist | business
const getResult = (answers) => {
  const [q1, q2] = answers;

  if (q2 === "specialist") {
    return courses[q1 === "ads" ? "ads" : "seo"];
  }
  if (q2 === "business") {
    return courses[q1 === "ads" ? "ads" : "advanced"];
  }
  if (q2 === "career" || q2 === "switch") {
    return courses.advanced;
  }
  // fallback based on q1 alone
  if (q1 === "seo") return courses.seo;
  if (q1 === "ads") return courses.ads;
  return courses.advanced;
};

function OptionCard({ option, isSelected, onSelect, disabled }) {
  const Icon = option.icon;

  return (
    <button
      type="button"
      onClick={() => onSelect(option.id)}
      disabled={disabled}
      className={`group flex w-full items-center gap-4 rounded-2xl border px-4 py-4 text-left transition-all duration-200 disabled:cursor-default sm:px-5 sm:py-5 ${
        isSelected
          ? "border-primary bg-primary-light shadow-[0_0_0_1px_rgba(255,68,68,0.15)]"
          : "border-border bg-white hover:border-primary/25 hover:bg-surface"
      }`}
    >
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl transition-colors duration-200 sm:h-[52px] sm:w-[52px] ${
          isSelected
            ? "bg-primary text-white"
            : "bg-primary-light text-primary group-hover:bg-primary group-hover:text-white"
        }`}
      >
        <Icon strokeWidth={2} />
      </span>

      <div className="min-w-0 flex-1">
        <p className={`text-[0.98rem] font-bold leading-snug sm:text-[1.02rem] ${isSelected ? "text-primary" : "text-heading"}`}>
          {option.text}
        </p>
        <p className="mt-0.5 text-[0.82rem] font-medium leading-relaxed text-body sm:text-[0.85rem]">
          {option.subtitle}
        </p>
      </div>

      <FiChevronRight
        className={`h-5 w-5 shrink-0 transition-colors ${isSelected ? "text-primary" : "text-body/35 group-hover:text-primary/60"}`}
        strokeWidth={2.5}
      />
    </button>
  );
}

export default function CareerQuiz() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [animating, setAnimating] = useState(false);

  const result = step === 4 ? getResult(answers) : null;
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
    <section className="relative bg-gradient-to-b from-white to-surface py-10 md:py-14 lg:py-16 xl:py-20">
      <div className="pointer-events-none absolute inset-0 bg-dots-pattern" />
      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6">

        <div className="mx-auto mb-10 max-w-5xl text-center md:mb-12">
          <span className="mb-4 inline-block text-[0.85rem] font-semibold uppercase tracking-[0.2em] text-primary">
            Career Discovery
          </span>
          <h2 className="mb-4 text-[clamp(2rem,4vw,2.8rem)] font-extrabold leading-tight text-heading">
            Find Your Perfect Marketing{" "}
            <span className="text-primary">Career</span>
          </h2>
          <p className="text-[1.05rem] font-medium leading-relaxed text-body">
            Answer 3 quick questions and we&apos;ll show you the course you&apos;re built for.
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-3xl border border-border bg-white shadow-card">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch lg:min-h-[500px]">
              {/* Left Column: Career Image inside the card (Hidden on mobile) */}
              <div className="hidden lg:block lg:col-span-5 relative w-full lg:h-auto lg:min-h-full overflow-hidden bg-slate-50 border-r border-border">
                <Image
                  src="/career.webp"
                  alt="Find Your Perfect Marketing Career with Zeon Academy"
                  fill
                  sizes="(max-width: 1024px) 100vw, 450px"
                  className="object-cover object-center"
                  unoptimized
                  priority
                />
              </div>

              {/* Right Column: Quiz Questions & Result */}
              <div className="w-full lg:col-span-7 flex flex-col justify-between">
                {step >= 1 && step <= 3 && currentQ && (
                  <div className={`flex flex-col justify-between h-full transition-opacity duration-200 ${animating ? "opacity-0" : "opacity-100"}`}>
                    <div>
                      <div className="border-b border-border px-6 py-6 sm:px-8 sm:py-7">
                        <div className="mb-5 h-1 w-full overflow-hidden rounded-full bg-surface">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-[#ff8c4a] transition-all duration-500 ease-out"
                            style={{ width: `${(step / 3) * 100}%` }}
                          />
                        </div>

                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="mb-3 flex items-center gap-3">
                              <span className="text-[0.75rem] font-bold uppercase tracking-[0.2em] text-body/60">
                                {currentQ.label}
                              </span>
                              <div className="flex gap-1.5">
                                {[1, 2, 3].map((i) => (
                                  <span
                                    key={i}
                                    className={`h-2 w-2 rounded-full transition-all duration-300 ${
                                      i < step
                                        ? "bg-primary"
                                        : i === step
                                          ? "scale-125 bg-primary ring-2 ring-primary/20"
                                          : "bg-border"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <h3 className="text-[1.35rem] font-extrabold leading-tight text-heading sm:text-[1.55rem]">
                              {currentQ.question}
                            </h3>
                            <p className="mt-1.5 text-[0.9rem] font-medium leading-relaxed text-body">
                              {currentQ.sub}
                            </p>
                          </div>

                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary sm:h-14 sm:w-14">
                            <currentQ.HeaderIcon className="text-[1.5rem] sm:text-[1.65rem]" strokeWidth={1.5} />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 p-4 sm:space-y-4 sm:p-6">
                        {currentQ.options.map((opt) => (
                          <OptionCard
                            key={opt.id}
                            option={opt}
                            isSelected={selected === opt.id}
                            onSelect={handleSelect}
                            disabled={Boolean(selected) || animating}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="border-t border-border px-6 py-4 text-center text-[0.8rem] font-medium text-body/60 mt-auto">
                      Tap an option to continue — no right or wrong answers
                    </p>
                  </div>
                )}

                {step === 4 && result && (
                  <div className="animate-fade-in flex flex-col justify-between h-full">
                    <div className={`relative overflow-hidden bg-gradient-to-br ${result.color} px-8 py-10 text-center md:px-10 md:py-10`}>
                      <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/15 blur-2xl" />
                      <div className="pointer-events-none absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
                      <div className="relative z-10">
                        <div className="mb-4 flex justify-center">
                          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 shadow-lg backdrop-blur">
                            <result.ResultIcon className="text-[2rem] text-white" strokeWidth={1.5} />
                          </div>
                        </div>
                        <p className="mb-2 text-[0.82rem] font-semibold uppercase tracking-[0.25em] text-white/80">
                          Your recommended course
                        </p>
                        <h3 className="text-[1.8rem] font-extrabold leading-tight text-white md:text-[2.2rem]">
                          {result.role}
                        </h3>
                      </div>
                    </div>

                    <div className="p-6 sm:p-8">
                      <p className="mb-6 text-left text-[1.02rem] font-medium leading-relaxed text-body">
                        {result.desc}
                      </p>

                      <div className="mb-8 rounded-2xl border border-border bg-surface px-5 py-4">
                        <div className="mb-2.5 flex items-center gap-2 text-body/70">
                          <FiUsers className="h-4 w-4" strokeWidth={2} />
                          <span className="text-[0.78rem] font-bold uppercase tracking-wide">
                            Best suited for
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {result.suited.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-border bg-white px-3 py-1 text-[0.82rem] font-semibold text-heading"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                          href="/#apply"
                          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-center text-[0.98rem] font-bold text-white shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-glow-hover sm:w-auto"
                        >
                          Get My Free Roadmap <FiArrowRight className="text-lg" />
                        </Link>
                        <button
                          type="button"
                          onClick={handleRetake}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-border bg-transparent py-3.5 pl-3 pr-8 text-center text-[0.98rem] font-bold text-body transition-all duration-300 hover:border-primary hover:text-primary sm:w-auto"
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
      </div>
    </section>
  );
}