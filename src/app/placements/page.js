import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { FaMapMarkerAlt, FaBriefcase, FaBuilding, FaArrowRight, FaStar } from "react-icons/fa";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import OurPartners from "../../components/OurPartners";
import ScrollReveal from "../../components/ScrollReveal";

const WhatsAppFloat = dynamic(() => import("../../components/WhatsAppFloat"));
const BookDemoModal = dynamic(() => import("../../components/BookDemoModal"));

export const metadata = {
  title: "Job Vacancies | Digital Marketing Jobs in Kerala | Zeon Academy Placement Cell",
  description: "Explore live digital marketing job vacancies in Kerala through Zeon Academy's Placement Cell. Find openings in Kochi, Ernakulam, and across Kerala for freshers and experienced professionals.",
  alternates: {
    canonical: "/placements",
  },
};

const vacancies = [
  {
    title: "Video Editor & Social Media Content Creator",
    location: "Kaloor, Kochi",
    company: "PepeBBQ",
    description: "PepeBBQ is a leading brand specializing in premium BBQ grills, accessories, and outdoor cooking solutions designed for both commercial and home use.",
  },
  {
    title: "Digital Marketing Intern",
    location: "Kochi, Kerala",
    company: "Find My Hostel",
    description: "Find My Hostel is a Kochi-based platform dedicated to helping students and working professionals find the perfect accommodation.",
  },
  {
    title: "Digital Marketing Trainee",
    location: "Aluva, Kochi",
    company: "Indo-European Institute of Engineering",
    description: "Indo European Institute of Engineering (IEIE), located in Aluva, Kochi, is a leading technical education and skill development institution.",
  },
  {
    title: "Digital Marketing Interns",
    location: "Panampilly Nagar, Kochi",
    company: "Peraka Media",
    description: "We are looking for enthusiastic and creative Digital Marketing Interns to join our team.",
  },
  {
    title: "Social Media and Digital Marketing Intern",
    location: "Kochi, Kerala",
    company: "Capsdata Technologies",
    description: "Capsdata Technologies is a fast-growing IT and digital solutions company based in Kochi.",
  },
  {
    title: "Marketing Executive",
    location: "Kochi, Kerala",
    company: "Ye Stack",
    description: "YE Stack is a Kochi-based technology and digital solutions company.",
  },
  {
    title: "Video Editor",
    location: "Palarivattom",
    company: "Ishkhan Aviation Academy",
    description: "Ishkhan Aviation Academy is seeking a creative and skilled Video Editor to join our team.",
  },
  {
    title: "Digital Marketing Intern",
    location: "Kakkanad",
    company: "Global Visa Online",
    description: "Global Visa Online is a professional consultancy firm providing reliable and efficient visa and immigration services worldwide.",
  },
  {
    title: "Content Creator",
    location: "Kochi",
    company: "Evolux Solutions",
    description: "Evolux Solutions is a digital marketing company based in Kochi.",
  },
  {
    title: "Digital Marketing Trainee",
    location: "Ernakulam",
    company: "Adox Global Pvt. Ltd.",
    description: "Adox Global Pvt Ltd is a leading digital marketing agency dedicated to delivering innovative online marketing solutions. With expertise in Digital Marketing, Social Media Management, SEO, and Web Development.",
  },
  {
    title: "Digital Marketing",
    location: "Kochi",
    company: "Neuflo Solutions",
    description: "Neuflo Solutions is a dynamic digital marketing and technology firm specializing in Meta Ads Management, Google Ads Campaigns, and SEO Optimization.",
  },
  {
    title: "Digital Marketing Intern",
    location: "Kaloor, Ernakulam",
    company: "Classic Digital Solutions",
    description: "Classic Digital Solutions is a results-driven digital marketing agency committed to helping businesses grow online through innovative strategies and impactful campaigns.",
  },
  {
    title: "Digital Marketer",
    location: "Edappally",
    company: "Whitesean Tv News",
    description: "Whitesean Tv News, a growing digital news and media company based in Edappally, is seeking a full-time Digital Marketer.",
  },
  {
    title: "Digital Marketer",
    location: "Ernakulam",
    company: "Ialm Edge",
    description: "Ialm Edge, a leading training and learning institute based in Ernakulum, is seeking a full-time Digital Marketer to join our innovative team.",
  },
  {
    title: "Digital Marketing Manager",
    location: "Nalleppilly, Palakkad",
    company: "Thanima Farm Life",
    description: "The goal of this position is to lead the digital marketing function at Thanima Farm Life Pvt. Ltd.",
  },
  {
    title: "Digital Marketing Intern",
    location: "Kakkanad, Ernakulam",
    company: "Vr Digitals",
    description: "Vr Digitals, a digital marketing and development company, is seeking a full-time fresher digital marketer.",
  },
  {
    title: "Digital Marketing Executive",
    location: "Alappuzha",
    company: "Jinu's Academy",
    description: "Jinu's Academy, a leading educational institution based in Alappuzha, is looking for a passionate and creative Digital Marketing Executive to join our team.",
  },
  {
    title: "Digital Marketing Intern",
    location: "Maradu, Ernakulam",
    company: "Infinity Ideas",
    description: "We are seeking a motivated and creative Digital Marketing Intern to join our team. This internship is a great opportunity to gain hands-on experience in online marketing, advertising campaigns, and brand building.",
  },
  {
    title: "Digital Marketer",
    location: "Kochi, Kerala",
    company: "Team Ynes",
    description: "Team Ynes, a digital marketing and development company based in Kochi, is seeking a full-time Digital Marketer.",
  },
  {
    title: "Digital Marketer",
    location: "Kakkanad",
    company: "Black Onyx International LLC",
    description: "Black Onyx International LLC, a leading recruiting firm with over 15 years of experience, is seeking a Digital Marketer.",
  },
  {
    title: "Digital Marketing Intern",
    location: "Bangalore",
    company: "Oppiatec Consulting",
    description: "Oppiatec Consulting Pvt. Ltd is a global recruitment firm offering seamless placement services.",
  },
  {
    title: "Digital Marketing Executive",
    location: "Kozhikode, Kerala",
    company: "Meckavo Sports and Infra Pvt",
    description: "Meckavo Sports and Infra Pvt is looking for a passionate and results-driven Digital Marketing Executive with 1 year of experience.",
  },
  {
    title: "Digital Marketing Specialist",
    location: "Kaloor, Kochi",
    company: "Edbe",
    description: "Edbe – Experts in Global Education is a leading study abroad consultancy based in Kochi, Kerala. Head office in the UK.",
  },
  {
    title: "Digital Marketing",
    location: "Thodupuzha, Idukki",
    company: "Vintage Events Pvt Ltd",
    description: "Vintage Events PVT LTD, a leading event management company, is seeking a talented Digital Marketing Specialist.",
  },
  {
    title: "Digital Marketer",
    location: "Edappally, Kochi",
    company: "MAAD Concepts",
    description: "MAAD Concepts, an Architectural and Interior Designing firm based in Kochi, is seeking a talented Digital Marketer.",
  },
  {
    title: "Digital Marketing Executive",
    location: "Kakkanad, Kochi",
    company: "Techrish",
    description: "We're hiring a full-time Digital Marketing Executive to drive growth across the UAE, Qatar, Saudi Arabia, Europe, and Africa.",
  },
  {
    title: "Online Sales Personnel",
    location: "Vazhakulam, Kochi",
    company: "Maharajas Textiles",
    description: "A well-established retail showroom in Vazhakulam, specializing in a variety of textiles is looking for candidates for part-time/full-time online sales.",
  },
];

