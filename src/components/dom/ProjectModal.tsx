"use client";

import React, { useEffect, useRef } from "react";
import { type ResumeProject } from "@/data/resume";
import { X, ExternalLink, CheckCircle2, Cpu, Zap, Layers } from "lucide-react";

interface ProjectModalProps {
  project: ResumeProject | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Save previous active element & handle focus trapping
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;

      // Focus first interactive element or modal itself
      const timer = setTimeout(() => {
        const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements && focusableElements.length > 0) {
          focusableElements[0].focus();
        } else {
          modalRef.current?.focus();
        }
      }, 50);

      // Prevent background scrolling
      document.body.style.overflow = "hidden";

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "unset";
        previousFocusRef.current?.focus();
      };
    }
  }, [isOpen]);

  // Handle keyboard events: Escape to close, Tab focus wrap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab") {
        if (!modalRef.current) return;
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      aria-describedby="project-modal-desc"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-surface-0/95 border border-border/80 p-6 sm:p-8 shadow-2xl shadow-black/80 outline-none animate-in zoom-in-95 duration-200"
        style={{
          boxShadow: `0 0 50px -10px ${project.color}30, 0 25px 50px -12px rgba(0, 0, 0, 0.85)`,
        }}
      >
        {/* Top Accent Line */}
        <div
          className="absolute top-0 inset-x-0 h-1 rounded-t-2xl"
          style={{
            background: `linear-gradient(90deg, transparent, ${project.color}, transparent)`,
          }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close project details"
          className="absolute top-5 right-5 p-2 rounded-xl text-muted hover:text-primary bg-surface-1/60 hover:bg-surface-2 border border-border/50 transition-all focus:ring-2 focus:ring-accent focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6 pr-10">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border"
              style={{
                backgroundColor: `${project.color}15`,
                color: project.accentColor,
                borderColor: `${project.color}35`,
              }}
            >
              Case Study
            </span>
            <span className="text-xs font-mono text-muted/60 uppercase">
              {project.category}
            </span>
          </div>

          <h2
            id="project-modal-title"
            className="text-2xl sm:text-3xl font-bold text-primary tracking-tight mb-1"
          >
            {project.title}
          </h2>
          <p className="text-sm font-mono text-accent/80">{project.tagline}</p>
        </div>

        {/* XYZ Metric Highlight Callout */}
        <div
          className="mb-6 p-4 sm:p-5 rounded-xl border relative overflow-hidden"
          style={{
            backgroundColor: `${project.color}0c`,
            borderColor: `${project.color}30`,
          }}
        >
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 shrink-0 mt-0.5" style={{ color: project.accentColor }} />
            <div>
              <p className="text-xs font-mono uppercase tracking-wider mb-1 font-semibold" style={{ color: project.accentColor }}>
                Key Impact & Metric
              </p>
              <p
                id="project-modal-desc"
                className="text-sm sm:text-base text-primary/90 font-medium leading-relaxed"
              >
                &ldquo;{project.xyzMetric}&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Skills & Tech Stack */}
        <div className="mb-6">
          <p className="text-xs font-mono text-muted/70 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-accent" /> Tech Stack & Core Competencies
          </p>
          <div className="flex flex-wrap gap-2">
            {project.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 text-xs font-mono rounded-lg bg-surface-1 border border-border text-primary/90 font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Overview & Architecture Details */}
        <div className="space-y-6 mb-8 text-sm sm:text-base">
          <div>
            <p className="text-xs font-mono text-muted/70 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-accent" /> System Architecture & Execution
            </p>
            <ul className="space-y-2.5 mt-3">
              {project.architectureDetails.map((detail, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-muted leading-relaxed">
                  <CheckCircle2
                    className="w-4 h-4 shrink-0 mt-0.5"
                    style={{ color: project.accentColor }}
                  />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-mono text-muted/70 uppercase tracking-widest mb-2">
              Performance Benchmarks
            </p>
            <div className="grid sm:grid-cols-2 gap-3 mt-3">
              {project.keyHighlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-surface-1/50 border border-border/60 text-xs text-muted leading-relaxed"
                >
                  <span className="font-mono text-accent mr-1.5">[{idx + 1}]</span>
                  {highlight}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/80">
          <div className="flex gap-3">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono rounded-lg bg-surface-1 hover:bg-surface-2 border border-border text-primary transition-all focus:ring-2 focus:ring-accent"
              >
                View Repository <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono rounded-lg bg-accent/20 hover:bg-accent/30 text-accent font-medium transition-all focus:ring-2 focus:ring-accent"
          >
            Close Window [ESC]
          </button>
        </div>
      </div>
    </div>
  );
}
