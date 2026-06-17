"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCheckCircle, FaSpinner } from "react-icons/fa";

export default function ContactForm() {
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
    const emailVal = (formData.get("email") || "").trim();
    const phoneVal = (formData.get("phone") || "").trim();
    const messageVal = (formData.get("message") || "").trim();
    
    const newErrors = {};
    if (!/^[A-Za-z\s]{2,}$/.test(nameVal)) {
      newErrors.name = "Name must contain letters only (min 2 characters).";
    }
    if (!/^[0-9]{10}$/.test(phoneVal)) {
      newErrors.phone = "Enter a valid 10-digit mobile number.";
    }
    if (!messageVal) {
      newErrors.message = "Message field cannot be empty.";
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
      window.grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: 'contact_form' }).then(async function(token) {
        if (!token) {
          setErrors({ recaptcha: "reCAPTCHA verification failed." });
          setStatus("");
          return;
        }

        try {
          const res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              full_name: nameVal,
              email: emailVal,
              phone: phoneVal,
              message: messageVal,
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
            setErrors({ submit: data.error || "Submission failed. Please try again." });
          }
        } catch {
          setStatus("error");
          setErrors({ submit: "An unexpected error occurred. Please try again." });
        }
      });
    });
  };

  const inputClass =
    "w-full px-4 py-3.5 border border-border rounded-xl bg-[#f8f9fa] font-[inherit] text-[0.95rem] text-heading transition-all duration-300 focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 focus:bg-white";

  return (
    <div className="bg-white p-8 md:p-10 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-border w-full h-full flex flex-col">
      <div className="mb-7">
        <h3 className="text-[1.75rem] font-extrabold text-heading mb-1.5">
          Send Us a Message
        </h3>
        <p className="text-[0.92rem] font-medium text-body leading-relaxed">
          Fill out the form and our team will reply within 24 hours.
        </p>
      </div>

      {status === "success" ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
          <FaCheckCircle className="text-6xl text-green mx-auto mb-6" />
          <h3 className="text-2xl font-extrabold text-heading mb-2">
            Message Sent!
          </h3>
          <p className="text-body mb-6">
            Thank you for reaching out. We will get back to you shortly.
          </p>
          <button
            className="inline-flex items-center justify-center px-7 py-3 rounded-full font-semibold text-base text-heading border-[1.5px] border-border transition-all duration-300 hover:border-heading bg-transparent"
            onClick={() => setStatus("")}
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="flex-1 flex flex-col gap-5">
          {errors.submit && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-[0.9rem] font-medium border border-red-100">
              {errors.submit}
            </div>
          )}
          
          <div className="text-left">
            <label className="block font-semibold text-primary mb-2 text-[0.88rem]">
              Full Name *
            </label>
            <input
              type="text"
              name="full_name"
              placeholder="Your name"
              required
              onKeyDown={allowNameKey}
              className={`${inputClass} ${errors.name ? "border-red-400 focus:border-red-400 focus:ring-red-100" : ""}`}
            />
            {errors.name && <p className="text-red-500 text-[0.78rem] mt-1 ml-2">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="text-left">
              <label className="block font-semibold text-primary mb-2 text-[0.88rem]">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                required
                className={inputClass}
              />
            </div>

            <div className="text-left">
              <label className="block font-semibold text-primary mb-2 text-[0.88rem]">
                Phone Number *
              </label>
              <div className="flex gap-2 items-center">
                <div className="px-3 py-3.5 bg-[#f8f9fa] border border-border rounded-xl text-[0.9rem] font-bold text-heading shrink-0">
                  +91
                </div>
                <div className="flex-1 min-w-0">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="10-digit number"
                    required
                    maxLength={10}
                    onKeyDown={allowPhoneKey}
                    className={`${inputClass} ${errors.phone ? "border-red-400 focus:border-red-400 focus:ring-red-100" : ""}`}
                  />
                </div>
              </div>
              {errors.phone && <p className="text-red-500 text-[0.78rem] mt-1 ml-2">{errors.phone}</p>}
            </div>
          </div>

          <div className="text-left flex-1 flex flex-col">
            <label className="block font-semibold text-primary mb-2 text-[0.88rem]">
              Message *
            </label>
            <textarea
              name="message"
              placeholder="How can we help you?"
              rows={5}
              required
              className={`${inputClass} flex-1 resize-none ${errors.message ? "border-red-400 focus:border-red-400 focus:ring-red-100" : ""}`}
            ></textarea>
            {errors.message && <p className="text-red-500 text-[0.78rem] mt-1 ml-2">{errors.message}</p>}
          </div>

          <div className="pt-2 flex flex-col justify-start">
            {errors.recaptcha && <p className="text-red-500 text-[0.78rem] mb-2">{errors.recaptcha}</p>}
            <p className="text-[0.72rem] text-body/50">
              Protected by reCAPTCHA.{" "}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Privacy</a>{" "}
              &amp;{" "}
              <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Terms</a>.
            </p>
          </div>

          <div className="mt-auto pt-1">
            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full rounded-full py-4 px-8 font-bold text-[1rem] transition-all duration-300 bg-primary text-white hover:bg-primary-hover hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed border-none shadow-[0_8px_20px_rgba(255,68,68,0.25)]"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? (
                <span className="flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin-slow" /> Sending Message...
                </span>
              ) : (
                <span>Send Message</span>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
