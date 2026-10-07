# Implementation status — upgrade to the 2026 stack

Branch: **`upgrade/2026`** (off `main`; `main` untouched).
Plan: [`UPGRADE-PLAN.md`](./UPGRADE-PLAN.md).

## Done and verified

| Area | Change |
| --- | --- |
| Tooling | pnpm 10 workspaces, Turborepo, Node 24, root scripts, ESLint flat config, CI `verify` job |
| Env | `@t3-oss/env-nextjs` + `zod` (`frontend/src/sanity/env.ts`) — no silent fallbacks |
| Studio | Sanity 6.18, React 19.3, plugin majors, `@sanity/icons` v5 subpath imports (22 files), Presentation tool + `resolve.ts`, dev-only Vision, `deployment.autoUpdates` |
| TypeGen | Config in `studio/sanity.cli.ts`; 13 queries / 65 schema types; regenerated `types.ts` |
| Web | Next 16.4, React 19.3, `middleware` → `proxy.ts` (`@formatjs/intl-localematcher` + `negotiator`), typed route params + `hasLocale`, `priority` → `preload`, ESLint CLI |
| Data layer | `next-sanity` 13, `sanity/{env,client,image,live,translations}`, `defineQuery` from `next-sanity` |
| Live / VE | `defineLive` / `sanityFetch` / `<SanityLive />`, `<VisualEditing />`, Server-Action `<DisableDraftMode />`, draft-mode + revalidate routes, `parseBody` |
| stega | `stegaClean` on all string-driven page-builder branches (40 call sites) |
| i18n | Server-driven language switcher (`sanity/translations.ts` + `x-pathname`); client-side Sanity fetch removed |
| SEO | `sitemap.ts`, `robots.ts`, `rss.xml`, per-post dynamic OG images, **Sanity-managed redirects** (`redirect` type → `next.config` `redirects()`) |
| UI deps | lucide v1 (brand icons via `react-icons/fa6`), react-day-picker v10 calendar, date-fns v4, **nine `@radix-ui/react-*` packages consolidated into `radix-ui`** |
| Docs | README rewritten; vendored Sanity rules removed in favour of the official skill |
| Tests | **Vitest** unit tests (7) + **Playwright** smoke suite (6, boots the dev server) |

**Verified:** frontend + studio `tsc` clean · frontend + studio ESLint 0 errors · frontend `next build` green · studio `sanity build` green · `sanity typegen` clean.

## Not done

- **Forms backend** for `ContactSection` / `NewsletterSection` (needs a provider + keys).
- **shadcn v4 theme refresh** (`shadcn init --base radix --preset nova`, `shadcn/tailwind.css`). The `radix-ui` consolidation is done; the CLI currently emits a broken `cn` import alias, so component regeneration needs the alias fixed or a manual pass.
- **Runtime verification** of Live Content / Visual Editing / Draft Mode (needs a Viewer token + CORS credentials).
- Deferred: schema conformance, Sanity `locale` document type, Blueprints/Functions.
