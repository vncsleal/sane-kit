# navigation-menu

2026-10-09 — transformation engine (legacy `new-york` style); whole-project mode — migrated cleanly; heavily restructured per the skill.

## Changed

- `src/components/ui/navigation-menu.tsx` — import →
  `@base-ui/react/navigation-menu`.
  - The Radix `viewport` boolean prop is dropped (skill: nav-menu `viewport`
    prop gone). `NavigationMenu` now always renders a `NavigationMenuPositioner`
    (`Portal > Positioner > Popup > Viewport`) instead of a conditional shared
    viewport.
  - `Indicator` → `Icon` (kept the `navigation-menu-indicator` data-slot and its
    classes; the `data-[state=hidden|visible]` hooks are inert on Icon).
  - Trigger open marker `data-[state=open]` → `data-popup-open` (in
    `navigationMenuTriggerStyle` and the chevron rotation).
  - Link `data-[active=true]` → `data-active`.
  - CSS vars: `--radix-navigation-menu-viewport-{width,height}` →
    `--popup-{width,height}`; `--positioner-*`, `--available-width`,
    `--transform-origin` used on the Positioner/Popup.
  - `data-[motion=...]` slide classes are kept but are inert; Base UI exposes
    `data-activation-direction` instead. Popup animation uses
    `data-starting-style`/`data-ending-style` scale/opacity transitions.
- `global/header/{centered,default,transparent}.tsx` — the nested
  `NavigationMenuLink asChild > Button asChild > Link` composition became
  `NavigationMenuLink render={<Button nativeButton={false} render={<Link/>} />}`.
- Leftover scan: `grep -n "radix-ui\|@radix-ui"` → clean.

## Left alone

- `NavigationMenuViewport` remains exported as the inner clipping Viewport.
  `NavigationMenuPositioner` is newly exported.

## Behavior changes

- FLAG: the popup is now positioned against the active trigger (Positioner
  defaults `side="bottom" sideOffset={8} align="start"`) instead of the old
  single shared, centered viewport below the whole list. This is the intended
  Base UI model; verify the dropdown sits correctly under each nav item.
- FLAG: hover-open delay default changed from Radix `200ms` to Base UI `50ms`.
- FLAG: `NavigationMenuIndicator` no longer tracks the active trigger along the
  list — Base UI's `Icon` is a chevron inside the trigger. The component is
  unused in this app, so no visible effect; kept as an inert-ish passthrough.
- `value`/`onValueChange` are now `Value | null` (`null` = closed); uncontrolled
  usage unchanged.

## Verify by hand

- On a desktop viewport with a header dropdown item, hover/click the trigger: the
  panel opens below it, hover the other trigger: the panel switches.
- Click a link inside the panel: it navigates.
- Keyboard: Tab to a trigger, Enter opens, arrow keys move between items,
  Escape closes.
