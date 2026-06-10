"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  FaPhoneAlt,
  FaCheckCircle,
  FaGraduationCap,
  FaArrowRight,
  FaLinkedin,
  FaBuilding,
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaMapMarkerAlt,
  FaEnvelope,
  FaCheck,
  FaUsers,
  FaMapMarker,
  FaBriefcase,
  FaStar,
} from "react-icons/fa";
import {
  FiMonitor,
  FiBriefcase,
  FiUsers,
  FiFolder,
  FiDollarSign,
  FiAward,
  FiUserCheck,
  FiClock,
  FiBookOpen,
  FiTrendingUp,
} from "react-icons/fi";
import Navbar from "../components/Navbar";
import CourseCard from "../components/CourseCard";
import ScrollReveal from "../components/ScrollReveal";
import NextBatchDate from "../components/NextBatchDate";
import FAQAccordion from "../components/FAQAccordion";

/* Lazy-load below-fold interactive components for smaller initial JS bundle */
const TestimonialsSlider = dynamic(() => import("../components/TestimonialsSlider"));
const BookDemoModal = dynamic(() => import("../components/BookDemoModal"));
const OurPartners = dynamic(() => import("../components/OurPartners"));
const AdmissionForm = dynamic(() => import("../components/AdmissionForm"));
const PlacementsSection = dynamic(() => import("../components/PlacementsSection"));
const WhatsAppFloat = dynamic(() => import("../components/WhatsAppFloat"));
const LegalModal = dynamic(() => import("../components/LegalModal"));
const LegalButtons = dynamic(() => import("../components/LegalButtons"));

/* --- Features for Why Choose Us --- */
const features = [
  { icon: FiUserCheck, title: "Industry Expert Trainers", desc: "Learn from active professionals with over 7+ years of digital marketing agency experience." },
  { icon: FiMonitor, title: "Live Projects", desc: "Work on active, real-world campaigns with real advertising budgets to gain practical experience." },
  { icon: FaGraduationCap, title: "Internship Support", desc: "Get a guaranteed 1-month hands-on agency internship to build your portfolio." },
  { icon: FiBriefcase, title: "Placement Assistance", desc: "100% placement support with resume optimization, LinkedIn setup, and interview prep." },
  { icon: FiAward, title: "Certifications", desc: "Get recognized certifications from Google, Meta, HubSpot, and Zeon Academy." },
  { icon: FiUsers, title: "Career Guidance", desc: "1-on-1 mentorship and goal-oriented career mapping to help you secure your dream role." },
];

/* --- Placement career support highlights --- */
const placementHighlights = [
  { icon: FiFolder, title: "Resume Building", desc: "Professional resume design optimized for digital marketing applicant tracking systems." },
  { icon: FaLinkedin, title: "LinkedIn Optimization", desc: "Profile audit and setup to attract recruiters and headhunters." },
  { icon: FiUsers, title: "Mock Interviews", desc: "HR and technical rounds practiced with industry experts for self-confidence." },
  { icon: FiTrendingUp, title: "Career Mentorship", desc: "Continuous guidance on industry trends, skills, and portfolio growth." },
];

const certImages = [
  { src: "/certificates/Google-Ads-Video-Certification.webp", title: "Google Ads Video Certification" },
  { src: "/certificates/Facebook-Blueprint-Certification.webp", title: "Facebook Blueprint Certification" },
  { src: "/certificates/Google-Analytics-Certification.webp", title: "Google Analytics Certification" },
  { src: "/certificates/google-adwords.webp", title: "Google Adwords Certification" },
  { src: "/certificates/Google Mobile-Advertising-Certification.webp", title: "Google Ads Display Certification" },
  { src: "/certificates/Google-Shopping-Advertising Certification.webp", title: "Google Shopping Advertising Certification" },
];

