"use client";

import React from "react";
import { skills, siteConfig } from "@/data/portfolio";
import { clsx } from "clsx";

const CATEGORY_LABELS = {
  ai: "AI / Machine Learning",
  dev: "Web & Backend",
  infra: "Infrastructure & MLOps",
  lang: "Languages",
};

const CATEGORY_COLORS: Record<string, string> = {
  ai: "from-indigo-500 to-violet-500",
  dev: "from-violet-500 to-purple-500",
  infra: "from-purple-500 to-fuchsia-500",
  lang: "from-fuchsia-500 to-pink-500",
};

export function About() {
  const categories = ["ai", "lang", "dev", "infra"] as const;

  return (
    <section id="about" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="mb-16 text-center">
          <p className="font-mono text-xs text-accent tracking-widest uppercase mb-3">01 / About</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-primary">
            Who I Am
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Bio */}
          <div className="space-y-6">
            <p className="text-base text-muted leading-relaxed">
              I'm <strong className="text-primary">{siteConfig.name}</strong>, an AI/ML and
              Automation Engineer based in India. I design and ship intelligent systems
              - from LLM-powered agents and computer vision pipelines to enterprise automation
              platforms that eliminate repetitive work at scale.
            </p>
            <p className="text-base text-muted leading-relaxed">
              My stack spans the full spectrum: training PyTorch models, productionizing them
              with FastAPI and Docker, orchestrating with Airflow, and integrating at the UI
              layer with Next.js. I care deeply about making AI practical, observable, and fast.
            </p>
            <p className="text-base text-muted leading-relaxed">
              When I'm not building, I'm reading research papers, contributing to open-source,
              or experimenting with the next generation of foundation models.
            </p>

            {/* Social links */}
            <div className="flex flex-wrap gap-3 pt-2">
              {Object.entries(siteConfig.socials).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-xs font-mono rounded-lg border border-border text-muted hover:text-primary hover:border-accent/60 transition-all capitalize"
                >
                  {platform} -&gt;
                </a>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-8">
            {categories.map((cat) => (
              <div key={cat}>
                <p className="text-xs font-mono text-muted/60 uppercase tracking-widest mb-3">
                  {CATEGORY_LABELS[cat]}
                </p>
                <div className="space-y-2.5">
                  {skills.filter((s) => s.category === cat).map((skill) => (
                    <div key={skill.name} className="group">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-primary font-medium">{skill.name}</span>
                        <span className="text-muted/50 font-mono">{skill.level}%</span>
                      </div>
                      <div className="h-1 rounded-full bg-surface-1 overflow-hidden">
                        <div
                          className={clsx(
                            "h-full rounded-full bg-gradient-to-r transition-all duration-1000",
                            CATEGORY_COLORS[cat]
                          )}
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
