import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Lang } from '../i18n/types'
import { DEFAULT_LANG } from '../i18n/types'
import { translations } from '../i18n/translations'
import { LanguageContext, type LanguageContextValue } from './languageStore'

const STORAGE_KEY = 'protein3d-lang'

function readStoredLang(): Lang {
    if (typeof window === 'undefined') return DEFAULT_LANG
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored === 'tr' || stored === 'en' ? stored : DEFAULT_LANG
}

// Site genelindeki dil seçimini (TR/EN) tutar ve localStorage'da kalıcı hale getirir.
// Sayfa her yüklendiğinde son seçilen dille açılır; hiçbir tarayıcı dili otomatik
// algılaması yapılmaz (öngörülebilirlik için) — varsayılan her zaman Türkçe'dir.
export function LanguageProvider({ children }: { children: ReactNode }) {
    const [lang, setLangState] = useState<Lang>(readStoredLang)

    useEffect(() => {
        document.documentElement.lang = lang
        window.localStorage.setItem(STORAGE_KEY, lang)
    }, [lang])

    const setLang = useCallback((next: Lang) => setLangState(next), [])
    const toggleLang = useCallback(() => setLangState((prev) => (prev === 'tr' ? 'en' : 'tr')), [])

    const value: LanguageContextValue = useMemo(
        () => ({ lang, t: translations[lang], setLang, toggleLang }),
        [lang, setLang, toggleLang]
    )

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
