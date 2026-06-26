"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { FaBriefcase, FaBuilding, FaMapMarkerAlt, FaPhoneAlt, FaCheckCircle, FaSpinner, FaStar } from "react-icons/fa";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const WhatsAppFloat = dynamic(() => import("../../components/WhatsAppFloat"));

/* ── field helpers ────────────────────────────── */
const allowPhoneKey = (e) => {
  const ok = ["Backspace","Delete","Tab","ArrowLeft","ArrowRight","Home","End"];
  if (ok.includes(e.key)) return;
  if (!/^[0-9]$/.test(e.key)) e.preventDefault();
};

const Label = ({ children, required }) => (
  <label className="block font-semibold text-[#222831] mb-1.5 text-[0.88rem]">
    {children}{required && <span className="text-primary ml-0.5">*</span>}
  </label>
);

const inputCls = (err) =>
  `w-full px-4 py-3 border rounded-xl bg-white font-[inherit] text-[0.95rem] text-[#222831] transition-all duration-200 focus:outline-none focus:ring-[3px] ${
    err
      ? "border-red-400 focus:border-red-400 focus:ring-red-100"
      : "border-[#e2e8f0] focus:border-primary focus:ring-primary/10"
  }`;

/* ── checkbox pill ────────────────────────────── */
function Pill({ label, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`px-4 py-2 rounded-full text-[0.85rem] font-semibold border transition-all duration-200 cursor-pointer ${
        checked
          ? "bg-primary text-white border-primary shadow-sm"
          : "bg-white text-[#555] border-[#e2e8f0] hover:border-primary/50 hover:text-primary"
      }`}
    >
      {label}
    </button>
  );
}

const JOB_TYPES   = ["Full-time", "Part-time", "Internship", "Freelance", "Remote", "Hybrid"];
const SHIFTS      = ["Morning Shift", "Evening Shift", "Night Shift", "Rotational", "Flexible"];

