"use client";

import React, { useState } from "react";
import { X, ArrowUpRight, CheckCircle2, Sparkles } from "lucide-react";
import { CATEGORIES } from "@/data/tools";

interface SuggestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitNewTool?: (newTool: any) => void;
}

export const SuggestModal: React.FC<SuggestModalProps> = ({
  isOpen,
  onClose,
  onSubmitNewTool,
}) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("react");
  const [description, setDescription] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url) return;

    if (onSubmitNewTool) {
      onSubmitNewTool({
        name,
        url,
        category,
        description,
        githubUrl,
      });
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName("");
      setUrl("");
      setDescription("");
      setGithubUrl("");
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs animate-card">
      <div className="fixed inset-0" onClick={onClose}></div>

      <div
        className="relative w-full max-w-lg bg-white rounded-xl border border-zinc-200 shadow-2xl p-6 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
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
              Thank you for contributing to INDEX. Our curation team will review and verify your submission shortly.
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
            <p className="text-[13px] text-zinc-500 mb-5">
              Submit modern libraries, animation tools, or UI primitives for index inclusion.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                  className="w-full h-9 px-3 bg-zinc-50 border border-zinc-200 rounded-md text-[13px] text-zinc-900 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
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
                  className="w-full h-9 px-3 bg-zinc-50 border border-zinc-200 rounded-md text-[13px] text-zinc-900 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
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
                    className="w-full h-9 px-3 bg-zinc-50 border border-zinc-200 rounded-md text-[13px] text-zinc-900 focus:bg-white focus:outline-none focus:border-indigo-500"
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
                    className="w-full h-9 px-3 bg-zinc-50 border border-zinc-200 rounded-md text-[13px] text-zinc-900 focus:bg-white focus:outline-none focus:border-indigo-500"
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
                  className="w-full h-9 px-3 bg-zinc-50 border border-zinc-200 rounded-md text-[13px] text-zinc-900 focus:bg-white focus:outline-none focus:border-indigo-500"
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
