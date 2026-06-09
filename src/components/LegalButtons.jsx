"use client";

const links = [
  { label: "Privacy Policy",   key: "privacy" },
  { label: "Terms of Service", key: "terms"   },
];

export default function LegalButtons() {
  const open = (key) =>
    window.dispatchEvent(new CustomEvent("openLegal", { detail: key }));

  return (
    <div className="flex gap-6">
      {links.map(({ label, key }) => (
        <button
          key={label}
          onClick={() => open(key)}
          className="text-[#c3c8cf] bg-transparent border-none cursor-pointer p-0 hover:text-white transition-all duration-300 text-[0.85rem]"
        >
          {label}
        </button>
      ))}
    </div>
  );
}
