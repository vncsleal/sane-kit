'use client'

import { useIsPresentationTool } from 'next-sanity/hooks'
import { useRouter } from 'next/navigation'
import { useEffect, useTransition } from 'react'
import { toast } from 'sonner'

import { disableDraftMode } from '@/app/actions/draft'

/**
 * Draft-mode indicator. Inside the Presentation tool the Studio owns Draft Mode
 * and no toast is shown; when the frontend is opened directly, a persistent
 * toast offers to leave Draft Mode.
 */
export default function DraftModeToast() {
  const isPresentationTool = useIsPresentationTool()
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    if (isPresentationTool === false) {
      const toastId = toast('Draft Mode Enabled', {
        description: 'Content is live, refreshing automatically',
        duration: Infinity,
        action: {
          label: 'Disable',
          onClick: async () => {
            await disableDraftMode()
            startTransition(() => {
              router.refresh()
            })
          },
        },
      })
      return () => {
        toast.dismiss(toastId)
      }
    }
  }, [router, isPresentationTool])

  useEffect(() => {
    if (pending) {
      const toastId = toast.loading('Disabling draft mode...')
      return () => {
        toast.dismiss(toastId)
      }
    }
  }, [pending])

  return null
}
