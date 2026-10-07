import { defineLocations, type PresentationPluginOptions } from 'sanity/presentation'

export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    page: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || 'Página',
            href: doc?.slug === '/' ? '/' : `/${doc?.slug}`,
          },
        ],
      }),
    }),
    blogPost: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title || 'Post', href: `/blog/${doc?.slug}` },
          { title: 'Blog', href: '/blog' },
        ],
      }),
    }),
    author: defineLocations({
      select: { name: 'name', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [{ title: doc?.name || 'Autor', href: `/blog/author/${doc?.slug}` }],
      }),
    }),
    category: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [{ title: doc?.title || 'Categoria', href: `/blog/category/${doc?.slug}` }],
      }),
    }),
  },
}
