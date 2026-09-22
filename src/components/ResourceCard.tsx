"use client";

import React, { useState } from "react";
import { ToolItem } from "@/data/tools";
import { Bookmark, ArrowUpRight } from "lucide-react";
import { safeUrl } from "@/lib/sanitize";

interface ResourceCardProps {
  tool: ToolItem;
  isBookmarked: boolean;
  onToggleBookmark: (toolId: string) => void;
  delayIndex?: number;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  tool,
  isBookmarked,
  onToggleBookmark,
  delayIndex = 0,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="craft-card animate-card group bg-white rounded-xl border border-zinc-300 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] hover:border-zinc-400 hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden text-left transition-all duration-200 w-full min-w-0"
      style={{ animationDelay: `${Math.min(delayIndex * 0.04, 0.4)}s` }}
    >
      {/* Top Preview Canvas with Real Image (no redirect on click) - 16:10 aspect ratio matches full screenshot */}
      <div className="relative w-full aspect-[16/10] bg-zinc-950 overflow-hidden border-b border-zinc-200 flex flex-col justify-between p-2.5 select-none">
        {/* Real Screenshot / Photo */}
        {!imgError && tool.image ? (
          <img
            src={tool.image}
            alt={`${tool.name} preview`}
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-102 opacity-95 group-hover:opacity-100"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center">
            <span className="font-mono text-2xl font-bold text-zinc-600">
              {tool.name.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}

        {/* Ambient Subtle Dark Gradient Overlays for readable tags & metadata */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-zinc-950/50 pointer-events-none"></div>

        {/* Top Tag & Bookmark Button */}
        <div className="relative flex items-center justify-between z-10">
          <span className="font-mono text-[10.5px] font-medium text-white px-2 py-0.5 rounded bg-zinc-950/70 backdrop-blur-md border border-white/20 shadow-2xs">
            {tool.badge}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleBookmark(tool.id);
            }}
            className={`btn-bookmark w-7.5 h-7.5 sm:w-7 sm:h-7 rounded-md backdrop-blur-md border shadow-2xs flex items-center justify-center transition-all cursor-pointer ${
              isBookmarked
                ? "bg-indigo-600 border-indigo-500 text-white"
                : "bg-zinc-950/60 border-white/20 text-zinc-300 hover:text-white hover:bg-zinc-900/80"
            }`}
            title={isBookmarked ? "Remove bookmark" : "Save bookmark"}
            aria-label={isBookmarked ? "Remove bookmark" : "Save bookmark"}
          >
            <Bookmark
              className="w-3.5 h-3.5"
              fill={isBookmarked ? "currentColor" : "none"}
            />
          </button>
        </div>

        {/* Bottom Metadata in Image Canvas */}
        <div className="relative flex items-center justify-between text-zinc-200 font-mono text-[10px] sm:text-[10.5px] font-medium z-10 drop-shadow-xs">
          <span className="bg-zinc-950/50 backdrop-blur-xs px-1.5 py-0.5 rounded">
            {tool.metaLeft}
          </span>
          <span className="bg-zinc-950/50 backdrop-blur-xs px-1.5 py-0.5 rounded">
            {tool.metaRight}
          </span>
        </div>
      </div>

      {/* Compact 3-Row Info Layout */}
      <div className="px-3 sm:px-3.5 py-2.5 sm:py-3 flex flex-col justify-between flex-1 bg-white gap-2 w-full min-w-0">
        {/* Row 1: Product Name & Visit Button */}
        <div className="flex items-center justify-between gap-2 min-w-0 w-full">
          <h3 
            className="text-[14px] sm:text-[15.5px] font-bold text-zinc-950 tracking-tight truncate flex-1 min-w-0"
            title={tool.name}
          >
            {tool.name}
          </h3>

          {/* ONLY Visit Button redirects */}
          <a
            href={safeUrl(tool.url)}
            target="_blank"
            rel="noopener noreferrer"
            className="visit-btn inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-100 hover:bg-zinc-950 hover:text-white group-hover:bg-zinc-100 hover:border-zinc-950 border border-zinc-300 text-zinc-900 text-[12px] font-semibold transition-all shrink-0 cursor-pointer"
          >
            <span>Visit</span>
            <ArrowUpRight className="arrow-icon w-3.5 h-3.5 text-zinc-600 group-hover:text-white" />
          </a>
        </div>

        {/* Row 2: Subcategory Badge */}
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-[10.5px] sm:text-[11px] font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-300 font-mono truncate">
            {tool.categoryLabel}
          </span>
        </div>

        {/* Row 3: Single-Row Concise Description */}
        <p className="text-[12.5px] sm:text-[13.5px] text-zinc-700 font-normal truncate leading-normal" title={tool.description}>
          {tool.description}
        </p>
      </div>
    </div>
  );
};
