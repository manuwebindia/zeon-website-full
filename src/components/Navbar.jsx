"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaPhoneAlt, FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/courses", label: "Courses" },
    { href: "/placements", label: "Placements" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[1000] w-full border-b transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-border shadow-sm"
          : "bg-white/90 backdrop-blur-sm border-border/40"
      }`}
      >
        <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 py-3.5 md:py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/navbar/Zeon-Logo.webp"
            alt="Zeon Digital Marketing Academy"
            width={0}
            height={0}
            sizes="160px"
            priority
            style={{ height: "42px", width: "auto" }}
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden xl:block">
          <ul className="flex items-center gap-0.5 list-none">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block px-3.5 py-2 text-[0.9rem] font-medium text-body rounded-md transition-colors duration-200 whitespace-nowrap hover:text-primary hover:bg-primary-light"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/#counsellor"
                className="flex items-center gap-2 px-3.5 py-2 text-[0.9rem] font-semibold text-heading rounded-md border-[1.5px] border-border transition-colors duration-200 whitespace-nowrap hover:border-primary hover:text-primary hover:bg-primary-light"
              >
                <FaPhoneAlt size={11} />
                Talk to Counsellor
              </Link>
            </li>
            <li>
              <Link
                href="/#apply"
                className="block px-5 py-2 ml-1 text-[0.9rem] font-bold text-white bg-primary rounded-full shadow-glow transition-all duration-200 whitespace-nowrap hover:bg-primary-hover hover:shadow-glow-hover hover:-translate-y-0.5"
              >
                Start Your Admission
              </Link>
            </li>
          </ul>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="xl:hidden flex items-center justify-center w-10 h-10 rounded-full text-heading transition-colors hover:bg-primary-light hover:text-primary"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="xl:hidden fixed inset-0 top-0 z-[9999] bg-white animate-fade-in flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-white">
            <Link href="/" className="flex items-center" onClick={() => setMobileOpen(false)}>
              <Image
                src="/navbar/Zeon-Logo.webp"
                alt="Zeon Academy"
                width={0}
                height={0}
                sizes="140px"
                style={{ height: "38px", width: "auto" }}
              />
            </Link>
            <button
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-primary-light hover:text-primary transition-colors bg-surface text-heading shadow-card"
              onClick={() => setMobileOpen(false)}
            >
              <FaTimes size={20} />
            </button>
          </div>
          <nav className="px-6 py-6 flex-1 overflow-y-auto">
            <ul className="flex flex-col gap-1 list-none">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3.5 text-[1.1rem] font-bold text-heading rounded-xl transition-colors duration-200 hover:bg-primary-light hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3">
              <a
                href="tel:+918943356405"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 py-4 text-base font-bold text-heading border-[1.5px] border-border rounded-xl transition-colors hover:border-primary hover:text-primary"
              >
                <FaPhoneAlt size={13} />
                Talk to Counsellor
              </a>
              <Link
                href="/#apply"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center py-4 text-base font-bold text-white bg-primary rounded-xl shadow-glow transition-all hover:bg-primary-hover hover:shadow-glow-hover"
              >
                 Start Your Admission
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
