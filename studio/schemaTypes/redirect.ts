import { LinkIcon } from '@sanity/icons/Link'
import { defineField, defineType } from 'sanity'

function isValidPath(value: string | undefined): true | string {
  if (!value) return 'Required'
  if (!value.startsWith('/') && !value.startsWith('http')) return 'Must start with / or http'
  if (/[^a-zA-Z0-9\-_/:.]/.test(value)) return 'Invalid characters'
  return true
}

/**
 * Sanity-managed redirect. Consumed by `next.config.ts` `redirects()` so editors
 * can add 307/308 rules without a code change.
 */
export const redirect = defineType({
  name: 'redirect',
  title: 'Redirect',
  type: 'document',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'source',
      title: 'From',
      type: 'string',
      description: 'Path to redirect from, e.g. /old-page',
      validation: (rule) => rule.required().custom(isValidPath),
    }),
    defineField({
      name: 'destination',
      title: 'To',
      type: 'string',
      description: 'Path or URL to redirect to, e.g. /new-page',
      validation: (rule) => rule.required().custom(isValidPath),
    }),
    defineField({
      name: 'permanent',
      title: 'Type',
      type: 'string',
      initialValue: 'true',
      options: {
        layout: 'radio',
        list: [
          { title: 'Permanent (308)', value: 'true' },
          { title: 'Temporary (307)', value: 'false' },
        ],
      },
    }),
  ],
  preview: {
    select: { title: 'source', subtitle: 'destination' },
  },
})
