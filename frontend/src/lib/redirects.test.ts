import { describe, expect, it } from 'vitest'

import { toNextRedirect } from './redirects'

describe('toNextRedirect', () => {
  it('defaults to a permanent redirect', () => {
    expect(toNextRedirect({ source: '/a', destination: '/b' })).toEqual({
      source: '/a',
      destination: '/b',
      permanent: true,
    })
  })

  it('maps an explicit temporary redirect', () => {
    expect(toNextRedirect({ source: '/a', destination: '/b', permanent: 'false' }).permanent).toBe(
      false,
    )
  })

  it('treats "true" as permanent', () => {
    expect(toNextRedirect({ source: '/a', destination: '/b', permanent: 'true' }).permanent).toBe(
      true,
    )
  })
})
