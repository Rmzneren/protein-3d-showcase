import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import {
    Zap, ShieldCheck, HeartPulse, Droplets, ChevronDown,
    Wheat, FlaskConical, Microscope, PackageCheck, Star, Quote,
} from 'lucide-react'
import { FLAVORS } from '../data/flavors'
import { revealOnScroll, onEnterView } from '../utils/scrollReveal'

const BRAND = '#ff5722'
const BRAND_RGBA = 'rgba(255, 87, 34, 0.18)'

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

const FEATURES = [
    { icon: Zap, title: 'Hızlı Emilim', desc: 'Mikro-filtreli teknoloji ile kaslarınıza saniyeler içinde ulaşır.' },
    { icon: ShieldCheck, title: 'Güvenli İçerik', desc: 'Doping maddesi içermez, tamamen doğal kaynaklı formül.' },
    { icon: HeartPulse, title: 'Kalp Dostu', desc: 'Düşük kolesterol, yüksek kaliteli amino asit profili.' },
    { icon: Droplets, title: 'Hidrasyon Desteği', desc: 'Elektrolit dengesiyle antrenman performansınızı zirveye taşır.' },
]

const PROCESS_STEPS = [
    { icon: Wheat, step: '01', title: 'Kaynak Seçimi', desc: 'Otlatılmış inek sütünden elde edilen, sertifikalı çiftliklerden gelen ham whey ile başlıyoruz.' },
    { icon: FlaskConical, step: '02', title: 'Mikro-Filtrasyon', desc: 'Düşük ısıda çapraz akış filtrasyonuyla besin değeri korunur, laktoz oranı en aza indirilir.' },
    { icon: Microscope, step: '03', title: 'Laboratuvar Testi', desc: 'Her parti, ağır metal ve doping taraması dahil 200’den fazla parametrede bağımsız test edilir.' },
    { icon: PackageCheck, step: '04', title: 'Oksijensiz Paketleme', desc: 'Tazeliği korumak için azot ortamında, ışık geçirmez ambalajlarla mühürlenir.' },
]

const COMPARISON = [
    { label: 'Protein (ölçek başına)', ours: 27, theirs: 18, unit: 'g', max: 30 },
    { label: 'BCAA', ours: 6.2, theirs: 3.1, unit: 'g', max: 7 },
    { label: 'Şeker', ours: 0.4, theirs: 4.5, unit: 'g', max: 5 },
]

const TESTIMONIALS = [
    { initials: 'EK', name: 'Emre K.', role: 'Amatör Vücut Geliştirme', rating: 5, text: 'Çikolatalı aroma gerçekten sudan farksız karışıyor, şişkinlik yapmıyor. 3 aydır düzenli kullanıyorum, fark net.' },
    { initials: 'SA', name: 'Selin A.', role: 'Pilates Eğitmeni', rating: 5, text: 'Muzlu aromayı özellikle antrenman öncesi tercih ediyorum, mide de hiç rahatsızlık yapmıyor.' },
    { initials: 'BT', name: 'Barış T.', role: 'Amatör Triatlet', rating: 4, text: 'Berry Fusion toparlanma sürecimi belirgin şekilde hızlandırdı, düşük şeker oranı da artı puan.' },
]

