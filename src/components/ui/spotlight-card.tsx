import { useEffect, useRef, type ReactNode } from 'react'

interface GlowCardProps {
  children: ReactNode
  className?: string
  glowColor?: 'blue' | 'purple' | 'green' | 'red' | 'orange' | 'white' | 'rainbow'
}

const glowColorMap = {
  blue:    { base: 220, spread: 200 },
  purple:  { base: 280, spread: 300 },
  green:   { base: 120, spread: 200 },
  red:     { base: 0,   spread: 200 },
  orange:  { base: 30,  spread: 200 },
  white:   { base: 0,   spread: 0   },
  rainbow: { base: 0,   spread: 360 },
}

const SPOTLIGHT_SIZE = 320
// Past this distance from the card (spotlight radius + glow blur) the pointer can't light it
const REACH = SPOTLIGHT_SIZE + 40

// --x / --y are relative to the card's border box (written by GlowCard); the far-away
// fallback keeps cards dark until the pointer first moves
const beforeAfterStyles = `
  [data-glow]::before,
  [data-glow]::after {
    pointer-events: none;
    content: "";
    position: absolute;
    inset: calc(var(--border-size) * -1);
    border: var(--border-size) solid transparent;
    border-radius: calc(var(--radius) * 1px);
    background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
    background-repeat: no-repeat;
    background-position: 50% 50%;
    mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
    mask-clip: padding-box, border-box;
    mask-composite: intersect;
  }
  [data-glow]::before {
    background-image: radial-gradient(
      calc(var(--spotlight-size) * 0.75) calc(var(--spotlight-size) * 0.75) at
      calc(var(--x, -9999) * 1px + var(--glow-outset, 0px)) calc(var(--y, -9999) * 1px + var(--glow-outset, 0px)),
      hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 50) * 1%) / var(--border-spot-opacity, 1)),
      transparent 100%
    );
    filter: brightness(2);
  }
  [data-glow]::after {
    background-image: radial-gradient(
      calc(var(--spotlight-size) * 0.5) calc(var(--spotlight-size) * 0.5) at
      calc(var(--x, -9999) * 1px) calc(var(--y, -9999) * 1px),
      hsl(0 100% 100% / var(--border-light-opacity, 1)),
      transparent 100%
    );
  }
  [data-glow] [data-glow] {
    position: absolute;
    inset: 0;
    will-change: filter;
    opacity: var(--outer, 1);
    border-radius: calc(var(--radius) * 1px);
    border-width: calc(var(--border-size) * 20);
    filter: blur(calc(var(--border-size) * 10));
    background: none;
    pointer-events: none;
    border: none;
  }
  [data-glow] > [data-glow]::before {
    inset: -10px;
    border-width: 10px;
    /* This ring reaches 9px past the card: size the image to the ring and shift the spot to match */
    background-origin: border-box;
    background-size: 100% 100%;
    --glow-outset: calc(10px - var(--border-size));
  }
`

export function GlowCard({ children, className = '', glowColor = 'white' }: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return
    // Card-relative coordinates instead of background-attachment: fixed, which browsers
    // treat as `scroll` once the card or an ancestor is transformed (hover lift, entrance),
    // making the glow jump away from the cursor. At most one write per frame, and none
    // while the pointer is too far away to light this card.
    let pointerX = -1e4
    let pointerY = -1e4
    let lit = false
    let frame = 0
    const sync = () => {
      frame = 0
      const r = card.getBoundingClientRect()
      const near = pointerX > r.left - REACH && pointerX < r.right + REACH &&
        pointerY > r.top - REACH && pointerY < r.bottom + REACH
      if (!near && !lit) return
      lit = near
      card.style.setProperty('--x', (pointerX - r.left).toFixed(2))
      card.style.setProperty('--xp', (pointerX / window.innerWidth).toFixed(2))
      card.style.setProperty('--y', (pointerY - r.top).toFixed(2))
      card.style.setProperty('--yp', (pointerY / window.innerHeight).toFixed(2))
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(sync) }
    const onPointerMove = (e: PointerEvent) => {
      pointerX = e.clientX
      pointerY = e.clientY
      schedule()
    }
    document.addEventListener('pointermove', onPointerMove, { passive: true })
    // Scrolling moves the card under a still pointer
    window.addEventListener('scroll', schedule, { passive: true })
    return () => {
      document.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('scroll', schedule)
      cancelAnimationFrame(frame)
    }
  }, [])

  const { base, spread } = glowColorMap[glowColor]

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: beforeAfterStyles }} />
      <div
        ref={cardRef}
        data-glow
        className={`relative rounded-xl ${className}`}
        style={{
          '--base': base,
          '--spread': spread,
          '--radius': '12',
          '--border': '1',
          '--backdrop': 'hsl(0 0% 8% / 0.8)',
          '--backup-border': 'hsl(0 0% 100% / 0.08)',
          '--size': String(SPOTLIGHT_SIZE),
          '--outer': '1',
          '--saturation': '100',
          '--lightness': '65',
          '--bg-spot-opacity': '0.12',
          '--border-spot-opacity': '0.8',
          '--border-light-opacity': '0.3',
          '--border-size': 'calc(var(--border, 1) * 1px)',
          '--spotlight-size': 'calc(var(--size, 200) * 1px)',
          '--hue': 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))',
          backgroundImage: `radial-gradient(
            var(--spotlight-size) var(--spotlight-size) at
            calc(var(--x, -9999) * 1px) calc(var(--y, -9999) * 1px),
            hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 65) * 1%) / var(--bg-spot-opacity, 0.12)),
            transparent
          )`,
          backgroundColor: 'var(--backdrop)',
          backgroundSize: 'calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))',
          backgroundPosition: '50% 50%',
          border: 'var(--border-size) solid var(--backup-border)',
        } as React.CSSProperties}
      >
        <div data-glow />
        {children}
      </div>
    </>
  )
}
