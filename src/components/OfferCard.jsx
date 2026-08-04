'use client';

import Image from 'next/image';
import Link from 'next/link';

const downloadButtonClass =
  'inline-flex w-fit max-w-full items-center justify-center self-start px-4 py-2 md:px-6 md:py-3 rounded-full bg-[#111827] text-white font-extrabold text-[0.72rem] md:text-[0.82rem] tracking-[0.08em] hover:bg-black transition-colors duration-200 whitespace-nowrap';

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
      <div className="relative w-full min-h-[200px] sm:min-h-[230px] md:min-h-[280px] overflow-hidden">
        {offer.image ? (
          <Image
            src={offer.image}
            alt={offer.text || offer.heading || 'Offer'}
            fill
            quality={100}
            className="object-cover object-center scale-[1.03] transition-transform duration-500"
            sizes="(max-width: 1024px) 100vw, 560px"
          />
        ) : (
          <div className="absolute inset-0" />
        )}

        <div className="absolute inset-0 pointer-events-none" />

        <div className="relative z-10 flex items-center min-h-[200px] sm:min-h-[230px] md:min-h-[280px] px-4 py-5 sm:px-5 sm:py-6 md:px-6 md:py-8">
          <div className="w-full max-w-[58%] sm:max-w-[52%] text-left">
            {offer.tagline && (
              <p className="text-[0.75rem] sm:text-[0.85rem] md:text-[0.95rem] font-semibold text-body mb-1 md:mb-2 leading-snug">{offer.tagline}</p>
            )}
            {offer.heading && (
              <h3 className="text-[1.45rem] sm:text-[1.75rem] md:text-[2.35rem] font-extrabold text-primary leading-[1.05] mb-3 md:mb-5 whitespace-pre-line">
                {offer.heading}
              </h3>
            )}
            {showButton && downloadButton}
          </div>
        </div>
      </div>

      <div className="px-4 py-3.5 sm:px-5 sm:py-4 md:px-6 md:py-5 border-t border-border bg-white flex-1 flex flex-col justify-center">
        {offer.text && (
          <h4 className="text-[1.05rem] sm:text-[1.2rem] md:text-[1.35rem] font-extrabold text-heading mb-1 md:mb-2">{offer.text}</h4>
        )}
        {validLabel && (
          <p className="text-[0.82rem] sm:text-[0.88rem] md:text-[0.95rem] text-body font-medium">
            {validUntilLabel} <span className="font-bold text-heading">{validLabel}</span>
          </p>
        )}
      </div>
    </article>
  );
}
