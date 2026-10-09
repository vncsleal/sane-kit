import {describe, expect, it} from 'vitest'

import {cn} from './utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('lets the last conflicting tailwind class win', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })

  it('ignores falsy values', () => {
    expect(cn('a', false, undefined, null, 'c')).toBe('a c')
  })

  it('supports conditional objects', () => {
    expect(cn('a', {b: true, c: false})).toBe('a b')
  })
})
