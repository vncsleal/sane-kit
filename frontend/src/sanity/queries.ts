import { defineQuery } from "next-sanity";

{ /* frontend/src/app/[locale]/layout.tsx */}

export const LAYOUT_HEADER_QUERY = defineQuery(`*[
  _type == "header"
  && language == $language
][0]{
  _id,
  title,
  logo,
  variant,
  navigationItems[]{
    title,
    href,
    description,
    items[]{
      title,
      href,
      _key
    },
    _key
  },
  ctaButtons[]{
    label,
    url,
    variant,
    _key
  },
  dropdownCTALabel,
  dropdownCTAUrl,
  "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
    _id,
    title,
    language
  }
}`);

export const LAYOUT_FOOTER_QUERY = defineQuery(`*[
  _type == "footer"
  && language == $language
][0]{
  _id,
  title,
  logo,
  variant,
  description,
  address,
  legalLinks[]{
    title,
    url,
    _key
  },
  navigationItems[]{
    title,
    href,
    description,
    items[]{
      title,
      href,
      _key
    },
    _key
  },
  "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
    _id,
    title,
    language
  }
}`);

{ /* frontend/src/app/[locale]/page.tsx */}
export const HOME_PAGE_QUERY = defineQuery(`*[
  _type == "page"
  && slug.current == "/"
  && language == $language
][0]{
  _id,
  _type,
  title,
  description,
  ogImage,
  "seo": {
    "title": coalesce(seo.title, title),
    "description": coalesce(seo.description, description),
    "image": coalesce(seo.image, ogImage),
    "noIndex": seo.noIndex == "true"
  },
  pageBuilder[]{
    _key,
    _type,
    ...,
    _type == "compareFeaturesSection" => {
      ...,
      "features": features[]{
        "_ref": _ref,
        "_key": _key,
        "_type": _type
      },
      "plans": plans[]{
        ...,
        "featureValues": featureValues[]{
          ...,
          "featureRef": {
            "_ref": featureRef._ref,
            "_type": featureRef._type
          }
        }
      }
    }
  },
  "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
    _id,
    title,
    slug,
    language
  }
}`);

{ /* frontend/src/app/[locale]/[slug]/page.tsx */}
export const PAGE_QUERY = defineQuery(`*[
  _type == "page"
  && slug.current == $slug
  && language == $language
][0]{
  _id,
  _type,
  title,
  description,
  ogImage,
  "seo": {
    "title": coalesce(seo.title, title),
    "description": coalesce(seo.description, description),
    "image": coalesce(seo.image, ogImage),
    "noIndex": seo.noIndex == "true"
  },
  pageBuilder[]{
    _key,
    _type,
    ...,
    _type == "compareFeaturesSection" => {
      ...,
      "features": features[]{
        "_ref": _ref,
        "_key": _key,
        "_type": _type
      },
      "plans": plans[]{
        ...,
        "featureValues": featureValues[]{
          ...,
          "featureRef": {
            "_ref": featureRef._ref,
            "_type": featureRef._type
          }
        }
      }
    }
  },
  "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
    _id,
    title,
    slug,
    language
  }
}`);

{ /* frontend/src/app/[locale]/blog/[slug]/page.tsx*/}
export const BLOG_POST_PAGE_QUERY = defineQuery(`*[
  _type == "blogPost"
  && slug.current == $slug
  && language == $language
][0]{
  _id,
  _type,
  title,
  slug,
  publishedAt,
  excerpt,
  "seo": {
    "title": coalesce(seo.title, title),
    "description": coalesce(seo.description, excerpt),
    "image": coalesce(seo.image, mainImage),
    "noIndex": seo.noIndex == "true"
  },
  mainImage{
    asset,
    hotspot,
    crop,
    alt,
    caption
  },
  body,
  featured,
  "authors": authors[]->{
    _id,
    name,
    slug,
    avatar,
    bio,
    email,
    role,
    socialLinks[]{
      _key,
      platform,
      url,
      username
    }
  },
  "author": authors[0]->{
    _id,
    name,
    slug,
    avatar,
    bio,
    email,
    role,
    socialLinks[]{
      _key,
      platform,
      url,
      username
    }
  },
  "categories": categories[]->{
    _id,
    title,
    slug,
    description
  },
  "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
    _id,
    title,
    slug,
    language
  }
}`);

