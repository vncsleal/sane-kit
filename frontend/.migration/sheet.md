# sheet

2026-10-09 — transformation engine (legacy `new-york` style); whole-project mode — migrated cleanly; slide animations rewritten to Base UI transitions.

## Changed

- `src/components/ui/sheet.tsx` — import → `@base-ui/react/dialog`.
  - `Overlay` → `Backdrop`; `Content` → `Popup`. `Root`/`Trigger`/`Close`/
    `Portal`/`Title`/`Description` keep their names.
  - Backdrop: `data-[state=closed]:animate-out … data-[state=open]:animate-in …`
    → `transition-opacity duration-150 data-ending-style:opacity-0
data-starting-style:opacity-0`.
  - Popup: keyframe slide utilities rewritten as transitions with explicit
    per-side translate — right `translate-x-full`, left `-translate-x-full`,
    top `-translate-y-full`, bottom `translate-y-full` (the previous
    `slide-in-from-*`/`slide-out-to-*` used 100% distances, preserved). Open
    500ms / close 300ms preserved via `duration-500` +
    `data-ending-style:duration-300`.
  - `SheetClose` `data-[state=open]:bg-secondary` → `data-open:bg-secondary`
    (inert on Close, kept for mechanical parity).
- `global/header/{centered,transparent,minimal,default}.tsx` —
  `<SheetTrigger asChild><Button …/></SheetTrigger>` →
  `<SheetTrigger render={<Button … />}>…</SheetTrigger>`.
- Leftover scan: `grep -n "radix-ui\|@radix-ui"` → clean.

## Left alone

- `vaul`/drawer is not Radix and was not touched.

## Behavior changes

- Enter/exit is now a CSS transition driven by `data-starting-style`/
  `data-ending-style` rather than tw-animate keyframes. Duration and translate
  distances are preserved; the mechanism differs. Flagged per the skill's sheet
  guidance.
- The Backdrop now fades via opacity transition (was keyframe fade); same feel.

## Verify by hand

- Narrow the window to mobile width, click the hamburger: the sheet slides in
  from the right over a dark backdrop.
- Press Escape / click the backdrop / click the X: it slides out and focus
  returns to the trigger.
- Open the mobile menu on the `transparent` header at the top of the page: the
  trigger colors still match.
