"use client";

import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-zinc-200/80 mt-auto">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-zinc-500 font-sans">
        <div>
          © {new Date().getFullYear()} WTF (Web Tools Finder). Built with precision for digital craftspeople.
        </div>
        <div className="flex items-center gap-6">
          <a
            href="#"
            className="hover:text-zinc-900 transition-colors"
          >
            Privacy
          </a>
          <a
            href="#"
            className="hover:text-zinc-900 transition-colors"
          >
            Terms
          </a>
          <a
            href="#"
            className="hover:text-zinc-900 transition-colors"
          >
            Feed
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-900 transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};
