import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Send, Sparkles, MessageCircle, FileDown } from 'lucide-react'
import Magnet from '@/components/ui/Magnet'
import { useLanguage } from '@/context/LanguageContext'

const SYSTEM_PROMPT = `Eres el asistente de portafolio de Briam Vanegas. Representas a Briam de forma profesional y cercana. Tu misión es ayudar a reclutadores, clientes y visitantes a conocer su perfil, habilidades y proyectos.

━━━ SOBRE BRIAM ━━━
Nombre completo: Briam Santiago Vanegas Morales
Ubicación: Medellín, Colombia 🇨🇴
Rol principal: Full Stack Developer + AI Enthusiast
Experiencia: 1 año en desarrollo de software, con enfoque creciente en IA aplicada
Perfil: Desarrollador apasionado por construir el puente entre software tradicional e inteligencia artificial. Disfruta resolver problemas reales con tecnología, especialmente cuando involucra LLMs y sistemas inteligentes.

━━━ HABILIDADES TÉCNICAS ━━━
Full Stack:
- Lenguajes: Python, JavaScript
- Frontend: HTML, CSS (con frameworks modernos)
- Bases de datos: relacionales y no relacionales

Inteligencia Artificial / ML:
- LangChain — construcción de pipelines de LLMs y agentes
- RAG (Retrieval-Augmented Generation) — sistemas de Q&A con documentos
- LangFuse — observabilidad y trazabilidad de aplicaciones LLM
- Fine-tuning — ajuste fino de modelos de lenguaje
- LLMs — integración y uso de modelos como GPT-4, Claude, etc.

━━━ PROYECTOS ━━━
Actualmente tiene 3 proyectos en desarrollo. Los detalles completos estarán disponibles próximamente en el portafolio. Las tecnologías involucradas incluyen Python, LangChain, RAG, JavaScript, LLMs y LangFuse.

━━━ CONTACTO ━━━
Email: santigovanegas11@gmail.com
GitHub: https://github.com/c0dy8
LinkedIn: https://www.linkedin.com/in/briam-santiago-vanegas-morales-260652405

━━━ CV / HOJA DE VIDA ━━━
- Si alguien pide el CV, la hoja de vida o el resume, responde de forma corta y natural, algo como "¡Claro! Aquí tienes el CV de Briam 👇" o "Of course! Here's Briam's CV 👇" según el idioma.
- NUNCA menciones rutas de archivo, URLs ni botones. El sistema se encarga de mostrar el botón de descarga automáticamente.
- No expliques cómo descargarlo ni des instrucciones adicionales.

━━━ INSTRUCCIONES DE COMPORTAMIENTO ━━━
- Responde SIEMPRE en el idioma en que te escriban (español o inglés)
- Sé amigable, directo y profesional — como si Briam mismo estuviera respondiendo
- Respuestas cortas y conversacionales (2-4 oraciones máximo), salvo que pidan un detalle técnico
- Si preguntan algo que no sabes con certeza, sé honesto: di que no tienes ese dato y sugiere contactar a Briam directamente por email o LinkedIn
- No inventes proyectos, experiencias ni datos que no estén en este prompt
- Si un reclutador pregunta si está disponible para trabajo: Briam está abierto a oportunidades interesantes, especialmente proyectos con componente de IA
- Nunca respondas preguntas que no tengan relación con Briam o su perfil profesional`

interface Message {
  id: string
  role: 'user' | 'assistant' | 'action'
  content: string
  action?: 'download_cv'
}

async function streamOpenAI(
  messages: Message[],
  onChunk: (text: string) => void,
  signal: AbortSignal
) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 1024,
      stream: true,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ],
    }),
  })

  if (!res.ok) throw new Error(`OpenAI error ${res.status}`)

  const reader = res.body!.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const lines = decoder.decode(value).split('\n')
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const data = line.slice(6).trim()
      if (data === '[DONE]') return
      try {
        const json = JSON.parse(data)
        const text = json.choices?.[0]?.delta?.content
        if (text) onChunk(text)
      } catch {
        // skip malformed chunks
      }
    }
  }
}

