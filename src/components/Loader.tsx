import { startTransition, useRef, useState, type ReactNode } from "react"
import { gsap } from "gsap"
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin"
import { useGSAP } from "@gsap/react"
import { useLanguage } from "@/context/LanguageContext"
import { IntroContext } from "@/context/intro"

gsap.registerPlugin(useGSAP, DrawSVGPlugin)

const NAME = "Briam Vanegas"
const GRAY = "#3f3f46" // zinc-700
const LIGHT = "#f4f4f5" // zinc-100

// Round-capped strokes in a 1000×1000 box scaled with "slice" (like object-fit: cover).
// Gray ribbons wind and cross each other (a zigzag, a loop, a wave) and leave gaps;
// the light ones fold into S-curves that together cover the whole box. Every endpoint
// sits further off-screen than half its stroke width, so the caps never peek in at rest.
const RIBBONS = {
  gray: [
    { d: "M-260 1250C-198 1132 28 708 110 540C192 372 190 275 230 240C270 205 315 253 350 330C385 407 410 623 440 700C470 777 502 820 530 790C558 760 592 622 610 520C628 418 625 320 640 180C655 40 690 -237 700 -320", w: 230 },
    { d: "M1350 1150C1285 1108 1052 970 960 900C868 830 860 797 800 730C740 663 607 578 600 500C593 423 696 270 760 265C824 260 968 397 985 470C1002 543 916 637 860 705C804 773 727 773 650 880C573 988 442 1272 400 1350", w: 210 },
    { d: "M-330 330C-265 300 -38 198 60 150C158 102 195 40 260 40C325 40 393 107 450 150C507 193 548 305 600 300C652 295 713 187 760 120C807 53 823 -25 880 -100C937 -175 1063 -292 1100 -330", w: 230 },
  ],
  light: [
    { d: "M-320 1000C-225 983 80 916 250 900C420 884 578 917 700 905C823 893 947 878 985 830C1023 783 994 668 930 620C866 573 713 548 600 545C487 542 410 589 250 600C90 611 -258 608 -360 610", w: 400 },
    { d: "M-220 1360C-142 1272 127 977 250 830C373 683 428 585 520 480C612 375 660 298 800 200C940 102 1267 -58 1360 -110", w: 420 },
    { d: "M-330 400C-225 390 128 343 300 340C472 338 594 399 700 385C806 371 932 308 935 255C938 203 826 106 720 70C614 34 480 50 300 40C120 30 -250 15 -360 10", w: 380 },
  ],
}

// Upper bound for holding the cover while fonts and images finish loading.
const MAX_WAIT_MS = 3000

function whenAssetsReady() {
  const loaded =
    document.readyState === "complete"
      ? Promise.resolve()
      : new Promise<void>((resolve) => window.addEventListener("load", () => resolve(), { once: true }))
  return Promise.race([
    Promise.all([document.fonts.ready, loaded]),
    new Promise((resolve) => setTimeout(resolve, MAX_WAIT_MS)),
  ])
}

/**
 * Plays the intro over `children` and tells them through `useIntroRevealed()` when the
 * page starts to show. The state lives here, not in App, so revealing and unmounting
 * only re-render the components that read it, never the whole page mid-animation.
 * Both updates are transitions so React renders them in slices between frames.
 */
export function IntroLoader({ children }: { children: ReactNode }) {
  const [revealed, setRevealed] = useState(false)
  const [done, setDone] = useState(false)

  return (
    <IntroContext.Provider value={revealed}>
      {!done && (
        <Loader
          onReveal={() => startTransition(() => setRevealed(true))}
          onComplete={() => startTransition(() => setDone(true))}
        />
      )}
      {children}
    </IntroContext.Provider>
  )
}

interface LoaderProps {
  /** The ribbons start uncovering the page. */
  onReveal: () => void
  /** The page is fully uncovered; the loader can unmount. */
  onComplete: () => void
}

