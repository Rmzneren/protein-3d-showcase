import { Suspense, lazy } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { Footer } from './components/Footer'
import { ScrollToTop } from './components/ScrollToTop'
import { AiAssistant } from './components/AiAssistant'
import { CartDrawer } from './components/CartDrawer'
import { CheckoutModal } from './components/CheckoutModal'
import { CartProvider } from './context/CartContext'
import { useCart } from './hooks/useCart'
import { Sparkles, Activity, Mail, ShoppingBag } from 'lucide-react'

// Navbar'daki sepet butonu — dolu ürün sayısını rozet olarak gösterir
function CartButton() {
    const { totalItems, openCart } = useCart()
    return (
        <button
            onClick={openCart}
            aria-label={totalItems > 0 ? `Sepeti aç, içinde ${totalItems} ürün var` : 'Sepeti aç'}
            style={{
                position: 'relative', width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.03)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0,
            }}
        >
            <ShoppingBag size={17} />
            {totalItems > 0 && (
                <span
                    aria-hidden="true"
                    style={{
                        position: 'absolute', top: '-4px', right: '-4px', minWidth: '18px', height: '18px', borderRadius: '9px',
                        background: '#ff5722', color: '#fff', fontSize: '10px', fontWeight: 800,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', border: '2px solid #0a0a0a',
                    }}
                >
                    {totalItems}
                </span>
            )}
        </button>
    )
}

// Rota bazlı kod bölme — her sayfa sadece ziyaret edildiğinde indirilir,
// ilk yüklemede diğer iki sayfanın kodu hiç indirilmez.
const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })))
const NutritionPage = lazy(() => import('./pages/NutritionPage').then((m) => ({ default: m.NutritionPage })))
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })))

// Sayfa geçişlerinde kod indirilirken gösterilen minimal, marka renginde yükleme göstergesi
function PageFallback() {
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div style={{ display: 'flex', gap: '6px' }} aria-label="Sayfa yükleniyor" role="status">
                {[0, 1, 2].map((i) => (
                    <span
                        key={i}
                        className="ai-bounce"
                        style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#ff5722', animationDelay: `${i * 0.15}s` }}
                    />
                ))}
            </div>
        </div>
    )
}

export function App() {
    const location = useLocation()
    const isActive = (path: string) => location.pathname === path

    return (
        <CartProvider>
        <ScrollToTop />
        <div style={{ background: '#0a0a0a', minHeight: '100vh', width: '100%', color: '#fff', display: 'flex', flexDirection: 'column' }}>
            {/* Header / Navbar */}
            <header style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '20px 5%', 
                background: 'rgba(10, 10, 10, 0.85)', 
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                width: '100%',
                boxSizing: 'border-box'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px', fontWeight: 900, letterSpacing: '1.5px' }}>
                    <Sparkles size={22} color="#ff5722" />
                    <span>PROTEIN<span style={{ color: '#ff5722' }}>3D</span></span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <nav style={{ display: 'flex', gap: '10px', background: 'rgba(255,255,255,0.03)', padding: '6px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <Link
                        to="/"
                        style={{ 
                            background: isActive('/') ? '#ffffff' : 'transparent', 
                            color: isActive('/') ? '#000000' : '#a0aec0', 
                            padding: '10px 22px', 
                            borderRadius: '20px', 
                            textDecoration: 'none', 
                            fontWeight: 700,
                            fontSize: '13px',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <Sparkles size={14} /> Ana Sayfa
                    </Link>
                    <Link 
                        to="/nutrition"
                        style={{ 
                            background: isActive('/nutrition') ? '#ffffff' : 'transparent', 
                            color: isActive('/nutrition') ? '#000000' : '#a0aec0', 
                            padding: '10px 22px', 
                            borderRadius: '20px', 
                            textDecoration: 'none', 
                            fontWeight: 700,
                            fontSize: '13px',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <Activity size={14} /> Beslenme Bilimi
                    </Link>
                    <Link 
                        to="/contact"
                        style={{ 
                            background: isActive('/contact') ? '#ffffff' : 'transparent', 
                            color: isActive('/contact') ? '#000000' : '#a0aec0', 
                            padding: '10px 22px', 
                            borderRadius: '20px', 
                            textDecoration: 'none', 
                            fontWeight: 700,
                            fontSize: '13px',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <Mail size={14} /> İletişim
                    </Link>
                </nav>
                <CartButton />
                </div>
            </header>

            {/* Main Content Area */}
            <main style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column' }}>
                <Suspense fallback={<PageFallback />}>
                    <Routes>
                        <Route path="/" element={<HomePage onSelect={() => {}} />} />
                        <Route path="/nutrition" element={<NutritionPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                    </Routes>
                </Suspense>
            </main>

            <Footer />
            <AiAssistant />
            <CartDrawer />
            <CheckoutModal />
        </div>
        </CartProvider>
    )
}

export default App