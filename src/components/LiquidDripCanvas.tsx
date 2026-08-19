import { forwardRef, useImperativeHandle, useRef } from 'react'
import gsap from 'gsap'

export interface LiquidDripCanvasRef {
    // Bir ürün kartının üzerine gelindiğinde çağrılır — şişenin kenarlarından
    // (rect) aromaya özel renkte (color/rgba) sıvı damlamaya başlar.
    startDrip: (key: string, rect: DOMRect, color: string, rgba: string) => void
    // Fare karttan ayrıldığında o kartın damlamasını durdurur.
    stopDrip: (key: string) => void
}

// Her aktif damlama için: periyodik olarak yeni damla üreten interval id'si
interface ActiveDrip {
    intervalId: number
}

export const LiquidDripCanvas = forwardRef<LiquidDripCanvasRef>((_, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const activeRef = useRef<Record<string, ActiveDrip>>({})

    useImperativeHandle(ref, () => ({
        startDrip(key, rect, color, rgba) {
            // Aynı kart için zaten akıyorsa tekrar başlatma
            if (activeRef.current[key]) return

            const spawnDrop = () => {
                if (!containerRef.current) return

                const edge = Math.random() < 0.5 ? 'left' : 'right'
                const edgeX = edge === 'left' ? rect.left + rect.width * 0.08 : rect.left + rect.width * 0.92
                const startX = edgeX + (Math.random() - 0.5) * (rect.width * 0.1)
                const startY = rect.top + rect.height * (0.2 + Math.random() * 0.55)

                const width = 7 + Math.random() * 6
                const height = width * 1.6

                const drop = document.createElement('div')
                drop.style.position = 'fixed'
                drop.style.left = `${startX}px`
                drop.style.top = `${startY}px`
                drop.style.width = `${width}px`
                drop.style.height = `${height}px`
                // Damla şekli: üstte dar, altta yuvarlak — klasik CSS "gözyaşı" tekniği
                drop.style.borderRadius = '50% 50% 50% 50% / 32% 32% 68% 68%'
                drop.style.background = `linear-gradient(180deg, ${color} 0%, ${color} 55%, ${rgba} 100%)`
                drop.style.boxShadow = `0 0 10px ${rgba}`
                drop.style.pointerEvents = 'none'
                drop.style.zIndex = '50'
                drop.style.opacity = '0'
                drop.style.transformOrigin = 'top center'

                containerRef.current.appendChild(drop)

                const fallDistance = rect.height * (0.5 + Math.random() * 0.45) + 40

                gsap.timeline({ onComplete: () => drop.remove() })
                    .to(drop, { opacity: 1, duration: 0.12 })
                    .to(drop, {
                        y: fallDistance,
                        x: (Math.random() - 0.5) * 18,
                        scaleY: 1.3,
                        duration: 0.85 + Math.random() * 0.35,
                        ease: 'power1.in',
                    }, '<')
                    .to(drop, { opacity: 0, duration: 0.3 }, '-=0.25')
            }

            spawnDrop()
            const intervalId = window.setInterval(spawnDrop, 200)
            activeRef.current[key] = { intervalId }
        },

        stopDrip(key) {
            const active = activeRef.current[key]
            if (active) {
                window.clearInterval(active.intervalId)
                delete activeRef.current[key]
            }
        },
    }))

    return <div ref={containerRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50 }} />
})
