import type { Metadata } from "next";
import { DirectoryView } from "@/components/DirectoryView";

export const metadata: Metadata = {
  title: "Complete Web Tools & Developer Directory (A–Z) | INDEX",
  description:
    "The complete A-Z directory of handpicked web tools, UI primitives, interaction engines, and developer resources.",
  keywords: [
    "web tools directory",
    "developer resources",
    "UI primitives",
    "React tools",
    "Tailwind libraries",
    "open source web tools",
  ],
  alternates: {
    canonical: "/directory",
  },
  openGraph: {
    title: "Complete Web Tools & Developer Directory (A–Z) | INDEX",
    description:
      "Explore all handpicked UI primitives, interaction engines, and developer tools organized alphabetically.",
    type: "website",
    url: "/directory",
  },
  twitter: {
    card: "summary_large_image",
    title: "Complete Web Tools & Developer Directory (A–Z) | INDEX",
    description:
      "Explore all handpicked UI primitives, interaction engines, and developer tools organized alphabetically.",
  },
};

export default function DirectoryPage() {
  return (
    <DirectoryView
      initialDomain="all"
      pageTitle="Complete Web Tools Directory"
      pageSubtitle="Browse the entire curated collection of web development and design resources organized alphabetically."
      badgeText="Full Directory (A–Z)"
    />
  );
}
