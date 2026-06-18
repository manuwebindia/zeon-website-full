import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  FaPhoneAlt,
  FaCheck,
  FaMapMarkerAlt,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaBriefcase,
} from "react-icons/fa";
import { FiClock, FiMonitor } from "react-icons/fi";
import Navbar from "../../components/Navbar";
import ScrollReveal from "../../components/ScrollReveal";

const WhatsAppFloat = dynamic(() => import("../../components/WhatsAppFloat"));
const LegalButtons = dynamic(() => import("../../components/LegalButtons"));

export const metadata = {
  title: "About Us | Zeon Academy Kochi",
  description: "Learn about Zeon Academy, the leading digital marketing training institute in Kochi, Kerala. An offshoot of Web India Solutions (WIS) with 17+ years of experience.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <WhatsAppFloat />

      <main className="bg-white pt-20">
        {/* HERO BANNER */}
        <section className="relative py-16 md:py-24 bg-surface bg-grid-pattern overflow-hidden border-b border-border">
          {/* Orbs */}
          <div className="absolute top-10 left-10 w-[200px] h-[200px] bg-primary/10 rounded-full blur-3xl z-0 animate-pulse-glow" />
          <div className="absolute -bottom-10 right-10 w-[250px] h-[250px] bg-[#ff8c4a]/10 rounded-full blur-3xl z-0 animate-pulse-glow" />

          <div className="w-full max-w-[1200px] mx-auto px-6 relative z-10 text-center animate-fade-in-up">
            <span className="inline-block text-primary text-[0.85rem] font-semibold mb-5 tracking-[0.2em] uppercase">
              Who We Are
            </span>
            <h1 className="text-[clamp(2.5rem,5vw,3.6rem)] font-extrabold leading-[1.15] text-heading mb-6 tracking-tight">
              We Are Not An Ordinary <br className="hidden md:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#ff4a4a] to-[#ff8c4a] drop-shadow-sm">
                Digital Marketing Institute
              </span>
            </h1>
            <p className="text-[1.15rem] text-body leading-relaxed font-medium max-w-3xl mx-auto">
              Zeon Academy is an offshoot of Web India Solutions (WIS), a web development and digital marketing company with 17 years of experience in the business.
            </p>
          </div>
        </section>

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
                  
                  <div className="bg-surface border border-border p-6 rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative z-10">
                    <div className="relative w-full h-[320px] rounded-2xl overflow-hidden">
                      <Image
                        src="/live-demo.webp"
                        alt="WIS & Zeon Office Environment"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Right Side: Text description */}
              <ScrollReveal direction="right" distance={40} className="flex-1">
                <span className="inline-block text-primary text-[0.85rem] font-semibold mb-3 tracking-[0.2em] uppercase">
                  WIS & Zeon Academy
                </span>
                <h2 className="text-[2.2rem] md:text-[2.8rem] font-extrabold text-heading leading-[1.15] mb-6">
                  Studying is Inseparable from <br className="hidden sm:inline" />
                  <span className="text-primary">Working at WIS</span>
                </h2>
                <p className="text-base md:text-[1.05rem] text-body leading-[1.7] font-medium mb-6">
                  We are not an ordinary digital marketing training institute in Kochi. Zeon Academy stands out as it is an offshoot of Web India Solutions fondly known as <strong>WIS</strong>, a web development and digital marketing company with 17 years of experience in the business.
                </p>
                <p className="text-base md:text-[1.05rem] text-body leading-[1.7] font-medium mb-8">
                  Housed in the same building, studying at Zeon Academy is inseparable from working at WIS. All the faculty teaching are professional digital marketers of WIS.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary shrink-0">
                      <FaCheck size={12} />
                    </div>
                    <span className="font-bold text-heading text-[0.95rem]">Shared Agency Workspace</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary shrink-0">
                      <FaCheck size={12} />
                    </div>
                    <span className="font-bold text-heading text-[0.95rem]">Active Agency Mentors</span>
                  </div>
                </div>
              </ScrollReveal>

            </div>
          </div>
        </section>

        {/* SECTION 2: OUR JOURNEY (Timeline) */}
        <section className="py-16 md:py-24 bg-surface bg-dots-pattern border-y border-border">
          <div className="w-full max-w-[1200px] mx-auto px-6">
            <ScrollReveal direction="up" distance={30}>
              <div className="text-center mb-16 max-w-2xl mx-auto">
                <span className="inline-block text-primary text-[0.85rem] font-semibold mb-3 tracking-[0.2em] uppercase">
                  Our Timeline
                </span>
                <h2 className="text-[2.2rem] md:text-[2.8rem] font-extrabold text-heading leading-tight mb-4">
                  Established in <span className="text-primary">2019</span>
                </h2>
                <p className="text-[1.05rem] text-body leading-relaxed font-medium">
                  Meeting the growing need for digital marketing professionals with agency-level training.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <ScrollReveal direction="up" distance={40} delay={0.1}>
                <div className="bg-white border border-border/80 rounded-[20px] p-8 h-full transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-primary to-[#ff8c4a]" />
                  <div className="w-[50px] h-[50px] bg-primary-light rounded-xl flex items-center justify-center mb-6 text-primary text-[1.4rem]">
                    <FaBriefcase />
                  </div>
                  <h3 className="text-[1.25rem] font-extrabold text-heading mb-4">
                    2019: The Foundation
                  </h3>
                  <p className="text-[0.95rem] leading-relaxed text-body font-medium">
                    Established with an eye at the growing need of digital marketing freshers vacancies in many digital marketing companies in and around Kochi and Kerala. Initially started as a classroom program.
                  </p>
                </div>
              </ScrollReveal>

              {/* Card 2 */}
              <ScrollReveal direction="up" distance={40} delay={0.2}>
                <div className="bg-white border border-border/80 rounded-[20px] p-8 h-full transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-primary to-[#ff8c4a]" />
                  <div className="w-[50px] h-[50px] bg-primary-light rounded-xl flex items-center justify-center mb-6 text-primary text-[1.4rem]">
                    <FiMonitor />
                  </div>
                  <h3 className="text-[1.25rem] font-extrabold text-heading mb-4">
                    2020: Moving Online
                  </h3>
                  <p className="text-[0.95rem] leading-relaxed text-body font-medium">
                    We moved online in the wake of the pandemic, ensuring uninterrupted education and maintaining the same interactive, live learning environment for our trainees.
                  </p>
                </div>
              </ScrollReveal>

              {/* Card 3 */}
              <ScrollReveal direction="up" distance={40} delay={0.3}>
                <div className="bg-white border border-border/80 rounded-[20px] p-8 h-full transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-primary to-[#ff8c4a]" />
                  <div className="w-[50px] h-[50px] bg-primary-light rounded-xl flex items-center justify-center mb-6 text-primary text-[1.4rem]">
                    <FiClock />
                  </div>
                  <h3 className="text-[1.25rem] font-extrabold text-heading mb-4">
                    Today: Shift Extensions
                  </h3>
                  <p className="text-[0.95rem] leading-relaxed text-body font-medium">
                    A late evening session was later added due to growing demand from working professionals and businessmen looking to move up in their careers or improve their business prospects.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* SECTION 3: OUR TEAM */}
        <section className="py-16 md:py-24 bg-surface bg-dots-pattern border-t border-border overflow-hidden">
          <div className="w-full max-w-[1200px] mx-auto px-6">
            <ScrollReveal direction="up" distance={30}>
              <div className="text-center mb-16 max-w-2xl mx-auto">
                <span className="inline-block text-primary text-[0.85rem] font-semibold mb-3 tracking-[0.2em] uppercase">
                  Our Team
                </span>
                <h2 className="text-[2.2rem] md:text-[2.8rem] font-extrabold text-heading leading-tight mb-4">
                  Meet Our <span className="text-primary">Mentors</span>
                </h2>
                <p className="text-[1.05rem] text-body leading-relaxed font-medium">
                  We are active and accomplished digital marketing professionals who are also compassionate student mentors.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Mentor 1: Sreethu */}
              <ScrollReveal direction="up" distance={40} delay={0.1}>
                <div className="group relative bg-white border border-border rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover hover:border-primary/30 transition-all duration-500 hover:-translate-y-2">
                  {/* Image Panel */}
                  <div className="relative h-[320px] w-full bg-gradient-to-br from-primary/10 via-[#fff1f1] to-[#ffecd2] flex items-end justify-center overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute top-4 right-4 w-20 h-20 bg-primary/10 rounded-full blur-xl" />
                    <div className="absolute bottom-0 left-6 w-14 h-14 bg-[#ff8c4a]/15 rounded-full blur-lg" />
                    <Image
                      src="/sreethu2.webp"
                      alt="Sreethu — Digital Marketing Specialist & Mentor"
                      width={280}
                      height={300}
                      className="object-contain object-bottom w-auto h-[300px] transition-transform duration-500 group-hover:scale-105 relative z-10 drop-shadow-lg"
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
                <div className="group relative bg-white border border-border rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover hover:border-primary/30 transition-all duration-500 hover:-translate-y-2">
                  {/* Image Panel */}
                  <div className="relative h-[320px] w-full bg-gradient-to-br from-[#eef2ff] via-[#f5f0ff] to-[#ffe4f0] flex items-end justify-center overflow-hidden">
                    <div className="absolute top-4 right-4 w-20 h-20 bg-blue-500/10 rounded-full blur-xl" />
                    <div className="absolute bottom-0 left-6 w-14 h-14 bg-purple-400/15 rounded-full blur-lg" />
                    <Image
                      src="/Jayakrishnan.webp"
                      alt="Jayakrishnan — Performance Marketing Specialist & Mentor"
                      width={280}
                      height={300}
                      className="object-contain object-bottom w-auto h-[300px] transition-transform duration-500 group-hover:scale-105 relative z-10 drop-shadow-lg"
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

        {/* CTA SECTION */}
        <section className="py-16 bg-[#222831] text-white relative overflow-hidden border-t border-white/5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/15 rounded-full blur-3xl z-0" />
          
          <div className="w-full max-w-[900px] mx-auto px-6 relative z-10 text-center">
            <ScrollReveal direction="up" distance={30}>
              <h2 className="text-[2.2rem] md:text-[2.8rem] font-extrabold text-white mb-6 leading-tight">
                Launch Your Career with <br />
                <span className="text-primary">Kerala&rsquo;s #1 Academy</span>
              </h2>
              <p className="text-[1.1rem] text-[#c3c8cf] leading-relaxed max-w-2xl mx-auto mb-10">
                Ready to learn from professional digital marketers and gain real agency work experience? Book your demo class today.
              </p>
              
              <div className="flex gap-4 flex-col sm:flex-row justify-center max-w-[420px] mx-auto">
                <Link
                  href="/#admission"
                  className="flex-1 inline-flex items-center justify-center px-7 py-4 rounded-full font-bold text-base bg-primary text-white shadow-glow transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 cursor-pointer"
                >
                  Book Free Demo
                </Link>
                <Link
                  href="/courses"
                  className="flex-1 inline-flex items-center justify-center px-7 py-4 rounded-full font-bold text-base bg-transparent text-white border border-white/40 transition-all duration-300 hover:border-white hover:bg-white/5 cursor-pointer"
                >
                  Explore Programs
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-[#222831] text-[#c3c8cf] pt-12 pb-6 md:pt-16 md:pb-8 text-[0.95rem] border-t border-white/10">
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
                    { label: "Job Vacancy", href: "/placements" },
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
