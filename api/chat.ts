import type { VercelRequest, VercelResponse } from '@vercel/node'
import Anthropic from '@anthropic-ai/sdk'
import { localizeFlavors } from '../src/data/flavors.js'
import type { Lang } from '../src/i18n/types.js'

// ==========================================================
// RV3 AI BESLENME ASİSTANI — Vercel Serverless Function
// ==========================================================
// API anahtarı (ANTHROPIC_API_KEY) sadece bu sunucu tarafında okunur, istemciye
// hiç gönderilmez. Anahtar tanımlı değilse fonksiyon kural-tabanlı bir demo
// yanıtına düşer — widget anahtarsız da çalışır, anahtar eklenince otomatik
// olarak gerçek Claude yanıtlarına geçer.
//
// Yanıt, `text/plain` chunk'lar halinde STREAM edilir (SSE değil — daha basit bir
// "ham metin akışı" protokolü, istemci sadece gövdeyi okuyup ekliyor). Anahtar
// yokken de aynı akış deneyimini korumak için mock yanıt da kelime kelime,
// küçük gecikmelerle yazılır (bkz. streamMockReply) — böylece widget davranışı
// anahtarlı/anahtarsız durumda tutarlı kalır.

const MAX_MESSAGE_LENGTH = 500
const MAX_HISTORY_TURNS = 8 // prompt boyutunu ve maliyeti kontrol altında tutmak için son N mesaj

interface ChatTurn {
    role: 'user' | 'assistant'
    text: string
}

function isChatTurn(value: unknown): value is ChatTurn {
    if (typeof value !== 'object' || value === null) return false
    const v = value as Record<string, unknown>
    return (v.role === 'user' || v.role === 'assistant') && typeof v.text === 'string'
}

function parseLang(value: unknown): Lang {
    return value === 'en' ? 'en' : 'tr'
}

const ERROR_MESSAGES: Record<Lang, { methodNotAllowed: string; messageRequired: string; messageTooLong: (max: number) => string }> = {
    tr: {
        methodNotAllowed: 'Yalnızca POST isteklerine izin verilir',
        messageRequired: 'message alanı zorunlu ve boş olamaz',
        messageTooLong: (max) => `Mesaj çok uzun (maks ${max} karakter)`,
    },
    en: {
        methodNotAllowed: 'Only POST requests are allowed',
        messageRequired: 'The message field is required and cannot be empty',
        messageTooLong: (max) => `Message is too long (max ${max} characters)`,
    },
}

function buildSystemPrompt(lang: Lang): string {
    const flavors = localizeFlavors(lang)
    const flavorLines = flavors
        .map((f) => `- ${f.title} (${f.badge}): ${f.desc} Protein: ${f.stats.protein}, BCAA: ${f.stats.bcaa}, Kcal: ${f.stats.kcal}, Sugar: ${f.stats.sugar}.`)
        .join('\n')

    if (lang === 'en') {
        return [
            'You are the RV3 brand\'s friendly nutrition assistant. Always answer in English, in short replies (at most 3-4 sentences).',
            'Recommend the most suitable flavor and usage timing/dosage to the user.',
            'Do not give medical diagnoses; for serious health concerns, gently suggest consulting a doctor/dietitian.',
            'Only discuss RV3 products and general sports nutrition; politely redirect off-topic questions back to the products.',
            '',
            'Available flavors:',
            flavorLines,
            '',
            'General usage tip: within 30 minutes after training, 1-2 scoops (25-50g) with 250ml water or milk.',
        ].join('\n')
    }

    return [
        'Sen RV3 markasının Türkçe konuşan, samimi ve kısa cevaplar veren beslenme asistanısın.',
        'Kullanıcıya en uygun aromayı ve kullanım zamanlamasını/dozajını öner. Cevapların en fazla 3-4 cümle olsun.',
        'Tıbbi teşhis koyma; ciddi sağlık şikayetlerinde nazikçe bir doktora/diyetisyene danışmasını söyle.',
        'Sadece RV3 ürünleri ve genel spor beslenmesi hakkında konuş; alakasız konularda kibarca ürünlere geri dön.',
        '',
        'Mevcut aromalar:',
        flavorLines,
        '',
        'Genel kullanım önerisi: antrenman sonrası 30 dakika içinde, 250ml su veya süt ile 1-2 ölçek (25-50g).',
    ].join('\n')
}

