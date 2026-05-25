# Briam Vanegas — Professional Portfolio

Personal portfolio website for **Briam Vanegas**, Full Stack Developer and AI Enthusiast based in Medellín, Colombia. Built to showcase my experience, projects, and technical skills in a clean, animated single-page experience.

## About Me

I'm a Full Stack Developer with 1 year of experience and a strong passion for AI. I specialize in building applications that integrate LLMs, RAG pipelines, and intelligent systems using LangChain, LangFuse, and fine-tuning techniques. I've worked in fintech (Aeropay), robotics (Miso Robotics), and platform success (Uber Eats via Teleperformance).

## Features

- Bilingual (English / Spanish) with instant language switching
- Animated hero with interactive particle text and canvas dot grid
- Tilt-effect profile card with real-time pointer tracking
- Scrollable experience timeline with spotlight cards
- Skill carousel with devicon logos
- AI-powered chatbot (OpenAI streaming) with session rate limiting and CV download
- Animated gradient chatbot border using CSS `@property`
- Fully responsive — mobile menu included
- Dark minimal design with smooth Motion animations throughout

## Tech Stack

- **React 19** + **TypeScript** + **Vite 8**
- **Tailwind CSS v4** — utility-first, configured via `@tailwindcss/vite`
- **Motion 12** (`motion/react`) — animations and transitions
- **OpenAI API** — streaming chat completions via native `fetch`
- **Lucide React** — icons

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Production build
pnpm build

# Preview production build
pnpm preview
```

> Requires **pnpm**. Do not use npm or yarn.

## Environment Variables

Create a `.env` file at the root with:

```env
VITE_OPENAI_API_KEY=your_openai_api_key
```

## Project Structure

```
src/
├── components/         # Page sections and UI components
│   └── ui/             # Reusable UI primitives (ProfileCard, DotGrid, etc.)
├── context/            # Language context (ES/EN)
├── data/
│   ├── portfolio.ts    # Projects, experience, contact links
│   └── translations.ts # All UI strings in ES and EN
└── index.css           # Global styles and custom animations
assets/                 # Static files served at root (CV, avatar, favicon)
```

## Contact

- Email: santigovanegas11@gmail.com
- GitHub: [github.com/c0dy8](https://github.com/c0dy8)
- LinkedIn: [linkedin.com/in/briam-santiago-vanegas-morales-260652405](https://www.linkedin.com/in/briam-santiago-vanegas-morales-260652405)
