import {describe, expect, it} from 'vitest'

import {buildBlogPostingJsonLd, buildOrganizationJsonLd} from './structured-data'

describe('buildBlogPostingJsonLd', () => {
  it('builds a BlogPosting with the required fields', () => {
    const ld = buildBlogPostingJsonLd({
      headline: 'Hello',
      url: 'https://example.com/blog/hello',
    })
    expect(ld['@type']).toBe('BlogPosting')
    expect(ld.headline).toBe('Hello')
    expect(ld.mainEntityOfPage).toBe('https://example.com/blog/hello')
  })

  it('includes the author when provided', () => {
    const ld = buildBlogPostingJsonLd({
      headline: 'Hi',
      url: 'https://example.com/a',
      authorName: 'Ada',
    })
    expect(ld.author).toEqual({'@type': 'Person', name: 'Ada'})
  })

  it('omits the author when absent', () => {
    const ld = buildBlogPostingJsonLd({headline: 'Hi', url: 'https://example.com/a'})
    expect(ld.author).toBeUndefined()
  })
})

describe('buildOrganizationJsonLd', () => {
  it('builds an Organization', () => {
    const ld = buildOrganizationJsonLd({name: 'Sane Kit', url: 'https://example.com'})
    expect(ld['@type']).toBe('Organization')
    expect(ld.name).toBe('Sane Kit')
  })
})
