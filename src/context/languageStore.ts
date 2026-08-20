import { createContext } from 'react'
import type { Lang } from '../i18n/types'
import type { Dictionary } from '../i18n/translations'

export interface LanguageContextValue {
    lang: Lang
    t: Dictionary
    setLang: (lang: Lang) => void
    toggleLang: () => void
}

export const LanguageContext = createContext<LanguageContextValue | null>(null)
