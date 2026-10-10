# badge

2026-10-09 — transformation engine (legacy `new-york` style); whole-project mode — migrated cleanly to `useRender` + `mergeProps`.

## Changed

- `src/components/ui/badge.tsx` — Radix `Slot` (`asChild`) replaced with
  `useRender` + `mergeProps` from `@base-ui/react/use-render` /
  `@base-ui/react/merge-props` (skill's non-button polymorphic pattern). The
  `asChild` prop is replaced by `render`. `data-slot` and `data-variant` are now
  emitted through `useRender`'s `state` (`{slot, variant}`), which Base UI maps
  to `data-*` attributes — identical DOM output to the previous explicit props.
  All variant classes kept exactly.
- Leftover scan: `grep -n "radix-ui\|@radix-ui"` → clean.

## Left alone

- No Badge consumer used `asChild`, so all 18 importing files compile unchanged.

## Behavior changes

- `asChild` → `render` (universal mapping).

## Verify by hand

- Render a default and an `outline` badge (home page / FAQ section): colors and
  rounding unchanged.
- If a badge is ever rendered as a link, pass `render={<a .../>}` — the `[a&]`
  hover styles still apply.
