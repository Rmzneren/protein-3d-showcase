import { useContext } from 'react'
import { LanguageContext } from '../context/languageStore'

export function useLanguage() {
    const ctx = useContext(LanguageContext)
    if (!ctx) throw new Error('useLanguage, LanguageProvider içinde kullanılmalı')
    return ctx
}
