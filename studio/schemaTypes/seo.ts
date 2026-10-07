import { EarthGlobeIcon } from '@sanity/icons/EarthGlobe'
import { defineField, defineType } from 'sanity'

/**
 * Reusable SEO object. Optional everywhere — queries fall back to the document's
 * own title/description/image via `coalesce()`.
 */
export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  icon: EarthGlobeIcon,
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: 'title',
      title: 'Meta title',
      type: 'string',
      description: 'Overrides the page title in search results.',
      validation: (rule) => rule.max(70).warning('Keep under 70 characters'),
    }),
    defineField({
      name: 'description',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(160).warning('Keep under 160 characters'),
    }),
    defineField({
      name: 'image',
      title: 'Social image',
      type: 'image',
      description: '1200×630 recommended.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'string',
      initialValue: 'false',
      options: {
        layout: 'radio',
        list: [
          { title: 'No', value: 'false' },
          { title: 'Yes', value: 'true' },
        ],
      },
    }),
  ],
})
