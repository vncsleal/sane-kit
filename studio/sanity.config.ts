import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { presentationTool } from 'sanity/presentation'
import { visionTool } from '@sanity/vision'
import { codeInput } from '@sanity/code-input'
import { unsplashImageAsset } from 'sanity-plugin-asset-source-unsplash'
import { ptBRLocale } from '@sanity/locale-pt-br'
import { documentInternationalization } from '@sanity/document-internationalization'

import { schemaTypes } from './schemaTypes'
import { structure } from './structure'
import { resolve } from './presentation/resolve'
import Logo from './components/Logo'
import { studioConfig } from './config'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'your-project-id'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'
const siteUrl = process.env.SANITY_STUDIO_SITE_URL || 'http://localhost:3000'

export default defineConfig({
  icon: Logo,
  name: 'default',
  title: 'Sane Kit Studio',
  projectId,
  dataset,
  plugins: [
    structureTool({ structure }),
    presentationTool({
      resolve,
      previewUrl: {
        initial: siteUrl,
        previewMode: { enable: '/api/draft-mode/enable' },
      },
    }),
    codeInput(),
    unsplashImageAsset(),
    documentInternationalization({
      supportedLanguages: (client) =>
        client.fetch(
          `*[_type == "locale"] | order(coalesce(default, "false") desc, name asc){ "id": tag, "title": name }`,
        ),
      schemaTypes: [
        'page',
        'blogPost',
        'author',
        'category',
        'blogPage',
        'header',
        'footer',
        'compareFeature',
        'featureSection',
        'heroSection',
        'casesSection',
        'testimonialsSection',
        'pricingSection',
        'compareFeaturesSection',
        'statsSection',
        'ctaSection',
        'faqSection',
        'contactSection',
        'newsletterSection',
      ],
    }),
    ...(studioConfig.language === 'pt-BR' ? [ptBRLocale()] : []),
    ...(process.env.NODE_ENV !== 'production' ? [visionTool()] : []),
  ],
  schema: {
    types: schemaTypes,
  },
})
