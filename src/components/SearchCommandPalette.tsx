"use client";

import React, { useState, useEffect, useRef } from "react";
import { ToolItem, POPULAR_SEARCH_TAGS } from "@/data/tools";
import { Search, X, CornerDownLeft } from "lucide-react";

interface SearchCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  tools: ToolItem[];
  onSelectTool?: (tool: ToolItem) => void;
  onSetGlobalSearch: (query: string) => void;
}

export const SearchCommandPalette: React.FC<SearchCommandPaletteProps> = ({
  isOpen,
  onClose,
  tools,
  onSelectTool,
  onSetGlobalSearch,
}) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter tools based on query
  const filteredTools = query.trim()
    ? tools.filter((tool) => {
        const q = query.toLowerCase();
        return (
          tool.name.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q) ||
          tool.category.toLowerCase().includes(q) ||
          tool.categoryLabel.toLowerCase().includes(q) ||
          tool.badge.toLowerCase().includes(q) ||
          tool.metaLeft.toLowerCase().includes(q) ||
          tool.metaRight.toLowerCase().includes(q)
        );
      })
    : tools.slice(0, 6);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        setSelectedIndex(0);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Global keybindings
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent toggles
      } else if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Keyboard navigation within list
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredTools.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredTools.length) % Math.max(1, filteredTools.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredTools[selectedIndex]) {
        window.open(filteredTools[selectedIndex].url, "_blank");
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-zinc-950/40 backdrop-blur-xs transition-opacity animate-card">
      <div className="fixed inset-0" onClick={onClose}></div>

      <div
        className="relative w-full max-w-2xl bg-white rounded-xl border border-zinc-200/90 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-zinc-200/80 bg-zinc-50/50">
          <Search className="w-5 h-5 text-indigo-600 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search 160+ curated web tools, categories, shaders..."
            className="w-full bg-transparent text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none font-sans"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="font-mono text-[10px] text-zinc-400 bg-white border border-zinc-200 px-1.5 py-0.5 rounded shadow-2xs">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="p-2 overflow-y-auto flex-1 divide-y divide-zinc-100/60 max-h-[380px]">
          {filteredTools.length > 0 ? (
            <div className="flex flex-col gap-1">
              <div className="px-3 py-1.5 text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-wider">
                {query ? `Matching Tools (${filteredTools.length})` : "Featured Tools"}
              </div>

              {filteredTools.map((tool, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={tool.id}
                    onClick={() => {
                      if (onSelectTool) {
                        onSelectTool(tool);
                      } else {
                        window.open(tool.url, "_blank");
                      }
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all duration-150 ${
                      isSelected
                        ? "bg-zinc-100/90 text-zinc-950 shadow-2xs"
                        : "hover:bg-zinc-50 text-zinc-700"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {tool.image ? (
                        <img
                          src={tool.image}
                          alt={tool.name}
                          className="w-8 h-8 rounded-md object-cover border border-zinc-200 shrink-0 shadow-2xs"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-md bg-zinc-900 text-zinc-100 flex items-center justify-center font-mono text-[11px] font-semibold shrink-0 shadow-2xs">
                          &lt;/&gt;
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[13.5px] font-semibold tracking-tight transition-colors ${
                              isSelected ? "text-indigo-600" : "text-zinc-900"
                            }`}
                          >
                            {tool.name}
                          </span>
                          <span className="text-[10.5px] font-medium font-mono px-1.5 py-0.2 bg-zinc-100 text-zinc-600 rounded border border-zinc-200/60">
                            {tool.categoryLabel}
                          </span>
                        </div>
                        <p className="text-[12px] text-zinc-500 truncate max-w-md mt-0.5">
                          {tool.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono text-[11px] text-zinc-400 hidden sm:inline">
                        {tool.stars}
                      </span>
                      {isSelected && (
                        <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-500 bg-white border border-zinc-200 px-1.5 py-0.5 rounded shadow-2xs">
                          <span>Select</span>
                          <CornerDownLeft className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center px-4">
              <p className="text-[13px] text-zinc-600 mb-1">
                No tools matching &quot;{query}&quot;
              </p>
              <p className="text-[12px] text-zinc-400">
                Try searching for &quot;React&quot;, &quot;Motion&quot;, &quot;Tailwind&quot;, or &quot;Icons&quot;.
              </p>
            </div>
          )}
        </div>

        {/* Footer Suggestions */}
        <div className="p-3 bg-zinc-50/80 border-t border-zinc-200/80 flex flex-wrap items-center justify-between gap-2 text-[12px] text-zinc-500">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[11px] text-zinc-400">Quick suggestions:</span>
            {POPULAR_SEARCH_TAGS.slice(0, 4).map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setQuery(tag);
                  onSetGlobalSearch(tag);
                }}
                className="px-2 py-0.5 bg-white hover:bg-zinc-100 border border-zinc-200 rounded text-[11px] font-medium text-zinc-700 hover:text-zinc-900 transition-colors shadow-2xs cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] text-zinc-400">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
