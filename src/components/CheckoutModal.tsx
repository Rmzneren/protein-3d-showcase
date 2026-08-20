import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import gsap from 'gsap'
import { Check, ChevronLeft, Lock, X } from 'lucide-react'
import { useCart } from '../hooks/useCart'
import { useLanguage } from '../hooks/useLanguage'
import { AnimatedCreditCard } from './AnimatedCreditCard'
import { srOnlyStyle } from '../utils/a11y'

const BRAND_COLOR = '#ff5722'

type Step = 'shipping' | 'payment' | 'success'

const inputStyle: CSSProperties = {
    width: '100%', background: '#161616', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px',
    padding: '12px 14px', color: '#fff', fontSize: '13.5px', outline: 'none', boxSizing: 'border-box',
}
const labelStyle: CSSProperties = { display: 'block', color: '#999', fontSize: '11.5px', marginBottom: '6px', fontWeight: 700, letterSpacing: '0.3px' }

function formatCardNumber(raw: string) {
    return raw.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}
function formatExpiry(raw: string) {
    const digits = raw.replace(/\D/g, '').slice(0, 4)
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}

// Tamamen frontend'de çalışan, çok adımlı sepet/ödeme demosu. Hiçbir veri
// herhangi bir sunucuya gönderilmez; bu gerçek bir ödeme altyapısı DEĞİLDİR.
export function CheckoutModal() {
    const { items, totalPrice, isCheckoutOpen, closeCheckout, clearCart } = useCart()
    const { t } = useLanguage()
    const [step, setStep] = useState<Step>('shipping')
    const [shipping, setShipping] = useState({ name: '', address: '', city: '', zip: '', email: '' })
    const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' })
    const [isCvvFocused, setIsCvvFocused] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [orderNumber, setOrderNumber] = useState('')

    const modalRef = useRef<HTMLDivElement>(null)
    const firstFieldRef = useRef<HTMLInputElement>(null)
    const successIconRef = useRef<HTMLDivElement>(null)
    const titleId = useId()

    useEffect(() => {
        if (!isCheckoutOpen) return
        setStep('shipping')
        setIsProcessing(false)
        requestAnimationFrame(() => firstFieldRef.current?.focus())
        if (modalRef.current) {
            gsap.fromTo(modalRef.current, { opacity: 0, scale: 0.96, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'power3.out' })
        }
    }, [isCheckoutOpen])

    useEffect(() => {
        if (step !== 'success' || !successIconRef.current) return
        gsap.fromTo(successIconRef.current, { scale: 0, rotate: -45 }, { scale: 1, rotate: 0, duration: 0.55, ease: 'back.out(1.8)' })
    }, [step])

    useEffect(() => {
        if (!isCheckoutOpen) return
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !isProcessing) closeCheckout()
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [isCheckoutOpen, isProcessing, closeCheckout])

    if (!isCheckoutOpen) return null

    const shippingValid = shipping.name.trim() && shipping.address.trim() && shipping.city.trim() && shipping.email.trim()
    const cardDigits = card.number.replace(/\s/g, '')
    const paymentValid = cardDigits.length === 16 && card.name.trim() && /^\d{2}\/\d{2}$/.test(card.expiry) && card.cvv.length === 3

    const handlePay = () => {
        if (!paymentValid) return
        setIsProcessing(true)
        setTimeout(() => {
            setOrderNumber(`PT3D-${Math.floor(100000 + Math.random() * 900000)}`)
            setIsProcessing(false)
            setStep('success')
        }, 1600)
    }

    const handleClose = () => {
        if (isProcessing) return
        closeCheckout()
    }

    const handleFinish = () => {
        clearCart()
        closeCheckout()
    }

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div onClick={handleClose} aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)' }} />

            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                style={{
                    position: 'relative', width: 'min(460px, 100%)', maxHeight: '92vh', overflowY: 'auto',
                    background: '#0e0e0e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '22px',
                    padding: '26px', boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
                }}
            >
                {!isProcessing && (
                    <button
                        onClick={handleClose}
                        aria-label={t.checkout.closeAriaLabel}
                        style={{ position: 'absolute', top: '18px', right: '18px', background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}
                    >
                        <X size={15} />
                    </button>
                )}

                <div aria-live="polite" style={srOnlyStyle}>
                    {step === 'shipping' && t.checkout.liveShipping}
                    {step === 'payment' && t.checkout.livePayment}
                    {step === 'success' && t.checkout.liveSuccess(orderNumber)}
                </div>

                {step !== 'success' && (
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '22px' }}>
                        {(['shipping', 'payment'] as Step[]).map((s, i) => (
                            <div key={s} style={{ flex: 1, height: '3px', borderRadius: '2px', background: step === s || (s === 'shipping' && step === 'payment') ? BRAND_COLOR : 'rgba(255,255,255,0.1)' }} aria-hidden="true">
                                <span style={srOnlyStyle}>{i === 0 ? t.checkout.stepShippingLabel : t.checkout.stepPaymentLabel}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* --- ADIM 1: TESLİMAT --- */}
                {step === 'shipping' && (
                    <>
                        <h2 id={titleId} style={{ color: '#fff', fontSize: '18px', fontWeight: 800, marginBottom: '4px' }}>{t.checkout.shipping.title}</h2>
                        <p style={{ color: '#888', fontSize: '12.5px', marginBottom: '20px' }}>{t.checkout.shipping.summary(items.length, totalPrice)}</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div>
                                <label style={labelStyle} htmlFor="ship-name">{t.checkout.shipping.nameLabel}</label>
                                <input ref={firstFieldRef} id="ship-name" style={inputStyle} value={shipping.name} onChange={(e) => setShipping((s) => ({ ...s, name: e.target.value }))} placeholder={t.checkout.shipping.namePlaceholder} />
                            </div>
                            <div>
                                <label style={labelStyle} htmlFor="ship-address">{t.checkout.shipping.addressLabel}</label>
                                <input id="ship-address" style={inputStyle} value={shipping.address} onChange={(e) => setShipping((s) => ({ ...s, address: e.target.value }))} placeholder={t.checkout.shipping.addressPlaceholder} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={labelStyle} htmlFor="ship-city">{t.checkout.shipping.cityLabel}</label>
                                    <input id="ship-city" style={inputStyle} value={shipping.city} onChange={(e) => setShipping((s) => ({ ...s, city: e.target.value }))} placeholder={t.checkout.shipping.cityPlaceholder} />
                                </div>
                                <div>
                                    <label style={labelStyle} htmlFor="ship-zip">{t.checkout.shipping.zipLabel}</label>
                                    <input id="ship-zip" style={inputStyle} value={shipping.zip} onChange={(e) => setShipping((s) => ({ ...s, zip: e.target.value }))} placeholder={t.checkout.shipping.zipPlaceholder} />
                                </div>
                            </div>
                            <div>
                                <label style={labelStyle} htmlFor="ship-email">{t.checkout.shipping.emailLabel}</label>
                                <input id="ship-email" type="email" style={inputStyle} value={shipping.email} onChange={(e) => setShipping((s) => ({ ...s, email: e.target.value }))} placeholder={t.checkout.shipping.emailPlaceholder} />
                            </div>
                        </div>

                        <button
                            onClick={() => shippingValid && setStep('payment')}
                            disabled={!shippingValid}
                            style={{
                                width: '100%', marginTop: '22px', padding: '14px', borderRadius: '12px', border: 'none',
                                background: shippingValid ? BRAND_COLOR : 'rgba(255,255,255,0.08)', color: '#fff',
                                fontWeight: 800, fontSize: '13.5px', cursor: shippingValid ? 'pointer' : 'default',
                            }}
                        >
                            {t.checkout.shipping.continueButton}
                        </button>
                    </>
                )}

                {/* --- ADIM 2: ÖDEME --- */}
                {step === 'payment' && (
                    <>
                        <button onClick={() => setStep('shipping')} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: '#999', fontSize: '12px', cursor: 'pointer', marginBottom: '14px', padding: 0 }}>
                            <ChevronLeft size={14} /> {t.checkout.payment.backButton}
                        </button>

                        <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: 800, marginBottom: '18px' }}>{t.checkout.payment.title}</h2>

                        <AnimatedCreditCard cardNumber={card.number} cardName={card.name} expiry={card.expiry} cvv={card.cvv} isFlipped={isCvvFocused} />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '22px' }}>
                            <div>
                                <label style={labelStyle} htmlFor="card-number">{t.checkout.payment.cardNumberLabel}</label>
                                <input
                                    id="card-number" style={inputStyle} inputMode="numeric" placeholder="0000 0000 0000 0000"
                                    value={card.number} onChange={(e) => setCard((c) => ({ ...c, number: formatCardNumber(e.target.value) }))}
                                />
                            </div>
                            <div>
                                <label style={labelStyle} htmlFor="card-name">{t.checkout.payment.cardNameLabel}</label>
                                <input id="card-name" style={inputStyle} value={card.name} onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))} placeholder={t.checkout.payment.cardNamePlaceholder} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={labelStyle} htmlFor="card-expiry">{t.checkout.payment.expiryLabel}</label>
                                    <input
                                        id="card-expiry" style={inputStyle} inputMode="numeric" placeholder="AA/YY"
                                        value={card.expiry} onChange={(e) => setCard((c) => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle} htmlFor="card-cvv">{t.checkout.payment.cvvLabel}</label>
                                    <input
                                        id="card-cvv" style={inputStyle} inputMode="numeric" placeholder="123" maxLength={3}
                                        value={card.cvv}
                                        onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) }))}
                                        onFocus={() => setIsCvvFocused(true)}
                                        onBlur={() => setIsCvvFocused(false)}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handlePay}
                            disabled={!paymentValid || isProcessing}
                            style={{
                                width: '100%', marginTop: '22px', padding: '14px', borderRadius: '12px', border: 'none',
                                background: paymentValid && !isProcessing ? BRAND_COLOR : 'rgba(255,255,255,0.08)', color: '#fff',
                                fontWeight: 800, fontSize: '13.5px', cursor: paymentValid && !isProcessing ? 'pointer' : 'default',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            }}
                        >
                            {isProcessing ? (
                                <>
                                    <span className="ai-spin" style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block' }} />
                                    {t.checkout.payment.processing}
                                </>
                            ) : (
                                <>
                                    <Lock size={14} /> {t.checkout.payment.payButton(totalPrice)}
                                </>
                            )}
                        </button>
                        <p style={{ margin: '10px 0 0', textAlign: 'center', color: '#555', fontSize: '10.5px' }}>
                            {t.checkout.payment.disclaimer}
                        </p>
                    </>
                )}

                {/* --- ADIM 3: BAŞARILI --- */}
                {step === 'success' && (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <div
                            ref={successIconRef}
                            style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(76,175,80,0.15)', border: '2px solid #4caf50', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}
                        >
                            <Check size={30} color="#4caf50" />
                        </div>
                        <h2 style={{ color: '#fff', fontSize: '19px', fontWeight: 800, marginBottom: '8px' }}>{t.checkout.success.title}</h2>
                        <p style={{ color: '#999', fontSize: '13px', marginBottom: '4px' }}>{t.checkout.success.orderNumberLabel}</p>
                        <p style={{ color: BRAND_COLOR, fontSize: '15px', fontWeight: 800, fontFamily: 'monospace', marginBottom: '20px' }}>{orderNumber}</p>
                        <p style={{ color: '#666', fontSize: '11.5px', marginBottom: '24px', lineHeight: 1.6 }}>
                            {t.checkout.success.disclaimer}
                        </p>
                        <button
                            onClick={handleFinish}
                            style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: BRAND_COLOR, color: '#fff', fontWeight: 800, fontSize: '13.5px', cursor: 'pointer' }}
                        >
                            {t.checkout.success.closeButton}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
