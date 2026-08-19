import { useContext } from 'react'
import { CartContext } from '../context/cartStore'

export function useCart() {
    const ctx = useContext(CartContext)
    if (!ctx) throw new Error('useCart, CartProvider içinde kullanılmalı')
    return ctx
}
