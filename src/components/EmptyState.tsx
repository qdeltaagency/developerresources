"use client";

import React from "react";
import { SearchX, X, PlusCircle, Bookmark, BookmarkX } from "lucide-react";
import { POPULAR_SEARCH_TAGS } from "@/data/tools";

interface EmptyStateProps {
  searchQuery: string;
  activeCategory?: string;
  onClearQuery: () => void;
  onOpenSuggest: () => void;
  onSelectTag: (tag: string) => void;
  onResetCategory?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  searchQuery,
  activeCategory,
  onClearQuery,
  onOpenSuggest,
  onSelectTag,
  onResetCategory,
}) => {
  const isBookmarksEmpty = activeCategory === "bookmarks" && !searchQuery.trim();

  if (isBookmarksEmpty) {
    return (
      <section className="py-16 my-6 flex flex-col items-center justify-center text-center max-w-2xl mx-auto animate-card">
        <div className="w-16 h-16 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center mb-6 shadow-2xs">
          <BookmarkX className="w-7 h-7 text-zinc-400" />
        </div>

        <h2 className="text-[20px] md:text-2xl font-semibold text-zinc-950 tracking-tight mb-2">
          No saved bookmarks yet
        </h2>

        <p className="text-[14px] text-zinc-500 max-w-md leading-relaxed mb-8">
          Click the bookmark icon on any tool or library card across the directory to save your favorite developer resources for quick access.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {onResetCategory && (
            <button
              onClick={onResetCategory}
              className="inline-flex items-center gap-1.5 h-9 px-4 bg-zinc-900 hover:bg-zinc-800 active:scale-95 text-white text-[13px] font-medium rounded-md shadow-2xs transition-all cursor-pointer"
            >
              <Bookmark className="w-4 h-4" />
              <span>Explore All Resources</span>
            </button>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 my-6 flex flex-col items-center justify-center text-center max-w-2xl mx-auto animate-card">
      <div className="w-16 h-16 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center mb-6 shadow-2xs">
        <SearchX className="w-7 h-7 text-zinc-400" />
      </div>

      <h2 className="text-[20px] md:text-2xl font-semibold text-zinc-950 tracking-tight mb-2">
        No curated tools found for &ldquo;{searchQuery || "your selection"}&rdquo;
      </h2>

      <p className="text-[14px] text-zinc-500 max-w-lg leading-relaxed mb-8">
        We strictly index modern developer libraries, UI kits, and creative web tools. Try searching for &ldquo;React&rdquo;, &ldquo;Tailwind&rdquo;, or &ldquo;Supabase&rdquo;.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
        <button
          onClick={onClearQuery}
          className="inline-flex items-center gap-1.5 h-9 px-4 bg-zinc-900 hover:bg-zinc-800 active:scale-95 text-white text-[13px] font-medium rounded-md shadow-2xs transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
          <span>Clear search & filters</span>
        </button>

        <button
          onClick={onOpenSuggest}
          className="inline-flex items-center gap-1.5 h-9 px-4 bg-white hover:bg-zinc-50 text-zinc-800 text-[13px] font-medium rounded-md border border-zinc-200 hover:border-zinc-300 shadow-2xs transition-all active:scale-95 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-zinc-400" />
          <span>Suggest a tool to index</span>
        </button>
      </div>

      <div className="flex flex-col items-center gap-3 pt-6 border-t border-zinc-200/80 w-full">
        <span className="text-[11.5px] font-medium uppercase tracking-wider text-zinc-400 font-mono">
          Popular Searches
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {POPULAR_SEARCH_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => onSelectTag(tag)}
              className="px-3 py-1 bg-white hover:bg-zinc-50 border border-zinc-200/90 rounded-md text-[12px] font-medium text-zinc-700 hover:text-zinc-950 shadow-2xs transition-all hover:border-zinc-300 cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

