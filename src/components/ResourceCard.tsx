"use client";

import React, { useState } from "react";
import { ToolItem } from "@/data/tools";
import { Bookmark, ArrowUpRight } from "lucide-react";

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
      className="craft-card animate-card group bg-white rounded-lg border border-zinc-200/80 flex flex-col overflow-hidden text-left shadow-2xs hover:shadow-md transition-all duration-300"
      style={{ animationDelay: `${Math.min(delayIndex * 0.04, 0.4)}s` }}
    >
      {/* Top Preview Canvas with Real Image (no redirect on click) */}
      <div className="relative w-full h-44 bg-zinc-900 overflow-hidden border-b border-zinc-200/80 flex flex-col justify-between p-3.5 select-none">
        {/* Real Screenshot / Photo */}
        {!imgError && tool.image ? (
          <img
            src={tool.image}
            alt={`${tool.name} preview`}
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center">
            <span className="font-mono text-2xl font-bold text-zinc-600">
              {tool.name.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}

        {/* Ambient Dark Gradient Overlays for readable tags & metadata */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-zinc-950/60 pointer-events-none"></div>

        {/* Top Tag & Bookmark Button */}
        <div className="relative flex items-center justify-between z-10">
          <span className="font-mono text-[11px] font-medium text-white px-2 py-0.5 rounded bg-zinc-950/70 backdrop-blur-md border border-white/20 shadow-2xs">
            {tool.badge}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleBookmark(tool.id);
            }}
            className={`btn-bookmark w-7 h-7 rounded-md backdrop-blur-md border shadow-2xs flex items-center justify-center transition-all cursor-pointer ${
              isBookmarked
                ? "bg-indigo-600 border-indigo-500 text-white"
                : "bg-zinc-950/60 border-white/20 text-zinc-300 hover:text-white hover:bg-zinc-900/80"
            }`}
            title={isBookmarked ? "Remove bookmark" : "Save bookmark"}
          >
            <Bookmark
              className="w-3.5 h-3.5"
              fill={isBookmarked ? "currentColor" : "none"}
            />
          </button>
        </div>

        {/* Bottom Metadata in Image Canvas */}
        <div className="relative flex items-center justify-between text-zinc-200 font-mono text-[11px] font-medium z-10 drop-shadow-xs">
          <span className="bg-zinc-950/50 backdrop-blur-xs px-1.5 py-0.5 rounded">
            {tool.metaLeft}
          </span>
          <span className="bg-zinc-950/50 backdrop-blur-xs px-1.5 py-0.5 rounded">
            {tool.metaRight}
          </span>
        </div>
      </div>

      {/* Compact Info Bar - ONLY Visit button redirects */}
      <div className="p-4 flex items-center justify-between gap-3 bg-white">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-[14px] font-semibold text-zinc-900 tracking-tight truncate">
              {tool.name}
            </h3>
            <span className="text-[10.5px] font-medium px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200/60 shrink-0 font-mono">
              {tool.categoryLabel}
            </span>
          </div>
          <p className="text-[12px] text-zinc-500 mt-1 line-clamp-1 leading-snug">
            {tool.description}
          </p>
        </div>

        {/* ONLY Visit Button redirects */}
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="visit-btn inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-zinc-50 hover:bg-zinc-100 group-hover:bg-zinc-100 group-hover:border-zinc-300 border border-zinc-200 text-zinc-800 text-[12px] font-medium transition-all shrink-0 cursor-pointer"
        >
          <span>Visit</span>
          <ArrowUpRight className="arrow-icon w-3.5 h-3.5 text-zinc-500" />
        </a>
      </div>
    </div>
  );
};
