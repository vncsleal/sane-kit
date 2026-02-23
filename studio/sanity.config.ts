import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool} from '@sanity/presentation'
import {documentInternationalization} from '@sanity/document-internationalization'
import {schemaTypes} from './schemaTypes'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export default defineConfig({
  name: 'default',
  title: 'Sanest Kit',

  projectId: '74lzhri7',
  dataset: 'production',

  plugins: [
    structureTool(),
    presentationTool({
      previewUrl: {
        origin: SITE_URL,
        previewMode: {
          enable: '/api/draft',
        },
      },
    }),
    documentInternationalization({
      // Add languages as needed
      supportedLanguages: [
        {id: 'en', title: 'English'},
        {id: 'pt', title: 'Portuguese'},
      ],
      schemaTypes: ['post', 'page'], // Add document types that need i18n
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  // Enable TypeGen for automatic type generation
  typescript: {
    generate: true,
  },
})
