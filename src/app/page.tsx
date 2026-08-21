import React from "react";
import { Navbar } from "@/components/dom/Navbar";
import { Hero } from "@/components/dom/Hero";
import { About } from "@/components/dom/About";
import { Projects } from "@/components/dom/Projects";
import { Contact } from "@/components/dom/Contact";
import { SceneWrapper } from "@/components/canvas/SceneWrapper";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* 3D WebGL Canvas - SSR-safe via client wrapper, absolutely positioned behind DOM */}
      <SceneWrapper />

      {/* DOM overlay */}
      <Navbar />

      <div className="relative z-10">
        <Hero />
        <About />
        <Projects />
        <Contact />
      </div>
    </main>
  );
}
