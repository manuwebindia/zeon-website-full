import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { FaPhoneAlt, FaCheck, FaMapMarkerAlt, FaEnvelope, FaFacebookF, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import Navbar from "../../components/Navbar";
import CourseCard from "../../components/CourseCard";
import ScrollReveal from "../../components/ScrollReveal";
import Footer from "../../components/Footer";
import OurPartners from "../../components/OurPartners";
import PlacementsSection from "../../components/PlacementsSection";
import TestimonialsSlider from "../../components/TestimonialsSlider";
const WhatsAppFloat = dynamic(() => import("../../components/WhatsAppFloat"));
const BookDemoModal = dynamic(() => import("../../components/BookDemoModal"));
const LegalButtons = dynamic(() => import("../../components/LegalButtons"));

import { buildPageMetadata } from "@/lib/pageSeo";

export async function generateMetadata() {
  return buildPageMetadata("/courses");
}

const COURSE_CARD_BUTTON_THEME = {
  btnPopular:
    "bg-[#940101] border-2 border-transparent text-white hover:bg-[#7a0101] hover:-translate-y-0.5 shadow-[0_4px_15px_rgba(148,1,1,0.28)]",
  btnNormal:
    "bg-[#940101] border-2 border-transparent text-white hover:bg-[#7a0101] hover:-translate-y-0.5 shadow-[0_4px_15px_rgba(148,1,1,0.28)]",
  btnDetails: "hover:border-[#940101] hover:text-[#940101]",
  textPrimary: "text-[#940101]",
  checkColor: "before:text-[#940101]",
};

export default function CoursesPage() {
  return (
    <>
      <Navbar />
      <WhatsAppFloat />
      <BookDemoModal />

      <main className="bg-gradient-to-r from-[#2d2d2d] via-[#494949] to-[#2d2d2d]">
        {/* <div className="absolute bg-blend-overlay bg-black opacity-20 inset-0 z-10" /> */}
        {/* BREADCRUMB & HEADER SECTION */}
        <section className="relative pt-24 pb-0 md:pt-28 overflow-visible">
          {/* Orbs */}
          {/* <div className="absolute top-10 left-10 w-[200px] h-[200px] bg-primary/10 rounded-full blur-3xl z-0 animate-pulse-glow" />
          <div className="absolute -bottom-10 right-10 w-[250px] h-[250px] bg-[#ff8c4a]/10 rounded-full blur-3xl z-0 animate-pulse-glow" /> */}
          <Image
            src="/banner-white.svg"
            alt="Zeon Academy Courses Banner"
            fill
            priority
            className="object-cover object-center opacity-100 pointer-events-none"
          />
          <div className="w-full max-w-[1200px] mx-auto px-6 relative z-10 animate-fade-in-up pb-8 md:pb-10">
            <div className="relative max-w-3xl mx-auto text-center">
              {/* Breadcrumbs */}
              <div className="flex items-center justify-center gap-2.5 text-[0.88rem] font-semibold text-black/80 mb-5 !mt-5 md:mt-0">
                <Link href="/" className="hover:text-black transition-colors">
                  Home
                </Link>
                <span className="text-black/80">/</span>
                <span className="text-black/80">Courses</span>
              </div>

              <span className="block text-black text-[0.85rem] font-normal mb-3 tracking-[0.2em] uppercase">
                Start your journey here!
              </span>
              <h1 className="text-[clamp(2.2rem,5vw,2.3rem)] leading-[1.2] text-black mb-5 tracking-tight">
                Looking for a sure-shot way to pump up your <span className="text-primary"> Digital Marketing </span> career?
              </h1>
              <p className="text-[1.1rem] md:text-[1rem] text-black/80 leading-relaxed font-light mb-5 max-w-3xl mx-auto">
                Save hundreds of hours by learning from working professionals with <br /> the best digital marketing course in Kochi, Kerala.
              </p>
            </div>

            {/* <div className="pointer-events-none absolute bottom-0 right-0 z-[1] hidden sm:flex items-end justify-end">
              <div className="relative w-[min(65vw,240px)] md:w-[260px] lg:w-[300px] h-[200px] sm:h-[280px] md:h-[360px] lg:h-[360px]">
                <Image
                  src="/offers/jk.png"
                  alt="Zeon Academy Courses Banner"
                  fill
                  unoptimized
                  priority
                  className="object-contain object-right-bottom"
                  sizes="(max-width: 1024px) 72vw, 400px"
                />
              </div>
            </div> */}
          </div>
        </section>

        {/* FEATURED COURSES LIST */}
        <section className="py-16 md:py-24 bg-white relative">
          <div className="w-full max-w-[1200px] mx-auto px-6">
            <ScrollReveal direction="up" distance={50} delay={0.1}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Course 1 */}
                <CourseCard
                  borderVariant="grey"
                  buttonTheme={COURSE_CARD_BUTTON_THEME}
                  mode="online"
                  title="Advanced Digital Marketing Course"
                  duration="2 Months + 1 Month Internship"
                  image="/courses/d1.jpg"
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
                  isPopular={false}
                  brochure="/brochures/Advanced_Digital Marketing_Zeon_Academy.pdf"
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
                  borderVariant="grey"
                  buttonTheme={COURSE_CARD_BUTTON_THEME}
                  mode="online"
                  title="SEO Specialist Course"
                  duration="15 Days + 1 Month Internship"
                  image="/courses/s2.jpg"
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
                  brochure="/brochures/SEO_Specialist.pdf"
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
                  borderVariant="grey"
                  buttonTheme={COURSE_CARD_BUTTON_THEME}
                  mode="online"
                  title="Ads Specialist Course"
                  duration="10 Days"
                  image="/courses/a2.jpg"
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
                  brochure="/brochures/Ads_Specialist.pdf"
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
        <OurPartners />
        <PlacementsSection />
        <section id="placements">
          
        </section>


        <section id="testimonials" className="py-10 md:py-14 lg:py-16 xl:py-20 bg-white">
          <div className="w-full max-w-[1200px] mx-auto px-6 text-center">
            <div className="text-center mb-[4.5rem] max-w-6xl mx-auto">
              <span className="inline-block text-primary text-[0.85rem] font-semibold mb-5 tracking-[0.2em] uppercase">
                Reviews
              </span>
              <h2 className="text-[clamp(2.2rem,4vw,3rem)] font-extrabold text-heading mb-4 leading-tight">
                What Our Students Say About{" "}
                <span className="text-primary">Zeon Academy</span>
              </h2>
              <p className="text-[1.15rem] text-body leading-relaxed font-medium">
                Real experiences from students who completed the Digital
                Marketing Career Program.
              </p>
            </div>

            <TestimonialsSlider />
          </div>
        </section>

        {/* SECTION: MEET OUR MENTORS */}
        <section className="py-16 md:py-24 bg-surface bg-dots-pattern border-t border-border">
          <div className="w-full max-w-[1200px] mx-auto px-6">
            <ScrollReveal direction="up" distance={30}>
              <div className="text-center mb-16 max-w-2xl mx-auto">
                <span className="inline-block text-primary text-[0.85rem] font-semibold mb-3 tracking-[0.2em] uppercase">
                  Expert Faculty
                </span>
                <h2 className="text-[2rem] md:text-[2.8rem] font- text-heading leading-tight mb-4">
                  Meet Our Mentors
                </h2>
                <p className="text-[1.0rem] text-body leading-relaxed font-medium">
                  Learn directly from industry experts actively running campaigns and driving results.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Mentor 1: Sreethu */}
              <ScrollReveal direction="up" distance={40} delay={0.1}>
                <div className="group relative bg-white border border-border rounded-3xl overflow-hidden shadow-card  hover:border-primary/30 transition-all duration-500">
                  {/* Image Panel */}
                  <div className="relative h-[320px] w-full bg-gradient-to-br from-white via-[#fff] to-[#fff] flex items-end justify-center overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute top-4 right-4 w-20 h-20 bg-primary/10 rounded-full blur-xl" />
                    <div className="absolute bottom-0 left-6 w-14 h-14 bg-[#ff8c4a]/15 rounded-full blur-lg" />
                    <Image
                      src="/sreethu2.webp"
                      alt="Sreethu — Digital Marketing Specialist & Mentor"
                      width={280}
                      height={300}
                      className="object-contain object-bottom w-auto h-[300px] transition-transform duration-500 group-hover:scale-101 relative z-10 drop-shadow-lg"
                      sizes="280px"
                    />
                  </div>
                  {/* Info Panel */}
                  <div className="px-6 py-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-[1.4rem] font-extrabold text-heading leading-tight">
                          Sreethu
                        </h3>
                        <p className="text-[0.9rem] font-bold text-primary mt-0.5">
                          Digital Marketing Trainer
                        </p>
                      </div>
                      <span className="shrink-0 mt-1 inline-flex items-center gap-1.5 bg-green-500/10 text-green-500 text-[0.75rem] font-bold px-3 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-pulse" />
                        Active Trainer
                      </span>
                    </div>

                  </div>
                </div>
              </ScrollReveal>

              {/* Mentor 2: Jayakrishnan */}
              <ScrollReveal direction="up" distance={40} delay={0.2}>
                <div className="group relative bg-white border border-border rounded-3xl overflow-hidden shadow-card hover:border-primary/30 transition-all duration-500">
                  {/* Image Panel */}
                  <div className="relative h-[320px] w-full bg-gradient-to-br from-white via-[#fff] to-[#fff] flex items-end justify-center overflow-hidden">
                    <div className="absolute top-4 right-4 w-20 h-20 bg-blue-500/10 rounded-full blur-xl" />
                    <div className="absolute bottom-0 left-6 w-14 h-14 bg-purple-400/15 rounded-full blur-lg" />
                    <Image
                      src="/Jayakrishnan.webp"
                      alt="Jayakrishnan — Performance Marketing Specialist & Mentor"
                      width={280}
                      height={300}
                      className="object-contain object-bottom w-auto h-[300px] transition-transform duration-500 group-hover:scale-101 relative z-10 drop-shadow-lg"
                      sizes="280px"
                    />
                  </div>
                  {/* Info Panel */}
                  <div className="px-6 py-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-[1.4rem] font-extrabold text-heading leading-tight">
                          Jayakrishnan
                        </h3>
                        <p className="text-[0.9rem] font-bold text-primary mt-0.5">
                          Digital Marketing Mentor
                        </p>
                      </div>
                      <span className="shrink-0 mt-1 inline-flex items-center gap-1.5 bg-green-500/10 text-green-500 text-[0.75rem] font-bold px-3 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-pulse" />
                        Active Trainer
                      </span>
                    </div>

                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
