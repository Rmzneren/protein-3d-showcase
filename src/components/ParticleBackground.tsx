import { useEffect, useRef } from 'react'

interface ParticleBackgroundProps {
    color: string
    rgba: string
    activeIdx: number
    // true iken parçacıklar hareket etmez, tek bir statik kare çizilir
    // (prefers-reduced-motion desteği — sürekli arkaplan animasyonu vestibüler
    // rahatsızlığa yol açabileceği için kullanıcı tercihine saygı gösterilir)
    reducedMotion?: boolean
}

export function ParticleBackground({ color, reducedMotion = false }: ParticleBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationFrameId: number
        let width = (canvas.width = window.innerWidth)
        let height = (canvas.height = window.innerHeight)

        const handleResize = () => {
            if (!canvas) return
            width = canvas.width = window.innerWidth
            height = canvas.height = window.innerHeight
        }
        window.addEventListener('resize', handleResize)

        const particles: Array<{ x: number; y: number; size: number; speedX: number; speedY: number }> = []
        for (let i = 0; i < 40; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
            })
        }

        const drawFrame = () => {
            ctx.clearRect(0, 0, width, height)
            particles.forEach((p) => {
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fillStyle = color
                ctx.globalAlpha = 0.3
                ctx.fill()
            })
        }

        const render = () => {
            particles.forEach((p) => {
                p.x += p.speedX
                p.y += p.speedY
                if (p.x < 0) p.x = width
                if (p.x > width) p.x = 0
                if (p.y < 0) p.y = height
                if (p.y > height) p.y = 0
            })
            drawFrame()
            animationFrameId = requestAnimationFrame(render)
        }

        // Hareketi azalt tercihinde tek statik kare çizilir, requestAnimationFrame döngüsü hiç başlamaz
        if (reducedMotion) {
            drawFrame()
        } else {
            render()
        }

        return () => {
            window.removeEventListener('resize', handleResize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [color, reducedMotion])

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                zIndex: 0,
            }}
        />
    )
}