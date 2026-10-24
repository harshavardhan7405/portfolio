// Central place to edit all portfolio content.
// Empty strings / empty arrays hide the related link, button or section.

export type SkillLevel = "Familiar" | "Currently Learning" | "Project Experience";

export const site = {
  name: "Harshavardhan",
  monogram: "HR",
  role: "Full Stack Developer",
  // Contact details
  email: "hvardhanracha@gmail.com",
  phone: "6301221877",
  linkedin: "https://linkedin.com/in/harshavardhan-racha-1b0a3732b/",
  github: "https://github.com/harshavardhan7405",
  instagram: "https://www.instagram.com/hxrsha__0704",
  resumeUrl: "/resume.pdf",
  // Optional external form endpoint (e.g. Formspree). Public URL only, never a secret key.
  formEndpoint: (import.meta.env["VITE_FORM_ENDPOINT"] as string | undefined) ?? "",
};

export const skills: { category: string; items: { name: string; level: SkillLevel }[] }[] = [
  {
    category: "Programming Languages",
    items: [
      { name: "Python", level: "Familiar" },
      { name: "Java", level: "Familiar" },
      { name: "JavaScript", level: "Familiar" },
      { name: "TypeScript", level: "Currently Learning" },
    ],
  },
  {
    category: "Frontend Development",
    items: [
      { name: "HTML5", level: "Familiar" },
      { name: "CSS3", level: "Familiar" },
      { name: "React", level: "Familiar" },
      { name: "Next.js", level: "Currently Learning" },
      { name: "Tailwind CSS", level: "Familiar" },
    ],
  },
  {
    category: "Backend Development",
    items: [
      { name: "Node.js", level: "Familiar" },
      { name: "Express.js", level: "Familiar" },
      { name: "REST APIs", level: "Familiar" },
    ],
  },
  {
    category: "Databases",
    items: [
      { name: "MongoDB", level: "Familiar" },
      { name: "PostgreSQL", level: "Familiar" },
      { name: "MySQL", level: "Familiar" },
      { name: "SQL fundamentals", level: "Familiar" },
    ],
  },
  {
    category: "Developer Tools",
    items: [
      { name: "Git", level: "Familiar" },
      { name: "GitHub", level: "Familiar" },
      { name: "Visual Studio Code", level: "Familiar" },
      { name: "Postman", level: "Familiar" },
      { name: "GitHub Copilot", level: "Familiar" },
    ],
  },
];

export type Project = {
  title: string;
  description: string;
  problem: string;
  solution: string;
  stack: string[];
  contribution: string;
  githubUrl: string;
  liveUrl?: string;
  placeholder?: boolean;
};

export const projects: Project[] = [
  {
    title: "AsurionCares AI Support Agent",
    description:
      "An AI support agent that reads customer messages, identifies the intent, and drafts a reply based on how similar issues were resolved before. It also decides whether to handle a case automatically or escalate it to a human, and gives a reason for that decision. Built as part of the Hiver SDE Intern assignment.",
    problem:
      "Customer support teams struggle to handle high inquiry volumes with consistent resolution speed and accuracy.",
    solution:
      "Engineered an automated agent combining intent detection, past resolution retrieval with TF-IDF, and automated response generation via Claude API.",
    stack: ["Python", "LLM (Claude API)", "TF-IDF Retrieval"],
    contribution:
      "Built intent classification, similarity-based reply drafting, and confidence-based human escalation logic with detailed reasoning.",
    githubUrl: "https://github.com/harshavardhan7405",
    placeholder: false,
  },
  {
    title: "Community Care",
    description:
      "A full-stack web app that helps people find nearby food banks, shelters, and healthcare centers. It uses real-time location search and navigation, backed by REST APIs and MongoDB.",
    problem:
      "Individuals in vulnerable situations often face delays locating verified nearby community services and essential aid facilities.",
    solution:
      "Developed a real-time web portal integrating Google Maps navigation, geolocation-based queries, and verified community aid directory.",
    stack: ["React.js", "Node.js", "Express.js", "MongoDB", "Google Maps API"],
    contribution:
      "Built responsive React frontend, integrated Google Maps API for navigation, and developed Express REST APIs with MongoDB geospatial storage.",
    githubUrl: "https://github.com/harshavardhan7405",
    placeholder: false,
  },
  {
    title: "Text-to-Image Generation",
    description:
      "A deep learning model that generates images from text descriptions. It combines LSTM text embeddings with CNN-based feature extraction and image preprocessing.",
    problem:
      "Synthesizing visually coherent and contextually faithful images from diverse natural language text prompts.",
    solution:
      "Designed a dual deep learning pipeline pairing LSTM recurrent text encoders with convolutional neural network (CNN) image synthesis layers.",
    stack: ["Python", "TensorFlow", "LSTM", "CNN"],
    contribution:
      "Implemented text tokenization and embedding workflows, trained the CNN generative pipeline, and tuned preprocessing architectures.",
    githubUrl: "https://github.com/harshavardhan7405",
    placeholder: false,
  },
];

export const experience: {
  role: string;
  organization: string;
  dates: string;
  points: string[];
}[] = [];

export const education = [
  {
    degree: "Bachelor of Technology in Computer Science and Engineering",
    institution: "Jawaharlal Nehru Technological University Hyderabad (JNTUH)",
    period: "2022–2026",
    score: "CGPA 7.5/10",
  },
];

export const achievements: { name: string; issuer: string; date: string; url?: string }[] = [];
