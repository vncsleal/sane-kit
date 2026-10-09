# Implementation status — upgrade to the 2026 stack

Branch: **`upgrade/2026`** (off `main`; `main` untouched).
Plan: [`UPGRADE-PLAN.md`](./UPGRADE-PLAN.md).

## Done and verified

| Area | Change |
| --- | --- |
| Tooling | pnpm 10 workspaces, Turborepo, Node 24, root scripts, ESLint flat config, CI `verify` job |
| Env | `@t3-oss/env-nextjs` + `zod`, split into client (`env.ts`) and server (`env.server.ts`) — no silent fallbacks, no server secrets in the client bundle |
| Studio | Sanity 6.18, React 19.3, plugin majors, `@sanity/icons` v5 subpath imports (22 files), Presentation tool + `resolve.ts`, dev-only Vision, `deployment.autoUpdates` |
| TypeGen | Config in `studio/sanity.cli.ts`; 13 queries / 65 schema types; regenerated `types.ts` |
| Web | Next 16.4, React 19.3, `middleware` → `proxy.ts` (`@formatjs/intl-localematcher` + `negotiator`), typed route params + `hasLocale`, `priority` → `preload`, ESLint CLI |
| Data layer | `next-sanity` 13, `sanity/{env,client,image,live,translations}`, `defineQuery` from `next-sanity` |
| Live / VE | `defineLive` / `sanityFetch` / `<SanityLive />`, `<VisualEditing />`, Server-Action `<DisableDraftMode />`, draft-mode + revalidate routes, `parseBody` |
| Draft-mode UX | Aligned with Sanity's official `sanity-template-nextjs-clean`: `DraftModeToast` (sonner) gated by `useIsPresentationTool`, `disableDraftMode` action, `SanityLive onError={handleError}` CORS handling, server-only `token.ts` |
| Data fetching | **All page/layout reads go through `sanityFetch`** (home, `[slug]`, blog index/post/author/category, layout globals) so `<SanityLive />` revalidates them on content change. Blog + compare-features sections are server components that fetch via `sanityFetch` and pass data to presentational children. The plain `client` is used only for build-time/metadata outputs (`generateStaticParams`, `sitemap`, `rss.xml`, i18n alternates) |
| Page-builder types | `sanity/page-builder.ts` derives `PageBuilderSection` / `ExtractPageBuilderType` from the **query result** (official `sanity-template-nextjs-clean` pattern) and exposes `StegaAware<T>` (clean ∪ branded). Section components are typed from the query result so `sanityFetch`'s stega-branded data flows through with no casts; `RenderSection` is a server component |
| Forms | **Resend-backed** contact + newsletter Server Actions — zod validation, honeypot, file attachments, server-only Resend env; wired via `useActionState` |
| Locales | `locale` document type as the source of truth; the Studio fetches languages from Content Lake; seed via `studio/seed/locales.ndjson` |
| stega | `stegaClean` on all string-driven page-builder branches (40 call sites) |
| i18n | Server-driven language switcher (`sanity/translations.ts` + `x-pathname`); client-side Sanity fetch removed |
| SEO | `sitemap.ts`, `robots.ts`, `rss.xml`, per-post dynamic OG images, **reusable `seo` schema type** (coalesce fallbacks + `noIndex`), **JSON-LD** (`BlogPosting`/`Organization`), **Sanity-managed redirects** (`redirect` type → `next.config` `redirects()`) |
| UI | **shadcn v4**: `components/ui/*` refreshed, the `cn` package adopted (shadcn's official replacement for clsx + tailwind-merge), `shadcn/tailwind.css` imported; lucide v1 (brand icons via `react-icons/fa6`), react-day-picker v10 calendar, date-fns v4, nine `@radix-ui/react-*` packages consolidated into `radix-ui` |
| Docs | README rewritten; vendored Sanity rules removed in favour of the official skill |
| Tests | **Vitest** unit tests (20) + **Playwright** smoke suite (10) asserting real content renders against the live `sane-kit` dataset |
| Performance | **React Compiler** enabled (`reactCompiler: true`, stable in Next 16; `babel-plugin-react-compiler`). The experimental Rust/Turbopack variant is intentionally not used. |
| Resilience | `error.tsx` / `loading.tsx` / `global-error.tsx` boundaries (Next 16 `retry` prop) + a shared `logger` (no bare `console.*`) |

**Verified:** frontend + studio `tsc` clean · frontend + studio ESLint 0 errors · frontend `next build` green · studio `sanity build` green · `sanity typegen` clean · Playwright green against the live dataset.

## Not done

- **Interactive verification** of Visual Editing click-to-edit overlays is confirmed working inside the Studio's Presentation tool (section overlays render and open the correct schema). Live Content updates are wired via `<SanityLive />` + `sanityFetch`; the editor overlay flow is a browser + Studio-iframe interaction that Sanity MCP cannot drive.
- **`useOptimistic` page builder** (instant, no-round-trip edits as in `sanity-template-nextjs-clean`) is not adopted: it requires the page builder to be a client component with all section data (blog posts, compare-features) resolved server-side into the page data. Live updates currently arrive via `<SanityLive />` revalidation instead.
- Deferred: schema conformance, Sanity `locale` document type, Blueprints/Functions.
