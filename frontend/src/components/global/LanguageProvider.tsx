"use client";

import React, { createContext, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getTranslationMetadata } from '@/sanity/client';
import type { Locale } from '@/i18n/i18n-config';

interface LanguageContextType {
  locale: Locale;
  switchLanguage: (newLocale: Locale) => void;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
  locale: Locale;
}

export function LanguageProvider({ children, locale }: LanguageProviderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = useCallback(async (newLocale: Locale) => {
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    const pathParts = pathWithoutLocale.split('/').filter(Boolean);
    
    if (pathParts.length > 0) {
      const lastSlug = pathParts[pathParts.length - 1];
      
      try {
        const { findTranslationByLanguage } = await getTranslationMetadata({
          slug: lastSlug,
          currentLanguage: locale
        });
        
        const targetTranslation = findTranslationByLanguage(newLocale);
        
        if (targetTranslation?.value?.slug?.current) {
          const newPathParts = [...pathParts];
          newPathParts[newPathParts.length - 1] = targetTranslation.value.slug.current;
          router.push(`/${newLocale}/${newPathParts.join('/')}`);
          return;
        }
      } catch (error) {
        console.warn('Translation lookup failed:', error);
      }
    }
    
    router.push(`/${newLocale}${pathWithoutLocale}`);
  }, [locale, pathname, router]);

  return (
    <LanguageContext.Provider value={{ locale, switchLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
