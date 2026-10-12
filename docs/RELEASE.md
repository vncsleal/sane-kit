# Release & publish (Sanity Exchange)

How Sane-Kit is released and listed in the [Sanity Exchange](https://www.sanity.io/exchange/type=templates)
template gallery.

## How Sanity templates are published

A Sanity template is a **public GitHub repository** that passes
[`@sanity/template-validator`](https://github.com/sanity-io/template-validator)
and is then **submitted through the Community Studio** for review. There is no
build artifact to publish — the Exchange lists the repo, and users scaffold it
with the Sanity CLI:

```bash
npm create sanity@latest -- --template vncsleal/sane-kit
```

> Sane-Kit uses the **Exchange template** flow. The separate `sanity.io/create`
> "starter" flow — a `.sanity-template/manifest.json` (v2) in a repo named
> `sanity-template-*` — is for one-click _deployment_ templates. We are not on
> that path.

## What the validator checks

Run it locally; CI runs it too via `.github/workflows/validate.yml`.

```bash
pnpm validate   # sanity-template-validate
```

In short, it requires:

- A `package.json` depending on `sanity` / `next-sanity` / `@sanity/client`.
- `sanity.config.ts` and `sanity.cli.ts` in the Studio.
- `.env.example` files declaring the project id and dataset.
- A `README.md` containing a **Getting Started** section.

## Release checklist

1. **Green gates**

   ```bash
   pnpm verify                       # typecheck + lint + build + test
   pnpm validate                     # sanity-template-validate
   pnpm typegen && git diff --exit-code frontend/src/sanity/types.ts
   pnpm --filter studio build
   pnpm --filter frontend test:e2e
   ```

2. **Version & changelog** — update [`CHANGELOG.md`](../CHANGELOG.md) and bump
   the version/tag.

3. **Preview image** — `docs/preview.png`, **1200 × 750**, referenced from the
   README and used on the Exchange card. It is a marketing frame composed from a
   real screenshot of the deployed frontend hero (captured with Playwright at 2×
   and scaled to the exact Exchange size), so it reflects the actual template
   rather than a mockup. Re-capture after a visual redesign:

   ```bash
   SITE_URL=https://sane-kit-demo.vercel.app/en pnpm --filter frontend preview:image
   ```

   (Swap in a Studio Presentation-tool screenshot if the listing should showcase
   Visual Editing instead of the frontend.)

4. **GitHub release** — tag the release commit and publish notes.

5. **Exchange submission** (Community Studio → _Submit template_):

   | Field         | Value                                                                      |
   | ------------- | -------------------------------------------------------------------------- |
   | Title         | Sane-Kit                                                                   |
   | Description   | Sanity + Next.js starter kit with a page-builder, i18n, and Visual Editing |
   | Slug          | `sane-kit` (page under `sanity.io/templates`)                              |
   | Repository    | `https://github.com/vncsleal/sane-kit` (must be public)                    |
   | Preview image | the 1200 × 750 image from step 3                                           |
   | Author(s)     | a Sanity community profile that already exists                             |
   | Frameworks    | Next.js, Tailwind CSS                                                      |
   | Use case(s)   | Website / Blog                                                             |

6. **Deploy**

   - Studio: `pnpm --filter studio deploy`
   - Frontend: Vercel, **Root Directory `frontend/`**, env from
     `frontend/.env.example`.
   - Re-check the project's **CORS origins** (with _Allow credentials_) for the
     deployed frontend origin.

## Project setup as code (Blueprints)

`sanity.blueprint.ts` (repo root) declares the resources a project needs — the
frontend/Studio CORS origins — so a fresh project is configured from code
instead of dashboard clicks. It is validated in CI via
`pnpm typecheck:blueprint`, and the illustrative Sanity Function in
`functions/derive-excerpt` is deployed with it.

One-time, per project:

```bash
# Creates the local Stack config and the remote Stack (keeps the repo's blueprint file)
pnpm exec sanity blueprints init . --type ts --project-id <project-id> --stack-name production
```

Then preview and apply:

```bash
SANITY_PROJECT_ID=<id> pnpm blueprint:plan
SANITY_PROJECT_ID=<id> pnpm blueprint:deploy
```

This replaces the manual "add CORS origins" step. On-demand revalidation is
handled by `<SanityLive />`, so no webhook is declared.

## Post-release

- Keep dependencies and best practices current (see `docs/UPGRADE-PLAN.md`).
- The Portuguese variant lives at `vncsleal/sane-kit-br`; keep its content and
  dependencies in step with this repo.
