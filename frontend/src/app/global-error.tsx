'use client'

import { useEffect } from 'react'

import { logger } from '@/lib/logger'

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    logger.error('Global error', { message: error.message, digest: error.digest })
  }, [error])

  return (
    <html lang="pt-BR">
      <body>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Algo deu errado</h1>
          <button
            type="button"
            onClick={() => retry()}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: '1px solid currentColor',
              cursor: 'pointer',
            }}
          >
            Tentar novamente
          </button>
        </div>
      </body>
    </html>
  )
}
