export interface BlogPostingJsonLd {
  '@context': 'https://schema.org'
  '@type': 'BlogPosting'
  headline: string
  mainEntityOfPage: string
  description?: string
  image?: string
  datePublished?: string
  author?: { '@type': 'Person'; name: string }
}

export interface OrganizationJsonLd {
  '@context': 'https://schema.org'
  '@type': 'Organization'
  name: string
  url: string
  logo?: string
}

export interface BlogPostingInput {
  headline: string
  url: string
  description?: string
  image?: string
  datePublished?: string
  authorName?: string
}

/** schema.org `BlogPosting` for a post page. Pure — no I/O. */
export function buildBlogPostingJsonLd(input: BlogPostingInput): BlogPostingJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: input.headline,
    mainEntityOfPage: input.url,
    description: input.description,
    image: input.image,
    datePublished: input.datePublished,
    author: input.authorName ? { '@type': 'Person', name: input.authorName } : undefined,
  }
}

export interface OrganizationInput {
  name: string
  url: string
  logo?: string
}

/** schema.org `Organization` for the site. Pure — no I/O. */
export function buildOrganizationJsonLd(input: OrganizationInput): OrganizationJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: input.name,
    url: input.url,
    logo: input.logo,
  }
}
