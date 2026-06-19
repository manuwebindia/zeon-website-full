"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaTimes, FaSpinner, FaFilePdf } from "react-icons/fa";

export default function DownloadBrochureModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});
  const [mounted, setMounted] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [brochureUrl, setBrochureUrl] = useState("");

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

  useEffect(() => {
    setMounted(true);
    const handleOpen = (e) => {
      if (e.detail) {
        setCourseName(e.detail.courseName || "");
        setBrochureUrl(e.detail.brochureUrl || "");
      }
      setIsOpen(true);
    };
    window.addEventListener("openDownloadBrochure", handleOpen);
    return () => window.removeEventListener("openDownloadBrochure", handleOpen);
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const nameVal = (formData.get("name") || "").trim();
    const phoneVal = (formData.get("phone") || "").trim();
    const emailVal = (formData.get("email") || "").trim();
    const newErrors = {};

    if (!/^[A-Za-z\s]{2,}$/.test(nameVal)) {
      newErrors.name = "Name must contain letters only (min 2 characters).";
    }
    if (!/^[0-9]{10}$/.test(phoneVal)) {
      newErrors.phone = "Enter a valid 10-digit mobile number.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!window.grecaptcha) {
      setErrors({ recaptcha: "reCAPTCHA is not loaded yet. Please try again." });
      return;
    }

    setErrors({});
    setStatus("submitting");

    window.grecaptcha.ready(function() {
      window.grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: 'download_brochure' })
        .then(async function(token) {
          if (!token) {
            setErrors({ recaptcha: "reCAPTCHA verification failed." });
            setStatus("");
            return;
          }

          try {
            const res = await fetch("/api/brochure", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: nameVal,
                email: emailVal,
                phone: phoneVal,
                courseName,
                brochureUrl,
                recaptchaToken: token,
              }),
            });
            const data = await res.json();
            if (data.success) {
              setStatus("success");
              // Trigger the browser PDF download
              const link = document.createElement("a");
              link.href = brochureUrl;
              link.setAttribute("download", "");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);

              // Auto close modal after download starts
              setTimeout(() => {
                closeModal();
              }, 1000);
            } else {
              setStatus("error");
            }
          } catch {
            setStatus("error");
          }
        });
    });
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => {
      if (status !== "submitting") {
        setStatus("");
        setErrors({});
      }
    }, 300);
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    document.documentElement.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  const modalRender = (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-[99999] overflow-y-auto animate-fade-in"
      onClick={closeModal}
    >
      <div className="flex min-h-full items-center justify-center p-4 py-6">
        <div
          className="bg-[#fff] w-full max-w-[460px] rounded-2xl p-7 relative shadow-[0_30px_70px_rgba(0,0,0,0.4)] border border-white/20 ring-1 ring-black/5 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top colored accent strip */}
          <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-primary to-[#ff4a4a]" />
          <div className="absolute -inset-[50px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          
          <button
            className="absolute top-4 right-4 bg-none border-none text-body text-2xl cursor-pointer transition-colors duration-300 hover:text-primary"
            onClick={closeModal}
            aria-label="Close"
          >
            <FaTimes />
          </button>

          <div>
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 text-2xl border border-red-100">
                <FaFilePdf />
              </div>
            </div>
            
            <h3 className="text-[1.4rem] font-extrabold text-heading mb-1 text-center">
              Download Brochure
            </h3>
            <p className="text-center text-[0.85rem] text-body mb-5 leading-normal">
              {courseName ? `Enter details to download the ${courseName} brochure` : "Enter details below to download the brochure"}
            </p>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="text-left">
                <label className="block font-semibold text-heading mb-1.5 text-[0.85rem]">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  required
                  onKeyDown={allowNameKey}
                  className={`w-full px-3.5 py-2.5 border rounded-lg bg-surface font-[inherit] text-[0.95rem] text-heading transition-all duration-300 focus:outline-none focus:ring-[3px] focus:bg-white ${
                    errors.name ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-border focus:border-primary focus:ring-primary/10"
                  }`}
                />
                {errors.name && <p className="text-red-500 text-[0.78rem] mt-1 ml-1">{errors.name}</p>}
              </div>

              <div className="text-left">
                <label className="block font-semibold text-heading mb-1.5 text-[0.85rem]">
                  Email ID *
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  required
                  className={`w-full px-3.5 py-2.5 border rounded-lg bg-surface font-[inherit] text-[0.95rem] text-heading transition-all duration-300 focus:outline-none focus:ring-[3px] focus:bg-white ${
                    errors.email ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-border focus:border-primary focus:ring-primary/10"
                  }`}
                />
                {errors.email && <p className="text-red-500 text-[0.78rem] mt-1 ml-1">{errors.email}</p>}
              </div>

              <div className="text-left">
                <label className="block font-semibold text-heading mb-1.5 text-[0.85rem]">
                  Phone (WhatsApp) *
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter 10-digit phone number"
                  required
                  maxLength={10}
                  onKeyDown={allowPhoneKey}
                  className={`w-full px-3.5 py-2.5 border rounded-lg bg-surface font-[inherit] text-[0.95rem] text-heading transition-all duration-300 focus:outline-none focus:ring-[3px] focus:bg-white ${
                    errors.phone ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-border focus:border-primary focus:ring-primary/10"
                  }`}
                />
                {errors.phone && <p className="text-red-500 text-[0.78rem] mt-1 ml-1">{errors.phone}</p>}
              </div>

              <div className="text-left">
                {errors.recaptcha && <p className="text-red-500 text-[0.78rem] mt-1 ml-1">{errors.recaptcha}</p>}
                <p className="text-[0.7rem] text-body/50 mt-2">
                  Protected by reCAPTCHA.{" "}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">Privacy</a>{" "}
                  &amp;{" "}
                  <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline">Terms</a>.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full font-semibold text-base bg-gradient-to-r from-primary to-[#ff4a4a] text-white shadow-[0_4px_15px_rgba(255,74,74,0.25)] transition-all duration-300 hover:opacity-95 disabled:opacity-75 disabled:cursor-not-allowed"
                disabled={status === "submitting" || status === "success"}
              >
                {status === "submitting" ? (
                  <span className="flex items-center justify-center gap-2">
                    <FaSpinner className="animate-spin" /> Verifying & Downloading...
                  </span>
                ) : status === "success" ? (
                  "Starting Download..."
                ) : (
                  "Submit & Download Brochure"
                )}
              </button>

              {status === "error" && (
                <p className="text-red-500 text-[0.9rem] text-center mt-3 font-semibold">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {mounted && isOpen ? createPortal(modalRender, document.body) : null}
    </>
  );
}
