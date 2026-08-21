import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type BadgeVariant = "default" | "accent" | "muted";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  default: "bg-surface-1 border border-border text-muted",
  accent: "bg-accent/10 border border-accent/20 text-accent",
  muted: "bg-surface-0 border border-border text-muted/60",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono",
          variants[variant],
          className
        )
      )}
    >
      {children}
    </span>
  );
}