function Loader({ onReveal, onComplete }: LoaderProps) {
  const { t } = useLanguage()
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const html = document.documentElement
      html.style.overflow = "hidden"
      const unlockScroll = () => {
        html.style.overflow = ""
      }

      let cancelled = false
      let ready = false
      let waiting = false

      const tl = gsap.timeline({ onComplete })
      const holdUntilReady = () => {
        if (!ready) {
          waiting = true
          tl.pause()
        }
      }
      const reveal = () => {
        unlockScroll()
        onReveal()
      }

      whenAssetsReady().then(() => {
        if (cancelled) return
        ready = true
        if (waiting) tl.play()
      })

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        // Ribbons stay fully drawn: a static cover that simply fades away.
        tl.call(holdUntilReady, undefined, 0.8)
          .call(reveal)
          .to(root.current, { autoAlpha: 0, duration: 0.5, ease: "power1.out" })
      } else {
        const gray = gsap.utils.toArray<SVGPathElement>(".ribbon-gray")
        const light = gsap.utils.toArray<SVGPathElement>(".ribbon-light")
        const chars = gsap.utils.toArray<HTMLElement>(".loader-char")

        tl.fromTo(gray, { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 1.1, ease: "power2.inOut", stagger: 0.14 })
          .fromTo(light, { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 1.2, ease: "power2.inOut", stagger: 0.24 }, 0.45)
          // The light layer now hides everything, so the backdrop can go: the exit reveals the page.
          .set(root.current, { backgroundColor: "transparent" })
          .from(".loader-tag", { autoAlpha: 0, y: 12, duration: 0.6, ease: "power2.out" }, 1.4)
          .from(chars, { yPercent: 115, rotate: 8, duration: 0.9, ease: "power4.out", stagger: 0.035 }, 1.2)
          .addLabel("out", 2.45)
          .call(holdUntilReady, undefined, "out")
          .to(chars, { yPercent: -115, duration: 0.4, ease: "power3.in", stagger: 0.01 }, "out")
          .to(".loader-tag", { autoAlpha: 0, duration: 0.3 }, "out")
          // Ribbons leave along their own curves: the tails chase the heads off-screen.
          // A gentle sine ease keeps their speed even while they cross the screen.
          .to(light, { drawSVG: "100% 100%", duration: 1.45, ease: "sine.inOut", stagger: 0.1 }, "out+=0.1")
          .to(gray, { drawSVG: "100% 100%", duration: 1.45, ease: "sine.inOut", stagger: 0.1 }, "out+=0.25")
          .set(root.current, { pointerEvents: "none" }, "out+=0.4")
          .call(reveal, undefined, "out+=0.5")
      }

      return () => {
        cancelled = true
        unlockScroll()
      }
    },
    { scope: root }
  )

  return (
    <div ref={root} aria-hidden="true" className="fixed inset-0 z-[100] overflow-hidden bg-black">
      <svg
        className="absolute inset-0 h-full w-full will-change-transform"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {RIBBONS.gray.map(({ d, w }) => (
          <path key={d} className="ribbon-gray" d={d} stroke={GRAY} strokeWidth={w} strokeLinecap="round" />
        ))}
        {RIBBONS.light.map(({ d, w }) => (
          <path key={d} className="ribbon-light" d={d} stroke={LIGHT} strokeWidth={w} strokeLinecap="round" />
        ))}
      </svg>

      <div className="absolute inset-x-0 bottom-0 px-6 pb-8 will-change-transform sm:px-10 sm:pb-10 md:px-14 md:pb-14">
        <p className="loader-tag mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500 sm:text-xs">
          {"// "}{t.hero.titles[0]}
        </p>
        <p className="font-['Space_Grotesk',sans-serif] text-[clamp(3.25rem,12vw,10rem)] font-bold leading-[0.85] tracking-[-0.04em] text-[#09090b]">
          {NAME.split(" ").map((word) => (
            <span key={word} className="mr-[0.22em] inline-block overflow-hidden pb-[0.16em] align-top last:mr-0">
              {[...word].map((char, i) => (
                <span key={i} className="loader-char inline-block origin-bottom-left">
                  {char}
                </span>
              ))}
            </span>
          ))}
        </p>
      </div>
    </div>
  )
}
