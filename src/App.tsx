import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { ContactPage } from './pages/ContactPage'
import { NutritionPage } from './pages/NutritionPage'
import { Footer } from './components/Footer'
import { AiAssistant } from './components/AiAssistant'
import { Sparkles, Activity, Mail } from 'lucide-react'

export function App() {
    const location = useLocation()
    const isActive = (path: string) => location.pathname === path

    return (
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
            </header>

            {/* Main Content Area */}
            <main style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column' }}>
                <Routes>
                    <Route path="/" element={<HomePage onSelect={() => {}} />} />
                    <Route path="/nutrition" element={<NutritionPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                </Routes>
            </main>

            <Footer />
            <AiAssistant />
        </div>
    )
}

export default App