import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { FaFacebookF, FaInstagram, FaLinkedin, FaYoutube, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaCheck } from "react-icons/fa";

const LegalButtons = dynamic(() => import("./LegalButtons"));

export default function Footer() {
  return (
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
        <div className="flex flex-col-reverse sm:flex-row sm:justify-between items-center gap-4 pt-6 border-t border-white/10 text-[0.85rem]">
          <p className="m-0 text-[#c3c8cf] text-center sm:text-left">
            © 2026 Zeon Academy. All Rights Reserved | <span className="whitespace-nowrap">Powered by <a href="https://webindiasolutions.com/" target="_blank" rel="noopener noreferrer" className="text-white no-underline hover:text-primary transition-all duration-300">Web India Solutions</a></span>
          </p>
          <div className="flex gap-6">
            <LegalButtons />
          </div>
        </div>
      </div>
    </footer>
  );
}
