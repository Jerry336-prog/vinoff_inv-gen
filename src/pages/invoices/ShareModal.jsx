import React, { useState } from "react";

export default function ShareModal({ link, onClose }) {
  const encodedLink = encodeURIComponent(link);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 100000); // reset after 100 seconds
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">

      {/* Modal */}
      <div className="bg-white border border-slate-200  rounded-2xl shadow-sm p-8 w-full max-w-md animate-fadeIn">

        {/* Title */}
        <h2 className="text-2xl font-bold text-teal-700 text-center mb-2">
          Share Invoice
        </h2>
        <p className="text-slate-500 text-center text-sm mb-6">
          Share this invoice via WhatsApp or copy the link
        </p>

        {/* Link Preview Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-6 text-slate-600 text-sm truncate">
          {link}
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">

          {/* WhatsApp */}

          <a
            href={`https://wa.me/?text=${encodedLink}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 text-center rounded-xl bg-green-600/30 border border-green-500/40
            text-emerald-700 font-semibold  hover:bg-green-600/50
            transition-all duration-300 shadow-md"
          >
            Share via WhatsApp
          </a>

          {/* Copy Link */}
          <button
            onClick={handleCopy}
            className={`w-full py-3 text-center rounded-xl border font-semibold
             transition-all duration-300 shadow-md
            ${copied
              ? "bg-teal-700/30 border-teal-700/40 text-teal-600"
              : "bg-white border-slate-200 text-slate-900 hover:bg-slate-100"
            }`}
          >
            {copied ? "✓ Link Copied!" : "Copy Link"}
          </button>

        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="mt-4 w-full py-3 rounded-xl bg-slate-50 border border-slate-200
          text-slate-500 font-medium hover:bg-white transition-all duration-300"
        >
          Close
        </button>

      </div>
    </div>
  );
}
