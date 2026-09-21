"use client";

import React, { useState, useRef, useEffect } from "react";
import { SlidersHorizontal, ChevronDown, LayoutGrid, List, X, Check } from "lucide-react";
import { CATEGORIES } from "@/data/tools";

export type SortOption = "featured" | "stars" | "name" | "category";
export type ViewMode = "grid" | "list";

export interface CategoryOption {
  id: string;
  label: string;
}

interface FilterBarProps {
  categories?: readonly CategoryOption[] | CategoryOption[];
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  resultCount: number;
  searchQuery: string;
  onClearQuery: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  categories = CATEGORIES,
  activeCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  resultCount,
  searchQuery,
  onClearQuery,
}) => {
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sortLabels: Record<SortOption, string> = {
    name: "Name (A-Z)",
    featured: "Featured",
    stars: "Most Stars",
    category: "Category",
  };

  const currentCategoryObj = categories.find((c) => c.id === activeCategory);

  return (
    <div className="flex flex-col gap-4">
      {/* Horizontal Pill Filter Bar & View Controls */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-200/60">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`filter-pill whitespace-nowrap px-3.5 py-1.5 rounded-md text-[13px] font-medium transition-all active:scale-95 cursor-pointer ${
                  isActive
                    ? "bg-zinc-900 text-white shadow-xs filter-active"
                    : "bg-white text-zinc-600 border border-zinc-200/80 hover:text-zinc-900 hover:border-zinc-300 hover:bg-zinc-50"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Sort & View Controls */}
        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
          {/* Sort Dropdown */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="inline-flex items-center gap-1.5 h-8 px-3 bg-white border border-zinc-200/80 rounded-md text-[13px] font-medium text-zinc-800 hover:bg-zinc-50 hover:border-zinc-300 shadow-2xs transition-all active:scale-98 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
              <span>
                Sort: <strong className="font-semibold text-zinc-900">{sortLabels[sortBy]}</strong>
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {sortOpen && (
              <div className="absolute right-0 top-10 w-44 bg-white rounded-lg border border-zinc-200 shadow-xl overflow-hidden z-30 p-1 animate-card">
                {(Object.keys(sortLabels) as SortOption[]).map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      onSortChange(option);
                      setSortOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-[12.5px] font-medium text-left transition-colors ${
                      sortBy === option
                        ? "bg-zinc-100 text-zinc-900 font-semibold"
                        : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                    }`}
                  >
                    <span>{sortLabels[option]}</span>
                    {sortBy === option && <Check className="w-3.5 h-3.5 text-zinc-900" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Grid / List View Toggle */}
          <div className="inline-flex bg-zinc-100 p-0.5 rounded-md border border-zinc-200/80">
            <button
              onClick={() => onViewModeChange("grid")}
              className={`p-1.5 rounded transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white text-zinc-900 shadow-2xs"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={`p-1.5 rounded transition-all cursor-pointer ${
                viewMode === "list"
                  ? "bg-white text-zinc-900 shadow-2xs"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Filter / Search Status Indicator (Screen 4 style) */}
      {(activeCategory !== "all" || searchQuery) && (
        <div className="flex items-center justify-between py-1.5 px-0.5 text-[13px] text-zinc-600 animate-card">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="font-semibold text-zinc-900 font-mono">{resultCount}</strong> results in
            </span>
            {activeCategory !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-zinc-100 text-zinc-900 font-medium border border-zinc-200 text-[12px]">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-900"></span>
                {currentCategoryObj?.label || activeCategory}
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-900 font-medium border border-indigo-200/70 text-[12px]">
                Query: &quot;{searchQuery}&quot;
              </span>
            )}
          </div>
          <button
            onClick={() => {
              onSelectCategory("all");
              onClearQuery();
            }}
            className="inline-flex items-center gap-1 text-[12px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset filters</span>
          </button>
        </div>
      )}
    </div>
  );
};
