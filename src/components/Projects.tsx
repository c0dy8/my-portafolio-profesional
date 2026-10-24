import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react"
import { createPortal, flushSync } from "react-dom"
import { motion } from "motion/react"
import { ExternalLink, FolderGit2, Check, Play, Pause, Maximize2, X } from "lucide-react"
import { projects } from "@/data/portfolio"
import type { Translations } from "@/data/translations"
import { GlowCard } from "@/components/ui/spotlight-card"
import { useLanguage } from "@/context/LanguageContext"

type Project = (typeof projects)[number]
type ProjectCopy = Translations["projects"]["items"][number]

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
}

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`

const GitHubIcon = ({ size }: { size: number }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} aria-hidden="true">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
)

// The card <-> modal morph runs on the View Transitions API (styles in index.css). The modal
// carries these names while it's open; the card only gets them for the instant the browser
// snapshots it, since each name must be unique on the page.
const VT_NAMES = [
  ["[data-project-card]", "project-card"],
  ["[data-vt-media]", "project-media"],
  ["[data-vt-title]", "project-title"],
] as const

function nameCard(card: HTMLElement, named: boolean) {
  for (const [selector, name] of VT_NAMES) {
    const el = card.matches(selector) ? card : card.querySelector<HTMLElement>(selector)
    if (el) el.style.viewTransitionName = named ? name : ""
  }
}

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

// Applies `update` inside a view transition, or straight away where the API is missing or the
// visitor prefers reduced motion; `done` runs once it's all settled. `direction` is exposed on
// <html> while it runs, for the CSS that differs between opening and closing.
function swap(direction: "open" | "close", update: () => void, done: () => void) {
  if (typeof document.startViewTransition !== "function" || prefersReducedMotion()) {
    update()
    done()
    return
  }
  const html = document.documentElement
  html.dataset.projectVt = direction
  document.startViewTransition(update).finished.finally(() => {
    delete html.dataset.projectVt
    done()
  })
}

// The frame a video is showing right now, as an image URL (undefined before it has one)
function captureFrame(video: HTMLVideoElement) {
  if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || !video.currentTime) return undefined
  const canvas = document.createElement("canvas")
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  canvas.getContext("2d")?.drawImage(video, 0, 0)
  return canvas.toDataURL("image/jpeg", 0.85)
}

interface ProjectVideoProps {
  src: string
  poster?: string
  // An image laid over the video until it's actually playing, so seeking never shows a blank box
  cover?: string
  startAt?: number
  // false holds back the seek and playback, e.g. while a view transition is still running
  active?: boolean
  // Shows the play/pause button when given
  labels?: { play: string; pause: string }
}

function ProjectVideo({ src, poster, cover, startAt = 0, active = true, labels }: ProjectVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const pausedByUser = useRef(false)
  const [playing, setPlaying] = useState(false)
  const [covered, setCovered] = useState(Boolean(cover))

  // The loop only downloads and plays while it's on screen. A pause from the button sticks
  // until the visitor presses play again; reduced motion leaves it on the poster.
  useEffect(() => {
    const video = videoRef.current
    if (!video || !active) return
    if (startAt) video.currentTime = startAt
    if (prefersReducedMotion()) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !pausedByUser.current) video.play().catch(() => {})
        else video.pause()
      },
      { threshold: 0.4 },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [active, startAt])

  const toggle = () => {
    const video = videoRef.current
    if (!video) return
    pausedByUser.current = !video.paused
    if (video.paused) video.play().catch(() => {})
    else video.pause()
  }

  return (
    <>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onPlaying={() => setCovered(false)}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {covered && <img src={cover} alt="" className="absolute inset-0 w-full h-full object-cover" />}
      {labels && (
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? labels.pause : labels.play}
          className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-black/60 border border-white/15 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-black/80 transition-colors cursor-pointer"
        >
          {playing ? <Pause size={14} /> : <Play size={14} className="translate-x-px" />}
        </button>
      )}
    </>
  )
}

function LiveBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-xs tracking-wider text-emerald-400">
      <span className="relative flex w-1.5 h-1.5">
        <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
        <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-400" />
      </span>
      {label}
    </span>
  )
}

const gradient = (project: Project) => `linear-gradient(135deg, ${project.from}, ${project.to})`

interface ProjectModalProps {
  project: Project
  copy: ProjectCopy
  // Where the card's preview was when it was clicked: its time and that frame as an image
  startAt: number
  frame?: string
  // Whether the opening transition has finished
  settled: boolean
  onClose: () => void
}

function ProjectModal({ project, copy, startAt, frame, settled, onClose }: ProjectModalProps) {
  const { t } = useLanguage()
  const closeRef = useRef<HTMLButtonElement>(null)

  // Lock the page behind the modal (keeping the scrollbar gutter so nothing shifts sideways)
  // before the view transition snapshots it, and close on Escape
  useLayoutEffect(() => {
    const html = document.documentElement
    const { overflow, scrollbarGutter } = html.style
    html.style.overflow = "hidden"
    html.style.scrollbarGutter = "stable"
    closeRef.current?.focus({ preventScroll: true })
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => {
      html.style.overflow = overflow
      html.style.scrollbarGutter = scrollbarGutter
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`project-${project.id}-title`}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative flex flex-col w-full max-w-6xl max-h-full overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl"
        style={{ viewTransitionName: "project-card" }}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={t.projects.close}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-zinc-900/90 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        <div className="overflow-y-auto overscroll-contain p-2 sm:p-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-2 pt-1.5 pb-4 pr-14 min-h-9 font-mono text-xs tracking-wider">
            <span className="text-zinc-400 uppercase">
              <span className="text-zinc-600 mr-3">{String(project.id).padStart(2, "0")}</span>
              {copy.kicker}
            </span>
            {project.live && <LiveBadge label={t.projects.live} />}
          </div>

          <div
            className="relative overflow-hidden rounded-[10px]"
            style={{ aspectRatio: project.ratio, background: gradient(project), viewTransitionName: "project-media" }}
          >
            {/* Picks up where the card's preview was. It holds still on that frame while the card
                morphs (the transition carries this live element), then seeks and plays from there */}
            <ProjectVideo
              src={asset(project.video!)}
              poster={asset(project.poster!)}
              cover={frame}
              startAt={startAt}
              active={settled}
              labels={{ play: t.projects.play, pause: t.projects.pause }}
            />
          </div>

          <div className="grid md:grid-cols-[1.35fr_1fr] gap-8 md:gap-10 px-3 sm:px-5 pt-7 pb-5">
            <div className="flex flex-col gap-4">
              <div className="w-fit" style={{ viewTransitionName: "project-title" }}>
                <h3
                  id={`project-${project.id}-title`}
                  className="text-white font-bold text-2xl md:text-3xl tracking-tight font-display"
                >
                  {copy.title}
                </h3>
              </div>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed">{copy.description}</p>
              <div className="flex flex-wrap gap-3 pt-2">
                <motion.a
                  href={project.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-white hover:bg-zinc-200 text-black text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {t.projects.visit}
                  <ExternalLink size={14} />
                </motion.a>
                <motion.a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <GitHubIcon size={15} />
                  {t.projects.code}
                </motion.a>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <ul className="flex flex-col gap-3">
                {copy.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-3 text-sm text-zinc-400 leading-relaxed">
                    <Check size={14} className="mt-1 shrink-0 text-zinc-500" />
                    {highlight}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2 mt-auto">
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
          </div>
        </div>
      </div>
    </div>
  )
}

export function Projects() {
  const { t } = useLanguage()
  const [active, setActive] = useState<{ id: number; startAt: number; frame?: string; settled: boolean } | null>(null)
  const openerRef = useRef<HTMLButtonElement | null>(null)
  // A second open/close while a transition is still running would fight over the names
  const busy = useRef(false)

  const entries = projects.map((project, i) => ({ project, copy: t.projects.items[i] }))
  const activeEntry = active && entries.find(({ project }) => project.id === active.id)

  const open = (id: number) => (e: MouseEvent<HTMLButtonElement>) => {
    if (busy.current) return
    const button = e.currentTarget
    const card = button.closest<HTMLElement>("[data-project-card]")
    const preview = card?.querySelector("video")
    const next = {
      id,
      startAt: preview?.currentTime ?? 0,
      frame: preview ? captureFrame(preview) : undefined,
      settled: false,
    }
    openerRef.current = button
    busy.current = true
    if (card) nameCard(card, true)
    swap(
      "open",
      () => {
        if (card) nameCard(card, false)
        flushSync(() => setActive(next))
      },
      () => {
        setActive((current) => current && { ...current, settled: true })
        busy.current = false
      },
    )
  }

  const close = useCallback(() => {
    if (busy.current) return
    const opener = openerRef.current
    const card = opener?.closest<HTMLElement>("[data-project-card]")
    // The modal's video shrinks back into the card, so the card's preview (hidden but still
    // looping) jumps to the same moment and waits there, instead of popping in at another one
    const preview = card?.querySelector("video")
    const shown = document.querySelector<HTMLVideoElement>('[role="dialog"] video')
    if (preview && shown) {
      preview.pause()
      preview.currentTime = shown.currentTime
    }
    busy.current = true
    swap(
      "close",
      () => {
        flushSync(() => setActive(null))
        if (card) nameCard(card, true)
      },
      () => {
        if (card) nameCard(card, false)
        if (preview && !prefersReducedMotion()) preview.play().catch(() => {})
        opener?.focus({ preventScroll: true })
        busy.current = false
      },
    )
  }, [])

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
          {entries.map(({ project, copy }, i) => (
            <motion.div
              key={project.id}
              className="group"
              variants={fadeUp}
              custom={i + 2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
            >
              {/* This outer div is the hover target and never moves; only the inner layer lifts,
                  so the card can't slide out from under the cursor and flicker at its bottom edge */}
              <div className="h-full transition-transform duration-300 ease-out group-hover:-translate-y-1.5">
                {project.video ? (
                  // Opens the modal. While it's open the card stays hidden: the modal stands in for it
                  <div
                    data-project-card
                    className="h-full"
                    style={active?.id === project.id ? { visibility: "hidden" } : undefined}
                  >
                    <GlowCard className="flex flex-col h-full" glowColor="rainbow">
                      {/* Same ratio as the modal's video, so the two line up when one morphs into the other */}
                      <div
                        data-vt-media
                        className="relative overflow-hidden rounded-t-[11px]"
                        style={{ aspectRatio: project.ratio, background: gradient(project) }}
                      >
                        <ProjectVideo src={asset(project.video)} poster={asset(project.poster!)} />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm px-4 py-2 text-white text-sm font-semibold">
                            <Maximize2 size={14} />
                            {t.projects.open}
                          </span>
                        </div>
                      </div>

                      <div className="p-6 flex flex-col gap-3 flex-1">
                        {project.live && <LiveBadge label={t.projects.live} />}
                        <div data-vt-title className="w-fit">
                          <h3 className="text-white font-bold text-lg tracking-tight">{copy.title}</h3>
                        </div>
                        <p className="text-zinc-500 text-sm leading-relaxed flex-1 line-clamp-3">{copy.description}</p>
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

                      <button
                        type="button"
                        onClick={open(project.id)}
                        aria-label={`${t.projects.open}: ${copy.title}`}
                        className="absolute inset-0 z-10 rounded-xl cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
                      />
                    </GlowCard>
                  </div>
                ) : (
                  <GlowCard className="flex flex-col h-full" glowColor="rainbow">
                    <div
                      className="aspect-[2/1] relative overflow-hidden rounded-t-[11px]"
                      style={{ background: gradient(project) }}
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
                          <GitHubIcon size={16} />
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
                      <h3 className="text-white font-bold text-lg tracking-tight">{copy.title}</h3>
                      <p className="text-zinc-500 text-sm leading-relaxed flex-1">
                        {copy.description || t.projects.placeholder}
                      </p>
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
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {activeEntry &&
        createPortal(
          <ProjectModal
            project={activeEntry.project}
            copy={activeEntry.copy}
            startAt={active.startAt}
            frame={active.frame}
            settled={active.settled}
            onClose={close}
          />,
          document.body,
        )}
    </section>
  )
}
