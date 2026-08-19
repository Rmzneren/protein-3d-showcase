import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Mail, MapPin, Phone, Send } from 'lucide-react'
import { srOnlyStyle } from '../utils/a11y'

export function ContactPage() {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        gsap.fromTo('.anim-item', 
            { y: 50, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
        )
    }, [])

    return (
        <div 
            ref={containerRef}
            style={{
                minHeight: '100vh',
                padding: '80px 20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#0a0a0a',
                color: '#fff',
                overflow: 'hidden'
            }}
        >
            <div style={{ maxWidth: '1000px', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '80px' }}>
                <div className="anim-item">
                    <h2 style={{ fontSize: '42px', fontWeight: 900, marginBottom: '20px' }}>İletişime Geçin</h2>
                    <p style={{ color: '#718096', marginBottom: '40px', lineHeight: 1.6 }}>Sorularınız mı var veya iş birliği mi yapmak istiyorsunuz? Size yardımcı olmaktan mutluluk duyarız.</p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {[
                            { icon: Mail, text: 'hello@brand.com' },
                            { icon: Phone, text: '+90 555 000 00 00' },
                            { icon: MapPin, text: 'Tekirdağ, Türkiye' }
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#cbd5e0' }}>
                                <item.icon size={20} />
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="anim-item" style={{ background: '#111', padding: '40px', borderRadius: '20px', border: '1px solid #222' }}>
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
                                padding: '15px', borderRadius: '10px', border: 'none', background: '#fff', color: '#000', fontWeight: 800, cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                            }}
                        >
                            Gönder <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}