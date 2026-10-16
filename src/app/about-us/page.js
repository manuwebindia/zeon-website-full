import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  FaCheck,
  FaStar,
} from "react-icons/fa";
import Navbar from "../../components/Navbar";
import ScrollReveal from "../../components/ScrollReveal";
import TestimonialSection from "@/components/home/TestimonialsSection";
import Footer from "../../components/Footer";

const WhatsAppFloat = dynamic(() => import("../../components/WhatsAppFloat"));
const BookDemoModal = dynamic(() => import("../../components/BookDemoModal"));
import Timeline from "@/components/ui/timeline";
import BookDemoButton from "@/components/BookDemoButton";
import BottomCtaBanner from "@/components/BottomCtaBanner";

import { buildPageMetadata, getPageCms } from "@/lib/pageSeo";
import { INNER_PAGE } from "@/lib/designLanguage";

export async function generateMetadata() {
  return buildPageMetadata("/about-us");
}

export default async function AboutPage() {
  const cms = await getPageCms("/about-us");
  const bannerImage = cms?.bannerImage || "/banner-white.svg";
  const heroTitle = cms?.bannerTitle;
  const heroSubtitle = cms?.bannerSubtitle;

  return (
    <>
      <Navbar />
      <WhatsAppFloat />
      <BookDemoModal />

      <main className="bg-white">
        {/* HERO BANNER */}
        <section className={INNER_PAGE.heroSection}>
          <Image
            src={bannerImage}
            alt="Zeon Academy About Banner"
            fill
            priority
            className={INNER_PAGE.heroBannerClass}
          />
          <div className={INNER_PAGE.heroOverlay} />

          <div className={INNER_PAGE.heroContent}>
            <div className={INNER_PAGE.heroInner}>
              <nav className={INNER_PAGE.breadcrumb}>
                <Link href="/" className={INNER_PAGE.breadcrumbLink}>Home</Link>
                <span className={INNER_PAGE.breadcrumbSep}>/</span>
                <span className={INNER_PAGE.breadcrumbCurrent}>About Us</span>
              </nav>

              <span className={INNER_PAGE.tagline}>Who We Are</span>
              <h1 className={INNER_PAGE.title}>
                {heroTitle ? heroTitle : (
                  <>
                    We Are Not An Ordinary <br className="hidden md:inline" />
                    <span className="text-primary">Digital Marketing Institute</span>
                  </>
                )}
              </h1>
              <p className={INNER_PAGE.subtitle}>
                {heroSubtitle || "ZEON Academy is a career-focused digital marketing training institute in Kochi, backed by the industry experience of Web India Branding & Marketing Private Limited (WIS)."}
              </p>
            </div>
          </div>
        </section>

        {cms?.content && (
          <section className="py-8 bg-white border-b border-gray-100">
            <div className="w-full max-w-[1200px] mx-auto px-6 prose max-w-none" dangerouslySetInnerHTML={{ __html: cms.content }} />
          </section>
        )}

        {/* SECTION 1: WIS CONNECTION */}
        <section className="py-16 md:py-24 bg-white relative overflow-hidden">
          <div className="w-full max-w-[1200px] mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-16">

              {/* Left Side: Visual representation */}
              <ScrollReveal direction="left" distance={40} className="flex-1 w-full max-w-[500px]">
                <div className="relative">
                  {/* Decorative dot patterns */}
                  <div className="absolute -top-6 -left-6 w-24 h-24 bg-dots-pattern opacity-40" />
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-dots-pattern opacity-40" />

                  <div className="bg-surface shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative z-10">
                    <div className="relative w-full h-[360px] md:h-[480px] overflow-hidden">
                      <Image
                        src="/hero/Hero04.webp"
                        alt="WIS & Zeon Office Environment"
                        fill
                        sizes="100vw"
                        quality={100}
                        className="object-cover rounded-2xl md:rounded-l-3xl"
                      />
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Right Side: Text description */}
              <ScrollReveal direction="right" distance={40} className="flex-1">
                <span className="inline-block text-primary text-[0.85rem] font-bold mb-3 tracking-[0.2em] uppercase">
                  About Zeon Academy
                </span>
                <h2 className="text-[2rem] sm:text-[2.4rem] md:text-[2.7rem] font-extrabold text-heading leading-[1.18] mb-6">
                  Learn Digital Marketing. <br className="hidden sm:inline" />
                  Work on Real Projects. <br className="hidden sm:inline" />
                  <span className="text-primary">Build Your Career.</span>
                </h2>
                
                <div className="space-y-4 text-base md:text-[1rem] text-body leading-[1.7] font-medium mb-8">
                  <p>
                    ZEON Academy is a career-focused digital marketing training institute in Kochi, backed by the industry experience of Web India Branding &amp; Marketing Private Limited (WIS).
                  </p>
                  <p>
                    We go beyond classroom learning by combining practical training, industry insights, and hands-on experience to help students develop the skills needed to succeed in the digital marketing industry.
                  </p>
                  <p>
                    Our trainers are active industry professionals who bring real-world knowledge, practical strategies, and current industry practices into every learning session.
                  </p>
                  <p className="font-semibold text-heading pt-1">
                    At ZEON Academy, you don&apos;t just learn digital marketing — you learn how it works in the real world.
                  </p>
                </div>

                <div className="pt-5 border-t border-border/80">
                  <span className="block text-[0.8rem] font-black tracking-[0.18em] text-primary uppercase mb-4">
                    Key Highlights
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary shrink-0">
                        <FaCheck size={12} />
                      </div>
                      <span className="font-bold text-heading text-[0.92rem]">Industry-Experienced Trainers</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary shrink-0">
                        <FaCheck size={12} />
                      </div>
                      <span className="font-bold text-heading text-[0.92rem]">Practical, Hands-On Learning</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary shrink-0">
                        <FaCheck size={12} />
                      </div>
                      <span className="font-bold text-heading text-[0.92rem]">Real-World Project Exposure</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary shrink-0">
                        <FaCheck size={12} />
                      </div>
                      <span className="font-bold text-heading text-[0.92rem]">Career-Focused Training</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

            </div>
          </div>
        </section>

        {/* SECTION 2: OUR JOURNEY (Horizontal Pinned Timeline) */}
        <Timeline
          badge="OUR JOURNEY"
          title="Built to Bridge Learning and Industry."
          periodLabel="2019 — Present"
          imageUrl="/about/zeon-aboutus.jpeg"
          imageAlt="Zeon Academy Kochi Mentors & Students"
        />
        <TestimonialSection />

        {/* SECTION 3: OUR TEAM */}
        <section className="py-16 md:py-24 bg-surface bg-dots-pattern border-t border-border overflow-hidden">
          <div className="w-full max-w-[1200px] mx-auto px-6">
            <ScrollReveal direction="up" distance={30}>
              <div className="text-center mb-16 max-w-2xl mx-auto">
                <span className="inline-block text-primary text-[0.85rem] font-bold mb-3 tracking-[0.2em] uppercase">
                  Meet the Mentors
                </span>
                <h2 className="text-[2.2rem] md:text-[2.8rem] font-extrabold text-heading leading-tight mb-4">
                  Learn from Professionals Who <span className="text-primary">Do the Work.</span>
                </h2>
                <p className="text-[1.05rem] text-body leading-relaxed font-medium">
                  Our mentors bring professional experience and practical industry knowledge into the learning environment, helping students understand how digital marketing works beyond theory.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Mentor 1: Sreethu */}
              <ScrollReveal direction="up" distance={40} delay={0.1}>
                <div className="group relative bg-white border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:border-primary/30 transition-all duration-500 hover:-translate-y-2">
                  {/* Image Panel */}
                  <div className="relative h-[320px] w-full bg-gradient-to-br from-primary/10 via-[#fff1f1] to-primary/5 flex items-end justify-center overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute top-4 right-4 w-20 h-20 bg-primary/10 rounded-full blur-xl" />
                    <div className="absolute bottom-0 left-6 w-14 h-14 bg-primary/10 rounded-full blur-lg" />
                    <Image
                      src="/sreethu2.webp"
                      alt="Sreethu — Digital Marketing Specialist & Mentor"
                      width={280}
                      height={300}
                      className="object-contain object-bottom w-auto h-[300px] relative z-10 drop-shadow-lg"
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
                <div className="group relative bg-white border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:border-primary/30 transition-all duration-500 hover:-translate-y-2">
                  {/* Image Panel */}
                  <div className="relative h-[320px] w-full bg-gradient-to-br from-primary/10 via-[#fff1f1] to-primary/5 flex items-end justify-center overflow-hidden">
                    <div className="absolute top-4 right-4 w-20 h-20 bg-primary/10 rounded-full blur-xl" />
                    <div className="absolute bottom-0 left-6 w-14 h-14 bg-primary/10 rounded-full blur-lg" />
                    <Image
                      src="/Jayakrishnan.webp"
                      alt="Jayakrishnan — Performance Marketing Specialist & Mentor"
                      width={280}
                      height={300}
                      className="object-contain object-bottom w-auto h-[300px] relative z-10 drop-shadow-lg"
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

              {/* Mentor 3: Abhijith R */}
              <ScrollReveal direction="up" distance={40} delay={0.3}>
                <div className="group relative bg-white border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:border-primary/30 transition-all duration-500 hover:-translate-y-2">
                  {/* Image Panel */}
                  <div className="relative h-[320px] w-full bg-gradient-to-br from-primary/10 via-[#fff1f1] to-primary/5 flex items-end justify-center overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute top-4 right-4 w-20 h-20 bg-primary/10 rounded-full blur-xl" />
                    <div className="absolute bottom-0 left-6 w-14 h-14 bg-primary/10 rounded-full blur-lg" />
                    <Image
                      src="/Abhijith-R.webp"
                      alt="Abhijith R — Digital Marketing Trainer"
                      width={280}
                      height={300}
                      className="object-contain object-bottom w-auto h-[300px] relative z-10 drop-shadow-lg"
                      sizes="280px"
                    />
                  </div>
                  {/* Info Panel */}
                  <div className="px-6 py-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-[1.4rem] font-extrabold text-heading leading-tight">
                          Abhijith R
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
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <BottomCtaBanner
          badge="LAUNCH YOUR CAREER"
          headingMain="READY TO TAKE YOUR FIRST STEP INTO"
          headingSub="DIGITAL MARKETING?"
          description="Explore our training programmes, discover the skills you can develop, and find the right starting point for your digital marketing journey."
          primaryText="Explore Our Courses →"
          primaryHref="/course"
          secondaryText="Book a Free Demo"
          secondaryHref="demo"
          statsBadge="100% Placement Support"
        />

        {/* FOOTER */}
        <Footer />
      </main>
    </>
  );
}
