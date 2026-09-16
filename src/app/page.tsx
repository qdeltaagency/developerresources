"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/Header";
import { FilterBar, SortOption, ViewMode } from "@/components/FilterBar";
import { ResourceCard } from "@/components/ResourceCard";
import { ResourceRow } from "@/components/ResourceRow";
import { EmptyState } from "@/components/EmptyState";
import { SuggestModal } from "@/components/SuggestModal";
import { SponsoredBanner } from "@/components/SponsoredBanner";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";
import { TOOLS_DATA, ToolItem } from "@/data/tools";
import { ChevronDown, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function HomePage() {
  const [tools, setTools] = useState<ToolItem[]>(TOOLS_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [isSuggestOpen, setIsSuggestOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Initialize bookmarks from localStorage
  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem("index_bookmarks");
      if (saved) {
        setBookmarks(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to read bookmarks:", e);
    }
  }, []);

  // Save bookmarks to localStorage
  const handleToggleBookmark = (toolId: string) => {
    setBookmarks((prev) => {
      const next = prev.includes(toolId)
        ? prev.filter((id) => id !== toolId)
        : [...prev, toolId];
      try {
        localStorage.setItem("index_bookmarks", JSON.stringify(next));
      } catch (e) {
        console.error("Failed to save bookmarks:", e);
      }
      return next;
    });
  };

  const handleAddNewTool = (newToolData: {
    name: string;
    url: string;
    category: any;
    description: string;
    githubUrl?: string;
  }) => {
    const newTool: ToolItem = {
      id: `custom-${Date.now()}`,
      name: newToolData.name,
      category: newToolData.category,
      categoryLabel: newToolData.category.toUpperCase(),
      description: newToolData.description || "Community curated tool",
      stars: "New",
      badge: "Community",
      metaLeft: "Verified",
      metaRight: "Latest",
      url: newToolData.url,
      image: "/previews/shadcn-ui.png",
      previewType: "code-pill",
      installCmd: `npm install ${newToolData.name.toLowerCase().replace(/\s+/g, "-")}`,
      githubUrl: newToolData.githubUrl,
      features: ["Community submitted", "Modern web craft", "Curated preview"],
    };
    setTools((prev) => [newTool, ...prev]);
  };

  // Filter & Sort tools
  const filteredAndSortedTools = useMemo(() => {
    let result = [...tools];

    // Category filter
    if (activeCategory === "bookmarks") {
      result = result.filter((t) => bookmarks.includes(t.id));
    } else if (activeCategory !== "all") {
      result = result.filter((t) => t.category === activeCategory);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.categoryLabel.toLowerCase().includes(q) ||
          t.badge.toLowerCase().includes(q) ||
          t.metaLeft.toLowerCase().includes(q) ||
          t.metaRight.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === "stars") {
      result.sort((a, b) => {
        const getStarsNum = (s: string) => {
          if (s.includes("M")) return parseFloat(s) * 1000000;
          if (s.includes("k")) return parseFloat(s) * 1000;
          return parseInt(s) || 0;
        };
        return getStarsNum(b.stars) - getStarsNum(a.stars);
      });
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "category") {
      result.sort((a, b) => a.categoryLabel.localeCompare(b.categoryLabel));
    }

    return result;
  }, [tools, activeCategory, searchQuery, sortBy, bookmarks]);

  const displayedTools = filteredAndSortedTools.slice(0, visibleCount);
  const hasMore = visibleCount < filteredAndSortedTools.length;

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 6);
      setIsLoadingMore(false);
    }, 450);
  };

  const firstBatch = displayedTools.slice(0, 6);
  const secondBatch = displayedTools.slice(6);

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfd]">
      {/* Scroll Progress Bar & Floating Top Button */}
      <ScrollProgressBar />

      {/* Sticky Top Navigation */}
      <Header
        searchQuery={searchQuery}
        onSearchSubmit={setSearchQuery}
        onOpenSuggest={() => setIsSuggestOpen(true)}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        bookmarkCount={isMounted ? bookmarks.length : 0}
        tools={tools}
      />

      {/* Main Content Area */}
      <main className="w-full pt-16 flex-1">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-8 md:py-10">
          {/* HERO SECTION - Page Load Entrance Animation */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mb-7"
          >
            <div className="text-center max-w-3xl mx-auto">
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 }}
                className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-950 mb-3 font-sans"
              >
                The Curated Web Index
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.16 }}
                className="text-[15px] md:text-base text-zinc-600 max-w-2xl mx-auto leading-relaxed"
              >
                Handpicked tools, interaction libraries, and UI kits for modern web craft.
              </motion.p>
            </div>
          </motion.section>

          {/* Filter Bar & View Controls - Staggered Page Load Animation */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.22 }}
          >
            <FilterBar
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              resultCount={filteredAndSortedTools.length}
              searchQuery={searchQuery}
              onClearQuery={() => setSearchQuery("")}
            />
          </motion.div>

          {/* Content Layout */}
          {filteredAndSortedTools.length === 0 ? (
            <ScrollReveal direction="up" delay={0.1}>
              <EmptyState
                searchQuery={searchQuery}
                onClearQuery={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
                onOpenSuggest={() => setIsSuggestOpen(true)}
                onSelectTag={(tag) => {
                  setSearchQuery(tag);
                  setActiveCategory("all");
                }}
              />
            </ScrollReveal>
          ) : (
            <div className="mt-4 flex flex-col gap-6">
              {/* TOP SPONSORED BANNER: Vercel - Scroll Reveal */}
              <ScrollReveal direction="up" delay={0.05}>
                <SponsoredBanner variant="vercel" />
              </ScrollReveal>

              {/* FIRST BATCH OF TOOLS - Staggered Scroll Animations */}
              {viewMode === "grid" ? (
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {firstBatch.map((tool, idx) => (
                    <ScrollReveal
                      key={tool.id}
                      direction="up"
                      distance={18}
                      delay={idx * 0.05}
                    >
                      <ResourceCard
                        tool={tool}
                        isBookmarked={bookmarks.includes(tool.id)}
                        onToggleBookmark={handleToggleBookmark}
                        delayIndex={idx}
                      />
                    </ScrollReveal>
                  ))}
                </section>
              ) : (
                <section className="flex flex-col gap-3">
                  {firstBatch.map((tool, idx) => (
                    <ScrollReveal
                      key={tool.id}
                      direction="up"
                      distance={14}
                      delay={idx * 0.04}
                    >
                      <ResourceRow
                        tool={tool}
                        isBookmarked={bookmarks.includes(tool.id)}
                        onToggleBookmark={handleToggleBookmark}
                        delayIndex={idx}
                      />
                    </ScrollReveal>
                  ))}
                </section>
              )}

              {/* MID-PAGE SPONSORED BANNER: Supabase - Scroll Reveal */}
              {displayedTools.length >= 6 && (
                <ScrollReveal direction="up" delay={0.1}>
                  <SponsoredBanner variant="supabase" />
                </ScrollReveal>
              )}

              {/* SECOND BATCH OF TOOLS - Scroll Reveal as user scrolls */}
              {secondBatch.length > 0 && (
                viewMode === "grid" ? (
                  <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {secondBatch.map((tool, idx) => (
                      <ScrollReveal
                        key={tool.id}
                        direction="up"
                        distance={18}
                        delay={idx * 0.05}
                      >
                        <ResourceCard
                          tool={tool}
                          isBookmarked={bookmarks.includes(tool.id)}
                          onToggleBookmark={handleToggleBookmark}
                          delayIndex={idx + 6}
                        />
                      </ScrollReveal>
                    ))}
                  </section>
                ) : (
                  <section className="flex flex-col gap-3">
                    {secondBatch.map((tool, idx) => (
                      <ScrollReveal
                        key={tool.id}
                        direction="up"
                        distance={14}
                        delay={idx * 0.04}
                      >
                        <ResourceRow
                          tool={tool}
                          isBookmarked={bookmarks.includes(tool.id)}
                          onToggleBookmark={handleToggleBookmark}
                          delayIndex={idx + 6}
                        />
                      </ScrollReveal>
                    ))}
                  </section>
                )
              )}

              {/* Load More / Catalog sync pagination - Scroll Reveal */}
              <ScrollReveal direction="up" delay={0.1}>
                <section className="pt-8 pb-6 flex flex-col items-center justify-center">
                  {hasMore ? (
                    <button
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      className="inline-flex items-center justify-center gap-2.5 h-10 px-6 bg-white hover:bg-zinc-50 active:scale-98 text-zinc-900 text-[13px] font-medium rounded-md border border-zinc-200/90 shadow-2xs hover:shadow-xs hover:border-zinc-300 transition-all group cursor-pointer"
                    >
                      {isLoadingMore ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-zinc-600" />
                          <span>Loading catalog...</span>
                        </>
                      ) : (
                        <>
                          <span>Load More Resources</span>
                          <span className="font-mono text-[11px] text-zinc-600 px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200/80">
                            {filteredAndSortedTools.length - visibleCount} remaining
                          </span>
                          <ChevronDown className="w-4 h-4 text-zinc-500 group-hover:translate-y-0.5 transition-transform duration-200" />
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 font-mono text-[11.5px] text-zinc-500 bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200/80">
                      <span>Showing all {filteredAndSortedTools.length} curated resources</span>
                      <span>•</span>
                      <span className="text-zinc-700 font-medium">All synced</span>
                    </div>
                  )}

                  {/* Direct Category Jump Links */}
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-[13px] text-zinc-500">
                    <span>Jump to:</span>
                    <button
                      onClick={() => {
                        setActiveCategory("react");
                        setSearchQuery("");
                      }}
                      className="hover:text-zinc-900 underline underline-offset-4 decoration-zinc-200 hover:decoration-zinc-700 transition-all cursor-pointer"
                    >
                      React Components
                    </button>
                    <button
                      onClick={() => {
                        setActiveCategory("motion");
                        setSearchQuery("");
                      }}
                      className="hover:text-zinc-900 underline underline-offset-4 decoration-zinc-200 hover:decoration-zinc-700 transition-all cursor-pointer"
                    >
                      Motion & 3D
                    </button>
                    <button
                      onClick={() => {
                        setActiveCategory("tailwind");
                        setSearchQuery("");
                      }}
                      className="hover:text-zinc-900 underline underline-offset-4 decoration-zinc-200 hover:decoration-zinc-700 transition-all cursor-pointer"
                    >
                      CSS & Tailwind
                    </button>
                    <button
                      onClick={() => {
                        setActiveCategory("icons");
                        setSearchQuery("");
                      }}
                      className="hover:text-zinc-900 underline underline-offset-4 decoration-zinc-200 hover:decoration-zinc-700 transition-all cursor-pointer"
                    >
                      Icons & Assets
                    </button>
                  </div>
                </section>
              </ScrollReveal>
            </div>
          )}
        </div>
      </main>

      {/* Clean Minimal Footer - Scroll Reveal */}
      <ScrollReveal direction="up" delay={0.05}>
        <Footer />
      </ScrollReveal>

      {/* Suggest Tool Modal */}
      <SuggestModal
        isOpen={isSuggestOpen}
        onClose={() => setIsSuggestOpen(false)}
        onSubmitNewTool={handleAddNewTool}
      />
    </div>
  );
}
