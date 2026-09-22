"use client";

import React, { useState } from "react";
import { ToolItem } from "@/data/tools";
import { Bookmark, ArrowUpRight, Copy, Check, Star } from "lucide-react";
import { safeUrl } from "@/lib/sanitize";

interface ResourceRowProps {
  tool: ToolItem;
  isBookmarked: boolean;
  onToggleBookmark: (toolId: string) => void;
  delayIndex?: number;
}

export const ResourceRow: React.FC<ResourceRowProps> = ({
  tool,
  isBookmarked,
  onToggleBookmark,
  delayIndex = 0,
}) => {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (tool.installCmd) {
      try {
        await navigator.clipboard.writeText(tool.installCmd);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Clipboard copy failed:", err);
      }
    }
  };

  return (
    <div
      className="animate-card group flex flex-col md:flex-row md:items-center justify-between p-4 bg-white hover:bg-zinc-50 border border-zinc-300 rounded-xl transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] hover:border-zinc-400 hover:shadow-sm gap-3"
      style={{ animationDelay: `${Math.min(delayIndex * 0.03, 0.3)}s` }}
    >
      {/* Left Info (no redirect on click) */}
      <div className="flex items-start md:items-center gap-3.5 min-w-0 flex-1">
        {!imgError && tool.image ? (
          <img
            src={tool.image}
            alt={tool.name}
            onError={() => setImgError(true)}
            className="w-10 h-10 rounded-md object-cover border border-zinc-300 shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
            loading="lazy"
          />
        ) : (
          <div className="w-10 h-10 rounded-md bg-zinc-900 text-white flex items-center justify-center font-mono text-[12px] font-bold shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
            {tool.name.slice(0, 2).toUpperCase()}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[14.5px] font-bold text-zinc-950 tracking-tight">
              {tool.name}
            </h3>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-300 font-mono">
              {tool.categoryLabel}
            </span>
            <span className="text-[11px] text-zinc-600 font-mono font-medium hidden sm:inline-flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              {tool.stars}
            </span>
            <span className="font-mono text-[10.5px] font-medium px-1.5 py-0.2 bg-zinc-100 text-zinc-700 rounded border border-zinc-300 hidden md:inline-block">
              {tool.badge}
            </span>
          </div>
          <p className="text-[13px] text-zinc-600 font-medium mt-1 line-clamp-1">
            {tool.description}
          </p>
        </div>
      </div>

      {/* Right Actions - ONLY Visit button redirects */}
      <div className="flex items-center justify-between md:justify-end gap-2.5 w-full md:w-auto shrink-0 pt-2.5 border-t border-zinc-200/70 md:border-0 md:pt-0">
        <div className="flex items-center gap-2">
          {tool.installCmd && (
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 h-8 px-2.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 text-[11px] font-mono rounded-md border border-zinc-300 transition-colors cursor-pointer"
              title={`Copy ${tool.installCmd}`}
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-zinc-500" />
                  <span className="truncate max-w-[100px] sm:max-w-[140px] font-medium">{tool.installCmd}</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleBookmark(tool.id);
            }}
            className={`btn-bookmark w-8 h-8 rounded-md border shadow-2xs flex items-center justify-center transition-all cursor-pointer ${
              isBookmarked
                ? "bg-zinc-950 border-zinc-950 text-white"
                : "bg-white border-zinc-300 text-zinc-600 hover:text-zinc-950 hover:border-zinc-400"
            }`}
            title={isBookmarked ? "Remove bookmark" : "Save bookmark"}
            aria-label={isBookmarked ? "Remove bookmark" : "Save bookmark"}
          >
            <Bookmark className="w-3.5 h-3.5" fill={isBookmarked ? "currentColor" : "none"} />
          </button>
        </div>

        {/* ONLY Visit button redirects */}
        <a
          href={safeUrl(tool.url)}
          target="_blank"
          rel="noopener noreferrer"
          className="visit-btn inline-flex items-center gap-1 h-8 px-3 rounded-md bg-zinc-100 hover:bg-zinc-950 hover:text-white border border-zinc-300 hover:border-zinc-950 text-zinc-900 text-[12px] font-semibold transition-all cursor-pointer shrink-0"
        >
          <span>Visit</span>
          <ArrowUpRight className="arrow-icon w-3.5 h-3.5 text-zinc-600 group-hover:text-white" />
        </a>
      </div>
    </div>
  );
};