export default function PostYourJobPage() {
  const [form, setForm] = useState({
    companyName: "", jobTitle: "", phone: "", location: "",
    aboutCompany: "", skillsRequired: "", eligibility: "",
    jobTypes: [], shiftSchedule: [],
  });
  const [errors, setErrors]   = useState({});
  const [status, setStatus]   = useState(""); // "" | "submitting" | "success" | "error"

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const togglePill = (field, val) =>
    setForm((prev) => {
      const arr = prev[field];
      return {
        ...prev,
        [field]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val],
      };
    });

  const validate = () => {
    const e = {};
    if (!form.companyName.trim()) e.companyName = "Company name is required.";
    if (!form.jobTitle.trim())    e.jobTitle    = "Job title is required.";
    if (!/^[0-9]{10}$/.test(form.phone)) e.phone = "Enter a valid 10-digit phone number.";
    return e;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    if (!window.grecaptcha) {
      setErrors({ recaptcha: "reCAPTCHA not loaded. Please refresh and try again." });
      return;
    }

    setErrors({});
    setStatus("submitting");

    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: "post_job" })
        .then(async (token) => {
          if (!token) { setErrors({ recaptcha: "reCAPTCHA failed." }); setStatus(""); return; }

          try {
            const res = await fetch("/api/post-job", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...form,
                jobTypes: form.jobTypes.join(", "),
                shiftSchedule: form.shiftSchedule.join(", "),
                recaptchaToken: token,
              }),
            });
            const data = await res.json();
            setStatus(data.success ? "success" : "error");
          } catch {
            setStatus("error");
          }
        });
    });
  };

  return (
    <>
      <Navbar />
      <main className="bg-surface min-h-screen">

        {/* ── HERO BANNER ── */}
        <section className="relative pt-24 pb-16 md:pt-28 md:pb-24 bg-surface bg-grid-pattern overflow-hidden border-b border-border">
          <Image
            src="/courses/courss.webp"
            alt="Zeon Academy Courses Banner"
            fill
            priority
            className="object-cover object-center opacity-100 pointer-events-none"
          />
          {/* Decorative orbs */}
          <div className="absolute top-10 left-10 w-[200px] h-[200px] bg-primary/10 rounded-full blur-3xl z-0 animate-pulse-glow" />
          <div className="absolute -bottom-10 right-10 w-[250px] h-[250px] bg-[#ff8c4a]/10 rounded-full blur-3xl z-0 animate-pulse-glow" />

          <div className="w-full max-w-[1200px] mx-auto px-6 relative z-10 text-center animate-fade-in-up">
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2.5 text-[0.88rem] font-semibold text-body mb-5">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <span className="text-border">/</span>
              <span className="text-primary font-bold">Post Your Job</span>
            </div>

            <div className="max-w-3xl mx-auto">
              <span className="inline-block text-primary text-[0.85rem] font-semibold mb-4 tracking-[0.2em] uppercase">
                For Employers
              </span>
              <h1 className="text-[clamp(2.5rem,5vw,3.6rem)] font-extrabold leading-[1.15] text-heading mb-6 tracking-tight">
                Find Top Talent!{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#ff4a4a] to-[#ff8c4a] drop-shadow-sm">
                  Post Your Job
                </span>
              </h1>
              <p className="text-[1.15rem] text-body leading-relaxed font-medium max-w-2xl mx-auto mb-8">
                List your job openings here. Connect with the best digital marketing talent in Kerala. Zeon Academy is the leading placement provider for digital marketing professionals in Kochi.
              </p>

              <div className="flex items-center justify-center gap-1.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-[#fbbf24] text-xl" />
                ))}
              </div>
              <p className="text-body text-[0.9rem] font-semibold">
                Rated 4.9 on Google — Kerala's Most Loved Digital Marketing Institute
              </p>
            </div>
          </div>
        </section>

        {/* ── TRUST STRIP / STATS ── */}
        <section className="bg-surface border-b border-border py-8">
          <div className="w-full max-w-[1200px] mx-auto px-6">
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              {[
                { value: "500+", label: "Successful Placements" },
                { value: "100+", label: "Hiring Partners" },
                { value: "Kochi & Across Kerala", label: "Talent Pool" },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-[2rem] font-extrabold text-heading leading-none mb-1">{s.value}</p>
                  <p className="text-[0.88rem] font-semibold text-body">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FORM SECTION ── */}
        <section className="py-14 md:py-20">
          <div className="w-full max-w-[780px] mx-auto px-5">

            {status === "success" ? (
              /* ── SUCCESS STATE ── */
              <div className="bg-white rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-[#e2e8f0] p-10 text-center">
                <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-5">
                  <FaCheckCircle className="text-green-500 text-3xl" />
                </div>
                <h2 className="text-[1.8rem] font-extrabold text-[#222831] mb-3">Job Posted Successfully!</h2>
                <p className="text-[#555] text-[1rem] leading-relaxed mb-7 max-w-md mx-auto">
                  Thank you! Our placement team will review your listing and get in touch with you shortly.
                </p>
                <Link
                  href="/placements"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-white font-bold text-[0.95rem] hover:bg-primary/90 transition-all duration-300 shadow-[0_4px_20px_rgba(255,68,68,0.25)]"
                >
                  View Placement Cell
                </Link>
              </div>
            ) : (
              /* ── FORM ── */
              <form
                onSubmit={onSubmit}
                noValidate
                className="bg-white rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-[#e2e8f0] overflow-hidden"
              >
                {/* Form header */}
                <div className="bg-gradient-to-r from-[#222831] to-[#2d3748] px-8 py-6 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <FaBriefcase className="text-primary" size={18} />
                  </div>
                  <div>
                    <h2 className="text-white font-extrabold text-[1.15rem] leading-tight">Job Listing Form</h2>
                    <p className="text-[#c3c8cf] text-[0.82rem] mt-0.5">Fill in the details below — marked with * are required</p>
                  </div>
                </div>

                <div className="p-8 space-y-6">

                  {/* Row 1 — Company & Job Title */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label required>Company Name</Label>
                      <div className="relative">
                        <FaBuilding className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#aaa] text-sm" />
                        <input
                          type="text"
                          placeholder="e.g. Acme Digital Pvt. Ltd."
                          value={form.companyName}
                          onChange={set("companyName")}
                          className={inputCls(errors.companyName) + " pl-9"}
                        />
                      </div>
                      {errors.companyName && <p className="text-red-500 text-[0.78rem] mt-1">{errors.companyName}</p>}
                    </div>
                    <div>
                      <Label required>Job Title</Label>
                      <div className="relative">
                        <FaBriefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#aaa] text-sm" />
                        <input
                          type="text"
                          placeholder="e.g. Digital Marketing Executive"
                          value={form.jobTitle}
                          onChange={set("jobTitle")}
                          className={inputCls(errors.jobTitle) + " pl-9"}
                        />
                      </div>
                      {errors.jobTitle && <p className="text-red-500 text-[0.78rem] mt-1">{errors.jobTitle}</p>}
                    </div>
                  </div>

                  {/* Row 2 — Phone & Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label required>Phone Number</Label>
                      <div className="relative">
                        <FaPhoneAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#aaa] text-sm" />
                        <input
                          type="tel"
                          placeholder="10-digit mobile number"
                          value={form.phone}
                          onChange={set("phone")}
                          onKeyDown={allowPhoneKey}
                          maxLength={10}
                          className={inputCls(errors.phone) + " pl-9"}
                        />
                      </div>
                      {errors.phone && <p className="text-red-500 text-[0.78rem] mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                      <Label>Location</Label>
                      <div className="relative">
                        <FaMapMarkerAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#aaa] text-sm" />
                        <input
                          type="text"
                          placeholder="e.g. Kochi, Kerala"
                          value={form.location}
                          onChange={set("location")}
                          className={inputCls(false) + " pl-9"}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <hr className="border-[#f0f0f0]" />

                  {/* About Company */}
                  <div>
                    <Label>About the Company</Label>
                    <textarea
                      placeholder="Brief description of your company, what you do, your mission..."
                      value={form.aboutCompany}
                      onChange={set("aboutCompany")}
                      rows={4}
                      className={inputCls(false) + " resize-y"}
                    />
                  </div>

                  {/* Skills Required */}
                  <div>
                    <Label>Skills Required</Label>
                    <textarea
                      placeholder="e.g. SEO, Google Ads, Meta Ads, Content Writing, Analytics..."
                      value={form.skillsRequired}
                      onChange={set("skillsRequired")}
                      rows={3}
                      className={inputCls(false) + " resize-y"}
                    />
                  </div>

                  {/* Eligibility */}
                  <div>
                    <Label>Eligibility</Label>
                    <textarea
                      placeholder="e.g. Any graduate, Digital Marketing certification preferred, 0–2 years experience..."
                      value={form.eligibility}
                      onChange={set("eligibility")}
                      rows={3}
                      className={inputCls(false) + " resize-y"}
                    />
                  </div>

                  {/* Divider */}
                  <hr className="border-[#f0f0f0]" />

                  {/* Job Types */}
                  <div>
                    <Label>Job Types</Label>
                    <div className="flex flex-wrap gap-2.5 mt-1">
                      {JOB_TYPES.map((t) => (
                        <Pill
                          key={t}
                          label={t}
                          checked={form.jobTypes.includes(t)}
                          onChange={() => togglePill("jobTypes", t)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Shift & Schedule */}
                  <div>
                    <Label>Shift &amp; Schedule</Label>
                    <div className="flex flex-wrap gap-2.5 mt-1">
                      {SHIFTS.map((s) => (
                        <Pill
                          key={s}
                          label={s}
                          checked={form.shiftSchedule.includes(s)}
                          onChange={() => togglePill("shiftSchedule", s)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* reCAPTCHA error */}
                  {errors.recaptcha && (
                    <p className="text-red-500 text-[0.82rem]">{errors.recaptcha}</p>
                  )}

                  {/* Submit */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="w-full py-4 rounded-2xl font-extrabold text-[1rem] text-white bg-gradient-to-r from-primary to-[#ff4a4a] shadow-[0_6px_24px_rgba(255,68,68,0.25)] hover:opacity-95 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {status === "submitting" ? (
                        <span className="flex items-center justify-center gap-2">
                          <FaSpinner className="animate-spin" /> Submitting…
                        </span>
                      ) : (
                        "Submit Job Listing"
                      )}
                    </button>

                    {status === "error" && (
                      <p className="text-red-500 text-[0.88rem] text-center mt-3 font-semibold">
                        Something went wrong. Please try again.
                      </p>
                    )}

                    <p className="text-[#aaa] text-[0.72rem] text-center mt-4 leading-relaxed">
                      🔒 Protected by reCAPTCHA. Your listing will be reviewed by our placement team before going live.
                    </p>
                  </div>
                </div>
              </form>
            )}
          </div>
        </section>

      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
