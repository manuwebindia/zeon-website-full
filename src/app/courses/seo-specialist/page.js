"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { FaStar, FaCheckCircle, FaShareAlt, FaGift } from "react-icons/fa";
import Navbar from "../../../components/Navbar";
import FAQAccordion from "../../../components/FAQAccordion";
import CourseCard from "../../../components/CourseCard";
import ScrollReveal from "../../../components/ScrollReveal";
import FreeDemoForm from "../../../components/FreeDemoForm";
import CourseTestimonials from "../../../components/CourseTestimonials";
import Footer from "../../../components/Footer";
import BrochureDownloadButton from "../../../components/BrochureDownloadButton";

const WhatsAppFloat = dynamic(() => import("../../../components/WhatsAppFloat"));
const BookDemoModal = dynamic(() => import("../../../components/BookDemoModal"));

export default function SeoSpecialistPage() {
  const whatYouWillLearn = [
    "Understand how SEO works",
    "Discover the best keywords for websites",
    "Structure and Optimize the webpages",
    "Stand out with Technical SEO",
    "Build High-quality Backlinks"
  ];

  const courseContent = [
    {
      question: "Search Engine Result Page (SERP)",
      answer: "Understanding search engine results, layouts, indexing, and the precise organic positioning of search keywords on SERPs."
    },
    {
      question: "Major Google Algorithms",
      answer: "Deep dive into Google Search systems like Core Updates, helpful content system, search quality rater guidelines, and spam detection systems."
    },
    {
      question: "How SEO Works?",
      answer: "Learn search engine crawler behavior, indexing mechanisms, web page rendering, and search ranking factors."
    },
    {
      question: "On-Page SEO",
      answer: "Optimize headers, metadata, URL slugs, internal link structures, content density, page speed parameters, and search intent alignment."
    },
    {
      question: "Off-Page SEO",
      answer: "Develop authority-building backlink campaigns, outreach planning, directory submissions, social signals, and local domain authority."
    },
    {
      question: "SEO Competitor Analysis",
      answer: "Audit competitor keywords, map content gaps, explore domain backlinks, and benchmark organic organic traffic performance."
    },
    {
      question: "Keyword Research",
      answer: "Discover search volumes, keyword density, local ranking difficulties, search intent types, and long-tail semantic variations."
    },
    {
      question: "Robots.txt, Sitemap.xml, and Schema Markup",
      answer: "Configure crawl budgets, direct search indexing crawlers, set up XML index maps, and integrate structured JSON-LD schema snippets."
    },
    {
      question: "Website Audit",
      answer: "Perform tech audits to identify crawl logs, redirection loops, broken links, non-responsive UI pages, and core web vital blockages."
    },
    {
      question: "Google My Business Listing",
      answer: "Optimize Google Business Profile layouts, generate local customer citations, manage reviews, and improve local Map Pack rankings."
    }
  ];

  return (
    <>
      <Navbar />
      <WhatsAppFloat />
      <BookDemoModal />

      <main className="bg-surface pb-20">
        {/* HEADER HERO */}
        <section className="bg-[#222831] border-b border-white/10 pt-24 pb-12 lg:pt-28 lg:pb-16">
          <div className="w-full max-w-[1200px] mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-12 lg:items-center">
              <div className="flex-1 animate-fade-in-up">
                {/* Breadcrumb */}
                <div className="flex items-center justify-center gap-2 text-[0.88rem] font-semibold text-[#c3c8cf] mb-6">
                  <Link href="/" className="hover:text-white transition-colors">Home</Link>
                  <span className="text-white/30">/</span>
                  <Link href="/courses" className="hover:text-white transition-colors">Courses</Link>
                  <span className="text-white/30">/</span>
                  <span className="text-primary font-bold">SEO Specialist Course</span>
                </div>

                <h1 className="text-[2.2rem] md:text-[3rem] font-extrabold text-white leading-tight mb-4 text-center">
                  SEO Specialist Course
                </h1>
                <p className="text-[1.1rem] md:text-[1.2rem] text-[#c3c8cf] font-medium leading-relaxed mb-6 text-center">
                  Keyword Research | Technical SEO | Organic Traffic & More
                </p>

                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-1.5 bg-[#fff8e1] px-4 py-2 rounded-full border border-[#ffe082]">
                    <span className="font-extrabold text-heading">5.0</span>
                    <div className="flex text-gold text-sm">
                      <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                    </div>
                  </div>
                  <span className="text-[#c3c8cf] font-medium text-[0.95rem]">Google Reviews</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT AREA */}
        <section className="py-12 md:py-16 relative">
          <div className="w-full max-w-[1200px] mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-10">
              
              {/* LEFT COLUMN - CONTENT */}
              <div className="flex-1 lg:w-2/3">
                
                {/* Course Video */}
                <ScrollReveal direction="up" distance={30}>
                  <div className="mb-10">
                    <div className="relative w-full aspect-video rounded-[20px] overflow-hidden shadow-card border border-border">
                      <iframe 
                        className="absolute top-0 left-0 w-full h-full"
                        src="https://www.youtube.com/embed/zRLgN4JSTts" 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen>
                      </iframe>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Description */}
                <ScrollReveal direction="up" distance={30}>
                  <div className="mb-10">
                    <h2 className="text-[1.5rem] font-extrabold text-heading mb-4">Description</h2>
                    <div className="text-[1.05rem] text-body leading-relaxed space-y-4 font-medium">
                      <p>
                        This course is designed to give the student a comprehensive understanding of the theory and best practices of SEO. You will learn how to organize and optimize web pages to show up on the first page of Google search results. You will discover the importance of content in SEO and methods to identify the most suitable keywords to draw traffic to a website. The course also includes techniques to build powerful backlinks and technical SEO to beat the competition.
                      </p>
                    </div>
                  </div>
                </ScrollReveal>

                {/* What you'll learn */}
                <ScrollReveal direction="up" distance={30}>
                  <div className="bg-white border border-border rounded-[20px] p-6 md:p-8 mb-8 shadow-sm">
                    <h2 className="text-[1.5rem] font-extrabold text-heading mb-6">What you'll learn</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                      {whatYouWillLearn.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <FaCheckCircle className="text-blue-600 mt-1 shrink-0" />
                          <span className="text-body font-medium leading-snug">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>

                {/* Course Content */}
                <ScrollReveal direction="up" distance={30}>
                  <div className="mb-10">
                    <h2 className="text-[1.8rem] font-extrabold text-heading mb-6">Course Content</h2>
                    <FAQAccordion faqs={courseContent} />
                  </div>
                </ScrollReveal>

                {/* Requirements */}
                <ScrollReveal direction="up" distance={30}>
                  <div className="mb-10">
                    <h2 className="text-[1.5rem] font-extrabold text-heading mb-4">Requirements</h2>
                    <ul className="list-disc pl-5 space-y-2 text-body font-medium">
                      <li>A desire to learn</li>
                      <li>No prior knowledge required</li>
                    </ul>
                  </div>
                </ScrollReveal>

                {/* Testimonials */}
                <ScrollReveal direction="up" distance={30}>
                  <div className="mb-12">
                    <h2 className="text-[1.8rem] font-extrabold text-heading mb-6">Student Reviews</h2>
                    <CourseTestimonials />
                  </div>
                </ScrollReveal>

              </div>

              {/* RIGHT COLUMN - SIDEBAR */}
              <div className="w-full lg:w-1/3 lg:max-w-[400px]">
                <div className="h-full space-y-8">
                  
                  {/* Course Features Card */}
                  <div className="bg-white border border-border rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all">
                    <h3 className="font-extrabold text-[1.25rem] text-heading mb-5">This course includes:</h3>
                    <ul className="space-y-4 mb-6">
                      <li className="flex items-center gap-3 text-body font-medium">
                        <div className="w-8 h-8 rounded-full bg-blue-600/10 flex items-center justify-center shrink-0">
                          <FaCheckCircle className="text-blue-600 text-sm" />
                        </div>
                        15 Days Classes
                      </li>
                      <li className="flex items-center gap-3 text-body font-medium">
                        <div className="w-8 h-8 rounded-full bg-blue-600/10 flex items-center justify-center shrink-0">
                          <FaCheckCircle className="text-blue-600 text-sm" />
                        </div>
                        1 Month Agency Internship Support
                      </li>
                      <li className="flex items-center gap-3 text-body font-medium">
                        <div className="w-8 h-8 rounded-full bg-blue-600/10 flex items-center justify-center shrink-0">
                          <FaCheckCircle className="text-blue-600 text-sm" />
                        </div>
                        Zeon & Google Certifications
                      </li>
                      <li className="flex items-center gap-3 text-body font-medium">
                        <div className="w-8 h-8 rounded-full bg-blue-600/10 flex items-center justify-center shrink-0">
                          <FaCheckCircle className="text-blue-600 text-sm" />
                        </div>
                        100% Placement Support
                      </li>
                      <li className="flex items-center gap-3 text-body font-medium">
                        <div className="w-8 h-8 rounded-full bg-blue-600/10 flex items-center justify-center shrink-0">
                          <FaCheckCircle className="text-blue-600 text-sm" />
                        </div>
                        Certificate of Completion
                      </li>
                      <li className="flex items-center gap-3 text-body font-medium">
                        <div className="w-8 h-8 rounded-full bg-blue-600/10 flex items-center justify-center shrink-0">
                          <FaCheckCircle className="text-blue-600 text-sm" />
                        </div>
                        1 Year Academic Support
                      </li>
                    </ul>

                    <div className="flex gap-4 pt-4 border-t border-border/60">
                      <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-surface border border-border hover:bg-body/5 hover:border-body/20 transition-all text-heading">
                        <FaShareAlt className="text-primary" /> Refer a Friend
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-surface border border-border hover:bg-body/5 hover:border-body/20 transition-all text-heading">
                        <FaGift className="text-primary" /> Gift Course
                      </button>
                    </div>
                  </div>

                  {/* Sticky Sidebar: Brochure + Demo Form */}
                  <div className="sticky top-28 space-y-6">

                    {/* Download Brochure Card */}
                    <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-card">
                      <div className="h-[5px] w-full bg-gradient-to-r from-primary via-[#ff4a4a] to-[#ff8c4a]" />
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                            <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                              <polyline points="14 2 14 8 20 8" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                              <text x="6" y="19" fontSize="5.5" fontWeight="800" fill="#ef4444" fontFamily="sans-serif">PDF</text>
                            </svg>
                          </div>
                          <div>
                            <p className="text-[0.95rem] font-extrabold text-heading leading-tight">Course Brochure</p>
                            <p className="text-[0.78rem] text-body mt-0.5">SEO Specialist</p>
                          </div>
                        </div>
                        <p className="text-[0.82rem] text-body mb-4 leading-relaxed">
                          Get the complete course outline, fee structure, and career outcomes — all in one PDF.
                        </p>
                        <BrochureDownloadButton
                          brochureUrl="/brochures/SEO_Specialist.pdf"
                          courseName="SEO Specialist Course"
                          className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary to-[#ff4a4a] text-white font-bold text-[0.9rem] hover:opacity-90 hover:-translate-y-0.5 transition-all duration-300 shadow-sm cursor-pointer"
                        >
                          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                          </svg>
                          Download Brochure
                        </BrochureDownloadButton>
                      </div>
                    </div>

                    <FreeDemoForm />
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* MORE COURSES SECTION */}
        <section className="py-16 bg-white border-t border-border">
          <div className="w-full max-w-[1200px] mx-auto px-6">
            <h2 className="text-[2rem] font-extrabold text-heading mb-10 text-center">More Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  "Google Ads & Performance Marketing"
                ]}
                isPopular={true}
              />
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
                  "Meta Business Suite & Pixel Tracking"
                ]}
                isPopular={false}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
