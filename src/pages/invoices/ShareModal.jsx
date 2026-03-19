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
      <div className="bg-white/10 border border-white/20 backdrop-blur-2xl rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fadeIn">
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-amber-500 text-center mb-2">
          Share Invoice
        </h2>
        <p className="text-gray-400 text-center text-sm mb-6">
          Share this invoice via WhatsApp or copy the link
        </p>

        {/* Link Preview Box */}
        <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-6 text-gray-300 text-sm truncate">
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
            text-green-400 font-semibold backdrop-blur-lg hover:bg-green-600/50 
            transition-all duration-300 shadow-md"
          >
            Share via WhatsApp
          </a>

          {/* Copy Link */}
          <button
            onClick={handleCopy}
            className={`w-full py-3 text-center rounded-xl border font-semibold
            backdrop-blur-lg transition-all duration-300 shadow-md
            ${copied
              ? "bg-amber-500/30 border-amber-500/40 text-amber-400"
              : "bg-white/10 border-white/20 text-white hover:bg-white/20"
            }`}
          >
            {copied ? "✓ Link Copied!" : "Copy Link"}
          </button>

        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="mt-4 w-full py-3 rounded-xl bg-white/5 border border-white/10
          text-gray-400 font-medium hover:bg-white/10 transition-all duration-300"
        >
          Close
        </button>

      </div>
    </div>
  );
}