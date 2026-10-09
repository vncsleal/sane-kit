import {at, defineMigration, set} from 'sanity/migrate'

/**
 * Converts the remaining string-boolean (`"true"`/`"false"`) fields to real
 * booleans, wherever they appear — page-builder sections, portable-text blocks
 * and annotations, and the `redirect` document. Idempotent: values that are
 * already booleans are left untouched.
 */

const BOOLEAN_FIELDS = new Set([
  // page-builder sections
  'showFeaturedPostLarge',
  'featuredPostsOnly',
  'viewAllButton',
  'highlighted',
  'showDate',
  'showFirstName',
  'showLastName',
  'showFileUpload',
  'autoplay',
  'loop',
  'muted',
  // portable text
  'showLineNumbers',
  'blank',
  // blogPage
  'showOnlyFeaturedPosts',
  // redirect
  'permanent',
])

type Patch = {path: string; value: boolean}

function collect(node: unknown, path: string, patches: Patch[]): void {
  if (Array.isArray(node)) {
    node.forEach((item, index) => {
      const key = (item as {_key?: unknown} | null)?._key
      const segment = typeof key === 'string' ? `[_key=="${key}"]` : `[${index}]`
      collect(item, `${path}${segment}`, patches)
    })
    return
  }

  if (node && typeof node === 'object') {
    for (const [field, value] of Object.entries(node)) {
      const childPath = path ? `${path}.${field}` : field
      if (BOOLEAN_FIELDS.has(field) && (value === 'true' || value === 'false')) {
        patches.push({path: childPath, value: value === 'true'})
      }
      collect(value, childPath, patches)
    }
  }
}

export default defineMigration({
  title: 'Convert string-boolean fields to booleans',
  documentTypes: ['page', 'blogPost', 'blogPage', 'redirect'],
  migrate: {
    document(doc) {
      const patches: Patch[] = []
      collect(doc, '', patches)
      if (patches.length === 0) return undefined
      return patches.map(({path, value}) => at(path, set(value)))
    },
  },
})
