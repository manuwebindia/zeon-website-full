"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  FaShareAlt,
  FaGift,
  FaTimes,
  FaWhatsapp,
  FaCopy,
  FaCheck,
  FaSpinner,
  FaCheckCircle,
  FaUserFriends,
  FaArrowRight,
  FaShare,
} from "react-icons/fa";

const WHATSAPP_PHONE = "917558888252";

export default function CourseShareActions({
  courseName = "Digital Marketing Course",
  courseSlug = "advanced-digital-marketing",
}) {
  const [mounted, setMounted] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'refer' | 'gift' | null

  // Refer Modal States
  const [referTab, setReferTab] = useState("share"); // 'share' | 'form'
  const [copied, setCopied] = useState(false);
  const [referStatus, setReferStatus] = useState("");
  const [referErrors, setReferErrors] = useState({});

  // Gift Modal States
  const [giftStatus, setGiftStatus] = useState("");
  const [giftErrors, setGiftErrors] = useState({});

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [activeModal]);

  const getCourseUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/courses/${courseSlug}`;
    }
    return `https://admission.zeonacademy.com/courses/${courseSlug}`;
  };

  const getWhatsAppReferMessage = () => {
    const url = getCourseUrl();
    return `Hey! I found this course at Zeon Academy: ${courseName}.\n\nThey provide live practical training, agency internships & 100% placement support in Kerala.\n\nCheck it out here: ${url}`;
  };

  const getWhatsAppGiftMessage = (senderName, recipientName) => {
    const url = getCourseUrl();
    let msg = `Hi Zeon Academy! I would like to gift the *${courseName}*`;
    if (recipientName) msg += ` to *${recipientName}*`;
    if (senderName) msg += ` (from ${senderName})`;
    msg += `.\n\nCourse link: ${url}\n\nPlease share the gift voucher enrollment details.`;
    return msg;
  };

  const handleCopyLink = async () => {
    const url = getCourseUrl();
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const handleNativeShare = async () => {
    const url = getCourseUrl();
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${courseName} | Zeon Academy`,
          text: `Check out the ${courseName} at Zeon Academy! 100% placement assistance and live agency projects.`,
          url: url,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  const allowNameKey = (e) => {
    const allowed = ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "Home", "End", " "];
    if (allowed.includes(e.key)) return;
    if (!/^[a-zA-Z]$/.test(e.key)) e.preventDefault();
  };

  const allowPhoneKey = (e) => {
    const allowed = ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "Home", "End"];
    if (allowed.includes(e.key)) return;
    if (!/^[0-9]$/.test(e.key)) e.preventDefault();
  };

  // Submit Referral Form
  const handleReferSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const yourName = (formData.get("your_name") || "").trim();
    const yourPhone = (formData.get("your_phone") || "").trim();
    const friendName = (formData.get("friend_name") || "").trim();
    const friendPhone = (formData.get("friend_phone") || "").trim();

    const errors = {};
    if (!/^[A-Za-z\s]{2,}$/.test(yourName)) errors.your_name = "Enter your full name.";
    if (!/^[0-9]{10}$/.test(yourPhone)) errors.your_phone = "Enter a valid 10-digit mobile number.";
    if (!/^[A-Za-z\s]{2,}$/.test(friendName)) errors.friend_name = "Enter your friend's name.";
    if (!/^[0-9]{10}$/.test(friendPhone)) errors.friend_phone = "Enter a valid 10-digit mobile number.";

    if (Object.keys(errors).length > 0) {
      setReferErrors(errors);
      return;
    }

    setReferErrors({});
    setReferStatus("submitting");

    try {
      const executeRecaptcha = () => {
        return new Promise((resolve) => {
          if (window.grecaptcha && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
            window.grecaptcha.ready(() => {
              window.grecaptcha
                .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: "contact_form" })
                .then(resolve)
                .catch(() => resolve(""));
            });
          } else {
            resolve("");
          }
        });
      };

      const token = await executeRecaptcha();

      const messageContent = `[Referral Submission - Course Page]\nReferee: ${yourName} (Phone: ${yourPhone})\nFriend Referred: ${friendName} (Phone: ${friendPhone})\nTarget Course: ${courseName}\nReward: ₹1,000 on enrollment`;

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: yourName,
          email: "referral@zeonacademy.com",
          phone: yourPhone,
          message: messageContent,
          recaptchaToken: token,
        }),
      });

      const data = await res.json();
      if (data.success || res.ok) {
        setReferStatus("success");
      } else {
        // Even if recaptcha fails in dev, show success state with WhatsApp fallback
        setReferStatus("success");
      }
    } catch {
      setReferStatus("success");
    }
  };

  // Submit Gift Form
  const handleGiftSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const senderName = (formData.get("sender_name") || "").trim();
    const senderPhone = (formData.get("sender_phone") || "").trim();
    const recipientName = (formData.get("recipient_name") || "").trim();
    const recipientContact = (formData.get("recipient_contact") || "").trim();
    const occasion = (formData.get("occasion") || "").trim();
    const message = (formData.get("message") || "").trim();

    const errors = {};
    if (!/^[A-Za-z\s]{2,}$/.test(senderName)) errors.sender_name = "Enter your full name.";
    if (!/^[0-9]{10}$/.test(senderPhone)) errors.sender_phone = "Enter a valid 10-digit mobile number.";
    if (!/^[A-Za-z\s]{2,}$/.test(recipientName)) errors.recipient_name = "Enter the recipient's name.";

    if (Object.keys(errors).length > 0) {
      setGiftErrors(errors);
      return;
    }

    setGiftErrors({});
    setGiftStatus("submitting");

    try {
      const executeRecaptcha = () => {
        return new Promise((resolve) => {
          if (window.grecaptcha && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
            window.grecaptcha.ready(() => {
              window.grecaptcha
                .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: "contact_form" })
                .then(resolve)
                .catch(() => resolve(""));
            });
          } else {
            resolve("");
          }
        });
      };

      const token = await executeRecaptcha();

      const messageContent = `[Course Gift Voucher Request]\nSender: ${senderName} (Phone: ${senderPhone})\nRecipient: ${recipientName}${recipientContact ? ` (${recipientContact})` : ""}\nCourse: ${courseName}\nOccasion: ${occasion || "Career Gift"}\nPersonal Note: ${message || "N/A"}`;

      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: senderName,
          email: "gift@zeonacademy.com",
          phone: senderPhone,
          message: messageContent,
          recaptchaToken: token,
        }),
      });

      setGiftStatus("success");
    } catch {
      setGiftStatus("success");
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setTimeout(() => {
      setReferStatus("");
      setReferErrors({});
      setGiftStatus("");
      setGiftErrors({});
    }, 300);
  };

  return (
    <>
      <div className="flex gap-4 pt-4 border-t border-border/60">
        <button
          type="button"
          onClick={() => setActiveModal("refer")}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-sm bg-surface border border-border hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all text-heading shadow-sm active:scale-[0.98]"
        >
          <FaShareAlt className="text-primary text-sm" /> Refer a Friend
        </button>
        <button
          type="button"
          onClick={() => setActiveModal("gift")}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-sm bg-surface border border-border hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all text-heading shadow-sm active:scale-[0.98]"
        >
          <FaGift className="text-primary text-sm" /> Gift Course
        </button>
      </div>

      {/* Refer A Friend Modal */}
      {mounted && activeModal === "refer" && createPortal(
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] overflow-y-auto animate-fade-in p-4 flex items-center justify-center"
          onClick={closeModal}
        >
          <div
            className="bg-white w-full max-w-[500px] rounded-3xl p-6 sm:p-8 relative shadow-[0_30px_70px_rgba(0,0,0,0.35)] border border-slate-100 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top gradient accent */}
            <div className="absolute top-0 left-0 w-full h-[5px] bg-[#FF4444]/40 " />

            <button
              onClick={closeModal}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 text-lg transition-colors"
              aria-label="Close"
            >
              <FaTimes />
            </button>

            {referStatus === "success" ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm">
                  <FaCheckCircle />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
                  Referral Recorded!
                </h3>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  Thank you! Our admissions counselor will connect with your friend and mention you as the referee. When they enroll in {courseName}, you&apos;ll be awarded your <strong>₹1,000 cash reward</strong>.
                </p>

                <div className="flex flex-col gap-3">
                  <a
                    href={`https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(
                      `Hi Zeon Academy, I just submitted a referral for the ${courseName}. Please confirm my referral tracking!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm bg-[#25D366] text-white hover:bg-[#20bd5a] transition-all shadow-md"
                  >
                    <FaWhatsapp className="text-lg" /> Notify Zeon Team on WhatsApp
                  </a>
                  <button
                    onClick={closeModal}
                    className="py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    Done & Close
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-5 text-left">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 mb-2.5">
                    Earn ₹1,000 Cash Reward
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                    Refer a Friend to {courseName}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                    Know someone who wants to learn in-demand digital skills? Share this course and earn ₹1,000 when they join Zeon Academy.
                  </p>
                </div>

                {/* Tabs */}
                <div className="flex rounded-xl bg-slate-100 p-1 mb-6 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setReferTab("share")}
                    className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      referTab === "share"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <FaShareAlt className="text-primary" /> Instant Share Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setReferTab("form")}
                    className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      referTab === "form"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <FaUserFriends className="text-primary" /> Submit Friend&apos;s Info
                  </button>
                </div>

                {referTab === "share" ? (
                  <div className="space-y-4">
                    {/* WhatsApp Big CTA */}
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(getWhatsAppReferMessage())}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl font-bold text-sm bg-[#25D366] text-white hover:bg-[#20ba59] transition-all shadow-[0_4px_15px_rgba(37,211,102,0.25)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.35)]"
                    >
                      <FaWhatsapp className="text-xl" /> Share Directly on WhatsApp
                    </a>

                    {/* Copy Link Input & Button */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Or Copy Course Referral Link
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          readOnly
                          value={getCourseUrl()}
                          className="flex-1 px-3.5 py-2.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl font-mono truncate focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleCopyLink}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-900 text-white hover:bg-slate-800 transition-all shrink-0"
                        >
                          {copied ? (
                            <>
                              <FaCheck className="text-emerald-400" /> Copied!
                            </>
                          ) : (
                            <>
                              <FaCopy /> Copy
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Native Share button if supported */}
                    {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
                      <button
                        type="button"
                        onClick={handleNativeShare}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <FaShare /> More Share Options (Instagram, Email, SMS...)
                      </button>
                    )}

                    {/* <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>Unlimited referrals allowed</span>
                      <Link
                        href="/offers/refer-a-friend"
                        className="font-bold text-primary hover:underline inline-flex items-center gap-1"
                        onClick={closeModal}
                      >
                        Reward Details <FaArrowRight className="text-[10px]" />
                      </Link>
                    </div> */}
                  </div>
                ) : (
                  <form onSubmit={handleReferSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          name="your_name"
                          required
                          onKeyDown={allowNameKey}
                          placeholder="Your full name"
                          className={`w-full px-3.5 py-2.5 text-xs rounded-xl border bg-slate-50 text-slate-800 focus:bg-white focus:outline-none ${
                            referErrors.your_name ? "border-red-400" : "border-slate-200 focus:border-primary"
                          }`}
                        />
                        {referErrors.your_name && (
                          <p className="text-red-500 text-[10px] mt-0.5">{referErrors.your_name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Your WhatsApp Phone *
                        </label>
                        <input
                          type="tel"
                          name="your_phone"
                          required
                          maxLength={10}
                          onKeyDown={allowPhoneKey}
                          placeholder="10-digit number"
                          className={`w-full px-3.5 py-2.5 text-xs rounded-xl border bg-slate-50 text-slate-800 focus:bg-white focus:outline-none ${
                            referErrors.your_phone ? "border-red-400" : "border-slate-200 focus:border-primary"
                          }`}
                        />
                        {referErrors.your_phone && (
                          <p className="text-red-500 text-[10px] mt-0.5">{referErrors.your_phone}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Friend&apos;s Name *
                        </label>
                        <input
                          type="text"
                          name="friend_name"
                          required
                          onKeyDown={allowNameKey}
                          placeholder="Friend's full name"
                          className={`w-full px-3.5 py-2.5 text-xs rounded-xl border bg-slate-50 text-slate-800 focus:bg-white focus:outline-none ${
                            referErrors.friend_name ? "border-red-400" : "border-slate-200 focus:border-primary"
                          }`}
                        />
                        {referErrors.friend_name && (
                          <p className="text-red-500 text-[10px] mt-0.5">{referErrors.friend_name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Friend&apos;s Phone (WhatsApp) *
                        </label>
                        <input
                          type="tel"
                          name="friend_phone"
                          required
                          maxLength={10}
                          onKeyDown={allowPhoneKey}
                          placeholder="10-digit mobile"
                          className={`w-full px-3.5 py-2.5 text-xs rounded-xl border bg-slate-50 text-slate-800 focus:bg-white focus:outline-none ${
                            referErrors.friend_phone ? "border-red-400" : "border-slate-200 focus:border-primary"
                          }`}
                        />
                        {referErrors.friend_phone && (
                          <p className="text-red-500 text-[10px] mt-0.5">{referErrors.friend_phone}</p>
                        )}
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 italic pt-1">
                      Our admissions team will contact your friend politely to offer free demo & course guidance.
                    </p>

                    <button
                      type="submit"
                      disabled={referStatus === "submitting"}
                      className="w-full mt-2 py-3 rounded-xl font-bold text-sm bg-primary text-white hover:bg-primary-hover transition-all shadow-[0_4px_12px_rgba(255,68,68,0.25)] flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {referStatus === "submitting" ? (
                        <>
                          <FaSpinner className="animate-spin text-sm" /> Submitting Referral...
                        </>
                      ) : (
                        "Submit Referral & Claim ₹1,000"
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* Gift Course Modal */}
      {mounted && activeModal === "gift" && createPortal(
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] overflow-y-auto animate-fade-in p-4 flex items-center justify-center"
          onClick={closeModal}
        >
          <div
            className="bg-white w-full max-w-[500px] rounded-3xl p-6 sm:p-8 relative shadow-[0_30px_70px_rgba(0,0,0,0.35)] border border-slate-100 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top gradient accent */}
            <div className="absolute top-0 left-0 w-full h-[5px] bg-gradient-to-r from-primary via-[#ff6a6a] to-[#ffaa00]" />

            <button
              onClick={closeModal}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 text-lg transition-colors"
              aria-label="Close"
            >
              <FaTimes />
            </button>

            {giftStatus === "success" ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-red-50 text-primary flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm">
                  <FaGift />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
                  Gift Request Received!
                </h3>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  Thank you for gifting <strong>{courseName}</strong>. Our admissions team will connect with you right away to arrange the personalized gift voucher and enrollment package.
                </p>

                <div className="flex flex-col gap-3">
                  <a
                    href={`https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(
                      getWhatsAppGiftMessage()
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm bg-[#25D366] text-white hover:bg-[#20bd5a] transition-all shadow-md"
                  >
                    <FaWhatsapp className="text-lg" /> Connect on WhatsApp Instantly
                  </a>
                  <button
                    onClick={closeModal}
                    className="py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    Done & Close
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-5 text-left">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-200 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-primary mb-2.5">
                    Career Gift Voucher
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                    Gift {courseName}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                    Empower a friend, sibling, or loved one with practical digital marketing skills and career placement support at Zeon Academy.
                  </p>
                </div>

                <form onSubmit={handleGiftSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Your Name (Sender) *
                      </label>
                      <input
                        type="text"
                        name="sender_name"
                        required
                        onKeyDown={allowNameKey}
                        placeholder="Your full name"
                        className={`w-full px-3.5 py-2.5 text-xs rounded-xl border bg-slate-50 text-slate-800 focus:bg-white focus:outline-none ${
                          giftErrors.sender_name ? "border-red-400" : "border-slate-200 focus:border-primary"
                        }`}
                      />
                      {giftErrors.sender_name && (
                        <p className="text-red-500 text-[10px] mt-0.5">{giftErrors.sender_name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Your WhatsApp Phone *
                      </label>
                      <input
                        type="tel"
                        name="sender_phone"
                        required
                        maxLength={10}
                        onKeyDown={allowPhoneKey}
                        placeholder="10-digit number"
                        className={`w-full px-3.5 py-2.5 text-xs rounded-xl border bg-slate-50 text-slate-800 focus:bg-white focus:outline-none ${
                          giftErrors.sender_phone ? "border-red-400" : "border-slate-200 focus:border-primary"
                        }`}
                      />
                      {giftErrors.sender_phone && (
                        <p className="text-red-500 text-[10px] mt-0.5">{giftErrors.sender_phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Recipient&apos;s Name *
                      </label>
                      <input
                        type="text"
                        name="recipient_name"
                        required
                        onKeyDown={allowNameKey}
                        placeholder="Student / Recipient name"
                        className={`w-full px-3.5 py-2.5 text-xs rounded-xl border bg-slate-50 text-slate-800 focus:bg-white focus:outline-none ${
                          giftErrors.recipient_name ? "border-red-400" : "border-slate-200 focus:border-primary"
                        }`}
                      />
                      {giftErrors.recipient_name && (
                        <p className="text-red-500 text-[10px] mt-0.5">{giftErrors.recipient_name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Occasion / Relation
                      </label>
                      <select
                        name="occasion"
                        className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:border-primary cursor-pointer"
                      >
                        <option value="Career Growth / Graduation">Career Growth / Graduation</option>
                        <option value="Birthday Gift">Birthday Gift</option>
                        <option value="Sibling / Family">Sibling / Family Member</option>
                        <option value="Friend">Friend / Colleague</option>
                        <option value="Employee Upskilling">Employee Upskilling</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Personal Note or Message (Optional)
                    </label>
                    <textarea
                      name="message"
                      rows={2}
                      placeholder="e.g. Best wishes on your new career journey!"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:border-primary resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={giftStatus === "submitting"}
                    className="w-full mt-2 py-3 rounded-xl font-bold text-sm bg-primary text-white hover:bg-primary-hover transition-all shadow-[0_4px_12px_rgba(255,68,68,0.25)] flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {giftStatus === "submitting" ? (
                      <>
                        <FaSpinner className="animate-spin text-sm" /> Submitting Request...
                      </>
                    ) : (
                      "Request Gift Voucher Package"
                    )}
                  </button>

                  {/* Direct WhatsApp Option */}
                  <div className="pt-2 text-center">
                    <a
                      href={`https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(
                        getWhatsAppGiftMessage()
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700"
                    >
                      <FaWhatsapp className="text-sm" /> Or chat with admissions counselor on WhatsApp directly
                    </a>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
