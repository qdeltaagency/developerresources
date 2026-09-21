import type { Metadata } from "next";
import { DirectoryView } from "@/components/DirectoryView";

export const metadata: Metadata = {
  title: "Cloud, Database & DevOps Engines | INDEX",
  description:
    "Explore serverless databases, authentication systems, type-safe ORMs, and edge runtimes including Supabase, Clerk, Drizzle, and Cloudflare Workers.",
  keywords: [
    "serverless database",
    "Supabase",
    "Clerk auth",
    "Drizzle ORM",
    "Prisma",
    "Cloudflare Workers",
    "backend tools",
    "DevOps",
  ],
  alternates: {
    canonical: "/backend",
  },
  openGraph: {
    title: "Cloud, Database & DevOps Engines | INDEX",
    description:
      "Curated serverless databases, authentication engines, and edge hosting runtimes.",
    type: "website",
    url: "/backend",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cloud, Database & DevOps Engines | INDEX",
    description:
      "Curated serverless databases, authentication engines, and edge hosting runtimes.",
  },
};

export default function BackendPage() {
  return (
    <DirectoryView
      initialDomain="backend"
      pageTitle="Cloud & DB"
      pageSubtitle="Essential serverless databases, authentication systems, type-safe ORMs, and global edge runtimes."
      badgeText="Cloud & DB"
    />
  );
}
