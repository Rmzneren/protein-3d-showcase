import { useEffect, useId, useRef } from 'react'
import gsap from 'gsap'
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useCart } from '../hooks/useCart'
import { srOnlyStyle } from '../utils/a11y'

const BRAND_COLOR = '#ff5722'

// Sağdan kayarak açılan sepet paneli — CartContext üzerinden state'i okur.
// Tamamen istemci tarafında, sayfa yenilenince sıfırlanan bir demo sepeti.
export function CartDrawer() {
    const { items, totalPrice, isCartOpen, closeCart, openCheckout, removeFromCart, updateQuantity } = useCart()
    const panelRef = useRef<HTMLDivElement>(null)
    const closeButtonRef = useRef<HTMLButtonElement>(null)
    const titleId = useId()

    useEffect(() => {
        if (!isCartOpen) return
        closeButtonRef.current?.focus()
        if (panelRef.current) {
            gsap.fromTo(panelRef.current, { x: '100%' }, { x: '0%', duration: 0.4, ease: 'power3.out' })
        }
    }, [isCartOpen])

    useEffect(() => {
        if (!isCartOpen) return
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeCart()
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [isCartOpen, closeCart])

    if (!isCartOpen) return null

    return (
        <>
            <div
                onClick={closeCart}
                aria-hidden="true"
                style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 2100, cursor: 'default' }}
            />
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                style={{
                    position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 2101,
                    width: 'min(400px, 100vw)', background: '#0e0e0e', borderLeft: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', flexDirection: 'column', boxShadow: '-20px 0 60px rgba(0,0,0,0.5)',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 22px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <ShoppingBag size={20} color={BRAND_COLOR} />
                        <h2 id={titleId} style={{ color: '#fff', fontSize: '16px', fontWeight: 800, margin: 0 }}>Sepetim</h2>
                    </div>
                    <button
                        ref={closeButtonRef}
                        onClick={closeCart}
                        aria-label="Sepeti kapat"
                        style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '50%', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}
                    >
                        <X size={16} />
                    </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '16px 22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {items.length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#777', marginTop: '60px', fontSize: '13.5px' }}>
                            Sepetin şu an boş.<br />Bir aroma seçip "Sepete Ekle" ile başla.
                        </div>
                    ) : (
                        items.map(({ flavor, quantity }) => (
                            <div key={flavor.id} style={{ display: 'flex', gap: '14px', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                <img src={flavor.image} alt={flavor.title} style={{ width: '54px', height: '54px', objectFit: 'contain', filter: `drop-shadow(0 6px 14px ${flavor.rgba})` }} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ color: '#fff', fontWeight: 700, fontSize: '13px', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{flavor.title}</div>
                                    <div style={{ color: BRAND_COLOR, fontSize: '12.5px', fontWeight: 800 }}>{flavor.price}₺</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '4px' }}>
                                    <button
                                        onClick={() => updateQuantity(flavor.id, quantity - 1)}
                                        aria-label={`${flavor.title} adedini azalt`}
                                        style={{ width: '24px', height: '24px', border: 'none', background: 'transparent', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <Minus size={13} />
                                    </button>
                                    <span style={{ color: '#fff', fontSize: '12.5px', fontWeight: 700, minWidth: '14px', textAlign: 'center' }}>{quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(flavor.id, quantity + 1)}
                                        aria-label={`${flavor.title} adedini artır`}
                                        style={{ width: '24px', height: '24px', border: 'none', background: 'transparent', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <Plus size={13} />
                                    </button>
                                </div>
                                <button
                                    onClick={() => removeFromCart(flavor.id)}
                                    aria-label={`${flavor.title} ürününü sepetten çıkar`}
                                    style={{ border: 'none', background: 'transparent', color: '#666', cursor: 'pointer', padding: '4px' }}
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <div style={{ padding: '18px 22px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontSize: '14px' }}>
                            <span style={{ color: '#999' }}>Toplam</span>
                            <span style={{ color: '#fff', fontWeight: 800, fontSize: '17px' }}>{totalPrice}₺</span>
                        </div>
                        <button
                            onClick={openCheckout}
                            style={{
                                width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: BRAND_COLOR,
                                color: '#fff', fontWeight: 800, fontSize: '13.5px', letterSpacing: '0.5px', cursor: 'pointer',
                            }}
                        >
                            Ödemeye Geç
                        </button>
                        <p style={{ margin: '10px 0 0', textAlign: 'center', color: '#555', fontSize: '10.5px' }}>
                            Bu bir portföy demosudur — gerçek bir ödeme alınmaz.
                        </p>
                    </div>
                )}
                <div aria-live="polite" style={srOnlyStyle}>
                    {items.length > 0 ? `Sepette ${items.length} farklı ürün, toplam ${totalPrice} lira` : ''}
                </div>
            </div>
        </>
    )
}
