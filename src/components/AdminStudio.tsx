"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Sparkles,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  LogOut,
  Search,
  CheckCircle2,
  X,
  ArrowUpRight,
  Layers,
  Inbox,
  RefreshCw,
  LayoutGrid,
  AlertTriangle,
  Upload,
  Loader2,
  Palette,
  Terminal,
  Database,
  Rocket,
  Code,
  Cpu,
  Smartphone,
  Shield,
  Box,
  Globe,
  Zap,
  Server,
} from "lucide-react";
import { ResourceCard } from "@/components/ResourceCard";
import { ToolItem, DomainID, SubcategoryID } from "@/data/tools";
import { useRouter } from "next/navigation";

import { DbSection, DbTool } from "@/lib/supabase";
import { WtfAnimatedBadge } from "@/components/WtfAnimatedBadge";
import { safeUrl } from "@/lib/sanitize";

const renderSectionIconHelper = (iconKey: string, className = "w-4 h-4") => {
  const k = (iconKey || "layers").toLowerCase();
  if (k === "palette" || k === "design") return <Palette className={className} />;
  if (k === "terminal" || k === "development") return <Terminal className={className} />;
  if (k === "sparkles" || k === "ai") return <Sparkles className={className} />;
  if (k === "database" || k === "backend") return <Database className={className} />;
  if (k === "rocket" || k === "boilerplates") return <Rocket className={className} />;
  if (k === "code") return <Code className={className} />;
  if (k === "cpu") return <Cpu className={className} />;
  if (k === "smartphone" || k === "mobile") return <Smartphone className={className} />;
  if (k === "shield" || k === "security") return <Shield className={className} />;
  if (k === "box" || k === "package") return <Box className={className} />;
  if (k === "globe" || k === "web") return <Globe className={className} />;
  if (k === "zap" || k === "fast") return <Zap className={className} />;
  if (k === "server") return <Server className={className} />;
  return <Layers className={className} />;
};

interface AdminSuggestion {
  id: string;
  name: string;
  url: string;
  category?: string;
  description?: string;
  github_url?: string;
  status?: string;
  created_at?: string;
}

interface AdminStudioProps {
  adminKey?: string;
  initialTools?: DbTool[];
}

