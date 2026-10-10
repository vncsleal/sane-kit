# avatar

2026-10-09 — transformation engine (legacy `new-york` style); whole-project mode — migrated cleanly; near 1:1.

## Changed

- `src/components/ui/avatar.tsx` — swapped the import to
  `import {Avatar as AvatarPrimitive} from '@base-ui/react/avatar'`. Parts
  (`Root`/`Image`/`Fallback`) and all classes are unchanged. Types moved from
  `React.ComponentProps<typeof X>` to `X.Props`. `AvatarImage`/`AvatarFallback`/
  `AvatarBadge`/`AvatarGroup`/`AvatarGroupCount` keep their exact markup.
- Leftover scan: `grep -n "radix-ui\|@radix-ui"` → clean.

## Left alone

- `testimonials/shared.tsx`, `testimonials/carousel.tsx`, `blog/shared.tsx`,
  `blog/AuthorPageUI.tsx`, `blog/BlogIndexPageUI.tsx`, `blog/CategoryPageUI.tsx`,
  `blog/BlogPostPage.tsx` — all consume Avatar without Radix-only props; only the
  `src`/`alt`/initials API is used. No edits required.

## Behavior changes

- `Fallback.delayMs` → `delay` (renamed). Not used anywhere in this app.
- Base UI `Image` emits `data-starting-style`/`data-ending-style`; no consumer
  depends on those.

## Verify by hand

- Author avatars on a blog post / author page show the photo; missing images fall
  back to initials without layout shift.
- Resize: avatars stay circular and sized (`sm`/`default`/`lg`).
