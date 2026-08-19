/**
 * Zeon inner-page design tokens — reuse on offers inners, gallery, blog-like pages.
 * Homepage uses its own composition and is out of scope here.
 */
export const INNER_PAGE = {
  container: 'w-full max-w-[1200px] mx-auto px-6',
  heroSection:
    'relative pt-24 pb-12 lg:pt-28 lg:pb-16 bg-surface bg-grid-pattern overflow-hidden border-b border-border',
  heroBannerClass: 'object-cover object-center opacity-100 pointer-events-none',
  heroOrbPrimary:
    'absolute top-10 left-10 w-[200px] h-[200px] bg-primary/10 rounded-full blur-3xl z-0 animate-pulse-glow',
  heroOrbAccent:
    'absolute -bottom-10 right-10 w-[250px] h-[250px] bg-[#ff8c4a]/10 rounded-full blur-3xl z-0 animate-pulse-glow',
  tagline:
    'inline-block text-primary text-[0.82rem] font-bold mb-3 tracking-[0.22em] uppercase',
  title: 'text-[2rem] md:text-[2.8rem] font-extrabold text-heading leading-tight mb-4',
  breadcrumb:
    'flex items-center justify-center lg:justify-start gap-2 flex-wrap text-[0.88rem] font-semibold text-body my-6',
  section: 'py-12 md:py-16 relative',
  card: 'bg-white border border-border rounded-2xl shadow-card hover:shadow-card-hover hover:border-primary/20 transition-all duration-300',
  contentPanel: 'bg-white border border-border rounded-[20px] p-6 md:p-8 shadow-sm',
};

export const INNER_HERO_BANNERS = {
  default: '/courses/courses-fin.webp',
  listing: '/courses/courss.webp',
};
