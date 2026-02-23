# Sanest Kit

> **Modern Sanity CMS + Next.js 16 starter** - February 2026 edition

Built with the latest stable versions and best practices for building production-ready headless CMS projects.

## 🚀 Tech Stack

### Frontend (Next.js 16)
- **Next.js** `16.1.6` - React framework with App Router
- **React** `19.2.3` - Latest React with Server Components
- **Turbopack** - Default bundler (stable)
- **TypeScript** `5.9.3` - Type safety
- **Tailwind CSS** `4.2.1` - Utility-first CSS
- **next-sanity** `12.1.0` - Sanity integration
- **@portabletext/react** `6.0.2` - Portable Text rendering

### CMS (Sanity Studio v5)
- **Sanity** `5.11.0` - Headless CMS
- **TypeGen** - Automatic TypeScript type generation
- **Presentation Tool** - Live preview in Studio
- **Document Internationalization** - Multi-language support
- **Vision** - GROQ query playground

## 📁 Project Structure

```
sanest-kit/
├── web/                      # Next.js 16 frontend
│   ├── app/                  # App Router
│   │   └── page.tsx          # Homepage
│   ├── lib/
│   │   └── sanity/           # Sanity integration
│   │       ├── client.ts     # Client config
│   │       ├── queries.ts    # GROQ queries
│   │       └── image.ts      # Image URL builder
│   └── .env.local            # Environment variables
│
├── studio/                   # Sanity Studio v5
│   ├── schemaTypes/          # Content schemas
│   ├── sanity.config.ts      # Studio config
│   └── sanity.cli.ts         # CLI config
│
└── package.json              # Workspace root
```

## 🏗️ Setup

### Prerequisites
- **Node.js** ≥ 20.0.0
- **pnpm** ≥ 9.0.0

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.local.example web/.env.local

# Start development servers (both Next.js and Studio)
pnpm dev

# Or run individually:
pnpm dev:web     # Next.js on http://localhost:3000
pnpm dev:studio  # Studio on http://localhost:3333
```

### Environment Variables

Edit `web/.env.local`:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=74lzhri7
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional: Add API tokens for draft mode
# Get from: https://sanity.io/manage/project/74lzhri7/api
# SANITY_API_READ_TOKEN=your_token_here
```

## 🔧 Development Workflow

### TypeGen - Generate Types from Schemas

After creating or modifying schemas in Studio:

```bash
pnpm typegen
```

This generates `sanity.types.ts` in both `studio/` and `web/` folders.

### Build for Production

```bash
# Build both apps
pnpm build

# Deploy Studio to Sanity's hosting
pnpm deploy:studio
```

## 📚 Key Features

### ✅ Next.js 16 Features
- **Cache Components** - Optimized caching with `'use cache'`
- **Turbopack (stable)** - Fast bundler for dev and production
- **Server Components** - RSC by default
- **Enhanced Routing** - Improved prefetching
- **View Transitions** - Smooth page transitions (experimental)

### ✅ Sanity v5 Features
- **TypeGen (GA)** - Automatic type generation from schemas
- **Presentation Tool** - Live preview with Next.js
- **Document Internationalization** - Built-in i18n
- **GROQ Projections** - Optimized data fetching
- **Media Library** - Advanced asset management

### ✅ Performance Optimizations
- GROQ projections (fetch only needed fields)
- Image optimization with `next/image` + Sanity
- Incremental Static Regeneration (ISR)
- On-demand revalidation
- React Compiler support (optional)

## 🎯 Next Steps

### 1. Create Content Schemas

Edit `studio/schemaTypes/index.ts` to add your content types:

```typescript
// Example: blog post schema
import {defineType} from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    {name: 'title', type: 'string'},
    {name: 'slug', type: 'slug', options: {source: 'title'}},
    {name: 'body', type: 'text'},
  ],
})
```

### 2. Add GROQ Queries

Edit `web/lib/sanity/queries.ts`:

```typescript
import {defineQuery} from 'next-sanity'

export const POSTS_QUERY = defineQuery(`
  *[_type == "post"] | order(_createdAt desc) {
    _id,
    title,
    slug
  }
`)
```

### 3. Generate Types

```bash
pnpm typegen
```

### 4. Use in Components

```typescript
import {client} from '@/lib/sanity/client'
import {POSTS_QUERY} from '@/lib/sanity/queries'

export default async function Page() {
  const posts = await client.fetch(POSTS_QUERY)
  return <div>{/* Render posts */}</div>
}
```

## 📖 Resources

### Official Documentation
- [Next.js 16 Docs](https://nextjs.org/docs)
- [Sanity v5 Docs](https://www.sanity.io/docs)
- [next-sanity Docs](https://github.com/sanity-io/next-sanity)
- [GROQ Reference](https://www.sanity.io/docs/groq)

### Guides
- [TypeGen Guide](https://www.sanity.io/docs/sanity-typegen)
- [Presentation Tool](https://www.sanity.io/docs/presentation)
- [Next.js Integration](https://www.sanity.io/guides/nextjs-app-router-live-preview)

## 🤝 Contributing

This is a starter template. Feel free to customize and extend it for your projects!

## 📝 License

MIT

---

**Built with ❤️ using official CLIs and best practices (Feb 2026)**
