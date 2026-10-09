import {describe, expect, it} from 'vitest'

import {i18n, hasLocale} from './i18n-config'

describe('hasLocale', () => {
  it('accepts supported locales', () => {
    expect(hasLocale('en')).toBe(true)
    expect(hasLocale('pt-BR')).toBe(true)
  })

  it('rejects unsupported values', () => {
    expect(hasLocale('fr')).toBe(false)
    expect(hasLocale('')).toBe(false)
    expect(hasLocale('EN')).toBe(false)
  })

  it('treats the default locale as supported', () => {
    expect(hasLocale(i18n.defaultLocale)).toBe(true)
  })
})
