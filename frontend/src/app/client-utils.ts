'use client'

import { isCorsOriginError } from 'next-sanity/live'
import { toast } from 'sonner'

import { logger } from '@/lib/logger'

export function handleError(error: unknown) {
  if (isCorsOriginError(error)) {
    const { addOriginUrl } = error
    toast.error("Sanity Live couldn't connect", {
      description: 'Your origin is blocked by CORS policy',
      duration: Infinity,
      action: addOriginUrl
        ? {
            label: 'Manage',
            onClick: () => window.open(addOriginUrl.toString(), '_blank'),
          }
        : undefined,
    })
  } else if (error instanceof Error) {
    logger.error(error.name, { message: error.message })
    toast.error(error.name, { description: error.message, duration: Infinity })
  } else {
    logger.error('Unknown error', { error: String(error) })
    toast.error('Unknown error', {
      description: 'Check the console for more details',
      duration: Infinity,
    })
  }
}
