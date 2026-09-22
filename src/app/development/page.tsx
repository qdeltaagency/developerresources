import type { Metadata } from "next";
import { DirectoryView } from "@/components/DirectoryView";

export const metadata: Metadata = {
  title: "Top Web Development Tools & CSS Engines",
  description:
    "Explore high-performance developer utilities, state managers, WebGL pipelines, and modern CSS engines including Tailwind CSS v4, nuqs, and Three.js.",
  keywords: [
    "web development tools",
    "Tailwind CSS v4",
    "developer utilities",
    "Three.js",
    "WebGL engines",
    "state management",
    "Next.js tools",
  ],
  alternates: {
    canonical: "/development",
  },
  openGraph: {
    title: "Top Web Development Tools & CSS Engines | WTF — Web Tools Finder",
    description:
      "Curated engines, libraries, and utilities for high-performance web development.",
    type: "website",
    url: "/development",
  },
  twitter: {
    card: "summary_large_image",
    title: "Top Web Development Tools & CSS Engines | WTF — Web Tools Finder",
    description:
      "Curated engines, libraries, and utilities for high-performance web development.",
  },
};

export default function DevelopmentPage() {
  return (
    <DirectoryView
      initialDomain="development"
      pageTitle="Development"
      pageSubtitle="Essential developer primitives, CSS engines, state synchronizers, and WebGL rendering tools."
      badgeText="Development"
    />
  );
}
