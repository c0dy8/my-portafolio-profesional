import { describe, it, expect } from 'vitest'
import { projects, experience, contact } from '@/data/portfolio'

describe('Portfolio data — structure', () => {
  describe('projects', () => {
    it('has exactly 3 projects', () => {
      expect(projects).toHaveLength(3)
    })

    it('each project has required fields', () => {
      projects.forEach(p => {
        expect(p.id).toBeGreaterThan(0)
        expect(p.tags).toBeInstanceOf(Array)
        expect(p.tags.length).toBeGreaterThan(0)
        expect(p.github).toBeTruthy()
        expect(p.demo).toBeTruthy()
        expect(p.from).toMatch(/^#/)
        expect(p.to).toMatch(/^#/)
      })
    })

    it('project IDs are unique', () => {
      const ids = projects.map(p => p.id)
      expect(new Set(ids).size).toBe(ids.length)
    })
  })

  describe('experience', () => {
    it('has exactly 3 entries', () => {
      expect(experience).toHaveLength(4)
    })

    it('each entry has company and period', () => {
      experience.forEach(e => {
        expect(e.company).toBeTruthy()
        expect(e.period).toBeTruthy()
        expect(e.period).toMatch(/\d{4}/)
      })
    })

    it('companies are Isagen, Aeropay, Miso Robotics, Teleperformance', () => {
      const companies = experience.map(e => e.company)
      expect(companies).toContain('Isagen')
      expect(companies).toContain('Aeropay')
      expect(companies).toContain('Miso Robotics')
      expect(companies).toContain('Teleperformance')
    })

    it('most recent job is first and the only current one', () => {
      expect(experience[0].company).toBe('Isagen')
      expect(experience[0].period).toContain('Present')
      expect(experience.filter(e => e.period.includes('Present'))).toHaveLength(1)
    })
  })

  describe('contact', () => {
    it('has valid email', () => {
      expect(contact.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    })

    it('has valid GitHub URL', () => {
      expect(contact.github).toContain('github.com')
    })

    it('has valid LinkedIn URL', () => {
      expect(contact.linkedin).toContain('linkedin.com')
    })
  })
})
