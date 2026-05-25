import { motion } from "motion/react"
import { Download, User } from "lucide-react"
import { ProfileCard } from "@/components/ui/ProfileCard"
import { useLanguage } from "@/context/LanguageContext"

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
}

export function About() {
  const { t } = useLanguage()

  return (
    <section id="about" className="py-28 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="mb-6"
          variants={fadeUp}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-700/80 bg-zinc-900/70 text-zinc-400 font-mono text-xs tracking-widest backdrop-blur-sm">
            <User size={12} />
            {t.about.label}
          </span>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          <motion.div
            variants={fadeUp}
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
              {t.about.heading}{" "}
              <span className="text-zinc-300">Briam</span>
            </h2>
            <p className="text-zinc-400 leading-relaxed text-base md:text-lg mb-8">
              {t.about.bio}
            </p>

            <motion.a
              href="/CV.pdf"
              download="CV-Briam-Vanegas.pdf"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full border border-zinc-700 hover:border-zinc-400 bg-zinc-900/60 hover:bg-zinc-800/80 text-zinc-300 hover:text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              <Download size={15} />
              {t.about.download_cv}
            </motion.a>
          </motion.div>

          <motion.div
            className="flex justify-center"
            variants={fadeUp}
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <ProfileCard
              avatarUrl="/briam.jpg"
              iconUrl="/icon-pattern.svg"
              name="Briam Vanegas"
              title="Full Stack Developer & AI Engineer"
              handle="bsvanegas"
              status={t.about.status}
              contactText={t.about.contact_text}
              behindGlowEnabled={true}
              behindGlowColor="rgba(200, 200, 200, 0.25)"
              innerGradient="linear-gradient(145deg, rgba(40,40,40,0.8) 0%, rgba(10,10,10,0.95) 100%)"
              enableTilt={true}
              onContactClick={() => {
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
