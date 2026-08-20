import { useEffect, useId, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import gsap from 'gsap'
import { Bot, Send, Sparkles, X } from 'lucide-react'
import { srOnlyStyle } from '../utils/a11y'
import { useLanguage } from '../hooks/useLanguage'
import { SplineRobot } from './SplineRobot'

// Sitede her sayfada görünen, sağ altta sabit duran AI beslenme asistanı.
// /api/chat (Vercel serverless function) üzerinden Claude'a bağlanır; yanıt
// text/plain chunk'lar halinde STREAM edilir ve mesaj balonu karakter karakter
// dolar (bkz. sendMessage). API anahtarı tanımlı değilse backend otomatik olarak
// kural-tabanlı bir demo yanıtına düşer — o da aynı stream deneyimini korumak için
// kelime kelime akıtılır, yani widget anahtarsız da aynı hisle çalışır.
//
// Tasarım notu: "spotlight" (fareyi takip eden ışık) efekti, ibelick/spotlight
// (21st.dev) bileşeninin fikrinden esinlenildi — ama bu proje shadcn/Tailwind/
// Framer Motion kullanmadığı için (bkz. CLAUDE.md: inline style + GSAP konvansiyonu),
// aynı görsel etki burada sıfırdan, mevcut GSAP altyapısıyla (custom cursor'da
// kullanılan quickTo deseniyle aynı) yeniden inşa edildi.

const BRAND_COLOR = '#ff5722'

interface ChatMessage {
    role: 'user' | 'assistant'
    text: string
}

export function AiAssistant() {
    const { lang, t } = useLanguage()
    const [isOpen, setIsOpen] = useState(false)
    // Karşılama mesajı state'te TUTULMAZ — her render'da güncel dilde üretilir
    // (bkz. displayMessages). Böylece kullanıcı sohbete hiç başlamadan dil
    // değiştirirse karşılama metni de anında güncellenir; sohbet başladıktan
    // sonraki gerçek mesajlar ise gönderildikleri dilde donmuş kalır.
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const toggleButtonRef = useRef<HTMLButtonElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const panelRef = useRef<HTMLDivElement>(null)
    const scrollRef = useRef<HTMLDivElement>(null)
    const spotlightRef = useRef<HTMLDivElement>(null)
    const spotlightMove = useRef<{ x: (v: number) => void; y: (v: number) => void } | null>(null)
    const dialogTitleId = useId()

    const displayMessages: ChatMessage[] = messages.length === 0 ? [{ role: 'assistant', text: t.aiAssistant.welcomeMessage }] : messages

    // Panel açılınca odağı input'a taşı, GSAP ile hafif bir giriş animasyonu oynat
    useEffect(() => {
        if (!isOpen) return
        inputRef.current?.focus()
        if (panelRef.current) {
            gsap.fromTo(
                panelRef.current,
                { opacity: 0, y: 16, scale: 0.96 },
                { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'back.out(1.4)' }
            )
        }
        // Fareyi takip eden spotlight ışığı için quickTo — custom cursor'da kullanılan aynı desen
        if (spotlightRef.current) {
            spotlightMove.current = {
                x: gsap.quickTo(spotlightRef.current, 'x', { duration: 0.4, ease: 'power3' }),
                y: gsap.quickTo(spotlightRef.current, 'y', { duration: 0.4, ease: 'power3' }),
            }
        }
    }, [isOpen])

    // Yeni mesaj/chunk geldiğinde sohbet alanını en alta kaydır
    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    }, [messages, isLoading])

    // Panel açıkken Escape ile kapat, kapanınca odağı tetikleyen butona geri ver
    useEffect(() => {
        if (!isOpen) return
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault()
                setIsOpen(false)
                toggleButtonRef.current?.focus()
            }
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [isOpen])

    const handlePanelMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!spotlightMove.current) return
        const rect = e.currentTarget.getBoundingClientRect()
        spotlightMove.current.x(e.clientX - rect.left)
        spotlightMove.current.y(e.clientY - rect.top)
    }

    const sendMessage = async (text: string) => {
        const trimmed = text.trim()
        if (!trimmed || isLoading) return

        const history = messages.slice(-8)
        setMessages((prev) => [...prev, { role: 'user', text: trimmed }])
        setInput('')
        setIsLoading(true)
        setError(null)

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: trimmed, history, lang }),
            })

            if (!res.ok) {
                const data = (await res.json().catch(() => null)) as { error?: string } | null
                throw new Error(data?.error ?? t.aiAssistant.genericHttpError(res.status))
            }
            if (!res.body) throw new Error(t.aiAssistant.errorMessage)

            const reader = res.body.getReader()
            const decoder = new TextDecoder()
            let assistantStarted = false

            while (true) {
                const { done, value } = await reader.read()
                if (done) break
                const chunk = decoder.decode(value, { stream: true })
                if (!chunk) continue

                if (!assistantStarted) {
                    assistantStarted = true
                    setIsLoading(false)
                    setMessages((prev) => [...prev, { role: 'assistant', text: chunk }])
                } else {
                    setMessages((prev) => {
                        const next = [...prev]
                        const last = next[next.length - 1]
                        next[next.length - 1] = { ...last, text: last.text + chunk }
                        return next
                    })
                }
            }

            if (!assistantStarted) throw new Error(t.aiAssistant.errorMessage)
        } catch {
            setError(t.aiAssistant.errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            {/* Yeni asistan cevapları için ekran okuyucu duyurusu */}
            <div aria-live="polite" style={srOnlyStyle}>
                {isLoading ? t.aiAssistant.typingAnnouncement : messages[messages.length - 1]?.role === 'assistant' ? messages[messages.length - 1].text : ''}
            </div>

            {/* Açma/kapama butonu — kapalıyken dikkat çeken bir nabız halkasıyla çevrili */}
            <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1500, width: '58px', height: '58px' }}>
                {!isOpen && (
                    <span
                        aria-hidden="true"
                        className="ai-pulse-ring"
                        style={{
                            position: 'absolute', inset: 0, borderRadius: '50%',
                            background: BRAND_COLOR, pointerEvents: 'none',
                        }}
                    />
                )}
                <button
                    ref={toggleButtonRef}
                    onClick={() => setIsOpen((v) => !v)}
                    aria-expanded={isOpen}
                    aria-controls="ai-assistant-panel"
                    aria-label={isOpen ? t.aiAssistant.closeAriaLabel : t.aiAssistant.openAriaLabel}
                    style={{
                        position: 'relative', width: '58px', height: '58px', borderRadius: '50%', border: 'none',
                        background: isOpen ? '#1a1a1a' : BRAND_COLOR, color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: `0 8px 28px rgba(255, 87, 34, 0.4)`, cursor: 'pointer',
                        transition: 'background 0.25s ease, transform 0.2s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
                >
                    {isOpen ? <X size={24} /> : <Bot size={26} />}
                </button>
            </div>

            {isOpen && (
                <div
                    className="ai-border-shimmer"
                    style={{
                        position: 'fixed', bottom: '94px', right: '24px', zIndex: 1500,
                        width: 'min(360px, calc(100vw - 32px))', height: 'min(520px, calc(100vh - 140px))',
                        borderRadius: '20px', padding: '1.5px',
                        background: `linear-gradient(120deg, ${BRAND_COLOR}, #7c2d12, #ffab91, ${BRAND_COLOR}, #7c2d12)`,
                        boxShadow: '0 20px 60px rgba(0,0,0,0.55)',
                    }}
                >
                    <div
                        ref={panelRef}
                        id="ai-assistant-panel"
                        role="dialog"
                        aria-modal="false"
                        aria-labelledby={dialogTitleId}
                        onMouseMove={handlePanelMouseMove}
                        style={{
                            position: 'relative', width: '100%', height: '100%',
                            background: '#0e0e0e', borderRadius: '18.5px',
                            display: 'flex', flexDirection: 'column', overflow: 'hidden',
                        }}
                    >
                        {/* Fareyi takip eden spotlight ışığı */}
                        <div
                            ref={spotlightRef}
                            aria-hidden="true"
                            style={{
                                position: 'absolute', top: 0, left: 0, width: '260px', height: '260px',
                                borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
                                background: `radial-gradient(circle, rgba(255,87,34,0.16) 0%, transparent 70%)`,
                                transform: 'translate(-50%, -50%)', filter: 'blur(10px)',
                            }}
                        />

                        {/* Robot sahnesi + başlık — panel her açıldığında interaktif 3D robot canlanır */}
                        <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '148px', flexShrink: 0, background: '#050505', borderBottom: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                            <SplineRobot />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, #050505 0%, transparent 55%)', pointerEvents: 'none' }} />
                            <div style={{ position: 'absolute', bottom: '10px', left: '16px', pointerEvents: 'none' }}>
                                <div id={dialogTitleId} style={{ color: '#fff', fontWeight: 800, fontSize: '14px', textShadow: '0 2px 10px rgba(0,0,0,0.9)' }}>{t.aiAssistant.title}</div>
                                <div style={{ color: '#ddd', fontSize: '11px', textShadow: '0 2px 10px rgba(0,0,0,0.9)' }}>{t.aiAssistant.subtitle}</div>
                            </div>
                        </div>

                        {/* Mesaj listesi */}
                        <div ref={scrollRef} style={{ position: 'relative', zIndex: 1, flex: 1, overflowY: 'auto', padding: '16px 16px 8px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {displayMessages.map((m, i) => (
                                <div
                                    key={i}
                                    className="ai-msg-in"
                                    style={{
                                        display: 'flex', alignItems: 'flex-end', gap: '8px',
                                        alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                                        flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
                                        maxWidth: '90%',
                                    }}
                                >
                                    {m.role === 'assistant' && (
                                        <div aria-hidden="true" style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(255,87,34,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Sparkles size={11} color={BRAND_COLOR} />
                                        </div>
                                    )}
                                    <div
                                        style={{
                                            padding: '10px 14px', borderRadius: '14px', fontSize: '13.5px', lineHeight: 1.55,
                                            background: m.role === 'user' ? BRAND_COLOR : 'rgba(255,255,255,0.06)',
                                            color: m.role === 'user' ? '#fff' : '#e4e4e4',
                                            border: m.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.08)',
                                            whiteSpace: 'pre-wrap',
                                        }}
                                    >
                                        {m.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '4px', padding: '10px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px' }}>
                                    {[0, 1, 2].map((i) => (
                                        <span
                                            key={i}
                                            aria-hidden="true"
                                            className="ai-bounce"
                                            style={{
                                                width: '6px', height: '6px', borderRadius: '50%', background: BRAND_COLOR,
                                                animationDelay: `${i * 0.15}s`,
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                            {error && (
                                <div role="alert" style={{ alignSelf: 'flex-start', color: '#ff8a65', fontSize: '12px', padding: '4px 6px' }}>
                                    {error}
                                </div>
                            )}
                        </div>

                        {/* Hızlı öneriler — sadece sohbetin başında gösterilir */}
                        {messages.length === 0 && (
                            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexWrap: 'wrap', gap: '6px', padding: '0 16px 12px' }}>
                                {t.aiAssistant.suggestions.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => sendMessage(s)}
                                        disabled={isLoading}
                                        style={{
                                            border: '1px solid rgba(255,87,34,0.35)', background: 'rgba(255,87,34,0.08)', color: '#ffab91',
                                            borderRadius: '20px', padding: '6px 12px', fontSize: '11.5px', cursor: 'pointer',
                                        }}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Giriş alanı */}
                        <form
                            onSubmit={(e) => { e.preventDefault(); sendMessage(input) }}
                            style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '8px', padding: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}
                        >
                            <label htmlFor="ai-assistant-input" style={srOnlyStyle}>{t.aiAssistant.inputLabel}</label>
                            <input
                                ref={inputRef}
                                id="ai-assistant-input"
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={t.aiAssistant.inputPlaceholder}
                                maxLength={500}
                                disabled={isLoading}
                                style={{
                                    flex: 1, background: '#161616', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px',
                                    padding: '10px 14px', color: '#fff', fontSize: '13px', outline: 'none',
                                }}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                aria-label={t.aiAssistant.sendAriaLabel}
                                style={{
                                    width: '40px', height: '40px', borderRadius: '12px', border: 'none', flexShrink: 0,
                                    background: input.trim() && !isLoading ? BRAND_COLOR : 'rgba(255,255,255,0.08)',
                                    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: input.trim() && !isLoading ? 'pointer' : 'default', transition: 'background 0.2s ease',
                                }}
                            >
                                <Send size={16} />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
