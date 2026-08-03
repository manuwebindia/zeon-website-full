import { Open_Sans } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import ScrollToTop from "@/components/ScrollToTop";
import OfferPopup from "@/components/OfferPopup";
import LegalModal from "@/components/LegalModal";
import DownloadBrochureModal from "@/components/DownloadBrochureModal";
import { buildPageMetadata } from "@/lib/pageSeo";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const SITE_URL = "https://admission.zeonacademy.com";

export async function generateMetadata() {
  const homeMeta = await buildPageMetadata("/");

  return {
    metadataBase: new URL(SITE_URL),
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
    <html lang="en" className={openSans.variable}>
      <body>
        <style>{`.grecaptcha-badge { display: none !important; }`}</style>
        <OfferPopup />
        {children}
        <LegalModal />
        <DownloadBrochureModal />
        <ScrollToTop />
        <Script 
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`} 
          strategy="beforeInteractive" 
        />
      </body>
    </html>
  );
}
