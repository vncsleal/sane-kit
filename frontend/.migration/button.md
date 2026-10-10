# button

2026-10-09 — transformation engine (legacy `new-york` style, no base counterpart); whole-project mode — migrated cleanly to the real `@base-ui/react/button` primitive.

## Changed

- `src/components/ui/button.tsx` — swapped `import {Slot} from 'radix-ui'` for
  `import {Button as ButtonPrimitive} from '@base-ui/react/button'`; replaced the
  `asChild`/`Slot.Root` idiom with the Base UI Button primitive (which accepts
  `render` natively, per the skill's hard rule); removed the `asChild` prop.
  Classes are byte-for-byte the project's own; only `data-slot`/`data-variant`/
  `data-size` are preserved.
- Consumers split by intent:
  - Real buttons (no navigation) keep `<Button>` and simply move `asChild` →
    `render`: `blog/CodeBlock.tsx` (TooltipTrigger), `blog/BlogShareButton.tsx`
    (DropdownMenuTrigger), `global/LanguageSwitcher.tsx` (DropdownMenuTrigger),
    `sections/contact/defaultContact.tsx` (PopoverTrigger), and the four
    `SheetTrigger`s.
  - Buttons used as LINKS (an `<a>`/next `Link`) do **not** use the Base UI
    Button `render` at all: Base UI Button always applies `role="button"`, which
    overrides the native link role. Per shadcn's official guidance ("As Link —
    use `buttonVariants` with a plain `<a>`"; PR "fix(base-ui): preserve native
    link semantics") every link call site now renders a `<Link>` styled with
    `cn(buttonVariants({...}), className)`: `blog/AuthorPageUI.tsx`,
    `blog/BlogPostPage.tsx`, `blog/CategoryPageUI.tsx`, `global/NotFound.tsx`,
    `global/header/{centered,default,transparent,shared}.tsx`,
    `sections/{blog,compareFeatures,cta/full,cta/shared,faq,hero/shared,hero/buttonBanner,pricing/default}/shared.tsx`.
    For the nav menu the `NavigationMenuLink` itself owns the `<a>` and receives
    `className={buttonVariants({variant: 'ghost'})}`.
- Leftover scan: `grep -n "radix-ui\|@radix-ui"` on this component's files → clean.

## Left alone

- `calendar.tsx`, `carousel.tsx`, `pagination.tsx`, `ThemeToggle.tsx`,
  `ScrollToTopButton.tsx`, `CookieConsent.tsx`, `newsletter/shared.tsx` import
  Button but never used `asChild`; they compile unchanged.
- `command` (cmdk), `drawer` (vaul), `sonner`, `input-otp`, `calendar`
  (react-day-picker), `chart` (recharts) are not Radix and were intentionally
  untouched.

## Behavior changes

- Universal `asChild` → `render` (documented in `consumer-props.md`).
- FLAG / deliberate divergence: the skill's one-line `asChild` → `render` rule is
  NOT applied to buttons-as-links. Base UI's Button forces `role="button"` on any
  non-`<button>` render target, so a link rendered through it loses its native
  link role. Links are therefore styled with `buttonVariants` on the `<a>`/`Link`
  instead (verified: nav anchors now have `href` and no `role="button"`).
- Base UI Button (real buttons) is the same `<button>` element with the same
  classes; no visual change expected.

## Verify by hand

- Click each header CTA, hero CTA, FAQ/CTA/blog "view all" button: the whole
  control is a link and navigates.
- Tab to a button and press Enter/Space: action fires once.
- Disabled buttons (carousel prev/next when at an end) do not fire and look
  dimmed.
