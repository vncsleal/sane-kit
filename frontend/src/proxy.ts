import {match} from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import {NextResponse, type NextRequest} from 'next/server'

import {i18n} from '@/i18n/i18n-config'

/**
 * Locale negotiation per the Next.js internationalization guide:
 * `@formatjs/intl-localematcher` + `negotiator` over `Accept-Language`.
 * Replaces the previous hand-rolled parser. Runs on the Node runtime (Next 16 proxy).
 */
function getLocale(request: NextRequest): string {
  const headers = {'accept-language': request.headers.get('accept-language') ?? ''}
  const languages = new Negotiator({headers}).languages()
  return match(languages, [...i18n.locales], i18n.defaultLocale)
}

export function proxy(request: NextRequest) {
  const {pathname} = request.nextUrl

  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  )

  if (pathnameHasLocale) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-pathname', pathname)
    return NextResponse.next({request: {headers: requestHeaders}})
  }

  const locale = getLocale(request)
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    '/((?!api|studio|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|rss.xml|manifest.json).*)',
  ],
}
