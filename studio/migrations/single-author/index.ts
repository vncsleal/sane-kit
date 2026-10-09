import {at, defineMigration, set, unset} from 'sanity/migrate'

/**
 * `blogPost.authors` was an array of author references. It is now a single
 * `author` reference. Idempotent: documents without an `authors` array are left
 * untouched.
 */
export default defineMigration({
  title: 'Convert blogPost.authors array to a single author reference',
  documentTypes: ['blogPost'],
  migrate: {
    document(doc) {
      const authors = (doc as {authors?: Array<{_ref?: string}>}).authors
      if (!Array.isArray(authors) || authors.length === 0) {
        return undefined
      }
      const ref = authors[0]?._ref
      if (!ref) {
        return undefined
      }
      return [at('author', set({_type: 'reference', _ref: ref})), at('authors', unset())]
    },
  },
})
