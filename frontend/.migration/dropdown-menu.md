# dropdown-menu

2026-10-09 — transformation engine (legacy `new-york` style); whole-project mode — migrated cleanly; DropdownMenu → Base UI Menu.

## Changed

- `src/components/ui/dropdown-menu.tsx` — import → `@base-ui/react/menu`.
  - `Content`/`SubContent` → `Portal > Positioner > Popup`; positioning props
    (`align`/`alignOffset`/`side`/`sideOffset`) declared, destructured and
    forwarded to the Positioner.
  - Part renames: `Label` → `GroupLabel`, `ItemIndicator` →
    `CheckboxItemIndicator` / `RadioItemIndicator`, `Sub` → `SubmenuRoot`,
    `SubTrigger` → `SubmenuTrigger`.
  - `data-[state=closed]:` → `data-closed:`, `data-[state=open]:` → `data-open:`;
    `data-[disabled]:` → `data-disabled:`; SubTrigger open marker →
    `data-popup-open:`.
  - CSS vars: `--radix-dropdown-menu-content-available-height` →
    `--available-height`, `--radix-dropdown-menu-content-transform-origin` →
    `--transform-origin`.
  - `SubContent` defaults set to `align="start" alignOffset={-3} side="right"
sideOffset={0}` (the load-bearing submenu defaults) while keeping its own
    class list and `shadow-lg`.
- `blog/BlogShareButton.tsx` — `DropdownMenuTrigger asChild` → `render`.
- `global/LanguageSwitcher.tsx` — trigger `asChild` → `render={triggerButton}`;
  `<DropdownMenuItem asChild><Link/></DropdownMenuItem>` →
  `<DropdownMenuItem render={<Link/>}>`.
- Leftover scan: `grep -n "radix-ui\|@radix-ui"` → clean.

## Left alone

- `DropdownMenuGroup`, `DropdownMenuRadioGroup`, `DropdownMenuShortcut` are
  exported but unused; migrated for completeness.
- `sonner`, `command` are not Radix and untouched.

## Behavior changes

- FLAG (not patched): Base UI `CheckboxItem`/`RadioItem` default
  `closeOnClick=false` (Radix closed on select). This app does not use those item
  types, so no visible effect. Plain `Item` still closes on click (matches Radix).
- `loopFocus` now defaults to `true` (was `false`); `modal` still defaults `true`.
- Main `Content` `align` kept at `center` (Radix default) rather than the base
  registry's `start`, preserving current positioning.
- `onSelect` → `onClick` + `closeOnClick` for item selection (documented).

## Verify by hand

- Blog post: click "Share" → menu opens under the button; click a platform → the
  menu closes and the action runs.
- Footer language switcher: open → items show; the current locale is disabled;
  clicking another locale navigates and the menu closes.
- Keyboard: open with Enter, arrow through items, Escape closes and returns focus
  to the trigger.
