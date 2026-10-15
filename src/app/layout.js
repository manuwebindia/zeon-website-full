import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import ScrollToTop from "@/components/ScrollToTop";
import OfferPopup from "@/components/OfferPopup";
import LegalModal from "@/components/LegalModal";
import DownloadBrochureModal from "@/components/DownloadBrochureModal";
import { buildPageMetadata } from "@/lib/pageSeo";
import { getSiteUrl } from "@/lib/siteUrl";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export async function generateMetadata() {
  const siteUrl = getSiteUrl();
  const homeMeta = await buildPageMetadata("/");

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: homeMeta.title,
      template: "%s | Zeon Academy",
    },
    description: homeMeta.description,
    keywords: [
      "digital marketing course Kerala",
      "digital marketing institute Kochi",
      "SEO course Kerala",
      "Google Ads training",
      "Meta Ads course",
      "digital marketing certification",
      "Zeon Academy",
    ],
    alternates: homeMeta.alternates,
    openGraph: homeMeta.openGraph,
    twitter: homeMeta.twitter,
    icons: {
      icon: "/favicon.webp",
    },
    robots: homeMeta.robots,
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <OfferPopup />
        {children}
        <LegalModal />
        <DownloadBrochureModal />
        <ScrollToTop />
        {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
          <Script 
            src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`} 
            strategy="afterInteractive" 
          />
        )}
      </body>
    </html>
  );
}
