"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaPlayCircle, FaTimes, FaStar, FaQuoteLeft } from "react-icons/fa";

const testimonials = [
  {
    id: 1,
    name: "Abhijith",
    thumbnail: "/testimonials/Abhijith_TestimonialV2.webp",
    videoId: "FE3eo98Z9PA",
    quote: "Zeon gave me the practical skills and confidence to start my digital marketing career.",
    role: "Digital Marketing Professional",
  },
  {
    id: 2,
    name: "Ajitha",
    thumbnail: "/testimonials/Ajitha_TestimonialV2.webp",
    videoId: "wp6fpv_Hl-Y",
    quote: "The trainers at Zeon are industry experts who gave real-world insights I couldn't find elsewhere.",
    role: "Social Media Strategist",
  },
  {
    id: 3,
    name: "Aparna",
    thumbnail: "/testimonials/Aparna_TestimonialV2.webp",
    videoId: "lJBBcCURt74",
    quote: "From zero experience to a full-time digital marketing job — Zeon made it possible.",
    role: "SEO Specialist",
  },
  {
    id: 4,
    name: "Arya",
    thumbnail: "/testimonials/Arya_TestimonialV2.webp",
    videoId: "3U_8NbM5XPM",
    quote: "Hands-on projects and internship support helped me stand out in every interview.",
    role: "Performance Marketer",
  },
  {
    id: 5,
    name: "Ashisha",
    thumbnail: "/testimonials/Ashisha_TestimonialV2.webp",
    videoId: "F-IwyRPPlpI",
    quote: "Zeon's placement cell connected me with top companies. I landed my dream job within a month.",
    role: "Digital Marketing Executive",
  },
  {
    id: 6,
    name: "Greeshma",
    thumbnail: "/testimonials/Greeshma_TestimonialV2.webp",
    videoId: "qd2DQ1ff6F4",
    quote: "The structured curriculum and expert mentors shaped me into a confident digital marketer.",
    role: "Content & SEO Specialist",
  },
  {
    id: 7,
    name: "Nimisha",
    thumbnail: "/testimonials/Nimisha_TestimonialV2.webp",
    videoId: "W5Jd5PgG7c4",
    quote: "I came with no background in marketing. Now I run campaigns for real brands.",
    role: "Social Media Manager",
  },
  {
    id: 8,
    name: "Priyadharshini",
    thumbnail: "/testimonials/Priyadharshini_TestimonialV2.webp",
    videoId: "o7GqMRdTVts",
    quote: "The practical training and 100% placement support gave me the edge I needed.",
    role: "Ads Specialist",
  },
];

const stats = [
  { value: "500+", label: "Students Placed" },
  { value: "4.9★", label: "Average Rating" },
  { value: "100%", label: "Placement Support" },
  { value: "5+", label: "Years of Excellence" },
];

