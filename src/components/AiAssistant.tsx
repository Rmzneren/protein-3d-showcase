import { useEffect, useId, useRef, useState } from 'react'
import gsap from 'gsap'
import { Bot, Loader2, Send, Sparkles, X } from 'lucide-react'
import { srOnlyStyle } from '../utils/a11y'

// Sitede her sayfada görünen, sağ altta sabit duran AI beslenme asistanı.
// /api/chat (Vercel serverless function) üzerinden Claude'a bağlanır; API anahtarı
// tanımlı değilse backend otomatik olarak kural-tabanlı bir demo yanıtına düşer,
// yani widget anahtarsız da çalışır durumda kalır.

const BRAND_COLOR = '#ff5722'

interface ChatMessage {
    role: 'user' | 'assistant'
    text: string
}

const SUGGESTIONS = ['Hangi aroma bana uygun?', 'Ne zaman içmeliyim?', 'Laktoz intoleransım var, olur mu?']

const WELCOME_MESSAGE: ChatMessage = {
    role: 'assistant',
    text: 'Merhaba! Ben PROTEIN3D AI Beslenme Asistanıyım. Aromalar, dozaj veya kullanım zamanlaması hakkında sorabilirsin. 💪',
}

export function AiAssistant() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const toggleButtonRef = useRef<HTMLButtonElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const panelRef = useRef<HTMLDivElement>(null)
    const scrollRef = useRef<HTMLDivElement>(null)
    const dialogTitleId = useId()

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
    }, [isOpen])

    // Yeni mesaj geldiğinde sohbet alanını en alta kaydır
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
                body: JSON.stringify({ message: trimmed, history }),
            })

            if (!res.ok) {
                const data = (await res.json().catch(() => null)) as { error?: string } | null
                throw new Error(data?.error ?? `İstek başarısız oldu (${res.status})`)
            }

            const data = (await res.json()) as { reply: string }
            setMessages((prev) => [...prev, { role: 'assistant', text: data.reply }])
        } catch {
            setError('Şu an bağlanamıyorum. Lütfen birazdan tekrar dene.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            {/* Yeni asistan cevapları için ekran okuyucu duyurusu */}
            <div aria-live="polite" style={srOnlyStyle}>
                {isLoading ? 'Asistan yazıyor…' : messages[messages.length - 1]?.role === 'assistant' ? messages[messages.length - 1].text : ''}
            </div>

            {/* Açma/kapama butonu */}
            <button
                ref={toggleButtonRef}
                onClick={() => setIsOpen((v) => !v)}
                aria-expanded={isOpen}
                aria-controls="ai-assistant-panel"
                aria-label={isOpen ? 'AI Beslenme Asistanını kapat' : 'AI Beslenme Asistanını aç'}
                style={{
                    position: 'fixed', bottom: '24px', right: '24px', zIndex: 1500,
                    width: '58px', height: '58px', borderRadius: '50%', border: 'none',
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

            {isOpen && (
                <div
                    ref={panelRef}
                    id="ai-assistant-panel"
                    role="dialog"
                    aria-modal="false"
                    aria-labelledby={dialogTitleId}
                    style={{
                        position: 'fixed', bottom: '94px', right: '24px', zIndex: 1500,
                        width: 'min(360px, calc(100vw - 32px))', height: 'min(520px, calc(100vh - 140px))',
                        background: '#0e0e0e', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '20px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', overflow: 'hidden',
                    }}
                >
                    {/* Başlık */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,87,34,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Sparkles size={18} color={BRAND_COLOR} />
                        </div>
                        <div>
                            <div id={dialogTitleId} style={{ color: '#fff', fontWeight: 800, fontSize: '14px' }}>AI Beslenme Asistanı</div>
                            <div style={{ color: '#888', fontSize: '11px' }}>PROTEIN3D · her zaman çevrimiçi</div>
                        </div>
                    </div>

                    {/* Mesaj listesi */}
                    <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 8px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                style={{
                                    alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                                    maxWidth: '84%', padding: '10px 14px', borderRadius: '14px', fontSize: '13.5px', lineHeight: 1.55,
                                    background: m.role === 'user' ? BRAND_COLOR : 'rgba(255,255,255,0.06)',
                                    color: m.role === 'user' ? '#fff' : '#e4e4e4',
                                    border: m.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.08)',
                                    whiteSpace: 'pre-wrap',
                                }}
                            >
                                {m.text}
                            </div>
                        ))}
                        {isLoading && (
                            <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px', color: '#888', fontSize: '12px', padding: '4px 6px' }}>
                                <Loader2 size={14} className="ai-spin" aria-hidden="true" />
                                yazıyor…
                            </div>
                        )}
                        {error && (
                            <div role="alert" style={{ alignSelf: 'flex-start', color: '#ff8a65', fontSize: '12px', padding: '4px 6px' }}>
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Hızlı öneriler — sadece sohbetin başında gösterilir */}
                    {messages.length === 1 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', padding: '0 16px 12px' }}>
                            {SUGGESTIONS.map((s) => (
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
                        style={{ display: 'flex', gap: '8px', padding: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}
                    >
                        <label htmlFor="ai-assistant-input" style={srOnlyStyle}>Mesajınız</label>
                        <input
                            ref={inputRef}
                            id="ai-assistant-input"
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Bir soru sor…"
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
                            aria-label="Gönder"
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
            )}
        </>
    )
}
