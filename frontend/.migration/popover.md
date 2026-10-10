# popover

2026-10-09 — transformation engine (legacy `new-york` style); whole-project mode — migrated cleanly; positioner model introduced.

## Changed

- `src/components/ui/popover.tsx` — import → `@base-ui/react/popover`.
  - `Content` → `Portal > Positioner > Popup`; `align`/`alignOffset`/`side`/
    `sideOffset` declared, destructured and forwarded to the Positioner.
  - `data-[state=closed]:` → `data-closed:`; `data-[state=open]:` → `data-open:`.
  - `--radix-popover-content-transform-origin` → `--transform-origin`.
  - `PopoverTitle`/`PopoverDescription` now use the real Base UI
    `Title`/`Description` parts (they were already `<div>`/`<p>` helpers).
  - `PopoverAnchor` has no Base UI counterpart (skill: "inert passthrough +
    flag"). Kept as an exported `<div>` passthrough so imports compile; it no
    longer influences anchoring.
- `sections/contact/defaultContact.tsx` — `<PopoverTrigger asChild><Button …/>`
  → `<PopoverTrigger render={<Button … />}>…</PopoverTrigger>`.
- Leftover scan: `grep -n "radix-ui\|@radix-ui"` → clean.

## Left alone

- `PopoverHeader` is a plain layout div; unchanged.

## Behavior changes

- `PopoverAnchor` is inert: to anchor elsewhere, pass `anchor` to the Positioner
  (not surfaced by this wrapper). No call site uses `PopoverAnchor`.
- Default `align` kept `center`, `sideOffset` kept `4` — matches the previous
  Radix behavior.

## Verify by hand

- On `/pt-BR/contato`, click the date field: the calendar popover opens below the
  button, aligned, and closes on outside click / Escape.
- Pick a date: it fills the trigger and the popover closes.
