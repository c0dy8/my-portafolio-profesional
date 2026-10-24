import { describe, it, expect } from 'vitest'
import { translations } from '@/data/translations'

describe('Translations — data integrity', () => {
  const es = translations.es
  const en = translations.en

  it('both languages exist', () => {
    expect(es).toBeDefined()
    expect(en).toBeDefined()
  })

  it('nav has all 5 links in both languages', () => {
    const keys = ['about', 'skills', 'projects', 'experience', 'contact'] as const
    keys.forEach(k => {
      expect(es.nav[k]).toBeTruthy()
      expect(en.nav[k]).toBeTruthy()
    })
  })

  it('hero has titles array with 3 items in both languages', () => {
    expect(es.hero.titles).toHaveLength(3)
    expect(en.hero.titles).toHaveLength(3)
    es.hero.titles.forEach(t => expect(t).toBeTruthy())
    en.hero.titles.forEach(t => expect(t).toBeTruthy())
  })

  it('hero titles do not mention "Ingeniero" (corrected to Enthusiast)', () => {
    expect(es.hero.titles.join(' ')).not.toContain('Ingeniero IA')
    expect(en.hero.titles.join(' ')).not.toContain('AI Engineer')
  })

  it('about section has all required keys', () => {
    const keys = ['label', 'heading', 'bio', 'status', 'contact_text', 'download_cv'] as const
    keys.forEach(k => {
      expect(es.about[k]).toBeTruthy()
      expect(en.about[k]).toBeTruthy()
    })
  })

  it('experience has 4 roles and 4 descriptions in both languages', () => {
    expect(es.experience.roles).toHaveLength(4)
    expect(en.experience.roles).toHaveLength(4)
    expect(es.experience.descriptions).toHaveLength(4)
    expect(en.experience.descriptions).toHaveLength(4)
  })

  it('experience descriptions are not empty', () => {
    es.experience.descriptions.forEach(d => expect(d.length).toBeGreaterThan(50))
    en.experience.descriptions.forEach(d => expect(d.length).toBeGreaterThan(50))
  })

  it('projects has 3 items in both languages', () => {
    expect(es.projects.items).toHaveLength(3)
    expect(en.projects.items).toHaveLength(3)
    es.projects.items.forEach((item, i) => {
      expect(item.title).toBeTruthy()
      expect(en.projects.items[i].highlights).toHaveLength(item.highlights.length)
    })
  })

  it('contact has heading and subheading in both languages', () => {
    expect(es.contact.heading).toBeTruthy()
    expect(en.contact.heading).toBeTruthy()
    expect(es.contact.subheading).toBeTruthy()
    expect(en.contact.subheading).toBeTruthy()
  })

  it('both languages have the same top-level keys', () => {
    expect(Object.keys(es).sort()).toEqual(Object.keys(en).sort())
  })
})
