import { useEffect, useState } from 'react'

// Kullanıcının işletim sistemi/tarayıcı seviyesinde "hareketi azalt" tercihini
// canlı olarak takip eder. GSAP animasyonlarını ve custom cursor'ı bu tercihe
// göre kısaltmak/kapatmak için kullanılır (a11y + Lighthouse "best practices").
export function usePrefersReducedMotion(): boolean {
    const [prefersReduced, setPrefersReduced] = useState(
        () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )

    useEffect(() => {
        const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
        const onChange = () => setPrefersReduced(mql.matches)
        mql.addEventListener('change', onChange)
        return () => mql.removeEventListener('change', onChange)
    }, [])

    return prefersReduced
}
