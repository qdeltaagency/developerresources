"use client";

import React, { useState } from "react";
import { ToolItem } from "@/data/tools";
import { safeUrl } from "@/lib/sanitize";
import {
  X,
  ArrowUpRight,
  Bookmark,
  Copy,
  Check,
  Star,
  ExternalLink,
  BookOpen,
  GitBranch,
  CheckCircle2,
} from "lucide-react";

interface ToolDetailModalProps {
  tool: ToolItem | null;
  isOpen: boolean;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (toolId: string) => void;
}

export const ToolDetailModal: React.FC<ToolDetailModalProps> = ({
  tool,
  isOpen,
  onClose,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !tool) return null;

  const handleCopyCmd = () => {
    if (tool.installCmd) {
      navigator.clipboard.writeText(tool.installCmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-950/40 backdrop-blur-xs animate-card">
      <div className="fixed inset-0" onClick={onClose}></div>

      <div
        className="relative w-full max-w-xl bg-white rounded-xl border border-zinc-200/90 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-200/80 bg-zinc-50/50 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-mono text-[14px] font-bold shadow-2xs">
              {tool.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-[18px] sm:text-[20px] font-bold text-zinc-950 tracking-tight">
                  {tool.name}
                </h2>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-zinc-200/70 text-zinc-800 border border-zinc-300/60 font-mono">
                  {tool.categoryLabel}
                </span>
                <span className="font-mono text-[11px] text-zinc-500 bg-white border border-zinc-200 px-1.5 py-0.2 rounded shadow-2xs">
                  {tool.badge}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-[12px] text-zinc-500 font-mono">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  {tool.stars}
                </span>
                <span>•</span>
                <span>{tool.metaRight}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleBookmark(tool.id)}
              className={`w-8 h-8 rounded-md border shadow-2xs flex items-center justify-center transition-all cursor-pointer ${
                isBookmarked
                  ? "bg-zinc-900 border-zinc-900 text-white"
                  : "bg-white border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:border-zinc-300"
              }`}
              title={isBookmarked ? "Remove bookmark" : "Save bookmark"}
            >
              <Bookmark className="w-4 h-4" fill={isBookmarked ? "currentColor" : "none"} />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 flex flex-col gap-5">
          {/* Tool Real Screenshot Banner - 16:10 ratio for zoomed-out complete view */}
          {tool.image && (
            <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden border border-zinc-200/80 bg-zinc-950 shadow-inner group">
              <img
                src={tool.image}
                alt={tool.name}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent"></div>
              <a
                href={safeUrl(tool.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/90 hover:bg-white text-zinc-900 text-[11.5px] font-medium backdrop-blur-md shadow-md border border-white/20 transition-all hover:scale-105"
              >
                <span>Open live demo</span>
                <ExternalLink className="w-3 h-3 text-zinc-600" />
              </a>
            </div>
          )}

          {/* Full description */}
          <div>
            <h4 className="text-[12px] font-mono uppercase tracking-wider text-zinc-400 font-medium mb-1.5">
              Overview
            </h4>
            <p className="text-[13.5px] text-zinc-700 leading-relaxed">
              {tool.fullDescription || tool.description}
            </p>
          </div>

          {/* Quick Install Command */}
          {tool.installCmd && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="text-[12px] font-mono uppercase tracking-wider text-zinc-400 font-medium">
                  Installation CLI
                </h4>
                <span className="text-[11px] text-zinc-400 font-mono">Terminal</span>
              </div>
              <div className="flex items-center justify-between bg-zinc-900 text-zinc-100 p-3 rounded-lg border border-zinc-800 font-mono text-[12.5px] shadow-inner">
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
                  <span className="text-zinc-500 select-none">$</span>
                  <span className="text-emerald-400">{tool.installCmd}</span>
                </div>
                <button
                  onClick={handleCopyCmd}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-200 text-[11px] rounded border border-zinc-700 transition-all shrink-0 ml-3 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Key Features */}
          {tool.features && tool.features.length > 0 && (
            <div>
              <h4 className="text-[12px] font-mono uppercase tracking-wider text-zinc-400 font-medium mb-2">
                Core Highlights
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {tool.features.map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 rounded-md bg-zinc-50 border border-zinc-200/70 text-[12.5px] text-zinc-700"
                  >
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Useful Links */}
          <div>
            <h4 className="text-[12px] font-mono uppercase tracking-wider text-zinc-400 font-medium mb-2">
              Official Links
            </h4>
            <div className="flex flex-wrap gap-2">
              <a
                href={safeUrl(tool.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-md text-[12px] font-medium text-zinc-800 hover:border-zinc-300 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
                <span>Official Website</span>
              </a>
              {tool.docsUrl && (
                <a
                  href={safeUrl(tool.docsUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-md text-[12px] font-medium text-zinc-800 hover:border-zinc-300 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Documentation</span>
                </a>
              )}
              {tool.githubUrl && (
                <a
                  href={safeUrl(tool.githubUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-md text-[12px] font-medium text-zinc-800 hover:border-zinc-300 transition-colors"
                >
                  <GitBranch className="w-3.5 h-3.5 text-zinc-500" />
                  <span>GitHub Repository</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-zinc-50/80 border-t border-zinc-200/80 flex items-center justify-between gap-3">
          <span className="font-mono text-[11px] text-zinc-400">
            Verified by INDEX Curation
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="h-8.5 px-3.5 text-[12.5px] font-medium text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
            >
              Close
            </button>
            <a
              href={safeUrl(tool.url)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 h-8.5 px-4 bg-zinc-900 hover:bg-zinc-800 active:scale-98 text-white text-[12.5px] font-medium rounded-md shadow-2xs transition-all"
            >
              <span>Visit Website</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
