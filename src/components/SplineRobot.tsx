import { Suspense, lazy } from 'react'
import type { CSSProperties } from 'react'

// Interaktif 3D robot sahnesi — AI asistan panelinin üst kısmında gösterilir.
// Spline'ın Runtime'ı ağır olduğu için (WebGL + birkaç MB), lazy() ile sadece
// panel ilk kez açıldığında indirilir — sayfa ilk yüklemesini yavaşlatmaz.
const Spline = lazy(() => import('@splinetool/react-spline'))

// Not: Bu, Spline'ın herkese açık demo sahnelerinden biri — PROTEIN3D'ye özel
// tasarlanmış değil. Markaya özel bir robot istenirse Spline editöründe
// oluşturulup bu URL değiştirilebilir.
const ROBOT_SCENE_URL = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode'

interface SplineRobotProps {
    style?: CSSProperties
}

export function SplineRobot({ style }: SplineRobotProps) {
    return (
        <Suspense
            fallback={
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}>
                    <span aria-hidden="true" className="ai-bounce" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5722' }} />
                </div>
            }
        >
            <Spline scene={ROBOT_SCENE_URL} style={{ width: '100%', height: '100%', ...style }} />
        </Suspense>
    )
}
