"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCheckCircle, FaSpinner, FaShieldAlt } from "react-icons/fa";
import { INNER_PAGE } from "@/lib/designLanguage";

export default function ApplyEasyForm({ jobTitle = "", companyName = "", jobSlug = "" }) {
  const router = useRouter();
  const [status, setStatus] = useState(""); // "" | "submitting" | "success" | "error"
  const [errorMessage, setErrorMessage] = useState("");

  const allowNameKey = (e) => {
    const allowed = ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "Home", "End", " ", ".", "-", "'"];
    if (allowed.includes(e.key)) return;
    if (e.ctrlKey || e.metaKey) return;
    if (!/^[a-zA-Z]$/.test(e.key)) e.preventDefault();
  };

  const allowPhoneKey = (e) => {
    const allowed = ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "Home", "End", "+"];
    if (allowed.includes(e.key)) return;
    if (e.ctrlKey || e.metaKey) return;
    if (!/^[0-9]$/.test(e.key)) e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const formData = new FormData(e.target);
    const name = (formData.get("name") || "").trim();
    const email = (formData.get("email") || "").trim();
    const phone = (formData.get("phone") || "").trim();
    const message = (formData.get("message") || "").trim();

    if (!name) {
      setErrorMessage("Please enter your name.");
      return;
    }
    if (!phone) {
      setErrorMessage("Please enter your phone number.");
      return;
    }

    setStatus("submitting");

    // Attempt recaptcha token execution if available
    let recaptchaToken = "";
    if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
      if (!window.grecaptcha) {
        for (let i = 0; i < 25; i++) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          if (window.grecaptcha) break;
        }
      }

      if (window.grecaptcha?.ready && window.grecaptcha?.execute) {
        try {
          recaptchaToken = await new Promise((resolve) => {
            window.grecaptcha.ready(async () => {
              try {
                const token = await window.grecaptcha.execute(
                  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
                  { action: "job_application" }
                );
                resolve(token);
              } catch (err) {
                console.warn("[ApplyEasyForm] reCAPTCHA exec error:", err);
                resolve("");
              }
            });
          });
        } catch (err) {
          console.warn("[ApplyEasyForm] reCAPTCHA load error:", err);
        }
      }
    }

    if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && !recaptchaToken) {
      setStatus("error");
      setErrorMessage("reCAPTCHA verification failed. Please refresh and try again.");
      return;
    }

    try {
      const res = await fetch("/api/job-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          message,
          jobTitle,
          companyName,
          jobSlug,
          recaptchaToken,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus("success");
        e.target.reset();
        router.push("/thank-you");
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Failed to submit application. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("An unexpected network error occurred. Please try again.");
    }
  };

  const inputClass =
    "w-full px-3.5 py-3 border border-[#d1d5db] rounded-lg bg-white font-[inherit] text-[0.95rem] text-heading placeholder:text-body/50 transition-all duration-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10";

  return (
    <div className={`${INNER_PAGE.card} p-6`}>
      <h3 className="text-[1.5rem] font-bold text-heading mb-4 tracking-tight">
        Apply Easy!
      </h3>

      {status === "success" ? (
        <div className="text-center py-6">
          <FaCheckCircle className="text-4xl text-green-600 mx-auto mb-3" />
          <h4 className="text-[1.15rem] font-bold text-heading mb-1.5">
            Application Submitted!
          </h4>
          <p className="text-[0.88rem] text-body mb-5 leading-relaxed">
            Thank you for applying{jobTitle ? ` for ${jobTitle}` : ""}. Our placement cell will review your details and connect with you shortly.
          </p>
          <button
            type="button"
            onClick={() => setStatus("")}
            className="px-5 py-2 rounded-lg text-sm font-semibold border border-border hover:border-heading text-heading transition-colors"
          >
            Submit Another Response
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Name"
              required
              onKeyDown={allowNameKey}
              className={inputClass}
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className={inputClass}
            />
          </div>

          <div>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              required
              maxLength={10}
              onKeyDown={allowPhoneKey}
              className={inputClass}
            />
          </div>

          <div>
            <textarea
              name="message"
              placeholder="Message"
              rows={4}
              className={`${inputClass} resize-y min-h-[90px]`}
            />
          </div>

          {errorMessage && (
            <p className="text-red-500 text-xs font-medium">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-[0.95rem] shadow-glow hover:shadow-glow-hover transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
          >
            {status === "submitting" ? (
              <>
                <FaSpinner className="animate-spin text-sm" />
                Submitting...
              </>
            ) : (
              "Apply Now"
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
