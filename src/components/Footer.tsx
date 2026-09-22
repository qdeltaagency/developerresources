"use client";

import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-zinc-300 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12.5px] sm:text-[13px] text-zinc-700 font-sans text-center sm:text-left">
        <div>
          © {new Date().getFullYear()} WTF (Web Tools Finder). Built with precision for digital craftspeople.
        </div>
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4 sm:gap-6 font-medium">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("open-cookie-settings"));
              }
            }}
            className="text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer"
          >
            Cookie Preferences
          </button>
          <a
            href="#"
            className="text-zinc-600 hover:text-zinc-950 transition-colors"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-zinc-600 hover:text-zinc-950 transition-colors"
          >
            Terms
          </a>
          <a
            href="#"
            className="text-zinc-600 hover:text-zinc-950 transition-colors"
          >
            Feed
          </a>
          <a
            href="https://github.com/qdeltaagency/web-tools-finder"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 hover:text-zinc-950 transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};
