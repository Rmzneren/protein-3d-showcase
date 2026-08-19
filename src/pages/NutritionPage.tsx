import { useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import gsap from 'gsap'
import {
    Zap, ShieldCheck, HeartPulse, Droplets, ChevronDown,
    Wheat, FlaskConical, Microscope, PackageCheck, Star, Quote,
    Calculator, ShoppingBag, Camera, X,
} from 'lucide-react'
import { FLAVORS } from '../data/flavors'
import { useCart } from '../hooks/useCart'
import { revealOnScroll, onEnterView } from '../utils/scrollReveal'
import { srOnlyStyle } from '../utils/a11y'

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

// Kilo başına önerilen protein aralığı (g/kg) — hedefe göre kabaca genel spor
// beslenmesi rehberleri baz alınmıştır (0.8g/kg sedanter ↔ 2.2g/kg yoğun kesim
// dönemi). Kesin/kişisel doz için FAQ'daki gibi bir diyetisyene danışılması önerilir.
const CALC_GOALS = [
    { id: 'maintain', label: 'Koruma / Genel Sağlık', multiplier: 1.2, desc: 'Mevcut kas kütlenizi korumak ve genel sağlığınızı desteklemek için.' },
    { id: 'gain', label: 'Kas Kütlesi Kazanımı', multiplier: 1.8, desc: 'Antrenmanla birlikte kas gelişimini hızlandırmak için.' },
    { id: 'cut', label: 'Yağ Yakımı (Kesim)', multiplier: 2.2, desc: 'Kalori açığındayken kas kütlesini korumak, daha yüksek protein alımı gerektirir.' },
] as const

interface Testimonial {
    initials: string
    name: string
    role: string
    rating: number
    text: string
    // Kullanıcının yorumuna eklediği fotoğraf — örnek/başlangıç yorumlarında kendi
    // ürün fotoğraflarımızdan biri (bahsettikleri aromanın şişesi), ziyaretçinin
    // kendi eklediği yorumlarda ise seçtiği dosyanın object URL önizlemesi.
    photo?: string
    isNew?: boolean
}

const TESTIMONIALS: Testimonial[] = [
    { initials: 'EK', name: 'Emre K.', role: 'Amatör Vücut Geliştirme', rating: 5, text: 'Çikolatalı aroma gerçekten sudan farksız karışıyor, şişkinlik yapmıyor. 3 aydır düzenli kullanıyorum, fark net.', photo: '/images/chocolate.webp' },
    { initials: 'SA', name: 'Selin A.', role: 'Pilates Eğitmeni', rating: 5, text: 'Muzlu aromayı özellikle antrenman öncesi tercih ediyorum, mide de hiç rahatsızlık yapmıyor.', photo: '/images/banana.webp' },
    { initials: 'BT', name: 'Barış T.', role: 'Amatör Triatlet', rating: 4, text: 'Berry Fusion toparlanma sürecimi belirgin şekilde hızlandırdı, düşük şeker oranı da artı puan.', photo: '/images/berry.webp' },
]

export function NutritionPage() {
    const containerRef = useRef<HTMLDivElement>(null)
    const compareRef = useRef<HTMLDivElement>(null)
    const [openFaq, setOpenFaq] = useState<number | null>(0)
    const { addToCart } = useCart()

    // ==========================================================
    // PROTEİN İHTİYACI HESAPLAYICI
    // ==========================================================
    const [weight, setWeight] = useState(75)
    const [goalId, setGoalId] = useState<(typeof CALC_GOALS)[number]['id']>('maintain')
    const resultRef = useRef<HTMLSpanElement>(null)

    const goal = CALC_GOALS.find((g) => g.id === goalId) ?? CALC_GOALS[0]
    const dailyProtein = Math.round(weight * goal.multiplier)

    // Hedefe göre önerilen aroma: koruma için en çok satan, kütle/kesim gibi daha
    // yüksek protein ihtiyacı olan hedeflerde ölçek başına en yüksek proteinli aroma.
    const recommendedFlavor = useMemo(() => {
        if (goalId === 'maintain') {
            return FLAVORS.find((f) => f.badge === 'BEST SELLER') ?? FLAVORS[0]
        }
        return [...FLAVORS].sort((a, b) => parseFloat(b.stats.protein) - parseFloat(a.stats.protein))[0]
    }, [goalId])

    // Sonuç rakamı her değiştiğinde sayaç animasyonuyla yeni değere akar (bkz. HomePage'deki güven bandı sayaçları)
    useEffect(() => {
        const counter = { val: Number(resultRef.current?.textContent?.replace(/\D/g, '')) || 0 }
        gsap.to(counter, {
            val: dailyProtein,
            duration: 0.6,
            ease: 'power2.out',
            onUpdate: () => { if (resultRef.current) resultRef.current.textContent = `${Math.round(counter.val)}g` },
        })
    }, [dailyProtein])

    // ==========================================================
    // MÜŞTERİ YORUMLARI — fotoğraflı yorum ekleme (frontend-only demo)
    // ==========================================================
    const [testimonials, setTestimonials] = useState<Testimonial[]>(TESTIMONIALS)
    const [reviewName, setReviewName] = useState('')
    const [reviewRole, setReviewRole] = useState('')
    const [reviewRating, setReviewRating] = useState(5)
    const [reviewText, setReviewText] = useState('')
    const [reviewPhoto, setReviewPhoto] = useState<string | null>(null)
    const reviewFileInputRef = useRef<HTMLInputElement>(null)
    // Gönderilen bir yoruma photo olarak devredilen URL'i, form sıfırlanırken
    // yanlışlıkla revoke etmemek için ayrıca takip ediyoruz (aksi halde o
    // yorumun görseli kırılırdı — bkz. handleSubmitReview).
    const reviewPhotoRef = useRef<string | null>(null)
    reviewPhotoRef.current = reviewPhoto

    // Sadece henüz gönderilmemiş bir taslak fotoğraf varken, bileşen kaldırılırsa
    // (ör. kullanıcı formu doldurup göndermeden sayfadan ayrılırsa) onu serbest bırakır.
    useEffect(() => {
        return () => { if (reviewPhotoRef.current) URL.revokeObjectURL(reviewPhotoRef.current) }
    }, [])

    const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (reviewPhoto) URL.revokeObjectURL(reviewPhoto)
        setReviewPhoto(URL.createObjectURL(file))
    }

    const handleRemovePhoto = () => {
        if (reviewPhoto) URL.revokeObjectURL(reviewPhoto)
        setReviewPhoto(null)
        if (reviewFileInputRef.current) reviewFileInputRef.current.value = ''
    }

    const handleSubmitReview = (e: FormEvent) => {
        e.preventDefault()
        const trimmedName = reviewName.trim()
        const trimmedText = reviewText.trim()
        if (!trimmedName || !trimmedText) return

        const initials = trimmedName.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase() || '??'

        setTestimonials((prev) => [
            {
                initials,
                name: trimmedName,
                role: reviewRole.trim() || 'PROTEIN3D Kullanıcısı',
                rating: reviewRating,
                text: trimmedText,
                photo: reviewPhoto ?? undefined,
                isNew: true,
            },
            ...prev,
        ])

        setReviewName('')
        setReviewRole('')
        setReviewText('')
        setReviewRating(5)
        setReviewPhoto(null)
        if (reviewFileInputRef.current) reviewFileInputRef.current.value = ''
    }

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
                            src="/images/chocolate.webp"
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

                {/* --- PROTEİN İHTİYACI HESAPLAYICI --- */}
                <div className="scroll-reveal" style={{ marginBottom: '110px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: BRAND, fontSize: '13px', fontWeight: 900, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '14px' }}>
                            <Calculator size={14} />
                            <span>Size Özel</span>
                        </div>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, margin: 0, letterSpacing: '-1px' }}>Protein İhtiyacınızı Hesaplayın</h2>
                    </div>

                    <div style={{
                        maxWidth: '820px', margin: '0 auto', background: '#111', border: '1px solid #222', borderRadius: '28px',
                        padding: 'clamp(24px, 4vw, 44px)', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '36px', alignItems: 'center',
                    }}>
                        <div>
                            <label htmlFor="calc-weight" style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#aaa', marginBottom: '8px' }}>
                                Kilonuz: <span style={{ color: BRAND }}>{weight} kg</span>
                            </label>
                            <input
                                id="calc-weight"
                                type="range"
                                min={40}
                                max={150}
                                value={weight}
                                onChange={(e) => setWeight(Number(e.target.value))}
                                style={{ width: '100%', accentColor: BRAND, marginBottom: '24px' }}
                            />

                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#aaa', marginBottom: '10px' }}>Hedefiniz</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {CALC_GOALS.map((g) => (
                                    <button
                                        key={g.id}
                                        type="button"
                                        onClick={() => setGoalId(g.id)}
                                        aria-pressed={goalId === g.id}
                                        style={{
                                            textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '2px',
                                            padding: '12px 16px', borderRadius: '14px', cursor: 'pointer',
                                            background: goalId === g.id ? BRAND_RGBA : 'rgba(255,255,255,0.03)',
                                            border: `1px solid ${goalId === g.id ? BRAND : 'rgba(255,255,255,0.08)'}`,
                                            color: '#fff', transition: 'border-color 0.2s ease, background 0.2s ease',
                                        }}
                                    >
                                        <span style={{ fontSize: '14px', fontWeight: 700 }}>{g.label}</span>
                                        <span style={{ fontSize: '12px', color: '#888' }}>{g.desc}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{
                            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px',
                            padding: '28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '6px',
                        }}>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#888', letterSpacing: '1px', textTransform: 'uppercase' }}>Günlük Protein İhtiyacınız</span>
                            <span ref={resultRef} style={{ fontSize: 'clamp(40px, 6vw, 56px)', fontWeight: 900, color: BRAND, lineHeight: 1 }}>0g</span>
                            <span style={{ fontSize: '13px', color: '#999', marginBottom: '18px' }}>
                                Önerilen aroma: <strong style={{ color: '#fff' }}>{recommendedFlavor.title}</strong> ({recommendedFlavor.stats.protein} / ölçek)
                            </span>
                            <button
                                type="button"
                                onClick={() => addToCart(recommendedFlavor)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px', background: BRAND, color: '#fff', border: 'none',
                                    borderRadius: '14px', padding: '12px 22px', fontSize: '13.5px', fontWeight: 800, cursor: 'pointer',
                                }}
                            >
                                <ShoppingBag size={16} /> Sepete Ekle
                            </button>
                            <span style={{ fontSize: '11px', color: '#666', marginTop: '14px' }}>
                                Bu hesaplama genel bir tahmindir; kişisel ihtiyaçlarınız için bir diyetisyene danışın.
                            </span>
                        </div>
                    </div>
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

                    <div className="testimonial-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                        {testimonials.map((t, i) => (
                            <div
                                key={i}
                                className={t.isNew ? 'testimonial-card ai-msg-in' : 'testimonial-card'}
                                style={{ background: '#111', border: '1px solid #222', borderRadius: '20px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}
                            >
                                {t.photo && (
                                    <img
                                        src={t.photo}
                                        alt={`${t.name} tarafından yoruma eklenen fotoğraf`}
                                        style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '12px', background: '#000' }}
                                    />
                                )}
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

                    {/* Yorum ekleme formu — tamamen istemci tarafında (frontend-only) çalışan bir
                        demo: hiçbir veri sunucuya gönderilmez, sayfa yenilenince sıfırlanır. */}
                    <form
                        onSubmit={handleSubmitReview}
                        className="scroll-reveal"
                        style={{
                            maxWidth: '640px', margin: '0 auto', background: '#111', border: '1px solid #222', borderRadius: '20px',
                            padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px',
                        }}
                    >
                        <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0 }}>Deneyimini Paylaş</h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div>
                                <label htmlFor="review-name" style={srOnlyStyle}>İsminiz</label>
                                <input
                                    id="review-name"
                                    type="text"
                                    value={reviewName}
                                    onChange={(e) => setReviewName(e.target.value)}
                                    placeholder="İsminiz"
                                    required
                                    maxLength={40}
                                    style={{ width: '100%', background: '#161616', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '13.5px' }}
                                />
                            </div>
                            <div>
                                <label htmlFor="review-role" style={srOnlyStyle}>Rolünüz (opsiyonel)</label>
                                <input
                                    id="review-role"
                                    type="text"
                                    value={reviewRole}
                                    onChange={(e) => setReviewRole(e.target.value)}
                                    placeholder="Rolünüz (opsiyonel)"
                                    maxLength={40}
                                    style={{ width: '100%', background: '#161616', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '13.5px' }}
                                />
                            </div>
                        </div>

                        <div>
                            <span id="review-rating-label" style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#aaa', marginBottom: '6px' }}>Puanınız</span>
                            <div role="radiogroup" aria-labelledby="review-rating-label" style={{ display: 'flex', gap: '4px' }}>
                                {[1, 2, 3, 4, 5].map((n) => (
                                    <button
                                        key={n}
                                        type="button"
                                        role="radio"
                                        aria-checked={n === reviewRating}
                                        onClick={() => setReviewRating(n)}
                                        aria-label={`${n} yıldız`}
                                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px' }}
                                    >
                                        <Star size={22} color={BRAND} fill={n <= reviewRating ? BRAND : 'transparent'} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="review-text" style={srOnlyStyle}>Yorumunuz</label>
                            <textarea
                                id="review-text"
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                placeholder="Deneyiminizi anlatın…"
                                required
                                maxLength={400}
                                rows={3}
                                style={{ width: '100%', resize: 'vertical', background: '#161616', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '13.5px', fontFamily: 'inherit' }}
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <label
                                htmlFor="review-photo-input"
                                style={{ display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid rgba(255,87,34,0.35)', background: 'rgba(255,87,34,0.08)', color: '#ffab91', borderRadius: '20px', padding: '8px 14px', fontSize: '12.5px', cursor: 'pointer', flexShrink: 0 }}
                            >
                                <Camera size={14} /> {reviewPhoto ? 'Fotoğrafı Değiştir' : 'Fotoğraf Ekle (opsiyonel)'}
                            </label>
                            <input
                                ref={reviewFileInputRef}
                                id="review-photo-input"
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                style={srOnlyStyle}
                            />
                            {reviewPhoto && (
                                <div style={{ position: 'relative', flexShrink: 0 }}>
                                    <img src={reviewPhoto} alt="Eklediğiniz fotoğrafın önizlemesi" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '10px' }} />
                                    <button
                                        type="button"
                                        onClick={handleRemovePhoto}
                                        aria-label="Fotoğrafı kaldır"
                                        style={{ position: 'absolute', top: '-6px', right: '-6px', width: '18px', height: '18px', borderRadius: '50%', background: '#000', border: '1px solid #333', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}
                                    >
                                        <X size={11} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            style={{ alignSelf: 'flex-start', background: BRAND, color: '#fff', border: 'none', borderRadius: '12px', padding: '11px 24px', fontSize: '13.5px', fontWeight: 800, cursor: 'pointer' }}
                        >
                            Yorumu Paylaş
                        </button>
                    </form>
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
                        <img key={f.id} src={f.image} alt={f.title} loading="lazy" style={{ height: '90px', objectFit: 'contain', filter: `drop-shadow(0 10px 20px ${f.rgba})`, opacity: 0.9 }} />
                    ))}
                </div>
            </div>
        </div>
    )
}
