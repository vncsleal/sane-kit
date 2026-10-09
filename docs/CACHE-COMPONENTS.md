# Cache Components migration (deferred)

Enabling `cacheComponents: true` (Next 16) turns the app from fully dynamic SSR
into static shells + tag-revalidated content — the official 2026 direction, and
what makes `sanityFetch`'s cache tags and `<SanityLive />` actually pay off.

It is a **whole-app** change, so it is tracked here as a dedicated pass rather
than half-applied.

## Why it's not a one-line flag

With Cache Components on, Next validates that every route renders instantly and
fails the build on "uncached or runtime data during prerendering". In this app
that surfaces on `/[locale]/[slug]` (and every other route) because
`sanityFetch` is uncached and `params` is runtime data.

next-sanity's `defineLive({ strict: true })` is the intended pairing, and it
requires resolving dynamic values **outside** a `use cache` boundary.

## Plan

1. **`frontend/next.config.ts`**

   ```ts
   import {sanity as sanityCacheLife} from 'next-sanity/live/cache-life'
   const nextConfig: NextConfig = {
     cacheComponents: true,
     cacheLife: {default: sanityCacheLife},
   }
   ```

2. **`frontend/src/sanity/live.ts`** — strict mode + the shared `use cache`
   boundary (see the `defineLive` JSDoc in `next-sanity/dist/live/...`):

   ```ts
   export const {sanityFetch, SanityLive} = defineLive({
     client,
     serverToken: token,
     browserToken: token,
     strict: true,
   })
   export const cachedSanity: StrictDefinedFetchType = async (options) => {
     'use cache'
     return sanityFetch(options)
   }
   export async function getDynamicFetchOptions(): Promise<DynamicFetchOptions> {
     const {isEnabled} = await draftMode()
     if (!isEnabled) return {perspective: 'published', stega: false}
     const jar = await cookies()
     const perspective = await resolvePerspectiveFromCookies({cookies: jar})
     const variant = await resolveVariantFromCookies({cookies: jar})
     return {perspective: perspective ?? 'drafts', variant, stega: true}
   }
   ```

3. **Every route** (`[locale]/layout`, `page`, `[slug]`, `blog/*`) adopts the
   draft/cached split: read `draftMode()`; when enabled render the dynamic path
   inside `<Suspense>`; otherwise render a `cachedSanity(...)` component with
   `perspective: 'published', stega: false`. `generateMetadata` follows the
   same rule.

4. **`<SanityLive includeDrafts={isDraftMode} />`** in the locale layout.

5. **`generateStaticParams`** for `page` and `blogPost` (the plan's Phase 5).

6. The section resolvers (`resolve-page-builder.ts`, blog/compare-features)
   take `perspective`/`variant`/`stega` and use `cachedSanity`.

## References

- `node_modules/next/dist/docs/01-app/02-guides/migrating-to-cache-components.md`
- `node_modules/next/dist/docs/01-app/02-guides/incremental-static-regeneration-cache-components.md`
- next-sanity `defineLive` JSDoc (`next-sanity/dist/live/conditions/*/index.js`)
- Official adoption skill: `npx skills add vercel/next.js --skill next-cache-components-adoption`

## Incremental alternative

If adopting all at once is too large, the official incremental flow is to enable
the flag, add `export const instant = false` to each route (or run
`npx @next/codemod@canary cache-components-instant-false ./src/app`), then convert
routes one at a time. That ships the flag on with validation deferred — not ideal
for a starter, so the direct migration above is preferred.
