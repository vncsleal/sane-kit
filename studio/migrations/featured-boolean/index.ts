import {at, defineMigration, set} from 'sanity/migrate'

/**
 * `blogPost.featured` was a `"true" | "false"` string (radio). It is now a
 * boolean. Idempotent: documents whose `featured` is already a boolean are
 * left untouched.
 */
export default defineMigration({
  title: 'Convert blogPost.featured from string to boolean',
  documentTypes: ['blogPost'],
  migrate: {
    document(doc) {
      const value = (doc as {featured?: unknown}).featured
      if (value !== 'true' && value !== 'false') {
        return undefined
      }
      return at('featured', set(value === 'true'))
    },
  },
})
