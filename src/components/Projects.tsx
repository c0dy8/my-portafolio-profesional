import { motion } from "motion/react"
import { GitBranch, ExternalLink, FolderGit2 } from "lucide-react"
import { projects } from "@/data/portfolio"
import { GlowCard } from "@/components/ui/spotlight-card"
import { useLanguage } from "@/context/LanguageContext"

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
}

export function Projects() {
  const { t } = useLanguage()

  return (
    <section id="projects" className="py-28 px-6 border-t border-zinc-800/50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="mb-6"
          variants={fadeUp}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-700/80 bg-zinc-900/70 text-zinc-400 font-mono text-xs tracking-widest backdrop-blur-sm">
            <FolderGit2 size={12} />
            {t.projects.label}
          </span>
        </motion.div>
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-white mb-16 tracking-tight font-display"
          variants={fadeUp}
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {t.projects.heading}
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              className="group"
              variants={fadeUp}
              custom={i + 2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
            >
              <GlowCard className="flex flex-col h-full" glowColor="rainbow">
                <div
                  className="h-44 relative overflow-hidden rounded-t-[11px]"
                  style={{ background: `linear-gradient(135deg, ${project.from}, ${project.to})` }}
                >
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center gap-4 bg-black/70 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.a
                      href={project.github}
                      className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <GitBranch size={16} />
                    </motion.a>
                    <motion.a
                      href={project.demo}
                      className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ExternalLink size={16} />
                    </motion.a>
                  </motion.div>
                  <span className="absolute top-4 right-4 text-white/10 font-bold text-4xl font-mono leading-none">
                    {String(project.id).padStart(2, "0")}
                  </span>
                </div>

                <div className="p-6 flex flex-col gap-3 flex-1">
                  <h3 className="text-white font-bold text-lg tracking-tight">{t.projects.titles[i]}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed flex-1">{t.projects.placeholder}</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-mono text-zinc-500 border border-zinc-800 rounded-md px-2 py-0.5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
