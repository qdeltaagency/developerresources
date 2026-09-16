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
      <section className="my-7">
        <div className="bg-white border border-zinc-200/90 rounded-lg p-4 md:px-5 md:py-3.5 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4 hover:border-zinc-300 transition-colors">
          <div className="flex items-center gap-3.5">
            <div className="w-7 h-7 rounded bg-zinc-100 border border-zinc-200/90 flex items-center justify-center text-zinc-600 shrink-0 font-mono text-[9px] font-bold">
              ADS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] tracking-wider text-zinc-500 uppercase px-1.5 py-0.5 bg-zinc-100 rounded border border-zinc-200/80">
                  Ad · Google
                </span>
                <span className="text-zinc-300 text-[10px]">•</span>
                <span className="text-[13px] font-semibold text-zinc-900">
                  Supabase Postgres Cloud
                </span>
              </div>
              <p className="text-[13px] text-zinc-600 mt-0.5">
                Instant backend database, authentication, and realtime vector APIs ready in seconds.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              className="group h-8 px-3.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 text-[12px] font-medium rounded-md border border-zinc-200 hover:border-zinc-300 inline-flex items-center gap-1 transition-all"
              href="https://supabase.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span>Learn More</span>
              <ExternalLink className="w-3 h-3 text-zinc-500 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="my-7">
      <div className="w-full bg-white border border-zinc-200/90 rounded-lg px-5 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xs hover:border-zinc-300 transition-colors">
        <div className="flex items-center gap-3.5">
          <div className="w-7 h-7 rounded bg-zinc-100 border border-zinc-200/90 flex items-center justify-center shrink-0">
            <span className="font-mono text-[9px] font-semibold text-zinc-600 tracking-wider">
              AD
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
                Google AdSense
              </span>
              <span className="text-zinc-300 text-[10px]">•</span>
              <span className="text-[13px] font-semibold text-zinc-900">
                Vercel Frontend Cloud
              </span>
            </div>
            <p className="text-[13px] text-zinc-600 mt-0.5">
              Deploy next-gen web applications with instant global edge performance.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="font-mono text-[11px] text-zinc-400 hidden lg:inline-block">
            Sponsored 728×90
          </span>
          <a
            className="group inline-flex items-center gap-1 h-8 px-3.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 text-[12px] font-medium rounded-md border border-zinc-200 transition-all hover:border-zinc-300"
            href="https://vercel.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Learn More</span>
            <ArrowUpRight className="w-3 h-3 text-zinc-500 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
