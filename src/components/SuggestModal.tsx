"use client";

import React, { useState } from "react";
import { X, ArrowUpRight, CheckCircle2, Sparkles } from "lucide-react";
import { CATEGORIES } from "@/data/tools";

interface SuggestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitNewTool?: (newTool: {
    name: string;
    url: string;
    category: string;
    description: string;
    githubUrl?: string;
  }) => void;
}

export const SuggestModal: React.FC<SuggestModalProps> = ({
  isOpen,
  onClose,
  onSubmitNewTool,
}) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("ui-primitives");
  const [description, setDescription] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [honeypot, setHoneypot] = useState(""); // Anti-bot honeypot field
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  // Safe HTTP/HTTPS URL Validator (rejects javascript:, data:, vbscript: etc)
  const isValidUrl = (testUrl: string) => {
    try {
      const parsed = new URL(
        testUrl.startsWith("http://") || testUrl.startsWith("https://")
          ? testUrl
          : `https://${testUrl}`
      );
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Anti-Bot Honeypot check: If filled, bot trapped -> drop silently
    if (honeypot) {
      console.warn("Spam bot submission blocked via honeypot.");
      setSubmitted(true);
      setTimeout(() => onClose(), 1200);
      return;
    }

    // 2. Client-side Rate Limit check (15s cooldown per submission)
    const lastSub = localStorage.getItem("last_tool_submission");
    const now = Date.now();
    if (lastSub && now - Number(lastSub) < 15000) {
      setErrorMessage("Please wait a few moments before submitting another tool.");
      return;
    }

    // 3. Sanitized inputs & length constraints
    const cleanName = name.trim().slice(0, 120);
    const cleanDesc = description.trim().slice(0, 300);
    const rawUrl = url.trim().slice(0, 500);
    const rawGithub = githubUrl.trim().slice(0, 500);

    if (!cleanName || !rawUrl) {
      setErrorMessage("Please provide a resource name and valid URL.");
      return;
    }

    if (!isValidUrl(rawUrl)) {
      setErrorMessage("Invalid website URL. Please enter a valid https:// web address.");
      return;
    }

    if (rawGithub && !isValidUrl(rawGithub)) {
      setErrorMessage("Invalid GitHub/Docs URL. Please enter a valid web address.");
      return;
    }

    const formattedUrl = rawUrl.startsWith("http://") || rawUrl.startsWith("https://")
      ? rawUrl
      : `https://${rawUrl}`;

    const formattedGithub = rawGithub
      ? (rawGithub.startsWith("http://") || rawGithub.startsWith("https://")
          ? rawGithub
          : `https://${rawGithub}`)
      : undefined;

    // Send to parent component
    if (onSubmitNewTool) {
      onSubmitNewTool({
        name: cleanName,
        url: formattedUrl,
        category,
        description: cleanDesc,
        githubUrl: formattedGithub,
      });
    }

    // Save securely via server API route
    try {
      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanName,
          url: formattedUrl,
          category,
          description: cleanDesc,
          githubUrl: formattedGithub,
          honeypot,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Failed to submit recommendation.");
        return;
      }

      localStorage.setItem("last_tool_submission", String(now));
    } catch {
      setErrorMessage("Network error. Please try again.");
      return;
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName("");
      setUrl("");
      setDescription("");
      setGithubUrl("");
      setHoneypot("");
      setErrorMessage(null);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs animate-card">
      <div className="fixed inset-0" onClick={onClose}></div>

      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-xl border border-zinc-300 shadow-2xl p-5 sm:p-6 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3.5 top-3.5 sm:right-4 sm:top-4 p-1.5 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="py-8 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-[17px] font-semibold text-zinc-950 mb-1">
              Resource Submitted!
            </h3>
            <p className="text-[13px] text-zinc-500 max-w-xs">
              Thank you for contributing to Web Tools Finder. Our curation team will review and verify your submission shortly.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded bg-zinc-900 text-white flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-[17px] font-semibold text-zinc-950 tracking-tight">
                Suggest a Resource
              </h3>
            </div>
            <p className="text-[13px] text-zinc-500 mb-4">
              Submit modern libraries, animation tools, or UI primitives for directory inclusion.
            </p>

            {errorMessage && (
              <div className="mb-4 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[12.5px] font-medium flex items-center justify-between">
                <span>{errorMessage}</span>
                <button
                  type="button"
                  onClick={() => setErrorMessage(null)}
                  className="text-rose-500 hover:text-rose-800 text-xs font-bold px-1.5 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Anti-bot honeypot field - real users never see this, automated spam bots fill it */}
              <div
                style={{
                  position: "absolute",
                  left: "-9999px",
                  top: "-9999px",
                  opacity: 0,
                  pointerEvents: "none",
                }}
                aria-hidden="true"
              >
                <input
                  type="text"
                  name="website_url_hp"
                  tabIndex={-1}
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  autoComplete="off"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-zinc-700 mb-1">
                  Resource / Tool Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Motion Primitives"
                  className="w-full h-10 sm:h-9 px-3 bg-zinc-50 border border-zinc-200 rounded-md text-[14px] sm:text-[13px] text-zinc-900 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-zinc-700 mb-1">
                  Website URL *
                </label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full h-10 sm:h-9 px-3 bg-zinc-50 border border-zinc-200 rounded-md text-[14px] sm:text-[13px] text-zinc-900 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-zinc-700 mb-1">
                    Primary Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-10 sm:h-9 px-3 bg-zinc-50 border border-zinc-200 rounded-md text-[14px] sm:text-[13px] text-zinc-900 focus:bg-white focus:outline-none focus:border-indigo-500"
                  >
                    {CATEGORIES.filter((c) => c.id !== "all" && c.id !== "bookmarks").map(
                      (cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-zinc-700 mb-1">
                    GitHub / NPM URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full h-10 sm:h-9 px-3 bg-zinc-50 border border-zinc-200 rounded-md text-[14px] sm:text-[13px] text-zinc-900 focus:bg-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-zinc-700 mb-1">
                  One-line Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Open-source animated components built with Framer Motion"
                  className="w-full h-10 sm:h-9 px-3 bg-zinc-50 border border-zinc-200 rounded-md text-[14px] sm:text-[13px] text-zinc-900 focus:bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-100 mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-8.5 px-3.5 text-[12.5px] font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 h-8.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white text-[12.5px] font-medium rounded-md shadow-2xs transition-all active:scale-98"
                >
                  <span>Submit for Review</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
