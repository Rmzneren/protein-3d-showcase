import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Zap, ShieldCheck, HeartPulse, Droplets, ChevronDown } from 'lucide-react'

const FAQS = [
    {
        q: 'Proteini günün hangi saatinde tüketmeliyim?',
        a: 'En yüksek verim için antrenman sonrası 30 dakika içinde tüketilmesi önerilir. Kas onarımını desteklemek amacıyla gece yatmadan önce de tüketebilirsiniz.'
    },
    {
        q: 'Laktoz intoleransım var, kullanabilir miyim?',
        a: 'Formülümüz mikro-filtrasyon teknolojisiyle üretildiği için laktoz oranı son derece düşüktür. Yine de hassasiyeti yüksek kullanıcıların doktoruna danışması önerilir.'
    },
    {
        q: 'Günde kaç ölçek tüketmeliyim?',
        a: 'Vücut ağırlığı ve aktivite seviyesine göre değişmekle birlikte, ortalama olarak günde 1-2 ölçek (25-50g) tüketim yeterlidir.'
    },
    {
        q: 'Ürün doping listesinde yasaklı madde içeriyor mu?',
        a: 'Hayır. Tüm formüllerimiz bağımsız laboratuvarlarca test edilir ve herhangi bir doping maddesi içermez.'
    },
]

export function NutritionPage() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [openFaq, setOpenFaq] = useState<number | null>(0)

    useEffect(() => {
        gsap.fromTo('.reveal',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' }
        )
    }, [])

    const features = [
        { icon: Zap, title: 'Hızlı Emilim', desc: 'Mikro-filtreli teknoloji ile kaslarınıza saniyeler içinde ulaşır.' },
        { icon: ShieldCheck, title: 'Güvenli İçerik', desc: 'Doping maddesi içermez, tamamen doğal kaynaklı formül.' },
        { icon: HeartPulse, title: 'Kalp Dostu', desc: 'Düşük kolesterol, yüksek kaliteli amino asit profili.' },
        { icon: Droplets, title: 'Hidrasyon Desteği', desc: 'Elektrolit dengesiyle antrenman performansınızı zirveye taşır.' }
    ]

    return (
        <div 
            ref={containerRef}
            style={{
                minHeight: '100vh',
                padding: '100px 40px',
                background: '#050505',
                color: '#fff',
                fontFamily: 'sans-serif'
            }}
        >
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div className="reveal" style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <h1 style={{ fontSize: '56px', fontWeight: 900, marginBottom: '20px', letterSpacing: '-2px' }}>
                        Beslenme Bilimi: <span style={{ color: '#4a90e2' }}>Saf Güç</span>
                    </h1>
                    <p style={{ color: '#888', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
                        Laboratuvar ortamında geliştirilen formülümüz, vücudunuzun ihtiyaç duyduğu her şeyi en saf haliyle sunar.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', marginBottom: '100px' }}>
                    {features.map((f, i) => (
                        <div key={i} className="reveal" style={{ background: '#111', padding: '40px', borderRadius: '24px', border: '1px solid #222' }}>
                            <f.icon size={40} color="#4a90e2" style={{ marginBottom: '20px' }} />
                            <h3 style={{ fontSize: '22px', marginBottom: '10px' }}>{f.title}</h3>
                            <p style={{ color: '#777', fontSize: '14px', lineHeight: 1.6 }}>{f.desc}</p>
                        </div>
                    ))}
                </div>

                {/* --- SIKÇA SORULAN SORULAR --- */}
                <div className="reveal" style={{ maxWidth: '760px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 900, textAlign: 'center', marginBottom: '40px', letterSpacing: '-1px' }}>
                        Sıkça Sorulan Sorular
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {FAQS.map((item, i) => {
                            const isOpen = openFaq === i
                            const buttonId = `faq-button-${i}`
                            const panelId = `faq-panel-${i}`
                            return (
                                <div
                                    key={i}
                                    style={{
                                        background: '#111', border: `1px solid ${isOpen ? '#4a90e2' : '#222'}`,
                                        borderRadius: '16px', overflow: 'hidden', transition: 'border-color 0.3s ease'
                                    }}
                                >
                                    <button
                                        id={buttonId}
                                        onClick={() => setOpenFaq(isOpen ? null : i)}
                                        aria-expanded={isOpen}
                                        aria-controls={panelId}
                                        style={{
                                            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            gap: '16px', background: 'transparent', border: 'none', cursor: 'pointer',
                                            padding: '20px 24px', textAlign: 'left', color: '#fff', fontSize: '15px', fontWeight: 700
                                        }}
                                    >
                                        <span>{item.q}</span>
                                        <ChevronDown
                                            size={18}
                                            color="#4a90e2"
                                            aria-hidden="true"
                                            style={{ flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}
                                        />
                                    </button>
                                    <div
                                        id={panelId}
                                        role="region"
                                        aria-labelledby={buttonId}
                                        style={{
                                            maxHeight: isOpen ? '200px' : '0px',
                                            transition: 'max-height 0.35s ease',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <p style={{ margin: 0, padding: '0 24px 20px', color: '#999', fontSize: '14px', lineHeight: 1.7 }}>
                                            {item.a}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}