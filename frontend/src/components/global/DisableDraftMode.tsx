'use client'

import { useTransition } from 'react'
import { useIsPresentationTool } from 'next-sanity/hooks'

import { disableDraftMode } from '@/app/actions/draft'

/**
 * Floating "exit preview" button. Hidden inside the Presentation tool (the
 * Studio controls Draft Mode there); shown only when the frontend is opened
 * directly. Invokes a Server Action from a click handler — never a form, so
 * nothing can submit it unintentionally.
 */
export function DisableDraftMode() {
  const isPresentationTool = useIsPresentationTool()
  const [pending, startTransition] = useTransition()

  if (isPresentationTool) return null

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await disableDraftMode()
        })
      }
      className="fixed bottom-4 right-4 z-50 rounded-full bg-gray-900 px-4 py-2 text-sm text-white shadow-lg"
    >
      Sair do preview
    </button>
  )
}
