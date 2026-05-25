import { motion } from "motion/react"
import { experience } from "@/data/portfolio"
import { Briefcase } from "lucide-react"
import { GlowCard } from "@/components/ui/spotlight-card"
import { useLanguage } from "@/context/LanguageContext"

const fadeUp = {
  hidden: { opacity: 0, x: -24 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
}

export function Experience() {
  const { t } = useLanguage()

  return (
    <section id="experience" className="py-28 px-6 border-t border-zinc-800/50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-700/80 bg-zinc-900/70 text-zinc-400 font-mono text-xs tracking-widest backdrop-blur-sm">
            <Briefcase size={12} />
            {t.experience.label}
          </span>
        </motion.div>
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-white mb-16 tracking-tight font-display"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {t.experience.heading}
        </motion.h2>

        <div className="relative">
          <motion.div
            className="absolute left-[19px] top-0 bottom-0 w-px origin-top"
            style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.15), rgba(255,255,255,0.02))" }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          />

          <div className="space-y-12">
            {experience.map((item, i) => (
              <motion.div
                key={item.id}
                className="flex gap-8"
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
              >
                <motion.div
                  className="w-10 h-10 rounded-full border border-zinc-700 bg-zinc-900 flex items-center justify-center flex-shrink-0 mt-1"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 + 0.3, type: "spring", stiffness: 200 }}
                >
                  <Briefcase size={14} className="text-zinc-400" />
                </motion.div>

                <motion.div className="flex-1" whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                  <GlowCard className="p-6 w-full" glowColor="rainbow">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <div>
                        <h3 className="text-white font-bold text-lg tracking-tight">
                          {t.experience.roles[i]}
                        </h3>
                        <p className="text-zinc-400 font-mono text-sm">{item.company}</p>
                      </div>
                      <span className="text-zinc-300 font-mono text-xs font-semibold border border-zinc-600 bg-zinc-800/80 rounded-full px-4 py-1.5 self-start sm:self-auto tracking-wider whitespace-nowrap">
                        {item.period}
                      </span>
                    </div>
                    <p className="text-zinc-500 text-sm leading-relaxed">
                      {t.experience.descriptions[i]}
                    </p>
                  </GlowCard>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
