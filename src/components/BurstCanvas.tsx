import { forwardRef, useImperativeHandle, useRef } from 'react'
import gsap from 'gsap'

export interface BurstCanvasRef {
    // emoji verilirse (örn. '🍫') parçacıkların bir kısmı o karakterle, ürüne özel olarak patlar.
    // emoji verilmezse davranış eskisiyle birebir aynıdır (renkli daire parçacıkları).
    triggerBurst: (x: number, y: number, color: string, rgba: string, emoji?: string) => void
}

export const BurstCanvas = forwardRef<BurstCanvasRef>((_, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)

    useImperativeHandle(ref, () => ({
        triggerBurst(x, y, color, rgba, emoji) {
            if (!containerRef.current) return

            // Klasik parıltı parçacıkları — eski davranışla birebir aynı
            const sparkCount = 16
            for (let i = 0; i < sparkCount; i++) {
                const spark = document.createElement('div')
                const angle = (i / sparkCount) * Math.PI * 2
                const distance = 80 + Math.random() * 100
                const targetX = x + Math.cos(angle) * distance
                const targetY = y + Math.sin(angle) * distance

                spark.style.position = 'fixed'
                spark.style.left = `${x}px`
                spark.style.top = `${y}px`
                spark.style.width = '6px'
                spark.style.height = '6px'
                spark.style.backgroundColor = color
                spark.style.borderRadius = '50%'
                spark.style.pointerEvents = 'none'
                spark.style.zIndex = '9999'
                spark.style.boxShadow = `0 0 10px ${rgba}`

                containerRef.current.appendChild(spark)

                gsap.to(spark, {
                    x: targetX - x,
                    y: targetY - y,
                    opacity: 0,
                    scale: Math.random() * 1.5 + 0.5,
                    duration: 0.6,
                    ease: 'power3.out',
                    onComplete: () => spark.remove(),
                })
            }

            // Ürüne özel emoji parçacıkları — sadece emoji verildiyse eklenir
            if (emoji) {
                const emojiCount = 12
                for (let i = 0; i < emojiCount; i++) {
                    const piece = document.createElement('div')
                    const angle = -Math.PI / 2 + (Math.random() - 0.5) * (Math.PI * 0.9)
                    const distance = 90 + Math.random() * 140
                    const targetX = x + Math.cos(angle) * distance
                    const targetY = y + Math.sin(angle) * distance - 40
                    const size = Math.random() * 14 + 20
                    const rotation = (Math.random() - 0.5) * 720

                    piece.textContent = emoji
                    piece.style.position = 'fixed'
                    piece.style.left = `${x}px`
                    piece.style.top = `${y}px`
                    piece.style.fontSize = `${size}px`
                    piece.style.lineHeight = '1'
                    piece.style.pointerEvents = 'none'
                    piece.style.zIndex = '9999'
                    piece.style.transform = 'translate(-50%, -50%)'
                    piece.style.filter = `drop-shadow(0 4px 10px ${rgba})`
                    piece.style.willChange = 'transform, opacity'

                    containerRef.current.appendChild(piece)

                    gsap.fromTo(
                        piece,
                        { x: 0, y: 0, opacity: 1, scale: 0.4, rotation: 0 },
                        {
                            x: targetX - x,
                            y: targetY - y,
                            opacity: 0,
                            scale: 1,
                            rotation,
                            duration: 0.85 + Math.random() * 0.3,
                            ease: 'power2.out',
                            onComplete: () => piece.remove(),
                        }
                    )

                    // Yerçekimi hissi için ikinci bir aşama — yukarı fırlayıp geri düşsün
                    gsap.to(piece, {
                        y: `+=${40 + Math.random() * 30}`,
                        duration: 0.4,
                        delay: 0.45,
                        ease: 'power1.in',
                    })
                }
            }
        },
    }))

    return <div ref={containerRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }} />
})