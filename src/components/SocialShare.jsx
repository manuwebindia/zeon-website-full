'use client';

import React, { useState, useEffect } from 'react';

// Bulletproof Inline SVG Assets to avoid Lucide package version conflicts
const FacebookIcon = () => (
  <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
    <path d="M9 8H7v3h2v9h4v-9h3.6l.4-3H13V6c0-.5.5-1 1-1h3V2h-3c-3 0-5 2-5 5v1z" />
  </svg>
);

const XIcon = () => (
  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const LinkIcon = () => (
  <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

const CheckIcon = () => (
  <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

export default function SocialShare({ title = '' }) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href);
    }
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy share link:', err);
    }
  };

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  return (
    <>
      {/* 1. DESKTOP STICKY VERTICAL DOCK (Hidden on Mobile) */}
      <div className="hidden lg:flex flex-col items-center gap-4 sticky top-36 z-20 select-none">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 rotate-180 writing-mode-vertical py-2 border-b border-slate-100">
          Share
        </span>

        {/* Facebook */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 border border-slate-100 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] hover:shadow-md"
          title="Share on Facebook"
        >
          <FacebookIcon />
        </a>

        {/* X / Twitter */}
        <a
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 border border-slate-100 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-900 hover:text-white hover:border-slate-900 hover:shadow-md"
          title="Share on X"
        >
          <XIcon />
        </a>

        {/* LinkedIn */}
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 border border-slate-100 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] hover:shadow-md"
          title="Share on LinkedIn"
        >
          <LinkedinIcon />
        </a>

        {/* Copy Link */}
        <button
          onClick={handleCopy}
          className={`relative flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
            copied
              ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
              : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
          }`}
          title="Copy post link"
        >
          {copied ? <CheckIcon /> : <LinkIcon />}
          
          {/* Custom micro Tooltip popover */}
          {copied && (
            <span className="absolute left-12 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-[10px] font-bold text-white shadow-md animate-fade-in">
              Copied!
            </span>
          )}
        </button>
      </div>

      {/* 2. MOBILE FLOATING HORIZONTAL BAR (Fixed at bottom, hidden on Desktop) */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-md rounded-full px-5 py-3 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center gap-5">
        <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 border-r border-slate-100 pr-3">
          Share
        </span>

        {/* Facebook */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-500 active:scale-95 transition-transform"
        >
          <FacebookIcon />
        </a>

        {/* X / Twitter */}
        <a
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-500 active:scale-95 transition-transform"
        >
          <XIcon />
        </a>

        {/* LinkedIn */}
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-500 active:scale-95 transition-transform"
        >
          <LinkedinIcon />
        </a>

        {/* Copy Link */}
        <button
          onClick={handleCopy}
          className={`relative text-slate-500 active:scale-95 transition-transform ${
            copied ? 'text-emerald-600' : 'text-slate-500'
          }`}
        >
          {copied ? <CheckIcon /> : <LinkIcon />}
          
          {copied && (
            <span className="absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-2.5 py-1 text-[10px] font-bold text-white shadow-lg animate-bounce">
              Copied!
            </span>
          )}
        </button>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .writing-mode-vertical {
            writing-mode: vertical-rl;
          }
        `
      }} />
    </>
  );
}