const WHATSAPP_PHONE = "917558888252";

function buildApplyUrl(title, company) {
  const msg = `Hi! I'd like to apply for the *${title}* position at *${company}* listed on Zeon Academy's Placement Cell. Could you please share more details?`;
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
}

export default function PlacementsPage() {
  return (
    <>
      <Navbar />
      <WhatsAppFloat />
      <BookDemoModal />

      <main className="bg-surface">

        {/* ── HERO BANNER ── */}
        <section className="relative pt-24 pb-16 md:pt-28 md:pb-24 bg-surface bg-grid-pattern overflow-hidden border-b border-border">
          <Image
            src="/courses/cour.webp"
            alt="Zeon Academy Courses Banner"
            fill
            priority
            className="object-cover object-center opacity-100 pointer-events-none"
          />
          {/* Decorative orbs */}
          <div className="absolute top-10 left-10 w-[200px] h-[200px] bg-primary/10 rounded-full blur-3xl z-0 animate-pulse-glow" />
          <div className="absolute -bottom-10 right-10 w-[250px] h-[250px] bg-[#ff8c4a]/10 rounded-full blur-3xl z-0 animate-pulse-glow" />

          <div className="w-full max-w-[1200px] mx-auto px-6 relative z-10 text-center animate-fade-in-up">
            {/* Breadcrumb */}
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
                { value: `${vacancies.length}+`, label: "Active Openings" },
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

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {vacancies.map((job, idx) => (
                <ScrollReveal key={idx} direction="up" distance={30} delay={idx * 0.03}>
                  <div className="group bg-white border border-border rounded-2xl p-6 shadow-card hover:shadow-card-hover hover:border-primary/25 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative overflow-hidden">
                    {/* Top accent */}
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary/60 via-primary to-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Role badge */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <FaBriefcase className="text-primary text-[0.95rem]" />
                      </div>
                      <span className="inline-block text-[0.7rem] font-bold text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full whitespace-nowrap">
                        🟢 Hiring
                      </span>
                    </div>

                    {/* Job title */}
                    <h3 className="text-[1.05rem] font-extrabold text-heading leading-snug mb-2 group-hover:text-primary transition-colors duration-200">
                      {job.title}
                    </h3>

                    {/* Company */}
                    <div className="flex items-center gap-1.5 text-[0.85rem] font-semibold text-body mb-1">
                      <FaBuilding className="text-primary/70 shrink-0 text-[0.8rem]" />
                      {job.company}
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-[0.82rem] font-medium text-body/70 mb-4">
                      <FaMapMarkerAlt className="text-primary/60 shrink-0 text-[0.78rem]" />
                      {job.location}
                    </div>

                    {/* Description */}
                    <p className="text-[0.88rem] text-body leading-relaxed font-medium flex-1 mb-5 line-clamp-3">
                      {job.description}
                    </p>

                    {/* Apply CTA */}
                    <a
                      href={buildApplyUrl(job.title, job.company)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-bold text-[0.9rem] text-white bg-primary hover:bg-primary-hover shadow-glow hover:shadow-glow-hover hover:-translate-y-0.5 transition-all duration-200"
                    >
                      Apply Now
                      <FaArrowRight className="text-[0.75rem]" />
                    </a>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── HIRING PARTNERS MARQUEE ── */}
        <OurPartners />

        {/* ── CTA ── */}
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
