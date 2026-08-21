"use client";

import React, { useEffect, useRef } from "react";
import { siteConfig } from "@/data/portfolio";
import gsap from "gsap";
import { Download } from "lucide-react";

const ROLES = ["AI/ML Engineer", "Automation Architect", "Systems Builder", "NLP Specialist"];

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLSpanElement>(null);
  const roleIndex = useRef(0);

  // Entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(headingRef.current, { y: 60, opacity: 0, duration: 1, delay: 0.3 })
        .from(subRef.current, { y: 40, opacity: 0, duration: 0.8 }, "-=0.5")
        .from(ctaRef.current, { y: 30, opacity: 0, duration: 0.7 }, "-=0.4");
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Role cycling
  useEffect(() => {
    const el = roleRef.current;
    if (!el) return;
    const cycle = () => {
      roleIndex.current = (roleIndex.current + 1) % ROLES.length;
      gsap.to(el, {
        opacity: 0, y: -12, duration: 0.3,
        onComplete: () => {
          el.textContent = ROLES[roleIndex.current];
          gsap.to(el, { opacity: 1, y: 0, duration: 0.4 });
        },
      });
    };
    const id = setInterval(cycle, 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20"
    >
      {/* Badge */}
      <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent text-xs font-mono tracking-wider">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        Open to opportunities
      </div>

      {/* Heading */}
      <h1
        ref={headingRef}
        className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-none mb-4"
      >
        <span className="block text-primary">{siteConfig.name}</span>
        <span className="block mt-2 bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
          <span ref={roleRef}>{ROLES[0]}</span>
        </span>
      </h1>

      {/* Sub */}
      <p
        ref={subRef}
        className="max-w-xl mt-6 text-base sm:text-lg text-muted leading-relaxed"
      >
        {siteConfig.description}
      </p>

      {/* CTA row */}
      <div ref={ctaRef} className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <a
          href="#projects"
          className="px-7 py-3 rounded-xl bg-accent hover:bg-accent-hover text-white font-medium text-sm transition-all duration-200 shadow-glow hover:shadow-glow-lg hover:-translate-y-0.5"
        >
          View Projects
        </a>

        {/* Resume Download — primary CTA */}
        <a
          href="/NirajFating_Resume.pdf"
          download="NirajFating_Resume.pdf"
          aria-label="Download Niraj Fating Resume PDF"
          className="inline-flex items-center gap-2 px-7 py-3 rounded-xl border-2 border-accent/70 bg-accent/10 hover:bg-accent/20 text-accent hover:text-white font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-glow focus:ring-2 focus:ring-accent focus:outline-none"
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          Download Resume
        </a>

        <a
          href={siteConfig.socials.github}
          target="_blank"
          rel="noopener noreferrer"
          className="px-7 py-3 rounded-xl border border-border text-muted hover:text-primary hover:border-accent/50 font-medium text-sm transition-all duration-200 hover:-translate-y-0.5"
        >
          GitHub -&gt;
        </a>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted/40">
        <span className="text-xs font-mono tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-muted/40 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
