"use client";

import { useState } from "react";
import {
  FiArrowRight,
  FiRefreshCw,
  FiBarChart2,
  FiShoppingCart,
  FiStar,
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
  FiChevronRight,
} from "react-icons/fi";
import {
  LuTarget,
  LuBookOpen,
  LuRocket,
  LuPenLine,
  LuChartBar,
  LuBriefcase,
  LuTrophy,
} from "react-icons/lu";

const questions = [
  {
    id: 1,
    label: "Question 1 of 3",
    question: "What excites you the most?",
    HeaderIcon: LuTarget,
    options: [
      { id: "a", text: "Creating content & storytelling", subtitle: "Words, visuals, and brand voice", icon: FiEdit3 },
      { id: "b", text: "Numbers, analytics & strategy", subtitle: "Data-driven decisions and growth", icon: FiBarChart2 },
      { id: "c", text: "Selling & convincing people", subtitle: "Offers, funnels, and conversions", icon: FiShoppingCart },
      { id: "d", text: "Building my own brand", subtitle: "Personal brand and audience building", icon: FiStar },
    ],
  },
  {
    id: 2,
    label: "Question 2 of 3",
    question: "How do you prefer to learn?",
    HeaderIcon: LuBookOpen,
    options: [
      { id: "a", text: "Hands-on projects", subtitle: "Learn by doing real campaigns", icon: FiZap },
      { id: "b", text: "Watching & taking notes", subtitle: "Structured demos and walkthroughs", icon: FiEye },
      { id: "c", text: "Group discussions", subtitle: "Collaborate and learn with peers", icon: FiUsers },
      { id: "d", text: "Self-paced reading", subtitle: "Guides, playbooks, and resources", icon: FiFileText },
    ],
  },
  {
    id: 3,
    label: "Question 3 of 3",
    question: "Your dream outcome in 6 months?",
    HeaderIcon: LuRocket,
    options: [
      { id: "a", text: "A high-paying agency job", subtitle: "Land a role at a top agency", icon: FiBriefcase },
      { id: "b", text: "Freelance ₹50K+/month", subtitle: "Independent client work", icon: FiDollarSign },
      { id: "c", text: "Run my own brand/agency", subtitle: "Build something of your own", icon: FiAward },
      { id: "d", text: "Promotion at current job", subtitle: "Level up where you are now", icon: FiTrendingUp },
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
      color: "from-primary to-[#ff8c4a]",
      stats: [
        { icon: FiTrendingUp, label: "Avg. Salary", value: "₹6–18 LPA" },
        { icon: FiTarget, label: "Top Skill", value: "SEO & Content" },
        { icon: FiStar, label: "Demand", value: "High" },
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
        { icon: FiTarget, label: "Top Skill", value: "Google & Meta Ads" },
        { icon: FiStar, label: "Demand", value: "Very High" },
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
        { icon: FiTarget, label: "Top Skill", value: "CRO & Funnels" },
        { icon: FiStar, label: "Demand", value: "Explosive" },
      ],
    };
  }
  return {
    role: "Entrepreneur & Agency Owner",
    ResultIcon: LuTrophy,
    desc: "You think big. Full-stack digital marketing combined with business strategy will help you launch and scale your own brand or agency.",
    color: "from-[#10b981] to-[#0ea5e9]",
    stats: [
      { icon: FiTrendingUp, label: "Earnings", value: "Unlimited" },
      { icon: FiTarget, label: "Top Skill", value: "Full-Stack DM" },
      { icon: FiStar, label: "Freedom", value: "Maximum" },
    ],
  };
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

        <div className="mx-auto mb-10 max-w-3xl text-center md:mb-12">
          <span className="mb-4 inline-block text-[0.85rem] font-semibold uppercase tracking-[0.2em] text-primary">
            Career Discovery
          </span>
          <h2 className="mb-4 text-[clamp(2rem,4vw,2.8rem)] font-extrabold leading-tight text-heading">
            Find Your Perfect Marketing{" "}
            <span className="text-primary">Career</span>
          </h2>
          <p className="text-[1.05rem] font-medium leading-relaxed text-body">
            Answer 3 quick questions and we&apos;ll show you the role you&apos;re built for.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="overflow-hidden rounded-3xl border border-border bg-white shadow-card">

            {step >= 1 && step <= 3 && currentQ && (
              <div className={`transition-opacity duration-200 ${animating ? "opacity-0" : "opacity-100"}`}>
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

                <p className="border-t border-border px-6 py-4 text-center text-[0.8rem] font-medium text-body/60">
                  Tap an option to continue — no right or wrong answers
                </p>
              </div>
            )}

            {step === 4 && result && (
              <div className="animate-fade-in">
                <div className={`relative overflow-hidden bg-gradient-to-br ${result.color} px-8 py-10 text-center md:px-12 md:py-12`}>
                  <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/15 blur-2xl" />
                  <div className="pointer-events-none absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
                  <div className="relative z-10">
                    <div className="mb-4 flex justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 shadow-lg backdrop-blur">
                        <result.ResultIcon className="text-[2rem] text-white" strokeWidth={1.5} />
                      </div>
                    </div>
                    <p className="mb-2 text-[0.82rem] font-semibold uppercase tracking-[0.25em] text-white/80">
                      You&apos;re built to be a
                    </p>
                    <h3 className="text-[1.8rem] font-extrabold leading-tight text-white md:text-[2.2rem]">
                      {result.role}
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
                  {result.stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <div key={i} className="flex flex-col items-center gap-1.5 px-3 py-4">
                        <Icon className="text-[1.1rem] text-primary" strokeWidth={2} />
                        <span className="text-[0.72rem] font-semibold uppercase tracking-wide text-body">{stat.label}</span>
                        <span className="text-[0.88rem] font-extrabold text-heading">{stat.value}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="p-6 sm:p-8 md:p-10">
                  <p className="mx-auto mb-8 max-w-2xl text-left text-[1.02rem] font-medium leading-relaxed text-body">
                    {result.desc}{" "}
                    <span className="font-bold text-heading">
                      Get a personalised 90-day roadmap to land your first role or freelancing client.
                    </span>
                  </p>

                  <div className="mx-auto flex max-w-lg flex-col items-center justify-center gap-4 sm:flex-row">
                    <a
                      href="/#apply"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-center text-[0.98rem] font-bold text-white shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-glow-hover sm:w-auto"
                    >
                      Get My Free Roadmap <FiArrowRight className="text-lg" />
                    </a>
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
    </section>
  );
}
