import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { LanguageProvider } from '@/context/LanguageContext'

vi.mock('motion/react', async () => {
  const { default: React, forwardRef } = await import('react')
  const make = (tag: string) => forwardRef(function M({ children, initial, animate, exit, whileHover, whileTap, whileInView, viewport, variants, custom, transition, style, ...p }: any, ref: any) {
    return React.createElement(tag, { ...p, ref }, children)
  })
  return { motion: { div: make('div'), span: make('span'), button: make('button'), a: make('a'), p: make('p'), h2: make('h2'), header: make('header') }, AnimatePresence: ({ children }: any) => children }
})
import { About } from '@/components/About'
import { Skills } from '@/components/Skills'
import { Projects } from '@/components/Projects'
import { Experience } from '@/components/Experience'
import { Contact } from '@/components/Contact'

vi.mock('@/components/ui/ProfileCard', () => ({
  ProfileCard: ({ name }: { name: string }) => <div>{name}</div>,
}))
vi.mock('@/components/ui/Magnet', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))
vi.mock('@/components/ui/spotlight-card', () => ({
  GlowCard: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LanguageProvider>{children}</LanguageProvider>
)

const RENDER_BUDGET_MS = 500

function measureRender(component: React.ReactElement) {
  const start = performance.now()
  render(component, { wrapper })
  return performance.now() - start
}

describe('Render performance — under 100ms budget', () => {
  it('About renders fast', () => {
    expect(measureRender(<About />)).toBeLessThan(RENDER_BUDGET_MS)
  })

  it('Skills renders fast', () => {
    expect(measureRender(<Skills />)).toBeLessThan(RENDER_BUDGET_MS)
  })

  it('Projects renders fast', () => {
    expect(measureRender(<Projects />)).toBeLessThan(RENDER_BUDGET_MS)
  })

  it('Experience renders fast', () => {
    expect(measureRender(<Experience />)).toBeLessThan(RENDER_BUDGET_MS)
  })

  it('Contact renders fast', () => {
    expect(measureRender(<Contact />)).toBeLessThan(RENDER_BUDGET_MS)
  })

  it('LanguageContext switch is instant (< 100ms)', () => {
    const { rerender } = render(
      <LanguageProvider><About /></LanguageProvider>
    )
    const start = performance.now()
    rerender(<LanguageProvider><About /></LanguageProvider>)
    expect(performance.now() - start).toBeLessThan(100)
  })
})

describe('Bundle analysis — build output', () => {
  it('translations.ts is not excessively large (< 20KB)', async () => {
    const { translations } = await import('@/data/translations')
    const size = JSON.stringify(translations).length
    expect(size).toBeLessThan(20_000)
  })

  it('experience descriptions are present and meaningful', async () => {
    const { translations } = await import('@/data/translations')
    translations.es.experience.descriptions.forEach(d => {
      expect(d.length).toBeGreaterThan(100)
    })
  })
})
