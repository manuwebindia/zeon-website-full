"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  FaStar,
  FaChevronLeft,
  FaChevronRight,
  FaExternalLinkAlt,
  FaCheckCircle,
} from "react-icons/fa";

// Authentic Google "G" 4-color SVG Icon
export const GoogleGIcon = ({ size = 22, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      fill="#4285F4"
    />
    <path
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      fill="#34A853"
    />
    <path
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
      fill="#FBBC05"
    />
    <path
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      fill="#EA4335"
    />
  </svg>
);

const AVATAR_BG_COLORS = [
  "bg-[#1A73E8]", // Google Blue
  "bg-[#EA4335]", // Google Red
  "bg-[#34A853]", // Google Green
  "bg-[#F2994A]", // Google Orange
  "bg-[#9333EA]", // Purple
  "bg-[#0891B2]", // Cyan
];

function ReviewAvatar({ photo, name, initial, colorClass }) {
  const [imgError, setImgError] = useState(false);

  if (photo && !imgError) {
    return (
      <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-[#E2E8F0]">
        <img
          src={photo}
          alt={name || "Reviewer"}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`w-10 h-10 rounded-full ${colorClass} text-white font-bold flex items-center justify-center text-[0.95rem] shrink-0 shadow-sm`}
    >
      {initial || (name ? name[0].toUpperCase() : "G")}
    </div>
  );
}

export default function GoogleReviewsWidget({
  title = "Google Reviews",
  subtitle = "What our students say on Google Business Profile",
  className = "",
  compact = false,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedReviews, setExpandedReviews] = useState({});
  const carouselRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    async function loadReviews() {
      try {
        const res = await fetch("/api/reviews");
        if (res.ok) {
          const json = await res.json();
          if (isMounted) setData(json);
        }
      } catch (err) {
        console.error("Failed to load Google Reviews:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadReviews();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleExpand = (id) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -360, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 360, behavior: "smooth" });
    }
  };

  const place = data?.placeDetails || {
    displayName: "Zeon Academy",
    rating: 4.9,
    userRatingCount: 181,
    googleMapsUri: "https://maps.google.com/?cid=2104526408004949515",
    reviewDialogUri:
      "https://search.google.com/local/writereview?placeid=ChIJozWLCdhyCDsRC1aQKZ7HNB0",
  };

  const reviews = data?.reviews || [];

  return (
    <div className={`w-full ${className}`}>
      {/* ── TOP HEADER / BADGE BAR ── */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 md:p-6 mb-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left: Google Logo + Rating + Stars */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center shrink-0 shadow-sm">
            <GoogleGIcon size={26} />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[1.35rem] font-extrabold text-[#0F172A] tracking-tight">
                {place.rating || 4.9}
              </span>
              <div className="flex items-center gap-0.5 text-[#FBBC04] text-[1.1rem]">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <span className="bg-[#DCFCE7] text-[#15803D] text-[0.72rem] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                EXCELLENT
              </span>
            </div>

            <p className="text-[0.825rem] text-[#64748B] mt-0.5 font-medium">
              Based on{" "}
              <a
                href={place.googleMapsUri}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#0F172A] hover:text-[#2563EB] underline decoration-[#CBD5E1] transition-colors"
              >
                {place.userRatingCount || 181} reviews
              </a>{" "}
              on Google
            </p>
          </div>
        </div>

        {/* Right: Actions (Write Review + Carousel Nav) */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <a
            href={place.reviewDialogUri}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#F8FAFC] hover:bg-[#EFF6FF] text-[#1E293B] hover:text-[#1D4ED8] border border-[#CBD5E1] hover:border-[#93C5FD] text-[0.825rem] font-bold rounded-full transition-all shadow-sm group"
          >
            <span>Review us on Google</span>
            <FaExternalLinkAlt className="text-[0.7rem] text-[#64748B] group-hover:text-[#1D4ED8]" />
          </a>

          {reviews.length > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={scrollLeft}
                aria-label="Previous Google Reviews"
                className="w-9 h-9 rounded-full bg-white hover:bg-[#F1F5F9] border border-[#CBD5E1] text-[#334155] flex items-center justify-center transition-colors shadow-sm active:scale-95"
              >
                <FaChevronLeft className="text-[0.75rem]" />
              </button>
              <button
                onClick={scrollRight}
                aria-label="Next Google Reviews"
                className="w-9 h-9 rounded-full bg-white hover:bg-[#F1F5F9] border border-[#CBD5E1] text-[#334155] flex items-center justify-center transition-colors shadow-sm active:scale-95"
              >
                <FaChevronRight className="text-[0.75rem]" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── REVIEWS CAROUSEL ── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white border border-[#E2E8F0] rounded-2xl p-6 h-48 animate-pulse flex flex-col justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E2E8F0]" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-[#E2E8F0] rounded w-28" />
                  <div className="h-3 bg-[#F1F5F9] rounded w-16" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-[#E2E8F0] rounded w-full" />
                <div className="h-3 bg-[#E2E8F0] rounded w-4/5" />
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 text-center text-[#64748B]">
          <GoogleGIcon size={32} className="mx-auto mb-2 opacity-60" />
          <p className="font-semibold">No reviews displayed yet.</p>
        </div>
      ) : (
        <div
          ref={carouselRef}
          className="flex items-stretch gap-5 overflow-x-auto pb-4 scroll-smooth scrollbar-none snap-x snap-mandatory"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {reviews.map((rev, index) => {
            const isExpanded = expandedReviews[rev.id];
            const isLong = rev.text && rev.text.length > 130;
            const displayText =
              isLong && !isExpanded
                ? rev.text.substring(0, 130) + "..."
                : rev.text;
            const avatarColor =
              AVATAR_BG_COLORS[index % AVATAR_BG_COLORS.length];

            return (
              <div
                key={rev.id || index}
                className="w-[300px] sm:w-[340px] shrink-0 bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:border-[#CBD5E1] transition-all duration-300 flex flex-col justify-between snap-start"
              >
                <div>
                  {/* Author Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <ReviewAvatar
                        photo={rev.authorPhoto}
                        name={rev.authorName}
                        initial={rev.authorInitial}
                        colorClass={avatarColor}
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-[#0F172A] text-[0.875rem] truncate leading-tight">
                            {rev.authorName}
                          </h4>
                          {rev.isLocalGuide && (
                            <span
                              title="Local Guide"
                              className="text-[0.625rem] bg-[#FEF3C7] text-[#92400E] font-bold px-1.5 py-0.2 rounded shrink-0"
                            >
                              Guide
                            </span>
                          )}
                        </div>
                        <p className="text-[0.72rem] text-[#94A3B8] mt-0.5">
                          {rev.relativeTime || "Recently"}
                        </p>
                      </div>
                    </div>

                    {/* Google G badge */}
                    <div
                      title="Verified Google Review"
                      className="shrink-0 p-1 rounded-full bg-[#F8FAFC]"
                    >
                      <GoogleGIcon size={18} />
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div className="flex items-center gap-1 mb-2.5">
                    <div className="flex items-center gap-0.5 text-[#FBBC04] text-[0.95rem]">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                    <FaCheckCircle
                      className="text-[#15803D] text-[0.75rem] ml-1"
                      title="Verified Review"
                    />
                  </div>

                  {/* Review Text */}
                  <p className="text-[#334155] text-[0.85rem] leading-relaxed font-normal">
                    {displayText}
                  </p>

                  {isLong && (
                    <button
                      onClick={() => toggleExpand(rev.id)}
                      className="text-[0.78rem] font-bold text-[#2563EB] hover:text-[#1D4ED8] mt-1.5 block cursor-pointer transition-colors"
                    >
                      {isExpanded ? "Show less" : "Read more"}
                    </button>
                  )}
                </div>

                {/* Card Footer: Google verified link */}
                <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-[0.72rem] text-[#94A3B8]">
                  <span className="flex items-center gap-1 text-[#64748B] font-medium">
                    Posted on Google
                  </span>
                  <a
                    href={place.googleMapsUri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#64748B] hover:text-[#2563EB] flex items-center gap-1 transition-colors font-medium"
                  >
                    <span>View</span>
                    <FaExternalLinkAlt className="text-[0.65rem]" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
