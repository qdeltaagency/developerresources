"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, ArrowUpRight, Bookmark, X } from "lucide-react";
import { ToolItem } from "@/data/tools";
import { WtfAnimatedBadge } from "@/components/WtfAnimatedBadge";

interface HeaderProps {
  searchQuery: string;
  onSearchSubmit: (query: string) => void;
  onOpenSuggest: () => void;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  bookmarkCount: number;
  tools: ToolItem[];
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchSubmit,
  onOpenSuggest,
  activeCategory,
  onSelectCategory,
  bookmarkCount,
  tools,
}) => {
  const [inputValue, setInputValue] = useState(searchQuery);
  const [prevSearchQuery, setPrevSearchQuery] = useState(searchQuery);
  if (prevSearchQuery !== searchQuery) {
    setPrevSearchQuery(searchQuery);
    setInputValue(searchQuery);
  }
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter suggestions based on typed input
  const suggestions = React.useMemo(() => {
    if (!inputValue.trim()) return [];
    const q = inputValue.toLowerCase().trim();
    return tools
      .filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.categoryLabel.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.badge.toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [inputValue, tools]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Global hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setShowSuggestions(true);
      } else if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
        setShowSuggestions(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelectSuggestion = (toolName: string) => {
    setInputValue(toolName);
    onSearchSubmit(toolName);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (suggestions.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % suggestions.length);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (suggestions.length > 0) {
        setSelectedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSelectSuggestion(suggestions[selectedIndex].name);
      } else {
        onSearchSubmit(inputValue);
        setShowSuggestions(false);
        inputRef.current?.blur();
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  // Auto focus mobile search input when opened
  useEffect(() => {
    if (mobileSearchOpen) {
      setTimeout(() => {
        mobileInputRef.current?.focus();
      }, 50);
    }
  }, [mobileSearchOpen]);

  const handleClear = () => {
    setInputValue("");
    onSearchSubmit("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleMobileClear = () => {
    setInputValue("");
    onSearchSubmit("");
    setShowSuggestions(false);
    mobileInputRef.current?.focus();
  };

  const handleSelectMobileSuggestion = (toolName: string) => {
    setInputValue(toolName);
    onSearchSubmit(toolName);
    setShowSuggestions(false);
    setMobileSearchOpen(false);
  };

  return (
    <header className="fixed top-0 w-full z-40 bg-[#f4f5f7]/95 backdrop-blur-md border-b border-zinc-300 transition-colors">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 md:px-8 lg:px-12 h-16 flex items-center justify-between gap-2 sm:gap-6">
        {/* Brand & Version */}
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
          <Link
            href="/"
            onClick={() => {
              onSelectCategory("all");
              handleClear();
              setMobileSearchOpen(false);
            }}
            className="flex items-center gap-1.5 sm:gap-2.5 group text-left cursor-pointer focus:outline-none min-w-0"
          >
            {/* Animated WTF Logo Badge */}
            <div className="shrink-0">
              <WtfAnimatedBadge />
            </div>

            <span className="font-bold text-[13.5px] sm:text-[16px] tracking-tight text-zinc-950 font-sans truncate">
              <span className="hidden sm:inline">Web Tools Finder</span>
              <span className="inline sm:hidden">Web Tools</span>
            </span>
          </Link>
          <span className="font-mono text-[10.5px] font-semibold bg-white text-zinc-800 px-1.5 py-0.5 rounded-[4px] border border-zinc-300 shadow-2xs hidden md:inline-block shrink-0">
            v1.0
          </span>
        </div>

        {/* Desktop Search Bar with Black Focus and Suggestions Dropdown */}
        <div className="flex-1 max-w-md hidden md:block" ref={containerRef}>
          <div className="relative flex items-center group">
            <Search className="absolute left-3.5 text-zinc-500 group-focus-within:text-zinc-950 w-4 h-4 pointer-events-none transition-colors" />
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setShowSuggestions(true);
                setSelectedIndex(-1);
              }}
              onFocus={() => {
                if (inputValue.trim()) setShowSuggestions(true);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search 160+ curated web tools..."
              className="w-full h-9 pl-10 pr-16 bg-white hover:bg-zinc-50/80 focus:bg-white border border-zinc-300 rounded-md text-[13px] text-zinc-950 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 shadow-2xs transition-all duration-200 font-sans"
            />

            {inputValue ? (
              <button
                onClick={handleClear}
                className="absolute right-3 p-0.5 rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => {
                  inputRef.current?.focus();
                  setShowSuggestions(true);
                }}
                className="absolute right-2.5 font-mono text-[11px] font-semibold text-zinc-700 bg-zinc-100 border border-zinc-300 px-1.5 py-0.5 rounded shadow-2xs cursor-pointer hover:bg-zinc-200 hover:text-zinc-950 transition-colors select-none"
                title="Press Ctrl+K or / to search"
              >
                Ctrl+K
              </button>
            )}

            {/* Suggestions Dropdown (appears only when typing suggestions exist) */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-10 left-0 w-full bg-white rounded-lg border border-zinc-200 shadow-xl overflow-hidden z-50 py-1 animate-card">
                <div className="px-3 py-1.5 text-[11px] font-mono text-zinc-400 uppercase tracking-wider flex items-center justify-between border-b border-zinc-100">
                  <span>Suggestions</span>
                  <span>Press Enter ↵</span>
                </div>
                {suggestions.map((tool, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => handleSelectSuggestion(tool.name)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left text-[13px] transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-zinc-100 text-zinc-950 font-medium"
                          : "text-zinc-700 hover:bg-zinc-50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {tool.image ? (
                          <img
                            src={tool.image}
                            alt=""
                            className="w-5 h-5 rounded object-cover border border-zinc-200 shrink-0"
                          />
                        ) : (
                          <div className="w-5 h-5 rounded bg-zinc-900 text-white flex items-center justify-center font-mono text-[9px] shrink-0">
                            {tool.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <span className="truncate">{tool.name}</span>
                      </div>
                      <span className="text-[10.5px] font-mono px-1.5 py-0.2 bg-zinc-100 text-zinc-600 rounded border border-zinc-200/60 shrink-0 ml-2">
                        {tool.categoryLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Navigation Links & CTA */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Mobile Search Toggle Button */}
          <button
            onClick={() => setMobileSearchOpen((prev) => !prev)}
            className={`md:hidden inline-flex items-center justify-center w-7.5 h-7.5 rounded-md border shadow-2xs transition-colors cursor-pointer shrink-0 ${
              mobileSearchOpen
                ? "bg-zinc-950 text-white border-zinc-950"
                : "bg-white text-zinc-700 hover:text-zinc-950 border-zinc-300 hover:bg-zinc-50"
            }`}
            title="Search tools"
            aria-label="Toggle search"
          >
            {mobileSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-3.5 h-3.5" />}
          </button>

          {/* Bookmarks / Saved Button - Visible on both Mobile & Desktop */}
          <button
            onClick={() => {
              onSelectCategory("bookmarks");
              setMobileSearchOpen(false);
            }}
            className={`transition-colors duration-150 inline-flex items-center gap-1 px-1.5 py-1 sm:px-2.5 sm:py-1 rounded-md cursor-pointer shrink-0 ${
              activeCategory === "bookmarks"
                ? "text-zinc-950 font-bold bg-zinc-200/60"
                : "text-zinc-700 hover:text-zinc-950 font-medium hover:bg-zinc-100"
            }`}
            title="Saved bookmarks"
            aria-label="Saved bookmarks"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span className="text-[13px] hidden sm:inline">Saved</span>
            {bookmarkCount > 0 && (
              <span className="font-mono text-[9.5px] sm:text-[10px] font-bold bg-zinc-950 text-white px-1.5 py-0.2 rounded-full">
                {bookmarkCount}
              </span>
            )}
          </button>

          {/* Suggest Resource CTA Button - Responsive Label */}
          <button
            onClick={() => {
              onOpenSuggest();
              setMobileSearchOpen(false);
            }}
            className="group inline-flex items-center gap-1 sm:gap-1.5 h-7.5 sm:h-8 px-2 sm:px-3.5 bg-zinc-950 hover:bg-zinc-800 active:scale-98 text-white text-[11.5px] sm:text-[12.5px] font-semibold rounded-md shadow-xs transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0"
          >
            <span className="hidden sm:inline">Suggest Resource</span>
            <span className="inline sm:hidden">Suggest</span>
            <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>

      {/* Expandable Mobile Search Drawer */}
      {mobileSearchOpen && (
        <div className="md:hidden border-t border-zinc-200 bg-white px-4 py-3 shadow-lg animate-card">
          <div className="relative flex items-center">
            <Search className="absolute left-3 text-zinc-500 w-4 h-4 pointer-events-none" />
            <input
              ref={mobileInputRef}
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onSearchSubmit(inputValue);
                  setMobileSearchOpen(false);
                  setShowSuggestions(false);
                } else if (e.key === "Escape") {
                  setMobileSearchOpen(false);
                }
              }}
              placeholder="Search 160+ curated web tools..."
              className="w-full h-10 pl-9 pr-16 bg-zinc-50 border border-zinc-300 rounded-md text-[14px] text-zinc-950 placeholder:text-zinc-500 focus:outline-none focus:bg-white focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 font-sans"
            />
            {inputValue && (
              <button
                onClick={handleMobileClear}
                className="absolute right-10 p-1 text-zinc-500 hover:text-zinc-900"
                title="Clear"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => {
                onSearchSubmit(inputValue);
                setMobileSearchOpen(false);
                setShowSuggestions(false);
              }}
              className="absolute right-2 px-2 py-1 bg-zinc-950 text-white rounded text-[11px] font-semibold"
            >
              Go
            </button>
          </div>

          {/* Mobile Suggestions List */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="mt-2 bg-zinc-50 rounded-lg border border-zinc-200 overflow-hidden divide-y divide-zinc-200/80">
              {suggestions.map((tool) => (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => handleSelectMobileSuggestion(tool.name)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-left text-[13.5px] hover:bg-zinc-100 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {tool.image ? (
                      <img
                        src={tool.image}
                        alt=""
                        className="w-5 h-5 rounded object-cover border border-zinc-200 shrink-0"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded bg-zinc-900 text-white flex items-center justify-center font-mono text-[9px] shrink-0">
                        {tool.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="font-medium text-zinc-950 truncate">{tool.name}</span>
                  </div>
                  <span className="text-[11px] font-mono px-1.5 py-0.5 bg-white text-zinc-600 rounded border border-zinc-200 shrink-0 ml-2">
                    {tool.categoryLabel}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </header>
  );
};
