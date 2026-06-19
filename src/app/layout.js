import { Open_Sans } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import ScrollToTop from "@/components/ScrollToTop";
import OfferPopup from "@/components/OfferPopup";
import LegalModal from "@/components/LegalModal";
import DownloadBrochureModal from "@/components/DownloadBrochureModal";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const SITE_URL = "https://admission.zeonacademy.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Best Digital Marketing Course in Kochi | #1 Kerala | Zeon",
    template: "%s | Zeon Academy",
  },
  description:
    "Become a certified digital marketer at Zeon Academy. Practical training, guaranteed internship, and 100% placement support. Start your digital marketing career today!",
  keywords: [
    "digital marketing course Kerala",
    "digital marketing institute Kochi",
    "SEO course Kerala",
    "Google Ads training",
    "Meta Ads course",
    "digital marketing certification",
    "Zeon Academy",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Zeon Academy",
    title: "Best Digital Marketing Course in Kochi | #1 Kerala | Zeon",
    description:
      "Become a certified digital marketer at Zeon Academy. Practical training, guaranteed internship, and 100% placement support. Start your digital marketing career today!",
    images: [
      {
        url: "/zeon-banner-bg.webp",
        width: 1200,
        height: 630,
        alt: "Zeon Digital Marketing Academy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zeon Digital Marketing Academy | Kerala's #1 Digital Marketing Course",
    description:
      "Join Kerala's most practical digital marketing institute. 100% placement support, guaranteed internship.",
    images: ["/zeon-banner-bg.webp"],
  },
  icons: {
    icon: "/favicon.webp",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

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
