export interface RedirectDoc {
  source: string
  destination: string
  permanent?: string | null
}

export interface NextRedirect {
  source: string
  destination: string
  permanent: boolean
}

/** Map a Sanity `redirect` document to a Next.js redirect rule. */
export function toNextRedirect(doc: RedirectDoc): NextRedirect {
  return {
    source: doc.source,
    destination: doc.destination,
    permanent: doc.permanent !== 'false',
  }
}
