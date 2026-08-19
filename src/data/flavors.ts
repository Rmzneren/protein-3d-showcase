export interface Flavor {
    id: string
    title: string
    desc: string
    color: string
    rgba: string
    image: string
    badge: string
    stats: {
        protein: string
        bcaa: string
        kcal: string
        sugar: string
    }
}

export const FLAVORS: Flavor[] = [
    {
        id: 'whey-chocolate',
        title: 'EXTREME CHOCOLATE',
        desc: 'Maksimum kas büyümesi ve onarımı için zengin Belçika çikolatası aromalı saf whey protein.',
        color: '#ff5722',
        rgba: 'rgba(255, 87, 34, 0.25)',
        image: '/images/chocolate.webp',
        badge: 'BEST SELLER',
        stats: { protein: '27g', bcaa: '6.2g', kcal: '118', sugar: '0.5g' }
    },
    {
        id: 'whey-banana',
        title: 'BANANA BLAST',
        desc: 'Doğal muz özleriyle zenginleştirilmiş, antrenman sonrası ferahlatıcı ve besleyici formül.',
        color: '#ffeb3b',
        rgba: 'rgba(255, 235, 59, 0.25)',
        image: '/images/banana.webp',
        badge: 'NEW FORMULA',
        stats: { protein: '26g', bcaa: '5.8g', kcal: '115', sugar: '0.4g' }
    },
    {
        id: 'whey-berry',
        title: 'BERRY FUSION',
        desc: 'Orman meyvelerinin antioksidan gücüyle yenilenin, performansınızı zirveye taşıyın.',
        color: '#e91e63',
        rgba: 'rgba(233, 30, 99, 0.25)',
        image: '/images/berry.webp',
        badge: 'ENERGY BOOST',
        stats: { protein: '28g', bcaa: '6.5g', kcal: '120', sugar: '0.2g' }
    }
]