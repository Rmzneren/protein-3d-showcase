import { useEffect, useId, useRef } from 'react'
import type { CSSProperties } from 'react'

// ==========================================================
// SIVI METAL ARKA PLAN — threejs-components (Kevin Levron) kütüphanesi
// ==========================================================
// Bu kütüphane npm üzerinden bundler'a import edilecek şekilde belgelenmemiş;
// resmi/topluluk tarafından doğrulanmış tek kullanım şekli CDN üzerinden dinamik
// <script type="module"> ile yüklenmesi (bkz. jsDelivr build/backgrounds/liquid1.min.js).
// Bu yüzden burada da aynı desen izleniyor — ama Unsplash yerine kendi ürün
// görsellerimiz kullanılıyor ve aroma değiştikçe görsel canlı olarak güncelleniyor.
// Kütüphanenin TypeScript tipleri yok, bu yüzden `any` kullanımı bilinçli bir tercih.

const LIQUID_CDN_URL = 'https://cdn.jsdelivr.net/npm/threejs-components@0.0.22/build/backgrounds/liquid1.min.js'

interface LiquidApp {
    liquidPlane: { material: { metalness: number; roughness: number }; uniforms: { displacementScale: { value: number } } }
    loadImage: (url: string) => void
    setRain: (enabled: boolean) => void
    dispose?: () => void
}

declare global {
    interface Window {
        __liquidApps?: Record<string, LiquidApp>
    }
}

interface LiquidBackgroundProps {
    imageUrl: string
    style?: CSSProperties
}

export function LiquidBackground({ imageUrl, style }: LiquidBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const appRef = useRef<LiquidApp | null>(null)
    const rawId = useId()
    const canvasId = `liquid-canvas-${rawId.replace(/[^a-zA-Z0-9]/g, '')}`
    const readyEventName = `liquid-ready-${canvasId}`

    // Kurulum — bir kez, CDN'den script yüklenir
    useEffect(() => {
        let cancelled = false

        const script = document.createElement('script')
        script.type = 'module'
        script.textContent = `
            import('${LIQUID_CDN_URL}')
                .then((mod) => {
                    const canvas = document.getElementById('${canvasId}');
                    if (!canvas) return;
                    const LiquidBackground = mod.default;
                    const app = LiquidBackground(canvas);
                    app.liquidPlane.material.metalness = 0.6;
                    app.liquidPlane.material.roughness = 0.35;
                    app.liquidPlane.uniforms.displacementScale.value = 3.5;
                    app.setRain(true);
                    window.__liquidApps = window.__liquidApps || {};
                    window.__liquidApps['${canvasId}'] = app;
                    window.dispatchEvent(new CustomEvent('${readyEventName}'));
                })
                .catch((err) => console.error('Sıvı arka plan (threejs-components) yüklenemedi:', err));
        `
        document.body.appendChild(script)

        const onReady = () => {
            if (cancelled) return
            appRef.current = window.__liquidApps?.[canvasId] ?? null
            appRef.current?.loadImage(imageUrl)
        }
        window.addEventListener(readyEventName, onReady)

        return () => {
            cancelled = true
            window.removeEventListener(readyEventName, onReady)
            try { appRef.current?.dispose?.() } catch { /* CDN kaynağı zaten temizlenmiş olabilir */ }
            if (document.body.contains(script)) document.body.removeChild(script)
            if (window.__liquidApps) delete window.__liquidApps[canvasId]
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Aroma değişince görseli canlı güncelle
    useEffect(() => {
        appRef.current?.loadImage(imageUrl)
    }, [imageUrl])

    return (
        <canvas
            ref={canvasRef}
            id={canvasId}
            aria-hidden="true"
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                mixBlendMode: 'screen',
                opacity: 0.28,
                maskImage: 'radial-gradient(ellipse 42% 40% at 50% 55%, black 20%, transparent 65%)',
                WebkitMaskImage: 'radial-gradient(ellipse 42% 40% at 50% 55%, black 20%, transparent 65%)',
                ...style,
            }}
        />
    )
}