export function NutritionPage() {
    const containerRef = useRef<HTMLDivElement>(null)
    const compareRef = useRef<HTMLDivElement>(null)
    const [openFaq, setOpenFaq] = useState<number | null>(0)

    useEffect(() => {
        const root = containerRef.current
        if (!root) return

        // Hero — sayfa açılışında hemen belirir
        gsap.fromTo('.hero-reveal',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
        )

        // Aşağıdaki tüm bölümler — ekrana girince belirir (bkz. utils/scrollReveal.ts)
        const cleanups = [
            revealOnScroll(root, '.scroll-reveal'),
            revealOnScroll(root, '.process-step', { stagger: 0.12, y: 24 }),
            revealOnScroll(root, '.testimonial-card', { stagger: 0.12 }),
            onEnterView(root, compareRef.current, () => {
                root.querySelectorAll<HTMLElement>('.compare-bar-ours').forEach((el) => {
                    gsap.to(el, { width: el.dataset.target, duration: 1.1, ease: 'power3.out' })
                })
                root.querySelectorAll<HTMLElement>('.compare-bar-theirs').forEach((el) => {
                    gsap.to(el, { width: el.dataset.target, duration: 1.1, ease: 'power3.out', delay: 0.15 })
                })
            }),
        ]

        return () => cleanups.forEach((fn) => fn())
    }, [])

    return (
        <div
            ref={containerRef}
            style={{
                minHeight: '100vh',
                background: '#050505',
                color: '#fff',
                fontFamily: 'sans-serif',
                overflowX: 'hidden',
            }}
        >
            {/* --- HERO --- */}
            <div style={{ position: 'relative', padding: '100px 40px 60px', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '480px', height: '480px', background: `radial-gradient(circle, ${BRAND_RGBA} 0%, transparent 70%)`, pointerEvents: 'none' }} />

                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '40px', alignItems: 'center', position: 'relative' }}>
                    <div className="hero-reveal">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: BRAND, fontSize: '13px', fontWeight: 900, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '18px' }}>
                            <FlaskConical size={16} />
                            <span>Laboratuvar Onaylı Formül</span>
                        </div>
                        <h1 style={{ fontSize: 'clamp(34px, 5vw, 56px)', fontWeight: 900, marginBottom: '20px', letterSpacing: '-2px', lineHeight: 1.05 }}>
                            Beslenme Bilimi: <span style={{ color: BRAND }}>Saf Güç</span>
                        </h1>
                        <p style={{ color: '#999', fontSize: '17px', maxWidth: '520px', lineHeight: 1.7 }}>
                            Laboratuvar ortamında geliştirilen formülümüz, vücudunuzun ihtiyaç duyduğu her şeyi en saf haliyle sunar — kaynağından şişeye kadar her adım test edilir.
                        </p>
                    </div>

                    <div className="hero-reveal" style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                        <img
                            src="/images/chocolate.png"
                            alt="PROTEIN3D ürün şişesi"
                            style={{ height: 'clamp(220px, 30vw, 360px)', objectFit: 'contain', filter: `drop-shadow(0 30px 60px ${BRAND_RGBA})`, position: 'relative', zIndex: 2 }}
                        />
                        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 50%, ${BRAND_RGBA} 0%, transparent 65%)`, zIndex: 1 }} />
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>

                {/* --- ÖZELLİK KARTLARI --- */}
                <div className="scroll-reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', marginBottom: '110px' }}>
                    {FEATURES.map((f, i) => (
                        <div key={i} style={{ background: '#111', padding: '40px', borderRadius: '24px', border: '1px solid #222', transition: 'border-color 0.3s ease, transform 0.3s ease' }}>
                            <f.icon size={40} color={BRAND} style={{ marginBottom: '20px' }} />
                            <h3 style={{ fontSize: '22px', marginBottom: '10px' }}>{f.title}</h3>
                            <p style={{ color: '#777', fontSize: '14px', lineHeight: 1.6 }}>{f.desc}</p>
                        </div>
                    ))}
                </div>

                {/* --- ÜRETİM SÜRECİ --- */}
                <div style={{ marginBottom: '110px' }}>
                    <div className="scroll-reveal" style={{ textAlign: 'center', marginBottom: '50px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: BRAND, fontSize: '13px', fontWeight: 900, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '14px' }}>
                            <Microscope size={14} />
                            <span>Kaynağından Şişeye</span>
                        </div>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, margin: 0, letterSpacing: '-1px' }}>Üretim Sürecimiz</h2>
                    </div>

                    <div className="process-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '24px' }}>
                        {PROCESS_STEPS.map((s, i) => (
                            <div
                                key={i}
                                className="process-step"
                                style={{
                                    position: 'relative', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: '20px', padding: '30px 24px', overflow: 'hidden',
                                }}
                            >
                                <span style={{ position: 'absolute', top: '8px', right: '18px', fontSize: '50px', fontWeight: 900, color: 'rgba(255,255,255,0.04)', lineHeight: 1 }}>
                                    {s.step}
                                </span>
                                <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: BRAND_RGBA, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                                    <s.icon size={22} color={BRAND} />
                                </div>
                                <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '8px' }}>{s.title}</h3>
                                <p style={{ color: '#888', fontSize: '13.5px', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- KARŞILAŞTIRMA --- */}
                <div ref={compareRef} style={{ marginBottom: '110px' }}>
                    <div className="scroll-reveal" style={{ textAlign: 'center', marginBottom: '46px' }}>
                        <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 900, margin: 0, letterSpacing: '-1px' }}>
                            PROTEIN3D vs. Standart Whey
                        </h2>
                        <p style={{ color: '#888', marginTop: '10px' }}>Aynı ölçek, çok farklı sonuç.</p>
                    </div>

                    <div className="scroll-reveal" style={{ display: 'flex', alignItems: 'center', gap: '24px', justifyContent: 'center', marginBottom: '30px', fontSize: '13px', color: '#aaa' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: '12px', height: '12px', borderRadius: '4px', background: BRAND, display: 'inline-block' }} /> PROTEIN3D
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#3a3a3a', display: 'inline-block' }} /> Standart Whey
                        </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px', maxWidth: '640px', margin: '0 auto' }}>
                        {COMPARISON.map((c, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', fontWeight: 700 }}>
                                    <span>{c.label}</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <div style={{ position: 'relative', height: '14px', background: 'rgba(255,255,255,0.05)', borderRadius: '7px', overflow: 'hidden' }}>
                                        <div
                                            className="compare-bar-ours"
                                            data-target={`${(c.ours / c.max) * 100}%`}
                                            style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '0%', background: BRAND, borderRadius: '7px' }}
                                        />
                                    </div>
                                    <div style={{ position: 'relative', height: '14px', background: 'rgba(255,255,255,0.05)', borderRadius: '7px', overflow: 'hidden' }}>
                                        <div
                                            className="compare-bar-theirs"
                                            data-target={`${(c.theirs / c.max) * 100}%`}
                                            style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '0%', background: '#3a3a3a', borderRadius: '7px' }}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '12px', color: '#999' }}>
                                    <span>{c.ours}{c.unit}</span>
                                    <span>{c.theirs}{c.unit}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- MÜŞTERİ YORUMLARI --- */}
                <div style={{ marginBottom: '110px' }}>
                    <div className="scroll-reveal" style={{ textAlign: 'center', marginBottom: '46px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: BRAND, fontSize: '13px', fontWeight: 900, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '14px' }}>
                            <Star size={14} />
                            <span>Gerçek Sonuçlar</span>
                        </div>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, margin: 0, letterSpacing: '-1px' }}>Sporcularımız Ne Diyor?</h2>
                    </div>

                    <div className="testimonial-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                        {TESTIMONIALS.map((t, i) => (
                            <div
                                key={i}
                                className="testimonial-card"
                                style={{ background: '#111', border: '1px solid #222', borderRadius: '20px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}
                            >
                                <Quote size={26} color={BRAND} style={{ opacity: 0.6 }} />
                                <p style={{ color: '#ccc', fontSize: '14.5px', lineHeight: 1.7, margin: 0, flex: 1 }}>{t.text}</p>
                                <div style={{ display: 'flex', gap: '2px' }}>
                                    {Array.from({ length: 5 }).map((_, idx) => (
                                        <Star key={idx} size={14} color={BRAND} fill={idx < t.rating ? BRAND : 'transparent'} />
                                    ))}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '8px', borderTop: '1px solid #1e1e1e' }}>
                                    <div style={{
                                        width: '38px', height: '38px', borderRadius: '50%', background: BRAND_RGBA, color: BRAND,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px', flexShrink: 0,
                                    }}>
                                        {t.initials}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '13.5px' }}>{t.name}</div>
                                        <div style={{ color: '#777', fontSize: '12px' }}>{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- SIKÇA SORULAN SORULAR --- */}
                <div className="scroll-reveal" style={{ maxWidth: '760px', margin: '0 auto 100px' }}>
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
                                        background: '#111', border: `1px solid ${isOpen ? BRAND : '#222'}`,
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
                                            color={BRAND}
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

                {/* --- AROMA ŞERİDİ (kapanış) --- */}
                <div className="scroll-reveal" style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(16px, 4vw, 40px)', paddingBottom: '100px', flexWrap: 'wrap' }}>
                    {FLAVORS.map((f) => (
                        <img key={f.id} src={f.image} alt={f.title} style={{ height: '90px', objectFit: 'contain', filter: `drop-shadow(0 10px 20px ${f.rgba})`, opacity: 0.9 }} />
                    ))}
                </div>
            </div>
        </div>
    )
}
