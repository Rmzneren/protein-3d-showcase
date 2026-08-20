import type { Lang } from '../i18n/types'

export interface Flavor {
    id: string
    title: string
    desc: string
    color: string
    rgba: string
    image: string
    badge: string
    price: number // TL — pazarlama/demo amaçlı, gerçek bir ödeme sistemine bağlı değil
    stats: {
        protein: string
        bcaa: string
        kcal: string
        sugar: string
    }
}

// Ham veri: `desc` (pazarlama açıklaması) dil başına ayrı tutulur. `title`/`badge`
// bilinçli olarak çevrilmiyor — marka isimleri ("EXTREME CHOCOLATE") ve rozetler
// ("BEST SELLER", "NEW FORMULA") zaten İngilizce/stilize, TR sitede de öyle kullanılıyordu.
interface RawFlavor extends Omit<Flavor, 'desc'> {
    desc: Record<Lang, string>
}

const FLAVORS_RAW: RawFlavor[] = [
    {
        id: 'whey-chocolate',
        title: 'EXTREME CHOCOLATE',
        desc: {
            tr: 'Maksimum kas büyümesi ve onarımı için zengin Belçika çikolatası aromalı saf whey protein.',
            en: 'Pure whey protein in a rich Belgian chocolate flavor, formulated for maximum muscle growth and repair.',
        },
        color: '#ff5722',
        rgba: 'rgba(255, 87, 34, 0.25)',
        image: '/images/chocolate.webp',
        badge: 'BEST SELLER',
        price: 249,
        stats: { protein: '27g', bcaa: '6.2g', kcal: '118', sugar: '0.5g' },
    },
    {
        id: 'whey-banana',
        title: 'BANANA BLAST',
        desc: {
            tr: 'Doğal muz özleriyle zenginleştirilmiş, antrenman sonrası ferahlatıcı ve besleyici formül.',
            en: 'Enriched with natural banana extract — a refreshing, nourishing formula for after your workout.',
        },
        color: '#ffeb3b',
        rgba: 'rgba(255, 235, 59, 0.25)',
        image: '/images/banana.webp',
        badge: 'NEW FORMULA',
        price: 229,
        stats: { protein: '26g', bcaa: '5.8g', kcal: '115', sugar: '0.4g' },
    },
    {
        id: 'whey-berry',
        title: 'BERRY FUSION',
        desc: {
            tr: 'Orman meyvelerinin antioksidan gücüyle yenilenin, performansınızı zirveye taşıyın.',
            en: 'Recharge with the antioxidant power of wild berries and take your performance to the top.',
        },
        color: '#e91e63',
        rgba: 'rgba(233, 30, 99, 0.25)',
        image: '/images/berry.webp',
        badge: 'ENERGY BOOST',
        price: 259,
        stats: { protein: '28g', bcaa: '6.5g', kcal: '120', sugar: '0.2g' },
    },
]

export function localizeFlavors(lang: Lang): Flavor[] {
    return FLAVORS_RAW.map(({ desc, ...rest }) => ({ ...rest, desc: desc[lang] }))
}

// Dile bağlı olmayan (veya henüz dil parametresi almayan) kullanım yerleri için
// varsayılan Türkçe liste — bkz. api/chat.ts (kendi içinde localizeFlavors çağırır).
export const FLAVORS: Flavor[] = localizeFlavors('tr')
