import type { Metadata } from "next";
import { DirectoryView } from "@/components/DirectoryView";

export const metadata: Metadata = {
  title: "Curated AI & Generative Tools for Web Developers | INDEX",
  description:
    "Discover top generative UI platforms, AI code engines, and in-browser AI tools including Cursor AI, v0.dev, and Bolt.new.",
  keywords: [
    "AI developer tools",
    "generative UI",
    "Cursor AI",
    "v0 dev",
    "Bolt new",
    "AI code generation",
    "web AI platforms",
  ],
  alternates: {
    canonical: "/ai",
  },
  openGraph: {
    title: "Curated AI & Generative Tools for Web Developers | INDEX",
    description:
      "Handpicked generative UI and AI developer platforms for rapid modern prototyping.",
    type: "website",
    url: "/ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "Curated AI & Generative Tools for Web Developers | INDEX",
    description:
      "Handpicked generative UI and AI developer platforms for rapid modern prototyping.",
  },
};

export default function AIPage() {
  return (
    <DirectoryView
      initialDomain="ai"
      pageTitle="AI Tools"
      pageSubtitle="Leading AI code editors, generative UI builders, and in-browser intelligent tools."
      badgeText="AI Tools"
    />
  );
}