{ /* frontend/src/app/[locale]/blog/author/[slug]/page.tsx */}
export const AUTHOR_PAGE_QUERY = defineQuery(`*[
  _type == "author"
  && defined(slug.current)
  && defined(language)
  && ($slug == null || slug.current == $slug)
  && ($language == null || language == $language)
]{
  _id,
  _type,
  _createdAt,
  _updatedAt,
  _rev,
  name,
  slug,
  role,
  bio,
  fullBio,
  email,
  avatar,
  featuredImage,
  language,
  socialLinks[]{
    _key,
    _type,
    platform,
    url,
    username
  },
  "posts": *[
    _type == "blogPost"
    && references(^._id)
    && language == ^.language
  ] | order(publishedAt desc) {
    _id,
    _type,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    mainImage,
    featured,
    _createdAt,
    _updatedAt,
    _rev,
    "categories": categories[]->{
      _id,
      _type,
      title,
      "slug": slug.current,
      description,
      language,
      _createdAt,
      _updatedAt,
      _rev
    }
  },
  "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
    _id,
    name,
    slug,
    language
  }
}`);

{ /* frontend/src/app/[locale]/blog/category/[slug]/page.tsx */}
export const CATEGORY_PAGE_QUERY = defineQuery(`*[
  _type == "category"
  && slug.current == $slug
  && language == $language
][0]{
  _id,
  _type,
  _createdAt,
  _updatedAt,
  _rev,
  language,
  title,
  slug,
  description,
  "posts": *[
    _type == "blogPost"
    && references(^._id)
    && language == $language
  ] | order(publishedAt desc) {
    _id,
    _type,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage,
    featured,
    "author": authors[0]->{
      _id,
      _type,
      _createdAt,
      _updatedAt,
      _rev,
      name,
      slug,
      avatar,
      bio,
      email,
      role,
      language
    },
    "authors": authors[]->{
      _id,
      _type,
      _createdAt,
      _updatedAt,
      _rev,
      name,
      slug,
      avatar,
      bio,
      email,
      role,
      language
    },
    "categories": categories[]->{
      _id,
      _type,
      title,
      slug,
      description,
      language,
      _createdAt,
      _updatedAt,
      _rev
    },
    _createdAt,
    _updatedAt,
    _rev
  },
  "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
    _id,
    title,
    slug,
    language
  }
}`);

{/* frontend/src/app/[locale]/blog/page.tsx */}
export const BLOG_INDEX_PAGE_QUERY = defineQuery(`{
  "config": *[
    _type == "blogPage"
    && language == $language
  ][0]{
    _id,
    _type,
    title,
    description,
    layout,
    postsPerPage,
    featuredPostsCount,
    showOnlyFeaturedPosts,
    seo{
      metaTitle,
      metaDescription
    }
  },
  "posts": *[
    _type == "blogPost"
    && language == $language
  ] | order(publishedAt desc)[$start...$end]{
    _id,
    _type,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage,
    featured,
    "author": authors[0]->{
      _id,
      name,
      avatar
    },
    "categories": categories[]->{
      _id,
      _type,
      _createdAt,
      _updatedAt,
      _rev,
      title,
      slug,
      description,
      language
    }
  },
  "totalPosts": count(*[_type == "blogPost" && language == $language])
}`);

{ /* Consolidated Author Queries */}



export const SITEMAP_QUERY = defineQuery(`*[
  _type in ["page", "blogPost", "author", "category"]
  && defined(slug.current)
  && language == $language
]{
  _type,
  _updatedAt,
  "slug": slug.current,
  "noIndex": seo.noIndex == "true"
}`);

export const RSS_QUERY = defineQuery(`*[
  _type == "blogPost"
  && defined(slug.current)
  && language == $language
] | order(publishedAt desc)[0...50]{
  title,
  excerpt,
  publishedAt,
  "slug": slug.current
}`);

export const LANGUAGE_ALTERNATES_QUERY = defineQuery(`*[
  _type == "translation.metadata"
  && references(*[
    _type in ["page", "blogPost", "author", "category"]
    && slug.current == $slug
    && language == $currentLanguage
  ][0]._id)
][0]{
  "translations": translations[]{
    "value": value->{ _type, language, "slug": slug.current }
  }
}`);

export const REDIRECTS_QUERY = defineQuery(`*[
  _type == "redirect"
  && defined(source)
  && defined(destination)
]{
  source,
  destination,
  permanent
}`);

export const BLOG_POSTS_QUERY = defineQuery(`*[
  _type == "blogPost"
  && language == $language
  && ($featuredOnly == false || featured == true)
] | order(publishedAt desc)[$start...$end]{
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  mainImage,
  featured,
  "author": authors[0]->{
    _id,
    name,
    avatar
  },
  "categories": categories[]->{
    _id,
    title,
    slug
  }
}`);

export const COMPARE_FEATURES_QUERY = defineQuery(`*[
  _type == "compareFeature" && _id in $ids
]{ _id, title }`);
