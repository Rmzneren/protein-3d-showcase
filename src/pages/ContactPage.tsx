import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Mail, MapPin, Phone, Send, Clock, Globe, Share2, MessageCircle, Sparkles } from 'lucide-react'
import { srOnlyStyle } from '../utils/a11y'
import { revealOnScroll } from '../utils/scrollReveal'

const BRAND = '#ff5722'
const BRAND_RGBA = 'rgba(255, 87, 34, 0.18)'

const CONTACT_METHODS = [
    { icon: Mail, label: 'E-posta', value: 'hello@brand.com' },
    { icon: Phone, label: 'Telefon', value: '+90 555 000 00 00' },
    { icon: MapPin, label: 'Adres', value: 'Tekirdağ, Türkiye' },
]

const WORKING_HOURS = [
    { day: 'Pazartesi – Cuma', hours: '09:00 – 18:00' },
    { day: 'Cumartesi', hours: '10:00 – 16:00' },
    { day: 'Pazar', hours: 'Kapalı' },
]

const SOCIALS = [
    { icon: Globe, label: 'Web sitemiz' },
    { icon: Share2, label: 'Bizi paylaşın' },
    { icon: MessageCircle, label: 'Bize mesaj gönderin' },
]

const MINI_FAQ = [
    { q: 'Ne kadar sürede yanıt alırım?', a: 'Mesajlarınıza genellikle 24 saat içinde dönüş yapıyoruz.' },
    { q: 'Toplu sipariş için indirim var mı?', a: 'Evet, 10+ adet siparişlerde özel fiyatlandırma sunuyoruz — bize yazın.' },
]

export function ContactPage() {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const root = containerRef.current
        if (!root) return

        gsap.fromTo('.anim-item',
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
        )

        const cleanups = [
            revealOnScroll(root, '.contact-scroll-reveal'),
            revealOnScroll(root, '.method-card', { stagger: 0.1, y: 24 }),
        ]

        return () => cleanups.forEach((fn) => fn())
    }, [])

    return (
        <div
            ref={containerRef}
            style={{
                minHeight: '100vh',
                background: '#0a0a0a',
                color: '#fff',
                overflow: 'hidden',
            }}
        >
            {/* --- HERO --- */}
            <div style={{ position: 'relative', padding: '90px 20px 20px', textAlign: 'center', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-15%', left: '50%', transform: 'translateX(-50%)', width: '560px', height: '360px', background: `radial-gradient(circle, ${BRAND_RGBA} 0%, transparent 70%)`, pointerEvents: 'none' }} />
                <div className="anim-item" style={{ position: 'relative', maxWidth: '640px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: BRAND, fontSize: '13px', fontWeight: 900, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>
                        <Sparkles size={15} />
                        <span>Bize Ulaşın</span>
                    </div>
                    <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, marginBottom: '16px', letterSpacing: '-1.5px' }}>İletişime Geçin</h2>
                    <p style={{ color: '#8a8a8a', lineHeight: 1.7, fontSize: '15.5px' }}>
                        Sorularınız mı var veya iş birliği mi yapmak istiyorsunuz? Size yardımcı olmaktan mutluluk duyarız.
                    </p>
                </div>
            </div>

            {/* --- İLETİŞİM YÖNTEMİ KARTLARI --- */}
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '30px 20px 0' }}>
                <div className="method-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                    {CONTACT_METHODS.map((m, i) => (
                        <div
                            key={i}
                            className="method-card"
                            style={{
                                background: '#111', border: '1px solid #222', borderRadius: '18px', padding: '24px',
                                display: 'flex', alignItems: 'center', gap: '16px',
                            }}
                        >
                            <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: BRAND_RGBA, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <m.icon size={20} color={BRAND} />
                            </div>
                            <div>
                                <div style={{ color: '#888', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{m.label}</div>
                                <div style={{ fontWeight: 700, fontSize: '14.5px' }}>{m.value}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- ANA GRID: BİLGİ PANELİ + FORM --- */}
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 20px 100px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '40px' }}>

                    {/* Sol: Çalışma saatleri + sosyal medya */}
                    <div className="contact-scroll-reveal" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ background: '#111', border: '1px solid #222', borderRadius: '20px', padding: '28px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                                <Clock size={18} color={BRAND} />
                                <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0 }}>Çalışma Saatleri</h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {WORKING_HOURS.map((w, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', color: '#ccc' }}>
                                        <span style={{ color: '#888' }}>{w.day}</span>
                                        <span style={{ fontWeight: 700 }}>{w.hours}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ background: '#111', border: '1px solid #222', borderRadius: '20px', padding: '28px' }}>
                            <h3 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '16px' }}>Bizi Sosyal Medyada Takip Edin</h3>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {SOCIALS.map(({ icon: Icon, label }, i) => (
                                    <a
                                        key={i}
                                        href="#"
                                        onClick={(e) => e.preventDefault()}
                                        aria-label={label}
                                        style={{
                                            width: '40px', height: '40px', borderRadius: '50%',
                                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: '#fff', transition: 'background 0.2s, border-color 0.2s',
                                        }}
                                    >
                                        <Icon size={17} />
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div style={{ background: `linear-gradient(135deg, ${BRAND_RGBA}, transparent)`, border: `1px solid rgba(255,87,34,0.25)`, borderRadius: '20px', padding: '28px' }}>
                            <h3 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '14px' }}>Hızlı Sorular</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                {MINI_FAQ.map((f, i) => (
                                    <div key={i}>
                                        <div style={{ fontSize: '13.5px', fontWeight: 700, marginBottom: '4px' }}>{f.q}</div>
                                        <div style={{ fontSize: '13px', color: '#999', lineHeight: 1.6 }}>{f.a}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sağ: Form */}
                    <div className="contact-scroll-reveal" style={{ background: '#111', padding: '40px', borderRadius: '20px', border: '1px solid #222', height: 'fit-content' }}>
                        <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '20px' }}>Bize Mesaj Gönderin</h3>
                        <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <label htmlFor="contact-name" style={srOnlyStyle}>Adınız</label>
                            <input id="contact-name" name="name" type="text" autoComplete="name" placeholder="Adınız" style={{ background: '#0a0a0a', border: '1px solid #333', padding: '15px', borderRadius: '10px', color: '#fff' }} />

                            <label htmlFor="contact-email" style={srOnlyStyle}>E-posta</label>
                            <input id="contact-email" name="email" type="email" autoComplete="email" placeholder="E-posta" style={{ background: '#0a0a0a', border: '1px solid #333', padding: '15px', borderRadius: '10px', color: '#fff' }} />

                            <label htmlFor="contact-message" style={srOnlyStyle}>Mesajınız</label>
                            <textarea id="contact-message" name="message" placeholder="Mesajınız" rows={5} style={{ background: '#0a0a0a', border: '1px solid #333', padding: '15px', borderRadius: '10px', color: '#fff', resize: 'none' }} />

                            <button
                                type="button"
                                style={{
                                    padding: '15px', borderRadius: '10px', border: 'none', background: BRAND, color: '#fff', fontWeight: 800, cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'filter 0.2s ease',
                                }}
                            >
                                Gönder <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
