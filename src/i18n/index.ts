import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Language, Translations } from './types'
import { en } from './en'
import { ar } from './ar'

const translations: Record<Language, Translations> = { en, ar }

const STORAGE_KEY = 'saif-store-language'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
  isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'en'
  const saved = localStorage.getItem(STORAGE_KEY) as Language | null
  if (saved === 'en' || saved === 'ar') return saved
  return 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    setLanguageState(getInitialLanguage())
  }, [])

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.classList.toggle('rtl', language === 'ar')
    localStorage.setItem(STORAGE_KEY, language)

    // Update title based on language
    const title = language === 'ar' ? 'SAIF STORE — أزياء بطابع عصري' : 'SAIF STORE — Premium Editorial Fashion'
    document.title = title
  }, [language])

  const setLanguage = (lang: Language) => {
    if (lang !== 'en' && lang !== 'ar') return
    setLanguageState(lang)
  }

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
    isRTL: language === 'ar',
  }

  return React.createElement(LanguageContext.Provider, { value }, children)
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}

export function useTranslation() {
  return useLanguage()
}

// Helper for interpolation {{var}}
export function interpolate(template: string, vars: Record<string, string | number> = {}): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => String(vars[key] ?? ''))
}
