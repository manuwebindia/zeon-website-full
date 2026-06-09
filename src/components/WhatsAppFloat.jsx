"use client";

import { FaWhatsapp } from "react-icons/fa";

const PHONE = "917558888252";
const MSG = "Hi! I'm interested in joining Zeon Academy. Could you please share more details about your Digital Marketing courses, fee structure and batch schedule?";

export default function WhatsAppFloat() {
  const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(MSG)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-[100001] w-14 h-14 rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.45)] flex items-center justify-center border-none cursor-pointer transition-all duration-300 hover:bg-[#20bd5a] hover:scale-110 hover:shadow-[0_12px_30px_rgba(37,211,102,0.55)]"
    >
      <FaWhatsapp size={28} />
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30 pointer-events-none" />
    </a>
  );
}
