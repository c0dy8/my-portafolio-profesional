# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Developer portfolio for **Briam Vanegas** (Full Stack Developer + AI Engineer, Medellín 🇨🇴) — single-page React app with animated components.

## Commands

```bash
pnpm dev          # start dev server
pnpm build        # production build
pnpm preview      # preview production build
pnpm lint         # run ESLint
```

> Always use **pnpm**. Never use npm or npx directly — if a command requires a package runner, use `pnpm dlx` instead.
> pnpm binary path: `$env:LOCALAPPDATA\pnpm\bin\pnpm.CMD`

## Stack

- **Vite 8 + React 19 + TypeScript 6**
- **Tailwind CSS v4** — configured via `@tailwindcss/vite` plugin (no `tailwind.config.js` needed). Import is `@import "tailwindcss"` at the top of `src/index.css`. Custom tokens go in `@theme {}`, custom animations in `@keyframes` + `@utility`.
- **Motion 12** (`motion/react`) — animations. Import: `import { motion } from "motion/react"`
- **React Bits / 21st.dev** — copy-paste UI components, land in `src/components/ui/`

## Architecture

Single-page, scroll-based layout (no router). Entry: `src/main.tsx` → `src/App.tsx`.

```
App (wrapped in LanguageProvider)
├── Navbar
├── Hero          ← DotGrid background (gsap + InertiaPlugin canvas)
├── About
├── Skills
├── Projects
├── Experience
├── Contact
├── ChatBot       ← fixed bottom-right
└── LanguageSwitcher ← fixed bottom-left
```

### Key files

| File | Purpose |
|---|---|
| `src/data/portfolio.ts` | All real data: personal info, skills, projects, experience, contact links |
| `src/data/translations.ts` | Full ES/EN translation strings |
| `src/context/LanguageContext.tsx` | Global lang state — `useLanguage()` returns `{ lang, setLang, t }` |
| `src/components/ui/Magnet.tsx` | Magnetic pull effect. Has hardcoded `position: relative` inline — always wrap with an outer `div.fixed` for positioning |
| `src/components/ui/DotGrid.tsx` | Canvas-based dot grid with gsap InertiaPlugin physics |
| `src/components/ChatBot.tsx` | AI chatbot, OpenAI streaming via native fetch |

### Assets

All static assets live in `assets/` (root). Vite is configured with `publicDir: 'assets'` so files are served at `/filename` (e.g. `/avatar.avif`, `/favicon.svg`).

### Language system

Every section reads translations via `useLanguage()`. When adding new text, add keys to both `es` and `en` objects in `src/data/translations.ts` first, then use `t.section.key` in components.

### Fixed floating elements

Both `ChatBot` and `LanguageSwitcher` use the Magnet component. Since Magnet hardcodes `position: relative`, fixed positioning must go on a **parent div**:

```tsx
<div className="fixed bottom-6 right-6 z-50">
  <Magnet padding={80} magnetStrength={3}>
    {/* content */}
  </Magnet>
</div>
```

### ChatBot

- Uses native `fetch` with SSE streaming (no OpenAI/Anthropic SDK — they break Vite's browser bundler)
- API key via `VITE_OPENAI_API_KEY` in `.env`
- System prompt is `SYSTEM_PROMPT` constant at top of `ChatBot.tsx` — expand it with real project/experience details as they become available
- Animated border: `@property --gradient-angle` + `conic-gradient` as background of the outer `motion.div` (class `chat-gradient-border` in `index.css`). Do NOT use the old spinning-div-with-inset approach — it breaks with Framer Motion transforms.
- Message animations: each message is a `motion.div` with stable `id` (crypto.randomUUID). `isTyping` state controls the bouncing dots indicator (separate from `isLoading`). Scroll during streaming uses `scrollTop = scrollHeight` directly, not `scrollIntoView`.

### Favicon

`assets/favicon.svg` — custom terminal prompt icon (`>_`) on dark `#09090b` background. Matches the dark minimal design.
