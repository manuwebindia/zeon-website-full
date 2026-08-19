import Image from 'next/image';
import { FaChevronRight } from 'react-icons/fa';
import Link from 'next/link';
import { INNER_PAGE, INNER_HERO_BANNERS } from '@/lib/designLanguage';

export default function InnerPageHero({
  banner = INNER_HERO_BANNERS.default,
  bannerAlt = 'Zeon Academy',
  breadcrumbs = [],
  tagline,
  title,
  subtitle,
  children,
  align = 'left',
}) {
  const textAlign = align === 'center' ? 'text-center' : 'text-center lg:text-left';
  const crumbJustify = align === 'center' ? 'justify-center' : 'justify-center lg:justify-start';

  return (
    <section className={INNER_PAGE.heroSection}>
      <div className="absolute inset-0 z-1">
        <Image
          src={banner}
          alt={bannerAlt}
          sizes="100vw"
          fill
          priority
          className={INNER_PAGE.heroBannerClass}
        />
      </div>
      <div className={INNER_PAGE.heroOrbPrimary} />
      <div className={INNER_PAGE.heroOrbAccent} />

      <div className={`${INNER_PAGE.container} relative z-10`}>
        <div className={`animate-fade-in-up ${textAlign}`}>
          {breadcrumbs.length > 0 && (
            <nav className={`${INNER_PAGE.breadcrumb} ${crumbJustify}`}>
              {breadcrumbs.map((crumb, idx) => (
                <span key={crumb.label} className="flex items-center gap-2">
                  {idx > 0 && <FaChevronRight className="text-body/30 text-[0.65rem]" />}
                  {crumb.href ? (
                    <Link href={crumb.href} className="hover:text-primary transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-primary font-bold">{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}

          {tagline && <span className={INNER_PAGE.tagline}>{tagline}</span>}
          {title && (
            <h1 className={`${INNER_PAGE.title} whitespace-pre-line`}>{title}</h1>
          )}
          {subtitle && (
            <p className="text-[1.05rem] text-body leading-relaxed font-medium max-w-2xl mx-auto lg:mx-0">
              {subtitle}
            </p>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}
