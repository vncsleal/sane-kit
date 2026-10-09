'use client'

import {ChevronDown, Globe} from 'lucide-react'
import Link from 'next/link'
import {Button} from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {i18n, type Locale} from '@/i18n/i18n-config'

interface LanguageSwitcherProps {
  variant?: 'default' | 'minimal'
  locale: Locale
  /** Server-resolved locale -> href map for the current page. */
  alternates?: Record<string, string>
  /** Localized language names, e.g. { en: "English", "pt-BR": "Português" }. */
  languageNames?: Record<string, string>
}

export function LanguageSwitcher({
  variant = 'default',
  locale,
  alternates,
  languageNames,
}: LanguageSwitcherProps) {
  const label = (lang: Locale) => languageNames?.[lang] ?? lang
  const hrefFor = (lang: Locale) => alternates?.[lang] ?? `/${lang}`

  const triggerButton =
    variant === 'minimal' ? (
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <Globe className="h-4 w-4" />
        <span className="sr-only">{label(locale)}</span>
      </Button>
    ) : (
      <Button variant="outline" size="default" className="gap-2">
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{label(locale)}</span>
        <ChevronDown className="h-3 w-3" />
      </Button>
    )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{triggerButton}</DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {i18n.locales.map((lang) => (
          <DropdownMenuItem key={lang} asChild disabled={lang === locale}>
            <Link href={hrefFor(lang)}>{label(lang)}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
