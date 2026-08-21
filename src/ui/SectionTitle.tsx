import React from "react";
import { clsx } from "clsx";

interface SectionTitleProps {
  index: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionTitle({ index, title, subtitle, className }: SectionTitleProps) {
  return (
    <div className={clsx("text-center mb-16", className)}>
      <p className="font-mono text-xs text-accent tracking-widest uppercase mb-3">
        {index}
      </p>
      <h2 className="text-4xl sm:text-5xl font-bold text-primary">{title}</h2>
      {subtitle && (
        <p className="mt-4 text-base text-muted max-w-lg mx-auto">{subtitle}</p>
      )}
    </div>
  );
}
