"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";

/* ─── Content ─────────────────────────────────────────── */

const PRIVACY = {
  title: "Privacy Policy",
  sections: [
    {
      heading: null,
      body: `Thank you for visiting the website of Zeon Academy (referred to as "Zeon", "we," "us," or "our"). This Privacy Policy outlines how we collect, use, and protect the information you provide to us through our website. We are committed to ensuring the privacy and security of your personal information. By accessing or using our website, you consent to the practices described in this Privacy Policy.`,
    },
    {
      heading: "Information We Collect",
      body: `a. Personal Information: When you interact with our website, we may collect personal information such as your name, email address, phone number, and other contact details. We collect this information when you voluntarily provide it to us, such as when you fill out a contact form or subscribe to our newsletter.\n\nb. Usage Information: We may also collect non-personal information about your interactions with our website, including your IP address, browser type, operating system, referring URL, and other browsing details. This information is collected automatically through cookies and similar technologies.`,
    },
    {
      heading: "Use of Information",
      body: `a. We may use the personal information we collect to: Respond to your inquiries and provide customer support. Send you relevant information about our services, updates, and promotional offers. Personalize your experience on our website and improve our services. Analyze website usage and trends to enhance our website's functionality and performance. Comply with legal obligations and enforce our Terms and Conditions.\n\nb. We may use the non-personal information we collect for statistical purposes, to analyze trends, administer our website, and gather demographic information. This information helps us improve our website and tailor our services to better meet your needs.`,
    },
    {
      heading: "Data Sharing and Disclosure",
      body: `a. We will not sell, trade, or rent your personal information to third parties for marketing purposes without your explicit consent. However, we may share your personal information with trusted third-party service providers who assist us in operating our website, conducting our business, or servicing you, as long as they agree to keep your information confidential.\n\nb. We may also disclose your information if required by law or to protect our rights, property, or safety, or the rights, property, or safety of others.`,
    },
    {
      heading: "Data Security",
      body: `a. We implement reasonable security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, please note that no method of transmission over the Internet or electronic storage is completely secure, and we cannot guarantee the absolute security of your information.\n\nb. We will retain your personal information only for as long as necessary to fulfill the purposes for which it was collected, or as required by applicable laws and regulations.`,
    },
    {
      heading: "Third-Party Links",
      body: `a. Our website may contain links to third-party websites or services that are not operated or controlled by us. We are not responsible for the privacy practices or content of these third-party websites. We encourage you to review the privacy policies of those websites before providing any personal information.`,
    },
    {
      heading: "Children's Privacy",
      body: `a. Our website and services are not intended for children under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us, and we will promptly remove such information from our records.`,
    },
    {
      heading: "Your Rights",
      body: `a. You have the right to access, update, correct, or delete your personal information. If you would like to exercise any of these rights or have any concerns regarding your personal information, please contact us using the contact details provided below.`,
    },
    {
      heading: "Changes to the Privacy Policy",
      body: `a. We reserve the right to update or modify this Privacy Policy at any time, without prior notice. Any changes to this policy will be effective immediately upon posting the updated Privacy Policy on our website.\n\nb. We encourage you to review this Privacy Policy periodically to stay informed about how we collect, use, and protect your personal information.`,
    },
    {
      heading: "Contact Us",
      body: `If you have any questions or concerns regarding this Privacy Policy or our data practices, please contact us at:\n\nZeon Academy\n46/2709 C, Haritha Road\nVennala PO, Kochi – 682028\nEmail: contact@zeonacademy.com\nPhone: +91 8943356405\n\nBy using our website, you acknowledge that you have read, understood, and agreed to this Privacy Policy.`,
    },
  ],
};

