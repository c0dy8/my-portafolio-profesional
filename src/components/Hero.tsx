import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { MagicTextReveal } from "@/components/ui/magic-text-reveal"
import DotGrid from "@/components/ui/DotGrid"
import { useLanguage } from "@/context/LanguageContext"

export function Hero() {
  const { t } = useLanguage()
  const [titleIndex, setTitleIndex] = useState(0)

  useEffect(() => {
    setTitleIndex(0)
  }, [t])

  useEffect(() => {
    const id = setInterval(
      () => setTitleIndex((i) => (i + 1) % t.hero.titles.length),
      2800
    )
    return () => clearInterval(id)
  }, [t])

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center">
      <div className="absolute inset-0">
        <DotGrid
          dotSize={4}
          gap={28}
          baseColor="#3a3a3a"
          activeColor="#ffffff"
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
        />
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center">
        {/* Location badge */}
        <motion.div
          className="inline-flex items-center gap-3 mb-10 border border-zinc-800 rounded-full px-5 py-2 bg-zinc-900/60 backdrop-blur-sm"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Live pulse dot */}
          <span className="relative flex h-2 w-2">
            <motion.span
              className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
              animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
            />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>

          {/* Flag + city */}
          <span className="text-zinc-300 text-xs font-semibold tracking-wide">
            🇨🇴 Medellín, Colombia
          </span>

          {/* Divider */}
          <span className="w-px h-3 bg-zinc-700" />

          {/* Available status */}
          <span className="text-zinc-500 text-xs font-mono">
            available
          </span>
        </motion.div>

        {/* Name */}
        <motion.div
          className="w-full flex flex-col items-center mb-2"
          style={{ gap: 0, marginTop: '-8px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <MagicTextReveal
            text="Briam"
            color="rgba(255, 255, 255, 1)"
            fontSize={120}
            fontFamily="Space Grotesk, sans-serif"
            fontWeight={700}
            spread={35}
            speed={0.4}
            density={4}
            resetOnMouseLeave={false}
            fillWidth
          />
          <MagicTextReveal
            text="Vanegas"
            color="rgba(130, 130, 140, 1)"
            fontSize={120}
            fontFamily="Space Grotesk, sans-serif"
            fontWeight={700}
            spread={35}
            speed={0.4}
            density={4}
            resetOnMouseLeave={false}
            fillWidth
          />
        </motion.div>

        {/* Rotating title */}
        <div className="h-8 md:h-10 flex items-center justify-center overflow-hidden mb-8">
          <AnimatePresence mode="wait">
            <motion.span
              key={`${titleIndex}-${t.hero.titles[titleIndex]}`}
              className="text-lg md:text-xl font-mono text-zinc-400 tracking-wider"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {"// "}{t.hero.titles[titleIndex]}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Subtitle */}
        <motion.p
          className="text-zinc-500 text-base md:text-lg max-w-lg mx-auto mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          {t.hero.subtitle}
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex items-center justify-center gap-4 flex-wrap"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <motion.a
            href="#projects"
            className="bg-white hover:bg-zinc-200 text-black text-sm font-semibold px-7 py-3 rounded-full transition-colors"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            {t.hero.cta_projects}
          </motion.a>
          <motion.a
            href="#contact"
            className="border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-sm font-semibold px-7 py-3 rounded-full transition-colors"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            {t.hero.cta_contact}
          </motion.a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          <motion.div
            className="w-px h-14 bg-gradient-to-b from-transparent to-zinc-600 origin-top"
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </section>
  )
}