/* --- FAQs --- */
const homeFAQs = [
  {
    question: "Who is eligible to join the digital marketing courses at Zeon?",
    answer: "Anyone with a basic understanding of computer usage and a passion for marketing can join. This course is perfect for students, freshers, job seekers, business owners, and marketing professionals looking to upgrade their skills.",
  },
  {
    question: "What is the duration of the different courses?",
    answer: "The Advanced Digital Marketing Course is 2 Months of intensive training + 1 Month of guaranteed internship. The SEO Specialist Course is a 15-day program + 1 Month internship, and the Ads Specialist Course is a 10-day intensive program.",
  },
  {
    question: "Do you offer a certificate after completing the training?",
    answer: "Yes, you will receive a course completion certificate from Zeon Academy. Additionally, we train and guide you to clear globally recognized certifications from Google, Meta, and HubSpot.",
  },
  {
    question: "What does the 100% placement support include?",
    answer: "Our dedicated placement cell provides resume preparation, LinkedIn profile optimization, portfolio building guidance, mock interviews (technical & HR), and schedules direct interviews with our network of 100+ hiring partners in Kerala and beyond.",
  },
  {
    question: "Is there an internship included in the course?",
    answer: "Yes, both the Advanced Digital Marketing Course and the SEO Specialist Course include a guaranteed 1-month hands-on internship at a professional agency where you work on live client projects.",
  },
  {
    question: "Can I join online, or is it strictly offline at the campus?",
    answer: "We offer both modes! You can attend classroom training at our premium Kochi campus (Vennala) or join our live, interactive online batches led by our trainers in real-time.",
  },
];