const TERMS = {
  title: "Terms and Conditions",
  sections: [
    {
      heading: null,
      body: `Welcome to Zeon Academy (referred to as "Zeon", "we," "us," or "our"). These Terms and Conditions outline the rules and regulations for the use of our website and any related services we offer. By accessing or using our website and services, you agree to comply with these Terms and Conditions. If you disagree with any part of these terms, please refrain from using our website.`,
    },
    {
      heading: "Intellectual Property",
      body: `a. All content, including text, graphics, logos, images, videos, and software, on our website is the exclusive property of Zeon Academy. This content is protected by intellectual property laws, including copyright, trademarks, and other proprietary rights.\n\nb. You acknowledge and agree that the content provided on our website is for your personal use only. You may not reproduce, distribute, modify, transmit, or use any of our intellectual property without obtaining prior written permission from Zeon Academy.`,
    },
    {
      heading: "Website Use",
      body: `a. By accessing or using our website and services, you affirm that you are at least 18 years old or have reached the age of majority in your jurisdiction. If you are accessing our website on behalf of a company or organization, you represent and warrant that you have the authority to bind that entity to these Terms and Conditions.\n\nb. You agree to use our website and services only for lawful purposes and in a manner consistent with all applicable laws and regulations. You must not engage in any activities that could harm, disable, overburden, or impair our website or interfere with any other party's use and enjoyment of our services.\n\nc. We reserve the right, at our sole discretion, to suspend, terminate, or restrict your access to our website and services if we suspect any misuse, fraudulent activity, or violation of these Terms and Conditions.`,
    },
    {
      heading: "Registration and Account",
      body: `a. In order to access certain services or materials on our website, you may be required to create an account. You agree to provide accurate, complete, and up-to-date information during the registration process.\n\nb. You are solely responsible for maintaining the confidentiality of your account credentials, including your username and password. You are also responsible for all activities that occur under your account.\n\nc. You agree to notify us immediately of any unauthorized use of your account or any other security breaches. We shall not be liable for any loss or damage arising from your failure to comply with this obligation.`,
    },
    {
      heading: "Payment and Refunds",
      body: `a. Payment for our services must be made in accordance with the pricing and payment terms specified on our website. You agree to provide accurate and complete payment information.\n\nb. All fees for our services are non-refundable unless explicitly stated otherwise. In exceptional cases, such as technical issues or dissatisfaction with our services, we may, at our sole discretion, consider a refund or credit towards future services. Requests for refunds should be submitted to our customer support team in writing.\n\nc. Any refunds or credits provided will be subject to the applicable refund policy outlined by Zeon Academy.`,
    },
    {
      heading: "Third-Party Links",
      body: `a. Our website may contain links to third-party websites or services that are not owned or controlled by Zeon Academy. These links are provided for your convenience and reference only.\n\nb. We do not endorse or assume any responsibility for the content, privacy policies, or practices of any third-party websites or services. You acknowledge and agree that we shall not be liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of any third-party websites or services.\n\nc. We encourage you to review the terms and conditions and privacy policies of any third-party websites or services that you visit.`,
    },
    {
      heading: "Limitation of Liability",
      body: `a. Our website and services are provided on an "as is" and "as available" basis without any warranties, express or implied. We make no representations or warranties of any kind, whether express, implied, or statutory, regarding the operation of our website, the content, materials, or services provided.\n\nb. To the fullest extent permitted by law, we shall not be liable for any direct, indirect, incidental, consequential, or special damages arising out of or in connection with the use of our website or services, including but not limited to damages for loss of profits, data, or other intangible losses, even if we have been advised of the possibility of such damages.`,
    },
    {
      heading: "Governing Law",
      body: `a. These Terms and Conditions shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law principles.\n\nb. Any disputes arising from these Terms and Conditions, including their interpretation, validity, or enforcement, shall be subject to the exclusive jurisdiction of the courts in Ernakulam, Kerala, India.`,
    },
    {
      heading: "Changes to the Terms and Conditions",
      body: `a. We reserve the right to modify or replace these Terms and Conditions at any time, without prior notice.\n\nb. Any changes to these Terms and Conditions will be effective immediately upon posting the revised version on our website.\n\nc. It is your responsibility to review these Terms and Conditions periodically for any updates or changes.`,
    },
    {
      heading: "Contact / Feedback",
      body: `By using our website and services, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.\n\nThe various provisions contained within these Terms are separate and independent. If any provision of these Terms is found by a court of competent jurisdiction to be invalid or unenforceable, the parties nevertheless agree that the court should endeavor to give effect to the parties' intentions as reflected in the provision, and the remaining provisions of these Terms shall remain in full force and effect.\n\nIf you have any questions or comments, please email us at contact@zeonacademy.com.`,
    },
  ],
};

/* ─── Modal Component ─────────────────────────────────── */

function ModalContent({ doc, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-[99999] flex items-center justify-center p-4 sm:p-6 md:p-10 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-[720px] max-h-[90vh] rounded-2xl relative shadow-[0_30px_70px_rgba(0,0,0,0.35)] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Accent bar */}
        <div className="h-[4px] w-full bg-gradient-to-r from-primary via-[#ff4a4a] to-[#ff8c4a] shrink-0" />

        {/* Header */}
        <div className="bg-white border-b border-border px-6 py-4 flex items-center justify-between shrink-0">
          <h2 className="text-[1.15rem] font-extrabold text-heading m-0">
            {doc.title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex items-center justify-center w-8 h-8 rounded-full text-body hover:text-primary hover:bg-primary/10 transition-all duration-200 border-none bg-transparent cursor-pointer"
          >
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-7 max-sm:px-4 space-y-6 text-[0.92rem] leading-relaxed text-body overflow-y-auto flex-1">
          {doc.sections.map((sec, i) => (
            <div key={i}>
              {sec.heading && (
                <h3 className="text-[1rem] font-bold text-heading mb-2">
                  {sec.heading}
                </h3>
              )}
              {sec.body.split("\n\n").map((para, j) => (
                <p key={j} className="mb-2 last:mb-0 whitespace-pre-line">
                  {para}
                </p>
              ))}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-primary text-white font-semibold text-[0.9rem] hover:bg-primary-hover transition-all duration-300 border-none cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Exported hook + trigger ─────────────────────────── */

export default function LegalModal() {
  const [open, setOpen] = useState(null); // "privacy" | "terms" | null
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handle = (e) => setOpen(e.detail);
    window.addEventListener("openLegal", handle);
    return () => window.removeEventListener("openLegal", handle);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const doc = open === "privacy" ? PRIVACY : open === "terms" ? TERMS : null;

  return mounted && doc
    ? createPortal(
        <ModalContent doc={doc} onClose={() => setOpen(null)} />,
        document.body
      )
    : null;
}
