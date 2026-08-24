/**
 * Zeon inner-page design tokens — reuse on offers inners, gallery, blog-like pages.
 * Homepage uses its own composition and is out of scope here.
 */
export const INNER_PAGE = {
  container: 'w-full max-w-[1200px] mx-auto px-6',
  heroSection: 'relative pt-24 pb-0 md:pt-28 overflow-visible',
  heroBannerClass: 'object-cover object-center opacity-100 pointer-events-none',
  heroOverlay: 'absolute bg-blend-overlay bg-grid-pattern opacity-70 inset-0 z-10',
  heroContent:
    'w-full max-w-[1200px] mx-auto px-6 relative z-10 animate-fade-in-up pb-8 md:pb-10',
  heroInner: 'relative max-w-3xl mx-auto text-center',
  tagline:
    'block text-black text-[0.85rem] font-normal mb-3 tracking-[0.2em] uppercase',
  title:
    'text-[clamp(2.2rem,5vw,2.3rem)] leading-[1.2] text-black mb-5 tracking-tight',
  subtitle:
    'text-[1.1rem] md:text-[1rem] text-black/80 leading-relaxed font-light mb-5 max-w-3xl mx-auto',
  breadcrumb:
    'flex items-center justify-center gap-2.5 flex-wrap text-[0.88rem] font-semibold text-black/80 mb-5 !mt-5 md:mt-0',
  breadcrumbLink: 'hover:text-black transition-colors',
  breadcrumbSep: 'text-black/80',
  breadcrumbCurrent: 'text-black/80',
  section: 'py-12 md:py-16 relative',
  card: 'bg-white border border-border rounded-2xl shadow-card hover:shadow-card-hover hover:border-primary/20 transition-all duration-300',
  contentPanel: 'bg-white border border-border rounded-[20px] p-6 md:p-8 shadow-sm',
};

export const INNER_HERO_BANNERS = {
  default: '/banner-white.svg',
  listing: '/banner-white.svg',
};
