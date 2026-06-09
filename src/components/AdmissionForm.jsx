"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCheckCircle, FaSpinner, FaArrowRight } from "react-icons/fa";


export default function AdmissionForm({ showHeader = true }) {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});


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

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const nameVal = (formData.get("full_name") || "").trim();
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
      window.grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, {action: 'admission_form'}).then(async function(token) {
        if (!token) {
          setErrors({ recaptcha: "reCAPTCHA verification failed." });
          setStatus("");
          return;
        }

        try {
          const res = await fetch("/api/admission", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              full_name: nameVal,
              email: formData.get("email"),
              phone: phoneVal,
              recaptchaToken: token,
            }),
          });
          const data = await res.json();
          if (data.success) {
            setStatus("success");
            event.target.reset();
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

  const inputClass =
    "w-full px-4 py-3.5 border border-border rounded-xl bg-[#f8f9fa] font-[inherit] text-[0.95rem] text-heading transition-all duration-300 focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 focus:bg-white";

  return (
    <div id="apply" className="bg-white p-8 md:p-12 rounded-[20px] shadow-[0_20px_40px_rgba(0,0,0,0.04)] w-full max-w-[480px] lg:max-w-none lg:flex-[0_0_480px] max-lg:p-8 scroll-mt-24">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-[2.2rem] max-sm:text-[1.75rem] font-extrabold text-[#0f1629] mb-3.5">
          Enquiry Form
        </h2>
        <p className="text-[1.05rem] font-medium text-[#5c6475] leading-relaxed max-w-[600px] mx-auto">
          Fill out this quick form to receive course details, fees, and expert guidance.
        </p>
      </div>

      {status === "success" ? (
        <div className="text-center py-8">
          <FaCheckCircle className="text-6xl text-green mx-auto mb-6" />
          <h3 className="text-2xl font-extrabold text-heading mb-2">
            Request Received!
          </h3>
          <p className="text-body mb-4">
            Your details have been successfully submitted.
          </p>
          <p className="text-[0.9rem] italic opacity-80 text-body mb-6">
            Our career counsellor will contact you shortly.
          </p>
          <button
            className="inline-flex items-center justify-center px-7 py-3 rounded-full font-semibold text-base text-heading border-[1.5px] border-border transition-all duration-300 hover:border-heading bg-transparent"
            onClick={() => setStatus("")}
          >
            Submit Another Request
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="text-left">
              <label className="block font-semibold text-primary mb-2 text-[0.9rem]">
                Name *
              </label>
              <input
                type="text"
                name="full_name"
                placeholder="Full Name"
                required
                onKeyDown={allowNameKey}
                className={`${inputClass} ${errors.name ? "border-red-400 focus:border-red-400 focus:ring-red-100" : ""}`}
              />
              {errors.name && <p className="text-red-500 text-[0.78rem] mt-1 ml-3">{errors.name}</p>}
            </div>

            <div className="text-left">
              <label className="block font-semibold text-primary mb-2 text-[0.9rem]">
                Email *
              </label>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                className={inputClass}
              />
            </div>

            <div className="text-left md:col-span-2">
              <label className="block font-semibold text-primary mb-2 text-[0.9rem]">
                Phone *
              </label>
              <div className="flex gap-2 items-center">
                <div className="px-4 py-3.5 bg-[#f8f9fa] border border-border rounded-xl text-[0.95rem] font-semibold flex gap-2 items-center text-heading shrink-0">
                  +91 <span className="scale-y-[0.7] text-body">v</span>
                </div>
                <div className="flex-1 min-w-0">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    required
                    maxLength={10}
                    onKeyDown={allowPhoneKey}
                    className={`${inputClass} ${errors.phone ? "border-red-400 focus:border-red-400 focus:ring-red-100" : ""}`}
                  />
                </div>
              </div>
              {errors.phone && <p className="text-red-500 text-[0.78rem] mt-1 ml-3">{errors.phone}</p>}
            </div>
          </div>

          <div className="mt-4 flex flex-col justify-start">
            {errors.recaptcha && <p className="text-red-500 text-[0.78rem] mt-1">{errors.recaptcha}</p>}
            <p className="text-[0.72rem] text-body/50">
              Protected by reCAPTCHA.{" "}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">Privacy</a>{" "}
              &amp;{" "}
              <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline">Terms</a>.
            </p>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="mt-auto flex items-center justify-center gap-2 w-full rounded-full py-4 px-8 font-bold text-[1rem] transition-all duration-300 bg-primary text-white hover:bg-primary-hover hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed border-none shadow-[0_8px_20px_rgba(255,68,68,0.25)]"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? (
                <span className="flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin-slow" /> Submitting...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Apply Now
                </span>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}