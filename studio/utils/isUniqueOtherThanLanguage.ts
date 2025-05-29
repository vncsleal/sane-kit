import type { SlugValidationContext } from "sanity";

export async function isUniqueOtherThanLanguage(slug: string, context: SlugValidationContext): Promise<boolean> {
  const { document, getClient } = context;
  if (!document?.language) {
    return true;
  }
  const client = getClient({ apiVersion: '2023-04-24' });
  const id = document._id.replace(/^drafts\./, '');
  const params = {
    draft: `drafts.${id}`,
    published: id,
    language: document.language,
    slug,
  };
  const query = `!defined(*[
    !(_id in [$draft, $published]) &&
    slug.current == $slug &&
    language == $language
  ][0]._id)`;
  const result = await client.fetch(query, params);
  return result;
}
