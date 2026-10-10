# project

2026-10-09 — whole-project Radix UI → Base UI migration.

Strategy: `components.json` uses the legacy `new-york` style, which has no Base
UI counterpart (no `base-new-york`). Per the skill, the app was NOT retargeted
onto a `base-*` style. Instead the **transformation engine** was run on the
project's own files: primitives were rewired to `@base-ui/react`, the exact
classes were kept, class-mapping renames were applied, and consumers were swept
against `consumer-props.md` (`asChild` → `render`). The shadcn `base-nova`
registry was consulted only for structure/animation idiom, never for class copy.

## Dependency swap

- Added `@base-ui/react@1.6.0` (the version the migration skill's reference
  tables were validated against).
- Removed `radix-ui@^1.7.0` after the last wrapper was migrated and every
  consumer was repointed.
- `pnpm-lock.yaml` updated by `pnpm`.

## Wrappers migrated (10)

accordion, avatar, badge, button, dropdown-menu, label, navigation-menu,
popover, sheet, tooltip — see the per-component files in this directory.

## Intentionally untouched (not Radix)

`calendar.tsx` (react-day-picker), `carousel.tsx` (embla-carousel-react),
`sonner.tsx` (sonner), `input.tsx`, `card.tsx`, `pagination.tsx`. No `command`
(cmdk) or `drawer` (vaul) wrapper exists in this project.

## App-code sweep

Every `asChild` in `src` was repointed. Real buttons (dropdown/popover/sheet/
tooltip triggers) use `render`; buttons that navigate to a link render a plain
`<Link>` styled with `buttonVariants` (NOT Base UI Button `render`, which would
force `role="button"` onto the anchor — see `button.md`).
`sections/faq/shared.tsx` dropped `type="single" collapsible`. Files touched:
`blog/{AuthorPageUI,BlogPostPage,BlogShareButton,CategoryPageUI,CodeBlock}.tsx`,
`global/{LanguageSwitcher,NotFound}.tsx`,
`global/header/{centered,default,minimal,transparent,shared}.tsx`,
`sections/{blog,compareFeatures,cta/full,cta/shared,faq,hero/buttonBanner,hero/shared,pricing/default}/shared.tsx`,
`sections/contact/defaultContact.tsx`.

Derived status: `grep -rn "radix-ui\|@radix-ui" frontend/src` returns nothing —
**0 wrappers remain on Radix**.

## Verification (all green)

- `pnpm --filter frontend exec tsc --noEmit` — pass
- `pnpm --filter frontend lint` — pass
- `pnpm --filter frontend exec prettier --check .` — pass
- `NEXT_TELEMETRY_DISABLED=1 pnpm --filter frontend build` — pass
- `pnpm --filter frontend test` — 5 files / 20 tests pass
- `pnpm --filter frontend test:e2e` — 10 tests pass

Baseline before the migration was fully green, so no failure is pre-existing.

Additionally, a temporary Playwright spec (since removed) exercised the migrated
primitives at runtime and passed: nav links keep `href`/link role, language-
switcher menu, share menu, copy tooltip, date popover, accordion expand, desktop
navigation menu, mobile sheet, avatar.

## Flagged behaviour differences (never silently patched)

- DropdownMenu `CheckboxItem`/`RadioItem` no longer close on click by default
  (`closeOnClick=false`); unused here.
- Tooltip `disableHoverableContent` has no equivalent; unused here.
- Popover `PopoverAnchor` is an inert passthrough (no Base UI Anchor part).
- Navigation menu: per-trigger anchored popup (vs. the old shared centered
  viewport), hover delay 200ms → 50ms, and the diamond Indicator no longer
  tracks the active trigger (unused).
- Accordion: `type`/`collapsible` dropped; values are always arrays.
- Sheet/Tooltip/Popover/menu enter-exit animations are transition-based
  (`data-starting-style`/`data-ending-style`) instead of tw-animate keyframes;
  durations and distances preserved.
- Universal `asChild` → `render` — except buttons-as-links, which use
  `buttonVariants` on the link to preserve native link semantics (Base UI Button
  forces `role="button"`).
