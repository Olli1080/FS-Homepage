import { describe, it, expect } from 'vitest'
import { determineLanguage } from './util'

describe('determineLanguage', () => {
  it('should return "en" for /en paths', () => {
    expect(determineLanguage('/en')).toBe('en')
    expect(determineLanguage('/en/some-page')).toBe('en')
  })

  it('should return "de" for root path', () => {
    expect(determineLanguage('/')).toBe('de')
  })

  it('should return "de" for paths without language prefix', () => {
    expect(determineLanguage('/vertreter')).toBe('de')
  })

  it('should return "de" for unsupported languages', () => {
    expect(determineLanguage('/fr/some-page')).toBe('de')
  })
})
