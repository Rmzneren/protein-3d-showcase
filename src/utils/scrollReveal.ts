import gsap from 'gsap'

interface RevealOptions {
    y?: number
    duration?: number
    stagger?: number
    ease?: string
    threshold?: number
}

// IntersectionObserver tabanlı "scroll'da belir" yardımcı fonksiyonu.
// GSAP'ın ScrollTrigger eklentisi bu projede (React StrictMode + SPA route değişimleri
// altında) tween'lerin yarıda donup kalmasına yol açtığı için (bkz. proje notları),
// onun yerine native IntersectionObserver + doğrudan gsap.to() kullanılıyor — her eleman
// görünüme girdiğinde bir kez oynatılır, sonra gözlemden çıkarılır.
export function revealOnScroll(root: HTMLElement | null, selector: string, options: RevealOptions = {}) {
    if (!root) return () => { }
    const { y = 36, duration = 0.7, stagger = 0, ease = 'power3.out', threshold = 0.15 } = options
    const elements = Array.from(root.querySelectorAll<HTMLElement>(selector))
    if (elements.length === 0) return () => { }

    gsap.set(elements, { opacity: 0, y })

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return
                const el = entry.target as HTMLElement
                const index = elements.indexOf(el)
                gsap.to(el, { opacity: 1, y: 0, duration, ease, delay: stagger * Math.max(index, 0) })
                observer.unobserve(el)
            })
        },
        { threshold }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
}

// Bir eleman görünüme girdiğinde tek seferlik bir callback tetikler (sayaç/çubuk
// animasyonları gibi opacity/y dışı efektler için).
export function onEnterView(root: HTMLElement | null, target: HTMLElement | null, callback: () => void, threshold = 0.2) {
    if (!root || !target) return () => { }
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return
                callback()
                observer.unobserve(entry.target)
            })
        },
        { threshold }
    )
    observer.observe(target)
    return () => observer.disconnect()
}
