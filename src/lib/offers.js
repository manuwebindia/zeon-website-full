import fs from 'fs/promises';
import path from 'path';

const OFFERS_CONFIG_PATH = path.join(process.cwd(), 'src/data/offers-config.json');

export const DEFAULT_OFFERS_CONFIG = {
  popup: {
    enabled: true,
    delaySeconds: 2,
    durationMinutes: 5,
    badgeText: 'Limited Time Offer',
    headline: 'Get',
    headlineAccent: '₹3,000 OFF',
    subtitle: 'on Your Digital Marketing Course',
    description: 'Use code at enquiry — seats are limited!',
    offerCode: 'OFFER-2026',
    ctaText: 'Claim Offer on WhatsApp',
    secondaryCtaText: 'Not Now',
    footerText: 'No spam · Code sent instantly via WhatsApp',
    whatsappPhone: '917558888252',
    miniBannerText: 'Exclusive Offer Expiring Soon!',
    miniBannerTextMobile: 'Offer Expiring Soon!',
    miniBannerCta: 'CLAIM',
  },
  page: {
    title: 'Offers & Free Resources',
    subtitle: 'Download handbooks, guides, and exclusive resources from Zeon Academy.',
    heroTagline: 'Exclusive Downloads',
  },
  offers: [],
};

function normalizeOffer(offer, index = 0) {
  return {
    id: String(offer.id || `offer-${index + 1}`).trim(),
    enabled: offer.enabled !== false,
    image: String(offer.image || '').trim(),
    tagline: String(offer.tagline || 'Download').trim(),
    heading: String(offer.heading || '').trim(),
    downloadButtonText: String(offer.downloadButtonText ?? 'DOWNLOAD NOW!').trim(),
    downloadUrl: String(offer.downloadUrl || '').trim(),
    text: String(offer.text || '').trim(),
    validUntil: String(offer.validUntil || '').trim(),
    validUntilLabel: String(offer.validUntilLabel ?? 'Valid til:').trim(),
    showDownloadButton: offer.showDownloadButton !== false,
    sortOrder: Number.isFinite(Number(offer.sortOrder)) ? Number(offer.sortOrder) : index,
  };
}

function normalizeConfig(input) {
  const popup = { ...DEFAULT_OFFERS_CONFIG.popup, ...(input?.popup || {}) };
  const page = { ...DEFAULT_OFFERS_CONFIG.page, ...(input?.page || {}) };
  const offers = Array.isArray(input?.offers)
    ? input.offers.map((offer, index) => normalizeOffer(offer, index))
    : [];

  return {
    popup: {
      ...popup,
      enabled: popup.enabled !== false,
      delaySeconds: Math.max(0, Number(popup.delaySeconds) || 2),
      durationMinutes: Math.max(1, Number(popup.durationMinutes) || 5),
    },
    page,
    offers: offers.sort((a, b) => a.sortOrder - b.sortOrder),
  };
}

export async function readOffersConfig() {
  try {
    const raw = await fs.readFile(OFFERS_CONFIG_PATH, 'utf-8');
    return normalizeConfig(JSON.parse(raw));
  } catch {
    return normalizeConfig(DEFAULT_OFFERS_CONFIG);
  }
}

export async function writeOffersConfig(config) {
  const normalized = normalizeConfig(config);
  const dir = path.dirname(OFFERS_CONFIG_PATH);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(OFFERS_CONFIG_PATH, JSON.stringify(normalized, null, 2), 'utf-8');
  return normalized;
}

export function isOfferActive(offer, now = new Date()) {
  if (!offer?.enabled) return false;
  if (!offer.validUntil) return true;
  const expiry = new Date(`${offer.validUntil}T23:59:59`);
  return !Number.isNaN(expiry.getTime()) && expiry >= now;
}

export function formatOfferDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(`${dateStr}T12:00:00`);
  if (Number.isNaN(date.getTime())) return dateStr;
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export async function getPublicOffersPayload() {
  const config = await readOffersConfig();
  const offers = config.offers.filter((offer) => isOfferActive(offer));
  return {
    page: config.page,
    offers,
  };
}

export async function getPopupConfig() {
  const config = await readOffersConfig();
  return config.popup;
}
