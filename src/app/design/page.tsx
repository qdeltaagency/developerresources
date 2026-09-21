import type { Metadata } from "next";
import { DirectoryView } from "@/components/DirectoryView";

export const metadata: Metadata = {
  title: "Best Web Design & UI Tools (2026) | INDEX",
  description:
    "Curated collection of top UI component primitives, 3D canvas engines, and animation libraries including shadcn/ui, Magic UI, and Spline 3D.",
  keywords: [
    "web design tools",
    "UI components",
    "React UI libraries",
    "Tailwind components",
    "Framer Motion",
    "Spline 3D",
    "design systems",
  ],
  alternates: {
    canonical: "/design",
  },
  openGraph: {
    title: "Best Web Design & UI Tools (2026) | INDEX",
    description:
      "Curated UI primitives, animation libraries, and 3D design tools for modern web applications.",
    type: "website",
    url: "/design",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Web Design & UI Tools (2026) | INDEX",
    description:
      "Curated UI primitives, animation libraries, and 3D design tools for modern web applications.",
  },
};

export default function DesignPage() {
  return (
    <DirectoryView
      initialDomain="design"
      pageTitle="Design"
      pageSubtitle="Handpicked UI component primitives, motion engines, 3D canvases, and design systems."
      badgeText="Design"
    />
  );
}
