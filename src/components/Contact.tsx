import { motion } from "motion/react"
import { ArrowUpRight, Mail } from "lucide-react"
import { contact } from "@/data/portfolio"
import { useLanguage } from "@/context/LanguageContext"

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
}

const GmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.908 1.528-1.147C21.69 2.28 24 3.434 24 5.457z"/>
  </svg>
)

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
)

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const links = [
  { icon: GmailIcon, label: "Email", href: `mailto:${contact.email}`, value: contact.email },
  { icon: GitHubIcon, label: "GitHub", href: contact.github, value: "github.com/c0dy8" },
  { icon: LinkedInIcon, label: "LinkedIn", href: contact.linkedin, value: "linkedin.com/in/briam-santiago-vanegas-morales" },
]

export function Contact() {
  const { t } = useLanguage()

  return (
    <section id="contact" className="py-28 px-6 border-t border-zinc-800/50">
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
            <Mail size={12} />
            {t.contact.label}
          </span>
        </motion.div>

        <div className="max-w-2xl">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight font-display"
            variants={fadeUp}
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {t.contact.heading}
          </motion.h2>

          <motion.p
            className="text-zinc-500 text-base md:text-lg mb-12 leading-relaxed"
            variants={fadeUp}
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {t.contact.subheading}
          </motion.p>

          <div className="space-y-4">
            {links.map(({ icon: Icon, label, href, value }, i) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center justify-between border border-zinc-800 hover:border-white/10 rounded-xl p-5 group bg-zinc-900/20 overflow-hidden"
                variants={fadeUp}
                custom={i + 3}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                {/* White fill sweeping from left */}
                <span
                  aria-hidden
                  className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out rounded-[10px]"
                />

                <div className="relative flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800/60 group-hover:bg-black/8 flex items-center justify-center flex-shrink-0 text-zinc-300 group-hover:text-zinc-900 transition-colors duration-200">
                    <Icon />
                  </div>
                  <div>
                    <p className="text-white group-hover:text-zinc-900 font-semibold text-sm transition-colors duration-200">{label}</p>
                    <p className="text-zinc-500 group-hover:text-zinc-600 text-sm font-mono transition-colors duration-200">{value}</p>
                  </div>
                </div>

                <div className="relative text-zinc-600 group-hover:text-zinc-900 transition-colors duration-200">
                  <ArrowUpRight size={18} />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      <motion.div
        className="max-w-5xl mx-auto mt-24 pt-8 border-t border-zinc-800/50 flex flex-col sm:flex-row items-center justify-between gap-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <p className="text-zinc-600 text-sm font-mono">{t.contact.footer}</p>
        <p className="text-zinc-700 text-xs font-mono">{t.contact.built}</p>
      </motion.div>
    </section>
  )
}
