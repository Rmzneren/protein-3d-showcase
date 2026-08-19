import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Sparkles, X, Users, Award, Leaf, Star, CupSoda, Timer, TrendingUp } from 'lucide-react'
import { FLAVORS } from '../data/flavors'
import { ParticleBackground } from '../components/ParticleBackground'
import { BurstCanvas } from '../components/BurstCanvas'
import type { BurstCanvasRef } from '../components/BurstCanvas'
import { usePrefersReducedMotion } from '../hooks/useReducedMotion'
import { srOnlyStyle } from '../utils/a11y'

// Güven bandında gösterilen rakamlar — pazarlama içeriği, veritabanından gelmiyor.
const TRUST_STATS = [
    { icon: Users, value: '50.000+', label: 'Mutlu Sporcu' },
    { icon: Award, value: '15+ Yıl', label: 'Sektör Tecrübesi' },
    { icon: Leaf, value: '%100', label: 'Doğal İçerik' },
    { icon: Star, value: '4.9 / 5', label: 'Müşteri Puanı' },
]

// "Nasıl Kullanılır" bölümündeki 3 adım.
const HOW_IT_WORKS = [
    { icon: CupSoda, step: '01', title: 'KARIŞTIR', desc: 'Bir ölçek PROTEIN3D\'yi 250ml su ya da süt ile shaker içinde karıştırın.' },
    { icon: Timer, step: '02', title: 'DOĞRU ZAMANDA TÜKET', desc: 'Maksimum verim için antrenman öncesi veya sonrası 30 dakika içinde için.' },
    { icon: TrendingUp, step: '03', title: 'SONUÇLARI GÖR', desc: 'Düzenli kullanımla kas gelişiminizi ve toparlanmanızı hızlandırın.' },
]

interface HomePageProps {
    onSelect: () => void
}

// Kartlar arası taban mesafe — gerçek değer her ekranda canlı ölçülüyor (bkz. stepRef)
const BASE_STEP = 450

// Her aroma için patlama efektinde uçuşacak ürüne özel emoji — çikolatadan çikolata, muzdan muz, çilekliden çilek fırlar
const FLAVOR_EMOJI: Record<string, string> = {
    'whey-chocolate': '🍫',
    'whey-banana': '🍌',
    'whey-berry': '🍓',
}

