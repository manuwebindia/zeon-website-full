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

export default function AdSpecialistPage() {
  const whatYouWillLearn = [
    "Manage social media for brands",
    "Techniques to analyze social media reach and feasibility",
    "Drive traffic to a website",
    "Rapidly grow an online audience"
  ];

  const courseContent = [
    {
      question: "Brand Awareness through social media",
      answer: "Strategies and frameworks to create brand familiarity, drive initial reach, and establish brand awareness online."
    },
    {
      question: "Social media engagement",
      answer: "Understand how to increase likes, comments, shares, video view retention, and organic community participation."
    },
    {
      question: "Facebook and Instagram Marketing",
      answer: "Configure Facebook Business pages, Instagram professional layouts, manage grid planning, and master algorithm mechanics."
    },
    {
      question: "Twitter and LinkedIn Marketing",
      answer: "Build network connections, professional thought leadership contents, optimize Twitter threads, and scale organic B2B outreach."
    },
    {
      question: "Quora and Pinterest Marketing",
      answer: "Use Quora answers to establish topic authority and optimize Pinterest pins to secure long-tail referral link traffic."
    },
    {
      question: "Social media Audit",
      answer: "Track accounts statistics, inspect engagement trends, review content themes, and audit competitor social handles."
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
                <div className="flex items-center gap-2 text-[0.88rem] font-semibold text-[#c3c8cf] mb-6 justify-center">
                  <Link href="/" className="hover:text-white transition-colors">Home</Link>
                  <span className="text-white/30">/</span>
                  <Link href="/courses" className="hover:text-white transition-colors">Courses</Link>
                  <span className="text-white/30">/</span>
                  <span className="text-primary font-bold">Ad Specialist Course</span>
                </div>

                <h1 className="text-[2.2rem] md:text-[3rem] font-extrabold text-white leading-tight mb-4 text-center">
                  Ad Specialist Course
                </h1>
                <p className="text-[1.1rem] md:text-[1.2rem] text-[#c3c8cf] font-medium leading-relaxed mb-6 text-center">
                  Facebook Management | Instagram Management | Social Media Strategy
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
                        src="https://www.youtube.com/embed/3hkXrY6bY0g" 
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
                        Growing a robust presence on social media has become a necessity for all businesses. This course contains the latest knowledge of the rapid-moving social media world and practical lessons for staying on top of it. You will learn how businesses can effectively use the major social media platforms and how to get the most out of your time spent on them. You will also learn to develop exceptional social media strategies that will aid businesses to unlock their digital potential. By the end of the course, you will be equipped to measure the success of your efforts and tweak your strategy based on what works and what doesn’t.
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
                        10 Days Intensive Classes
                      </li>
                      <li className="flex items-center gap-3 text-body font-medium">
                        <div className="w-8 h-8 rounded-full bg-blue-600/10 flex items-center justify-center shrink-0">
                          <FaCheckCircle className="text-blue-600 text-sm" />
                        </div>
                        Hands-on Practical Projects
                      </li>
                      <li className="flex items-center gap-3 text-body font-medium">
                        <div className="w-8 h-8 rounded-full bg-blue-600/10 flex items-center justify-center shrink-0">
                          <FaCheckCircle className="text-blue-600 text-sm" />
                        </div>
                        Google & Meta Ads Certifications
                      </li>
                      <li className="flex items-center gap-3 text-body font-medium">
                        <div className="w-8 h-8 rounded-full bg-blue-600/10 flex items-center justify-center shrink-0">
                          <FaCheckCircle className="text-blue-600 text-sm" />
                        </div>
                        Placement Drive Eligibility
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
                            <p className="text-[0.78rem] text-body mt-0.5">Ads Specialist</p>
                          </div>
                        </div>
                        <p className="text-[0.82rem] text-body mb-4 leading-relaxed">
                          Get the complete course outline, fee structure, and career outcomes — all in one PDF.
                        </p>
                        <BrochureDownloadButton
                          brochureUrl="/brochures/Ads_Specialist.pdf"
                          courseName="Ads Specialist Course"
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
                  "Technical SEO Auditing & Screaming Frog"
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
