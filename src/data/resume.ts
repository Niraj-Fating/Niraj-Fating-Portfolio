export interface ResumeProject {
  id: string;
  title: string;
  tagline: string;
  skills: string[];
  xyzMetric: string;
  description: string;
  architectureDetails: string[];
  keyHighlights: string[];
  category: "ai" | "nlp" | "ml" | "automation";
  color: string;
  accentColor: string;
  github?: string;
  demo?: string;
  featured: boolean;
  futureScope?: string[];
}

export interface ResumeExperience {
  id: string;
  role: string;
  company: string;
  period: string;
  duration: string;
  location?: string;
  description: string;
  highlights: string[];
  skills: string[];
}

export interface ResumeEducation {
  degree: string;
  institution: string;
  cgpa: string;
  period: string;
  details?: string;
}

export interface ResumeData {
  projects: ResumeProject[];
  experience: ResumeExperience[];
  education: ResumeEducation;
}

export const resumeData: ResumeData = {
  projects: [
    {
      id: "spam-detection-system",
      title: "Spam Detection System",
      tagline: "NLP & ML Email Classification Engine",
      skills: ["NLP", "Scikit-learn", "Python"],
      xyzMetric:
        "Achieved 90%+ accuracy in email classification by developing an NLP-based spam detection system using tokenization and TF-IDF for feature extraction.",
      description:
        "High-performance machine learning classifier designed to analyze inbound text payloads, extract high-dimensional linguistic features, and accurately flag spam content with sub-millisecond inference.",
      architectureDetails: [
        "Text Preprocessing: Tokenization, stop-word removal, and lemmatization pipeline.",
        "Feature Representation: Vectorization using TF-IDF (Term Frequency - Inverse Document Frequency) across n-gram distributions.",
        "Model Training & Validation: Evaluated Multinomial Naive Bayes and Linear SVM with hyperparameter grid search.",
        "Performance Benchmarking: Surpassed 90% classification accuracy and 92% precision score."
      ],
      keyHighlights: [
        "90%+ Classification Accuracy on multi-corpus benchmark",
        "Sub-millisecond inference time per email payload",
        "Automated TF-IDF vocabulary extraction pipeline",
        "Zero false-positive critical email filtering threshold"
      ],
      category: "nlp",
      color: "#6366f1",
      accentColor: "#818cf8",
      github: "https://github.com/Niraj-Fating",
      featured: true,
    },
    {
      id: "ai-powered-e-newspaper",
      title: "AI-Powered E-Newspaper",
      tagline: "Automated Real-Time Audio News Generation",
      skills: ["NLP APIs", "Text-to-Speech", "Python"],
      xyzMetric:
        "Delivered personalized real-time audio news by developing an AI-based application integrating automated headline extraction and filtering.",
      description:
        "An intelligent content aggregation and audio synthesis platform that curates breaking news topics, filters relevant headlines using NLP APIs, and synthesizes natural-sounding speech for hands-free consumption.",
      architectureDetails: [
        "Headline Extraction: Automated aggregation from live news APIs with duplicate clustering.",
        "NLP Filtering & Ranking: Semantic relevance scoring and categorical sorting.",
        "Text-to-Speech Synthesis: Integrated neural TTS pipeline for streaming high-fidelity audio.",
        "User Personalization: Preference-based feed filtering and audio playlist creation."
      ],
      keyHighlights: [
        "Real-time automated headline ingestion and summarization",
        "Neural Text-to-Speech audio streaming with natural prosody",
        "Personalized category filtering across technology, science, and global news",
        "Hands-free voice-first daily briefing interface"
      ],
      category: "ai",
      color: "#a855f7",
      accentColor: "#c084fc",
      github: "https://github.com/Niraj-Fating",
      featured: true,
    },
    {
      id: "waste-classification-cnn",
      title: "Waste Classification Using Deep Learning",
      tagline: "Automated Waste Segregation via CNN",
      skills: ["Python", "TensorFlow", "Keras", "CNN", "Computer Vision", "NumPy"],
      xyzMetric:
        "Improved automated waste segregation by developing a Deep Learning CNN (TensorFlow/Keras) to classify waste images into Organic and Recyclable categories.",
      description:
        "An intelligent computer vision system aimed at addressing the global waste management crisis. By automating the classification of waste at the source, this deep learning model helps streamline recycling processes and reduce landfill contamination.",
      architectureDetails: [
        "Data Collection & Augmentation: Curated and preprocessed a balanced dataset of organic and recyclable waste images. Applied data augmentation (rotation, flipping, zooming) to improve model robustness.",
        "Model Architecture: Designed and trained a Convolutional Neural Network (CNN) using TensorFlow and Keras to extract hierarchical spatial features from waste images.",
        "Evaluation & Validation: Benchmarked model performance using categorical cross-entropy loss, achieving high validation accuracy on unseen test data."
      ],
      keyHighlights: [
        "Image-Based Classification: Accurately distinguishes between Organic and Recyclable waste.",
        "Fast Prediction Speed: Optimized CNN architecture for rapid inference suitable for edge deployment.",
        "Robust Feature Extraction: Effectively handles variations in lighting, background, and object orientation."
      ],
      futureScope: [
        "Mobile Application Integration: Deploying the model via a mobile app for user-facing, on-the-go waste classification.",
        "Real-Time Smart Bins: Integrating the model with IoT camera modules in physical waste bins for automated sorting.",
        "Cloud API Deployment: Serving the model via a scalable cloud backend for integration with municipal waste management systems."
      ],
      category: "ml",
      color: "#10b981",
      accentColor: "#34d399",
      github: "https://github.com/Niraj-Fating/Waste-Classification-Using-Deep-Learning",
      featured: true,
    },
  ],
  experience: [
    {
      id: "it-networkz",
      role: "Project Intern",
      company: "IT-NetworkZ Infosystems Pvt. Ltd. (via certwala.com), Nagpur",
      period: "Feb - Apr 2026",
      duration: "3 mos",
      description:
        "Focused on real-world software workflows, architectural planning, and end-to-end system design for modern scalable software systems.",
      highlights: [
        "Architected modular software components aligning with production engineering standards.",
        "Participated in Agile sprint cycles, code reviews, and system documentation.",
        "Engineered reliable workflow automation scripts reducing manual project setup overhead."
      ],
      skills: ["Software Workflows", "System Design", "Agile", "Python"],
    },
    {
      id: "istudio",
      role: "Software Testing Intern",
      company: "iStudio",
      period: "Jun - Dec 2025",
      duration: "7 mos",
      description:
        "Executed functional and regression tests, engineered Selenium-based automated testing workflows, and validated multi-platform software stability.",
      highlights: [
        "Built automated end-to-end regression suites using Selenium WebDriver with Python.",
        "Authored comprehensive test plans, test cases, and defect tracking reports.",
        "Improved test coverage by 40% through continuous integration automation."
      ],
      skills: ["Selenium", "Automation Testing", "Regression Testing", "Python", "QA"],
    },
  ],
  education: {
    degree: "B.Tech, Computer Science and Business Systems",
    institution: "St. Vincent Pallotti College of Engineering and Technology, Nagpur",
    cgpa: "8.81",
    period: "2023 - 2027",
    details: "Specialized in Artificial Intelligence, Machine Learning algorithms, Data Structures, and Software Engineering methodologies with a consistent 8.81 CGPA.",
  },
};
