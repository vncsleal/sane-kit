import Link from 'next/link'

/**
 * Shown only inside Sanity's Presentation iframe (draft mode). A plain link to
 * the disable route — deliberately not a form/Server Action, so nothing can
 * submit it unintentionally.
 */
export function DisableDraftMode() {
  return (
    <Link
      href="/api/draft-mode/disable"
      prefetch={false}
      className="fixed bottom-4 left-4 z-50 rounded-md bg-black/80 px-3 py-2 text-xs font-medium text-white shadow-lg"
    >
      Sair do preview
    </Link>
  )
}
