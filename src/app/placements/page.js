import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { FaStar } from "react-icons/fa";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import OurPartners from "../../components/OurPartners";
import ScrollReveal from "../../components/ScrollReveal";
import PlacementsJobGrid from "../../components/PlacementsJobGrid";
import { buildPageMetadata } from "@/lib/pageSeo";
import { getApprovedJobs, mapJobToVacancy } from "@/lib/jobs";

const WhatsAppFloat = dynamic(() => import("../../components/WhatsAppFloat"));
const BookDemoModal = dynamic(() => import("../../components/BookDemoModal"));

export async function generateMetadata() {
  return buildPageMetadata("/placements");
}

export default async function PlacementsPage() {
  const approvedJobs = await getApprovedJobs();
  const vacancies = approvedJobs.map(mapJobToVacancy);

  return (
    <>
      <Navbar />
      <WhatsAppFloat />
      <BookDemoModal />

      <main className="bg-surface">

        {/* ── HERO BANNER ── */}
        <section className="relative pt-24 pb-16 md:pt-28 md:pb-24 bg-surface bg-grid-pattern overflow-hidden border-b border-border">
          <Image
            src="/courses/courss.webp"
            alt="Zeon Academy Courses Banner"
            fill
            priority
            className="object-cover object-center opacity-100 pointer-events-none"
          />
          <div className="absolute top-10 left-10 w-[200px] h-[200px] bg-primary/10 rounded-full blur-3xl z-0 animate-pulse-glow" />
          <div className="absolute -bottom-10 right-10 w-[250px] h-[250px] bg-[#ff8c4a]/10 rounded-full blur-3xl z-0 animate-pulse-glow" />

          <div className="w-full max-w-[1200px] mx-auto px-6 relative z-10 text-center animate-fade-in-up">
            <div className="flex items-center justify-center gap-2.5 text-[0.88rem] font-semibold text-body mb-5">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <span className="text-border">/</span>
              <span className="text-primary font-bold">Placement Cell</span>
            </div>

            <div className="max-w-3xl mx-auto">
              <span className="inline-block text-primary text-[0.85rem] font-semibold mb-4 tracking-[0.2em] uppercase">
                Placement Cell
              </span>
              <h1 className="text-[clamp(2.5rem,5vw,3.6rem)] font-extrabold leading-[1.15] text-heading mb-6 tracking-tight">
                Job Vacancies for{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#ff4a4a] to-[#ff8c4a] drop-shadow-sm">
                  Digital Marketing
                </span>{" "}
                in Kerala
              </h1>
              <p className="text-[1.15rem] text-body leading-relaxed font-medium max-w-2xl mx-auto mb-8">
                Live job openings sourced exclusively for Zeon Academy students and alumni. Apply directly through WhatsApp — our placement cell is here to connect you with top companies.
              </p>

              <div className="flex items-center justify-center gap-1.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-[#fbbf24] text-xl" />
                ))}
              </div>
              <p className="text-body text-[0.9rem] font-semibold">
                Rated 4.9 on Google — Kerala's Most Loved Digital Marketing Institute
              </p>
            </div>
          </div>
        </section>

        {/* ── STATS STRIP ── */}
        <section className="bg-surface border-b border-border py-8">
          <div className="w-full max-w-[1200px] mx-auto px-6">
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              {[
                { value: `${vacancies.length}${vacancies.length > 0 ? '+' : ''}`, label: "Active Openings" },
                { value: "100+", label: "Hiring Partners" },
                { value: "Kerala", label: "& Beyond" },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-[2rem] font-extrabold text-heading leading-none mb-1">{s.value}</p>
                  <p className="text-[0.88rem] font-semibold text-body">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── JOB LISTINGS ── */}
        <section className="py-14 md:py-20">
          <div className="w-full max-w-[1200px] mx-auto px-6">
            <ScrollReveal direction="up" distance={20}>
              <div className="text-center mb-12">
                <span className="inline-block text-primary text-[0.85rem] font-semibold mb-3 tracking-[0.2em] uppercase">
                  Current Openings
                </span>
                <h2 className="text-[clamp(1.8rem,3.5vw,2.6rem)] font-extrabold text-heading mb-3 leading-tight">
                  Hiring Now — <span className="text-primary">Apply Today</span>
                </h2>
                <p className="text-[1.05rem] text-body font-medium max-w-xl mx-auto">
                  All positions are exclusively curated for Zeon Academy students and alumni. Click "Apply Now" to reach out instantly via WhatsApp.
                </p>
              </div>
            </ScrollReveal>

            <PlacementsJobGrid jobs={vacancies} />
          </div>
        </section>

        <OurPartners />

        <section className="py-16 bg-surface border-t border-border">
          <div className="w-full max-w-[900px] mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-[#fbbf24] text-lg" />
              ))}
            </div>
            <h2 className="text-[1.8rem] md:text-[2.2rem] font-extrabold text-heading mb-4">
              Ready to Land Your <span className="text-primary">Dream Job?</span>
            </h2>
            <p className="text-[1.05rem] text-body font-medium leading-relaxed mb-8 max-w-xl mx-auto">
              Join Zeon Academy and get direct access to our placement cell, 100+ hiring partners, and job-ready training.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/#apply"
                className="px-8 py-4 bg-primary text-white font-bold text-[1rem] rounded-full shadow-glow hover:bg-primary-hover hover:shadow-glow-hover hover:-translate-y-0.5 transition-all duration-300"
              >
                Book Free Demo
              </Link>
              <Link
                href="/courses"
                className="px-8 py-4 border-2 border-border text-heading font-bold text-[1rem] rounded-full hover:border-primary hover:text-primary transition-all duration-300"
              >
                Explore Courses
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
