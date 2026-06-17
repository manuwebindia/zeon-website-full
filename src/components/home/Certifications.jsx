import Image from "next/image";
import ScrollReveal from "../ScrollReveal";

const certImages = [
  { src: "/certificates/Google-Ads-Video-Certification.webp", alt: "Google Ads Video" },
  { src: "/certificates/Facebook-Blueprint-Certification.webp", alt: "Facebook Blueprint" },
  { src: "/certificates/Google-Analytics-Certification.webp", alt: "Google Analytics" },
  { src: "/certificates/google-adwords.webp", alt: "Google Adwords" },
  { src: "/certificates/Google Mobile-Advertising-Certification.webp", alt: "Google Mobile Advertising" },
  { src: "/certificates/Google-Shopping-Advertising Certification.webp", alt: "Google Shopping Advertising" },
];

export default function Certifications() {
  return (
        <section className="py-10 md:py-14 lg:py-16 xl:py-20 bg-white bg-diagonal-pattern">
          <div className="w-full max-w-[1200px] mx-auto px-6 text-center">
            <ScrollReveal direction="up" distance={40}>
              <div className="text-center mb-[4.5rem] max-w-6xl mx-auto">
                <span className="inline-block text-primary text-[0.85rem] font-semibold mb-5 tracking-[0.2em] uppercase">
                  Recognitions
                </span>
                <h2 className="text-[clamp(2.2rem,4vw,3rem)] font-extrabold text-heading mb-4 leading-tight">
                  Get Certified By{" "}
                  <span className="text-primary">Industry Leaders</span>
                </h2>
                <p className="text-[1.15rem] text-body leading-relaxed font-medium">
                  Get your skills recognized by the pioneers of technology and
                  marketing.
                  <br className="hidden sm:block" /> Showcase them on LinkedIn. Let
                  the recruiters find you.
                </p>
              </div>
            </ScrollReveal>

            {/* Certifications Layout */}
            <ScrollReveal direction="up" distance={60} delay={0.1}>
              <div className="flex gap-6 mt-12 max-lg:flex-col">
                {/* Main Zeon Cert Card */}
                <div className="flex-[0_0_320px] max-lg:flex-auto max-lg:w-full bg-white border border-border rounded-2xl flex flex-col items-center justify-center p-12 shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(255,68,68,0.12)] hover:border-primary/40 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-[#ff8c4a]/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
                  <div className="w-[150px] h-[150px] rounded-full border-2 border-primary/20 flex items-center justify-center mb-8 p-4 relative bg-white transition-all duration-500 group-hover:border-primary group-hover:shadow-[0_0_30px_rgba(255,68,68,0.2)]">
                    <div className="absolute inset-[-4px] rounded-full border border-dashed border-primary/40 animate-[spin_10s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Image
                      src="/LOGOblack.png"
                      alt="Zeon Logo"
                      width={140}
                      height={50}
                      style={{ width: "auto", height: "auto", maxWidth: "100%" }}
                      className="relative z-10 transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-xl font-extrabold text-heading leading-snug relative z-10">
                    Zeon Academy
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#ff8c4a]">Certification</span>
                  </h3>
                </div>

                {/* Other Certs Grid */}
                <div className="flex-1 grid grid-cols-3 max-md:grid-cols-2 max-[480px]:grid-cols-1 gap-6">
                  {certImages.map((cert, i) => (
                    <div
                      key={i}
                      className="bg-white border border-border rounded-xl flex flex-col items-center justify-center p-6 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                    >
                      <Image
                        src={cert.src}
                        alt={cert.alt}
                        width={100}
                        height={100}
                        className="w-full max-w-[130px] h-auto object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
  );
}
