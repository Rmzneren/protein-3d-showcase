import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Link } from 'react-router-dom'
import { ChevronDown, HelpCircle, Truck, RotateCcw, CreditCard, Package } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { revealOnScroll } from '../utils/scrollReveal'

const BRAND = '#ff5722'
const BRAND_RGBA = 'rgba(255, 87, 34, 0.18)'

// Kategori ikonları (dile bağlı olmayan kısım) — t.help.categories'teki sırayla eşleşir:
// Kargo & Teslimat, İade & Değişim, Ödeme, Sipariş & Hesap.
const CATEGORY_ICONS = [Truck, RotateCcw, CreditCard, Package]

export function HelpPage() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { t } = useLanguage()
    // Sayfa açıldığında ilk kategorinin ilk sorusu açık gelir (bkz. NutritionPage'deki FAQ deseni).
    const [openKey, setOpenKey] = useState<string | null>('0-0')

    useEffect(() => {
        const root = containerRef.current
        if (!root) return

        gsap.fromTo('.hero-reveal',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
        )

        const cleanups = [
            revealOnScroll(root, '.scroll-reveal'),
            revealOnScroll(root, '.help-category', { stagger: 0.12, y: 24 }),
        ]

        return () => cleanups.forEach((fn) => fn())
    }, [])

    return (
        <div
            ref={containerRef}
            style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', overflowX: 'hidden' }}
        >
            {/* --- HERO --- */}
            <div style={{ position: 'relative', padding: '100px 20px 60px', textAlign: 'center', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '560px', height: '360px', background: `radial-gradient(circle, ${BRAND_RGBA} 0%, transparent 70%)`, pointerEvents: 'none' }} />
                <div className="hero-reveal" style={{ position: 'relative', maxWidth: '640px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: BRAND, fontSize: '13px', fontWeight: 900, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>
                        <HelpCircle size={15} />
                        <span>{t.help.hero.eyebrow}</span>
                    </div>
                    <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, marginBottom: '16px', letterSpacing: '-1.5px' }}>{t.help.hero.title}</h1>
                    <p style={{ color: '#8a8a8a', lineHeight: 1.7, fontSize: '15.5px' }}>{t.help.hero.body}</p>
                </div>
            </div>

            <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 20px 100px' }}>
                {t.help.categories.map((cat, ci) => {
                    const Icon = CATEGORY_ICONS[ci]
                    return (
                        <div key={ci} className="help-category scroll-reveal" style={{ marginBottom: '48px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: BRAND_RGBA, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Icon size={18} color={BRAND} />
                                </div>
                                <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>{cat.title}</h2>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {cat.items.map((item, ii) => {
                                    const key = `${ci}-${ii}`
                                    const isOpen = openKey === key
                                    const buttonId = `help-button-${key}`
                                    const panelId = `help-panel-${key}`
                                    return (
                                        <div
                                            key={ii}
                                            style={{ background: '#111', border: `1px solid ${isOpen ? BRAND : '#222'}`, borderRadius: '14px', overflow: 'hidden', transition: 'border-color 0.3s ease' }}
                                        >
                                            <button
                                                id={buttonId}
                                                onClick={() => setOpenKey(isOpen ? null : key)}
                                                aria-expanded={isOpen}
                                                aria-controls={panelId}
                                                style={{
                                                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                    gap: '14px', background: 'transparent', border: 'none', cursor: 'pointer',
                                                    padding: '16px 20px', textAlign: 'left', color: '#fff', fontSize: '14px', fontWeight: 700,
                                                }}
                                            >
                                                <span>{item.q}</span>
                                                <ChevronDown
                                                    size={16}
                                                    color={BRAND}
                                                    aria-hidden="true"
                                                    style={{ flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}
                                                />
                                            </button>
                                            <div
                                                id={panelId}
                                                role="region"
                                                aria-labelledby={buttonId}
                                                style={{ maxHeight: isOpen ? '220px' : '0px', transition: 'max-height 0.35s ease', overflow: 'hidden' }}
                                            >
                                                <p style={{ margin: 0, padding: '0 20px 18px', color: '#999', fontSize: '13.5px', lineHeight: 1.7 }}>{item.a}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}

                <div className="scroll-reveal" style={{ textAlign: 'center', marginTop: '20px' }}>
                    <p style={{ color: '#999', fontSize: '14px', marginBottom: '14px' }}>{t.help.cta.text}</p>
                    <Link
                        to="/contact"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: BRAND, color: '#fff', textDecoration: 'none', fontWeight: 800, fontSize: '13.5px', padding: '12px 26px', borderRadius: '26px' }}
                    >
                        {t.help.cta.linkText}
                    </Link>
                </div>
            </div>
        </div>
    )
}