// API anahtarı yokken veya bir hata oluştuğunda devreye giren basit anahtar-kelime
// eşleştirmeli yanıt üretici — widget'ın anahtar olmadan da çalışır durumda kalmasını sağlar.
// Kontroller en spesifikten en genele doğru sıralı: önce net niyet (laktoz, "hangi aroma"
// gibi kalıplar), sonra tek tek aroma isimleri, en sonda genel karşılama.
function mockReplyTr(message: string): string {
    const lower = message.toLowerCase()
    const FLAVORS = localizeFlavors('tr')

    if (lower.includes('laktoz') || lower.includes('intoleran')) {
        return 'Formülümüz mikro-filtrasyon teknolojisiyle üretildiği için laktoz oranı son derece düşük — çoğu laktoz hassasiyeti olan kullanıcı rahatça tüketebiliyor. Yine de hassasiyetin ciddiyse önce doktoruna/diyetisyenine danışmanı öneririm.'
    }
    if (lower.includes('hangi aroma') || lower.includes('hangi tat') || lower.includes('hangisini') || (lower.includes('öner') && !lower.includes('çikolata') && !lower.includes('muz') && !lower.includes('çilek'))) {
        return `Kas gelişimi ve doygunluk önceliğinse ${FLAVORS[0].title} (en yüksek protein), antrenman öncesi hafif bir enerji istiyorsan ${FLAVORS[1].title}, en düşük şekerli ve antioksidan destekli bir seçenek istiyorsan ${FLAVORS[2].title} tam sana göre. Hangisi kulağına daha hoş geliyor?`
    }
    if (lower.includes('çikolata') || lower.includes('kas')) {
        const f = FLAVORS[0]
        return `${f.title} tam sana göre — ${f.stats.protein} protein ve ${f.stats.bcaa} BCAA ile kas gelişimini destekler. Antrenman sonrası 30 dakika içinde 1 ölçek öneririz.`
    }
    if (lower.includes('muz') || lower.includes('enerji')) {
        const f = FLAVORS[1]
        return `${f.title} antrenman öncesi/sonrası ferahlatıcı bir seçenek — ${f.stats.kcal} kcal ile dengeli bir profil sunar.`
    }
    if (lower.includes('çilek') || lower.includes('meyve') || lower.includes('antioksidan')) {
        const f = FLAVORS[2]
        return `${f.title}, orman meyveleri ve antioksidanlarla zenginleştirilmiş, en düşük şekerli (${f.stats.sugar}) seçeneğimiz.`
    }
    if (lower.includes('ne zaman') || lower.includes('doz') || lower.includes('nasıl kullan') || lower.includes('miktar') || lower.includes('kaç ölçek')) {
        return `Genel öneri: antrenman sonrası 30 dakika içinde, 250ml su/süt ile 1-2 ölçek (25-50g). Gece yatmadan önce de kas onarımını desteklemek için tüketebilirsin.`
    }
    return `Merhaba! Aromalarımız, dozaj veya laktoz/şeker gibi içerik soruların hakkında yardımcı olabilirim. Hangisi sence en cazip: çikolata, muz yoksa çilek?`
}

