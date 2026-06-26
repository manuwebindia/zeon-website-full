import Link from "next/link";
import dynamic from "next/dynamic";
import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope, FaChevronRight, FaMapMarkedAlt } from "react-icons/fa";
import Navbar from "../../components/Navbar";
import ScrollReveal from "../../components/ScrollReveal";
import ContactForm from "../../components/ContactForm";
import Image from "next/image";

const WhatsAppFloat = dynamic(() => import("../../components/WhatsAppFloat"));
const Footer = dynamic(() => import("../../components/Footer"));

export const metadata = {
  title: "Contact Us | Zeon Academy Kochi",
  description: "Get in touch with Zeon Academy, Kerala's leading digital marketing training institute in Kochi. Call us at +91 7558888252, or visit our Vennala campus today.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <WhatsAppFloat />

      <main className="bg-white">

        {/* ─── HERO BANNER ─────────────────────────────── */}
        <section className="relative pt-24 pb-16 md:pt-28 md:pb-20 bg-surface bg-grid-pattern overflow-hidden border-b border-border">
          <div className="absolute inset-0 z-1">
            <Image
              src="/courses/courss.webp"
              alt="Zeon Academy Courses Banner"
              sizes="1600px"
              fill
              priority
              className="object-cover object-center opacity-100 pointer-events-none"
            />
            {/* <div className="absolute inset-0 bg-gradient-to-b from-[#161B2A]/10 via-[#161B2A]/30 to-[#161B2A]/10" /> */}
          </div>
          <div className="absolute top-10 left-10 w-[200px] h-[200px] bg-primary/10 rounded-full blur-3xl z-0 animate-pulse-glow" />
          <div className="absolute -bottom-10 right-10 w-[250px] h-[250px] bg-[#ff8c4a]/10 rounded-full blur-3xl z-0 animate-pulse-glow" />

          <div className="w-full max-w-[1200px] mx-auto px-6 relative z-10 text-center animate-fade-in-up">
            {/* Breadcrumbs */}
            <nav className="flex items-center justify-center gap-2 mb-5 text-[0.88rem] font-semibold text-body">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <FaChevronRight className="text-body/30 text-[0.65rem]" />
              <span className="text-primary font-bold">Contact Us</span>
            </nav>

            <span className="inline-block text-primary text-[0.82rem] font-bold mb-3 tracking-[0.22em] uppercase">
              Get in Touch
            </span>
            <h1 className="text-[clamp(2.2rem,4.5vw,3.4rem)] font-extrabold leading-[1.15] text-heading mb-5 tracking-tight">
              We&rsquo;d Love to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#ff4a4a] to-[#ff8c4a]">
                Hear From You
              </span>
            </h1>
            <p className="text-[1.05rem] text-body leading-relaxed font-medium max-w-2xl mx-auto">
              Have questions about our courses, placement support, or admission process? Our team is here to help — reach out by phone, email, or just walk in.
            </p>
          </div>
        </section>

        {/* ─── CONTACT CARDS ────────────────────────────── */}
        <section className="py-14 bg-white relative overflow-hidden">
          <div className="w-full max-w-[1200px] mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Card 1: Talk with us */}
              <ScrollReveal direction="up" distance={40} delay={0.1}>
                <div className="bg-surface border border-border/70 rounded-[22px] p-8 h-full transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover group relative overflow-hidden flex flex-col items-center text-center">
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary to-[#ff8c4a]" />
                  <div className="w-14 h-14 bg-primary-light rounded-2xl flex items-center justify-center mb-5 text-primary text-[1.4rem] group-hover:scale-110 transition-transform duration-300 shrink-0">
                    <FaPhoneAlt />
                  </div>
                  <h3 className="text-[1.2rem] font-extrabold text-heading mb-2">Talk with us</h3>
                  <p className="text-[0.88rem] text-body mb-5 font-medium leading-relaxed">
                    Call our team directly for immediate course counselling and queries.
                  </p>
                  <div className="flex flex-col gap-1.5 mt-auto w-full">
                    {["+91 7558888252", "+91 8943356405", "+91 8943356406"].map((num, i) => (
                      <a
                        key={i}
                        href={`tel:${num.replace(/\s/g, "")}`}
                        className="inline-block font-bold text-heading text-[1rem] hover:text-primary transition-colors py-0.5"
                      >
                        {num}
                      </a>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Card 2: Walk in */}
              <ScrollReveal direction="up" distance={40} delay={0.2}>
                <div className="bg-surface border border-border/70 rounded-[22px] p-8 h-full transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover group relative overflow-hidden flex flex-col items-center text-center">
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#ff8c4a] to-primary" />
                  <div className="w-14 h-14 bg-primary-light rounded-2xl flex items-center justify-center mb-5 text-primary text-[1.4rem] group-hover:scale-110 transition-transform duration-300 shrink-0">
                    <FaMapMarkerAlt />
                  </div>
                  <h3 className="text-[1.2rem] font-extrabold text-heading mb-2">Walk in</h3>
                  <p className="text-[0.88rem] text-body mb-5 font-medium leading-relaxed">
                    Zeon Academy, 46/2709 C, Haritha Road,<br />Vennala PO, Kochi – 682028
                  </p>
                  <a
                    href="https://www.google.com/maps?rlz=1C5CHFA_enIN1151IN1151&um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=KaM1iwnYcgg7MQtWkCmexzQd&daddr=46/2709+C,+Ground+Floor,+Haritha+Rd,+Vennala,+Kochi,+Kerala+682028"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-auto text-primary font-bold text-[0.9rem] hover:underline"
                  >
                    <FaMapMarkedAlt /> Get Directions
                  </a>
                </div>
              </ScrollReveal>

              {/* Card 3: I ❤️ email */}
              <ScrollReveal direction="up" distance={40} delay={0.3}>
                <div className="bg-surface border border-border/70 rounded-[22px] p-8 h-full transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover group relative overflow-hidden flex flex-col items-center text-center">
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary to-[#ff8c4a]" />
                  <div className="w-14 h-14 bg-primary-light rounded-2xl flex items-center justify-center mb-5 text-primary text-[1.4rem] group-hover:scale-110 transition-transform duration-300 shrink-0">
                    <FaEnvelope />
                  </div>
                  <h3 className="text-[1.2rem] font-extrabold text-heading mb-2">I ❤️ email</h3>
                  <p className="text-[0.88rem] text-body mb-5 font-medium leading-relaxed">
                    We read and respond to every email. Drop us a line anytime.
                  </p>
                  <a
                    href="mailto:contact@zeonacademy.com"
                    className="font-bold text-primary text-[0.95rem] hover:underline mt-auto break-all"
                  >
                    contact@zeonacademy.com
                  </a>
                </div>
              </ScrollReveal>

            </div>
          </div>
        </section>

        {/* ─── MAP & FORM ───────────────────────────────── */}
        <section className="py-16 md:py-24 bg-surface bg-dots-pattern border-t border-border overflow-hidden">
          <div className="w-full max-w-[1200px] mx-auto px-6">

            <ScrollReveal direction="up" distance={30}>
              <div className="text-center mb-14 max-w-2xl mx-auto">
                <span className="inline-block text-primary text-[0.82rem] font-bold mb-3 tracking-[0.22em] uppercase">
                  Location &amp; Contact
                </span>
                <h2 className="text-[2rem] md:text-[2.6rem] font-extrabold text-heading leading-tight mb-4">
                  Find Our Campus &amp; <span className="text-primary">Reach Out</span>
                </h2>
                <p className="text-[1rem] text-body leading-relaxed font-medium">
                  Navigate to our Kochi campus or send your query directly from this page.
                </p>
              </div>
            </ScrollReveal>

            {/* Equal-height two-column grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

              {/* ── LEFT: Map panel ── */}
              <ScrollReveal direction="left" distance={40} className="h-full">
                <div className="flex flex-col h-full rounded-[24px] overflow-hidden border border-border shadow-[0_12px_40px_rgba(0,0,0,0.06)] bg-white">

                  {/* Map iframe — fills available space */}
                  <div className="relative flex-1 min-h-[300px]">
                    <iframe
                      src="https://maps.google.com/maps?q=Zeon%20Academy,%20Haritha%20Road,%20Vennala,%20Kochi,%20Kerala%20682028&t=&z=16&ie=UTF8&iwloc=&output=embed"
                      width="100%"
                      height="100%"
                      style={{ border: 0, position: "absolute", inset: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Zeon Academy Location Map"
                      className="w-full h-full grayscale-[10%] contrast-[108%] hover:grayscale-0 transition-all duration-500"
                    ></iframe>
                  </div>

                  {/* Address strip pinned at bottom of card */}
                  <div className="bg-white border-t border-border/60 px-6 py-5 flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center text-primary shrink-0 mt-0.5">
                        <FaMapMarkerAlt size={14} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-heading text-[0.95rem] leading-tight">Zeon Academy Campus</p>
                        <p className="text-[0.82rem] text-body font-medium leading-snug mt-0.5">
                          46/2709 C, Haritha Rd, Vennala, Kochi 682028
                        </p>
                      </div>
                    </div>
                    <a
                      href="https://www.google.com/maps?rlz=1C5CHFA_enIN1151IN1151&um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=KaM1iwnYcgg7MQtWkCmexzQd&daddr=46/2709+C,+Ground+Floor,+Haritha+Rd,+Vennala,+Kochi,+Kerala+682028"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 shrink-0 rounded-full py-2.5 px-5 font-bold text-[0.85rem] bg-primary text-white hover:bg-primary-hover transition-all duration-300 shadow-[0_4px_14px_rgba(255,68,68,0.2)] whitespace-nowrap"
                    >
                      <FaMapMarkedAlt /> Directions
                    </a>
                  </div>

                </div>
              </ScrollReveal>

              {/* ── RIGHT: Contact form ── */}
              <ScrollReveal direction="right" distance={40} className="h-full">
                <div className="h-full">
                  <ContactForm />
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
