'use client';

import { FaMapMarkerAlt, FaBriefcase, FaBuilding, FaArrowRight } from 'react-icons/fa';
import ScrollReveal from './ScrollReveal';

const WHATSAPP_PHONE = '917558888252';

function buildApplyUrl(title, company) {
  const msg = `Hi! I'd like to apply for the *${title}* position at *${company}* listed on Zeon Academy's Placement Cell. Could you please share more details?`;
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
}

export default function PlacementsJobGrid({ jobs = [] }) {
  if (!jobs.length) {
    return (
      <div className="text-center py-16 px-6 bg-white border border-border rounded-2xl">
        <p className="text-[1.1rem] font-bold text-heading mb-2">No active openings right now</p>
        <p className="text-body font-medium max-w-md mx-auto">
          Check back soon — new roles are added regularly. Employers can list openings via Post Your Job.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {jobs.map((job, idx) => (
        <ScrollReveal key={job.id || idx} direction="up" distance={30} delay={idx * 0.03}>
          <div className="group bg-white border border-border rounded-2xl p-6 shadow-card hover:shadow-card-hover hover:border-primary/25 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary/60 via-primary to-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <FaBriefcase className="text-primary text-[0.95rem]" />
              </div>
              <span className="inline-block text-[0.7rem] font-bold text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full whitespace-nowrap">
                🟢 Hiring
              </span>
            </div>

            <h3 className="text-[1.05rem] font-extrabold text-heading leading-snug mb-2 group-hover:text-primary transition-colors duration-200">
              {job.title}
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
  );
}
