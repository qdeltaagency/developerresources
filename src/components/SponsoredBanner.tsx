"use client";

import React from "react";
import { ArrowUpRight, ExternalLink } from "lucide-react";

interface SponsoredBannerProps {
  variant?: "vercel" | "supabase";
}

export const SponsoredBanner: React.FC<SponsoredBannerProps> = ({
  variant = "vercel",
}) => {
  if (variant === "supabase") {
    return (
      <section className="my-5 sm:my-7 w-full min-w-0">
        <div className="w-full min-w-0 overflow-hidden bg-white border border-zinc-300 rounded-xl p-3.5 sm:p-4 md:px-5 md:py-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4 hover:border-zinc-400 transition-colors">
          <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
            <div className="w-7 h-7 rounded bg-zinc-100 border border-zinc-300 flex items-center justify-center text-zinc-700 shrink-0 font-mono text-[9px] font-bold mt-0.5 sm:mt-0">
              ADS
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="font-mono text-[10px] tracking-wider text-zinc-700 font-semibold uppercase px-1.5 py-0.5 bg-zinc-100 rounded border border-zinc-300 shrink-0">
                  Ad · Google
                </span>
                <span className="text-zinc-400 text-[10px] hidden xs:inline">•</span>
                <span className="text-[13px] sm:text-[13.5px] font-bold text-zinc-950 truncate">
                  Supabase Postgres Cloud
                </span>
              </div>
              <p className="text-[12px] sm:text-[13px] text-zinc-700 mt-0.5 font-normal leading-normal break-words">
                Instant backend database, authentication, and realtime vector APIs ready in seconds.
              </p>
            </div>
          </div>
          <div className="w-full md:w-auto flex items-center justify-end shrink-0 pt-2 border-t border-zinc-200/60 md:border-0 md:pt-0">
            <a
              className="group h-8 px-3.5 bg-zinc-100 hover:bg-zinc-950 hover:text-white text-zinc-900 text-[12px] font-semibold rounded-md border border-zinc-300 hover:border-zinc-950 inline-flex items-center gap-1 transition-all shrink-0"
              href="https://supabase.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span>Learn More</span>
              <ExternalLink className="w-3 h-3 text-zinc-600 group-hover:text-white transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="my-5 sm:my-7 w-full min-w-0">
      <div className="w-full min-w-0 overflow-hidden bg-white border border-zinc-300 rounded-xl p-3.5 sm:px-5 sm:py-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] hover:border-zinc-400 transition-colors">
        <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          <div className="w-7 h-7 rounded bg-zinc-100 border border-zinc-300 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            <span className="font-mono text-[9px] font-bold text-zinc-700 tracking-wider">
              AD
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-700 font-semibold px-1.5 py-0.5 bg-zinc-100 rounded border border-zinc-300 shrink-0">
                Google AdSense
              </span>
              <span className="text-zinc-400 text-[10px] hidden xs:inline">•</span>
              <span className="text-[13px] sm:text-[13.5px] font-bold text-zinc-950 truncate">
                Vercel Frontend Cloud
              </span>
            </div>
            <p className="text-[12px] sm:text-[13px] text-zinc-700 mt-0.5 font-normal leading-normal break-words">
              Deploy next-gen web applications with instant global edge performance.
            </p>
          </div>
        </div>
        <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 border-t border-zinc-200/60 md:border-0 md:pt-0">
          <span className="font-mono text-[11px] text-zinc-500 font-medium hidden lg:inline-block">
            Sponsored 728×90
          </span>
          <a
            className="group inline-flex items-center gap-1 h-8 px-3.5 bg-zinc-100 hover:bg-zinc-950 hover:text-white text-zinc-900 text-[12px] font-semibold rounded-md border border-zinc-300 hover:border-zinc-950 transition-all ml-auto md:ml-0 shrink-0"
            href="https://vercel.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Learn More</span>
            <ArrowUpRight className="w-3 h-3 text-zinc-600 group-hover:text-white transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
