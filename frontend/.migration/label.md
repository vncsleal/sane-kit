# label

2026-10-09 — transformation engine (legacy `new-york` style); whole-project mode — migrated cleanly to a native `<label>`.

## Changed

- `src/components/ui/label.tsx` — Radix `Label.Root` has no Base UI counterpart
  (skill: "Label -> native `<label>`"). Replaced the primitive with a plain
  `<label>`; the type becomes `React.ComponentProps<'label'>`. Classes and
  `data-slot="label"` unchanged.
- Leftover scan: `grep -n "radix-ui\|@radix-ui"` → clean.

## Left alone

- `sections/contact/defaultContact.tsx` — five `<Label htmlFor=...>` call sites
  keep working unchanged (native label supports `htmlFor`).

## Behavior changes

- Radix Label suppressed text selection on double-click as a side effect; the
  wrapper already carries `select-none`, which covers the same case. No
  functional change observed.

## Verify by hand

- On `/pt-BR/contato`, click each field label: focus moves to its input
  (`date`, `firstName`, `lastName`, `email`, `files`).
- Double-click a label: no text selection highlight.
