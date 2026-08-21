"use client";

import React, { useEffect, useState } from "react";
import { siteConfig, navLinks } from "@/data/portfolio";
import { clsx } from "clsx";
import { Download } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={clsx(
        "fixed top-0 inset-x-0 z-40 transition-all duration-500",
        scrolled
          ? "bg-surface-0/80 backdrop-blur-xl border-b border-border shadow-lg shadow-black/20"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <span className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white text-sm font-bold font-mono group-hover:scale-110 transition-transform">
            NF
          </span>
          <span className="font-semibold text-sm text-primary hidden sm:block">
            {siteConfig.name}
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="px-4 py-2 text-sm text-muted hover:text-primary rounded-lg hover:bg-surface-1 transition-all duration-200"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA buttons */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={siteConfig.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm font-medium rounded-lg border border-border text-muted hover:text-primary hover:border-accent/60 transition-all duration-200"
          >
            GitHub
          </a>

          {/* Resume Download CTA — prominent accent button */}
          <a
            href="/NirajFating_Resume.pdf"
            download="NirajFating_Resume.pdf"
            aria-label="Download Niraj Fating Resume PDF"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-accent hover:bg-accent-hover text-white transition-all duration-200 shadow-glow hover:shadow-glow-lg focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface-0 focus:outline-none"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            Resume
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-surface-1 transition"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <div className="flex flex-col gap-1.5 w-5">
            <span className={clsx("h-px bg-primary transition-all duration-300", mobileOpen && "rotate-45 translate-y-2")} />
            <span className={clsx("h-px bg-primary transition-all duration-300", mobileOpen && "opacity-0")} />
            <span className={clsx("h-px bg-primary transition-all duration-300", mobileOpen && "-rotate-45 -translate-y-2")} />
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      <div className={clsx(
        "md:hidden border-t border-border bg-surface-0/95 backdrop-blur-xl transition-all duration-300 overflow-hidden",
        mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
      )}>
        <ul className="px-6 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm text-muted hover:text-primary hover:bg-surface-1 rounded-lg transition"
              >
                {link.label}
              </a>
            </li>
          ))}
          {/* Resume download in mobile menu */}
          <li className="mt-2 pt-2 border-t border-border">
            <a
              href="/NirajFating_Resume.pdf"
              download="NirajFating_Resume.pdf"
              aria-label="Download Resume PDF"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-accent hover:bg-accent/10 rounded-lg transition"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              Download Resume
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
