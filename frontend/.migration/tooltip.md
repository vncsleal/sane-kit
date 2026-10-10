# tooltip

2026-10-09 — transformation engine (legacy `new-york` style); whole-project mode — migrated cleanly; positioner model introduced.

## Changed

- `src/components/ui/tooltip.tsx` — import → `@base-ui/react/tooltip`.
  - `Provider` `delayDuration` → `delay` (default kept at `0`).
  - `Content` → `Portal > Positioner > Popup`; `side`/`sideOffset`/`align`/
    `alignOffset` are declared, destructured and forwarded to the Positioner
    (the "Pick means FORWARD" rule).
  - `data-[state=closed]:` → `data-closed:`; `animate-in`/`fade-in-0`/
    `zoom-in-95` gated on `data-open:` (Base UI keeps the popup mounted).
  - `--radix-tooltip-content-transform-origin` → `--transform-origin`.
  - `Arrow` is now a Base UI `<div>`; kept the 2.5 rotated square plus explicit
    per-side positioning classes (Base UI does not position the arrow like Radix).
- `blog/CodeBlock.tsx` — `<TooltipTrigger asChild><Button …/></TooltipTrigger>` →
  `<TooltipTrigger render={<Button … />}>…</TooltipTrigger>`.
- Leftover scan: `grep -n "radix-ui\|@radix-ui"` → clean.

## Left alone

- No other Tooltip consumers.

## Behavior changes

- Default `sideOffset` kept at `0` (the shadcn base registry defaults to `4`); the
  project's original spacing is preserved, so no visible change.
- `disableHoverableContent` has no Base UI equivalent (renamed
  `disableHoverablePopup` on Root); not used here.
- The arrow element changed from `<svg>` (Radix) to `<div>` (Base UI); the
  `fill-foreground` class is now inert but harmless.

## Verify by hand

- On a blog post, hover the code copy button: the tooltip appears above it with
  the arrow centered, then disappears on mouse-out.
- Focus the copy button with the keyboard: tooltip still shows.
