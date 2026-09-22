"use client";

import React, { useState, useEffect, useMemo, Suspense, useSyncExternalStore } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { FilterBar, SortOption, ViewMode, CategoryOption } from "@/components/FilterBar";
import { ResourceCard } from "@/components/ResourceCard";
import { ResourceRow } from "@/components/ResourceRow";
import { EmptyState } from "@/components/EmptyState";
import { SuggestModal } from "@/components/SuggestModal";
import { SponsoredBanner } from "@/components/SponsoredBanner";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";
import { ToolItem, DOMAIN_TAXONOMY, DomainID, SubcategoryID } from "@/data/tools";
import { ArrowLeft, Layers, Flame } from "lucide-react";
import { motion } from "framer-motion";

import { fetchTools, fetchSections, DbSection, supabase, mapToolItemToDbTool } from "@/lib/supabase";

const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

interface DirectoryViewProps {
  initialDomain?: DomainID | "all";
  pageTitle: string;
  pageSubtitle: string;
  badgeText: string;
}

const DirectoryViewInner: React.FC<DirectoryViewProps> = ({
  initialDomain = "all",
  pageTitle,
  pageSubtitle,
  badgeText,
}) => {
  const searchParams = useSearchParams();
  const [tools, setTools] = useState<ToolItem[]>([]);
  const [sections, setSections] = useState<DbSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const urlQ = searchParams.get("q") || searchParams.get("search") || "";
  const urlCat = searchParams.get("category") || "all";

  const [searchQuery, setSearchQuery] = useState(urlQ);
  const [activeCategory, setActiveCategory] = useState<string>(urlCat);
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [isSuggestOpen, setIsSuggestOpen] = useState(false);
  const isMounted = useIsMounted();

  const [prevUrlState, setPrevUrlState] = useState({ q: urlQ, cat: urlCat });
  if (prevUrlState.q !== urlQ || prevUrlState.cat !== urlCat) {
    setPrevUrlState({ q: urlQ, cat: urlCat });
    setSearchQuery(urlQ);
    if (urlCat !== "all") {
      setActiveCategory(urlCat);
    }
  }

  // Helper to sync URL search parameters
  const updateUrl = (newQuery?: string, newCategory?: string) => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const q = newQuery !== undefined ? newQuery : searchQuery;
    const cat = newCategory !== undefined ? newCategory : activeCategory;

    if (q.trim()) {
      url.searchParams.set("q", q.trim());
    } else {
      url.searchParams.delete("q");
      url.searchParams.delete("search");
    }

    if (cat && cat !== "all") {
      url.searchParams.set("category", cat);
    } else {
      url.searchParams.delete("category");
    }

    const newPath = url.pathname + (url.search ? url.search : "");
    window.history.replaceState(null, "", newPath);
  };

  // Fetch real-time tools and sections from Supabase on mount
  useEffect(() => {
    async function loadSupabaseTools() {
      setIsLoading(true);
      try {
        const [toolsData, sectionsData] = await Promise.all([
          fetchTools(initialDomain),
          fetchSections(),
        ]);
        if (toolsData && toolsData.length > 0) {
          setTools(toolsData);
        }
        if (sectionsData && sectionsData.length > 0) {
          setSections(sectionsData);
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadSupabaseTools();
  }, [initialDomain]);

  // Initialize bookmarks from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("index_bookmarks");
      if (saved) {
        setBookmarks(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to read bookmarks:", e);
    }
  }, []);

  // Compute domain-specific category pills
  const categoryPills: CategoryOption[] = useMemo(() => {
    if (initialDomain !== "all" && DOMAIN_TAXONOMY[initialDomain as DomainID]) {
      const domainInfo = DOMAIN_TAXONOMY[initialDomain as DomainID];
      return [
        { id: "all", label: `All ${domainInfo.title}` },
        ...domainInfo.subcategories.map((sub) => ({ id: sub.id, label: sub.label })),
        { id: "bookmarks", label: "Bookmarks" },
      ];
    }
    return [
      { id: "all", label: "All Resources" },
      ...sections.map((s) => ({ id: s.slug, label: s.title })),
      { id: "bookmarks", label: "Bookmarks" },
    ];
  }, [initialDomain, sections]);

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
    category: SubcategoryID;
    description: string;
    githubUrl?: string;
  }) => {
    const newTool: ToolItem = {
      id: `custom-${Date.now()}`,
      name: newToolData.name,
      domain: (initialDomain !== "all" ? initialDomain : "design") as DomainID,
      category: newToolData.category as SubcategoryID,
      categoryLabel: newToolData.category,
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

    // Save to Supabase tools table
    try {
      supabase.from("tools").insert(mapToolItemToDbTool(newTool));
    } catch (err) {
      console.warn("Supabase tool insert warning:", err);
    }
  };

  // Filter & Sort tools
  const filteredAndSortedTools = useMemo(() => {
    let result = [...tools];

    // 1. Initial Domain Scope Filter (if inside a dedicated route)
    if (initialDomain !== "all" && activeCategory !== "bookmarks") {
      result = result.filter((t) => t.domain === initialDomain);
    }

    // 2. Subcategory / Universal Filter
    if (activeCategory === "bookmarks") {
      result = result.filter((t) => bookmarks.includes(t.id));
    } else if (activeCategory !== "all") {
      result = result.filter((t) => t.domain === activeCategory || t.category === activeCategory);
    }

    // 3. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const cleanQ = q.replace(/[\/\-_ ]/g, "");
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.categoryLabel.toLowerCase().includes(q) ||
          t.domain.toLowerCase().includes(q) ||
          t.badge.toLowerCase().includes(q) ||
          t.metaLeft.toLowerCase().includes(q) ||
          t.metaRight.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q.replace(/\//g, "-")) ||
          t.name.toLowerCase().replace(/[\/\-_ ]/g, "").includes(cleanQ)
      );
    }

    // 4. Sorting (Default: Alphabetical A-Z)
    if (sortBy === "stars") {
      result.sort((a, b) => {
        const getStarsNum = (s: string) => {
          if (s.includes("M")) return parseFloat(s) * 1000000;
          if (s.includes("k")) return parseFloat(s) * 1000;
          return parseInt(s) || 0;
        };
        return getStarsNum(b.stars) - getStarsNum(a.stars);
      });
    } else if (sortBy === "name" || sortBy === "featured") {
      result.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
    } else if (sortBy === "category") {
      result.sort((a, b) => a.categoryLabel.localeCompare(b.categoryLabel));
    }

    return result;
  }, [tools, initialDomain, activeCategory, searchQuery, sortBy, bookmarks]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f5f7]">
      {/* Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Sticky Top Navigation */}
      <Header
        searchQuery={searchQuery}
        onSearchSubmit={(q) => {
          setSearchQuery(q);
          updateUrl(q, undefined);
        }}
        onOpenSuggest={() => setIsSuggestOpen(true)}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          updateUrl(undefined, cat);
        }}
        bookmarkCount={isMounted ? bookmarks.length : 0}
        tools={tools}
      />

      {/* Main Content Area */}
      <main className="w-full pt-16 flex-1">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-8 md:py-10">
          {/* Breadcrumbs / Back navigation */}
          <div className="mb-6 flex items-center justify-start">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-white hover:bg-zinc-100 border border-zinc-300 text-zinc-900 text-[12.5px] font-semibold shadow-2xs hover:border-zinc-400 transition-all cursor-pointer group"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-zinc-700 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to All Sections</span>
            </Link>
          </div>

          {/* PAGE HERO - Instant GPU-accelerated entrance animation */}
          <section className="mb-8">
            <div className="text-left max-w-3xl">
              <div className="animate-hero-badge inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-zinc-300 text-[12px] font-semibold text-zinc-800 mb-3 shadow-2xs">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>{badgeText}</span>
              </div>
              <h1 className="animate-hero-title text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-950 mb-2.5 font-sans">
                {pageTitle}
              </h1>
              <p className="animate-hero-subtitle text-[15px] md:text-[16.5px] text-zinc-700 leading-relaxed font-normal">
                {pageSubtitle}
              </p>
            </div>
          </section>

          {/* Filter Bar & View Controls at Top (With Domain-Specific Subcategories) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-6"
          >
            <FilterBar
              categories={categoryPills}
              activeCategory={activeCategory}
              onSelectCategory={(cat) => {
                setActiveCategory(cat);
                updateUrl(undefined, cat);
              }}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              resultCount={filteredAndSortedTools.length}
              searchQuery={searchQuery}
              onClearQuery={() => {
                setSearchQuery("");
                updateUrl("", undefined);
              }}
            />
          </motion.div>

          {/* Content Listing */}
          <div className="flex flex-col gap-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-[188px] rounded-xl border border-zinc-200/80 bg-white p-4.5 animate-pulse flex flex-col justify-between shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-zinc-200/70" />
                      <div className="space-y-1.5 flex-1">
                        <div className="h-3.5 bg-zinc-200/80 rounded w-2/3" />
                        <div className="h-2.5 bg-zinc-200/50 rounded w-1/3" />
                      </div>
                    </div>
                    <div className="space-y-2 my-2">
                      <div className="h-3 bg-zinc-200/60 rounded w-full" />
                      <div className="h-3 bg-zinc-200/40 rounded w-4/5" />
                    </div>
                    <div className="flex justify-between items-center pt-2.5 border-t border-zinc-100">
                      <div className="h-3.5 bg-zinc-200/60 rounded w-16" />
                      <div className="h-3.5 bg-zinc-200/60 rounded w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredAndSortedTools.length === 0 ? (
              <ScrollReveal direction="up" delay={0.1}>
                <EmptyState
                  searchQuery={searchQuery}
                  activeCategory={activeCategory}
                  onClearQuery={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                    updateUrl("", "all");
                  }}
                  onResetCategory={() => {
                    setActiveCategory("all");
                    setSearchQuery("");
                    updateUrl("", "all");
                  }}
                  onOpenSuggest={() => setIsSuggestOpen(true)}
                  onSelectTag={(tag) => {
                    setSearchQuery(tag);
                    updateUrl(tag, undefined);
                  }}
                />
              </ScrollReveal>
            ) : (
              <>
                {/* Top Sponsor / Ad Banner */}
                <ScrollReveal direction="up" delay={0.05}>
                  <SponsoredBanner
                    variant={initialDomain === "ai" || initialDomain === "backend" ? "supabase" : "vercel"}
                  />
                </ScrollReveal>

                {/* Grid vs List View */}
                {viewMode === "grid" ? (
                  <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredAndSortedTools.map((tool, idx) => (
                      <ScrollReveal
                        key={tool.id}
                        direction="up"
                        distance={18}
                        delay={Math.min(idx * 0.03, 0.25)}
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
                    {filteredAndSortedTools.map((tool, idx) => (
                      <ScrollReveal
                        key={tool.id}
                        direction="up"
                        distance={14}
                        delay={Math.min(idx * 0.02, 0.2)}
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

                {/* Bottom Cross-Domain Discovery */}
                <section className="pt-10 pb-4 flex flex-col items-center justify-center gap-4">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 text-[12.5px] font-medium shadow-2xs hover:border-zinc-300 transition-all cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Return to All Sections</span>
                  </Link>
                </section>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Clean Minimal Footer */}
      <ScrollReveal direction="up" delay={0.2} duration={0.6} distance={16}>
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
};

export const DirectoryView: React.FC<DirectoryViewProps> = (props) => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fcfcfd]" />}>
      <DirectoryViewInner {...props} />
    </Suspense>
  );
};