function mockReplyEn(message: string): string {
    const lower = message.toLowerCase()
    const FLAVORS = localizeFlavors('en')

    if (lower.includes('lactose') || lower.includes('intoleran')) {
        return "Our formula is produced with micro-filtration technology, so its lactose content is extremely low — most people with lactose sensitivity can enjoy it comfortably. Still, if your sensitivity is severe, I'd recommend checking with your doctor/dietitian first."
    }
    if (lower.includes('which flavor') || lower.includes('which one') || lower.includes('recommend') && !lower.includes('chocolate') && !lower.includes('banana') && !lower.includes('berry')) {
        return `If muscle growth and satiety are your priority, ${FLAVORS[0].title} (highest protein) is great; for a light pre-workout energy boost, ${FLAVORS[1].title}; and if you want the lowest sugar with antioxidant support, ${FLAVORS[2].title} is perfect. Which one sounds best to you?`
    }
    if (lower.includes('chocolate') || lower.includes('muscle')) {
        const f = FLAVORS[0]
        return `${f.title} is perfect for you — with ${f.stats.protein} protein and ${f.stats.bcaa} BCAA it supports muscle growth. We recommend 1 scoop within 30 minutes after training.`
    }
    if (lower.includes('banana') || lower.includes('energy')) {
        const f = FLAVORS[1]
        return `${f.title} is a refreshing pre/post-workout option — it offers a balanced profile at ${f.stats.kcal} kcal.`
    }
    if (lower.includes('berry') || lower.includes('fruit') || lower.includes('antioxidant')) {
        const f = FLAVORS[2]
        return `${f.title} is enriched with wild berries and antioxidants — our lowest-sugar option (${f.stats.sugar}).`
    }
    if (lower.includes('when') || lower.includes('dose') || lower.includes('how to use') || lower.includes('how much') || lower.includes('how many scoop')) {
        return `General tip: within 30 minutes after training, 1-2 scoops (25-50g) with 250ml water/milk. You can also take it before bed to support muscle repair overnight.`
    }
    return `Hi! I can help with our flavors, dosage, or ingredient questions like lactose/sugar content. Which sounds most appealing: chocolate, banana, or berry?`
}

function mockReply(message: string, lang: Lang): string {
    return lang === 'en' ? mockReplyEn(message) : mockReplyTr(message)
}

// Mock yanıtı da gerçek akışla tutarlı bir "yazıyor" hissi versin diye kelime
// kelime, küçük gecikmelerle stream eder.
async function streamMockReply(res: VercelResponse, message: string, lang: Lang) {
    const reply = mockReply(message, lang)
    const chunks = reply.split(/(\s+)/).filter((c) => c.length > 0)
    for (const chunk of chunks) {
        res.write(chunk)
        await new Promise((resolve) => setTimeout(resolve, 18))
    }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: ERROR_MESSAGES.tr.methodNotAllowed })
        return
    }

    const body = (req.body ?? {}) as { message?: unknown; history?: unknown; lang?: unknown }
    const message = body.message
    const lang = parseLang(body.lang)
    const errors = ERROR_MESSAGES[lang]

    if (typeof message !== 'string' || !message.trim()) {
        res.status(400).json({ error: errors.messageRequired })
        return
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
        res.status(400).json({ error: errors.messageTooLong(MAX_MESSAGE_LENGTH) })
        return
    }

    const history = Array.isArray(body.history) ? body.history.filter(isChatTurn).slice(-MAX_HISTORY_TURNS) : []

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache, no-transform', 'X-Chat-Source': 'mock' })
        await streamMockReply(res, message, lang)
        res.end()
        return
    }

    let wroteAny = false
    try {
        const client = new Anthropic({ apiKey })

        // effort/output_config bu SDK sürümünde beta ad alanı altında — GA bir özellik
        // olduğu için ekstra bir "anthropic-beta" header'ı gerekmiyor.
        const stream = client.beta.messages.stream({
            model: 'claude-opus-5',
            max_tokens: 1024,
            system: buildSystemPrompt(lang),
            output_config: { effort: 'low' },
            messages: [
                ...history.map((turn) => ({ role: turn.role, content: turn.text })),
                { role: 'user' as const, content: message },
            ],
        })

        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache, no-transform', 'X-Chat-Source': 'ai' })

        stream.on('text', (delta) => {
            wroteAny = true
            res.write(delta)
        })

        await stream.finalMessage()

        // Model boş bir yanıt döndürdüyse (nadir ama olası) mock'a düş — henüz hiçbir
        // şey yazılmadıysa bu güvenli, akış istemciye hâlâ hiç ulaşmamış demektir.
        if (!wroteAny) {
            await streamMockReply(res, message, lang)
        }
        res.end()
    } catch (err) {
        console.error('AI assistant error:', err)
        if (!wroteAny) {
            // Henüz hiçbir chunk yazılmadıysa akışı temiz bir şekilde mock yanıtla başlatabiliriz.
            res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache, no-transform', 'X-Chat-Source': 'mock-fallback' })
            await streamMockReply(res, message, lang)
        }
        // Akış zaten başlamışsa (kısmi içerik gönderildiyse) geriye dönüp mock'a
        // geçemeyiz — istemciye o ana kadar gelen içerikle akışı sonlandırıyoruz.
        res.end()
    }
}
