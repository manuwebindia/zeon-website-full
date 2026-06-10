"use client";

import React, { useState } from "react";
import { FaCheckCircle, FaSpinner } from "react-icons/fa";

export default function FreeDemoForm() {
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
    
    if (!/^[A-Za-z\s]{2,}$/.test(nameVal)) newErrors.name = "Enter a valid name.";
    if (!/^[0-9]{10}$/.test(phoneVal)) newErrors.phone = "Enter a valid 10-digit number.";
    
    if (Object.keys(newErrors).length > 0) { 
      setErrors(newErrors); 
      return; 
    }
    
    setErrors({});
    setStatus("submitting");

    // Simulate API call for the demo form
    setTimeout(() => {
      setStatus("success");
      event.target.reset();
    }, 1000);
  };

  const inputClass = "w-full px-4 py-3 border border-border rounded-xl bg-[#f8f9fa] font-[inherit] text-[0.95rem] text-heading transition-all duration-300 focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 focus:bg-white";

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
              className={inputClass}
            />
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
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 px-6 font-bold text-[1rem] transition-all duration-300 bg-primary text-white hover:bg-primary-hover shadow-glow disabled:opacity-70 mt-2"
            disabled={status === "submitting"}
          >
            {status === "submitting" ? (
              <span className="flex items-center gap-2"><FaSpinner className="animate-spin-slow" /> Submitting...</span>
            ) : "Submit"}
          </button>
        </form>
      )}
    </div>
  );
}