export const AdminStudio: React.FC<AdminStudioProps> = ({ adminKey }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"tools" | "sections" | "add" | "suggestions">("tools");
  const [tools, setTools] = useState<DbTool[]>([]);
  const [sections, setSections] = useState<DbSection[]>([]);
  const [suggestions, setSuggestions] = useState<AdminSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sectionSearchQuery, setSectionSearchQuery] = useState("");
  const [domainFilter, setDomainFilter] = useState("all");

  // Delete Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: "tool" | "section" | "bulk_tools";
    name: string;
    slug?: string;
    domain?: string;
    items?: { domain: string; slug: string; name: string }[];
  }>({
    isOpen: false,
    type: "tool",
    name: "",
  });

  const [deleteConfirmCheck1, setDeleteConfirmCheck1] = useState(false);
  const [deleteConfirmCheck2, setDeleteConfirmCheck2] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Table row checkboxes for bulk actions
  const [selectedTools, setSelectedTools] = useState<Set<string>>(new Set());

  // Section Form State
  const [sectionForm, setSectionForm] = useState({
    title: "",
    slug: "",
    description: "",
    icon: "layers",
    orderIndex: 10,
  });
  const [editingSectionSlug, setEditingSectionSlug] = useState<string | null>(null);
  const [isSubmittingSection, setIsSubmittingSection] = useState(false);

  const getHeaders = (extra: Record<string, string> = {}) => {
    const headers: Record<string, string> = { ...extra };
    if (adminKey) {
      headers["x-admin-key"] = adminKey;
    }
    return headers;
  };

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    domain: "design",
    name: "",
    url: "",
    category: "ui-primitives",
    categoryLabel: "UI Primitives",
    description: "",
    fullDescription: "",
    image: "",
    badge: "Curated",
    stars: "4.8k",
    metaLeft: "v1.0",
    metaRight: "Free",
    githubUrl: "",
    docsUrl: "",
    installCmd: "",
  });

  // Editing state
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [, setEditingDomain] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Image Drag-and-Drop and Upload State
  const [isDragging, setIsDragging] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showManualImageUrl, setShowManualImageUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      setErrorMessage("Please upload a valid image file (PNG, JPG, WebP, GIF, or SVG).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("Image size exceeds 10MB limit.");
      return;
    }

    setIsUploadingImage(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: getHeaders(),
        credentials: "include",
        body: uploadData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      setFormData((prev) => ({ ...prev, image: data.url }));
      setSuccessMessage("Image uploaded to Supabase and preview updated!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to upload image";
      setErrorMessage(message);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileUpload(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFileUpload(file);
    }
  };

  // Load tools, sections, and suggestions
  const refreshData = async () => {
    setIsLoading(true);
    try {
      const [toolsRes, suggRes, sectionsRes] = await Promise.all([
        fetch("/api/admin/tools", { headers: getHeaders(), credentials: "include" }),
        fetch("/api/admin/suggestions", { headers: getHeaders(), credentials: "include" }),
        fetch("/api/admin/sections", { headers: getHeaders(), credentials: "include" }),
      ]);

      if (toolsRes.ok) {
        const d = await toolsRes.json();
        setTools(d.tools || []);
      }

      if (suggRes.ok) {
        const s = await suggRes.json();
        setSuggestions(s.suggestions || []);
      }

      if (sectionsRes && sectionsRes.ok) {
        const sec = await sectionsRes.json();
        setSections(sec.sections || []);
      }
    } catch (err) {
      console.error("Failed to load admin data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle Logout / Lock
  const handleLockAndExit = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/");
  };

  // Live Card Preview Object
  const previewTool: ToolItem = useMemo(() => {
    return {
      id: "preview-card",
      domain: (formData.domain as DomainID) || "design",
      name: formData.name || "Tool Name Preview",
      url: formData.url || "https://example.com",
      category: (formData.category as SubcategoryID) || "ui-primitives",
      categoryLabel: formData.categoryLabel || "UI Components",
      badge: formData.badge || "Curated",
      stars: formData.stars || "4.8k",
      metaLeft: formData.metaLeft || "v1.0",
      metaRight: formData.metaRight || "Free",
      description:
        formData.description ||
        "Enter a concise one-line description to see the real-time card preview.",
      image:
        formData.image ||
        "/previews/shadcn-ui.png",
      fullDescription: formData.fullDescription,
      githubUrl: formData.githubUrl,
      docsUrl: formData.docsUrl,
      installCmd: formData.installCmd,
    };
  }, [formData]);

  // Handle Submit (Create or Update)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    // Client-side instant duplicate check for URL / Domain
    const normalizeUrl = (u: string) => {
      return (u || "")
        .trim()
        .toLowerCase()
        .replace(/^https?:\/\//, "")
        .replace(/^www\./, "")
        .replace(/\/+$/, "");
    };

    const targetUrl = normalizeUrl(formData.url);
    const targetDomain = targetUrl.split("/")[0];
    const currentSlug = editingSlug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const duplicateTool = tools.find((t) => {
      if (t.slug === currentSlug) return false;
      const tNorm = normalizeUrl(t.url);
      if (tNorm === targetUrl) return true;
      const tDom = tNorm.split("/")[0];
      if (targetDomain && tDom === targetDomain && !targetUrl.includes("/") && !tNorm.includes("/")) {
        return true;
      }
      return false;
    });

    if (duplicateTool) {
      setErrorMessage(
        `A resource with this URL/domain already exists: "${duplicateTool.name}" (${duplicateTool.url}) in section "${duplicateTool.domain}". Duplicate URLs are not allowed.`
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/tools", {
        method: "POST",
        headers: getHeaders({ "Content-Type": "application/json" }),
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          slug: editingSlug || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save tool");
      }

      setSuccessMessage(
        editingSlug ? "Tool updated successfully!" : "Tool created and published!"
      );
      resetForm();
      refreshData();
      setActiveTab("tools");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit Click
  const handleEdit = (tool: DbTool) => {
    setEditingSlug(tool.slug);
    setEditingDomain(tool.domain || "design");
    setFormData({
      domain: tool.domain || "design",
      name: tool.name || "",
      url: tool.url || "",
      category: tool.category || "ui-primitives",
      categoryLabel: tool.category_label || "UI Primitives",
      description: tool.description || "",
      fullDescription: tool.full_description || "",
      image: tool.image || "",
      badge: tool.badge || "Curated",
      stars: tool.stars || "4.8k",
      metaLeft: tool.meta_left || "v1.0",
      metaRight: tool.meta_right || "Free",
      githubUrl: tool.github_url || "",
      docsUrl: tool.docs_url || "",
      installCmd: tool.install_cmd || "",
    });
    setActiveTab("add");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Open Delete Tool Modal
  const openDeleteToolModal = (domain: string, slug: string, name: string) => {
    setDeleteModal({
      isOpen: true,
      type: "tool",
      name,
      slug,
      domain,
    });
    setDeleteConfirmCheck1(false);
    setDeleteConfirmCheck2(false);
  };

  // Open Delete Section Modal
  const openDeleteSectionModal = (slug: string, title: string) => {
    setDeleteModal({
      isOpen: true,
      type: "section",
      name: title,
      slug,
    });
    setDeleteConfirmCheck1(false);
    setDeleteConfirmCheck2(false);
  };

  // Open Bulk Delete Modal
  const openBulkDeleteModal = () => {
    const items = filteredTools
      .filter((t) => selectedTools.has(`${t.domain}:${t.slug}`))
      .map((t) => ({ domain: t.domain || "development", slug: t.slug, name: t.name }));

    if (items.length === 0) return;

    setDeleteModal({
      isOpen: true,
      type: "bulk_tools",
      name: `${items.length} selected resources`,
      items,
    });
    setDeleteConfirmCheck1(false);
    setDeleteConfirmCheck2(false);
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;
    setDeleteModal({ isOpen: false, type: "tool", name: "" });
    setDeleteConfirmCheck1(false);
    setDeleteConfirmCheck2(false);
  };

  // Confirm and execute deletion
  const handleConfirmDelete = async () => {
    if (!deleteConfirmCheck1 || !deleteConfirmCheck2) return;
    setIsDeleting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (deleteModal.type === "tool" && deleteModal.domain && deleteModal.slug) {
        const res = await fetch(
          `/api/admin/tools?domain=${deleteModal.domain}&slug=${deleteModal.slug}`,
          {
            method: "DELETE",
            headers: getHeaders(),
            credentials: "include",
          }
        );
        if (!res.ok) {
          const d = await res.json();
          throw new Error(d.error || "Failed to delete tool");
        }
        setSuccessMessage(`"${deleteModal.name}" was permanently deleted.`);
        setSelectedTools((prev) => {
          const next = new Set(prev);
          next.delete(`${deleteModal.domain}:${deleteModal.slug}`);
          return next;
        });
      } else if (deleteModal.type === "section" && deleteModal.slug) {
        const res = await fetch(`/api/admin/sections?slug=${deleteModal.slug}`, {
          method: "DELETE",
          headers: getHeaders(),
          credentials: "include",
        });
        if (!res.ok) {
          const d = await res.json();
          throw new Error(d.error || "Failed to delete section");
        }
        setSuccessMessage(`Section "${deleteModal.name}" was permanently deleted.`);
      } else if (deleteModal.type === "bulk_tools" && deleteModal.items) {
        let deletedCount = 0;
        for (const item of deleteModal.items) {
          const res = await fetch(
            `/api/admin/tools?domain=${item.domain}&slug=${item.slug}`,
            {
              method: "DELETE",
              headers: getHeaders(),
              credentials: "include",
            }
          );
          if (res.ok) deletedCount++;
        }
        setSuccessMessage(`${deletedCount} resources were permanently deleted.`);
        setSelectedTools(new Set());
      }

      closeDeleteModal();
      refreshData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred while deleting";
      setErrorMessage(message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Row selection helpers
  const toggleSelectTool = (key: string) => {
    setSelectedTools((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const toggleSelectAllFiltered = () => {
    if (selectedTools.size >= filteredTools.length && filteredTools.length > 0) {
      setSelectedTools(new Set());
    } else {
      const next = new Set<string>();
      filteredTools.forEach((t) => next.add(`${t.domain}:${t.slug}`));
      setSelectedTools(next);
    }
  };

  // Handle Approve Suggestion
  const handleApproveSuggestion = async (sugg: AdminSuggestion, domain: string) => {
    try {
      const res = await fetch("/api/admin/suggestions", {
        method: "POST",
        headers: getHeaders({ "Content-Type": "application/json" }),
        credentials: "include",
        body: JSON.stringify({
          id: sugg.id,
          domain: domain,
          categoryLabel: "Curated",
          badge: "Community",
        }),
      });

      if (res.ok) {
        refreshData();
      } else {
        const d = await res.json();
        alert(d.error || "Approval failed");
      }
    } catch {
      alert("Error approving suggestion");
    }
  };

  // Handle Reject Suggestion
  const handleRejectSuggestion = async (id: string) => {
    if (!confirm("Dismiss and remove this suggestion?")) return;
    try {
      const res = await fetch(`/api/admin/suggestions?id=${id}`, {
        method: "DELETE",
        headers: getHeaders(),
        credentials: "include",
      });
      if (res.ok) {
        refreshData();
      }
    } catch {
      alert("Error dismissing suggestion");
    }
  };

  // Section Handlers
  const handleSectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingSection(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const sectionSlug = (sectionForm.slug || sectionForm.title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    if (!sectionSlug) {
      setErrorMessage("Please enter a valid title");
      setIsSubmittingSection(false);
      return;
    }

    // Check duplicate
    const match = sections.find(
      (s) =>
        (s.slug === sectionSlug || s.title.toLowerCase() === sectionForm.title.trim().toLowerCase()) &&
        s.slug !== editingSectionSlug
    );
    if (match) {
      setErrorMessage(`A section named "${match.title}" already exists.`);
      setIsSubmittingSection(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/sections", {
        method: "POST",
        headers: getHeaders({ "Content-Type": "application/json" }),
        credentials: "include",
        body: JSON.stringify(sectionForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save section");
      setSuccessMessage(editingSectionSlug ? "Section updated successfully!" : "New section created!");
      resetSectionForm();
      refreshData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save section";
      setErrorMessage(message);
    } finally {
      setIsSubmittingSection(false);
    }
  };

  const handleEditSection = (sec: DbSection) => {
    setEditingSectionSlug(sec.slug);
    setSectionForm({
      title: sec.title,
      slug: sec.slug,
      description: sec.description || "",
      icon: sec.icon || "layers",
      orderIndex: sec.order_index ?? 10,
    });
    setActiveTab("sections");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteSection = (slug: string, title: string) => {
    openDeleteSectionModal(slug, title);
  };

  const resetSectionForm = () => {
    setEditingSectionSlug(null);
    setSectionForm({
      title: "",
      slug: "",
      description: "",
      icon: "layers",
      orderIndex: 10,
    });
  };

  const resetForm = () => {
    setEditingSlug(null);
    setEditingDomain(null);
    setFormData({
      domain: "design",
      name: "",
      url: "",
      category: "ui-primitives",
      categoryLabel: "UI Primitives",
      description: "",
      fullDescription: "",
      image: "",
      badge: "Curated",
      stars: "4.8k",
      metaLeft: "v1.0",
      metaRight: "Free",
      githubUrl: "",
      docsUrl: "",
      installCmd: "",
    });
  };

  // Filter tools
  const filteredTools = useMemo(() => {
    return tools.filter((t) => {
      const matchesSearch =
        !searchQuery.trim() ||
        t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category_label?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDomain =
        domainFilter === "all" || t.domain === domainFilter;

      return matchesSearch && matchesDomain;
    });
  }, [tools, searchQuery, domainFilter]);

  // Filter sections for the Sections tab
  const filteredSections = useMemo(() => {
    if (!sectionSearchQuery.trim()) return sections;
    const q = sectionSearchQuery.toLowerCase().trim();
    return sections.filter(
      (sec) =>
        sec.title.toLowerCase().includes(q) ||
        sec.slug.toLowerCase().includes(q) ||
        (sec.description && sec.description.toLowerCase().includes(q))
    );
  }, [sections, sectionSearchQuery]);

  const pendingSuggestions = suggestions.filter((s) => s.status === "pending" || !s.status);

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-zinc-900 pb-20">
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200/90 py-3 px-4 sm:px-8 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <WtfAnimatedBadge />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-zinc-950 text-[15px] tracking-tight font-sans">
                  WTF Studio
                </span>
                <span className="font-mono text-[10.5px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Admin Vault
                </span>
              </div>
            </div>
          </div>

          {/* Tab Switcher Pills */}
          <div className="flex items-center gap-1 bg-zinc-100/90 p-1 rounded-lg border border-zinc-200/80 text-[12.5px] font-medium shadow-2xs">
            <button
              onClick={() => setActiveTab("tools")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeTab === "tools"
                  ? "bg-white text-zinc-950 shadow-xs font-semibold"
                  : "text-zinc-600 hover:text-zinc-950 hover:bg-white/60"
              }`}
            >
              <Layers className={`w-3.5 h-3.5 ${activeTab === "tools" ? "text-zinc-900" : "text-zinc-500"}`} />
              <span>Directory ({tools.length})</span>
            </button>

            <button
              onClick={() => {
                resetSectionForm();
                setActiveTab("sections");
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeTab === "sections"
                  ? "bg-white text-zinc-950 shadow-xs font-semibold"
                  : "text-zinc-600 hover:text-zinc-950 hover:bg-white/60"
              }`}
            >
              <LayoutGrid className={`w-3.5 h-3.5 ${activeTab === "sections" ? "text-zinc-900" : "text-zinc-500"}`} />
              <span>Sections ({sections.length})</span>
            </button>

            <button
              onClick={() => {
                resetForm();
                setActiveTab("add");
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeTab === "add"
                  ? "bg-white text-zinc-950 shadow-xs font-semibold"
                  : "text-zinc-600 hover:text-zinc-950 hover:bg-white/60"
              }`}
            >
              <Plus className={`w-3.5 h-3.5 ${activeTab === "add" ? "text-zinc-900" : "text-zinc-500"}`} />
              <span>{editingSlug ? "Edit Tool" : "Add Tool"}</span>
            </button>

            <button
              onClick={() => setActiveTab("suggestions")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer relative ${
                activeTab === "suggestions"
                  ? "bg-white text-zinc-950 shadow-xs font-semibold"
                  : "text-zinc-600 hover:text-zinc-950 hover:bg-white/60"
              }`}
            >
              <Inbox className={`w-3.5 h-3.5 ${activeTab === "suggestions" ? "text-zinc-900" : "text-zinc-500"}`} />
              <span>Suggestions</span>
              {pendingSuggestions.length > 0 && (
                <span className="w-4.5 h-4.5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {pendingSuggestions.length}
                </span>
              )}
            </button>
          </div>

          {/* Right Action: Log out */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleLockAndExit}
              className="inline-flex items-center gap-1.5 h-8.5 px-3 rounded-md bg-zinc-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-zinc-200 text-[12px] font-medium text-zinc-700 transition-colors cursor-pointer"
              title="Log out and return to homepage"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-8">
        {/* Messages */}
        {successMessage && (
          <div className="mb-6 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[13px] font-medium flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-emerald-600 hover:text-emerald-900"
            >
              ✕
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[13px] font-medium flex items-center justify-between">
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-600 hover:text-rose-900"
            >
              ✕
            </button>
          </div>
        )}

        {/* TAB 1: DIRECTORY TOOLS MANAGEMENT */}
        {activeTab === "tools" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-950 font-sans">
                  Directory Tools
                </h1>
                <p className="text-[13px] text-zinc-500">
                  Manage, update, and remove tools published in your live catalog.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search tools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-8.5 pl-8 pr-3 bg-white border border-zinc-200 rounded-md text-[12.5px] text-zinc-900 focus:outline-none focus:border-zinc-900"
                  />
                </div>

                <button
                  onClick={refreshData}
                  className="p-2 rounded-md bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-950 transition-colors"
                  title="Refresh data"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>

            {/* Domain Filter Pills */}
            <div className="flex items-center gap-1.5 mb-6 overflow-x-auto pb-1">
              {[
                { id: "all", label: "All Domains" },
                ...sections.map((s) => ({ id: s.slug, label: s.title })),
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setDomainFilter(pill.id)}
                  className={`px-3 py-1 rounded-md text-[12px] font-medium transition-colors cursor-pointer ${
                    domainFilter === pill.id
                      ? "bg-zinc-900 text-white"
                      : "bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-300"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Bulk Selection Action Bar */}
            {selectedTools.size > 0 && (
              <div className="flex items-center justify-between px-4 py-2.5 mb-3 bg-zinc-900 text-white rounded-lg shadow-sm animate-in fade-in duration-150">
                <div className="flex items-center gap-2 text-[12.5px] font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>
                    {selectedTools.size} tool{selectedTools.size > 1 ? "s" : ""} selected
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedTools(new Set())}
                    className="px-2.5 py-1 text-[12px] text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Clear selection
                  </button>
                  <button
                    onClick={openBulkDeleteModal}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[12px] font-medium rounded-md shadow-xs transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Selected ({selectedTools.size})</span>
                  </button>
                </div>
              </div>
            )}

            {/* Tools Table */}
            <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-zinc-50/80 border-b border-zinc-200/80 text-[11.5px] font-mono uppercase text-zinc-500 tracking-wider">
                  <tr>
                    <th className="py-3 px-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={filteredTools.length > 0 && selectedTools.size === filteredTools.length}
                        onChange={toggleSelectAllFiltered}
                        className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 cursor-pointer accent-zinc-900"
                        title="Select all"
                      />
                    </th>
                    <th className="py-3 px-4">Tool</th>
                    <th className="py-3 px-4">Domain / Category</th>
                    <th className="py-3 px-4">Stats & Badge</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filteredTools.map((t) => {
                    const rowKey = `${t.domain}:${t.slug}`;
                    const isSelected = selectedTools.has(rowKey);

                    return (
                      <tr
                        key={`${t.domain}-${t.slug}`}
                        className={`hover:bg-zinc-50/50 transition-colors ${
                          isSelected ? "bg-indigo-50/30" : ""
                        }`}
                      >
                        <td className="py-3 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectTool(rowKey)}
                            className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 cursor-pointer accent-zinc-900"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {t.image ? (
                              <img
                                src={t.image}
                                alt={t.name}
                                className="w-10 h-7 rounded object-cover border border-zinc-200"
                              />
                            ) : (
                              <div className="w-10 h-7 rounded bg-zinc-900 text-white font-mono text-[10px] flex items-center justify-center">
                                {t.name?.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <a
                                href={safeUrl(t.url)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-zinc-950 hover:underline inline-flex items-center gap-1"
                              >
                                <span>{t.name}</span>
                                <ExternalLink className="w-3 h-3 text-zinc-400" />
                              </a>
                              <p className="text-[12px] text-zinc-500 line-clamp-1 max-w-sm">
                                {t.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-800">
                              {t.domain}
                            </span>
                            <span className="text-[11px] text-zinc-500">
                              {t.category_label || t.category}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded">
                              {t.stars || "—"}
                            </span>
                            <span className="font-mono text-[10.5px] text-zinc-500 bg-zinc-50 border border-zinc-200 px-1.5 py-0.2 rounded">
                              {t.badge || "Curated"}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleEdit(t)}
                              className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer"
                              title="Edit tool"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => openDeleteToolModal(t.domain || "development", t.slug, t.name)}
                              className="p-1.5 rounded-md hover:bg-rose-50 text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Delete tool"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredTools.length === 0 && !isLoading && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-zinc-400">
                        No tools found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: ADD / EDIT TOOL (Split Screen with Live Preview) */}
        {activeTab === "add" && (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-950 font-sans">
                {editingSlug ? `Edit Tool: ${formData.name}` : "Add New Resource"}
              </h1>
              <p className="text-[13px] text-zinc-500">
                Configure details on the left. The live card updates on the right before you publish.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Form */}
              <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-zinc-200 shadow-2xs">
                <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[12px] font-medium text-zinc-700">
                          Domain / Section *
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            resetSectionForm();
                            setActiveTab("sections");
                          }}
                          className="text-[11px] text-zinc-500 hover:text-zinc-950 underline cursor-pointer"
                        >
                          + Manage Sections
                        </button>
                      </div>
                      <select
                        disabled={!!editingSlug}
                        value={formData.domain}
                        onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                        className="w-full h-9 px-3 bg-zinc-50 border border-zinc-200 rounded-md text-[13px] text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900"
                      >
                        {sections.map((sec) => (
                          <option key={sec.slug} value={sec.slug}>
                            {sec.title} ({sec.slug})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[12px] font-medium text-zinc-700 mb-1">
                        Resource Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Motion Primitives"
                        className="w-full h-9 px-3 bg-zinc-50 border border-zinc-200 rounded-md text-[13px] text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-medium text-zinc-700 mb-1">
                        Website URL *
                      </label>
                      <input
                        type="url"
                        required
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        placeholder="https://..."
                        className="w-full h-9 px-3 bg-zinc-50 border border-zinc-200 rounded-md text-[13px] text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] font-medium text-zinc-700 mb-1">
                        Category Label *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.categoryLabel}
                        onChange={(e) =>
                          setFormData({ ...formData, categoryLabel: e.target.value })
                        }
                        placeholder="e.g. UI Primitives, 3D Canvas"
                        className="w-full h-9 px-3 bg-zinc-50 border border-zinc-200 rounded-md text-[13px] text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-zinc-700 mb-1">
                      One-line Description *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="e.g. Open-source animated components built with Framer Motion"
                      className="w-full h-9 px-3 bg-zinc-50 border border-zinc-200 rounded-md text-[13px] text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900"
                    />
                  </div>

                  {/* Tool Preview Image - Upload / Drag-and-Drop Dropzone */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[12px] font-medium text-zinc-700">
                        Preview Image
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowManualImageUrl(!showManualImageUrl)}
                        className="text-[11px] text-zinc-500 hover:text-zinc-900 underline cursor-pointer"
                      >
                        {showManualImageUrl ? "Hide manual URL" : "Enter URL manually"}
                      </button>
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                      className="hidden"
                    />

                    {/* Drag-and-Drop Dropzone / Uploaded Preview */}
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`relative border-2 border-dashed rounded-xl p-4 transition-all ${
                        isDragging
                          ? "border-zinc-900 bg-zinc-100/80 ring-2 ring-zinc-900/10"
                          : "border-zinc-200 hover:border-zinc-300 bg-zinc-50/50"
                      }`}
                    >
                      {formData.image ? (
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          <div className="relative w-full sm:w-32 h-20 rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                            <img
                              src={formData.image}
                              alt="Tool preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src =
                                  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80";
                              }}
                            />
                          </div>

                          <div className="flex-1 min-w-0 text-center sm:text-left">
                            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[12px] font-medium text-zinc-800 mb-0.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="truncate">Image selected</span>
                            </div>
                            <p className="text-[11px] text-zinc-400 truncate max-w-xs font-mono mb-2.5">
                              {formData.image}
                            </p>
                            <div className="flex items-center justify-center sm:justify-start gap-2">
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploadingImage}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-zinc-700 bg-white border border-zinc-200 rounded-md hover:bg-zinc-50 transition-colors cursor-pointer shadow-2xs"
                              >
                                {isUploadingImage ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Upload className="w-3 h-3" />
                                )}
                                <span>Change Image</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setFormData({ ...formData, image: "" })}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-rose-600 hover:text-rose-700 bg-rose-50/50 hover:bg-rose-50 border border-rose-100 rounded-md transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="flex flex-col items-center justify-center py-4 px-2 text-center cursor-pointer group"
                        >
                          <div className="w-10 h-10 rounded-full bg-zinc-100 group-hover:bg-zinc-200/80 flex items-center justify-center text-zinc-600 group-hover:text-zinc-900 transition-colors mb-2">
                            {isUploadingImage ? (
                              <Loader2 className="w-5 h-5 animate-spin text-zinc-900" />
                            ) : (
                              <Upload className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
                            )}
                          </div>
                          <p className="text-[13px] font-medium text-zinc-800 mb-0.5">
                            {isUploadingImage
                              ? "Uploading to Supabase..."
                              : "Click to upload or drag & drop image"}
                          </p>
                          <p className="text-[11px] text-zinc-400">
                            PNG, JPG, WebP, GIF, or SVG (max 10MB)
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Manual URL Input Accordion */}
                    {showManualImageUrl && (
                      <div className="mt-2.5">
                        <input
                          type="url"
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          placeholder="https://... or Supabase storage URL"
                          className="w-full h-8 px-3 bg-zinc-50 border border-zinc-200 rounded-md text-[12px] text-zinc-800 focus:bg-white focus:outline-none focus:border-zinc-900 font-mono"
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-zinc-700 mb-1">
                        Badge
                      </label>
                      <input
                        type="text"
                        value={formData.badge}
                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                        className="w-full h-8 px-2.5 bg-zinc-50 border border-zinc-200 rounded text-[12px]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-zinc-700 mb-1">
                        Stars
                      </label>
                      <input
                        type="text"
                        value={formData.stars}
                        onChange={(e) => setFormData({ ...formData, stars: e.target.value })}
                        className="w-full h-8 px-2.5 bg-zinc-50 border border-zinc-200 rounded text-[12px]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-zinc-700 mb-1">
                        Meta Left
                      </label>
                      <input
                        type="text"
                        value={formData.metaLeft}
                        onChange={(e) => setFormData({ ...formData, metaLeft: e.target.value })}
                        className="w-full h-8 px-2.5 bg-zinc-50 border border-zinc-200 rounded text-[12px]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-zinc-700 mb-1">
                        Meta Right
                      </label>
                      <input
                        type="text"
                        value={formData.metaRight}
                        onChange={(e) => setFormData({ ...formData, metaRight: e.target.value })}
                        className="w-full h-8 px-2.5 bg-zinc-50 border border-zinc-200 rounded text-[12px]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-medium text-zinc-700 mb-1">
                        GitHub URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={formData.githubUrl}
                        onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                        placeholder="https://github.com/..."
                        className="w-full h-9 px-3 bg-zinc-50 border border-zinc-200 rounded-md text-[13px]"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] font-medium text-zinc-700 mb-1">
                        Documentation URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={formData.docsUrl}
                        onChange={(e) => setFormData({ ...formData, docsUrl: e.target.value })}
                        placeholder="https://docs..."
                        className="w-full h-9 px-3 bg-zinc-50 border border-zinc-200 rounded-md text-[13px]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 mt-2">
                    {editingSlug && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="h-9 px-4 text-[13px] font-medium text-zinc-600 hover:text-zinc-950"
                      >
                        Cancel Edit
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 h-9 px-5 bg-zinc-950 hover:bg-zinc-800 text-white text-[13px] font-medium rounded-md shadow-xs transition-all active:scale-98 disabled:opacity-50"
                    >
                      <span>{editingSlug ? "Update Tool" : "Publish to Directory"}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Column: Real-Time Live Card Preview */}
              <div className="lg:col-span-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11.5px] uppercase tracking-wider text-zinc-400 font-medium">
                    ✦ Live Card Preview
                  </span>
                  <span className="text-[11px] text-zinc-400">Updates as you type</span>
                </div>

                <div className="max-w-sm w-full mx-auto">
                  <ResourceCard
                    tool={previewTool}
                    isBookmarked={false}
                    onToggleBookmark={() => {}}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PENDING SUGGESTIONS QUEUE */}
        {activeTab === "suggestions" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-950 font-sans">
                  User Suggestions Queue
                </h1>
                <p className="text-[13px] text-zinc-500">
                  Review and publish resources submitted by community visitors.
                </p>
              </div>

              <button
                onClick={refreshData}
                className="p-2 rounded-md bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-950"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {suggestions.map((sugg) => (
                <div
                  key={sugg.id}
                  className="p-5 rounded-xl bg-white border border-zinc-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="max-w-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-[16px] font-bold text-zinc-950">{sugg.name}</h3>
                      <span className="font-mono text-[10.5px] px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
                        {sugg.category}
                      </span>
                      {sugg.status === "approved" && (
                        <span className="font-mono text-[10.5px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Approved
                        </span>
                      )}
                    </div>

                    <a
                      href={safeUrl(sugg.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12.5px] text-indigo-600 hover:underline inline-flex items-center gap-1 mb-2"
                    >
                      <span>{sugg.url}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <p className="text-[13px] text-zinc-600 leading-relaxed">
                      {sugg.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleRejectSuggestion(sugg.id)}
                      className="px-3 py-1.5 rounded-md text-[12.5px] font-medium text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
                    >
                      Dismiss
                    </button>

                    {sugg.status !== "approved" && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleApproveSuggestion(sugg, "design")}
                          className="px-3 py-1.5 rounded-md text-[12px] font-medium bg-zinc-900 hover:bg-zinc-800 text-white shadow-2xs"
                        >
                          Approve → Design
                        </button>
                        <button
                          onClick={() => handleApproveSuggestion(sugg, "development")}
                          className="px-3 py-1.5 rounded-md text-[12px] font-medium bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200"
                        >
                          → Dev
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {suggestions.length === 0 && !isLoading && (
                <div className="py-12 text-center text-zinc-400 bg-white rounded-xl border border-zinc-200">
                  No pending suggestions in the queue right now.
                </div>
              )}
            </div>
          </div>
        )}
        {/* TAB: SECTIONS MANAGEMENT */}
        {activeTab === "sections" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-950 font-sans">
                  Sections & Domains
                </h1>
                <p className="text-[13px] text-zinc-500">
                  Create, customize, and manage homepage rows and tool categories dynamically.
                </p>
              </div>

              <button
                onClick={refreshData}
                className="p-2 rounded-md bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-950 transition-colors self-start sm:self-auto"
                title="Refresh data"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Create / Edit Section Form */}
              <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-zinc-200 shadow-2xs">
                <h2 className="text-[15px] font-semibold text-zinc-950 mb-1">
                  {editingSectionSlug ? `Edit Section: ${sectionForm.title}` : "Create Entirely New Section"}
                </h2>
                <p className="text-[12px] text-zinc-500 mb-4">
                  Adding a section creates a dedicated row on the homepage and a navigation pill.
                </p>

                <form onSubmit={handleSectionSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-[12px] font-medium text-zinc-700 mb-1">
                      Section Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={sectionForm.title}
                      onChange={(e) => {
                        const title = e.target.value;
                        setSectionForm((prev) => ({
                          ...prev,
                          title,
                          slug: editingSectionSlug
                            ? prev.slug
                            : title
                                .toLowerCase()
                                .trim()
                                .replace(/[^a-z0-9]+/g, "-")
                                .replace(/^-|-$/g, ""),
                        }));
                      }}
                      placeholder="e.g. Mobile & Native, DevOps & CI/CD"
                      className="w-full h-9 px-3 bg-zinc-50 border border-zinc-200 rounded-md text-[13px] text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-zinc-700 mb-1">
                      Slug (Identifier) *
                    </label>
                    <input
                      type="text"
                      required
                      disabled={!!editingSectionSlug}
                      value={sectionForm.slug}
                      onChange={(e) =>
                        setSectionForm((prev) => ({
                          ...prev,
                          slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, ""),
                        }))
                      }
                      placeholder="e.g. mobile, devops"
                      className="w-full h-9 px-3 bg-zinc-50 border border-zinc-200 rounded-md text-[13px] font-mono text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900 disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-zinc-700 mb-1">
                      Description / Subtitle
                    </label>
                    <textarea
                      rows={2}
                      value={sectionForm.description}
                      onChange={(e) =>
                        setSectionForm((prev) => ({ ...prev, description: e.target.value }))
                      }
                      placeholder="e.g. Cross-platform frameworks, emulators, and mobile UI primitives."
                      className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-md text-[13px] text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[12px] font-medium text-zinc-700 mb-1">
                        Display Order
                      </label>
                      <input
                        type="number"
                        value={sectionForm.orderIndex}
                        onChange={(e) =>
                          setSectionForm((prev) => ({
                            ...prev,
                            orderIndex: parseInt(e.target.value) || 10,
                          }))
                        }
                        className="w-full h-9 px-3 bg-zinc-50 border border-zinc-200 rounded-md text-[13px]"
                      />
                      <p className="text-[10.5px] text-zinc-400 mt-1 leading-snug">
                        If this number is already taken, existing sections will automatically shift down (+1).
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[12px] font-medium text-zinc-700">
                          Icon Key
                        </label>
                        <a
                          href="https://lucide.dev/icons"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-zinc-500 hover:text-zinc-950 underline inline-flex items-center gap-0.5"
                        >
                          <span>Browse icons</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                      <div className="relative">
                        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-600">
                          {renderSectionIconHelper(sectionForm.icon, "w-4 h-4")}
                        </div>
                        <input
                          type="text"
                          value={sectionForm.icon}
                          onChange={(e) =>
                            setSectionForm((prev) => ({ ...prev, icon: e.target.value }))
                          }
                          placeholder="e.g. layers, terminal, database..."
                          className="w-full h-9 pl-9 pr-3 bg-zinc-50 border border-zinc-200 rounded-md text-[13px] text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900 font-mono"
                        />
                      </div>
                      <p className="text-[10.5px] text-zinc-400 mt-1 leading-snug">
                        Enter any icon name from Lucide (e.g. layers, code, database, shield).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100">
                    {editingSectionSlug && (
                      <button
                        type="button"
                        onClick={resetSectionForm}
                        className="h-9 px-4 text-[13px] font-medium text-zinc-600 hover:text-zinc-950 cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmittingSection}
                      className="inline-flex items-center gap-2 h-9 px-5 bg-zinc-950 hover:bg-zinc-800 text-white text-[13px] font-medium rounded-md shadow-xs transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
                    >
                      <span>{editingSectionSlug ? "Update Section" : "Create Section"}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Column: Existing Sections List */}
              <div className="lg:col-span-7 bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-zinc-200/80 bg-zinc-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-[14px] font-semibold text-zinc-950">
                      Active Sections ({filteredSections.length}{filteredSections.length !== sections.length ? ` of ${sections.length}` : ""})
                    </h2>
                    <span className="text-[11.5px] text-zinc-500">
                      Rendered in order on homepage
                    </span>
                  </div>

                  {/* Section Search Bar */}
                  <div className="relative w-full sm:w-52">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                    <input
                      type="text"
                      value={sectionSearchQuery}
                      onChange={(e) => setSectionSearchQuery(e.target.value)}
                      placeholder="Search sections..."
                      className="w-full h-8 pl-8 pr-3 bg-white border border-zinc-200 rounded-md text-[12px] text-zinc-900 focus:outline-none focus:border-zinc-900 placeholder:text-zinc-400"
                    />
                  </div>
                </div>

                <div className="divide-y divide-zinc-100">
                  {filteredSections.map((sec) => {
                    const count = tools.filter((t) => t.domain === sec.slug).length;
                    const isDefault = ["design", "development", "ai", "backend", "boilerplates"].includes(sec.slug);

                    return (
                      <div key={sec.slug} className="p-4 hover:bg-zinc-50/50 transition-colors flex items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="p-1 rounded bg-zinc-100 border border-zinc-200 text-zinc-700">
                              {renderSectionIconHelper(sec.icon || "layers", "w-3.5 h-3.5")}
                            </span>
                            <span className="font-semibold text-zinc-950 text-[14px]">
                              {sec.title}
                            </span>
                            <span className="font-mono text-[10.5px] px-2 py-0.2 rounded bg-zinc-100 border border-zinc-200 text-zinc-700">
                              {sec.slug}
                            </span>
                            {isDefault ? (
                              <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                                Core Section
                              </span>
                            ) : (
                              <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Custom Section
                              </span>
                            )}
                          </div>
                          <p className="text-[12px] text-zinc-500 line-clamp-1">
                            {sec.description || "No description provided."}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-zinc-400 font-mono">
                            <span>Order: {sec.order_index ?? "—"}</span>
                            <span>•</span>
                            <span>Tools: {count}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleEditSection(sec)}
                            className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer"
                            title="Edit section"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSection(sec.slug, sec.title)}
                            className="p-1.5 rounded-md hover:bg-rose-50 text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Delete section"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {filteredSections.length === 0 && (
                    <div className="py-10 text-center text-[13px] text-zinc-400">
                      No sections found matching &quot;{sectionSearchQuery}&quot;.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* CLEAN CENTERED CONFIRMATION POPUP WITH CHECKBOXES */}
      {deleteModal.isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={closeDeleteModal}
        >
          <div
            className="relative w-full max-w-md bg-white rounded-2xl border border-zinc-200 shadow-2xl p-6 text-left transform transition-all animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Button */}
            <button
              type="button"
              disabled={isDeleting}
              onClick={closeDeleteModal}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header with Red Warning Badge */}
            <div className="flex items-center gap-3.5 mb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200/80">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[17px] font-semibold text-zinc-950 tracking-tight font-sans">
                  {deleteModal.type === "section"
                    ? "Delete Section"
                    : deleteModal.type === "bulk_tools"
                    ? "Delete Selected Tools"
                    : "Delete Resource"}
                </h3>
                <p className="text-[12.5px] text-zinc-500">
                  This action requires confirmation before proceeding.
                </p>
              </div>
            </div>

            {/* Target Item Information Preview */}
            <div className="my-4 p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/90 text-[13px]">
              <div className="font-semibold text-zinc-950 line-clamp-1">
                {deleteModal.name}
              </div>
              {deleteModal.slug && (
                <div className="font-mono text-[11px] text-zinc-500 mt-1 flex items-center gap-2">
                  <span>
                    Slug: <strong className="text-zinc-700 font-semibold">{deleteModal.slug}</strong>
                  </span>
                  {deleteModal.domain && (
                    <>
                      <span>•</span>
                      <span>
                        Domain: <strong className="text-zinc-700 font-semibold">{deleteModal.domain}</strong>
                      </span>
                    </>
                  )}
                </div>
              )}
              {deleteModal.type === "section" && (
                <div className="text-[11.5px] text-rose-600 font-medium mt-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>All tools assigned to this section will also be permanently deleted.</span>
                </div>
              )}
            </div>

            {/* Interactive Safeguard Checkboxes */}
            <div className="flex flex-col gap-3 my-5 p-3.5 rounded-xl bg-rose-50/50 border border-rose-100">
              <label className="flex items-start gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={deleteConfirmCheck1}
                  onChange={(e) => setDeleteConfirmCheck1(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-zinc-300 text-rose-600 focus:ring-rose-500 cursor-pointer accent-rose-600"
                />
                <span className="text-[12.5px] text-zinc-700 select-none group-hover:text-zinc-950 font-medium leading-snug">
                  {deleteModal.type === "section"
                    ? "I understand that this section will be removed from the homepage and navigation."
                    : deleteModal.type === "bulk_tools"
                    ? `I understand that deleting ${deleteModal.items?.length || 0} resources cannot be undone.`
                    : "I understand that this action is permanent and cannot be undone."}
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={deleteConfirmCheck2}
                  onChange={(e) => setDeleteConfirmCheck2(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-zinc-300 text-rose-600 focus:ring-rose-500 cursor-pointer accent-rose-600"
                />
                <span className="text-[12.5px] text-zinc-700 select-none group-hover:text-zinc-950 font-medium leading-snug">
                  {deleteModal.type === "section"
                    ? "I acknowledge that all tools within this section will also be deleted."
                    : "Remove this resource immediately from the live index."}
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-zinc-100">
              <button
                type="button"
                disabled={isDeleting}
                onClick={closeDeleteModal}
                className="h-9 px-4 rounded-lg text-[13px] font-medium text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!deleteConfirmCheck1 || !deleteConfirmCheck2 || isDeleting}
                onClick={handleConfirmDelete}
                className="inline-flex items-center gap-2 h-9 px-4.5 rounded-lg bg-rose-600 hover:bg-rose-700 active:scale-98 text-white text-[13px] font-medium shadow-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Permanently</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
