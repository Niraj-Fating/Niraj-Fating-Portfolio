export const siteConfig = {
  name: "Niraj Fating",
  title: "AI/ML & Automation Engineer",
  description:
    "Building intelligent systems at the intersection of AI, Machine Learning, and software engineering.",
  email: "nirajfating.dev@gmail.com",
  phone: "+91 8554063747",
  location: "India",
  socials: {
    github: "https://github.com/Niraj-Fating",
    linkedin: "https://www.linkedin.com/in/niraj-fating-37abb12a8/",
    twitter: "https://twitter.com/nirajfating",
  },
};

export type Skill = {
  name: string;
  category: "ai" | "dev" | "infra" | "lang";
  level: number; // 0-100
};

export const skills: Skill[] = [
  // AI / ML
  { name: "PyTorch", category: "ai", level: 90 },
  { name: "TensorFlow", category: "ai", level: 85 },
  { name: "Scikit-Learn", category: "ai", level: 92 },
  { name: "LangChain", category: "ai", level: 88 },
  { name: "Hugging Face", category: "ai", level: 85 },
  { name: "OpenCV", category: "ai", level: 80 },
  // Dev
  { name: "Python", category: "lang", level: 95 },
  { name: "TypeScript", category: "lang", level: 82 },
  { name: "Next.js", category: "dev", level: 80 },
  { name: "FastAPI", category: "dev", level: 88 },
  { name: "React", category: "dev", level: 78 },
  // Infra
  { name: "Docker", category: "infra", level: 85 },
  { name: "AWS", category: "infra", level: 78 },
  { name: "MLflow", category: "infra", level: 80 },
  { name: "Apache Airflow", category: "infra", level: 75 },
  { name: "Kubernetes", category: "infra", level: 70 },
];

export type Project = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  github?: string;
  demo?: string;
  featured: boolean;
  color: string;
};

export const projects: Project[] = [
  {
    id: "llm-agent",
    title: "Autonomous LLM Agent Framework",
    tagline: "Multi-agent orchestration at scale",
    description:
      "Built a production-grade multi-agent system using LangChain and GPT-4 with tool-use, memory, and self-reflection capabilities. Handles complex reasoning chains across 50+ integrated APIs.",
    tags: ["LangChain", "GPT-4", "FastAPI", "Redis", "Docker"],
    github: "https://github.com/Niraj-Fating",
    featured: true,
    color: "#6366f1",
  },
  {
    id: "ml-pipeline",
    title: "AutoML Pipeline Engine",
    tagline: "End-to-end model lifecycle automation",
    description:
      "Designed and shipped an automated ML pipeline that handles feature engineering, hyperparameter optimization, and model selection with MLflow experiment tracking.",
    tags: ["PyTorch", "MLflow", "Airflow", "AWS S3", "Optuna"],
    github: "https://github.com/Niraj-Fating",
    featured: true,
    color: "#8b5cf6",
  },
  {
    id: "cv-system",
    title: "Real-time Vision Analytics",
    tagline: "Edge AI for computer vision",
    description:
      "Built a real-time object detection and tracking system using YOLOv8 and DeepSort, deployed on edge hardware with ONNX optimization achieving 60fps inference.",
    tags: ["YOLOv8", "OpenCV", "ONNX", "Python", "FastAPI"],
    github: "https://github.com/Niraj-Fating",
    featured: true,
    color: "#a855f7",
  },
  {
    id: "rpa-automation",
    title: "Intelligent RPA Platform",
    tagline: "AI-driven process automation",
    description:
      "Developed an RPA platform integrating NLP for document understanding, reducing manual data entry by 85% across enterprise workflows.",
    tags: ["Python", "NLP", "Selenium", "OCR", "FastAPI"],
    featured: false,
    color: "#7c3aed",
  },
  {
    id: "rag-engine",
    title: "Enterprise RAG Engine",
    tagline: "Knowledge retrieval at enterprise scale",
    description:
      "Architected a Retrieval-Augmented Generation system with hybrid search (BM25 + dense embeddings) over 10M+ documents with sub-second latency.",
    tags: ["RAG", "Pinecone", "OpenAI", "LangChain", "FastAPI"],
    featured: false,
    color: "#4f46e5",
  },
];

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];
