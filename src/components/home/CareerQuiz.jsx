"use client";

import { useState } from "react";
import { FiArrowRight, FiRefreshCw, FiCheck } from "react-icons/fi";

const questions = [
  {
    id: 1,
    label: "Question 1 of 3",
    question: "What excites you the most?",
    options: [
      { id: "a", text: "Creating content & storytelling" },
      { id: "b", text: "Numbers, analytics & strategy" },
      { id: "c", text: "Selling & convincing people" },
      { id: "d", text: "Building my own brand" },
    ],
  },
  {
    id: 2,
    label: "Question 2 of 3",
    question: "How do you prefer to learn?",
    options: [
      { id: "a", text: "Hands-on projects" },
      { id: "b", text: "Watching & taking notes" },
      { id: "c", text: "Group discussions" },
      { id: "d", text: "Self-paced reading" },
    ],
  },
  {
    id: 3,
    label: "Question 3 of 3",
    question: "Your dream outcome in 6 months?",
    options: [
      { id: "a", text: "A high-paying agency job" },
      { id: "b", text: "Freelance ₹50K+/month" },
      { id: "c", text: "Run my own brand/agency" },
      { id: "d", text: "Promotion at current job" },
    ],
  },
];

const getResult = (answers) => {
  const [q1, q2] = answers;
  if (q1 === "a" || q2 === "b") {
    return {
      role: "Content & Brand Strategist",
      desc: "You have a natural flair for storytelling and building brand identity. Content marketing, SEO writing, and brand strategy are your sweet spots.",
      color: "from-[#FF4444] to-[#ff8c4a]",
    };
  }
  if (q1 === "b" || q2 === "a") {
    return {
      role: "Performance Marketing Specialist",
      desc: "Data excites you and you love optimizing campaigns for ROI. Google Ads, Meta Ads, and analytics dashboards are where you'll thrive.",
      color: "from-[#6366f1] to-[#8b5cf6]",
    };
  }
  if (q1 === "c") {
    return {
      role: "Digital Sales & Funnel Expert",
      desc: "You're a natural closer. Email funnels, landing pages, and conversion optimization will help you build an unstoppable income stream.",
      color: "from-[#0ea5e9] to-[#6366f1]",
    };
  }
  return {
    role: "Entrepreneur & Agency Owner",
    desc: "You think big. Full-stack digital marketing combined with business strategy will help you launch and scale your own brand or agency.",
    color: "from-[#10b981] to-[#0ea5e9]",
  };
};

export default function CareerQuiz() {
  const [step, setStep]         = useState(1); // Start directly at question 1
  const [answers, setAnswers]   = useState([]);
  const [selected, setSelected] = useState(null);
  const [animating, setAnimating] = useState(false);

  const result   = step === 4 ? getResult(answers) : null;
  const currentQ = step >= 1 && step <= 3 ? questions[step - 1] : null;

  const handleSelect = (optionId) => {
    if (selected || animating) return;
    setSelected(optionId);
    
    // Show the check/highlight state for 350ms before starting fade-out animation
    setTimeout(() => {
      setAnimating(true);
      // Wait for opacity transition (200ms) to complete before changing the question
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
            Find Your Perfect Marketing {" "}
            <span className="text-transparent bg-clip-text bg-primary">
              Career
            </span>
          </h2>
          <p className="text-[1.05rem] text-body leading-relaxed font-medium">
            Answer 3 quick questions and we'll show you the role you're built for.
          </p>
        </div>

        {/* Quiz Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-border rounded-3xl shadow-card overflow-hidden">

            {/* ─── QUESTIONS ─── */}
            {step >= 1 && step <= 3 && currentQ && (
              <div className={`transition-opacity duration-200 ${animating ? "opacity-0" : "opacity-100"}`}>
                {/* Progress bar */}
                <div className="h-1.5 bg-border w-full">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-[#ff8c4a] transition-all duration-500 ease-out"
                    style={{ width: `${(step / 3) * 100}%` }}
                  />
                </div>

                <div className="p-8 md:p-10">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[0.8rem] font-bold text-body uppercase tracking-widest">
                      {currentQ.label}
                    </span>
                    <div className="flex gap-1.5">
                      {[1, 2, 3].map((i) => (
                        <span
                          key={i}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            i <= step ? "bg-primary scale-110" : "bg-border"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <h3 className="text-[1.4rem] md:text-[1.6rem] font-extrabold text-heading mb-7 leading-tight">
                    {currentQ.question}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentQ.options.map((opt) => {
                      const isSelected = selected === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleSelect(opt.id)}
                          className={`relative text-left flex items-center gap-3 px-5 py-4 rounded-2xl border-2 font-semibold text-[0.95rem] transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? "border-primary bg-primary-light text-primary shadow-[0_0_0_3px_rgba(255,68,68,0.1)]"
                              : "border-border bg-white text-body hover:border-primary/40 hover:bg-primary-light/50 hover:text-heading"
                          }`}
                        >
                          {/* Option letter badge */}
                          <span className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[0.75rem] font-black border transition-all duration-200 ${
                            isSelected
                              ? "bg-primary text-white border-primary"
                              : "bg-surface text-body border-border"
                          }`}>
                            {opt.id.toUpperCase()}
                          </span>
                          <span className="leading-snug">{opt.text}</span>
                          {isSelected && (
                            <FiCheck className="absolute right-4 top-1/2 -translate-y-1/2 text-primary text-lg" strokeWidth={3} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ─── RESULT ─── */}
            {step === 4 && result && (
              <div className="animate-fade-in">
                {/* Gradient banner */}
                <div className={`bg-gradient-to-br ${result.color} p-8 md:p-10 text-center relative overflow-hidden`}>
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                  <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                  <div className="relative z-10">
                    <p className="text-white/80 font-semibold text-[0.85rem] uppercase tracking-[0.2em] mb-2">
                      You're built to be a
                    </p>
                    <h3 className="text-[1.7rem] md:text-[2rem] font-extrabold text-white leading-tight">
                      {result.role}
                    </h3>
                  </div>
                </div>

                <div className="p-8 md:p-10">
                  <p className="text-body text-[1.02rem] leading-relaxed font-medium mb-8 text-center">
                    {result.desc}{" "}
                    <span className="font-bold text-heading">
                      Get a personalised 90-day roadmap to land your first role or freelancing client.
                    </span>
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href="/#apply"
                      className="flex-1 inline-flex items-center justify-center gap-2 py-4 px-6 bg-primary text-white font-bold text-[0.98rem] rounded-full shadow-glow transition-all duration-300 hover:bg-primary-hover hover:shadow-glow-hover hover:-translate-y-0.5"
                    >
                      Get My Free Roadmap <FiArrowRight className="text-lg" />
                    </a>
                    <button
                      onClick={handleRetake}
                      className="inline-flex items-center justify-center gap-2 py-4 px-6 bg-transparent border-2 border-border text-body font-bold text-[0.98rem] rounded-full transition-all duration-300 hover:border-primary hover:text-primary"
                    >
                      <FiRefreshCw className="text-base" /> Retake Quiz
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
