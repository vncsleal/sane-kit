import { disableDraftMode } from '@/app/actions/draft'

/**
 * Visible only inside Sanity's Presentation iframe (draft mode). Submits a
 * Server Action that disables draft mode and redirects home.
 */
export function DisableDraftMode() {
  return (
    <form action={disableDraftMode}>
      <button
        type="submit"
        className="fixed bottom-4 left-4 z-50 rounded-md bg-black/80 px-3 py-2 text-xs font-medium text-white shadow-lg"
      >
        Sair do preview
      </button>
    </form>
  )
}
