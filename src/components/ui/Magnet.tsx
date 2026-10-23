import { useEffect, useRef, type ReactNode } from 'react'

interface MagnetProps {
  children: ReactNode
  /** How far (px) past the element's edges the pull reaches. It fades out smoothly toward that edge. */
  padding?: number
  disabled?: boolean
  /** Higher is weaker: near the element the content moves 1/magnetStrength of the cursor's offset. */
  magnetStrength?: number
  wrapperClassName?: string
  innerClassName?: string
}

interface Axis {
  pos: number
  vel: number
}

// Natural frequency (rad/s) of the critically damped spring that chases the pull target: it eases in and
// out and keeps its momentum when the target moves, so the follow never stops dead or snaps. Higher = snappier.
const SPRING = 14
// Share of the padding where the pull stays at full strength before it starts fading out.
const HOLD = 1 / 3

const smoothstep = (t: number) => t * t * (3 - 2 * t)

// Advances the spring toward `to` by dt seconds. Exact solution, so it is stable at any frame rate.
const advance = (axis: Axis, to: number, dt: number) => {
  const offset = axis.pos - to
  const decay = Math.exp(-SPRING * dt)
  const drift = (axis.vel + SPRING * offset) * dt
  axis.pos = to + (offset + drift) * decay
  axis.vel = (axis.vel - SPRING * drift) * decay
}

const isSettled = (axis: Axis, to: number) => Math.abs(axis.pos - to) < 0.01 && Math.abs(axis.vel) < 0.5

const Magnet = ({
  children,
  padding = 100,
  disabled = false,
  magnetStrength = 2,
  wrapperClassName = '',
  innerClassName = '',
}: MagnetProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  // Spring state and last cursor position outlive the effect, so a prop change doesn't make it jump.
  const spring = useRef({ x: { pos: 0, vel: 0 }, y: { pos: 0, vel: 0 } })
  const pointer = useRef<{ x: number; y: number } | null>(null)

  // The transform is written straight to the DOM from a rAF loop: no React state per mousemove, and
  // the loop only runs while the spring is moving.
  useEffect(() => {
    const wrapper = wrapperRef.current
    const inner = innerRef.current
    if (!wrapper || !inner) return

    const { x, y } = spring.current
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let last = 0

    const tick = (now: number) => {
      // Target: the cursor's offset from the center scaled down, faded out by the cursor's distance
      // from the element's box, so the pull is continuous with no edge where it snaps back.
      let tx = 0
      let ty = 0
      const cursor = pointer.current
      if (cursor && !disabled && !reducedMotion.matches) {
        const { left, top, width, height } = wrapper.getBoundingClientRect()
        const dx = cursor.x - (left + width / 2)
        const dy = cursor.y - (top + height / 2)
        const gap = Math.hypot(Math.max(Math.abs(dx) - width / 2, 0), Math.max(Math.abs(dy) - height / 2, 0))
        const fade = Math.min(Math.max((gap - padding * HOLD) / (padding * (1 - HOLD)), 0), 1)
        const pull = (1 - smoothstep(fade)) / magnetStrength
        tx = dx * pull
        ty = dy * pull
      }

      // Clamp dt so a background tab or a long frame resumes smoothly
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 1 / 60
      advance(x, tx, dt)
      advance(y, ty, dt)
      const settled = isSettled(x, tx) && isSettled(y, ty)
      if (settled) {
        x.pos = tx
        y.pos = ty
        x.vel = y.vel = 0
      }
      inner.style.transform = `translate3d(${x.pos}px, ${y.pos}px, 0)`
      last = settled ? 0 : now
      frame = settled ? 0 : requestAnimationFrame(tick)
    }

    const wake = () => {
      if (!frame) frame = requestAnimationFrame(tick)
    }

    const handlePointerMove = (e: PointerEvent) => {
      // Touch has no hover, so a tap shouldn't leave the content pulled toward the finger
      pointer.current = e.pointerType === 'touch' ? null : { x: e.clientX, y: e.clientY }
      wake()
    }

    // relatedTarget is null when the cursor leaves the window: let go instead of staying pulled
    const handlePointerOut = (e: PointerEvent) => {
      if (e.relatedTarget) return
      pointer.current = null
      wake()
    }

    if (disabled) {
      pointer.current = null
    } else {
      window.addEventListener('pointermove', handlePointerMove, { passive: true })
      document.addEventListener('pointerout', handlePointerOut)
    }
    // Re-aim at the current target, e.g. glide back home when it gets disabled
    wake()

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerout', handlePointerOut)
    }
  }, [padding, disabled, magnetStrength])

  return (
    <div
      ref={wrapperRef}
      className={wrapperClassName}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <div ref={innerRef} className={innerClassName} style={{ willChange: 'transform' }}>
        {children}
      </div>
    </div>
  )
}

export default Magnet
