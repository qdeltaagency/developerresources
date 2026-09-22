import type { Metadata } from "next";
import { DirectoryView } from "@/components/DirectoryView";

export const metadata: Metadata = {
  title: "SaaS Starters & Full-Stack Boilerplates",
  description:
    "Discover production-ready Next.js 15 starter templates, AI SaaS wrapper boilerplates, and cross-platform mobile starters including Create T3 App and Wasp AI.",
  keywords: [
    "SaaS boilerplates",
    "Next.js starter templates",
    "AI SaaS starter",
    "Create T3 App",
    "Expo starter kit",
    "React production boilerplate",
  ],
  alternates: {
    canonical: "/boilerplates",
  },
  openGraph: {
    title: "SaaS Starters & Full-Stack Boilerplates | WTF — Web Tools Finder",
    description:
      "Handpicked production-ready Next.js starters and AI SaaS boilerplates.",
    type: "website",
    url: "/boilerplates",
  },
  twitter: {
    card: "summary_large_image",
    title: "SaaS Starters & Full-Stack Boilerplates | WTF — Web Tools Finder",
    description:
      "Handpicked production-ready Next.js starters and AI SaaS boilerplates.",
  },
};

export default function BoilerplatesPage() {
  return (
    <DirectoryView
      initialDomain="boilerplates"
      pageTitle="Boilerplates"
      pageSubtitle="Production-ready starter templates, AI SaaS foundations, and cross-platform mobile frameworks."
      badgeText="Boilerplates"
    />
  );
}
