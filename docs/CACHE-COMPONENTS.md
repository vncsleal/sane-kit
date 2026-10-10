# Cache Components migration

**Status: complete.** `cacheComponents: true` is on and the frontend follows the
next-sanity strict `defineLive` pattern. Every content route now prerenders a
partial static shell (`◐`) instead of rendering fully dynamically (`ƒ`); only the
root locale-redirect (`/`), the draft-mode API routes, the RSS/sitemap routes and
the OpenGraph image render on demand.

## What changed

1. **`frontend/next.config.ts`** — `cacheComponents: true`,
   `partialPrefetching: true` (the documented companion for a new project), and
   `cacheLife: {default: sanityCacheLife}` (`next-sanity/live/cache-life`), which
   widens the default profile because Sanity Live revalidates on demand.

2. **`frontend/src/sanity/live.ts`** — `defineLive({..., strict: true})`, the
   shared `cachedSanity: StrictDefinedFetchType` (`'use cache'`) boundary, and
   `getDynamicFetchOptions()`, which resolves `perspective`/`variant`/`stega`
   from `draftMode()`/`cookies()` **outside** any cache boundary.

3. **Every content route** (`[locale]/layout`, `page`, `[slug]`, `blog/*`)
   adopts the draft/cached split: it reads `draftMode()`; when enabled it renders
   a `Draft*` component inside `<Suspense>` that calls `getDynamicFetchOptions()`;
   otherwise it renders a `Cached*` component with
   `perspective: 'published', stega: false`. `generateMetadata` uses
   `cachedSanity` with the same published options.

4. **`[locale]/layout.tsx`** renders `<SanityLive includeDrafts={isDraftMode} />`
   and streams the header/footer (which read `headers()`/`draftMode()`) inside
   `<Suspense>`. Draft-mode UI moved here from the root layout so the root shell
   prerenders.

5. **`generateStaticParams`** added for the `page` (`[slug]`) and `blogPost`
   (`blog/[slug]`) content types, and for the blog index / home locale segment.
   Author and category reuse typed `*_SLUGS_QUERY`s and return real params.

6. **`resolve-page-builder.ts`** threads `perspective`/`variant`/`stega` into its
   `cachedSanity` calls.

The root `/` redirect keeps `export const instant = false`: a redirect must read
request headers before it can decide where to send the visitor, so it is allowed
to block rather than prerender a shell. The proxy negotiates the locale first in
normal traffic.

## Caveats

- **A project needs content to build.** With Cache Components,
  `generateStaticParams` must return at least one param — an empty array is a
  build error (`empty-generate-static-params`). A brand-new, empty dataset will
  therefore fail the build until at least one page / post / author / category
  exists. Seed some content (or import the demo dataset) before building.

## References

- `node_modules/next/dist/docs/01-app/02-guides/migrating-to-cache-components.md`
- `node_modules/next/dist/docs/01-app/02-guides/incremental-static-regeneration-cache-components.md`
- next-sanity `defineLive` JSDoc (`next-sanity/dist/live/conditions/*/index.js`)
