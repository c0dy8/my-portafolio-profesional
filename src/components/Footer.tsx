import { type ComponentProps, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Mail, Github, Linkedin, Code2, User, Layers, Briefcase, MessageSquare } from 'lucide-react'
import { contact } from '@/data/portfolio'
import { useLanguage } from '@/context/LanguageContext'

type AnimatedContainerProps = {
  delay?: number
  className?: ComponentProps<typeof motion.div>['className']
  children: ReactNode
}

function AnimatedContainer({ className, delay = 0.1, children }: AnimatedContainerProps) {
  const shouldReduceMotion = useReducedMotion()
  if (shouldReduceMotion) return <>{children}</>
  return (
    <motion.div
      initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
      whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function Footer() {
  const { t } = useLanguage()

  const navLinks = [
    { title: t.nav.about,      href: '#about',      icon: User },
    { title: t.nav.skills,     href: '#skills',     icon: Layers },
    { title: t.nav.projects,   href: '#projects',   icon: Code2 },
    { title: t.nav.experience, href: '#experience', icon: Briefcase },
    { title: t.nav.contact,    href: '#contact',    icon: MessageSquare },
  ]

  const contactLinks = [
    { title: 'Email',    href: `mailto:${contact.email}`, icon: Mail },
    { title: 'GitHub',   href: contact.github,            icon: Github },
    { title: 'LinkedIn', href: contact.linkedin,          icon: Linkedin },
  ]

  return (
    <footer className="relative w-full border-t border-zinc-800/60 bg-[radial-gradient(35%_128px_at_50%_0%,rgba(255,255,255,0.04),transparent)] px-6 py-12 lg:py-16">
      {/* Top glow line */}
      <div className="absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-px rounded-full bg-zinc-600/40 blur-sm" />

      <div className="max-w-5xl mx-auto grid gap-10 xl:grid-cols-3 xl:gap-8">

        {/* Brand */}
        <AnimatedContainer className="flex flex-col gap-4">
          <span className="font-bold text-2xl text-white font-display tracking-tight">BV</span>
          <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
            Full Stack Developer & AI Enthusiast.<br />
            Medellín, Colombia 🇨🇴
          </p>
          <p className="text-zinc-700 text-xs font-mono mt-auto">
            © {new Date().getFullYear()} Briam Vanegas
          </p>
        </AnimatedContainer>

        {/* Links grid */}
        <div className="grid grid-cols-2 gap-8 xl:col-span-2">

          {/* Navigation */}
          <AnimatedContainer delay={0.15}>
            <h3 className="text-zinc-400 text-xs font-mono tracking-widest uppercase mb-4">
              {t.nav.about === 'Sobre mí' ? 'Navegación' : 'Navigation'}
            </h3>
            <ul className="space-y-2.5">
              {navLinks.map(({ title, href, icon: Icon }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="inline-flex items-center gap-2 text-zinc-500 hover:text-white text-sm transition-colors duration-200"
                  >
                    <Icon size={13} className="text-zinc-600" />
                    {title}
                  </a>
                </li>
              ))}
            </ul>
          </AnimatedContainer>

          {/* Contact */}
          <AnimatedContainer delay={0.25}>
            <h3 className="text-zinc-400 text-xs font-mono tracking-widest uppercase mb-4">
              {t.nav.contact === 'Contacto' ? 'Contacto' : 'Contact'}
            </h3>
            <ul className="space-y-2.5 mb-6">
              {contactLinks.map(({ title, href, icon: Icon }) => (
                <li key={title}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-zinc-500 hover:text-white text-sm transition-colors duration-200"
                  >
                    <Icon size={13} className="text-zinc-600" />
                    {title}
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-zinc-700 text-[11px] font-mono">
              Built with React · TypeScript · Motion
            </p>
          </AnimatedContainer>

        </div>
      </div>
    </footer>
  )
}
