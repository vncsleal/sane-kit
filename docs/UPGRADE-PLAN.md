# Sane-Kit — Upgrade Plan: Next.js 16 · React 19.2 · Sanity v6 · next-sanity v13

> Status: **ready for implementation** · Date: 2026-10-07
> Scope: the `sane-kit` monorepo (`frontend/` + `studio/`).
> Every version and API claim below was checked against the official docs listed in §10 on 2026-10-07.

---

## 1. Summary

`sane-kit` runs a 2025-era stack. The jump to the current line unlocks the features that matter most for a Sanity starter — **TypeGen-typed queries, the Live Content API, and Visual Editing / Presentation** — so this is a chance to re-found the data layer, not just bump versions.

| | Now | Target |
| --- | --- | --- |
| Web | Next 15.3 · React 18.3 · next-sanity 9.9 | **Next 16.4 · React 19.2 · next-sanity 13.3** |
| Studio | Sanity 3.88 · React 18.2 | **Sanity 6.18 · React 19.2** |
| Toolchain | npm · no tests · `next lint` | **Node 24 · pnpm 10 · Turborepo · Vitest + Playwright · ESLint 9 flat** |
| Data layer | ad-hoc `client.fetch<T>`, dynamic-only | **TypeGen, `sanityFetch`/`defineLive`, ISR + tags, Visual Editing** |

**Outcome:** a template that builds typed, live-previewable, CDN-cached content with first-party tooling end to end.

---

## 2. Current state (verified from the repo)

**Environment:** Node `v24.21.0`, npm `11.19.0` (satisfies Sanity v6 ≥22.12 and Next 16 ≥20.9).

| Area | Current (`main`) | Notes |
| --- | --- | --- |
| Frontend | Next `15.3.0`, React `18.3.1`, `next-sanity ^9.9.9` | `frontend/package.json` |
| Studio | `sanity ^3.88.2`, React `18.2.0` | `studio/package.json` |
| i18n | `@sanity/document-internationalization ^3.3.1` + custom `middleware.ts` + `LanguageProvider` | document-based |
| Styling | Tailwind v4 + shadcn (`new-york`), `tw-animate-css` | `globals.css` |
| TypeGen | `sanity-typegen.json` → `frontend/src/sanity/types.ts` | deprecated file-based config |
| Rendering | `generateStaticParams` only on `blog/author` and `blog/category`; pages/blog posts dynamic; no `revalidate`/tags | grep-verified |
| Images | `@sanity/image-url ^1.1.0`, inline `urlFor()` | |
| Analytics | `posthog-js`, `posthog-node ^4`, GA4 | consent-gated |
| CI | `sanity-io/template-validator@v2` only | `.github/workflows/validate.yml` |
| `origin/v3` branch | Next 16.1.6, Sanity 5.11, pnpm, one demo page | abandoned skeleton — see §3.1 |

### Latent defects (fixed in Phase 0)
- **Undeclared direct imports** (work only transitively): `groq` (`sanity/queries.ts`, `sections/blog/shared.tsx`), `@portabletext/react` (4 files), `@sanity/icons` (22 studio schema files).
- `frontend/src/sanity/client.ts`: `useCdn: false` everywhere; hardcoded `apiVersion: "2024-01-01"`; silent `try/catch` + `console.error` (violates "fail loud").
- `frontend/src/middleware.ts` uses the deprecated Next convention (→ `proxy.ts`).
- `frontend/package.json` `"lint": "next lint"` — the command is removed in Next 16.
- `README.md` claims Next 15 / Sanity v3.
- `studio/sanity.cli.ts` uses the pre-v4.9 `autoUpdates` location and has no `typegen` block.

---

## 3. Decisions

### 3.1 Strategy & workflow
- **Strategy: upgrade the existing code, don't rewrite.** Keep the section components, schemas, i18n, and analytics. The abandoned `origin/v3` branch is a skeleton (no page builder, no schemas beyond `index.ts`, hardcoded project ID, one demo page) and is direct evidence of a rewrite's cost. Port only its `presentationTool` + draft-route pattern, `deployment.autoUpdates`/`appId`, and typed `client.ts`/`image.ts` split.
- **Workflow: integration branch, trunk stays green.** Non-breaking prep lands directly on `main`; all breaking work lands on `upgrade/2026` (cut from the prepped `main`), one commit per phase, with a preview deploy. Merge to `main` only on a green matrix, then tag `v3.0.0`. `main` and the demo stay untouched until then.
- **Retire `origin/v3`** after release (tag `archive/v3-skeleton`).

