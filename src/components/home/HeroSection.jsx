import Image from "next/image";
import { FaCheckCircle, FaGraduationCap, FaLinkedin, FaMoneyBillAlt } from "react-icons/fa";
import { FiClock } from "react-icons/fi";
import NextBatchDate from "../NextBatchDate";

export default function HeroSection({ nextBatchDate }) {
  return (
        <section className="pt-24 pb-8 md:pt-28 md:pb-10 lg:pt-32 lg:pb-12 xl:pt-36 xl:pb-16 bg-white xl:bg-zeon-banner bg-no-repeat bg-center bg-cover relative overflow-x-hidden">
          <div className="w-full max-w-[1200px] mx-auto px-6 flex items-center justify-between gap-14 max-[1024px]:flex-col max-[1024px]:text-center max-[1024px]:gap-0">
            {/* Left Box (Desktop wrapper, bypassed on Mobile) */}
            <div className="flex-1 max-w-[540px] max-[1024px]:contents">
              
              {/* TOP SECTION (Mobile: Above Image) */}
              <div className="animate-fade-in-up max-[1024px]:order-1 max-[1024px]:flex max-[1024px]:flex-col max-[1024px]:items-center max-[1024px]:w-full">
                {/* Admission Badge */}
                <div className="inline-flex items-center gap-2 bg-primary-light text-primary border border-primary/12 rounded-full px-4 py-1.5 text-[0.78rem] font-bold tracking-wide mb-7">
                  <span className="w-[7px] h-[7px] bg-primary rounded-full inline-block shadow-[0_0_8px_var(--color-primary)] animate-pulse-badge" />
                  Next batch starts on <NextBatchDate serverDate={nextBatchDate} />
                </div>

                {/* Headline */}
                <h1 className="text-[clamp(2.2rem,4.5vw,3.4rem)] font-extrabold leading-[1.15] text-heading mb-5 tracking-tight drop-shadow-sm">
                  Become a{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#ff4a4a] to-[#ff8c4a] drop-shadow-sm">Certified Digital Marketer</span>{" "}
                  with 100% Placement Support
                </h1>

                {/* Sub-copy */}
                <p className="text-base text-body leading-[1.7] mb-8 max-w-[460px] max-[1024px]:max-w-full max-[1024px]:mb-0">
                  Start your career with Kerala&apos;s most practical, job-driven
                  Digital Marketing Program. Real projects. Real skills. Real jobs.
                </p>
              </div>

              {/* BOTTOM SECTION (Mobile: Below Image) */}
              <div className="animate-fade-in-up max-[1024px]:order-3 max-[1024px]:flex max-[1024px]:flex-col max-[1024px]:items-center max-[1024px]:w-full">
                {/* Feature Pills */}
                <div className="flex gap-2.5 flex-nowrap mb-8 max-[1024px]:justify-center">
                  <span className="inline-flex items-center gap-1.5 sm:gap-2 bg-primary-light text-primary border-primary/12 rounded-full px-3 sm:px-4 py-2 text-[0.7rem] sm:text-[0.8rem] font-semibold transition-colors duration-300 ">
                    <FaCheckCircle /> 100% Placement Support
                  </span>
                  <span className="inline-flex items-center gap-1.5 sm:gap-2 bg-primary-light text-primary border-primary/12 rounded-full px-3 sm:px-4 py-2 text-[0.7rem] sm:text-[0.8rem] font-semibold transition-colors duration-300 ">
                    <FaGraduationCap /> Internship Included
                  </span>
                </div>

                {/* CTAs */}
                <div className="flex gap-3 flex-col sm:flex-row sm:flex-nowrap max-[1024px]:justify-center max-[1024px]:w-full max-[1024px]:max-w-[400px]">
                  <a
                    href="#counsellor"
                    className="inline-flex items-center justify-center px-7 py-3.5 rounded-full font-semibold text-base bg-primary text-white shadow-glow transition-all duration-300 hover:bg-primary-hover hover:shadow-glow-hover hover:-translate-y-0.5 whitespace-nowrap w-full sm:w-auto"
                  >
                    Talk to our Counsellor
                  </a>
                  <a
                    href="#demo"
                    className="inline-flex items-center justify-center px-7 py-3.5 rounded-full font-semibold text-base bg-transparent text-heading border border-black/50 transition-all duration-300 hover:border-primary hover:text-primary hover:bg-primary-light whitespace-nowrap w-full sm:w-auto"
                  >
                    Book a Free Demo Class
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Image & Orbs */}
            <div className="flex-[0_0_min(520px,46%)] min-[1025px]:max-w-[520px] relative z-10 max-[1024px]:flex-none max-[1024px]:w-full max-[1024px]:max-w-[540px] max-[1024px]:mx-auto max-[1024px]:order-2 max-[1024px]:my-8">
              {/* Premium Glow Orbs */}
              <div className="absolute top-10 -left-10 w-[200px] h-[200px] bg-primary/20 rounded-full blur-3xl z-[-1] animate-pulse-glow" />
              <div className="absolute -bottom-10 -right-10 w-[250px] h-[250px] bg-[#ff8c4a]/20 rounded-full blur-3xl z-[-1] animate-pulse-glow hover:bg-primary/30" />
              
              {/* Image Frame with Stats */}
              <div className="bg-white rounded-[24px] p-2.5 pb-0 shadow-[0_20px_50px_rgba(0,0,0,0.15)] ring-4 ring-white/60 animate-[float_6s_ease-in-out_infinite] group flex flex-col relative">
                {/* Image Section */}
                <div className="relative w-full h-[280px] md:h-[320px] rounded-[16px] overflow-hidden">
                  <Image
                    src="/hero/graduation2025.webp"
                    alt="Zeon Digital Marketing Academy — Graduation 2025"
                    width={560}
                    height={420}
                    priority
                    className="block w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Top-to-bottom shading for lower text, if necessary */}
                  <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
                  
                  {/* Overlay Badge */}
                  <div className="absolute bottom-4 left-5 right-5 text-white z-10 flex items-center">
                    <span className="flex items-center gap-2 text-white font-extrabold text-[1.15rem]">
                      <FiClock className="text-primary text-[1.4rem]" strokeWidth={2.5} /> 2-Month Intensive Course
                    </span>
                  </div>
                </div>

                {/* Stats Section */}
                <div className="flex bg-white pt-6 pb-7">
                  {/* Left Stat */}
                  <div className="flex-1 flex flex-col items-center justify-center border-r-[1.5px] border-surface">
                    <FaLinkedin className="text-[#0a66c2] text-[2.2rem] mb-2" />
                    <span className="text-[1.6rem] font-black text-heading leading-tight tracking-tight">27,000+</span>
                    <span className="text-[0.95rem] font-semibold text-body/80 mt-1">LinkedIn Jobs</span>
                  </div>
                  {/* Right Stat */}
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <span className="flex items-center justify-center bg-slate-200 text-slate-500 rounded px-2.5 py-1 mb-2 border border-slate-300">
                      <FaMoneyBillAlt className="text-[1.1rem]" />
                    </span>
                    <span className="text-[1.6rem] font-black text-heading leading-tight tracking-tight">₹10 LPA</span>
                    <span className="text-[0.95rem] font-semibold text-body/80 mt-1">Max Salary</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
  );
}