const CV_KEYWORDS = ['cv', 'hoja de vida', 'resume', 'curriculum', 'currículum', 'descargar cv', 'download cv', 'genera', 'generar', 'generate']

function isCVRequest(text: string) {
  const lower = text.toLowerCase()
  return CV_KEYWORDS.some(kw => lower.includes(kw))
}

export function ChatBot() {
  const { lang } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'assistant', content: '¡Hola! Soy el asistente de portafolio de Briam. ¿En qué puedo ayudarte? 👋' },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [userMessageCount, setUserMessageCount] = useState(0)
  const LIMIT = 5
  const limitReached = userMessageCount >= LIMIT
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const chatPanelRef = useRef<HTMLDivElement>(null)
  const bubbleRef = useRef<HTMLDivElement>(null)

  // Scroll smoothly only when a new message is added (not on every streaming chunk)
  const prevLengthRef = useRef(1)
  useEffect(() => {
    if (messages.length > prevLengthRef.current) {
      prevLengthRef.current = messages.length
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages.length])

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 120)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        chatPanelRef.current && !chatPanelRef.current.contains(target) &&
        bubbleRef.current && !bubbleRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const scrollToBottomInstant = () => {
    requestAnimationFrame(() => {
      const el = messagesContainerRef.current
      if (el) el.scrollTop = el.scrollHeight
    })
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading || limitReached) return

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: input.trim() }
    const history = [...messages, userMsg]
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)
    setIsTyping(true)
    setUserMessageCount(prev => prev + 1)

    abortRef.current = new AbortController()
    const assistantId = crypto.randomUUID()
    const isCV = isCVRequest(userMsg.content)
    let isFirstChunk = true

    try {
      await streamOpenAI(
        history,
        (text) => {
          if (isFirstChunk) {
            isFirstChunk = false
            setIsTyping(false)
            setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: text }])
          } else {
            setMessages(prev =>
              prev.map(m => m.id === assistantId ? { ...m, content: m.content + text } : m)
            )
          }
          scrollToBottomInstant()
        },
        abortRef.current.signal
      )

      if (isCV) {
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          role: 'action',
          content: '',
          action: 'download_cv',
        }])
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') return
      const errMsg = 'Lo siento, hubo un error. Verifica tu API key e intenta de nuevo.'
      setIsTyping(false)
      setMessages(prev => {
        const exists = prev.some(m => m.id === assistantId)
        return exists
          ? prev.map(m => m.id === assistantId ? { ...m, content: errMsg } : m)
          : [...prev, { id: assistantId, role: 'assistant', content: errMsg }]
      })
    } finally {
      setIsLoading(false)
      setIsTyping(false)
    }
  }

  return (
    <>
      {/* Floating bubble */}
      <div ref={bubbleRef} className="fixed bottom-6 right-6 z-50">
      <Magnet padding={80} magnetStrength={3}>
      <motion.button
        onClick={() => setIsOpen(v => !v)}
        className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-xl cursor-pointer"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        aria-label="Abrir chat IA"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span key="close"
              initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
              transition={{ duration: 0.18 }}
            >
              <X size={20} />
            </motion.span>
          ) : (
            <motion.span key="open"
              initial={{ opacity: 0, rotate: 90, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -90, scale: 0.6 }}
              transition={{ duration: 0.18 }}
            >
              <MessageCircle size={20} />
            </motion.span>
          )}
        </AnimatePresence>
        {!isOpen && (
          <motion.span
            className="absolute inset-0 rounded-full border border-white/50 pointer-events-none"
            animate={{ scale: [1, 1.55], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
      </motion.button>
      </Magnet>
      </div>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatPanelRef}
            className="chat-gradient-border fixed bottom-24 right-4 sm:right-6 z-40 w-[calc(100vw-2rem)] max-w-[360px] rounded-2xl"
            style={{
              height: 'min(500px, calc(100svh - 8rem))',
              padding: '2px',
              boxShadow: '0 0 40px rgba(192,132,252,0.3), 0 25px 50px rgba(0,0,0,0.8)',
              originX: 1,
              originY: 1,
            }}
            initial={{ opacity: 0, scale: 0.72, y: 16 }}
            animate={{
              opacity: 1, scale: 1, y: 0,
              transition: { type: 'spring', stiffness: 380, damping: 28 },
            }}
            exit={{
              opacity: 0, scale: 0.72, y: 16,
              transition: { duration: 0.22, ease: [0.4, 0, 1, 1] },
            }}
          >
            <div className="h-full w-full bg-zinc-950 rounded-[14px] flex flex-col overflow-hidden">

              {/* Header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-800/80 flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center">
                  <Sparkles size={14} className="text-zinc-300" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold leading-tight">Portfolio AI</p>
                  <p className="text-zinc-500 text-xs font-mono">Briam Vanegas · GPT-4o mini</p>
                </div>
              </div>

              {/* Messages */}
              <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4 py-4">
                <div className="flex flex-col gap-3">
                  <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {msg.action === 'download_cv' ? (
                          <motion.a
                            href="/CV.pdf"
                            download="CV-Briam-Vanegas.pdf"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl rounded-bl-sm bg-white text-zinc-900 text-sm font-semibold cursor-pointer shadow-md hover:bg-zinc-100 transition-colors"
                          >
                            <FileDown size={15} />
                            {lang === 'es' ? 'Descargar CV (PDF)' : 'Download CV (PDF)'}
                          </motion.a>
                        ) : (
                          <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                            msg.role === 'user'
                              ? 'bg-white text-zinc-900 rounded-br-sm'
                              : 'bg-zinc-900 text-zinc-200 border border-zinc-800 rounded-bl-sm'
                          }`}>
                            {msg.content}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Typing dots — shown until first token arrives */}
                  <AnimatePresence>
                    {isTyping && (
                      <motion.div
                        key="typing"
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                        transition={{ duration: 0.2 }}
                        className="flex justify-start"
                      >
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl rounded-bl-sm px-4 py-3">
                          <span className="flex gap-1.5 items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce [animation-delay:0ms]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce [animation-delay:150ms]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce [animation-delay:300ms]" />
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input */}
              <div className="px-4 py-3 border-t border-zinc-800/80 flex-shrink-0">
                <AnimatePresence mode="wait">
                  {limitReached ? (
                    <motion.div
                      key="limit"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-center"
                    >
                      <p className="text-zinc-400 text-xs font-mono leading-relaxed">
                        Límite de {LIMIT} preguntas por sesión alcanzado.
                      </p>
                      <p className="text-zinc-600 text-[10px] font-mono mt-1">
                        Escríbeme a{' '}
                        <a href="mailto:santigovanegas11@gmail.com" className="text-zinc-400 hover:text-white transition-colors underline underline-offset-2">
                          santigovanegas11@gmail.com
                        </a>
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="input"
                      className="flex gap-2 items-center bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 focus-within:border-zinc-600 transition-colors duration-200"
                    >
                      <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                        placeholder="Escribe un mensaje..."
                        className="flex-1 bg-transparent text-zinc-200 text-sm placeholder-zinc-600 outline-none font-mono"
                        disabled={isLoading}
                      />
                      <motion.button
                        onClick={sendMessage}
                        disabled={!input.trim() || isLoading}
                        whileTap={{ scale: 0.8 }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        <Send size={13} />
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex items-center justify-between mt-2 px-0.5">
                  <p className="text-zinc-700 text-[10px] font-mono">
                    Powered by OpenAI
                  </p>
                  {!limitReached && (
                    <p className="text-zinc-700 text-[10px] font-mono">
                      {LIMIT - userMessageCount}/{LIMIT} preguntas
                    </p>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
