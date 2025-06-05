import { NextRequest, NextResponse } from 'next/server';
import { i18n, type Locale } from '@/i18n/i18n-config';

// Function to get the best locale based on country
function getLocaleFromCountry(country: string): Locale {
  // pt-BR for Brazil, 'en' for everywhere else
  return country === 'BR' ? 'pt-BR' : 'en';
}

// Function to get the best locale based on Accept-Language header
function getLocaleFromAcceptLanguage(acceptLanguage: string): Locale {
  const preferredLanguages = acceptLanguage
    .split(',')
    .map(lang => {
      const [code, quality = '1'] = lang.trim().split(';q=');
      return { code: code.toLowerCase(), quality: parseFloat(quality) };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const { code } of preferredLanguages) {
    // Check for exact match (e.g., "pt-BR")
    if (i18n.locales.includes(code as Locale)) {
      return code as Locale;
    }
    
    // Check for language match (e.g., "pt" matches "pt-BR")
    const languageCode = code.split('-')[0];
    const matchingLocale = i18n.locales.find(locale => 
      locale.toLowerCase().startsWith(languageCode)
    );
    
    if (matchingLocale) {
      return matchingLocale;
    }
  }
  
  return i18n.defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check if the pathname already starts with a locale
  const pathnameHasLocale = i18n.locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // If the path already has a locale, continue without modification
  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Only redirect the root path and paths that don't have a locale
  if (pathname === '/' || (!pathnameHasLocale && !pathname.startsWith('/_next') && !pathname.startsWith('/api'))) {
    let detectedLocale: Locale = i18n.defaultLocale;

    // Try to get country from Vercel's geolocation header
    const country = request.headers.get('x-vercel-ip-country');
    
    if (country) {
      detectedLocale = getLocaleFromCountry(country);
    } else {
      // Fallback to Accept-Language header
      const acceptLanguage = request.headers.get('accept-language');
      if (acceptLanguage) {
        detectedLocale = getLocaleFromAcceptLanguage(acceptLanguage);
      }
    }

    // Check if user has a stored locale preference
    const userLocalePreference = request.cookies.get('user-locale')?.value as Locale | undefined;
    if (userLocalePreference && i18n.locales.includes(userLocalePreference)) {
      detectedLocale = userLocalePreference;
    }

    // Redirect to the detected locale
    const redirectUrl = new URL(`/${detectedLocale}${pathname === '/' ? '' : pathname}`, request.url);
    
    // Add a cookie to remember the detected locale for future visits
    const response = NextResponse.redirect(redirectUrl);
    if (!userLocalePreference) {
      response.cookies.set('user-locale', detectedLocale, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        httpOnly: false, // Allow client-side access for language switcher
        sameSite: 'lax',
      });
    }
    
    return response;
  }

  return NextResponse.next();
}

export const config = {
  // Match all paths except:
  // - API routes
  // - Next.js internal files
  // - Static files (images, etc.)
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json).*)',
  ],
};
