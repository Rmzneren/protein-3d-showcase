import { createContext } from 'react'
import type { Flavor } from '../data/flavors'

export interface CartItem {
    flavor: Flavor
    quantity: number
}

export interface CartContextValue {
    items: CartItem[]
    totalItems: number
    totalPrice: number
    isCartOpen: boolean
    isCheckoutOpen: boolean
    openCart: () => void
    closeCart: () => void
    openCheckout: () => void
    closeCheckout: () => void
    addToCart: (flavor: Flavor, quantity?: number) => void
    removeFromCart: (flavorId: string) => void
    updateQuantity: (flavorId: string, quantity: number) => void
    clearCart: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)
