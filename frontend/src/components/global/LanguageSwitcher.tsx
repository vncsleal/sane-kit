"use client";

import React, { useContext, useEffect, useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LanguageContext } from './LanguageProvider';
import { i18n, type Locale } from '@/i18n/i18n-config';
import { getTranslationMetadata } from '@/sanity/client';
import { getDictionary } from '@/i18n/getDictionary';
import type { Dictionary } from '@/i18n/getDictionary';

interface LanguageSwitcherProps {
  variant?: 'default' | 'minimal';
  documentId?: string;
}

export function LanguageSwitcher({ variant = 'default', documentId }: LanguageSwitcherProps) {
  const context = useContext(LanguageContext);
  const [availableUrls, setAvailableUrls] = useState<Record<string, string>>({});
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);
  
  if (!context) {
    throw new Error('LanguageSwitcher must be used within a LanguageProvider');
  }
  
  const { locale, switchLanguage } = context;

  // Fetch dictionary based on current locale
  useEffect(() => {
    const loadDictionary = async () => {
      try {
        const dict = await getDictionary(locale);
        setDictionary(dict);
      } catch (error) {
        console.error('Failed to load dictionary:', error);
        // Fallback dictionary
        setDictionary({
          header: {
            languageSwitcher: 'Language Switcher',
            languages: {
              en: 'English',
              'pt-BR': 'Português'
            }
          }
        } as Dictionary);
      }
    };

    loadDictionary();
  }, [locale]);

  useEffect(() => {
    if (documentId) {
      getTranslationMetadata({ documentId }).then(({ getUrlsMap }) => {
        setAvailableUrls(getUrlsMap());
      });
    }
  }, [documentId]);

  const handleLanguageChange = (newLocale: Locale) => {
    if (newLocale !== locale) {
      switchLanguage(newLocale);
    }
  };

  // Don't render until dictionary is loaded
  if (!dictionary) {
    return null;
  }

  const renderMenuItem = (lang: Locale) => {
    const isCurrentLocale = locale === lang;
    const hasTranslation = !documentId || availableUrls[lang];
    
    return (
      <DropdownMenuItem
        key={lang}
        onClick={() => handleLanguageChange(lang)}
        className={isCurrentLocale ? "bg-muted" : ""}
        disabled={!hasTranslation && !isCurrentLocale}
      >
        {dictionary.header.languages[lang]}
        {!hasTranslation && !isCurrentLocale && (
          <span className="ml-2 text-xs text-muted-foreground">(não disponível)</span>
        )}
      </DropdownMenuItem>
    );
  };

  const triggerButton = variant === 'minimal' ? (
    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
      <Globe className="h-4 w-4" />
      <span className="sr-only">{dictionary.header.languageSwitcher}</span>
    </Button>
  ) : (
    <Button variant="outline" size="default" className="gap-2">
      <Globe className="h-4 w-4" />
      <span className="hidden sm:inline">{dictionary.header.languages[locale]}</span>
      <ChevronDown className="h-3 w-3" />
    </Button>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {triggerButton}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {i18n.locales.map(renderMenuItem)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
