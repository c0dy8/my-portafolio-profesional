import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LanguageProvider } from '@/context/LanguageContext'

vi.mock('motion/react', async () => {
  const { default: React, forwardRef } = await import('react')
  const make = (tag: string) => forwardRef(function M({ children, initial, animate, exit, whileHover, whileTap, whileInView, viewport, variants, custom, transition, style, ...p }: any, ref: any) {
    return React.createElement(tag, { ...p, ref }, children)
  })
  return { motion: { div: make('div'), span: make('span'), button: make('button'), a: make('a'), p: make('p'), h2: make('h2'), header: make('header') }, AnimatePresence: ({ children }: any) => children }
})
import { Navbar } from '@/components/Navbar'
import { About } from '@/components/About'
import { Skills } from '@/components/Skills'
import { Projects } from '@/components/Projects'
import { Experience } from '@/components/Experience'
import { Contact } from '@/components/Contact'

// Mock heavy canvas/animation components
vi.mock('@/components/ui/DotGrid', () => ({
  default: () => <div data-testid="dotgrid-mock" />,
}))
vi.mock('@/components/ui/magic-text-reveal', () => ({
  MagicTextReveal: ({ text }: { text: string }) => <span>{text}</span>,
}))
vi.mock('@/components/ui/ProfileCard', () => ({
  ProfileCard: ({ name, handle }: { name: string; handle: string }) => (
    <div data-testid="profile-card">{name} @{handle}</div>
  ),
}))
vi.mock('@/components/ui/Magnet', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))
vi.mock('@/components/ui/spotlight-card', () => ({
  GlowCard: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
}))

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LanguageProvider>{children}</LanguageProvider>
)

describe('Navbar', () => {
  it('renders logo "BV"', () => {
    render(<Navbar />, { wrapper })
    expect(screen.getByText('BV')).toBeInTheDocument()
  })

  it('renders all 5 nav links in desktop menu', () => {
    render(<Navbar />, { wrapper })
    expect(screen.getAllByText('Acerca de').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Habilidades').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Proyectos').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Experiencia').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Contacto').length).toBeGreaterThan(0)
  })
})

describe('About', () => {
  it('renders "Briam" name', () => {
    render(<About />, { wrapper })
    expect(screen.getByText('Briam')).toBeInTheDocument()
  })

  it('renders download CV button', () => {
    render(<About />, { wrapper })
    const link = screen.getByText(/Descargar CV/i).closest('a')
    expect(link).toHaveAttribute('href', '/CV.pdf')
    expect(link).toHaveAttribute('download', 'CV-Briam-Vanegas.pdf')
  })

  it('renders profile card with handle @bsvanegas', () => {
    render(<About />, { wrapper })
    expect(screen.getByText(/bsvanegas/i)).toBeInTheDocument()
  })
})

describe('Skills', () => {
  it('renders section heading', () => {
    render(<Skills />, { wrapper })
    expect(screen.getByText('Stack técnico')).toBeInTheDocument()
  })

  it('renders Python skill badge', () => {
    render(<Skills />, { wrapper })
    expect(screen.getAllByText('Python').length).toBeGreaterThan(0)
  })

  it('renders LangChain skill badge', () => {
    render(<Skills />, { wrapper })
    expect(screen.getAllByText('LangChain').length).toBeGreaterThan(0)
  })
})

describe('Projects', () => {
  it('renders 3 project cards', () => {
    render(<Projects />, { wrapper })
    expect(screen.getByText('Proyecto 01')).toBeInTheDocument()
    expect(screen.getByText('Proyecto 02')).toBeInTheDocument()
    expect(screen.getByText('Proyecto 03')).toBeInTheDocument()
  })

  it('renders section heading', () => {
    render(<Projects />, { wrapper })
    expect(screen.getByText('Proyectos')).toBeInTheDocument()
  })
})

describe('Experience', () => {
  it('renders all 3 companies', () => {
    render(<Experience />, { wrapper })
    expect(screen.getByText('Aeropay')).toBeInTheDocument()
    expect(screen.getByText('Miso Robotics')).toBeInTheDocument()
    expect(screen.getByText('Teleperformance')).toBeInTheDocument()
  })

  it('renders section heading', () => {
    render(<Experience />, { wrapper })
    expect(screen.getByText('Experiencia')).toBeInTheDocument()
  })

  it('shows "Present" in first job period', () => {
    render(<Experience />, { wrapper })
    expect(screen.getByText('2025 — Present')).toBeInTheDocument()
  })

  it('renders job roles from translations', () => {
    render(<Experience />, { wrapper })
    expect(screen.getByText('Especialista de Soporte & Automatización')).toBeInTheDocument()
  })
})

describe('Contact', () => {
  it('renders Email, GitHub, LinkedIn links', () => {
    render(<Contact />, { wrapper })
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('GitHub')).toBeInTheDocument()
    expect(screen.getByText('LinkedIn')).toBeInTheDocument()
  })

  it('email link points to correct address', () => {
    render(<Contact />, { wrapper })
    const emailLink = screen.getByText('Email').closest('a')
    expect(emailLink).toHaveAttribute('href', 'mailto:santigovanegas11@gmail.com')
  })

  it('GitHub link points to correct profile', () => {
    render(<Contact />, { wrapper })
    const githubLink = screen.getByText('GitHub').closest('a')
    expect(githubLink).toHaveAttribute('href', 'https://github.com/c0dy8')
  })

  it('renders footer copyright', () => {
    render(<Contact />, { wrapper })
    expect(screen.getByText(/2025 Briam Vanegas/)).toBeInTheDocument()
  })
})
