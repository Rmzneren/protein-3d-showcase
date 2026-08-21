import { CreditCard } from 'lucide-react'

interface AnimatedCreditCardProps {
    cardNumber: string
    cardName: string
    expiry: string
    cvv: string
    isFlipped: boolean
}

// Girilen bilgilere göre canlı güncellenen, CVV alanına odaklanınca arkasını
// gösteren interaktif kredi kartı önizlemesi. Tamamen görsel/demo amaçlı —
// hiçbir gerçek kart ağı logosuyla ilişkili değil, gerçek doğrulama yapmaz.
function detectBrand(cardNumber: string): { label: string; gradient: string } {
    const digits = cardNumber.replace(/\s/g, '')
    if (digits.startsWith('4')) return { label: 'VISA TARZI', gradient: 'linear-gradient(135deg, #1a3a8f, #2f5fd1)' }
    if (/^5[1-5]/.test(digits)) return { label: 'MASTER TARZI', gradient: 'linear-gradient(135deg, #7a1f1f, #b3401f)' }
    return { label: 'RV3 KART', gradient: 'linear-gradient(135deg, #1a1a1a, #3a1a10)' }
}

export function AnimatedCreditCard({ cardNumber, cardName, expiry, cvv, isFlipped }: AnimatedCreditCardProps) {
    const digits = cardNumber.replace(/\s/g, '').padEnd(16, '•')
    const displayNumber = (cardNumber ? cardNumber.padEnd(19, '•') : '•••• •••• •••• ••••').slice(0, 19)
    const displayName = cardName.trim() ? cardName.toUpperCase() : 'AD SOYAD'
    const displayExpiry = expiry || 'AA/YY'
    const brand = detectBrand(digits)

    return (
        <div style={{ perspective: '1200px', width: '100%', maxWidth: '360px', margin: '0 auto' }}>
            <div
                style={{
                    position: 'relative', width: '100%', aspectRatio: '1.586', transformStyle: 'preserve-3d',
                    transition: 'transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
            >
                {/* Ön yüz */}
                <div
                    style={{
                        position: 'absolute', inset: 0, borderRadius: '16px', backfaceVisibility: 'hidden',
                        background: brand.gradient, padding: '20px 22px', display: 'flex', flexDirection: 'column',
                        justifyContent: 'space-between', boxShadow: '0 20px 45px rgba(0,0,0,0.45)', color: '#fff',
                        border: '1px solid rgba(255,255,255,0.08)',
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ width: '38px', height: '28px', borderRadius: '6px', background: 'linear-gradient(135deg, #f0d060, #d4af37)' }} aria-hidden="true" />
                        <CreditCard size={22} color="rgba(255,255,255,0.7)" aria-hidden="true" />
                    </div>
                    <div style={{ fontSize: 'clamp(15px, 4.5vw, 19px)', letterSpacing: '2.5px', fontFamily: 'monospace', wordSpacing: '4px' }}>
                        {displayNumber}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontSize: '9px', opacity: 0.6, marginBottom: '3px', letterSpacing: '1px' }}>KART SAHİBİ</div>
                            <div style={{ fontSize: '13px', letterSpacing: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayName}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '9px', opacity: 0.6, marginBottom: '3px', letterSpacing: '1px' }}>SKT</div>
                            <div style={{ fontSize: '13px', letterSpacing: '1px', fontFamily: 'monospace' }}>{displayExpiry}</div>
                        </div>
                    </div>
                    <div style={{ position: 'absolute', bottom: '10px', right: '16px', fontSize: '9px', opacity: 0.5, letterSpacing: '1px' }}>{brand.label}</div>
                </div>

                {/* Arka yüz */}
                <div
                    style={{
                        position: 'absolute', inset: 0, borderRadius: '16px', backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)', background: brand.gradient, boxShadow: '0 20px 45px rgba(0,0,0,0.45)',
                        border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden',
                    }}
                >
                    <div style={{ width: '100%', height: '42px', background: '#0a0a0a', marginTop: '22px' }} aria-hidden="true" />
                    <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ alignSelf: 'flex-end', width: '70px', background: '#f4f4f4', color: '#222', borderRadius: '4px', padding: '8px 10px', fontFamily: 'monospace', fontSize: '13px', textAlign: 'right', letterSpacing: '2px' }}>
                            {cvv ? cvv.padEnd(3, '•') : '•••'}
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '9px', marginTop: '20px' }}>
                            Bu kart tamamen kurgusaldır — hiçbir işlemde kullanılmaz.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
