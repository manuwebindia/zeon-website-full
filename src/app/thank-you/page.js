import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaCheck,
  FaCheckCircle,
  FaArrowLeft
} from "react-icons/fa";
import Navbar from "../../components/Navbar";

const LegalButtons = dynamic(() => import("../../components/LegalButtons"));

export const metadata = {
  title: "Thank You | Zeon Academy",
  description: "Thank you for reaching out to Zeon Academy. Our team will get back to you shortly.",
  alternates: {
    canonical: "/thank-you",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYouPage() {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen flex flex-col">
        {/* Thank You Section */}
        <section className="pt-32 pb-20 flex-grow flex items-center justify-center bg-surface bg-dots-pattern">
          <div className="w-full max-w-[800px] mx-auto px-6 text-center animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#37d366]/10 text-[#37d366] mb-8 shadow-sm">
              <FaCheckCircle className="text-[4rem]" />
            </div>
            
            <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-extrabold text-heading mb-6 leading-tight">
              Thank <span className="text-primary">You!</span>
            </h1>
            
            <p className="text-[1.15rem] text-body leading-relaxed font-medium mb-10 max-w-[600px] mx-auto">
              Your submission has been successfully received. Our admission team will contact you shortly with the next steps.
            </p>
            
            <Link 
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-[1.1rem] bg-primary text-white shadow-glow transition-all duration-300 hover:bg-primary-hover hover:shadow-glow-hover hover:-translate-y-1"
            >
              <FaArrowLeft /> Back to Home
            </Link>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            FOOTER
        ═══════════════════════════════════════════════ */}
        <footer className="bg-[#222831] text-[#c3c8cf] pt-20 pb-8 text-[0.95rem]">
          <div className="w-full max-w-[1200px] mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
              {/* Column 1: Brand */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Image
                    src="/zeon-logo.png"
                    alt="Zeon Academy"
                    width={0}
                    height={0}
                    sizes="140px"
                    style={{ height: "45px", width: "auto" }}
                  />
                </div>
                <p className="leading-relaxed mb-6 text-[#c3c8cf]">
                  Kerala&rsquo;s leading digital marketing training institute
                  with 100% placement support.
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
                      target={href !== "#" ? "_blank" : undefined}
                      rel={href !== "#" ? "noopener noreferrer" : undefined}
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
                    { label: "Why Zeon",   href: "/#why-zeon"   },
                    { label: "Program",    href: "/#program"    },
                    { label: "Placements", href: "/#placements" },
                    { label: "Admission",  href: "/#admission"  },
                    { label: "Fees & Schedule", href: "/#fees"  },
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
                      Zeon Academy, 46/2709 C, Haritha Road Vennala PO, Kochi -
                      682028
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
                    <a
                      className="text-[#c3c8cf] no-underline hover:text-white transition-colors"
                    >
                      contact@zeonacademy.com
                    </a>
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
