# ADR 0001 — UI primitives: Base UI (migrated from Radix)

Status: **accepted** (2026)

## Context

The `components/ui/*` layer is shadcn/ui. shadcn made **Base UI the default**
component library in **July 2026**; Radix remains fully supported and is not
deprecated. shadcn's own guidance is explicit: _"You do not need to migrate.
Radix is a mature, tested library… If your app works, keep shipping."_ — and they
still run Radix in production.

Sane-Kit is a **starter kit**: people copy it into new projects, so aligning with
shadcn's current default is worth more here than it would be in a long-lived app.

## Decision

Adopt **Base UI** (`@base-ui/react`) as the UI primitive library, and remove
`radix-ui`, following shadcn's official `migrate-radix-to-base` skill.

Because `components.json` used the legacy `new-york` style — which has **no Base
UI counterpart** — the migration used the skill's **transformation engine** (keep
the project's own files and classes, rewire primitives) rather than retargeting
onto a `base-*` style, which would have restyled the app.

## Consequences

- `@base-ui/react` replaces `radix-ui`; no Radix imports remain in `src`.
- `asChild` becomes `render`. Buttons rendered as links deliberately use a plain
  `<Link>` styled with `buttonVariants(...)` instead of Base UI's `render`,
  because Base UI forces `role="button"` onto anchors (an accessibility
  regression). This follows shadcn's official "As Link" guidance.
- Behaviour differences flagged by the skill (not silently patched) are recorded
  in the migration reports and summarised in the commit: navigation-menu
  anchoring/hover delay, accordion value arrays, overlay animations moved from
  keyframes to transitions.
- A permanent Playwright guard (`frontend/e2e/console-errors.spec.ts`) asserts
  there are no hydration mismatches on the rendered pages.

## References

- shadcn changelog: https://ui.shadcn.com/docs/changelog/2026-07-base-ui-default
- Official skill: `shadcn-ui/ui/skills/migrate-radix-to-base`
- Base UI: https://base-ui.com
