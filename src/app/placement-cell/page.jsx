import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { FaStar } from "react-icons/fa";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import OurPartners from "../../components/OurPartners";
import ScrollReveal from "../../components/ScrollReveal";
import PlacementsJobGrid from "../../components/PlacementsJobGrid";
import { buildPageMetadata, getPageCms } from "@/lib/pageSeo";
import { INNER_PAGE } from "@/lib/designLanguage";
import { getApprovedJobs, mapJobToVacancy } from "@/lib/jobs";

const WhatsAppFloat = dynamic(() => import("../../components/WhatsAppFloat"));
const BookDemoModal = dynamic(() => import("../../components/BookDemoModal"));
import BottomCtaBanner from "@/components/BottomCtaBanner";

export async function generateMetadata() {
  return buildPageMetadata("/placement-cell");
}

export default async function PlacementsPage() {
  const [approvedJobs, cms] = await Promise.all([
    getApprovedJobs(),
    getPageCms("/placement-cell"),
  ]);
  const vacancies = approvedJobs.map(mapJobToVacancy);
  const bannerImage = cms?.bannerImage || "/banner-white.svg";

  return (
    <>
      <Navbar />
      <WhatsAppFloat />
      <BookDemoModal />

      <main className="bg-surface">

        {/* ── HERO BANNER ── */}
        <section className={INNER_PAGE.heroSection}>
          <Image
            src={bannerImage}
            alt="Zeon Academy Placements Banner"
            fill
            priority
            className={INNER_PAGE.heroBannerClass}
          />
          <div className={INNER_PAGE.heroOverlay} />

          <div className={INNER_PAGE.heroContent}>
            <div className={INNER_PAGE.heroInner}>
              <div className={INNER_PAGE.breadcrumb}>
                <Link href="/" className={INNER_PAGE.breadcrumbLink}>Home</Link>
                <span className={INNER_PAGE.breadcrumbSep}>/</span>
                <span className={INNER_PAGE.breadcrumbCurrent}>Placement Cell</span>
              </div>

              <span className={INNER_PAGE.tagline}>Placement Cell</span>
              <h1 className={INNER_PAGE.title}>
                Job Vacancies for{" "}
                <span className="text-primary">Digital Marketing</span> in Kerala
              </h1>
              <p className={INNER_PAGE.subtitle}>
                Live job openings sourced exclusively for Zeon Academy students and alumni. Apply directly through WhatsApp — our placement cell is here to connect you with top companies.
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

        <BottomCtaBanner
          badge="PLACEMENT CELL"
          headingMain="READY TO LAND YOUR"
          headingSub="DREAM JOB?"
          description="Join Zeon Academy and get direct access to our active placement cell, 100+ hiring partners, and agency-level practical portfolio."
          primaryText="Book Free Demo"
          secondaryText="Explore Courses"
          secondaryHref="/course"
          statsBadge="100+ Hiring Partners"
        />
      </main>

      <Footer />
    </>
  );
}
