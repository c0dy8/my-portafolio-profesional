import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { isCVRequest, CV_KEYWORDS } from '@/components/ChatBot'
import { ChatBot } from '@/components/ChatBot'
import { LanguageProvider } from '@/context/LanguageContext'

vi.mock('motion/react', async () => {
  const { default: React, forwardRef } = await import('react')
  const make = (tag: string) => forwardRef(function M({ children, initial, animate, exit, whileHover, whileTap, whileInView, viewport, variants, custom, transition, style, ...p }: any, ref: any) {
    return React.createElement(tag, { ...p, ref }, children)
  })
  return { motion: { div: make('div'), span: make('span'), button: make('button'), a: make('a'), p: make('p'), h2: make('h2'), header: make('header') }, AnimatePresence: ({ children }: any) => children }
})

vi.mock('@/components/ui/Magnet', async () => {
  const { default: React } = await import('react')
  return { default: ({ children }: { children: React.ReactNode }) => React.createElement('div', null, children) }
})

// Mock fetch for OpenAI streaming
const mockFetch = vi.fn()
global.fetch = mockFetch

function makeSseResponse(chunks: string[]) {
  const lines = chunks.map(c =>
    `data: ${JSON.stringify({ choices: [{ delta: { content: c } }] })}\n\n`
  )
  lines.push('data: [DONE]\n\n')
  const encoded = new TextEncoder().encode(lines.join(''))
  let sent = false
  return {
    ok: true,
    body: {
      getReader: () => ({
        read: vi.fn(() => {
          if (sent) return Promise.resolve({ done: true, value: undefined })
          sent = true
          return Promise.resolve({ done: false, value: encoded })
        }),
      }),
    },
  }
}

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LanguageProvider>{children}</LanguageProvider>
)

// ── isCVRequest ──────────────────────────────────────────────────────────────

describe('isCVRequest — CV keyword detection', () => {
  it('detects "cv" keyword', () => {
    expect(isCVRequest('quiero el cv')).toBe(true)
    expect(isCVRequest('send me your CV')).toBe(true)
  })

  it('detects "hoja de vida"', () => {
    expect(isCVRequest('me puedes dar tu hoja de vida')).toBe(true)
  })

  it('detects "resume"', () => {
    expect(isCVRequest('can I see your resume?')).toBe(true)
  })

  it('detects "curriculum" and "currículum"', () => {
    expect(isCVRequest('manda el curriculum')).toBe(true)
    expect(isCVRequest('quiero el currículum')).toBe(true)
  })

  it('detects "generate" variants', () => {
    expect(isCVRequest('generate the cv')).toBe(true)
    expect(isCVRequest('genera el cv')).toBe(true)
    expect(isCVRequest('generar cv')).toBe(true)
  })

  it('returns false for unrelated messages', () => {
    expect(isCVRequest('what are your skills?')).toBe(false)
    expect(isCVRequest('where are you from?')).toBe(false)
    expect(isCVRequest('tell me about your experience')).toBe(false)
    expect(isCVRequest('')).toBe(false)
  })

  it('is case-insensitive', () => {
    expect(isCVRequest('CV')).toBe(true)
    expect(isCVRequest('RESUME')).toBe(true)
    expect(isCVRequest('Curriculum')).toBe(true)
  })

  it('CV_KEYWORDS contains all expected keywords', () => {
    expect(CV_KEYWORDS).toContain('cv')
    expect(CV_KEYWORDS).toContain('resume')
    expect(CV_KEYWORDS).toContain('hoja de vida')
    expect(CV_KEYWORDS).toContain('curriculum')
  })
})

// ── ChatBot component ────────────────────────────────────────────────────────

