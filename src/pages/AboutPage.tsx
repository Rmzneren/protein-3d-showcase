import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Link } from 'react-router-dom'
import { Sparkles, Microscope, ShieldCheck, Leaf, Users, Rocket, Award, FileCheck2, BadgeCheck } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { revealOnScroll } from '../utils/scrollReveal'

const BRAND = '#ff5722'
const BRAND_RGBA = 'rgba(255, 87, 34, 0.18)'

// İkonlar (dile bağlı olmayan kısım) — metinler t.about.values/certifications'tan index'e göre gelir.
const VALUE_ICONS = [Microscope, ShieldCheck, Leaf, Users]
const CERT_ICONS = [Award, FileCheck2, BadgeCheck, ShieldCheck]

export function AboutPage() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { t } = useLanguage()

    useEffect(() => {
        const root = containerRef.current
        if (!root) return

        gsap.fromTo('.hero-reveal',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
        )

        const cleanups = [
            revealOnScroll(root, '.scroll-reveal'),
            revealOnScroll(root, '.value-card', { stagger: 0.12, y: 24 }),
            revealOnScroll(root, '.timeline-item', { stagger: 0.1, y: 24 }),
            revealOnScroll(root, '.cert-card', { stagger: 0.08, y: 20 }),
        ]

        return () => cleanups.forEach((fn) => fn())
    }, [])

    return (
        <div
            ref={containerRef}
            style={{ minHeight: '100vh', background: '#050505', color: '#fff', fontFamily: 'sans-serif', overflowX: 'hidden' }}
        >
            {/* --- HERO --- */}
            <div style={{ position: 'relative', padding: '100px 20px 60px', textAlign: 'center', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '560px', height: '400px', background: `radial-gradient(circle, ${BRAND_RGBA} 0%, transparent 70%)`, pointerEvents: 'none' }} />
                <div className="hero-reveal" style={{ position: 'relative', maxWidth: '720px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: BRAND, fontSize: '13px', fontWeight: 900, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>
                        <Sparkles size={15} />
                        <span>{t.about.hero.eyebrow}</span>
                    </div>
                    <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, marginBottom: '18px', letterSpacing: '-1.5px', lineHeight: 1.1 }}>
                        {t.about.hero.title}
                    </h1>
                    <p style={{ color: '#999', lineHeight: 1.7, fontSize: '16px' }}>
                        {t.about.hero.body}
                    </p>
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px 100px' }}>

                {/* --- HİKAYE --- */}
                <div className="scroll-reveal" style={{ maxWidth: '760px', margin: '0 auto 110px' }}>
                    <h2 style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 900, marginBottom: '24px', letterSpacing: '-0.5px', textAlign: 'center' }}>
                        {t.about.story.title}
                    </h2>
                    {t.about.story.paragraphs.map((p, i) => (
                        <p key={i} style={{ color: '#aaa', fontSize: '15.5px', lineHeight: 1.8, marginBottom: '18px' }}>{p}</p>
                    ))}
                </div>

                {/* --- DEĞERLER --- */}
                <div className="scroll-reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '110px' }}>
                    {VALUE_ICONS.map((Icon, i) => (
                        <div key={i} className="value-card" style={{ background: '#111', padding: '32px', borderRadius: '20px', border: '1px solid #222' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: BRAND_RGBA, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                                <Icon size={22} color={BRAND} />
                            </div>
                            <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '8px' }}>{t.about.values[i].title}</h3>
                            <p style={{ color: '#888', fontSize: '13.5px', lineHeight: 1.6, margin: 0 }}>{t.about.values[i].desc}</p>
                        </div>
                    ))}
                </div>

                {/* --- KİLOMETRE TAŞLARI (TIMELINE) --- */}
                <div style={{ marginBottom: '110px' }}>
                    <div className="scroll-reveal" style={{ textAlign: 'center', marginBottom: '50px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: BRAND, fontSize: '13px', fontWeight: 900, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '14px' }}>
                            <Rocket size={14} />
                            <span>{t.about.timeline.eyebrow}</span>
                        </div>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, margin: 0, letterSpacing: '-1px' }}>{t.about.timeline.title}</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
                        {t.about.timeline.items.map((item, i) => (
                            <div
                                key={i}
                                className="timeline-item"
                                style={{ position: 'relative', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '28px 24px' }}
                            >
                                <span style={{ color: BRAND, fontWeight: 900, fontSize: '22px', letterSpacing: '-0.5px' }}>{item.year}</span>
                                <h3 style={{ fontSize: '15.5px', fontWeight: 800, margin: '10px 0 8px' }}>{item.title}</h3>
                                <p style={{ color: '#888', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- SERTİFİKALAR --- */}
                <div style={{ marginBottom: '110px' }}>
                    <h2 className="scroll-reveal" style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 900, textAlign: 'center', marginBottom: '40px', letterSpacing: '-1px' }}>
                        {t.about.certifications.title}
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                        {CERT_ICONS.map((Icon, i) => (
                            <div key={i} className="cert-card" style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#111', border: '1px solid #222', borderRadius: '16px', padding: '20px' }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: BRAND_RGBA, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Icon size={20} color={BRAND} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: '14px', marginBottom: '2px' }}>{t.about.certifications.items[i].label}</div>
                                    <div style={{ color: '#888', fontSize: '12px', lineHeight: 1.5 }}>{t.about.certifications.items[i].desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- KAPANIŞ CTA --- */}
                <div className="scroll-reveal" style={{ textAlign: 'center', background: `linear-gradient(135deg, ${BRAND_RGBA}, transparent)`, border: '1px solid rgba(255,87,34,0.25)', borderRadius: '24px', padding: '56px 24px' }}>
                    <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 34px)', fontWeight: 900, marginBottom: '14px', letterSpacing: '-1px' }}>{t.about.cta.title}</h2>
                    <p style={{ color: '#999', fontSize: '15px', maxWidth: '480px', margin: '0 auto 28px' }}>{t.about.cta.body}</p>
                    <Link
                        to="/"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: BRAND, color: '#fff', textDecoration: 'none', fontWeight: 800, fontSize: '13.5px', padding: '14px 32px', borderRadius: '30px' }}
                    >
                        {t.about.cta.button}
                    </Link>
                </div>
            </div>
        </div>
    )
}
