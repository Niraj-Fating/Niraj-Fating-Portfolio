"use client";

import { create } from "zustand";
import { type ResumeProject } from "@/data/resume";

interface ProjectModalState {
  selectedProject: ResumeProject | null;
  isOpen: boolean;
  openProject: (project: ResumeProject) => void;
  closeModal: () => void;
}

export const useProjectModal = create<ProjectModalState>((set) => ({
  selectedProject: null,
  isOpen: false,
  openProject: (project) => set({ selectedProject: project, isOpen: true }),
  closeModal: () => set({ isOpen: false, selectedProject: null }),
}));
