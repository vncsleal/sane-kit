// Replace root page to redirect users to the detected locale
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
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

export default async function RootPage() {
  const headersList = await headers();
  let detectedLocale: Locale = i18n.defaultLocale;

  try {
    // Try to get country from headers (this works in production with Vercel)
    const country = headersList.get('x-vercel-ip-country');
    
    if (country) {
      detectedLocale = getLocaleFromCountry(country);
    } else {
      // Fallback to Accept-Language header
      const acceptLanguage = headersList.get('accept-language');
      if (acceptLanguage) {
        detectedLocale = getLocaleFromAcceptLanguage(acceptLanguage);
      }
    }
  } catch (error) {
    // If headers are not available (e.g., in static generation), use default
    console.warn('Could not detect locale from headers, using default:', error);
  }

  redirect(`/${detectedLocale}`);
}
