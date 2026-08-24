import Image from 'next/image';
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
}) {
  return (
    <section className={INNER_PAGE.heroSection}>
      <Image
        src={banner}
        alt={bannerAlt}
        sizes="100vw"
        fill
        priority
        className={INNER_PAGE.heroBannerClass}
      />
      <div className={INNER_PAGE.heroOverlay} />

      <div className={INNER_PAGE.heroContent}>
        <div className={INNER_PAGE.heroInner}>
          {breadcrumbs.length > 0 && (
            <nav className={INNER_PAGE.breadcrumb}>
              {breadcrumbs.map((crumb, idx) => (
                <span key={`${crumb.label}-${idx}`} className="contents">
                  {idx > 0 && (
                    <span className={INNER_PAGE.breadcrumbSep}>/</span>
                  )}
                  {crumb.href ? (
                    <Link href={crumb.href} className={INNER_PAGE.breadcrumbLink}>
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={INNER_PAGE.breadcrumbCurrent}>
                      {crumb.label}
                    </span>
                  )}
                </span>
              ))}
            </nav>
          )}

          {tagline && <span className={INNER_PAGE.tagline}>{tagline}</span>}
          {title && (
            <h1 className={`${INNER_PAGE.title} whitespace-pre-line`}>{title}</h1>
          )}
          {subtitle && <p className={INNER_PAGE.subtitle}>{subtitle}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}
