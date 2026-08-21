"use client";

import React, { useState } from "react";
import { resumeData, type ResumeProject } from "@/data/resume";
import { ProjectModal } from "@/components/dom/ProjectModal";
import { ExternalLink, Zap, ChevronRight } from "lucide-react";
import { clsx } from "clsx";

// ─── Resume Project Card ──────────────────────────────────────────────────────

function ResumeProjectCard({
  project,
  onViewDetails,
}: {
  project: ResumeProject;
  onViewDetails: (p: ResumeProject) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={clsx(
        "group relative rounded-2xl border border-border bg-surface-1/50 p-6 transition-all duration-300 overflow-hidden",
        hovered && "border-accent/40 bg-surface-1 -translate-y-1 shadow-xl shadow-black/30"
      )}
    >
      {/* Glow backdrop */}
      <div
        className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(400px at 50% 0%, ${project.color}20, transparent 70%)`,
        }}
      />

      {/* Color accent line */}
      <div
        className="absolute top-0 inset-x-0 h-px rounded-t-2xl transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, ${project.color}, transparent)`,
          opacity: hovered ? 1 : 0.35,
        }}
      />

      {/* Category + Featured badge */}
      <div className="flex items-center gap-2 mb-4">
        {project.featured && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono bg-accent/10 text-accent border border-accent/20">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            Featured
          </span>
        )}
        <span
          className="px-2.5 py-0.5 rounded-full text-xs font-mono border capitalize"
          style={{
            backgroundColor: `${project.color}12`,
            color: project.accentColor,
            borderColor: `${project.color}30`,
          }}
        >
          {project.category}
        </span>
      </div>

      <h3 className="text-lg font-bold text-primary mb-1 group-hover:text-white transition-colors">
        {project.title}
      </h3>
      <p className="text-xs font-mono text-accent/70 mb-3">{project.tagline}</p>
      <p className="text-sm text-muted leading-relaxed mb-4">{project.description}</p>

      {/* XYZ Metric callout */}
      <div
        className="mb-5 p-3 rounded-xl border"
        style={{
          backgroundColor: `${project.color}0c`,
          borderColor: `${project.color}25`,
        }}
      >
        <div className="flex gap-2 items-start">
          <Zap className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: project.accentColor }} />
          <p className="text-xs leading-relaxed text-primary/80 font-medium">
            {project.xyzMetric}
          </p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-5">
        {project.skills.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 text-xs font-mono rounded-md bg-surface-0 border border-border text-muted/70"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          id={`view-case-study-${project.id}`}
          onClick={() => onViewDetails(project)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono rounded-lg bg-accent/20 text-accent hover:bg-accent/30 transition-all focus:ring-2 focus:ring-accent focus:outline-none"
          aria-label={`View case study for ${project.title}`}
        >
          View Case Study <ChevronRight className="w-3.5 h-3.5" />
        </button>
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono rounded-lg border border-border text-muted hover:text-primary hover:border-accent/50 transition-all focus:ring-2 focus:ring-accent focus:outline-none"
            aria-label={`View GitHub for ${project.title}`}
          >
            GitHub <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </article>
  );
}

// ─── Experience Card ──────────────────────────────────────────────────────────

function ExperienceCard({
  role,
  company,
  period,
  duration,
  highlights,
  skills,
  color = "#6366f1",
}: {
  role: string;
  company: string;
  period: string;
  duration: string;
  highlights: string[];
  skills: string[];
  color?: string;
}) {
  return (
    <div className="relative pl-6 border-l border-border/50 group">
      <div
        className="absolute -left-2 top-0 w-4 h-4 rounded-full border-2 border-surface-0 transition-transform group-hover:scale-110"
        style={{ backgroundColor: color }}
      />
      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 className="text-sm font-bold text-primary">{role}</h4>
          <p className="text-xs font-mono text-accent/80">{company}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-mono text-muted/70">{period}</p>
          <p className="text-xs text-muted/50">{duration}</p>
        </div>
      </div>
      <ul className="space-y-1.5 mt-3">
        {highlights.map((h, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-muted leading-relaxed">
            <ChevronRight className="w-3 h-3 mt-0.5 shrink-0" style={{ color }} />
            <span>{h}</span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {skills.map((s) => (
          <span
            key={s}
            className="px-2 py-0.5 text-[10px] font-mono rounded bg-surface-1 border border-border/70 text-muted/70"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Projects Section ─────────────────────────────────────────────────────────

export function Projects() {
  const [selectedProject, setSelectedProject] = useState<ResumeProject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (project: ResumeProject) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <section id="projects" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="font-mono text-xs text-accent tracking-widest uppercase mb-3">
            02 / Work
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-primary">
            Projects &amp; Experience
          </h2>
          <p className="mt-4 text-muted max-w-lg mx-auto text-base">
            AI/ML systems built from the ground up, with real-world deployment impact.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {resumeData.projects.map((p) => (
            <ResumeProjectCard
              key={p.id}
              project={p}
              onViewDetails={openModal}
            />
          ))}
        </div>

        {/* Experience & Education */}
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Experience Timeline */}
          <div>
            <p className="font-mono text-xs text-accent tracking-widest uppercase mb-8">
              Professional Experience
            </p>
            <div className="space-y-10">
              {resumeData.experience.map((exp, idx) => (
                <ExperienceCard
                  key={exp.id}
                  role={exp.role}
                  company={exp.company}
                  period={exp.period}
                  duration={exp.duration}
                  highlights={exp.highlights}
                  skills={exp.skills}
                  color={idx === 0 ? "#6366f1" : "#a855f7"}
                />
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <p className="font-mono text-xs text-accent tracking-widest uppercase mb-8">
              Education
            </p>
            <div className="relative p-6 rounded-2xl border border-border bg-surface-1/40 overflow-hidden">
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  background: "radial-gradient(600px at 30% 50%, #6366f130, transparent 70%)",
                }}
              />
              <p className="text-xs font-mono text-accent/80 mb-1">{resumeData.education.period}</p>
              <h4 className="text-base font-bold text-primary mb-0.5">
                {resumeData.education.degree}
              </h4>
              <p className="text-sm text-muted/90 mb-4">{resumeData.education.institution}</p>

              <div className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-xl bg-accent/15 border border-accent/25 text-center">
                  <p className="text-2xl font-bold text-accent">{resumeData.education.cgpa}</p>
                  <p className="text-[10px] font-mono text-muted/70">CGPA</p>
                </div>
                <p className="text-xs text-muted leading-relaxed flex-1">
                  {resumeData.education.details}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accessible Case Study Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </section>
  );
}
