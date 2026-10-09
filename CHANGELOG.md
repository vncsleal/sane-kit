# Changelog

## 2026 — Next.js 16 · React 19 · Sanity 6 · next-sanity 13

A ground-up stack upgrade of Sane-Kit, plus alignment with Sanity's official
production patterns. See [`docs/UPGRADE-PLAN.md`](./docs/UPGRADE-PLAN.md) and
[`docs/IMPLEMENTATION-STATUS.md`](./docs/IMPLEMENTATION-STATUS.md).

### Tooling

- pnpm 10 workspaces + Turborepo, Node 24, root scripts, ESLint flat config.
- CI runs typecheck / lint / build / test, plus `sanity-template-validate`.
- `@t3-oss/env-nextjs` + `zod`, split into client and server env modules.

### Studio

- Sanity 6.18, React 19, plugin majors, `@sanity/icons` v5 subpath imports.
- Presentation tool, dev-only Vision, TypeGen in `sanity.cli.ts`.
- Document internationalization via the official
  `@sanity/document-internationalization`; languages come from `locale`
  documents in Content Lake.

### Frontend

- Next.js 16 (App Router, Turbopack), React 19, `middleware` → `proxy.ts`.
- `next-sanity` 13 with TypeGen and `overloadClientMethods` — no hand-written
  query types.

### Content, live editing & preview

- **All content reads go through `sanityFetch`** (`defineLive`), so
  `<SanityLive />` revalidates them on change.
- **Optimistic editing** — a client `PageBuilder` using `useOptimistic`
  (`next-sanity/hooks`), matching `sanity-template-nextjs-clean`.
- Page-builder types derived from the query result (`PageBuilderSection`,
  `ExtractPageBuilderType`, `StegaAware`).
- Visual Editing overlays, Draft Mode toast, and the official disable action.

### Schema conformance

- `blogPost.featured` is a boolean (was a `"true"/"false"` string radio).
- `blogPost.authors[]` → a single `author` reference.
- Existing content migrated with the official `sanity migrations` CLI
  (`studio/migrations/*`).

### SEO & performance

- `sitemap.xml`, `robots.txt`, RSS, dynamic OG images, JSON-LD, and a reusable
  `seo` schema type.
- Sanity-managed redirects, tag-based on-demand revalidation, React Compiler.

### Forms

- Resend-backed contact and newsletter Server Actions with zod validation and a
  honeypot.

### UI

- shadcn v4 refresh, consolidated `radix-ui`, lucide v1, Tailwind CSS v4.

### Tests

- Vitest unit tests and a Playwright smoke suite.

### Project setup (Blueprints + Functions)

- `sanity.blueprint.ts` declares the CORS origins and the `/api/revalidate`
  webhook as code, deployed with `pnpm blueprint:deploy`.
- An illustrative Sanity Function (`functions/derive-excerpt`) fills an empty
  blog post excerpt from the body on publish.

## v2.0.0 — Document-based internationalization

- Migrated from array-based to document-based i18n
  (`sanity-plugin-document-internationalization` → `@sanity/document-internationalization`).

## v1.0.0 — Initial release

- Next.js 15 + Sanity v3 page-builder starter kit with i18n, analytics, and 12+
  section types. Published to the Sanity Exchange.