### 3.2 Canonical tooling (binding)

| Question | Decision | Why |
| --- | --- | --- |
| Studio location | **Standalone monorepo** (`frontend/` + `studio/`) | Sanity's embedding doc says co-location suits small–medium projects and that standalone/monorepo is better for **larger projects and teams** (and avoids a website-centric content model). |
| Frontend i18n | **Next-documented pattern**: negotiate in `proxy.ts` with `@formatjs/intl-localematcher` + `negotiator`; `getDictionary` (JSON catalogs) for messages; `[locale]` segment | Matches Next's own i18n guide; replaces the hand-rolled Accept-Language parser without an undocumented framework (`next-intl` is not in the Next.js docs). |
| Content localization | `@sanity/document-internationalization@6` + `translation.metadata` GROQ; locales stored as a Sanity `locale` document | The documented Sanity pattern; one source of truth for languages. |
| Analytics | GA4 via `@next/third-parties/google`; PostHog via its documented Next.js provider + `/ingest` rewrites | First-party (Vercel) + vendor-documented; no hand-rolled `<script>`. |
| Env | `@t3-oss/env-nextjs` + `zod` | Typed, build-time validation; deletes the `\|\| "your-project-id"` fallbacks. |
| Types | Sanity TypeGen with `overloadClientMethods` | Canonical; deletes manual `fetch<T>` generics and the `ExpandedBlogPost` re-mapping. |
| Toolchain | **Node 24 LTS**, **pnpm 10**, **Turborepo** | Turbo (Vercel's monorepo runner) replaces `npm-run-all`; pnpm 10 gates build scripts. |
| Lint | **ESLint 9** flat config (`eslint-config-next`) | Next 16's documented target. |
| TypeScript | **6.0.3** | `typescript-eslint@8.71` peers `>=4.8.4 <6.1.0`; TS 7 would force disabling type-aware linting. |
| UI primitives | **shadcn CLI v4**, `--base radix --preset nova`; refresh `components/ui/*` | v4's Radix base uses the consolidated `radix-ui` package; Base UI / React Aria is a separate product decision, out of scope. |
| Sanity API surface | `defineLive`/`sanityFetch` (`next-sanity/live`), `defineEnableDraftMode` (`next-sanity/draft-mode`), `parseBody` (`next-sanity/webhook`), `stegaClean`, `usePresentationQuery` (`next-sanity/hooks`), built-in `sanity/presentation` | All first-party in next-sanity 13. |

### 3.3 Resolved seams (previously open)
- **`language` ↔ `[locale]` must match.** Keep the existing values (`en`, `pt-BR`) so **no content migration is needed**; the Sanity `locale` document's `tag` field must equal the route segment exactly.
- **`presentationTool.previewUrl`**: use `initial` (current v6 shape). If the build reports an unknown property, fall back to `origin` — verify in Phase 1.
- **Smart typography** (Sanity v5, on by default): keep the platform default; expose a per-field opt-out only if the content pipeline needs literal characters. No code action otherwise.
- **Vision tool**: guard `visionTool()` behind `process.env.NODE_ENV !== 'production'`.
- **Analytics consent**: the ConsentContext gating must wrap the new GA component unchanged.

### 3.4 Non-goals / deferred (own PRs, not this upgrade)
Schema conformance (`blogPost.author` single ref, `featured` boolean) and Base UI/React Aria migration. Cache Components is deferred to Phase 5's follow-up.

---

## 4. Target dependency matrix (single source of truth)

### Web (`frontend/`)
| Package | Now | Target | Note |
| --- | --- | --- | --- |
| `next` | 15.3.0 | **16.4.0** | Turbopack default, `proxy`, async APIs, image defaults |
| `react` / `react-dom` | 18.3.1 | **19.2.3** | next-sanity 13 peer `^19.2.3` |
| `next-sanity` | 9.9.9 | **13.3.4** | needs Next ^16, `@sanity/client ^7.26.2 \|\| ^8`, React ^19.2.3 |
| `@sanity/client` | transitive | **^8.9.0** (declare) | v8 is current |
| `@portabletext/react` | transitive | **8.0.1** (declare) | React 19 peer |
| `@sanity/icons` | transitive | **5.2.3** (declare) | |
| `groq` | transitive | **drop** | import `defineQuery` from `next-sanity` |
| `@sanity/image-url` | ^1.1.0 | **2.1.1** | major; API review |
| `tailwindcss` / `@tailwindcss/postcss` | ^4 | **4.3.3** | minor |
| `@radix-ui/react-*` (9 pkgs) | ^1.x | **`radix-ui@^1.7.0`** | shadcn v4 Radix base |
| `lucide-react` | ^0.487.0 | **1.52.0** | major; verify icon renames |
| `react-day-picker` | ^8.10.1 | **10.0.2** | regenerate `calendar.tsx` |
| `date-fns` | ^3.6.0 | **4.4.0** | |
| `posthog-js` / `posthog-node` | ^1.240 / ^4.17 | **1.438 / 5.55** | |
| `sonner`, `embla-carousel-react`, `tailwind-merge`, `tw-animate-css`, `class-variance-authority` | — | latest | |
| `@formatjs/intl-localematcher`, `negotiator` | — | latest | locale negotiation in `proxy.ts` |
| `@next/third-parties` | — | **16.4.0** | GA4 (docs mark the package experimental) |
| `@t3-oss/env-nextjs` + `zod` | — | **0.13.11 / 4.6.5** | env validation |
| `typescript` | ^5 | **6.0.3** | lint-toolchain ceiling |
| `eslint` | ^9 | **^9** (latest 9.x) | Next 16 documents 9 |
| `eslint-config-next` | 15.3.0 | **16.4.0** | flat config |
| `@types/react` / `@types/react-dom` | ^19 | **19.3.0** | |

### Studio (`studio/`)
| Package | Now | Target | Note |
| --- | --- | --- | --- |
| `sanity` | 3.88.2 | **6.18.0** | Node 24, strict mode, Vite 8 |
| `react` / `react-dom` / `@types/react` | 18.2 | **^19.2.2** | Sanity v5+ requirement |
| `@sanity/vision` | 3.68.3 | **6.18.0** | dev-only |
| `@sanity/code-input` | 5.1.2 | **7.3.9** | |
| `@sanity/document-internationalization` | 3.3.1 | **6.2.39** | |
| `sanity-plugin-internationalized-array` | 3.1.2 | **5.3.2** | peer of the above |
| `@sanity/assist` | — | **6.2.2** (peer) | required by internationalized-array |
| `@sanity/language-filter` | — | **5.0.19** (peer) | required by internationalized-array |
| `sanity-plugin-asset-source-unsplash` | 3.0.3 | **7.0.26** | |
| `@sanity/locale-pt-br` | 1.1.16 | **1.1.37** | |
| `@sanity/eslint-config-studio` | 5.0.1 | **7.0.0** | |

### Root / tooling
| Package | Target | Note |
| --- | --- | --- |
| `turbo` | **2.11.7** | monorepo runner |
| `vitest` | **5.0.3** | unit tests |
| `playwright` | **1.63.0** | smoke/E2E |
| `@sanity/template-validator` | **^3.1.1** | CI |
| Node `engines` | **`>=24`** | Sanity v6 ≥22.12; Functions run on 24 |

---

## 5. Execution plan

Each phase ends with the narrowest check that covers it, then `pnpm verify` (see §6) plus `sanity build` in `studio`.

---

### Phase 0 — Prep & guardrails *(lands directly on `main`)*

Non-breaking and individually revertable; `main` stays green.

- Migrate to **pnpm 10 workspaces**; regenerate the lockfile; approve blocked postinstall scripts via `onlyBuiltDependencies` in `pnpm-workspace.yaml` (`pnpm approve-builds`).
- Add **Turborepo**: `turbo.json` with `dev`/`build`/`typecheck`/`lint` pipelines; replace the `npm-run-all` dev script.
- Add root `engines.node: ">=24"` and `.nvmrc`/`.node-version`.
- Add root scripts `typecheck`, `lint`, `build`, `format`, `test`, `typegen`, `verify` (see §6).
- Add **`@t3-oss/env-nextjs` + `zod`** env module; remove the `|| "your-project-id"` / `|| "production"` fallbacks.
- **Declare the currently-transitive direct imports**: `@portabletext/react`, `@sanity/icons`, `@sanity/client`. Drop `groq` (both `from "groq"` imports move to `next-sanity`).
- Remove `console.*` from app code behind the project logger.
- Delete dead code: confirm `sanity-plugin-internationalized-array` usage (it stays — a peer of document-internationalization v6); remove the stale `frontend/README.md` boilerplate.
- Update CI: keep template-validator, add `typecheck` + `lint` + `build` jobs.
- Cut `upgrade/2026` off the prepped `main`; tag `pre-upgrade`.

**Verify:** prep commits are deps/config-only; the app still builds and runs.

---

### Phase 0.5 — Safety net: test + perf baseline *(lands directly on `main`)*

The repo has no tests, so "not broken" has no definition yet.

- **Playwright smoke suite**: both locales load `/`, one page-builder page, the blog index, and a blog post; the locale switcher works; analytics consent toggles.
- **Snapshot the rendered output of one page per section type** — the page builder is the blast radius of Phases 1–4.
- **Lighthouse / Core Web Vitals baseline** for the same routes.
- Wire both into CI; require them green on every `upgrade/2026` PR.
- Point the demo deployment at a preview of `upgrade/2026`, not `main`.

---

### Phase 1 — Studio: Sanity 3 → 6 *(on `upgrade/2026`)*

Follow the official v3→v4, v4→v5, v5→v6 guides in order.

- **React ^19.2.2 and Node 24 first** (v5/v6 requirements).
- Install: `sanity@^6`, `@sanity/vision@^6` (dev-only guard), `@sanity/code-input@^7`, `sanity-plugin-asset-source-unsplash@^7`, `@sanity/document-internationalization@^6`, `sanity-plugin-internationalized-array@^5.3.2`, `@sanity/assist@^6.2.2`, `@sanity/language-filter@^5.0.19`, `@sanity/locale-pt-br@latest`, `@sanity/eslint-config-studio@^7`.
- **`sanity.cli.ts`**: move `autoUpdates` → `deployment.autoUpdates`, add `deployment.appId`, set `reactStrictMode: true`, add the `typegen` block (Phase 3).
- Resolve v5/v6 defaults: regenerate TypeGen types (naming changes/hoisting); smart typography stays at the platform default; verify the v6 search strategy `groq2024` ordering; confirm no `auth.providers`; confirm `previewUrl` shape (§3.3).
- Add **`presentationTool`** (`sanity/presentation`) — full wiring in Phase 4.
- **Resolve a `locale` document type** (id/title/tag) and switch `documentInternationalization` to `supportedLanguages: (client) => client.fetch(...)`, keeping `en`/`pt-BR` so no content migration is needed.

**Verify:** `npx sanity dev` loads, `npx sanity build` passes, strict mode is clean.

---

### Phase 2 — Web foundation: Next 16 + React 19.2 *(on `upgrade/2026`)*

- Run the official codemod path (`npx next@canary upgrade --agent=latest`, or `npx @next/codemod@canary upgrade latest`): Turbopack config location, `next lint` → ESLint CLI, `middleware` → `proxy`, `unstable_` prefixes, `experimental_ppr`. Then run `npx @next/codemod@canary next-async-request-api .` to catch stragglers.
- Bump `next@16.4.0`, `react@19.2.3`, `react-dom@19.2.3`, `@types/react` / `@types/react-dom@19.3.0`.
- **ESLint:** replace the `FlatCompat` shim with flat config:
  ```js
  import { defineConfig, globalIgnores } from 'eslint/config'
  import nextVitals from 'eslint-config-next/core-web-vitals'
  export default defineConfig([...nextVitals, globalIgnores(['.next/**','out/**','build/**','next-env.d.ts'])])
  ```
  Change `"lint": "next lint"` → `"lint": "eslint ."`. Keep `eslint@^9`.
- **Next 16 changes to action:**
  - Drop `--turbopack` from scripts (now default).
  - `next dev` writes to `.next/dev`; dev and build can run concurrently.
  - `next/image`: audit `quality` props against the new `qualities: [75]` default; check `minimumCacheTTL` (4h), `imageSizes`, `maximumRedirects`, and `images.localPatterns.search` (the `cdn.sanity.io` remote pattern already exists). Migrate `<Image priority>` → `preload` (`frontend/src/components/blog/BlogPostPage.tsx:355`).
  - `revalidateTag(tag, profile)` now takes a second `cacheLife` profile arg (single-arg deprecated); `cacheLife`/`cacheTag` stable; `updateTag()`/`refresh()` are Server-Actions-only.
  - Adopt the global `PageProps`/`LayoutProps` helpers (from `next typegen`) instead of the hand-written `PageParams`/`PageProps` interfaces.
  - `serverRuntimeConfig`/`publicRuntimeConfig` are removed (unused here); parallel-route slots need `default.js` (none here).
  - `scroll-behavior: smooth` is no longer overridden — add `data-scroll-behavior="smooth"` to `<html>` only if the old behaviour is wanted.
- **Rework i18n to the Next-documented pattern** (its own commit — touches every page/layout): `proxy.ts` using `@formatjs/intl-localematcher` + `negotiator`; `getDictionary` with JSON catalogs; params-driven locale; a server-rendered locale switcher (replacing `LanguageProvider` and the custom geo/cookie detection).
- **No `cacheComponents` yet.**

**Verify:** `next build`, `eslint .`, both localized routes render, Playwright smoke green.

---

### Phase 3 — Typed content: next-sanity v13 + TypeGen *(on `upgrade/2026`)*

- Install `next-sanity@13.3.4`; declare `@sanity/client@^8.9.0`, `@portabletext/react@^8`, `@sanity/icons@^5`.
- Standardise `defineQuery` on **`next-sanity`** (remove the `from "groq"` imports).
- Restructure `frontend/src/sanity/`:
  - `env.ts` — validated env (throws at build).
  - `client.ts` — `createClient` with `apiVersion` from env, `useCdn: true`, `stega.studioUrl` (Phase 4).
  - `image.ts` — `createImageUrlBuilder({ projectId, dataset })` + `urlFor`.
  - `queries.ts`, `live.ts`.
- Move TypeGen into `studio/sanity.cli.ts` (delete `sanity-typegen.json`):
  ```ts
  typegen: {
    enabled: true,
    path: '../frontend/src/**/*.{ts,tsx,js,jsx}',
    schema: '../frontend/src/sanity/extract.json',
    generates: '../frontend/src/sanity/types.ts',
    overloadClientMethods: true,
  }
  ```
- **Audit for duplicate query variable names** — TypeGen silently overwrites.
- With `overloadClientMethods`, delete the manual `..._QUERYResult` annotations and the giant `ExpandedBlogPost` re-mapping in `app/[locale]/blog/[slug]/page.tsx` (lines ~57–133).
- Add the image-metadata projection to queries: `asset->{ metadata { lqip, dimensions } }`, plus a `SanityImage` wrapper (`fit`, `placeholder="blur"`, `blurDataURL`).

**Verify:** `sanity schema extract --enforce-required-fields --path=../frontend/src/sanity/extract.json` + `sanity typegen generate` produce no drift; `tsc --noEmit` clean; queries render.

---

### Phase 4 — Live Content + Visual Editing + Presentation + Draft Mode *(on `upgrade/2026`)*

Follow the official *Visual Editing with Next.js App Router* guide.

- **Studio** (`studio/sanity.config.ts`): configure `presentationTool` with `previewUrl.previewMode.enable = '/api/draft-mode/enable'` (§3.3 for shape); add `studio/presentation/resolve.ts` with `defineLocations` for `page`, `blogPost`, `author`, `category` (mirror the real routes).
- **Web** (`frontend/src/sanity/live.ts`): `export const { sanityFetch, SanityLive } = defineLive({ client, serverToken, browserToken })` with a Viewer `SANITY_API_READ_TOKEN`.
- Replace `client.fetch(...)` in pages with `const { data } = await sanityFetch({ query, params })` — note the `{ data }` return shape. Use `perspective: 'published', stega: false` for `generateStaticParams` and metadata.
- **`stegaClean`** on every logic-driving string (hero variant, feature layout, alignment, orientation, sizes, `data-*`); add the dev-only `onSuspiciousStega` audit during development to catch leaks.
- **Root layout** (`app/layout.tsx`): render `<SanityLive />` once; render `<VisualEditing />` + `<DisableDraftMode />` only when `(await draftMode()).isEnabled`.
- Route handlers: `app/api/draft-mode/enable/route.ts` via `defineEnableDraftMode` (`next-sanity/draft-mode`) with `client.withConfig({ token })`; a `disable` route; and `app/api/revalidate/[type]/route.ts` using `parseBody` (`next-sanity/webhook`) + `SANITY_REVALIDATE_SECRET` (pass `true` as the third arg to delay past CDN lag).
- **Block-level live editing**: add `usePresentationQuery` (`next-sanity/hooks`) per section and thread `documentId` through `RenderSection`, so editing a hero updates only that block.
- **CORS:** add `http://localhost:3000` and the production origin with **Allow credentials** (`sanity cors add … --credentials`).
- Keep ConsentContext gating around the new GA component (§3.3).

**Verify:** edit a field in Studio → click-to-edit overlay works and only the edited block re-renders; publish → live update appears; metadata contains no stega.

---

### Phase 5 — Caching, performance & SEO *(on `upgrade/2026`)*

- `useCdn: true`; rely on `defineLive` for caching/revalidation **or** a manual `sanityFetch` wrapper with tags — pick one, not both.
- Add `generateStaticParams` for `page` and `blogPost`; set ISR windows (30–60s blog, hours for static pages).
- On-demand revalidation: Sanity webhook → `/api/revalidate/tag` → `revalidateTag(tag, 'max')`.
- **SEO**: a reusable `seo` object type (`title`, `description`, `image`, `noIndex`), GROQ `coalesce()` fallbacks, `app/sitemap.ts` (excluding `seo.noIndex`), `app/robots.ts`, JSON-LD (`BlogPosting`/`Organization`), and locale `alternates`. **Dynamic OG images** per post via `next/og` `ImageResponse` (`app/[locale]/blog/[slug]/opengraph-image.tsx`).
- **Sanity-managed redirects**: a `redirect` document type wired into routing.
- Images: confirm the Sanity CDN remote pattern and audit `next/image` quality/sizes against the new defaults.
- **Optional (separate PR):** React Compiler (`reactCompiler: true` + `babel-plugin-react-compiler`, measure build cost); View Transitions; Cache Components (`cacheComponents: true` — not a rename; surfaces "uncached data outside `<Suspense>`" errors).

---

### Phase 6 — UI & remaining dependencies *(on `upgrade/2026`)*

- Refresh `components/ui/*` via **shadcn CLI v4**: `shadcn init --base radix --preset nova` (swaps the nine `@radix-ui/react-*` deps for the consolidated `radix-ui`; `new-york` → `nova`; adds the `shadcn/tailwind.css` import). **Regenerate `calendar.tsx`** (v4 uses `react-day-picker@10` with `locale`/`dir`).
- `lucide-react@1.52`: diff the 35 import sites for renamed/removed icons.
- `date-fns@4`, `sonner`, `embla-carousel-react`, `tailwind-merge`, `tw-animate-css` → latest.
- `posthog-js@1.438`, `posthog-node@5.55`; keep everything consent-gated; route logs through the project logger.
- Evaluate `react-code-blocks` under React 19 (consider `shiki` if it breaks).
- Add the **shadcn MCP server** to the repo's MCP config (`npx shadcn@latest mcp init`).

---

### Phase 7 — Quality, features, docs *(on `upgrade/2026`)*

- Error/loading boundaries: `app/[locale]/error.tsx` + Suspense loading states; no bare `console.*`.
- **Starter-kit features the plan previously omitted:**
  - **RSS/Atom feed** (`app/rss.xml/route.ts`) from the existing blog query + `NEXT_PUBLIC_SITE_URL`.
  - **Form handling** for `ContactSection`/`NewsletterSection` (the UI ships with no backend): Server Actions + a provider (e.g. Resend) + spam protection (honeypot/Turnstile) + env vars.
  - **Root formatting standard** (Studio has Prettier, the frontend has none): a root `format` script (Prettier or Biome).
  - **Renovate** using Sanity's published preset, so the template stays current.
- Docs: rewrite `README.md` (stack, env vars, scripts, Studio URL/Draft Mode flow, **pnpm**); update `.env.example` files (`SANITY_API_READ_TOKEN`, `NEXT_PUBLIC_SITE_URL`, `SANITY_REVALIDATE_SECRET`); refresh `docs/`.
- **Delete** the vendored `.github/instructions/sanity-rules.instructions.md` in favour of the official `sanity-best-practices` agent skill.

---

### Phase 8 — Verification & release *(merge to `main`)*

- Full matrix on **Node 24**:
  - `pnpm --filter frontend typecheck && pnpm --filter frontend lint && pnpm --filter frontend build`
  - `pnpm --filter studio build` + `npx sanity versions`
  - `sanity typegen generate` produces no diff
  - `npx @sanity/template-validator` passes
  - Playwright smoke + Vitest pass
- Manual: both locales, click-to-edit, draft preview + disable, publish→live, image optimization, analytics consent, RSS, forms.
- Deploy: `sanity deploy` (Studio) and the frontend on Vercel (root `frontend`); re-check CORS.
- **Release:** merge `upgrade/2026` → `main`, tag `v3.0.0`, retire `origin/v3` (tag `archive/v3-skeleton`).

---

## 6. Verification commands / root scripts

```jsonc
{
  "scripts": {
    "dev": "turbo run dev",
    "dev:frontend": "pnpm --filter frontend dev",
    "dev:studio": "pnpm --filter studio dev",
    "typecheck": "turbo run typecheck",
    "lint": "turbo run lint",
    "build": "turbo run build",
    "format": "prettier --write .",
    "test": "turbo run test",
    "typegen": "pnpm --filter studio typegen",
    "verify": "pnpm typecheck && pnpm lint && pnpm build && pnpm test"
  }
}
```

The Turborepo pipeline lives in `turbo.json`. `studio` provides `"typecheck": "tsc --noEmit"` and `"typegen": "sanity schema extract --enforce-required-fields --path=../frontend/src/sanity/extract.json && sanity typegen generate"`.

---

## 7. Breaking-change reference

**Next 16:** async `params`/`searchParams` only · `middleware`→`proxy` (Node runtime, not edge) · `next lint` removed · ESLint flat config · image defaults (`qualities`, `minimumCacheTTL`, `imageSizes`, `maximumRedirects`, `localPatterns.search`) · `priority`→`preload` · `revalidateTag(tag, profile)` · `updateTag` (Server Actions only) · `cacheLife`/`cacheTag` stable · PPR flag → `cacheComponents` · AMP + runtime config removed · `experimental.dynamicIO`/`useCache` removed · parallel-route `default.js` required · dev output `.next/dev`.

**Sanity:** v4 = Node 20.19+ · v5 = React 19.2.2+, TypeGen naming changes, smart typography on · v6 = Node 22.12+, React strict mode, `auth.providers` replace-by-default, `search.strategy` `groq2024`, Vite 8/Rolldown.

**Plugins/UI:** `document-internationalization@6` (+ `internationalized-array@5.3.2`, `@sanity/assist`, `@sanity/language-filter`), `code-input@7`, `unsplash@7`, `@sanity/icons@5`, no React 18 plugins · `@sanity/image-url@2`, `lucide-react@1`, `react-day-picker@10`, `date-fns@4`, `posthog-node@5`, consolidated `radix-ui`.

---

## 8. Risks & mitigations

| Risk | Mitigation |
| --- | --- |
| i18n peer chain (`internationalized-array@5.3.2` → `@sanity/assist`, `@sanity/language-filter`) | Install all three explicitly; **never** `--force`/`--legacy-peer-deps`. Verify the `language` field + translation flow end-to-end. |
| `stega` leaking into logic/DOM | `stegaClean` on logic strings; dev-only `onSuspiciousStega`; Playwright snapshots in Phase 0.5. |
| TypeGen v5 hoisting/casing renames | Regenerate and review the diff in its own commit. |
| `language` ↔ route-segment mismatch | Keep `en`/`pt-BR`; `locale.tag` must equal the segment; test both locales in Phase 4. |
| React 19 + `react-code-blocks` | Replace with `shiki` if it breaks. |
| TypeScript 7 | Not used — 6.0.3 is the lint-compatible ceiling. |
| Cache Components | Deferred to a separate PR. |
| Branch divergence | `upgrade/2026` short-lived; rebase `main` per phase; prep on `main` first. |

---

## 9. PR sequence & release

**Prep PRs into `main`** (independent, land immediately, keep trunk green):
1. `chore: pnpm workspaces + Turborepo + engines + scripts` (Phase 0)
2. `chore: CI (typecheck/lint/build) + Playwright smoke + Lighthouse baseline` (Phase 0.5)
3. `fix: declare direct deps, env validation, remove console.*` (Phase 0)

**Breaking PRs into `upgrade/2026`** (one per phase, rebase `main` in between):
4. `feat(studio): upgrade to Sanity v6 (+ React 19.2, Node 24)` (Phase 1)
5. `feat(web): upgrade to Next 16 + React 19.2, proxy + flat ESLint` (Phase 2)
6. `feat(web): next-sanity v13 + TypeGen, typed queries` (Phase 3)
7. `feat: Live Content API + Visual Editing + Presentation + Draft Mode` (Phase 4)
8. `perf: ISR + CDN + tag revalidation + sitemap/robots/JSON-LD/OG` (Phase 5)
9. `chore(deps): shadcn v4 refresh, consolidated radix-ui, lucide v1, day-picker v10` (Phase 6)
10. `feat: RSS + forms + redirects, docs and formatting` (Phase 7)

**Release:** merge `upgrade/2026` → `main`, tag `v3.0.0`, deploy Studio + frontend, retire `origin/v3`.

---

## 10. Sources (official docs, read 2026-10-07)

- **Sanity:** [v3→v4](https://www.sanity.io/docs/help/v3-to-v4) · [v4→v5](https://www.sanity.io/docs/help/v4-to-v5) · [v5→v6](https://www.sanity.io/docs/help/v5-to-v6) · [Upgrading Studio](https://www.sanity.io/docs/studio/upgrade) · [React 19 and Sanity](https://www.sanity.io/docs/help/react-19) · [TypeGen](https://www.sanity.io/docs/apis-and-sdks/sanity-typegen) · [TypeGen in sanity.cli.ts](https://www.sanity.io/docs/help/configuring-typegen-in-sanity-cli-config) · [Querying content in Next.js](https://www.sanity.io/docs/nextjs/query-content-nextjs) · [Caching & revalidation](https://www.sanity.io/docs/nextjs/caching-and-revalidation-in-nextjs) · [Visual Editing with Next.js App Router](https://www.sanity.io/docs/visual-editing/visual-editing-with-next-js-app-router) · [Troubleshooting Visual Editing](https://www.sanity.io/docs/visual-editing/troubleshooting-visual-editing) · [Embedding Studio in Next.js](https://www.sanity.io/docs/nextjs/embedding-sanity-studio-in-nextjs) · [Live Content guide](https://www.sanity.io/docs/developer-guides/live-content-guide).
- **Next.js (16.4):** [Upgrading to v16](https://nextjs.org/docs/app/guides/upgrading/version-16) · [Next.js 16 release](https://nextjs.org/blog/next-16) · [ESLint](https://nextjs.org/docs/app/api-reference/config/eslint) · [Internationalization](https://nextjs.org/docs/app/guides/internationalization) · [proxy.js](https://nextjs.org/docs/app/api-reference/file-conventions/proxy) · [Image](https://nextjs.org/docs/app/api-reference/components/image) · [revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag) · [updateTag](https://nextjs.org/docs/app/api-reference/functions/updateTag) · [use cache](https://nextjs.org/docs/app/api-reference/directives/use-cache) · [Third Party Libraries](https://nextjs.org/docs/app/guides/third-party-libraries).
- **shadcn/ui:** [CLI](https://ui.shadcn.com/docs/cli) · [Monorepo](https://ui.shadcn.com/docs/monorepo) · [MCP](https://ui.shadcn.com/docs/mcp).
