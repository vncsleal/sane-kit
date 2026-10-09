'use client'

import {useEffect} from 'react'

import {logger} from '@/lib/logger'

export default function Error({
  error,
  retry,
}: {
  error: Error & {digest?: string}
  retry: () => void
}) {
  useEffect(() => {
    logger.error('Route error', {message: error.message, digest: error.digest})
  }, [error])

  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold">Algo deu errado</h1>
      <p className="text-muted-foreground">Não foi possível carregar esta página.</p>
      <button
        type="button"
        onClick={() => retry()}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        Tentar novamente
      </button>
    </div>
  )
}
