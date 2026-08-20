import { Link } from 'react-router-dom'
import { Sparkles, Globe, Share2, MessageCircle, Mail, MapPin, Phone } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'

const SOCIAL_ICONS = [Globe, Share2, MessageCircle]

// Site genelinde her sayfanın altında görünen ortak footer.
export function Footer() {
    const { t } = useLanguage()
    return (
        <footer style={{
            width: '100%',
            background: '#050505',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            padding: 'clamp(48px, 6vw, 72px) 5% 28px',
            boxSizing: 'border-box',
            color: '#fff'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '40px',
                paddingBottom: '40px'
            }}>
                {/* Marka */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px', fontWeight: 900, letterSpacing: '1.5px', marginBottom: '16px' }}>
                        <Sparkles size={20} color="#ff5722" />
                        <span>PROTEIN<span style={{ color: '#ff5722' }}>3D</span></span>
                    </div>
                    <p style={{ color: '#8a8a8a', fontSize: '14px', lineHeight: 1.7, maxWidth: '280px' }}>
                        {t.footer.brandBlurb}
                    </p>
                </div>

                {/* Hızlı Bağlantılar */}
                <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', color: '#fff', marginBottom: '18px' }}>
                        {t.footer.quickLinksTitle}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Link to="/" style={{ color: '#8a8a8a', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}>{t.nav.home}</Link>
                        <Link to="/nutrition" style={{ color: '#8a8a8a', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}>{t.nav.nutrition}</Link>
                        <Link to="/contact" style={{ color: '#8a8a8a', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}>{t.nav.contact}</Link>
                    </div>
                </div>

                {/* İletişim */}
                <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', color: '#fff', marginBottom: '18px' }}>
                        {t.footer.contactTitle}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#8a8a8a', fontSize: '14px' }}>
                            <Mail size={15} /> hello@brand.com
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#8a8a8a', fontSize: '14px' }}>
                            <Phone size={15} /> +90 555 000 00 00
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#8a8a8a', fontSize: '14px' }}>
                            <MapPin size={15} /> {t.contact.methods[2].value}
                        </span>
                    </div>
                </div>

                {/* Sosyal Medya */}
                <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', color: '#fff', marginBottom: '18px' }}>
                        {t.footer.followTitle}
                    </h4>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {SOCIAL_ICONS.map((Icon, i) => (
                            <a
                                key={i}
                                href="#"
                                onClick={(e) => e.preventDefault()}
                                aria-label={t.footer.socials[i].label}
                                style={{
                                    width: '38px', height: '38px', borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#fff', transition: 'background 0.2s, border-color 0.2s'
                                }}
                            >
                                <Icon size={16} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                paddingTop: '24px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px'
            }}>
                <span style={{ color: '#555', fontSize: '12px' }}>
                    {t.footer.copyright(new Date().getFullYear())}
                </span>
                <span style={{ color: '#555', fontSize: '12px' }}>
                    {t.footer.tagline}
                </span>
            </div>
        </footer>
    )
}
