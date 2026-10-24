// Title, description and highlights live in translations.ts (projects.items, same order).
// A project with `video` plays it as the card preview and opens a full-screen modal on click.
export const projects = [
  {
    id: 1,
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Wompi", "GSAP"],
    github: "https://github.com/TreeG0ld/TreeGold-Landing-Clientes",
    demo: "https://treegold.shop",
    live: true,
    // Paths inside assets/; ratio is the video's width / height, reserved before it loads
    video: "projects/treegold.mp4",
    poster: "projects/treegold-poster.webp",
    ratio: "1600 / 776",
    from: "#333333",
    to: "#111111",
  },
  {
    id: 2,
    tags: ["JavaScript", "LLMs", "API"],
    github: "#",
    demo: "#",
    from: "#222222",
    to: "#0a0a0a",
  },
  {
    id: 3,
    tags: ["Python", "Fine-tuning", "LangFuse"],
    github: "#",
    demo: "#",
    from: "#2a2a2a",
    to: "#111111",
  },
]

export const experience = [
  {
    id: 1,
    company: "Isagen",
    period: "2026 — Present",
  },
  {
    id: 2,
    company: "Aeropay",
    period: "2025 — 2026",
  },
  {
    id: 3,
    company: "Miso Robotics",
    period: "2024 — 2025",
  },
  {
    id: 4,
    company: "Teleperformance",
    period: "2022 — 2024",
  },
]

export const contact = {
  email: "santigovanegas11@gmail.com",
  github: "https://github.com/c0dy8",
  linkedin: "https://www.linkedin.com/in/briam-vanegas/",
}
