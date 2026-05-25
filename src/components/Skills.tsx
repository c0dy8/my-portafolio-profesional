import { motion } from "motion/react"
import { Layers } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"

type Skill = {
  name: string
  src?: string
  abbr?: string
  invert?: boolean
}

const ROW1: Skill[] = [
  { name: "Python",     src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
  { name: "JavaScript", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" },
  { name: "HTML5",      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" },
  { name: "CSS3",       src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" },
  { name: "Docker",     src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" },
  { name: "PostgreSQL", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" },
  { name: "MySQL",      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg" },
  { name: "GitHub",     src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg", invert: true },
]

const ROW2: Skill[] = [
  { name: "MongoDB",    src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg" },
  { name: "LangChain",  src: "https://github.com/langchain-ai.png" },
  { name: "LangFuse",   src: "https://github.com/langfuse.png" },
  { name: "RAG",        abbr: "RAG" },
  { name: "LLMs",       abbr: "LLM" },
  { name: "IA / ML",    abbr: "AI" },
  { name: "n8n",        src: "https://github.com/n8n-io.png" },
  { name: "Git",        src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" },
]

function repeat<T>(arr: T[], times = 4): T[] {
  return Array.from({ length: times }).flatMap(() => arr)
}

function SkillBadge({ skill }: { skill: Skill }) {
  return (
    <div className="flex-shrink-0 flex flex-col items-center gap-2 group">
      <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center transition-all duration-300 group-hover:border-zinc-600 group-hover:bg-zinc-800/60 group-hover:scale-110">
        {skill.src ? (
          <img
            src={skill.src}
            alt={skill.name}
            className={`w-8 h-8 object-contain${skill.invert ? " invert" : ""}`}
            loading="lazy"
          />
        ) : (
          <span className="text-xs font-bold font-mono text-zinc-300 tracking-wide">
            {skill.abbr}
          </span>
        )}
      </div>
      <span className="text-[11px] text-zinc-600 font-mono group-hover:text-zinc-400 transition-colors duration-200 whitespace-nowrap">
        {skill.name}
      </span>
    </div>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
}

export function Skills() {
  const { t } = useLanguage()
  const row1 = repeat(ROW1, 4)
  const row2 = repeat(ROW2, 4)

  return (
    <section id="skills" className="py-28 border-t border-zinc-800/50">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          className="mb-6"
          variants={fadeUp}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-700/80 bg-zinc-900/70 text-zinc-400 font-mono text-xs tracking-widest backdrop-blur-sm">
            <Layers size={12} />
            {t.skills.label}
          </span>
        </motion.div>
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight font-display"
          variants={fadeUp}
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {t.skills.heading}
        </motion.h2>
        <motion.p
          className="text-zinc-500 text-sm mb-16 max-w-md"
          variants={fadeUp}
          custom={2}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {t.skills.subheading}
        </motion.p>
      </div>

      <motion.div
        className="relative mx-6 md:mx-32 lg:mx-52 overflow-hidden rounded-2xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
        <div className="flex gap-6 mb-6 skill-scroll-left">
          {row1.map((skill, i) => <SkillBadge key={`r1-${i}`} skill={skill} />)}
        </div>
        <div className="flex gap-6 skill-scroll-right">
          {row2.map((skill, i) => <SkillBadge key={`r2-${i}`} skill={skill} />)}
        </div>
      </motion.div>
    </section>
  )
}
