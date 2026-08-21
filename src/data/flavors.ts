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

// Ham veri: `desc`, `title` ve `badge` dil başına ayrı tutulur — TR sitede her şey
// Türkçe, EN sitede her şey İngilizce görünsün diye (marka ismi/rozet dahil).
interface RawFlavor extends Omit<Flavor, 'desc' | 'title' | 'badge'> {
    desc: Record<Lang, string>
    title: Record<Lang, string>
    badge: Record<Lang, string>
}

const FLAVORS_RAW: RawFlavor[] = [
    {
        id: 'whey-chocolate',
        title: { tr: 'EKSTREM ÇİKOLATA', en: 'EXTREME CHOCOLATE' },
        desc: {
            tr: 'Maksimum kas büyümesi ve onarımı için zengin Belçika çikolatası aromalı saf whey protein.',
            en: 'Pure whey protein in a rich Belgian chocolate flavor, formulated for maximum muscle growth and repair.',
        },
        color: '#ff5722',
        rgba: 'rgba(255, 87, 34, 0.25)',
        image: '/images/chocolate.webp',
        badge: { tr: 'ÇOK SATAN', en: 'BEST SELLER' },
        price: 249,
        stats: { protein: '27g', bcaa: '6.2g', kcal: '118', sugar: '0.5g' },
    },
    {
        id: 'whey-banana',
        title: { tr: 'MUZ PATLAMASI', en: 'BANANA BLAST' },
        desc: {
            tr: 'Doğal muz özleriyle zenginleştirilmiş, antrenman sonrası ferahlatıcı ve besleyici formül.',
            en: 'Enriched with natural banana extract — a refreshing, nourishing formula for after your workout.',
        },
        color: '#ffeb3b',
        rgba: 'rgba(255, 235, 59, 0.25)',
        image: '/images/banana.webp',
        badge: { tr: 'YENİ FORMÜL', en: 'NEW FORMULA' },
        price: 229,
        stats: { protein: '26g', bcaa: '5.8g', kcal: '115', sugar: '0.4g' },
    },
    {
        id: 'whey-berry',
        title: { tr: 'ORMAN MEYVESİ', en: 'BERRY FUSION' },
        desc: {
            tr: 'Orman meyvelerinin antioksidan gücüyle yenilenin, performansınızı zirveye taşıyın.',
            en: 'Recharge with the antioxidant power of wild berries and take your performance to the top.',
        },
        color: '#e91e63',
        rgba: 'rgba(233, 30, 99, 0.25)',
        image: '/images/berry.webp',
        badge: { tr: 'ENERJİ DESTEĞİ', en: 'ENERGY BOOST' },
        price: 259,
        stats: { protein: '28g', bcaa: '6.5g', kcal: '120', sugar: '0.2g' },
    },
]

export function localizeFlavors(lang: Lang): Flavor[] {
    return FLAVORS_RAW.map(({ desc, title, badge, ...rest }) => ({
        ...rest,
        desc: desc[lang],
        title: title[lang],
        badge: badge[lang],
    }))
}

// Dile bağlı olmayan (veya henüz dil parametresi almayan) kullanım yerleri için
// varsayılan Türkçe liste — bkz. api/chat.ts (kendi içinde localizeFlavors çağırır).
export const FLAVORS: Flavor[] = localizeFlavors('tr')