export function HomePage(_props: HomePageProps) {
    const [activeIdx, setActiveIdx] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDragging, setIsDragging] = useState(false)

    // Referanslar
    const containerRef = useRef<HTMLDivElement>(null)
    const trackRef = useRef<HTMLDivElement>(null)
    const titleRef = useRef<HTMLHeadingElement>(null)
    const infoRef = useRef<HTMLDivElement>(null)
    const capRef = useRef<HTMLDivElement>(null)
    const burstRef = useRef<BurstCanvasRef>(null)
    const modalRef = useRef<HTMLDivElement>(null)
    const cursorRef = useRef<HTMLDivElement>(null)
    const carouselViewportRef = useRef<HTMLDivElement>(null)
    // Modal açılmadan önce odaktaki elemanı sakla — modal kapanınca odak oraya döner
    const detailsButtonRef = useRef<HTMLButtonElement>(null)
    const closeButtonRef = useRef<HTMLButtonElement>(null)

    // "Hareketi azalt" tercihi: custom cursor kapanır (native cursor geri gelir)
    // ve tüm GSAP animasyonları anlık hale getirilir (sürekli tekrar eden efektler dahil).
    const prefersReducedMotion = usePrefersReducedMotion()
    const cursorStyle = prefersReducedMotion ? 'auto' : 'none'

    useEffect(() => {
        gsap.globalTimeline.timeScale(prefersReducedMotion ? 30 : 1)
    }, [prefersReducedMotion])

    // Carousel kartları responsive boyutlandığı için kayma mesafesi ekrandan ekrana
    // değişir — gerçek render edilmiş genişlik + boşluktan canlı ölçülüyor.
    const stepRef = useRef(BASE_STEP)

    // Sürükleme (drag) durumu için ref'ler — state'e bağlı olmadıkları için re-render tetiklemezler
    const pointerActiveRef = useRef(false) // parmak/mouse basılı mı (henüz sürükleme başlamamış olabilir)
    const isDraggingRef = useRef(false) // eşiği aşıp gerçek sürükleme başladı mı
    const draggedRef = useRef(false) // gerçekten hareket etti mi (click ile karışmasın diye)
    const startXRef = useRef(0)
    const startTranslateRef = useRef(0)
    const activePointerIdRef = useRef<number | null>(null)

    const current = FLAVORS[activeIdx]

    // ==========================================================
    // ÖZEL İMLEÇ (CUSTOM CURSOR)
    // ==========================================================
    useEffect(() => {
        // Hareketi azalt tercihi açıksa özel imleci hiç etkinleştirme — native cursor kullanılır
        if (prefersReducedMotion) return

        const xTo = gsap.quickTo(cursorRef.current, "x", { duration: 0.15, ease: "power3" })
        const yTo = gsap.quickTo(cursorRef.current, "y", { duration: 0.15, ease: "power3" })

        const moveCursor = (e: MouseEvent) => {
            xTo(e.clientX)
            yTo(e.clientY)
        }
        window.addEventListener("mousemove", moveCursor)

        return () => window.removeEventListener("mousemove", moveCursor)
    }, [prefersReducedMotion])

    // ==========================================================
    // CAROUSEL ADIM MESAFESİNİ ÖLÇME (responsive)
    // ==========================================================
    useEffect(() => {
        const recalcStep = () => {
            const track = trackRef.current
            if (!track || track.children.length === 0) return
            const firstCard = track.children[0] as HTMLElement
            const cardWidth = firstCard.offsetWidth
            const computed = getComputedStyle(track)
            const gap = parseFloat(computed.columnGap || computed.gap || '0') || 0
            if (cardWidth > 0) {
                stepRef.current = cardWidth + gap
                if (!isDraggingRef.current) {
                    gsap.set(trackRef.current, { x: -activeIdx * stepRef.current })
                }
            }
        }

        recalcStep()
        window.addEventListener('resize', recalcStep)
        return () => window.removeEventListener('resize', recalcStep)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // ==========================================================
    // MODAL VE İÇERİK DAĞILMASI ANİMASYONU
    // ==========================================================
    const openProductDetails = () => {
        if (isModalOpen) return
        setIsModalOpen(true)
        const tl = gsap.timeline()

        gsap.set(modalRef.current, { visibility: 'visible', pointerEvents: 'auto' })

        // Arka planı bulanıklaştır
        tl.to('.main-content-wrapper', { scale: 0.95, opacity: 0.2, filter: 'blur(8px)', duration: 0.6, ease: 'power2.inOut' })
          .fromTo(modalRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 }, "-=0.4")

          // Şişeyi merkezden büyüt
          .fromTo('.modal-bottle',
              { scale: 0, rotation: -20 },
              { scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.2)' }
          )
          // İçerik kartlarını şişeden etrafa fırlat
          .fromTo('.modal-ing-1', { x: 0, y: 0, opacity: 0, scale: 0 }, { x: -280, y: -180, opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.2)' }, "-=0.5")
          .fromTo('.modal-ing-2', { x: 0, y: 0, opacity: 0, scale: 0 }, { x: 280, y: -120, opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.2)' }, "-=0.6")
          .fromTo('.modal-ing-3', { x: 0, y: 0, opacity: 0, scale: 0 }, { x: -240, y: 180, opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.2)' }, "-=0.6")
          .fromTo('.modal-ing-4', { x: 0, y: 0, opacity: 0, scale: 0 }, { x: 240, y: 220, opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.2)' }, "-=0.6")

          // Başlığı getir
          .fromTo('.modal-title', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.4")
          // Odağı modal içine taşı (klavye/ekran okuyucu kullanıcıları için)
          .call(() => closeButtonRef.current?.focus())
    }

    const closeProductDetails = () => {
        const tl = gsap.timeline({
            onComplete: () => {
                setIsModalOpen(false)
                gsap.set(modalRef.current, { visibility: 'hidden', pointerEvents: 'none' })
                // Odağı modalı açan butona geri ver
                detailsButtonRef.current?.focus()
            }
        })

        // Kartları şişeye geri topla
        tl.to(['.modal-ing-1', '.modal-ing-2', '.modal-ing-3', '.modal-ing-4'], {
            x: 0, y: 0, opacity: 0, scale: 0, duration: 0.4, stagger: 0.05, ease: 'power2.in'
        })
        // Başlığı ve şişeyi küçült
        .to('.modal-title', { opacity: 0, y: -20, duration: 0.3 }, "-=0.3")
        .to('.modal-bottle', { scale: 0, rotation: 20, duration: 0.4, ease: 'power2.in' }, "-=0.2")
        // Modalı kapat ve ana ekranı eski haline getir
        .to(modalRef.current, { opacity: 0, duration: 0.4 })
        .to('.main-content-wrapper', { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.5, ease: 'power2.out' }, "-=0.2")
    }

    // ==========================================================
    // ETKİLEŞİMLER (Tıklama, Tekerlek)
    // ==========================================================
    const triggerExplosiveTransition = (newIdx: number) => {
        if (isModalOpen) return
        setActiveIdx(newIdx)

        if (titleRef.current) {
            gsap.fromTo(titleRef.current, { y: -25, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.4)' })
        }
        if (infoRef.current) {
            gsap.fromTo(infoRef.current, { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, delay: 0.1, ease: 'power2.out' })
        }
    }

    const goToNext = () => triggerExplosiveTransition((activeIdx + 1) % FLAVORS.length)
    const goToPrev = () => triggerExplosiveTransition((activeIdx - 1 + FLAVORS.length) % FLAVORS.length)

    const handleProductClick = (index: number, e: React.MouseEvent) => {
        if (isModalOpen) return
        // Az önce sürükleme yapıldıysa, bırakma anındaki click olayını yok say
        if (draggedRef.current) return
        if (index !== activeIdx) {
            triggerExplosiveTransition(index)
            return
        }

        const target = e.currentTarget as HTMLElement
        const rect = target.getBoundingClientRect()
        const burstX = rect.left + rect.width / 2
        const burstY = rect.top + 50

        // Ürüne özel patlama: çikolatadan çikolata, muzdan muz, çilekliden çilek fırlar
        burstRef.current?.triggerBurst(burstX, burstY, current.color, current.rgba, FLAVOR_EMOJI[current.id])

        if (capRef.current) {
            gsap.fromTo(capRef.current,
                { opacity: 1, y: 0, scale: 1, rotation: 0 },
                { y: -220, scale: 1.8, rotation: 360, opacity: 0, duration: 0.7, ease: 'power3.out' }
            )
        }

        const imgEl = target.querySelector('img')
        if (imgEl) {
            gsap.timeline()
                .to(imgEl, { scaleY: 0.85, scaleX: 1.15, duration: 0.1, ease: 'power1.in' })
                .to(imgEl, { scaleY: 1.2, scaleX: 0.9, duration: 0.15, ease: 'power2.out' })
                .to(imgEl, { scaleY: 1, scaleX: 1, duration: 0.6, ease: 'elastic.out(1.2, 0.4)' })
        }
    }

    useEffect(() => {
        let isCoolingDown = false
        const handleWheel = (e: WheelEvent) => {
            if (isModalOpen) return

            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                e.preventDefault()
                if (isCoolingDown) return
                isCoolingDown = true
                if (e.deltaX > 0) {
                    triggerExplosiveTransition((activeIdx + 1) % FLAVORS.length)
                } else {
                    triggerExplosiveTransition((activeIdx - 1 + FLAVORS.length) % FLAVORS.length)
                }
                setTimeout(() => { isCoolingDown = false }, 450)
            }
        }
        const container = containerRef.current
        container?.addEventListener('wheel', handleWheel, { passive: false })
        return () => container?.removeEventListener('wheel', handleWheel)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeIdx, isModalOpen])

    useEffect(() => {
        if (!trackRef.current) return
        gsap.to(trackRef.current, {
            x: -activeIdx * stepRef.current,
            rotation: 0,
            duration: 0.75,
            ease: 'back.out(1.1)',
        })
    }, [activeIdx])

    // ==========================================================
    // KLAVYE İLE GEZİNME (Sol / Sağ ok tuşları)
    // ==========================================================
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isModalOpen) {
                // Modal açıkken Escape ile kapatılabilsin (standart dialog davranışı)
                if (e.key === 'Escape') {
                    e.preventDefault()
                    closeProductDetails()
                }
                return
            }
            if (e.key === 'ArrowRight') {
                e.preventDefault()
                goToNext()
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault()
                goToPrev()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeIdx, isModalOpen])

    // ==========================================================
    // BASILI TUTUP ÇEKEREK ÜRÜN DEĞİŞTİRME (DRAG / SWIPE)
    // ==========================================================
    const handlePointerDown = (e: React.PointerEvent) => {
        if (isModalOpen) return

        // Henüz sürükleme değil, sadece basılı tutmaya başladık — capture burada ALINMIYOR
        // (erken capture almak, sonraki click olayını yanlış elemente yönlendirip tıklamayı kırar)
        pointerActiveRef.current = true
        draggedRef.current = false
        activePointerIdRef.current = e.pointerId
        startXRef.current = e.clientX
        startTranslateRef.current = (gsap.getProperty(trackRef.current, 'x') as number) ?? -activeIdx * stepRef.current
    }

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!pointerActiveRef.current || isModalOpen) return

        const dx = e.clientX - startXRef.current

        if (!isDraggingRef.current) {
            // Eşik aşılmadan track'e hiç dokunma — küçük titremeler tıklamayı bozmasın
            if (Math.abs(dx) <= 6) return

            isDraggingRef.current = true
            draggedRef.current = true
            setIsDragging(true)
            gsap.killTweensOf(trackRef.current)

            const el = e.currentTarget as HTMLElement
            el.setPointerCapture?.(e.pointerId)

            gsap.to(cursorRef.current, { scale: 1.8, opacity: 0.6, duration: 0.25 })
        }

        gsap.set(trackRef.current, {
            x: startTranslateRef.current + dx * 0.92,
            rotation: gsap.utils.clamp(-3, 3, dx * 0.01),
        })
    }

    const endDrag = (e: React.PointerEvent) => {
        if (!pointerActiveRef.current) return
        pointerActiveRef.current = false

        const wasDragging = isDraggingRef.current
        isDraggingRef.current = false
        setIsDragging(false)

        if (!wasDragging) {
            // Düz bir tıklama — native click olayı doğru ürün kartına ulaşacak
            activePointerIdRef.current = null
            return
        }

        const el = e.currentTarget as HTMLElement
        if (activePointerIdRef.current !== null) {
            el.releasePointerCapture?.(activePointerIdRef.current)
        }
        activePointerIdRef.current = null

        gsap.to(cursorRef.current, { scale: 1, opacity: 1, duration: 0.25 })

        const dx = e.clientX - startXRef.current
        const DRAG_THRESHOLD = 70

        if (Math.abs(dx) > DRAG_THRESHOLD) {
            if (dx < 0) {
                goToNext()
            } else {
                goToPrev()
            }
        } else {
            gsap.to(trackRef.current, { x: -activeIdx * stepRef.current, rotation: 0, duration: 0.5, ease: 'back.out(1.4)' })
        }

        setTimeout(() => { draggedRef.current = false }, 60)
    }

    // Özel İmleç Büyütme/Küçültme
    const enterHover = () => gsap.to(cursorRef.current, { scale: 2.5, opacity: 0.5, duration: 0.3 })
    const leaveHover = () => gsap.to(cursorRef.current, { scale: 1, opacity: 1, duration: 0.3 })

    // ==========================================================
    // EK İÇERİK BÖLÜMLERİ (Güven bandı + Nasıl Kullanılır) — sayfa açılışında belirir
    // ==========================================================
    useEffect(() => {
        gsap.fromTo('.home-reveal',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, delay: 0.3, ease: 'power3.out' }
        )
    }, [])

    return (
        <div style={{ background: '#030303', width: '100%', minHeight: '100%', position: 'relative' }}>

            {/* Özel İmleç — hareketi azalt tercihinde hiç render edilmez, native cursor kullanılır */}
            {!prefersReducedMotion && (
                <div
                    ref={cursorRef}
                    aria-hidden="true"
                    style={{
                        position: 'fixed', top: 0, left: 0, width: '16px', height: '16px',
                        backgroundColor: current.color, borderRadius: '50%', pointerEvents: 'none',
                        zIndex: 9999, transform: 'translate(-50%, -50%)', mixBlendMode: 'screen',
                        boxShadow: `0 0 15px ${current.rgba}`
                    }}
                />
            )}

            {/* --- ANA HERO (CAROUSEL) --- */}
            <div
                ref={containerRef}
                style={{
                    minHeight: 'calc(100vh - 88px)', width: '100%', display: 'flex', flexDirection: 'column',
                    justifyContent: 'center', alignItems: 'center', gap: 'clamp(28px, 5vw, 48px)',
                    padding: 'clamp(40px, 6vw, 64px) clamp(16px, 5vw, 40px)',
                    position: 'relative', userSelect: 'none',
                    cursor: cursorStyle, zIndex: 2, boxSizing: 'border-box'
                }}
            >
                <BurstCanvas ref={burstRef} />
                <ParticleBackground color={current.color} rgba={current.rgba} activeIdx={activeIdx} reducedMotion={prefersReducedMotion} />

                {/* Çevresel Efektler (Environment Modifiers) */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 1, opacity: 0.6 }}>
                    {activeIdx % 2 === 0 ? (
                        <div style={{ background: `radial-gradient(circle at 50% 80%, ${current.rgba} 0%, transparent 60%)`, width: '100%', height: '100%' }} />
                    ) : (
                        <div style={{ background: 'linear-gradient(to top, rgba(255,255,255,0.1) 0%, transparent 50%)', backdropFilter: 'blur(2px)', width: '100%', height: '100%' }} />
                    )}
                </div>

                <div className="main-content-wrapper" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', zIndex: 3, gap: 'clamp(28px, 5vw, 48px)' }}>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: '900px', width: '100%', padding: '0 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: current.color, fontSize: '14px', fontWeight: 900, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '12px' }}>
                            <Sparkles size={16} />
                            <span>0{activeIdx + 1} / 0{FLAVORS.length} • {current.badge}</span>
                        </div>
                        <h1 ref={titleRef} style={{ color: '#ffffff', fontSize: 'clamp(32px, 5vw, 68px)', fontWeight: 900, margin: 0, letterSpacing: '-1px', lineHeight: 1.1, textShadow: `0 12px 35px ${current.rgba}` }}>
                            {current.title}
                        </h1>
                        <p style={{ color: '#a0aec0', fontSize: 'clamp(14px, 1.2vw, 16px)', lineHeight: '1.6', marginTop: '12px', maxWidth: '650px' }}>
                            {current.desc}
                        </p>
                    </div>

                    <div
                        ref={carouselViewportRef}
                        role="region"
                        aria-roledescription="carousel"
                        aria-label="Aroma seçim vitrini"
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={endDrag}
                        onPointerLeave={(e) => { if (isDraggingRef.current) endDrag(e) }}
                        onPointerCancel={endDrag}
                        style={{
                            width: '100%', height: 'clamp(280px, 42vw, 460px)', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', zIndex: 3,
                            cursor: cursorStyle, touchAction: 'pan-y'
                        }}
                    >
                        {/* Ekran okuyucular için: aroma değiştiğinde canlı duyuru */}
                        <div aria-live="polite" style={srOnlyStyle}>
                            {current.title} seçili, {activeIdx + 1} / {FLAVORS.length}
                        </div>

                        {/* Sol/Sağ ok butonları */}
                        <button
                            onClick={(e) => { e.stopPropagation(); if (!isModalOpen) goToPrev() }}
                            onMouseEnter={enterHover}
                            onMouseLeave={leaveHover}
                            aria-label="Önceki aroma"
                            style={{
                                position: 'absolute', left: 'clamp(0px, 2vw, 20px)', zIndex: 6, cursor: cursorStyle,
                                width: '46px', height: '46px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.16)',
                                background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(8px)', color: '#fff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.3s, border-color 0.3s, opacity 0.3s',
                                opacity: isDragging ? 0.25 : 0.85, fontSize: '20px', fontWeight: 700, lineHeight: 1
                            }}
                        >
                            ‹
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); if (!isModalOpen) goToNext() }}
                            onMouseEnter={enterHover}
                            onMouseLeave={leaveHover}
                            aria-label="Sonraki aroma"
                            style={{
                                position: 'absolute', right: 'clamp(0px, 2vw, 20px)', zIndex: 6, cursor: cursorStyle,
                                width: '46px', height: '46px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.16)',
                                background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(8px)', color: '#fff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.3s, border-color 0.3s, opacity 0.3s',
                                opacity: isDragging ? 0.25 : 0.85, fontSize: '20px', fontWeight: 700, lineHeight: 1
                            }}
                        >
                            ›
                        </button>

                        <div ref={trackRef} style={{ display: 'flex', alignItems: 'center', gap: 'clamp(24px, 6vw, 90px)', position: 'absolute', willChange: 'transform' }}>
                            {FLAVORS.map((item, index) => {
                                const isSelected = index === activeIdx
                                return (
                                    <div
                                        key={item.id}
                                        role="button"
                                        tabIndex={0}
                                        aria-current={isSelected}
                                        aria-label={isSelected ? `${item.title} — seçili aroma, detayları görmek için Enter'a basın` : `${item.title} aromasını seç`}
                                        onClick={(e) => handleProductClick(index, e)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault()
                                                if (isModalOpen) return
                                                if (index !== activeIdx) triggerExplosiveTransition(index)
                                                else openProductDetails()
                                            }
                                        }}
                                        onMouseEnter={enterHover}
                                        onMouseLeave={leaveHover}
                                        style={{
                                            width: 'clamp(200px, 30vw, 360px)', height: 'clamp(260px, 38vw, 440px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative',
                                            transform: isSelected ? 'scale(1.22)' : 'scale(0.72)', opacity: isSelected ? 1 : 0.2, filter: isSelected ? 'none' : 'blur(5px) grayscale(60%)',
                                            transition: 'transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s, filter 0.5s'
                                        }}
                                    >
                                        {isSelected && (
                                            <div ref={capRef} style={{ position: 'absolute', top: '10px', width: '60px', height: '14px', borderRadius: '50%', border: `3px solid ${item.color}`, boxShadow: `0 0 15px ${item.color}`, opacity: 0, zIndex: 10, pointerEvents: 'none' }} />
                                        )}
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            draggable={false}
                                            style={{
                                                height: isSelected ? 'clamp(220px, 34vw, 420px)' : 'clamp(160px, 24vw, 300px)',
                                                objectFit: 'contain', zIndex: 2,
                                                filter: isSelected ? `drop-shadow(0 30px 50px ${item.rgba})` : 'none'
                                            }}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div ref={infoRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', zIndex: 3 }}>
                        {/* Aroma seçim noktaları (dots) */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {FLAVORS.map((item, index) => {
                                const isSelected = index === activeIdx
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => { if (!isModalOpen && index !== activeIdx) triggerExplosiveTransition(index) }}
                                        onMouseEnter={enterHover}
                                        onMouseLeave={leaveHover}
                                        title={item.title}
                                        aria-label={`${item.title} aromasına git`}
                                        aria-current={isSelected}
                                        style={{
                                            width: isSelected ? '28px' : '8px', height: '8px', borderRadius: '5px',
                                            border: 'none', cursor: cursorStyle, padding: 0,
                                            background: isSelected ? item.color : 'rgba(255,255,255,0.25)',
                                            boxShadow: isSelected ? `0 0 10px ${item.rgba}` : 'none',
                                            transition: 'width 0.4s ease, background 0.4s ease, box-shadow 0.4s ease'
                                        }}
                                    />
                                )
                            })}
                        </div>

                        <button
                            ref={detailsButtonRef}
                            onClick={openProductDetails}
                            onMouseEnter={enterHover}
                            onMouseLeave={leaveHover}
                            style={{ padding: '16px 40px', borderRadius: '40px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.18)', color: '#ffffff', fontWeight: 900, fontSize: '13px', letterSpacing: '2px', cursor: cursorStyle, transition: 'all 0.3s ease', backdropFilter: 'blur(10px)' }}
                        >
                            DETAYLARI İNCELE
                        </button>

                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', margin: 0, textAlign: 'center' }}>
                            Sürükle, tıkla ya da ok tuşlarıyla aromalar arasında gez
                        </p>
                    </div>
                </div>
            </div>

            {/* --- GÜVEN BANDI (TRUST STATS) --- */}
            <div style={{ width: '100%', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)', background: '#050505', position: 'relative', zIndex: 3 }}>
                <div style={{
                    maxWidth: '1200px', margin: '0 auto', padding: 'clamp(32px, 5vw, 56px) 5%',
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px'
                }}>
                    {TRUST_STATS.map((stat, i) => (
                        <div key={i} className="home-reveal" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{
                                width: '52px', height: '52px', borderRadius: '16px', flexShrink: 0,
                                background: `${current.rgba}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'background 0.4s ease'
                            }}>
                                <stat.icon size={24} color={current.color} style={{ transition: 'color 0.4s ease' }} />
                            </div>
                            <div>
                                <div style={{ fontSize: 'clamp(20px, 2.4vw, 26px)', fontWeight: 900, color: '#fff', lineHeight: 1.1 }}>{stat.value}</div>
                                <div style={{ fontSize: '13px', color: '#8a8a8a', marginTop: '4px' }}>{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- NASIL KULLANILIR (3 ADIM) --- */}
            <div style={{ width: '100%', background: '#030303', position: 'relative', zIndex: 3, padding: 'clamp(60px, 8vw, 100px) 5%' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div className="home-reveal" style={{ textAlign: 'center', marginBottom: 'clamp(40px, 5vw, 64px)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: current.color, fontSize: '13px', fontWeight: 900, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '14px' }}>
                            <Sparkles size={14} />
                            <span>Basit &amp; Etkili</span>
                        </div>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-1px' }}>
                            Nasıl Kullanılır?
                        </h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '28px' }}>
                        {HOW_IT_WORKS.map((item, i) => (
                            <div
                                key={i}
                                className="home-reveal"
                                style={{
                                    position: 'relative', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: '20px', padding: '32px 28px', overflow: 'hidden'
                                }}
                            >
                                <span style={{ position: 'absolute', top: '10px', right: '20px', fontSize: '56px', fontWeight: 900, color: 'rgba(255,255,255,0.04)', lineHeight: 1 }}>
                                    {item.step}
                                </span>
                                <div style={{
                                    width: '52px', height: '52px', borderRadius: '14px', background: current.rgba,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', transition: 'background 0.4s ease'
                                }}>
                                    <item.icon size={24} color={current.color} />
                                </div>
                                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#fff', letterSpacing: '0.5px', marginBottom: '10px' }}>{item.title}</h3>
                                <p style={{ fontSize: '14px', color: '#8a8a8a', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- MODAL VE İÇERİK DAĞILMASI (SCATTERING) BÖLÜMÜ ---
                 NOT: zIndex, App.tsx'teki sticky navbar'ın (zIndex: 1000) ÜSTÜNDE olacak
                 şekilde 2000'e çıkarıldı — eskiden navbar modalın kapatma butonunu gizliyordu. */}
            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="product-modal-title"
                style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.7)', opacity: 0, visibility: 'hidden', pointerEvents: 'none',
                    cursor: cursorStyle
                }}
            >
                <button
                    ref={closeButtonRef}
                    onClick={closeProductDetails}
                    onMouseEnter={enterHover}
                    onMouseLeave={leaveHover}
                    aria-label="Detayları kapat"
                    style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '15px', borderRadius: '50%', cursor: cursorStyle, transition: '0.3s', zIndex: 2010, backdropFilter: 'blur(5px)' }}
                >
                    <X size={24} />
                </button>

                <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                    {/* Parçalanan İçerik Kartları — artık her aromanın GERÇEK besin değerlerini gösteriyor */}
                    <div className="modal-ing-1" style={{ position: 'absolute', padding: '20px', background: 'rgba(255,255,255,0.08)', borderRadius: '15px', border: `1px solid ${current.color}`, color: '#fff', backdropFilter: 'blur(10px)', width: '220px' }}>
                        <h4 style={{ margin: 0, color: current.color, fontSize: '16px', fontWeight: 800 }}>{current.stats.protein} PROTEİN</h4>
                        <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#ccc', lineHeight: '1.4' }}>Kas gelişimini destekleyen yüksek kaliteli protein kaynağı.</p>
                    </div>

                    <div className="modal-ing-2" style={{ position: 'absolute', padding: '20px', background: 'rgba(255,255,255,0.08)', borderRadius: '15px', border: `1px solid ${current.color}`, color: '#fff', backdropFilter: 'blur(10px)', width: '220px' }}>
                        <h4 style={{ margin: 0, color: current.color, fontSize: '16px', fontWeight: 800 }}>{current.stats.bcaa} BCAA</h4>
                        <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#ccc', lineHeight: '1.4' }}>Toparlanmayı hızlandıran dallı zincirli amino asitler.</p>
                    </div>

                    <div className="modal-ing-3" style={{ position: 'absolute', padding: '20px', background: 'rgba(255,255,255,0.08)', borderRadius: '15px', border: `1px solid ${current.color}`, color: '#fff', backdropFilter: 'blur(10px)', width: '220px' }}>
                        <h4 style={{ margin: 0, color: current.color, fontSize: '16px', fontWeight: 800 }}>{current.stats.sugar} ŞEKER</h4>
                        <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#ccc', lineHeight: '1.4' }}>Kan şekerini dengede tutan sade ve şeffaf formül.</p>
                    </div>

                    <div className="modal-ing-4" style={{ position: 'absolute', padding: '20px', background: 'rgba(255,255,255,0.08)', borderRadius: '15px', border: `1px solid ${current.color}`, color: '#fff', backdropFilter: 'blur(10px)', width: '220px' }}>
                        <h4 style={{ margin: 0, color: current.color, fontSize: '16px', fontWeight: 800 }}>{current.stats.kcal} KCAL</h4>
                        <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#ccc', lineHeight: '1.4' }}>Dengeli enerji için optimize edilmiş kalori değeri.</p>
                    </div>

                    {/* Merkezdeki Büyük Şişe */}
                    <img
                        className="modal-bottle"
                        src={current.image}
                        alt="Product Details"
                        style={{ height: 'min(65vh, 420px)', maxWidth: '80vw', zIndex: 2, filter: `drop-shadow(0 0 70px ${current.rgba})` }}
                    />

                    {/* Modal İçindeki Başlık */}
                    <h2 id="product-modal-title" className="modal-title" style={{ position: 'absolute', bottom: '8%', fontSize: 'clamp(22px, 4vw, 42px)', fontWeight: 900, color: '#fff', letterSpacing: '4px', textTransform: 'uppercase', textAlign: 'center', padding: '0 16px' }}>
                        Formülün Sırrı
                    </h2>
                </div>
            </div>
        </div>
    )
}