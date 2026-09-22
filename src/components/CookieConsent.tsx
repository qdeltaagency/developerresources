"use client";

import React, { useState, useEffect } from "react";
import { Cookie, ShieldCheck, X } from "lucide-react";
import { updateGtagConsent } from "./GoogleAnalytics";

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const consent = localStorage.getItem("wtf_cookie_consent");
      if (!consent) {
        // Show after a brief delay so page loads smoothly
        const timer = setTimeout(() => setIsVisible(true), 800);
        return () => clearTimeout(timer);
      }
    } catch {
      // LocalStorage restricted or private mode
    }

    const handleOpenSettings = () => setIsVisible(true);
    window.addEventListener("open-cookie-settings", handleOpenSettings);
    return () => window.removeEventListener("open-cookie-settings", handleOpenSettings);
  }, []);

  const handleAccept = () => {
    updateGtagConsent(true);
    setIsVisible(false);
  };

  const handleDecline = () => {
    updateGtagConsent(false);
    setIsVisible(false);
  };

  if (!mounted || !isVisible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie and Privacy Preferences"
      className="fixed bottom-3 inset-x-3 sm:bottom-5 sm:right-5 sm:left-auto sm:max-w-md z-50 transition-all duration-200 animate-in fade-in slide-in-from-bottom-4"
    >
      <div className="bg-white/95 backdrop-blur-md border border-zinc-300 shadow-2xl rounded-2xl p-4 sm:p-5 text-zinc-900">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0 text-zinc-800">
            <Cookie className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-[14px] font-bold text-zinc-950 flex items-center gap-1.5">
                Cookie Preferences
                <span className="inline-flex items-center text-[10px] uppercase font-mono font-medium px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 mr-0.5" />
                  Consent v2
                </span>
              </h3>
              <button
                type="button"
                onClick={handleDecline}
                className="text-zinc-400 hover:text-zinc-700 p-1 -mr-1 rounded-lg transition-colors"
                aria-label="Close banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-zinc-600">
              We use necessary local storage for your bookmarks and searches. With your permission, we also use Google Analytics to understand traffic and improve our directory curation.
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleDecline}
            className="text-[12px] text-zinc-500 hover:text-zinc-900 font-medium underline underline-offset-2 transition-colors py-1"
          >
            Essential Only
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDecline}
              className="px-3 py-1.5 text-[12px] font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded-lg transition-colors"
            >
              Decline
            </button>
            <button
              type="button"
              onClick={handleAccept}
              className="px-4 py-1.5 text-[12px] font-semibold text-white bg-zinc-950 hover:bg-zinc-800 rounded-lg shadow-sm transition-all"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
