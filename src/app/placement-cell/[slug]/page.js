import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import {
  FaMapMarkerAlt,
  FaClock,
  FaBriefcase,
  FaPhoneAlt,
  FaWhatsapp,
  FaArrowRight,
  FaExternalLinkAlt,
  FaCheckCircle,
} from "react-icons/fa";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQAccordion from "@/components/FAQAccordion";
import ScrollReveal from "@/components/ScrollReveal";
import ApplyEasyForm from "@/components/ApplyEasyForm";
import BlogContent from "@/components/BlogContent";
import { getJobBySlug, getApprovedJobs, mapJobToVacancy, getAllApprovedJobSlugs } from "@/lib/jobs";
import { getPublishedPageBySlug } from "@/lib/pages";
import { INNER_PAGE, COURSE_CARD_BUTTON_THEME } from "@/lib/designLanguage";

const WhatsAppFloat = dynamic(() => import("@/components/WhatsAppFloat"));
const BookDemoModal = dynamic(() => import("@/components/BookDemoModal"));

export const dynamicParams = true;
export const revalidate = 60;

const WHATSAPP_COORDINATOR = "917558888252";

function buildVacancyApplyUrl(title, company, phone) {
  const targetPhone = phone ? phone.replace(/[^0-9]/g, "") : WHATSAPP_COORDINATOR;
  const msg = `Hi! I would like to apply for the *${title}* position at *${company}* listed on Zeon Academy's Placement Cell. Please let me know the next steps.`;
  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(msg)}`;
}

function parseBulletList(text) {
  if (!text) return [];
  return text
    .split("\n")
    .map((line) => line.trim().replace(/^[•*\-\d.]+\s*/, "").trim())
    .filter((line) => line.length > 2);
}

export async function generateStaticParams() {
  const slugs = await getAllApprovedJobSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (job) {
    const title = `${job.jobTitle} at ${job.companyName} | Placement Cell | Zeon Academy`;
    const description =
      job.aboutCompany ||
      `Exciting vacancy for ${job.jobTitle} at ${job.companyName} in ${job.location || "Kerala"}. Apply now through Zeon Academy Placement Cell.`;

    return {
      title,
      description,
      alternates: { canonical: `/placement-cell/${job.slug || slug}` },
      openGraph: {
        title,
        description,
        images: job.companyLogo ? [{ url: job.companyLogo }] : [{ url: "/banner-white.svg" }],
      },
    };
  }

  // Fallback to legacy page CMS
  const page = await getPublishedPageBySlug(slug);
  if (!page) return { title: "Job Vacancy Not Found | Zeon Academy" };

  const title = page.seoTitle || page.title;
  return {
    title: `${title} | Placement Cell | Zeon Academy`,
    description: page.seoDescription || page.excerpt || undefined,
    alternates: { canonical: `/placement-cell/${page.slug}` },
  };
}

export default async function PlacementJobInnerPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const [job, allJobs] = await Promise.all([
    getJobBySlug(slug),
    getApprovedJobs(),
  ]);

  // If not found in JobPosting, check legacy Page model as fallback
  if (!job) {
    const page = await getPublishedPageBySlug(slug);
    if (!page) {
      notFound();
    }
    return (
      <>
        <Navbar />
        <WhatsAppFloat />
        <BookDemoModal />
        <main className="bg-surface pb-20">
          <section className={INNER_PAGE.heroSection}>
            <Image
              src="/banner-white.svg"
              alt={page.title}
              sizes="100vw"
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
                  <Link href="/placement-cell" className={INNER_PAGE.breadcrumbLink}>Placement Cell</Link>
                  <span className={INNER_PAGE.breadcrumbSep}>/</span>
                  <span className={INNER_PAGE.breadcrumbCurrent}>{page.title}</span>
                </nav>
                <h1 className={INNER_PAGE.title}>{page.title}</h1>
                {page.excerpt && <p className={INNER_PAGE.subtitle}>{page.excerpt}</p>}
              </div>
            </div>
          </section>
          <section className="py-12 md:py-16 bg-white">
            <BlogContent content={page.content} />
          </section>
        </main>
        <Footer />
      </>
    );
  }

  const responsibilitiesList = parseBulletList(job.responsibilities);
  const skillsList = parseBulletList(job.skillsRequired);
  const eligibilityList = parseBulletList(job.eligibility);

  const applyUrl = buildVacancyApplyUrl(job.jobTitle, job.companyName, job.phone);

  const otherJobs = allJobs
    .filter((j) => j.id !== job.id)
    .slice(0, 3)
    .map(mapJobToVacancy);

  const placementFaqs = [
    {
      question: "How do I apply for this position?",
      answer: `You can click "Apply via WhatsApp" to connect directly with the hiring team or Zeon Academy's Placement Cell. Alternatively, submit your details in the contact form, and our placement coordinator will assist you with scheduling an interview.`,
    },
    {
      question: "Who is eligible to apply through Zeon Placement Cell?",
      answer: `Zeon Academy students, alumni, and candidates with relevant digital marketing training or practical experience who meet the criteria listed under Eligibility & Qualifications can apply.`,
    },
    {
      question: "Does Zeon Academy charge any fee for placement assistance?",
      answer: "No. Zeon Academy provides 100% free placement assistance and job interview coordination to all its enrolled students and alumni.",
    },
    {
      question: "Will Zeon Academy help with interview preparation?",
      answer: "Yes. Our placement cell conducts mock interviews, resume refinement sessions, and portfolio reviews to ensure you perform at your best during the company interview.",
    },
  ];

  return (
    <>
      <Navbar />
      <WhatsAppFloat />
      <BookDemoModal />

      <main className="bg-surface pb-20">

        {/* ── HEADER HERO ── */}
        <section className={INNER_PAGE.heroSection}>
          <Image
            src="/banner-white.svg"
            alt={`${job.jobTitle} at ${job.companyName}`}
            sizes="100vw"
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
                <Link href="/placement-cell" className={INNER_PAGE.breadcrumbLink}>Placement Cell</Link>
                <span className={INNER_PAGE.breadcrumbSep}>/</span>
                <span className={INNER_PAGE.breadcrumbCurrent}>{job.jobTitle}</span>
              </nav>

              <h1 className="text-[clamp(1.85rem,4vw,2.5rem)] font-bold text-heading leading-[1.2] mb-3 tracking-tight">
                {job.jobTitle}
              </h1>

              <p className="text-[1.1rem] md:text-[1.2rem] font-medium text-body/90 mb-5">
                at <span className="font-semibold text-heading">{job.companyName}</span>
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2.5 text-[0.88rem] text-body">
                {job.location && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-border font-medium text-heading">
                    <FaMapMarkerAlt className="text-primary text-xs" />
                    {job.location}
                  </span>
                )}
                {job.jobTypes && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-border font-medium text-heading">
                    <FaBriefcase className="text-primary text-xs" />
                    {job.jobTypes}
                  </span>
                )}
                {job.shiftSchedule && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-border font-medium text-heading">
                    <FaClock className="text-primary text-xs" />
                    {job.shiftSchedule}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── MAIN CONTENT AREA (2-Column Grid) ── */}
        <section className="py-12 md:py-16 relative">
          <div className="w-full max-w-[1200px] mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-10">

              {/* ── LEFT COLUMN - CONTENT ── */}
              <div className="flex-1 lg:w-2/3">

                {/* Job Description */}
                <ScrollReveal direction="up" distance={25}>
                  <div className="mb-10">
                    <h2 className="text-[1.5rem] font-bold text-heading mb-4">About the Role</h2>
                    <div className="text-[1rem] text-body leading-relaxed space-y-4 font-normal">
                      <p>
                        {job.aboutCompany ||
                          `${job.companyName} is looking for a qualified ${job.jobTitle} to join their team in ${job.location || "Kerala"}. Review the responsibilities and requirements below to apply.`}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Key Responsibilities */}
                {responsibilitiesList.length > 0 && (
                  <ScrollReveal direction="up" distance={25}>
                    <div className="mb-10">
                      <h2 className="text-[1.5rem] font-bold text-heading mb-4">Key Responsibilities</h2>
                      <ul className="space-y-3.5">
                        {responsibilitiesList.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3.5 text-body text-[0.98rem] leading-relaxed">
                            <span className="w-2 h-2 rounded-full bg-black mt-2 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </ScrollReveal>
                )}

                {/* Required Skills - Only keep this inside card on left side */}
                {skillsList.length > 0 && (
                  <ScrollReveal direction="up" distance={25}>
                    <div className={`${INNER_PAGE.card} p-6 md:p-8 mb-10`}>
                      <h2 className="text-[1.5rem] font-bold text-heading mb-5">Required Skills & Tools</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3.5 gap-x-6">
                        {skillsList.map((skill, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <FaCheckCircle className="text-blue-600 mt-1 shrink-0 text-[1.05rem]" />
                            <span className="text-body font-medium leading-relaxed text-[0.98rem]">{skill}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>
                )}

                {/* Qualifications & Eligibility */}
                {eligibilityList.length > 0 && (
                  <ScrollReveal direction="up" distance={25}>
                    <div className="mb-10">
                      <h2 className="text-[1.5rem] font-bold text-heading mb-4">Eligibility & Qualifications</h2>
                      <ul className="space-y-3">
                        {eligibilityList.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3.5 text-body text-[0.98rem] leading-relaxed">
                            <span className="w-2 h-2 rounded-full bg-black mt-2 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </ScrollReveal>
                )}

                {/* Zeon Placement Cell Assistance Note */}
                <ScrollReveal direction="up" distance={25}>
                  <div className="bg-surface border border-border border-l-4 border-l-primary rounded-2xl p-6 md:p-7 mb-10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-[1.1rem] font-bold text-heading mb-1">
                          Zeon Placement Cell Assistance
                        </h3>
                        <p className="text-[0.9rem] text-body leading-relaxed">
                          Need interview preparation or portfolio guidance for this role? Our placement mentors assist enrolled students and alumni with resume refinement and direct hiring connections.
                        </p>
                      </div>
                      <Link
                        href="/#admission"
                        className="shrink-0 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-[0.88rem] font-semibold rounded-xl shadow-glow hover:shadow-glow-hover transition-all cursor-pointer text-center inline-block"
                      >
                        Request Guidance
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Placement FAQs */}
                <ScrollReveal direction="up" distance={25}>
                  <div className="mb-10">
                    <h2 className="text-[1.5rem] font-bold text-heading mb-6">Frequently Asked Questions</h2>
                    <FAQAccordion faqs={placementFaqs} />
                  </div>
                </ScrollReveal>

              </div>

              {/* ── RIGHT COLUMN - SIDEBAR ── */}
              <div className="w-full lg:w-1/3 lg:max-w-[380px]">
                <div className="space-y-6">

                  {/* Vacancy Summary Card */}
                  <div className={`${INNER_PAGE.card} p-6`}>
                    {/* Company Header */}
                    <div className="mb-5 pb-5 border-b border-border">
                      {job.companyLogo ? (
                        <div className="w-16 h-16 rounded-xl border border-border bg-white p-2 mb-3 flex items-center justify-center overflow-hidden">
                          <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-contain" />
                        </div>
                      ) : null}
                      <h3 className="font-bold text-[1.2rem] text-heading leading-tight">{job.companyName}</h3>
                      <p className="text-[0.82rem] font-semibold text-primary mt-1">Verified Hiring Partner</p>
                    </div>

                    {/* Metadata Details */}
                    <div className="space-y-4 mb-6">
                      <div className="flex items-start gap-3">
                        <FaMapMarkerAlt className="text-primary mt-1 shrink-0 text-sm" />
                        <div>
                          <span className="block text-[0.72rem] uppercase font-semibold text-body/60 tracking-wider">Location</span>
                          <span className="text-heading font-medium text-[0.92rem]">{job.location || "Kochi, Kerala"}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <FaClock className="text-primary mt-1 shrink-0 text-sm" />
                        <div>
                          <span className="block text-[0.72rem] uppercase font-semibold text-body/60 tracking-wider">Working Hours</span>
                          <span className="text-heading font-medium text-[0.92rem]">{job.shiftSchedule || "Day Shift"}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <FaBriefcase className="text-primary mt-1 shrink-0 text-sm" />
                        <div>
                          <span className="block text-[0.72rem] uppercase font-semibold text-body/60 tracking-wider">Job Type</span>
                          <span className="text-heading font-medium text-[0.92rem]">{job.jobTypes || "Full-time"}</span>
                        </div>
                      </div>

                      {job.phone && (
                        <div className="flex items-start gap-3">
                          <FaPhoneAlt className="text-primary mt-1 shrink-0 text-sm" />
                          <div>
                            <span className="block text-[0.72rem] uppercase font-semibold text-body/60 tracking-wider">Contact Phone</span>
                            <a href={`tel:+91${job.phone.replace(/[^0-9]/g, "")}`} className="text-heading font-medium text-[0.92rem] hover:text-primary transition-colors">
                              {job.phone}
                            </a>
                          </div>
                        </div>
                      )}

                      {job.sourceUrl && (
                        <div className="flex items-start gap-3">
                          <FaExternalLinkAlt className="text-primary mt-1 shrink-0 text-sm" />
                          <div>
                            <span className="block text-[0.72rem] uppercase font-semibold text-body/60 tracking-wider">Original Job Page</span>
                            <span className="text-heading font-medium text-[0.92rem] break-all">{job.sourceUrl}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Apply Actions */}
                    <div className="space-y-2.5 pt-2">
                      <a
                        href={applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-[0.95rem] shadow-[0_4px_14px_rgba(37,211,102,0.35)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.45)] hover:-translate-y-0.5 transition-all"
                      >
                        <FaWhatsapp className="text-lg" />
                        Apply via WhatsApp
                      </a>
                      {job.phone && (
                        <a
                          href={`tel:+91${job.phone.replace(/[^0-9]/g, "")}`}
                          className={`flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl font-bold text-[0.88rem] transition-all duration-200 bg-transparent border-2 border-black/50 text-heading ${COURSE_CARD_BUTTON_THEME.btnDetails}`}
                        >
                          <FaPhoneAlt className="text-xs transition-colors" />
                          Call HR Directly
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Sticky Apply Easy Form */}
                  <div className="sticky top-28">
                    <ApplyEasyForm
                      jobTitle={job.jobTitle}
                      companyName={job.companyName}
                      jobSlug={job.slug || slug}
                    />
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── MORE JOB OPENINGS ── */}
        {otherJobs.length > 0 && (
          <section className="py-16 bg-white border-t border-border">
            <div className="w-full max-w-[1200px] mx-auto px-6">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <span className="inline-block text-primary text-[0.82rem] font-semibold mb-1 tracking-[0.15em] uppercase">
                    More Opportunities
                  </span>
                  <h2 className="text-[1.65rem] font-bold text-heading">
                    Other Job Vacancies
                  </h2>
                </div>
                <Link
                  href="/placement-cell"
                  className="hidden md:inline-flex items-center gap-2 text-primary font-semibold text-[0.92rem] hover:gap-3 transition-all"
                >
                  View all openings <FaArrowRight className="text-xs" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {otherJobs.map((item, idx) => (
                  <Link
                    key={item.id || idx}
                    href={`/placement-cell/${item.slug || item.id}`}
                    className={`group ${INNER_PAGE.card} p-5 hover:-translate-y-0.5 flex flex-col`}
                  >
                    <div className="text-[0.75rem] uppercase font-semibold text-[#333333] tracking-wider mb-2">
                      {item.company}
                    </div>

                    <h3 className="text-[1.05rem] font-bold text-heading leading-snug mb-2">
                      {item.title}
                    </h3>

                    <p className="text-[0.82rem] text-primary mb-3 flex items-center gap-1.5 font-medium">
                      <FaMapMarkerAlt className="text-primary text-[0.75rem]" />
                      {item.location}
                    </p>

                    <p className="text-[0.85rem] text-body font-normal line-clamp-2 mb-4 flex-1">
                      {item.description}
                    </p>

                    <div className="mt-auto flex items-center text-[0.85rem] font-semibold text-heading group-hover:text-primary transition-colors">
                      View Position <FaArrowRight className="ml-1.5 text-xs group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>

              <div className="text-center mt-8 md:hidden">
                <Link
                  href="/placement-cell"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-heading font-semibold text-[0.9rem] rounded-xl"
                >
                  View all openings <FaArrowRight className="text-xs" />
                </Link>
              </div>
            </div>
          </section>
        )}

      </main>

      <Footer />
    </>
  );
}
