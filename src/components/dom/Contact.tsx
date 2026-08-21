"use client";

import React from "react";
import { siteConfig } from "@/data/portfolio";

export function Contact() {
  return (
    <section id="contact" className="relative py-32 px-6">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="max-w-3xl mx-auto text-center relative">
        {/* Header */}
        <p className="font-mono text-xs text-accent tracking-widest uppercase mb-3">03 / Contact</p>
        <h2 className="text-4xl sm:text-5xl font-bold text-primary mb-6">
          Let&apos;s Build Something
        </h2>
        <p className="text-base text-muted leading-relaxed mb-12 max-w-xl mx-auto">
          Whether you have a project in mind, want to discuss AI opportunities, or just
          want to say hi - my inbox is always open.
        </p>

        {/* Primary CTA */}
        <a
          href={`mailto:${siteConfig.email}`}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-accent hover:bg-accent-hover text-white font-semibold text-base transition-all duration-200 shadow-glow hover:shadow-glow-lg hover:-translate-y-0.5 mb-12"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {siteConfig.email}
        </a>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs font-mono text-muted/40">or find me on</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Social links */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {Object.entries(siteConfig.socials).map(([platform, url]) => (
            <a
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl border border-border text-muted hover:text-primary hover:border-accent/60 hover:-translate-y-0.5 transition-all duration-200 font-medium text-sm capitalize"
            >
              {platform}
            </a>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-24 text-center">
        <p className="text-xs font-mono text-muted/30">
          &copy; {new Date().getFullYear()} {siteConfig.name} | Built with Next.js + Three.js
        </p>
      </div>
    </section>
  );
}
