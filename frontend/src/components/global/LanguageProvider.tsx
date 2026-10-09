'use client'

import React, {createContext} from 'react'
import type {Locale} from '@/i18n/i18n-config'

interface LanguageContextType {
  locale: Locale
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: React.ReactNode
  locale: Locale
}

export function LanguageProvider({children, locale}: LanguageProviderProps) {
  return <LanguageContext.Provider value={{locale}}>{children}</LanguageContext.Provider>
}
