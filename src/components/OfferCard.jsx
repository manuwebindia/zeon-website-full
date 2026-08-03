'use client';

import Image from 'next/image';
import Link from 'next/link';

const downloadButtonClass =
  'inline-flex w-fit max-w-full items-center justify-center self-start px-6 py-3 rounded-full bg-[#111827] text-white font-extrabold text-[0.82rem] tracking-[0.08em] hover:bg-black transition-colors duration-200 whitespace-nowrap';

export default function OfferCard({ offer }) {
  const validLabel = offer.validUntil
    ? new Date(`${offer.validUntil}T12:00:00`).toLocaleDateString('en-GB')
    : null;

  const isExternal = offer.downloadUrl?.startsWith('http');
  const buttonText = offer.downloadButtonText?.trim() || 'DOWNLOAD NOW!';
  const validUntilLabel = offer.validUntilLabel?.trim() || 'Valid til:';
  const showButton = offer.showDownloadButton !== false;

  const downloadButton = offer.downloadUrl ? (
    <a
      href={offer.downloadUrl}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      download={!isExternal ? '' : undefined}
      className={downloadButtonClass}
    >
      {buttonText}
    </a>
  ) : (
    <Link href="/contact" className={downloadButtonClass}>
      {buttonText}
    </Link>
  );

  return (
    <article className="group bg-white border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:border-primary/20 transition-all duration-300 flex flex-col h-full">
      <div className="relative min-h-[260px] md:min-h-[280px] overflow-hidden">
        {offer.image ? (
          <Image
            src={offer.image}
            alt={offer.text || offer.heading || 'Offer'}
            fill
            quality={100}
            className="object-cover object-center group-hover:scale-[1.01] transition-transform duration-500"
            sizes="(max-width: 1024px) 100vw, 560px"
          />
        ) : (
          <div className="absolute inset-0 " />
        )}

        <div className="absolute inset-0 pointer-events-none" />

        <div className="relative z-10 flex items-center min-h-[260px] md:min-h-[280px] px-6 py-8">
          <div className="w-full sm:max-w-[52%] text-left">
            {offer.tagline && (
              <p className="text-[0.95rem] font-semibold text-body mb-2">{offer.tagline}</p>
            )}
            {offer.heading && (
              <h3 className="text-[2rem] md:text-[2.35rem] font-extrabold text-primary leading-[1.05] mb-5 whitespace-pre-line">
                {offer.heading}
              </h3>
            )}
            {showButton && downloadButton}
          </div>
        </div>
      </div>

      <div className="px-6 py-5 border-t border-border bg-white flex-1 flex flex-col justify-center">
        {offer.text && (
          <h4 className="text-[1.35rem] font-extrabold text-heading mb-2">{offer.text}</h4>
        )}
        {validLabel && (
          <p className="text-[0.95rem] text-body font-medium">
            {validUntilLabel} <span className="font-bold text-heading">{validLabel}</span>
          </p>
        )}
      </div>
    </article>
  );
}
