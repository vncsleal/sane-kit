import { createClient, defineQuery } from 'next-sanity'

import { apiVersion, dataset, projectId, studioUrl } from './env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  stega: { studioUrl },
})

export { urlFor } from './image'

interface TranslationValue {
  _id: string
  _type: string
  slug: { current: string }
  language: string
  title?: string
}

interface Translation {
  _key: string
  value: TranslationValue
}

interface TranslationMetadata {
  translations: Translation[]
}

const TRANSLATION_METADATA_QUERY = defineQuery(`*[
  _type == "translation.metadata"
  && (
    ($documentId != null && translations[].value._ref == $documentId) ||
    ($slug != null && references(*[
      _type in ["page", "blogPost", "author", "category"]
      && slug.current == $slug
      && language == $currentLanguage
    ][0]._id))
  )
][0]{
  translations[]{
    _key,
    value->{
      _id,
      _type,
      slug,
      language,
      title
    }
  }
}`)

/** Resolve the language alternates for a document, by id or current slug. */
export async function getTranslationMetadata(params: {
  documentId?: string
  slug?: string
  currentLanguage?: string
}): Promise<{
  translations: Translation[]
  getUrlsMap: () => Record<string, string>
  findTranslationByLanguage: (targetLanguage: string) => Translation | undefined
}> {
  const data = await client.fetch<TranslationMetadata | null>(TRANSLATION_METADATA_QUERY, {
    documentId: params.documentId || null,
    slug: params.slug || null,
    currentLanguage: params.currentLanguage || null,
  })

  const translations = data?.translations || []

  return {
    translations,
    getUrlsMap: () => {
      const urls: Record<string, string> = {}

      translations.forEach((translation) => {
        const doc = translation.value
        if (!doc?.language || !doc?.slug?.current) return

        const { language, slug, _type } = doc
        const pathMap: Record<string, string> = {
          page: slug.current === '/' ? '' : `/${slug.current}`,
          blogPost: `/blog/${slug.current}`,
          author: `/blog/author/${slug.current}`,
          category: `/blog/category/${slug.current}`,
        }

        urls[language] = `/${language}${pathMap[_type] || `/${slug.current}`}`
      })

      return urls
    },
    findTranslationByLanguage: (targetLanguage: string) =>
      translations.find((t) => t.value?.language === targetLanguage),
  }
}
