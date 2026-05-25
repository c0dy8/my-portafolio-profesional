import { motion } from 'motion/react'
import { useLanguage } from '@/context/LanguageContext'
import Magnet from '@/components/ui/Magnet'

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()

  return (
    <div className="fixed bottom-6 left-6 z-50">
    <Magnet padding={80} magnetStrength={3}>
    <motion.div
      className="flex rounded-full border border-zinc-700 bg-zinc-900 p-1 shadow-xl"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 25 }}
    >
      {(['es', 'en'] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className="relative px-4 py-2 text-xs font-mono font-bold tracking-widest cursor-pointer z-10 transition-colors duration-300"
          style={{ color: lang === l ? '#000' : '#71717a' }}
        >
          {/* Sliding white pill */}
          {lang === l && (
            <motion.span
              layoutId="lang-pill"
              className="absolute inset-0 rounded-full bg-white"
              style={{ zIndex: -1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          {l === 'es' ? 'ESP' : 'EN'}
        </button>
      ))}
    </motion.div>
    </Magnet>
    </div>
  )
}
