import { EarthGlobeIcon } from '@sanity/icons/EarthGlobe'
import { defineField, defineType } from 'sanity'

/**
 * Locale document. Single source of truth for the languages used by
 * `documentInternationalization`, shared between the Studio and the frontend.
 * Seed the `tag` values to match the frontend route segments.
 */
export const locale = defineType({
  name: 'locale',
  title: 'Locale',
  type: 'document',
  icon: EarthGlobeIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tag',
      title: 'IANA tag',
      type: 'string',
      description: 'e.g. en, pt-BR — must match the frontend route segment.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'default',
      title: 'Default',
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
  preview: {
    select: { title: 'name', subtitle: 'tag' },
  },
})
