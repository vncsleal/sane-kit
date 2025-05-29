import { createClient, defineQuery } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

const projectId =
	process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your-project-id";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const client = createClient({
	projectId,
	dataset,
	apiVersion: "2024-01-01",
	useCdn: false,
});

// Initialize image URL builder
const builder = imageUrlBuilder(client);

// Helper function to generate image URLs
export const urlFor = (source: SanityImageSource) => {
	return builder.image(source);
};

// Unified query to get translation metadata by either document ID or slug
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
}`);

interface TranslationValue {
  _id: string;
  _type: string;
  slug: { current: string };
  language: string;
  title?: string;
}

interface Translation {
  _key: string;
  value: TranslationValue;
}

interface TranslationMetadata {
  translations: Translation[];
}

// Unified helper function for all translation needs
export async function getTranslationMetadata(params: {
  documentId?: string;
  slug?: string;
  currentLanguage?: string;
}): Promise<{
  translations: Translation[];
  getUrlsMap: () => Record<string, string>;
  findTranslationByLanguage: (targetLanguage: string) => Translation | undefined;
}> {
  try {
    const data = await client.fetch<TranslationMetadata | null>(TRANSLATION_METADATA_QUERY, {
      documentId: params.documentId || null,
      slug: params.slug || null,
      currentLanguage: params.currentLanguage || null,
    });

    const translations = data?.translations || [];

    return {
      translations,
      getUrlsMap: () => {
        const urls: Record<string, string> = {};
        
        translations.forEach((translation: Translation) => {
          const doc = translation.value;
          if (!doc?.language || !doc?.slug?.current) return;
          
          const { language, slug, _type } = doc;
          const pathMap = {
            page: slug.current === '/' ? '' : `/${slug.current}`,
            blogPost: `/blog/${slug.current}`,
            author: `/blog/author/${slug.current}`,
            category: `/blog/category/${slug.current}`,
          };
          
          urls[language] = `/${language}${pathMap[_type as keyof typeof pathMap] || `/${slug.current}`}`;
        });
        
        return urls;
      },
      findTranslationByLanguage: (targetLanguage: string) => {
        return translations.find((t: Translation) => t.value?.language === targetLanguage);
      }
    };
  } catch (error) {
    console.error('Error fetching translation metadata:', error);
    return {
      translations: [],
      getUrlsMap: () => ({}),
      findTranslationByLanguage: () => undefined
    };
  }
}


