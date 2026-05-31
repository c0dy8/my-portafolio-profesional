import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LanguageProvider, useLanguage } from '@/context/LanguageContext'

function LangDisplay() {
  const { lang, setLang, t } = useLanguage()
  return (
    <div>
      <span data-testid="lang">{lang}</span>
      <span data-testid="about-label">{t.about.label}</span>
      <span data-testid="nav-about">{t.nav.about}</span>
      <button onClick={() => setLang('en')}>EN</button>
      <button onClick={() => setLang('es')}>ES</button>
    </div>
  )
}

describe('LanguageContext', () => {
  it('defaults to Spanish', () => {
    render(<LanguageProvider><LangDisplay /></LanguageProvider>)
    expect(screen.getByTestId('lang')).toHaveTextContent('es')
  })

  it('shows Spanish translations by default', () => {
    render(<LanguageProvider><LangDisplay /></LanguageProvider>)
    expect(screen.getByTestId('about-label')).toHaveTextContent('// sobre mí')
    expect(screen.getByTestId('nav-about')).toHaveTextContent('Acerca de')
  })

  it('switches to English when setLang("en") is called', () => {
    render(<LanguageProvider><LangDisplay /></LanguageProvider>)
    fireEvent.click(screen.getByText('EN'))
    expect(screen.getByTestId('lang')).toHaveTextContent('en')
    expect(screen.getByTestId('about-label')).toHaveTextContent('// about')
    expect(screen.getByTestId('nav-about')).toHaveTextContent('About')
  })

  it('switches back to Spanish from English', () => {
    render(<LanguageProvider><LangDisplay /></LanguageProvider>)
    fireEvent.click(screen.getByText('EN'))
    fireEvent.click(screen.getByText('ES'))
    expect(screen.getByTestId('lang')).toHaveTextContent('es')
    expect(screen.getByTestId('about-label')).toHaveTextContent('// sobre mí')
  })

  it('t object updates reactively when language changes', () => {
    render(<LanguageProvider><LangDisplay /></LanguageProvider>)
    expect(screen.getByTestId('nav-about')).toHaveTextContent('Acerca de')
    fireEvent.click(screen.getByText('EN'))
    expect(screen.getByTestId('nav-about')).toHaveTextContent('About')
  })
})
