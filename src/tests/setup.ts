import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock CSS imports (ProfileCard.css, DotGrid.css)
vi.mock('@/components/ui/ProfileCard.css', () => ({}))
vi.mock('@/components/ui/DotGrid.css', () => ({}))

// Mock GSAP (used in DotGrid)
vi.mock('gsap', () => ({ gsap: {}, default: {} }))
vi.mock('gsap/InertiaPlugin', () => ({ InertiaPlugin: {} }))

// Mock canvas API
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  fillText: vi.fn(),
  getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4) })),
  measureText: vi.fn(() => ({ width: 100, actualBoundingBoxAscent: 10, actualBoundingBoxDescent: 2 })),
  save: vi.fn(),
  restore: vi.fn(),
  scale: vi.fn(),
  imageSmoothingEnabled: true,
  textAlign: '',
  textBaseline: '',
  font: '',
  fillStyle: '',
})) as unknown as typeof HTMLCanvasElement.prototype.getContext

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock scrollIntoView (not implemented in jsdom)
Element.prototype.scrollIntoView = vi.fn()

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
