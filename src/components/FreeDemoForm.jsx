"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCheckCircle, FaSpinner, FaShieldAlt } from "react-icons/fa";

export default function FreeDemoForm({ courseName = "Advanced Digital Marketing Course" }) {
  const router = useRouter();
  const [status, setStatus] = useState(""); // "" | "submitting" | "success" | "error"
  const [errors, setErrors] = useState({});

  const allowNameKey = (e) => {
    const allowed = ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "Home", "End", " "];
    if (allowed.includes(e.key)) return;
    if (e.ctrlKey || e.metaKey) return;
    if (!/^[a-zA-Z]$/.test(e.key)) e.preventDefault();
  };

  const allowPhoneKey = (e) => {
    const allowed = ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "Home", "End"];
    if (allowed.includes(e.key)) return;
    if (e.ctrlKey || e.metaKey) return;
    if (!/^[0-9]$/.test(e.key)) e.preventDefault();
  };

  const getRecaptchaToken = async () => {
    if (typeof window === "undefined") return null;
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (!siteKey) return null;

    // If grecaptcha is not yet available, wait up to 2.5 seconds
    if (!window.grecaptcha) {
      for (let i = 0; i < 25; i++) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        if (window.grecaptcha) break;
      }
    }

    if (!window.grecaptcha?.ready || !window.grecaptcha?.execute) return null;

    return new Promise((resolve) => {
      window.grecaptcha.ready(async () => {
        try {
          const token = await window.grecaptcha.execute(siteKey, { action: "course_demo" });
          resolve(token);
        } catch (err) {
          console.warn("[FreeDemoForm] reCAPTCHA exec error:", err);
          resolve(null);
        }
      });
    });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const nameVal = (formData.get("full_name") || "").trim();
    const emailVal = (formData.get("email") || "").trim();
    const phoneVal = (formData.get("phone") || "").trim();
    const cityVal = (formData.get("city") || "").trim();
    const newErrors = {};

    if (!/^[A-Za-z\s]{2,}$/.test(nameVal)) {
      newErrors.name = "Enter a valid full name.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!/^[0-9]{10}$/.test(phoneVal)) {
      newErrors.phone = "Enter a valid 10-digit phone number.";
    }
    if (!cityVal) {
      newErrors.city = "Please enter your city.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStatus("submitting");

    try {
      const recaptchaToken = await getRecaptchaToken();

      if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && !recaptchaToken) {
        setErrors({ submit: "reCAPTCHA verification failed. Please refresh and try again." });
        setStatus("error");
        return;
      }

      const res = await fetch("/api/book-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameVal,
          email: emailVal,
          phone: phoneVal,
          city: cityVal,
          courseName,
          recaptchaToken: recaptchaToken || "",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus("success");
        event.target.reset();
        router.push("/thank-you");
      } else {
        setStatus("error");
        setErrors({ submit: data.error || "Failed to submit. Please try again." });
      }
    } catch {
      setStatus("error");
      setErrors({ submit: "An unexpected error occurred. Please try again." });
    }
  };

  const inputClass =
    "w-full px-4 py-3 border border-border rounded-xl bg-[#f8f9fa] font-[inherit] text-[0.95rem] text-heading transition-all duration-300 focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 focus:bg-white";

  return (
    <div className="bg-white p-6 rounded-2xl shadow-card border border-border">
      <div className="text-center mb-6">
        <h3 className="text-[1.5rem] font-extrabold text-heading mb-2">
          Free Demo Class
        </h3>
        <p className="text-[0.95rem] text-body font-medium">
          Register now to attend a free session.
        </p>
      </div>

      {status === "success" ? (
        <div className="text-center py-6">
          <FaCheckCircle className="text-5xl text-green mx-auto mb-4" />
          <h4 className="text-xl font-bold text-heading mb-2">
            Registration Successful!
          </h4>
          <p className="text-[0.9rem] text-body mb-4">
            We will contact you shortly with the demo class details.
          </p>
          <button
            className="px-6 py-2 rounded-full font-semibold text-sm text-heading border border-border hover:border-heading transition-all"
            onClick={() => setStatus("")}
          >
            Register Another
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="full_name"
              placeholder="Name*"
              required
              onKeyDown={allowNameKey}
              className={`${inputClass} ${errors.name ? "border-red-400" : ""}`}
            />
            {errors.name && <p className="text-red-500 text-[0.75rem] mt-1 ml-2">{errors.name}</p>}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email*"
              required
              className={`${inputClass} ${errors.email ? "border-red-400" : ""}`}
            />
            {errors.email && <p className="text-red-500 text-[0.75rem] mt-1 ml-2">{errors.email}</p>}
          </div>

          <div>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number*"
              required
              maxLength={10}
              onKeyDown={allowPhoneKey}
              className={`${inputClass} ${errors.phone ? "border-red-400" : ""}`}
            />
            {errors.phone && <p className="text-red-500 text-[0.75rem] mt-1 ml-2">{errors.phone}</p>}
          </div>

          <div>
            <input
              type="text"
              name="city"
              placeholder="City*"
              required
              className={`${inputClass} ${errors.city ? "border-red-400" : ""}`}
            />
            {errors.city && <p className="text-red-500 text-[0.75rem] mt-1 ml-2">{errors.city}</p>}
          </div>

          {errors.submit && (
            <p className="text-red-500 text-[0.8rem] text-center font-medium">{errors.submit}</p>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 px-6 font-bold text-[1rem] transition-all duration-300 bg-primary text-white hover:bg-primary-hover shadow-glow disabled:opacity-70 mt-2 cursor-pointer"
            disabled={status === "submitting"}
          >
            {status === "submitting" ? (
              <span className="flex items-center gap-2">
                <FaSpinner className="animate-spin-slow" /> Submitting...
              </span>
            ) : (
              "Submit"
            )}
          </button>

          <p className="text-[0.72rem] text-slate-400 text-center flex items-center justify-center gap-1.5 pt-1">
            <FaShieldAlt className="text-slate-400 text-[0.7rem]" />
            <span>Protected by Google reCAPTCHA</span>
          </p>
        </form>
      )}
    </div>
  );
}
