import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { User, Code2, Layers, Briefcase, Mail } from "lucide-react"
import { GradientMenu } from "@/components/ui/gradient-menu"
import { useLanguage } from "@/context/LanguageContext"

export function Navbar() {
  const { t } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [active, setActive] = useState("")

  const links = [
    { title: t.nav.about,      href: "#about",      icon: User,     gradientFrom: "#e2e8f0", gradientTo: "#94a3b8" },
    { title: t.nav.skills,     href: "#skills",     icon: Code2,    gradientFrom: "#f8fafc", gradientTo: "#64748b" },
    { title: t.nav.projects,   href: "#projects",   icon: Layers,   gradientFrom: "#cbd5e1", gradientTo: "#475569" },
    { title: t.nav.experience, href: "#experience", icon: Briefcase,gradientFrom: "#e2e8f0", gradientTo: "#6b7280" },
    { title: t.nav.contact,    href: "#contact",    icon: Mail,     gradientFrom: "#f1f5f9", gradientTo: "#94a3b8" },
  ]

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30)
      let current = ""
      for (const { href } of links) {
        const el = document.getElementById(href.slice(1))
        if (el && el.getBoundingClientRect().top <= 120) current = href.slice(1)
      }
      setActive(current)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 h-16"
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Logo */}
        <motion.a
          href="#"
          className="font-bold text-base tracking-tight text-white font-display z-10"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          BV
        </motion.a>

        {/* Gradient menu — desktop */}
        <div className="hidden md:flex">
          <GradientMenu items={links} active={active} />
        </div>

        {/* Mobile hamburger */}
        <motion.button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 z-10"
          onClick={() => setMobileOpen((v) => !v)}
          whileTap={{ scale: 0.9 }}
          aria-label="Toggle menu"
        >
          <motion.span
            className="block h-px w-5 bg-zinc-400 origin-center"
            animate={mobileOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className="block h-px w-5 bg-zinc-400"
            animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="block h-px w-5 bg-zinc-400 origin-center"
            animate={mobileOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-30 bg-black/95 backdrop-blur-lg flex flex-col items-center justify-center gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {links.map(({ href, title, icon: Icon }, i) => (
              <motion.a
                key={href}
                href={href}
                className="flex items-center gap-3 text-2xl font-bold text-zinc-400 hover:text-white tracking-tight font-display"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.35 }}
                whileHover={{ x: 8 }}
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={20} />
                {title}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
