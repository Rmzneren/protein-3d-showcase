import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Flavor } from '../data/flavors'
import { CartContext, type CartContextValue, type CartItem } from './cartStore'

// Sepet ve ödeme akışı tamamen istemci tarafında (frontend-only) çalışan bir
// demo — hiçbir veri sunucuya gönderilmez, sayfa yenilenince sıfırlanır.
// Gerçek bir e-ticaret/ödeme altyapısına bağlı DEĞİLDİR.
export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

    const addToCart = (flavor: Flavor, quantity = 1) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.flavor.id === flavor.id)
            if (existing) {
                return prev.map((i) => (i.flavor.id === flavor.id ? { ...i, quantity: i.quantity + quantity } : i))
            }
            return [...prev, { flavor, quantity }]
        })
        setIsCartOpen(true)
    }

    const removeFromCart = (flavorId: string) => {
        setItems((prev) => prev.filter((i) => i.flavor.id !== flavorId))
    }

    const updateQuantity = (flavorId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(flavorId)
            return
        }
        setItems((prev) => prev.map((i) => (i.flavor.id === flavorId ? { ...i, quantity } : i)))
    }

    const clearCart = () => setItems([])

    const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items])
    const totalPrice = useMemo(() => items.reduce((sum, i) => sum + i.quantity * i.flavor.price, 0), [items])

    const value: CartContextValue = {
        items,
        totalItems,
        totalPrice,
        isCartOpen,
        isCheckoutOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        openCheckout: () => { setIsCartOpen(false); setIsCheckoutOpen(true) },
        closeCheckout: () => setIsCheckoutOpen(false),
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
    }

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
