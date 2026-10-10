# accordion

2026-10-09 — transformation engine (legacy `new-york` style); whole-project mode — migrated cleanly; height animation reimplemented on the Base UI CSS var.

## Changed

- `src/components/ui/accordion.tsx` — import → `@base-ui/react/accordion`.
  - `Content` → `Panel`.
  - Trigger open marker `[&[data-state=open]>svg]` → `[&[data-panel-open]>svg]`;
    `disabled:*` → `aria-disabled:*` (Base UI surfaces disabled state as
    `aria-disabled` on the trigger).
  - Height animation: the tw-animate `data-[state=closed]:animate-accordion-up
data-[state=open]:animate-accordion-down` utilities read
    `--radix-accordion-content-height`, which Base UI does not set. Replaced with
    the Base UI mechanism: the Panel gets `group/accordion-content`, and the
    inner div gets `h-(--accordion-panel-height)` plus
    `group-data-starting-style/accordion-content:h-0` /
    `group-data-ending-style/accordion-content:h-0` and a 200ms height
    transition (same duration/easing as before).
- `sections/faq/shared.tsx` — `<Accordion type="single" collapsible>` →
  `<Accordion>`: Base UI single mode is the default and is always collapsible.
- Leftover scan: `grep -n "radix-ui\|@radix-ui"` → clean.

## Left alone

- `AccordionItem value={item._key}` is kept; Base UI `value` accepts any value.
- No other consumer.

## Behavior changes

- `type="single"|"multiple"` and `collapsible` are gone. `value`/`defaultValue`/
  `onValueChange` are ALWAYS arrays in Base UI. This app uses the uncontrolled
  form only, so no call-site change was needed; a future controlled consumer must
  wrap values in arrays.
- `collapsible={false}` (forbid closing the last item) has no direct equivalent;
  not used here.
- Animation is now a CSS height transition (was a keyframe on the Radix var).
  Duration/easing preserved; visually equivalent.

## Verify by hand

- On the home page FAQ, click a question: it expands, the chevron rotates, other
  items close (single mode).
- Click the open question again: it collapses.
- Keyboard: Tab to a trigger, press Enter/Space toggles it.
