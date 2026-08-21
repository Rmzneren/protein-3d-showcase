import { Suspense, lazy, useState } from 'react'
import type { CSSProperties } from 'react'
import { Bot } from 'lucide-react'
import { shouldLoadHeavy3D } from '../utils/deviceCapability'

// Interaktif 3D robot sahnesi — AI asistan panelinin üst kısmında gösterilir.
// Spline'ın Runtime'ı ağır olduğu için (WebGL + birkaç MB), lazy() ile sadece
// panel ilk kez açıldığında indirilir — sayfa ilk yüklemesini yavaşlatmaz.
const Spline = lazy(() => import('@splinetool/react-spline'))

// Not: Bu, Spline'ın herkese açık demo sahnelerinden biri — RV3'e özel
// tasarlanmış değil. Markaya özel bir robot istenirse Spline editöründe
// oluşturulup bu URL değiştirilebilir.
const ROBOT_SCENE_URL = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode'

interface SplineRobotProps {
    style?: CSSProperties
}

export function SplineRobot({ style }: SplineRobotProps) {
    // Yavaş bağlantı / veri tasarrufu / düşük bellekli cihazlarda ~1.5MB'lık
    // WebGL sahnesini hiç indirmeyip hafif, statik bir rozete düşer.
    const [canLoad3D] = useState(shouldLoadHeavy3D)

    if (!canLoad3D) {
        return (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle, rgba(255,87,34,0.18) 0%, transparent 70%)', ...style }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,87,34,0.15)', border: '1px solid rgba(255,87,34,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bot size={30} color="#ff5722" aria-hidden="true" />
                </div>
            </div>
        )
    }

    return (
        <Suspense
            fallback={
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', ...style }}>
                    <div style={{ display: 'flex', gap: '4px' }} aria-hidden="true">
                        {[0, 1, 2].map((i) => (
                            <span
                                key={i}
                                className="ai-bounce"
                                style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ff5722', animationDelay: `${i * 0.15}s` }}
                            />
                        ))}
                    </div>
                    <span style={{ color: '#888', fontSize: '11px', letterSpacing: '0.3px' }}>Yapay zeka asistanınız yükleniyor…</span>
                </div>
            }
        >
            <Spline scene={ROBOT_SCENE_URL} style={{ width: '100%', height: '100%', ...style }} />
        </Suspense>
    )
}
