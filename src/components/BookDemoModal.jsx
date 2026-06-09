"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { FaTimes, FaCheckCircle, FaSpinner } from "react-icons/fa";

export default function BookDemoModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});
  const [mounted, setMounted] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const TIME_SLOTS = [
    "11:30 am to 1:00 pm",
    "3:00 pm to 5:00 pm",
    "6:00 pm to 9:00 pm"
  ];

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

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    setMounted(true);
    const handleOpen = (e) => {
      if (e.detail && e.detail.courseName) {
        setCourseName(e.detail.courseName);
      } else {
        setCourseName("");
      }
      setIsOpen(true);
    };
    window.addEventListener("openBookDemo", handleOpen);
    return () => window.removeEventListener("openBookDemo", handleOpen);
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const nameVal = (formData.get("name") || "").trim();
    const phoneVal = (formData.get("phone") || "").trim();
    const newErrors = {};
    if (!/^[A-Za-z\s]{2,}$/.test(nameVal)) newErrors.name = "Name must contain letters only (min 2 characters).";
    if (!/^[0-9]{10}$/.test(phoneVal)) newErrors.phone = "Enter a valid 10-digit mobile number.";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    if (!window.grecaptcha) {
      setErrors({ recaptcha: "reCAPTCHA is not loaded yet. Please try again." });
      return;
    }
    setErrors({});
    setStatus("submitting");

    window.grecaptcha.ready(function() {
      window.grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, {action: 'book_demo'}).then(async function(token) {
        if (!token) {
          setErrors({ recaptcha: "reCAPTCHA verification failed." });
          setStatus("");
          return;
        }

        try {
          const dateVal = selectedDate || "";
          const timeVal = selectedTime || "";
          const combinedDateTime = dateVal && timeVal ? `${dateVal} at ${timeVal}` : "";

          const res = await fetch("/api/book-demo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: nameVal,
              email: formData.get("email"),
              phone: phoneVal,
              batch: combinedDateTime,
              message: formData.get("message"),
              courseName,
              recaptchaToken: token,
            }),
          });
          const data = await res.json();
          if (data.success) {
            setStatus("success");
            router.push("/thank-you");
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
    setTimeout(() => { if (status !== "submitting") setStatus(""); }, 300);
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
        className="bg-white w-full max-w-[460px] rounded-2xl p-7 relative shadow-[0_30px_70px_rgba(0,0,0,0.4)] border border-white/20 ring-1 ring-black/5 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 w-full h-[4px] bg-[#0B5CFF]" />
        <div className="absolute -inset-[50px] bg-[#0B5CFF]/5 rounded-full blur-3xl pointer-events-none" />
        <button
          className="absolute top-4 right-4 bg-none border-none text-body text-2xl cursor-pointer transition-colors duration-300 hover:text-[#0B5CFF]"
          onClick={closeModal}
          aria-label="Close"
        >
          <FaTimes />
        </button>

        {status === "success" ? (
          <div className="text-center py-8">
            <FaCheckCircle className="text-6xl text-green mx-auto mb-6" />
            <h3 className="text-[1.8rem] font-extrabold text-heading mb-2">
              Booking Confirmed!
            </h3>
            <p className="text-body text-lg mb-2">
              Your live demo session has been successfully booked.
            </p>
            <p className="text-[0.9rem] italic opacity-80 text-body mb-6">
              You&apos;ll receive WhatsApp reminders 24 hours and 1 hour before
              the session.
            </p>
            <button
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-full font-semibold text-base bg-[#0B5CFF] text-white shadow-[0_4px_15px_rgba(11,92,255,0.3)] transition-all duration-300 hover:bg-[#084BCE]"
              onClick={closeModal}
            >
              Close Details
            </button>
          </div>
        ) : (
          <div>
            <h3 className="text-[1.4rem] font-extrabold text-heading mb-1 text-center">
              Book Your Live Demo
            </h3>
            <p className="text-center text-[0.85rem] text-body mb-4">
              {courseName ? `For ${courseName} • At your preferred time` : "Reserve your spot."}
            </p>

            <form onSubmit={onSubmit} className="space-y-3">
              <div className="text-left">
                <label className="block font-semibold text-heading mb-1 text-[0.85rem]">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  required
                  onKeyDown={allowNameKey}
                  className={`w-full px-3.5 py-2.5 border rounded-lg bg-surface font-[inherit] text-[0.95rem] text-heading transition-all duration-300 focus:outline-none focus:ring-[3px] focus:bg-white ${errors.name ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-border focus:border-[#0B5CFF] focus:ring-[#0B5CFF]/10"}`}
                />
                {errors.name && <p className="text-red-500 text-[0.78rem] mt-1 ml-1">{errors.name}</p>}
              </div>

              <div className="text-left">
                <label className="block font-semibold text-heading mb-1 text-[0.85rem]">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  className="w-full px-3.5 py-2.5 border border-border rounded-lg bg-surface font-[inherit] text-[0.95rem] text-heading transition-all duration-300 focus:outline-none focus:border-[#0B5CFF] focus:ring-[3px] focus:ring-[#0B5CFF]/10 focus:bg-white"
                />
              </div>

              <div className="text-left">
                <label className="block font-semibold text-heading mb-1 text-[0.85rem]">
                  Phone (WhatsApp) *
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  required
                  maxLength={10}
                  onKeyDown={allowPhoneKey}
                  className={`w-full px-3.5 py-2.5 border rounded-lg bg-surface font-[inherit] text-[0.95rem] text-heading transition-all duration-300 focus:outline-none focus:ring-[3px] focus:bg-white ${errors.phone ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-border focus:border-[#0B5CFF] focus:ring-[#0B5CFF]/10"}`}
                />
                {errors.phone && <p className="text-red-500 text-[0.78rem] mt-1 ml-1">{errors.phone}</p>}
              </div>

              <div className="flex gap-3 text-left">
                <div className="flex-1 min-w-0">
                  <label className="block font-semibold text-heading mb-1 text-[0.85rem]">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    value={selectedDate || ""}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3.5 py-0 border border-[#E2E8F0] rounded-lg bg-[#F8F9FA] font-[inherit] text-[0.95rem] text-heading transition-all duration-300 focus:outline-none focus:border-[#0B5CFF] focus:ring-[3px] focus:ring-[#0B5CFF]/10 focus:bg-white h-[46px] appearance-none cursor-pointer"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="block font-semibold text-heading mb-1 text-[0.85rem]">
                    Preferred Time *
                  </label>
                  <select
                    value={selectedTime || ""}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    required
                    className="w-full px-3.5 py-0 border border-[#E2E8F0] rounded-lg bg-[#F8F9FA] font-[inherit] text-[0.95rem] text-heading transition-all duration-300 focus:outline-none focus:border-[#0B5CFF] focus:ring-[3px] focus:ring-[#0B5CFF]/10 focus:bg-white h-[46px] appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 0.875rem center",
                      backgroundSize: "1.25rem",
                      paddingRight: "2.5rem"
                    }}
                  >
                    <option value="" disabled>Select time</option>
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-left">
                <label className="block font-semibold text-heading mb-1 text-[0.85rem]">
                  Questions (Optional)
                </label>
                <textarea
                  name="message"
                  placeholder="Any specific questions you'd like answered?"
                  rows="2"
                  className="w-full px-3.5 py-2.5 border border-border rounded-lg bg-surface font-[inherit] text-[0.95rem] text-heading transition-all duration-300 focus:outline-none focus:border-[#0B5CFF] focus:ring-[3px] focus:ring-[#0B5CFF]/10 focus:bg-white resize-y"
                />
              </div>

              <div className="text-left mt-2">
                {errors.recaptcha && <p className="text-red-500 text-[0.78rem] mt-1 ml-1">{errors.recaptcha}</p>}
                <p className="text-[0.72rem] text-body/50 mt-2">
                  Protected by reCAPTCHA.{" "}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">Privacy</a>{" "}
                  &amp;{" "}
                  <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline">Terms</a>.
                </p>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3.5 rounded-full font-semibold text-base bg-[#0B5CFF] text-white shadow-[0_4px_15px_rgba(11,92,255,0.3)] transition-all duration-300 hover:bg-[#084BCE] disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={status === "submitting"}
              >
                {status === "submitting" ? (
                  <span className="flex items-center justify-center gap-2">
                    <FaSpinner className="animate-spin-slow" /> Booking...
                  </span>
                ) : (
                  "Confirm Booking"
                )}
              </button>

              {status === "error" && (
                <p className="text-red-500 text-[0.9rem] text-center mt-4 font-semibold">
                  Something went wrong. Please try again.
                </p>
              )}

              <p className="text-center text-[0.85rem] text-body italic mt-3">
                You&apos;ll receive WhatsApp reminders 24 hours and 1 hour
                before the session.
              </p>
            </form>
          </div>
        )}
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
