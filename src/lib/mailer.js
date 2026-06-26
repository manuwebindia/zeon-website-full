// src/lib/mailer.js
// Shared Nodemailer transporter. Configure via .env.local SMTP_* variables.

import nodemailer from 'nodemailer';

// Create transporter lazily (singleton-ish via module cache)
const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   Number(process.env.SMTP_PORT)  || 587,
  secure: process.env.SMTP_SECURE === 'true', // true → port 465, false → STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default transporter;