describe('ChatBot component', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('renders the chat bubble button', () => {
    render(<ChatBot />, { wrapper })
    expect(screen.getByLabelText('Abrir chat IA')).toBeInTheDocument()
  })

  it('chat panel is hidden on initial render', () => {
    render(<ChatBot />, { wrapper })
    expect(screen.queryByText('Portfolio AI')).not.toBeInTheDocument()
  })

  it('opens chat panel when bubble is clicked', async () => {
    render(<ChatBot />, { wrapper })
    await userEvent.click(screen.getByLabelText('Abrir chat IA'))
    expect(await screen.findByText('Portfolio AI')).toBeInTheDocument()
  })

  it('shows initial greeting message when opened', async () => {
    render(<ChatBot />, { wrapper })
    await userEvent.click(screen.getByLabelText('Abrir chat IA'))
    expect(await screen.findByText(/Hola.*asistente/i)).toBeInTheDocument()
  })

  it('closes chat panel when bubble is clicked again', async () => {
    render(<ChatBot />, { wrapper })
    const bubble = screen.getByLabelText('Abrir chat IA')
    fireEvent.click(bubble)
    await screen.findByText('Portfolio AI')
    fireEvent.click(bubble)
    await waitFor(() => {
      expect(screen.queryByText('Portfolio AI')).not.toBeInTheDocument()
    })
  })

  it('input field is present and accepts text', async () => {
    render(<ChatBot />, { wrapper })
    fireEvent.click(screen.getByLabelText('Abrir chat IA'))
    await screen.findByText('Portfolio AI')
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'hola')
    expect(input).toHaveValue('hola')
  })

  it('sends a message and shows assistant response', async () => {
    mockFetch.mockResolvedValueOnce(makeSseResponse(['Hola, soy el asistente de Briam.']))
    render(<ChatBot />, { wrapper })
    fireEvent.click(screen.getByLabelText('Abrir chat IA'))
    await screen.findByText('Portfolio AI')
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'hola')
    fireEvent.keyDown(input, { key: 'Enter' })
    fireEvent.keyUp(input, { key: 'Enter' })
    await waitFor(() => {
      expect(screen.getByText('hola')).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.getByText('Hola, soy el asistente de Briam.')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('shows CV download button when CV is requested', async () => {
    mockFetch.mockResolvedValueOnce(makeSseResponse(['¡Claro! Aquí tienes el CV 👇']))
    render(<ChatBot />, { wrapper })
    fireEvent.click(screen.getByLabelText('Abrir chat IA'))
    await screen.findByText('Portfolio AI')
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'quiero el cv')
    fireEvent.keyDown(input, { key: 'Enter' })
    await waitFor(() => {
      expect(screen.getByText(/Descargar CV/i)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('CV download button has correct href', async () => {
    mockFetch.mockResolvedValueOnce(makeSseResponse(['Aquí el CV']))
    render(<ChatBot />, { wrapper })
    fireEvent.click(screen.getByLabelText('Abrir chat IA'))
    await screen.findByText('Portfolio AI')
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'dame el cv')
    fireEvent.keyDown(input, { key: 'Enter' })
    await waitFor(() => {
      const link = screen.getByText(/Descargar CV/i).closest('a')
      expect(link).toHaveAttribute('href', '/CV.pdf')
      expect(link).toHaveAttribute('download', 'CV-Briam-Vanegas.pdf')
    }, { timeout: 3000 })
  })

  it('enforces 5-message rate limit', async () => {
    render(<ChatBot />, { wrapper })
    fireEvent.click(screen.getByLabelText('Abrir chat IA'))
    await screen.findByText('Portfolio AI')

    for (let i = 0; i < 5; i++) {
      mockFetch.mockResolvedValueOnce(makeSseResponse([`Respuesta ${i + 1}`]))
      const input = screen.getByRole('textbox')
      await userEvent.clear(input)
      await userEvent.type(input, `mensaje ${i + 1}`)
      fireEvent.keyDown(input, { key: 'Enter' })
      await waitFor(() => {
        expect(screen.getByText(`Respuesta ${i + 1}`)).toBeInTheDocument()
      }, { timeout: 3000 })
    }

    await waitFor(() => {
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
      expect(screen.getByText(/Límite de 5 preguntas/i)).toBeInTheDocument()
    })
  })

  it('shows error message when fetch fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))
    render(<ChatBot />, { wrapper })
    fireEvent.click(screen.getByLabelText('Abrir chat IA'))
    await screen.findByText('Portfolio AI')
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'hola')
    fireEvent.keyDown(input, { key: 'Enter' })
    await waitFor(() => {
      expect(screen.getByText(/hubo un error/i)).toBeInTheDocument()
    }, { timeout: 3000 })
  })
})
