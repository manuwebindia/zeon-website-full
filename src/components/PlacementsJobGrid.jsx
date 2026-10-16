'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaMapMarkerAlt, FaBriefcase, FaBuilding, FaArrowRight } from 'react-icons/fa';
import ScrollReveal from './ScrollReveal';
import { INNER_PAGE } from '@/lib/designLanguage';

export default function PlacementsJobGrid({ jobs = [] }) {
  const router = useRouter();

  if (!jobs.length) {
    return (
      <div className={`text-center py-16 px-6 ${INNER_PAGE.card}`}>
        <p className="text-[1.1rem] font-bold text-heading mb-2">No active openings right now</p>
        <p className="text-body font-medium max-w-md mx-auto">
          Check back soon — new roles are added regularly. Employers can list openings via Post Your Job.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {jobs.map((job, idx) => {
        const detailHref = `/placement-cell/${job.slug || job.id}`;
        return (
          <ScrollReveal key={job.id || idx} direction="up" distance={30} delay={idx * 0.03}>
            <div
              onClick={() => router.push(detailHref)}
              className={`group ${INNER_PAGE.card} p-6 hover:-translate-y-1 flex flex-col h-full relative overflow-hidden cursor-pointer`}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                {job.logo ? (
                  <div className="w-10 h-10 rounded-xl border border-border/80 bg-white p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                    <img
                      src={job.logo}
                      alt={`${job.company} logo`}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <FaBriefcase className="text-primary text-[0.95rem]" />
                  </div>
                )}
                <span className="inline-flex items-center gap-1.5 text-[0.72rem] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Hiring
                </span>
              </div>

              <h3 className="text-[1.08rem] font-extrabold text-heading leading-snug mb-2">
                <Link
                  href={detailHref}
                  onClick={(e) => e.stopPropagation()}
                >
                  {job.title}
                </Link>
              </h3>

              <div className="flex items-center gap-1.5 text-[0.85rem] font-semibold text-body mb-1">
                <FaBuilding className="text-primary/70 shrink-0 text-[0.8rem]" />
                {job.company}
              </div>

              <div className="flex items-center gap-1.5 text-[0.82rem] font-medium text-body/70 mb-4">
                <FaMapMarkerAlt className="text-primary/60 shrink-0 text-[0.78rem]" />
                {job.location}
              </div>

              <p className="text-[0.88rem] text-body leading-relaxed font-medium flex-1 mb-5 line-clamp-3">
                {job.description}
              </p>

              <div className="mt-auto pt-3 border-t border-border/60 flex items-center">
                <Link
                  href={detailHref}
                  onClick={(e) => e.stopPropagation()}
                  className="flex w-full items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-[0.88rem] text-white bg-primary hover:bg-heading shadow-[0_4px_12px_rgba(255,51,51,0.22)] hover:shadow-[0_6px_18px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 transition-all duration-200 shrink-0"
                >
                  Apply Now
                  <FaArrowRight className="text-[0.75rem] group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        );
      })}
    </div>
  );
}
