"use client";

import React, { useState, useEffect, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { ToolItem, SubcategoryID } from "@/data/tools";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Layers,
  Code,
  Cpu,
  Smartphone,
  Shield,
  Box,
  Globe,
  Zap,
  Server,
} from "lucide-react";
import { TbPalette, TbTerminal2, TbDatabase, TbRocket } from "react-icons/tb";
import { RiSparkling2Fill } from "react-icons/ri";
import { motion } from "framer-motion";

import { fetchTools, fetchSections, DbSection, supabase, mapToolItemToDbTool } from "@/lib/supabase";

const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

function SkeletonCardGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {[...Array(count)].map((_, i) => (
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
  );
}

function SectionSkeletonGroup({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-10">
      {[...Array(count)].map((_, secIdx) => (
        <div key={secIdx} className="flex flex-col gap-4">
          {/* Section Header Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200/90 animate-pulse">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-md bg-zinc-200/80 shrink-0" />
              <div className="space-y-1.5">
                <div className="h-4.5 bg-zinc-200/90 rounded-md w-36 sm:w-44" />
                <div className="h-3 bg-zinc-200/50 rounded w-48 sm:w-72" />
              </div>
            </div>
            <div className="h-8 w-24 rounded-md bg-zinc-200/60 shrink-0 self-start sm:self-auto" />
          </div>

          {/* 3 Card Skeletons */}
          <SkeletonCardGrid count={3} />
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [tools, setTools] = useState<ToolItem[]>([]);
  const [sections, setSections] = useState<DbSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [isSuggestOpen, setIsSuggestOpen] = useState(false);
  const isMounted = useIsMounted();
  const [forceFullCatalog, setForceFullCatalog] = useState(false);

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
    async function loadSupabaseData() {
      setIsLoading(true);
      try {
        const [toolsData, sectionsData] = await Promise.all([
          fetchTools("all"),
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
    loadSupabaseData();
  }, []);

  // Initialize bookmarks and URL query params
  useEffect(() => {
    try {
      const saved = localStorage.getItem("index_bookmarks");
      if (saved) {
        setBookmarks(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to read bookmarks:", e);
    }

    // Read URL query parameters on initial load
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q") || params.get("search");
      const cat = params.get("category");
      if (q) {
        setSearchQuery(q);
        setForceFullCatalog(true);
      }
      if (cat) {
        setActiveCategory(cat);
        setForceFullCatalog(cat !== "all");
      }
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
    category: SubcategoryID;
    description: string;
    githubUrl?: string;
  }) => {
    const isDesign = ["ui-primitives", "motion-effects", "spatial-3d", "iconography", "color-gradients", "typography"].includes(newToolData.category);
    const newTool: ToolItem = {
      id: `custom-${Date.now()}`,
      name: newToolData.name,
      domain: isDesign ? "design" : "development",
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

  const [activeSection, setActiveSection] = useState<string>("all");

  // Track active section on scroll
  useEffect(() => {
    const sectionIds = sections.map((s) => `${s.slug}-section`);

    const handleScroll = () => {
      const scrollPos = window.scrollY + 180;
      if (window.scrollY < 240) {
        setActiveSection("all");
        return;
      }

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (scrollPos >= top) {
            setActiveSection(sectionIds[i]);
            return;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    if (id === "all") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActiveSection("all");
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(id);
    }
  };

  const renderSectionIcon = (slug: string, iconKey?: string | null, className?: string) => {
    const cls = className || "w-4 h-4";
    const k = (iconKey || slug).toLowerCase();
    if (k === "design" || k === "palette") return <TbPalette className={cls} />;
    if (k === "development" || k === "terminal") return <TbTerminal2 className={cls} />;
    if (k === "ai" || k === "sparkles") return <RiSparkling2Fill className={cls} />;
    if (k === "backend" || k === "database") return <TbDatabase className={cls} />;
    if (k === "boilerplates" || k === "rocket") return <TbRocket className={cls} />;
    if (k === "code") return <Code className={cls} />;
    if (k === "cpu") return <Cpu className={cls} />;
    if (k === "smartphone" || k === "mobile") return <Smartphone className={cls} />;
    if (k === "shield" || k === "security") return <Shield className={cls} />;
    if (k === "box" || k === "package") return <Box className={cls} />;
    if (k === "globe" || k === "web") return <Globe className={cls} />;
    if (k === "zap" || k === "fast") return <Zap className={cls} />;
    if (k === "server") return <Server className={cls} />;
    return <Layers className={cls} />;
  };

  // Filter & Sort tools for catalogue mode
  const filteredAndSortedTools = useMemo(() => {
    let result = [...tools];

    // Category / Domain filter
    if (activeCategory === "bookmarks") {
      result = result.filter((t) => bookmarks.includes(t.id));
    } else if (activeCategory !== "all") {
      result = result.filter((t) => t.domain === activeCategory || t.category === activeCategory);
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
          t.domain.toLowerCase().includes(q) ||
          t.badge.toLowerCase().includes(q) ||
          t.metaLeft.toLowerCase().includes(q) ||
          t.metaRight.toLowerCase().includes(q)
      );
    }

    // Sorting (Default to Alphabetical Order A-Z)
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
  }, [tools, activeCategory, searchQuery, sortBy, bookmarks]);

  const displayedTools = filteredAndSortedTools;
  const isSectionedMode = activeCategory === "all" && !searchQuery.trim() && !forceFullCatalog;

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfd]">
      {/* Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Sticky Top Navigation */}
      <Header
        searchQuery={searchQuery}
        onSearchSubmit={(q) => {
          if (q.trim()) {
            router.push(`/directory?q=${encodeURIComponent(q.trim())}`);
          } else {
            setSearchQuery("");
            updateUrl("", undefined);
          }
        }}
        onOpenSuggest={() => setIsSuggestOpen(true)}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          updateUrl(undefined, cat);
          setSortBy("name");
          setForceFullCatalog(cat !== "all");
        }}
        bookmarkCount={isMounted ? bookmarks.length : 0}
        tools={tools}
      />

      {/* Main Content Area */}
      <main className="w-full pt-16 flex-1">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-8 md:py-10">
          {/* HERO SECTION - Instant GPU-accelerated entrance animation */}
          <section className="mb-7">
            <div className="text-center max-w-3xl mx-auto">
              <div className="animate-hero-badge inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[12px] font-medium text-zinc-700 mb-4 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-zinc-800" />
                <span>The Curated Developer Directory</span>
              </div>
              <h1 className="animate-hero-title text-3xl md:text-5xl font-bold tracking-tight text-zinc-950 mb-3 font-sans">
                Web Tool Finder <span className="text-zinc-400 font-normal text-2xl md:text-4xl">(WTF)</span>
              </h1>
              <p className="animate-hero-subtitle text-[15px] md:text-base text-zinc-600 max-w-2xl mx-auto leading-relaxed">
                Handpicked UI primitives, interaction engines, serverless databases, and AI tooling organized by domain.
              </p>
            </div>
          </section>

          {/* SECTION NAVIGATION FOR CURRENT PAGE (Scrolls naturally with content) */}
          {isSectionedMode ? (
            <div className="animate-hero-nav py-2.5 mb-8 border-b border-zinc-200/80 -mx-4 px-4 sm:-mx-6 sm:px-6 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 max-w-6xl mx-auto">
                {/* Title Names Navigation with Active State Tracking */}
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
                  <button
                    onClick={() => scrollToSection("all")}
                    className={`px-3.5 py-1.5 rounded-md text-[13px] font-medium transition-all active:scale-95 cursor-pointer ${
                      activeSection === "all"
                        ? "bg-zinc-900 text-white shadow-xs"
                        : "bg-white text-zinc-700 border border-zinc-200/80 hover:text-zinc-950 hover:border-zinc-300 hover:bg-zinc-50"
                    }`}
                  >
                    All Sections
                  </button>

                  {isLoading && sections.length === 0 ? (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className="h-8 w-24 rounded-md bg-zinc-200/70 animate-pulse" />
                      <div className="h-8 w-28 rounded-md bg-zinc-200/60 animate-pulse" />
                      <div className="h-8 w-20 rounded-md bg-zinc-200/50 animate-pulse" />
                      <div className="h-8 w-26 rounded-md bg-zinc-200/60 animate-pulse" />
                      <div className="h-8 w-28 rounded-md bg-zinc-200/50 animate-pulse" />
                    </div>
                  ) : (
                    sections.map((sec) => {
                      const secId = `${sec.slug}-section`;
                      const isActive = activeSection === secId;
                      return (
                        <button
                          key={sec.slug}
                          onClick={() => scrollToSection(secId)}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-[13px] font-medium transition-all active:scale-95 cursor-pointer ${
                            isActive
                              ? "bg-zinc-900 text-white shadow-xs"
                              : "bg-white text-zinc-700 border border-zinc-200/80 hover:text-zinc-950 hover:border-zinc-300 hover:bg-zinc-50"
                          }`}
                        >
                          {renderSectionIcon(sec.slug, sec.icon, `w-4 h-4 ${isActive ? "text-white" : "text-zinc-900"}`)}
                          <span>{sec.title}</span>
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Direct Link to View All Catalogue (Sorted Alphabetically) */}
                <Link
                  href="/directory"
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium text-zinc-600 hover:text-zinc-950 transition-colors shrink-0 cursor-pointer self-end sm:self-auto group"
                >
                  <span>Explore Full Directory {tools.length > 0 ? `(${tools.length})` : ""}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-950 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          ) : null}

          {/* SECTION 1: GROUPED DISCOVERY VIEW (Dynamic sections from database) */}
          {isSectionedMode ? (
            <div className="flex flex-col gap-10">
              {isLoading && sections.length === 0 ? (
                <SectionSkeletonGroup count={3} />
              ) : (
                sections.map((section, secIdx) => {
                  const secTools = tools.filter((t) => t.domain === section.slug);
                  const isCore = ["design", "development", "ai", "backend", "boilerplates"].includes(section.slug);
                  const linkHref = isCore ? `/${section.slug}` : `/directory?category=${section.slug}`;

                  return (
                    <React.Fragment key={section.slug}>
                      {secIdx === 0 && (
                        <ScrollReveal direction="up" delay={0.05}>
                          <SponsoredBanner variant="vercel" />
                        </ScrollReveal>
                      )}
                      {secIdx === 1 && (
                        <ScrollReveal direction="up" delay={0.1}>
                          <SponsoredBanner variant="supabase" />
                        </ScrollReveal>
                      )}

                      <section id={`${section.slug}-section`} className="flex flex-col gap-4 scroll-mt-36">
                        <ScrollReveal direction="up" delay={0.08 + (secIdx % 4) * 0.02}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200/90">
                            <div className="flex items-center gap-2">
                              {renderSectionIcon(section.slug, section.icon, "w-4.5 h-4.5 text-zinc-900 shrink-0")}
                              <div>
                                <h2 className="text-[16px] sm:text-[17.5px] font-semibold text-zinc-950 tracking-tight">
                                  {section.title}
                                </h2>
                                <p className="text-[12px] text-zinc-500">
                                  {section.description}
                                </p>
                              </div>
                            </div>

                            <Link
                              href={linkHref}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white hover:bg-zinc-50 text-zinc-800 text-[12.5px] font-medium border border-zinc-200/90 hover:border-zinc-300 shadow-2xs transition-all self-start sm:self-auto group cursor-pointer"
                            >
                              <span>View All {secTools.length > 0 ? `(${secTools.length})` : ""}</span>
                              <ArrowRight className="w-3.5 h-3.5 text-zinc-500 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                          </div>
                        </ScrollReveal>

                        {/* Section Grid (1 single row of 3 cards) */}
                        {secTools.length === 0 ? (
                          <div className="py-8 px-4 rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 text-center">
                            <p className="text-[13px] text-zinc-500">
                              No tools published in <span className="font-semibold text-zinc-700">{section.title}</span> yet.
                            </p>
                            <Link
                              href="/manage"
                              className="mt-1.5 inline-flex items-center gap-1 text-[12px] font-medium text-zinc-900 hover:underline"
                            >
                              Add tools in Admin Studio
                            </Link>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {secTools.slice(0, 3).map((tool, idx) => (
                              <ScrollReveal
                                key={tool.id}
                                direction="up"
                                distance={16}
                                delay={idx * 0.04}
                              >
                                <ResourceCard
                                  tool={tool}
                                  isBookmarked={bookmarks.includes(tool.id)}
                                  onToggleBookmark={handleToggleBookmark}
                                  delayIndex={idx}
                                />
                              </ScrollReveal>
                            ))}
                          </div>
                        )}
                      </section>
                    </React.Fragment>
                  );
                })
              )}

              {/* BOTTOM "VIEW ALL" FULL DIRECTORY CTA BANNER */}
              {!isLoading && sections.length > 0 && (
                <ScrollReveal direction="up" delay={0.2}>
                  <section className="py-5 px-6 sm:py-6 sm:px-8 rounded-xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-5 border border-zinc-800">
                    <div className="max-w-xl text-center md:text-left">
                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1.5">
                        Explore All Resources
                      </h3>
                      <p className="text-[13px] text-zinc-400 leading-relaxed">
                        Search and filter all {tools.length > 0 ? tools.length : 28}+ curated tools across all categories.
                      </p>
                    </div>

                    <Link
                      href="/directory"
                      className="inline-flex items-center justify-center gap-2 h-9.5 px-5 bg-white hover:bg-zinc-100 active:scale-98 text-zinc-950 text-[13px] font-semibold rounded-lg shadow transition-all shrink-0 cursor-pointer group"
                    >
                      <span>View All {tools.length > 0 ? tools.length : 28} Tools</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </section>
                </ScrollReveal>
              )}
            </div>
          ) : (
            /* SECTION 2: "VIEW ALL" / CATALOGUE VIEW (With Full FilterBar At Top) */
            <div className="flex flex-col gap-6">
              {/* Back to Grouped Sections Navigation */}
              <div className="flex items-center justify-start pb-1">
                <button
                  onClick={() => {
                    setActiveCategory("all");
                    setSearchQuery("");
                    updateUrl("", "all");
                    setForceFullCatalog(false);
                  }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white hover:bg-zinc-50 border border-zinc-200/90 text-zinc-800 text-[12.5px] font-medium shadow-2xs hover:border-zinc-300 transition-all cursor-pointer group"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-zinc-500 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Back to Grouped Sections</span>
                </button>
              </div>

              {/* Full Filter Bar at the Top of View All */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                <FilterBar
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

              {isLoading ? (
                <SkeletonCardGrid count={6} />
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
                      setActiveCategory("all");
                      updateUrl(tag, "all");
                    }}
                  />
                </ScrollReveal>
              ) : (
                <>
                  {/* Top Ad banner */}
                  <ScrollReveal direction="up" delay={0.05}>
                    <SponsoredBanner variant="vercel" />
                  </ScrollReveal>

                  {/* Grid vs List View */}
                  {viewMode === "grid" ? (
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {displayedTools.map((tool, idx) => (
                        <ScrollReveal
                          key={tool.id}
                          direction="up"
                          distance={18}
                          delay={Math.min(idx * 0.04, 0.3)}
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
                      {displayedTools.map((tool, idx) => (
                        <ScrollReveal
                          key={tool.id}
                          direction="up"
                          distance={14}
                          delay={Math.min(idx * 0.03, 0.25)}
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

                  {/* Bottom Return to Grouped Mode */}
                  <section className="pt-8 pb-4 flex flex-col items-center justify-center gap-4">
                    <button
                      onClick={() => {
                        setActiveCategory("all");
                        setSearchQuery("");
                        setForceFullCatalog(false);
                      }}
                      className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 text-[12.5px] font-medium shadow-2xs hover:border-zinc-300 transition-all cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Back to Grouped Sections</span>
                    </button>
                  </section>
                </>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Clean Minimal Footer */}
      <ScrollReveal direction="up" delay={0.3} duration={0.65} distance={20}>
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
