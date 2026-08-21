import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React, { Suspense } from "react";
import { Loader } from "@/components/dom/Loader";
import { SmoothScrollProvider } from "@/components/dom/SmoothScrollProvider";

// ─── Font loading via next/font ────────────────────────────────────────────────
// Using next/font instead of a raw @import in CSS:
//   - Font CSS + files are fetched at BUILD time, not at runtime
//   - Eliminates the render-blocking network request to fonts.googleapis.com
//   - Improves Lighthouse Performance: no FCP penalty from cross-origin font fetch
//   - font-display: swap is applied automatically
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  // Preload only the weights we actually use
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    default: "Niraj Fating - AI/ML & Software Engineer",
    template: "%s | Niraj Fating",
  },
  description:
    "Portfolio of Niraj Fating - AI/ML and Automation Engineer. NLP, Spam Detection, TF-IDF, Python, Scikit-learn. B.Tech CSBS, St. Vincent Pallotti College (CGPA 8.81).",
  keywords: [
    "AI Engineer",
    "ML Engineer",
    "Machine Learning",
    "NLP",
    "Natural Language Processing",
    "TF-IDF",
    "Spam Detection",
    "Automation",
    "Python",
    "Scikit-learn",
    "Niraj Fating",
    "CSBS",
  ],
  authors: [{ name: "Niraj Fating", url: "https://github.com/Niraj-Fating" }],
  creator: "Niraj Fating",
  // Canonical URL for SEO
  alternates: {
    canonical: "https://nirajfating.dev",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nirajfating.dev",
    title: "Niraj Fating - AI/ML & Software Engineer",
    description:
      "Building intelligent NLP systems, ML pipelines, and automation platforms. Spam Detection, TF-IDF, Scikit-learn, Python.",
    siteName: "Niraj Fating Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Niraj Fating - AI/ML & Software Engineer",
    description: "AI/ML & NLP Engineer | Spam Detection | Automation | Python | Scikit-learn",
    creator: "@nirajfating",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1 },
  },
};

export const viewport: Viewport = {
  themeColor: "#020408",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable}`} suppressHydrationWarning>
      <head>
        {/*
          dns-prefetch for GitHub so the external links resolve faster.
          preconnect is already handled by next/font for Google Fonts.
        */}
        <link rel="dns-prefetch" href="//github.com" />
        <link rel="dns-prefetch" href="//linkedin.com" />
      </head>
      <body className="bg-surface-0 text-primary font-sans antialiased">
        {/*
          SmoothScrollProvider wraps everything so both DOM and WebGL canvas
          share the same Lenis instance and scroll progress via context.
        */}
        <SmoothScrollProvider>
          <Suspense fallback={<Loader />}>{children}</Suspense>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