export default function TestimonialsClient() {
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <main className="bg-white">

      {/* ── HERO ── */}
      <section className="relative pt-24 pb-16 md:pt-28 md:pb-24 bg-surface bg-grid-pattern overflow-hidden border-b border-border">
        <Image
          src="/courses/courss.webp"
          alt="Zeon Academy Courses Banner"
          fill
          priority
          className="object-cover object-center opacity-100 pointer-events-none"
        />
        {/* Orbs */}
        <div className="absolute top-10 left-10 w-[200px] h-[200px] bg-primary/10 rounded-full blur-3xl z-0 animate-pulse-glow" />
        <div className="absolute -bottom-10 right-10 w-[250px] h-[250px] bg-[#ff8c4a]/10 rounded-full blur-3xl z-0 animate-pulse-glow" />

        <div className="w-full max-w-[1200px] mx-auto px-6 relative z-10 text-center animate-fade-in-up">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2.5 text-[0.88rem] font-semibold text-body mb-5">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="text-border">/</span>
            <span className="text-primary font-bold">Testimonials</span>
          </div>

          <span className="inline-block text-primary text-[0.85rem] font-semibold mb-5 tracking-[0.2em] uppercase">
            What our students say
          </span>

          <h1 className="text-[clamp(2.5rem,5vw,3.6rem)] font-extrabold leading-[1.15] text-heading mb-6 tracking-tight max-w-3xl mx-auto">
            Real Students. <br className="hidden md:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#ff4a4a] to-[#ff8c4a] drop-shadow-sm">
              Real Results.
            </span>
          </h1>

          <p className="text-[1.15rem] text-body leading-relaxed font-medium max-w-3xl mx-auto mb-8">
            Our students came from diverse backgrounds. But everyone had a common aim — build a successful career by getting into a lucrative digital marketing job. They searched for the best training institute in Kochi and found Zeon.
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
      </section>

      {/* ── STATS STRIP ── */}
      <section className="bg-surface border-b border-border py-8">
        <div className="w-full max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-[2rem] font-extrabold text-heading leading-none mb-1">{s.value}</p>
                <p className="text-[0.88rem] font-semibold text-body">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VIDEO GRID ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="w-full max-w-[1200px] mx-auto px-6">

          <div className="text-center mb-14">
            <span className="inline-block text-primary text-[0.82rem] font-bold tracking-[0.2em] uppercase mb-3">
              Student Stories
            </span>
            <h2 className="text-[2rem] md:text-[2.5rem] font-extrabold text-heading leading-tight">
              Hear It{" "}
              <span className="text-primary">Directly</span>{" "}
              From Them
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="group relative bg-white border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:border-primary/30 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col"
                onClick={() => setActiveVideo(t.videoId)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setActiveVideo(t.videoId)}
                aria-label={`Play ${t.name}'s testimonial video`}
              >
                {/* Thumbnail */}
                <div className="relative w-full aspect-[1/1] overflow-hidden">
                  <Image
                    src={t.thumbnail}
                    alt={`${t.name} - Zeon Academy student testimonial`}
                    fill
                    sizes="(max-width: 640px) 640px, (max-width: 1024px) 512px, 400px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-black/15 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-white/30 rounded-full blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <FaPlayCircle className="text-white text-[3.2rem] drop-shadow-lg relative z-10 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-surface border-t border-border">
        <div className="w-full max-w-[900px] mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="text-[#fbbf24] text-lg" />
            ))}
          </div>
          <h2 className="text-[1.8rem] md:text-[2.2rem] font-extrabold text-heading mb-4">
            Join Hundreds of Happy Graduates
          </h2>
          <p className="text-[1.05rem] text-body font-medium leading-relaxed mb-8 max-w-xl mx-auto">
            Be the next success story. Start your digital marketing journey with Kerala's most trusted institute.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() =>
                window.dispatchEvent(new CustomEvent("openBookDemo", { detail: { courseName: "" } }))
              }
              className="px-8 py-4 bg-primary text-white font-bold text-[1rem] rounded-full shadow-glow hover:bg-primary-hover hover:shadow-glow-hover hover:-translate-y-0.5 transition-all duration-300"
            >
              Book a Free Demo Class
            </button>
            <Link
              href="/courses"
              className="px-8 py-4 border-2 border-border text-heading font-bold text-[1rem] rounded-full hover:border-primary hover:text-primary transition-all duration-300"
            >
              Explore Courses
            </Link>
          </div>
        </div>
      </section>

      {/* ── VIDEO MODAL ── */}
      {activeVideo && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[99999] flex items-center justify-center p-4 sm:p-8 animate-fade-in"
          onClick={() => setActiveVideo(null)}
        >
          <button
            className="absolute top-5 right-6 text-white/80 hover:text-white text-[2rem] transition-colors z-10"
            onClick={() => setActiveVideo(null)}
            aria-label="Close video"
          >
            <FaTimes />
          </button>
          <div
            className="w-full max-w-[900px] rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full pb-[56.25%]">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo}?autoplay=1&rel=0`}
                title="Zeon Academy Student Testimonial"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                className="absolute inset-0 w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