export default function Home() {
  // Calculate next Monday's date in dd/mm/yy format
  const getNextMondayDateStr = () => {
    const today = new Date();
    const day = today.getDay();
    let daysToNextMonday = 1 - day;
    if (daysToNextMonday <= 0) {
      daysToNextMonday += 7;
    }
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysToNextMonday);

    const dd = String(nextMonday.getDate()).padStart(2, "0");
    const mm = String(nextMonday.getMonth() + 1).padStart(2, "0");
    const yy = String(nextMonday.getFullYear()).slice(-2);

    return `${dd}/${mm}/${yy}`;
  };

  const nextBatchDate = getNextMondayDateStr();

  return (
    <>
      {/* SECTION 1: Header (Navbar) */}
      <Navbar />
      <LegalModal />
      <WhatsAppFloat />
      <BookDemoModal />

      <main className="bg-white">
        {/* ═══════════════════════════════════════════════
            SECTION 2: HERO BANNER
        ═══════════════════════════════════════════════ */}
        <section className="pt-24 pb-8 md:pt-28 md:pb-10 lg:pt-32 lg:pb-12 xl:pt-36 xl:pb-16 bg-surface xl:bg-zeon-banner bg-no-repeat bg-center bg-cover relative overflow-x-hidden">
          <div className="w-full max-w-[1200px] mx-auto px-6 flex items-center justify-between gap-14 max-[1024px]:flex-col max-[1024px]:text-center max-[1024px]:gap-0">
            {/* Left Box */}
            <div className="flex-1 max-w-[540px] max-[1024px]:contents">
              
              {/* TOP SECTION */}
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
                  Start your career with Kerala&apos;s most practical, job-driven Digital Marketing Program. Learn directly from agency professionals on live campaigns.
                </p>
              </div>

              {/* BOTTOM SECTION */}
              <div className="animate-fade-in-up max-[1024px]:order-3 max-[1024px]:flex max-[1024px]:flex-col max-[1024px]:items-center max-[1024px]:w-full">
                {/* Feature Pills */}
                <div className="flex gap-2.5 flex-nowrap mb-8 max-[1024px]:justify-center">
                  <span className="inline-flex items-center gap-1.5 sm:gap-2 bg-primary-light text-primary border-primary/12 rounded-full px-3 sm:px-4 py-2 text-[0.7rem] sm:text-[0.8rem] font-semibold transition-colors duration-300">
                    <FaCheckCircle /> 100% Placement support
                  </span>
                  <span className="inline-flex items-center gap-1.5 sm:gap-2 bg-primary-light text-primary border-primary/12 rounded-full px-3 sm:px-4 py-2 text-[0.7rem] sm:text-[0.8rem] font-semibold transition-colors duration-300">
                    <FaGraduationCap /> Agency Internship Included
                  </span>
                </div>

                {/* CTAs */}
                <div className="flex gap-3 flex-col sm:flex-row sm:flex-nowrap max-[1024px]:justify-center max-[1024px]:w-full max-[1024px]:max-w-[400px]">
                  <button
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent("openBookDemo", { detail: { courseName: "General Enquiry" } }));
                    }}
                    className="inline-flex items-center justify-center px-7 py-3.5 rounded-full font-semibold text-base bg-primary text-white shadow-glow transition-all duration-300 hover:bg-primary-hover hover:shadow-glow-hover hover:-translate-y-0.5 whitespace-nowrap cursor-pointer w-full sm:w-auto"
                  >
                    Book Free Demo
                  </button>
                  <a
                    href="/brochure.pdf"
                    download
                    className="inline-flex items-center justify-center px-7 py-3.5 rounded-full font-semibold text-base bg-transparent text-heading border border-black/50 transition-all duration-300 hover:border-primary hover:text-primary hover:bg-primary-light whitespace-nowrap w-full sm:w-auto"
                  >
                    Download Brochure
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Image & Orbs */}
            <div className="flex-[0_0_min(520px,46%)] min-[1025px]:max-w-[520px] relative z-10 max-[1024px]:flex-none max-[1024px]:w-full max-[1024px]:max-w-[540px] max-[1024px]:mx-auto max-[1024px]:order-2 max-[1024px]:my-8">
              {/* Premium Glow Orbs */}
              <div className="absolute top-10 -left-10 w-[200px] h-[200px] bg-primary/20 rounded-full blur-3xl z-[-1] animate-pulse-glow" />
              <div className="absolute -bottom-10 -right-10 w-[250px] h-[250px] bg-[#ff8c4a]/20 rounded-full blur-3xl z-[-1] animate-pulse-glow" />
              
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
                    <span className="text-[1.6rem] font-black text-heading leading-tight tracking-tight">Kochi</span>
                    <span className="text-[0.95rem] font-semibold text-body/80 mt-1">Campus</span>
                  </div>
                  {/* Right Stat */}
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <span className="text-[1.6rem] font-black text-heading leading-tight tracking-tight">₹10 LPA</span>
                    <span className="text-[0.95rem] font-semibold text-body/80 mt-1">Highest Package</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 3: TRUST INDICATORS
        ═══════════════════════════════════════════════ */}
        <section className="bg-white border-y border-border py-10 relative overflow-hidden">
          <div className="w-full max-w-[1200px] mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="flex flex-col items-center p-4">
                <span className="text-[2.6rem] md:text-[3rem] font-black text-primary mb-1">1,200+</span>
                <span className="text-sm md:text-black/80 font-bold text-heading">Students Trained</span>
              </div>
              <div className="flex flex-col items-center p-4 border-l border-border max-md:border-none">
                <span className="text-[2.6rem] md:text-[3rem] font-black text-primary mb-1">98%</span>
                <span className="text-sm md:text-black/80 font-bold text-heading">Placement Success</span>
              </div>
              <div className="flex flex-col items-center p-4 border-l border-border">
                <span className="text-[2.6rem] md:text-[3rem] font-black text-primary mb-1">100+</span>
                <span className="text-sm md:text-black/80 font-bold text-heading">Hiring Partners</span>
              </div>
              <div className="flex flex-col items-center p-4 border-l border-border">
                <span className="text-[2.6rem] md:text-[3rem] font-black text-primary mb-1">7+</span>
                <span className="text-sm md:text-black/80 font-bold text-heading">Years of Experience</span>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 4: FEATURED COURSES
        ═══════════════════════════════════════════════ */}
        <section id="program" className="py-16 md:py-20 bg-surface bg-grid-pattern">
          <div className="w-full max-w-[1200px] mx-auto px-6">
            <ScrollReveal direction="up" distance={40}>
              <div className="text-center mb-[4rem] max-w-3xl mx-auto">
                <span className="inline-block text-primary text-[0.85rem] font-semibold mb-3 tracking-[0.2em] uppercase">
                  Featured Programs
                </span>
                <h2 className="text-[clamp(2.2rem,4vw,2.8rem)] font-extrabold text-heading mb-4 leading-tight">
                  Choose Your Digital Marketing <span className="text-primary">Program</span>
                </h2>
                <p className="text-[1.1rem] text-body leading-relaxed font-medium">
                  We offer industry-aligned courses designed for freshers, professionals, and entrepreneurs.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" distance={50} delay={0.1}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Course 1 */}
                <CourseCard
                  mode="online"
                  title="Advanced Digital Marketing Course"
                  duration="2 Months + 1 Month Internship"
                  image="/courses/digitalmarketing-course.webp"
                  slug="/courses/advanced-digital-marketing"
                  certifications="15+ Certifications (Google, Meta, HubSpot)"
                  placement="Guaranteed Internship & 100% Placement"
                  description="A complete, practical 60-day program that teaches all major areas of digital marketing using real tools, real campaigns, and placement-focused training."
                  learnList={[
                    "Digital Marketing Strategy & Channels",
                    "SEO & Search Console Audits",
                    "Google Ads & Performance Marketing",
                    "Meta Ads & Instagram Campaigns",
                    "Email Marketing & Automation Tools",
                  ]}
                  isPopular={true}
                  syllabus={[
                    { title: "Module 1: Intro to Digital Marketing & Graphic Design", topics: [] },
                    { title: "Module 2: Website Creation & WordPress Setup", topics: [] },
                    { title: "Module 3: Search Engine Optimization (SEO)", topics: [] },
                    { title: "Module 4: Google Analytics & Search Console", topics: [] },
                    { title: "Module 5: Performance Marketing & Google Ads", topics: [] },
                    { title: "Module 6: Social Media Marketing & Meta Ads", topics: [] },
                    { title: "Module 7: Email Marketing & Analytics Setup", topics: [] },
                  ]}
                />

                {/* Course 2 */}
                <CourseCard
                  mode="online"
                  title="SEO Specialist Course"
                  duration="15 Days + 1 Month Internship"
                  image="/courses/seo-course.webp"
                  slug="/courses/seo-specialist"
                  certifications="Zeon & Google Certifications"
                  placement="1-Month Agency Internship Support"
                  description="A fast-track SEO program designed to build strong search optimization skills in just 15 days."
                  learnList={[
                    "SEO Search Logic & Search Algorithms",
                    "On-Page Content SEO & Page Speeds",
                    "Technical SEO Auditing & Screaming Frog",
                    "Local Business Listing & Map Packs",
                    "Backlink Strategy & Authority Building",
                  ]}
                  isPopular={false}
                  syllabus={[
                    { title: "Module 1: SEO Fundamentals & Core Logic", topics: [] },
                    { title: "Module 2: Keyword Research & Competitive Intel", topics: [] },
                    { title: "Module 3: On-Page SEO & Content Planning", topics: [] },
                    { title: "Module 4: Technical Audits & Web Speeds", topics: [] },
                    { title: "Module 5: Link Building Strategies", topics: [] },
                    { title: "Module 6: Local Map Pack SEO", topics: [] },
                  ]}
                />

                {/* Course 3 */}
                <CourseCard
                  mode="online"
                  title="Ads Specialist Course"
                  duration="10 Days"
                  image="/courses/ads-course.webp"
                  slug="/courses/ads-specialist"
                  certifications="Google & Meta Ads Certifications"
                  placement="Placement Drive Eligibility"
                  description="A 10-day intensive training focused on creating, managing, and optimizing high-performance social media ad campaigns."
                  learnList={[
                    "Paid Advertising Foundations",
                    "Google Search & Display Network Ads",
                    "Meta Business Suite & Pixel Tracking",
                    "Audience Targeting & Funnel Strategy",
                    "Campaign Budgets, ROAS & Scalability",
                  ]}
                  isPopular={false}
                  syllabus={[
                    { title: "Module 1: Paid Traffic & Tracking Basics", topics: [] },
                    { title: "Module 2: Google Ads Setup & Optimization", topics: [] },
                    { title: "Module 3: Display Advertising & YouTube Ads", topics: [] },
                    { title: "Module 4: Meta Campaign Manager (FB & IG)", topics: [] },
                    { title: "Module 5: Conversion Tracking & Pixels", topics: [] },
                    { title: "Module 6: Analytics & Scaling Campaigns", topics: [] },
                  ]}
                />
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 5: WHY CHOOSE ZEON ACADEMY
        ═══════════════════════════════════════════════ */}
        <section id="why-zeon" className="py-16 md:py-20 bg-white bg-dots-pattern">
          <div className="w-full max-w-[1200px] mx-auto px-6">
            <ScrollReveal direction="up" distance={40}>
              <div className="text-center mb-[4.5rem] max-w-3xl mx-auto">
                <span className="inline-block text-primary text-[0.85rem] font-semibold mb-3 tracking-[0.2em] uppercase">
                  Our Core Pillars
                </span>
                <h2 className="text-[clamp(2.2rem,4vw,2.8rem)] font-extrabold text-heading mb-4 leading-tight">
                  Why Choose <span className="text-primary">Zeon Academy</span>?
                </h2>
                <p className="text-[1.1rem] text-body leading-relaxed font-medium">
                  We bridge the gap between academic theory and actual digital marketing careers.
                </p>
              </div>
            </ScrollReveal>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="bg-white border border-border rounded-2xl p-8 transition-all duration-500 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(255,68,68,0.06)] hover:border-primary/20 group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary to-[#ff8c4a] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="w-[50px] h-[50px] bg-primary-light rounded-xl flex items-center justify-center mb-5 text-primary text-[1.4rem] border border-primary/10 transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:scale-110 group-hover:shadow-[0_8px_20px_rgba(255,68,68,0.2)] relative z-10">
                    <f.icon />
                  </div>
                  <h3 className="text-[1.15rem] font-extrabold text-heading mb-3">
                    {f.title}
                  </h3>
                  <p className="text-[0.95rem] leading-relaxed text-body font-medium">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 6: CERTIFICATIONS SHOWCASE
        ═══════════════════════════════════════════════ */}
        <section className="py-16 md:py-20 bg-surface bg-diagonal-pattern border-y border-border overflow-hidden">
          <div className="w-full max-w-[1200px] mx-auto px-6">
            <ScrollReveal direction="up" distance={40}>
              <div className="text-center mb-12 max-w-3xl mx-auto">
                <h2 className="text-[2.2rem] lg:text-[2.8rem] font-extrabold text-heading mb-4 leading-tight">
                  Get Certified By <span className="text-primary">Industry Leaders</span>
                </h2>
                <p className="text-[1.05rem] text-body leading-relaxed font-medium max-w-2xl mx-auto">
                  Get your skills recognized by the pioneers of technology and marketing.
                  <br className="hidden sm:inline" />
                  Showcase them on LinkedIn. Let the recruiters find you.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" distance={50} delay={0.1}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12">
                {/* Zeon Academy Certification Card */}
                <div className="col-span-1 md:col-span-2 lg:col-span-1 lg:row-span-3 bg-white border border-border/80 rounded-[20px] p-8 flex flex-col items-center justify-center text-center shadow-card hover:shadow-card-hover hover:border-primary/20 transition-all duration-300 hover:-translate-y-1">
                  <div className="relative w-[130px] h-[130px] rounded-full border border-[#ffebeb] flex items-center justify-center bg-white p-3 shadow-[inset_0_2px_8px_rgba(255,68,68,0.04)] mb-4">
                    <Image
                      src="/LOGOblack.png"
                      alt="Zeon Academy"
                      width={100}
                      height={100}
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-[1.2rem] font-extrabold text-heading mb-1 mt-2">
                    Zeon Academy
                  </h3>
                  <span className="text-[1.05rem] font-bold text-primary tracking-wide uppercase">
                    Certification
                  </span>
                </div>

                {/* Other Certification Cards */}
                {certImages.map((cert, i) => (
                  <div
                    key={i}
                    className="bg-white border border-border/80 rounded-[20px] p-4 sm:p-6 flex flex-col items-center justify-center text-center shadow-card hover:shadow-card-hover hover:border-primary/20 transition-all duration-300 hover:-translate-y-1 min-h-[170px]"
                  >
                    <Image
                      src={cert.src}
                      alt={cert.title}
                      width={300}
                      height={200}
                      className="w-full h-auto max-h-[140px] object-contain"
                    />
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 7: PLACEMENT ASSISTANCE
        ═══════════════════════════════════════════════ */}
        <section className="py-16 md:py-20 bg-white">
          <div className="w-full max-w-[1200px] mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Left Column: Stats and Text */}
              <div className="flex-1">
                <span className="inline-block text-primary text-[0.85rem] font-semibold mb-3 tracking-[0.2em] uppercase">
                  Career Support
                </span>
                <h2 className="text-[2.2rem] md:text-[2.8rem] font-extrabold text-heading leading-[1.15] mb-5">
                  100% Placement Support <br />Until You Are <span className="text-primary">Placed</span>
                </h2>
                <p className="text-base text-body leading-[1.7] mb-8 font-medium">
                  We don't just teach digital marketing; we help you launch your career. From optimizing your online presence to arranging mock interviews with HR leads, we've got you covered.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  {placementHighlights.map((hl, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary-light border border-primary/10 flex items-center justify-center text-primary shrink-0">
                        <hl.icon className="text-lg" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-heading text-[1rem] mb-1">{hl.title}</h4>
                        <p className="text-[0.85rem] text-body leading-relaxed">{hl.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/placements"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-base bg-primary text-white shadow-glow transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5"
                >
                  View Placement Program <FaArrowRight />
                </Link>
              </div>

              {/* Right Column: Visual Mockup */}
              <div className="flex-1 w-full max-w-[500px] relative">
                <div className="absolute top-10 right-10 w-[200px] h-[200px] bg-primary/15 rounded-full blur-3xl z-[-1]" />
                <div className="bg-surface border border-border p-6 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.06)] relative overflow-hidden">
                  <Image
                    src="/live-demo-bkp.webp"
                    alt="Mock interview session"
                    width={480}
                    height={320}
                    className="rounded-xl object-cover w-full h-auto mb-4"
                  />
                  <div className="bg-white p-4 rounded-xl border border-border/80 flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-heading text-[0.95rem] mb-0.5">Mock HR Round</h4>
                      <p className="text-[0.8rem] text-body m-0">Conducted weekly on Fridays</p>
                    </div>
                    <span className="text-[0.8rem] font-bold text-green bg-green/8 px-3 py-1.5 rounded-full">
                      Live Assessment
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 8: STUDENT SUCCESS STORIES
        ═══════════════════════════════════════════════ */}
        <section id="placements"><PlacementsSection /></section>

        {/* Hiring Partners Logo Section */}
        <OurPartners />

        {/* Testimonials */}
        <section className="py-16 md:py-20 bg-white">
          <div className="w-full max-w-[1200px] mx-auto px-6 text-center">
            <div className="text-center mb-[4.5rem] max-w-3xl mx-auto">
              <span className="inline-block text-primary text-[0.85rem] font-semibold mb-3 tracking-[0.2em] uppercase">
                Success Stories
              </span>
              <h2 className="text-[clamp(2.2rem,4vw,2.8rem)] font-extrabold text-heading mb-4 leading-tight">
                What Our Students Say About <span className="text-primary">Zeon</span>
              </h2>
              <p className="text-[1.1rem] text-body leading-relaxed font-medium">
                Hear from graduates who started from scratch and achieved success in their careers.
              </p>
            </div>

            <TestimonialsSlider />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 11: FAQ SECTION
        ═══════════════════════════════════════════════ */}
        <section className="py-16 md:py-20 bg-surface border-y border-border">
          <div className="w-full max-w-[1200px] mx-auto px-6">
            <ScrollReveal direction="up" distance={40}>
              <div className="text-center mb-[4rem] max-w-3xl mx-auto">
                <span className="inline-block text-primary text-[0.85rem] font-semibold mb-3 tracking-[0.2em] uppercase">
                  Questions
                </span>
                <h2 className="text-[clamp(2.2rem,4vw,2.8rem)] font-extrabold text-heading mb-4 leading-tight">
                  Frequently Asked <span className="text-primary">Questions</span>
                </h2>
                <p className="text-[1.1rem] text-body leading-relaxed font-medium">
                  Got questions? We've got answers. Explore our common queries below.
                </p>
              </div>
            </ScrollReveal>

            <FAQAccordion faqs={homeFAQs} />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 12: FINAL CTA & CONTACT FORM
        ═══════════════════════════════════════════════ */}
        <section id="admission" className="bg-white py-16 md:py-20 scroll-mt-10">
          <div className="w-full max-w-[1100px] mx-auto px-6">
            <div className="flex items-center gap-16 lg:gap-20 flex-col lg:flex-row">
              {/* Left Side: Text & Counselor Info */}
              <div id="counsellor" className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-1/2 order-2 lg:order-none">
                <h2 className="text-[2.2rem] lg:text-[2.8rem] font-extrabold text-heading leading-[1.15] mb-5">
                  Have Questions? <br />
                  <span className="text-primary">Talk to our Counselor.</span>
                </h2>
                <p className="text-[1.1rem] text-body leading-relaxed max-w-[480px] mb-10 mx-auto lg:mx-0">
                  Ready to start? Fill in the form or contact our advisor directly to schedule your free demo class.
                </p>

                {/* Counselor Card */}
                <div className="flex items-center bg-surface p-5 rounded-xl shadow-card mb-8 w-full max-w-[420px] gap-5 border border-border mx-auto lg:mx-0">
                  <div className="flex-[0_0_86px] w-[86px] h-[86px] rounded-full border-2 border-primary p-0.5 flex items-center justify-center">
                    <Image
                      src="/johncy-new.webp"
                      alt="Academy Advisor Johncy John"
                      width={90}
                      height={90}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-[1.15rem] font-extrabold text-heading mb-0.5">
                      Johncy John
                    </h3>
                    <p className="text-[0.9rem] text-body m-0">
                      Academy Counselor
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 w-full max-w-[420px] flex-col sm:flex-row mx-auto lg:mx-0">
                  <a
                    href="tel:+918943356405"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-full font-bold text-base bg-[#0B5CFF] text-white shadow-[0_8px_20px_rgba(11,92,255,0.25)] transition-all duration-300 hover:bg-[#1059D6] hover:-translate-y-0.5"
                  >
                    <FaPhoneAlt size={14} />
                    <span>+91 8943356405</span>
                  </a>
                  <a
                    href="https://wa.me/917558888252?text=I%20have%20a%20question%20about%20digital%20marketing%20course"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-full font-bold text-base bg-[#19be55] text-white shadow-[0_8px_20px_rgba(37,211,102,0.25)] transition-all duration-300 hover:bg-[#20bd5a] hover:-translate-y-0.5"
                  >
                    <FaWhatsapp size={18} />
                    <span>WhatsApp Us</span>
                  </a>
                </div>
              </div>

              {/* Right Side: Admission/Enquiry Form */}
              <div className="w-full lg:w-1/2 flex justify-center lg:justify-end order-1 lg:order-none">
                <AdmissionForm showHeader={true} />
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            LOCATION MAP SECTION
        ═══════════════════════════════════════════════ */}
        <section id="contact-us" className="py-16 bg-surface bg-dots-pattern border-t border-border relative overflow-hidden">
          <div className="w-full max-w-[1200px] mx-auto px-6">
            <ScrollReveal direction="up" distance={40}>
              <div className="text-center mb-8">
                <span className="inline-block text-primary text-[0.85rem] font-semibold mb-3 tracking-[0.2em] uppercase">
                  Find Us
                </span>
                <h2 className="text-[2.2rem] lg:text-[2.8rem] font-extrabold text-heading mb-3 leading-tight">
                  Our <span className="text-primary">Campus</span> Location
                </h2>
                <p className="text-[1rem] text-body max-w-[600px] mx-auto font-medium">
                  Visit us at our Kochi campus for a friendly chat, a free demo, and expert career counselling.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" distance={50} delay={0.1}>
              <div className="relative rounded-[24px] overflow-hidden shadow-[0_15px_45px_rgba(0,0,0,0.08)] border border-border bg-white p-3 md:p-4 group">
                <div className="relative w-full h-[350px] md:h-[450px] rounded-[18px] overflow-hidden">
                  <iframe
                    src="https://maps.google.com/maps?q=Zeon%20Academy,%20Haritha%20Road,%20Vennala,%20Kochi,%20Kerala%20682028&t=&z=16&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Zeon Academy Location Map"
                    className="w-full h-full grayscale-[15%] contrast-[110%] group-hover:grayscale-0 transition-all duration-500"
                  ></iframe>
                </div>
                
                {/* Floating Address Card */}
                <div className="mt-4 md:absolute md:bottom-8 md:left-8 md:max-w-[360px] bg-white rounded-2xl p-5 md:shadow-[0_10px_35px_rgba(0,0,0,0.15)] border border-border/60 z-10">
                  <h4 className="text-[1.1rem] font-bold text-heading mb-2">Zeon Academy</h4>
                  <p className="text-[0.88rem] text-body leading-relaxed mb-4 font-medium">
                    46/2709 C, Ground Floor, Haritha Rd, Vennala, Kochi, Kerala 682028
                  </p>
                  <a
                    href="https://www.google.com/maps?rlz=1C5CHFA_enIN1151IN1151&um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=KaM1iwnYcgg7MQtWkCmexzQd&daddr=46/2709+C,+Ground+Floor,+Haritha+Rd,+Vennala,+Kochi,+Kerala+682028"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full rounded-full py-2.5 px-4 font-bold text-[0.85rem] bg-primary text-white hover:bg-primary-hover transition-all duration-300 shadow-[0_4px_12px_rgba(255,68,68,0.2)] border-none"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            FOOTER
        ═══════════════════════════════════════════════ */}
        <footer className="bg-[#222831] text-[#c3c8cf] pt-12 pb-6 md:pt-16 md:pb-8 text-[0.95rem]">
          <div className="w-full max-w-[1200px] mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-16">
              {/* Column 1: Brand */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Image
                    src="/zeon-logo.png"
                    alt="Zeon Academy"
                    width={140}
                    height={45}
                    style={{ height: "45px", width: "auto" }}
                  />
                </div>
                <p className="leading-relaxed mb-6 text-[#c3c8cf]">
                  Kerala&rsquo;s leading digital marketing training institute with 100% placement support.
                </p>
                <div className="flex gap-3">
                  {[
                    { Icon: FaFacebookF, href: "https://www.facebook.com/ZEONACADEMY/" },
                    { Icon: FaInstagram, href: "https://www.instagram.com/zeon_academy" },
                    { Icon: FaLinkedin, href: "https://in.linkedin.com/company/zeon-academy" },
                    { Icon: FaYoutube, href: "https://www.youtube.com/@zeonacademy" },
                  ].map(({ Icon, href }, i) => (
                    <a
                      key={i}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-9 h-9 rounded-md bg-[#393f47] text-white transition-all duration-200 hover:bg-primary hover:scale-110"
                    >
                      <Icon />
                    </a>
                  ))}
                </div>
              </div>

              {/* Column 2: Quick Links */}
              <div>
                <h4 className="text-white font-bold mb-5 tracking-wide">
                  Quick Links
                </h4>
                <ul className="flex flex-col gap-3 list-none p-0">
                  {[
                    { label: "Home", href: "/" },
                    { label: "About Us", href: "/about" },
                    { label: "Courses", href: "/courses" },
                    { label: "Placements", href: "/placements" },
                    { label: "Blog", href: "/blog" },
                    { label: "Contact Us", href: "/contact" },
                  ].map(({ label, href }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="text-[#c3c8cf] no-underline transition-all duration-300 hover:text-white hover:pl-1"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3: Contact */}
              <div>
                <h4 className="text-white font-bold mb-5 tracking-wide">
                  Contact Us
                </h4>
                <ul className="flex flex-col gap-4 list-none p-0">
                  <li className="flex items-start gap-3">
                    <FaMapMarkerAlt className="text-primary mt-1 shrink-0" />
                    <span className="leading-normal text-[#c3c8cf]">
                      Zeon Academy, 46/2709 C, Haritha Road Vennala PO, Kochi - 682028
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaPhoneAlt className="text-primary shrink-0" />
                    <a
                      href="tel:+918943356405"
                      className="text-[#c3c8cf] no-underline hover:text-white transition-colors"
                    >
                      +91 8943356405
                    </a>
                  </li>
                  <li className="flex items-center gap-3">
                    <FaEnvelope className="text-primary shrink-0" />
                    <span className="text-[#c3c8cf]">
                      contact@zeonacademy.com
                    </span>
                  </li>
                </ul>
              </div>

              {/* Column 4: Certifications */}
              <div>
                <h4 className="text-white font-bold mb-5 tracking-wide">
                  Certifications
                </h4>
                <ul className="flex flex-col gap-3 list-none p-0">
                  {[
                    "Government Recognized",
                    "NSDC Partner",
                    "Google Partner",
                    "Meta Partner",
                  ].map((cert) => (
                    <li
                      key={cert}
                      className="flex items-center gap-3 text-[#c3c8cf]"
                    >
                      <FaCheck className="text-primary text-[0.85em] shrink-0" />
                      {cert}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-between items-center gap-4 py-6 border-t border-white/10 text-[0.85rem]">
              <p className="m-0 text-[#c3c8cf] text-center sm:text-left">
                © 2026 Zeon Academy. All Rights Reserved | <span className="whitespace-nowrap">Powered by <a href="https://webindiasolutions.com/" target="_blank" rel="noopener noreferrer" className="text-white no-underline hover:text-primary transition-all duration-300">Web India Solutions</a></span>
              </p>
              <div className="flex gap-6">
                <LegalButtons />
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
