import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  themeColor: "#09090b",
};

import { getSiteUrl } from "@/lib/site";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "WTF — Web Tools Finder | Curated Developer Tools & UI Libraries",
    template: "%s | WTF — Web Tools Finder",
  },
  description:
    "WTF (Web Tools Finder) is the curated directory of handpicked UI components, interaction engines, serverless databases, boilerplate starters, and AI tools for modern developers.",
  keywords: [
    "web tools finder",
    "web tool finder",
    "WTF developer tools",
    "web tools directory",
    "developer resources",
    "UI components",
    "UI primitives",
    "Tailwind CSS v4",
    "React libraries",
    "Framer Motion",
    "shadcn ui",
    "Supabase",
    "Next.js starter boilerplates",
    "AI coding tools",
    "frontend developer tools",
    "Three.js 3D web",
    "open source developer index",
    "best web dev tools 2026",
  ],
  authors: [{ name: "WTF Curation Team", url: siteUrl }],
  creator: "Web Tools Finder",
  publisher: "WTF — Web Tools Finder",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/wtf-logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "WTF — Web Tools Finder",
    title: "WTF — Web Tools Finder | Curated Developer Tools & UI Libraries",
    description:
      "Discover handpicked UI components, interaction engines, serverless databases, boilerplate starters, and AI tools for modern web developers on WTF (Web Tools Finder).",
    images: [
      {
        url: "/previews/shadcn-ui.png",
        width: 1200,
        height: 630,
        alt: "WTF — Web Tools Finder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WTF — Web Tools Finder",
    description:
      "The curated directory of handpicked UI components, interaction engines, serverless databases, and AI tooling.",
    images: ["/previews/shadcn-ui.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// JSON-LD Structured Data for Google Rich Search Results
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "WTF — Web Tools Finder",
      alternateName: ["Web Tools Finder", "Web Tool Finder", "WTF Directory", "WTF Tools"],
      description:
        "Curated collection of top UI primitives, developer utilities, serverless databases, and AI tooling for modern web creators.",
      publisher: {
        "@type": "Organization",
        name: "WTF — Web Tools Finder",
        url: siteUrl,
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/directory?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "CollectionPage",
      "@id": `${siteUrl}/#webpage`,
      url: siteUrl,
      name: "WTF — The Curated Web Tools Finder",
      about: {
        "@type": "Thing",
        name: "Web Development Tools, UI Primitives, and Developer Libraries",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#f4f5f7] font-sans text-[#09090b] antialiased selection:bg-zinc-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}
