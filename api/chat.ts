import type { VercelRequest, VercelResponse } from '@vercel/node'
import Anthropic from '@anthropic-ai/sdk'
import { FLAVORS } from '../src/data/flavors'

// ==========================================================
// PROTEIN3D AI BESLENME ASİSTANI — Vercel Serverless Function
// ==========================================================
// API anahtarı (ANTHROPIC_API_KEY) sadece bu sunucu tarafında okunur, istemciye
// hiç gönderilmez. Anahtar tanımlı değilse fonksiyon kural-tabanlı bir demo
// yanıtına düşer — widget anahtarsız da çalışır, anahtar eklenince otomatik
// olarak gerçek Claude yanıtlarına geçer.

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

function buildSystemPrompt(): string {
    const flavorLines = FLAVORS.map(
        (f) =>
            `- ${f.title} (${f.badge}): ${f.desc} Protein: ${f.stats.protein}, BCAA: ${f.stats.bcaa}, Kalori: ${f.stats.kcal}, Şeker: ${f.stats.sugar}.`
    ).join('\n')

    return [
        "Sen PROTEIN3D markasının Türkçe konuşan, samimi ve kısa cevaplar veren beslenme asistanısın.",
        'Kullanıcıya en uygun aromayı ve kullanım zamanlamasını/dozajını öner. Cevapların en fazla 3-4 cümle olsun.',
        'Tıbbi teşhis koyma; ciddi sağlık şikayetlerinde nazikçe bir doktora/diyetisyene danışmasını söyle.',
        'Sadece PROTEIN3D ürünleri ve genel spor beslenmesi hakkında konuş; alakasız konularda kibarca ürünlere geri dön.',
        '',
        'Mevcut aromalar:',
        flavorLines,
        '',
        'Genel kullanım önerisi: antrenman sonrası 30 dakika içinde, 250ml su veya süt ile 1-2 ölçek (25-50g).',
    ].join('\n')
}

// API anahtarı yokken veya bir hata oluştuğunda devreye giren basit anahtar-kelime
// eşleştirmeli demo yanıtı — widget'ın anahtar olmadan da "çalışır görünmesini" sağlar.
function mockReply(message: string): string {
    const lower = message.toLowerCase()
    const note = '\n\n_(Demo modu — gerçek AI yanıtları için ANTHROPIC_API_KEY tanımlanmalı.)_'

    if (lower.includes('çikolata') || lower.includes('kas')) {
        const f = FLAVORS[0]
        return `${f.title} tam sana göre — ${f.stats.protein} protein ve ${f.stats.bcaa} BCAA ile kas gelişimini destekler. Antrenman sonrası 30 dakika içinde 1 ölçek öneririz.${note}`
    }
    if (lower.includes('muz') || lower.includes('enerji')) {
        const f = FLAVORS[1]
        return `${f.title} antrenman öncesi/sonrası ferahlatıcı bir seçenek — ${f.stats.kcal} kcal ile dengeli bir profil sunar.${note}`
    }
    if (lower.includes('çilek') || lower.includes('meyve') || lower.includes('antioksidan')) {
        const f = FLAVORS[2]
        return `${f.title}, orman meyveleri ve antioksidanlarla zenginleştirilmiş, en düşük şekerli (${f.stats.sugar}) seçeneğimiz.${note}`
    }
    if (lower.includes('ne zaman') || lower.includes('doz') || lower.includes('nasıl kullan')) {
        return `Genel öneri: antrenman sonrası 30 dakika içinde, 250ml su/süt ile 1-2 ölçek (25-50g).${note}`
    }
    return `Merhaba! Aromalarımız ve kullanım önerileri hakkında sorularını yanıtlayabilirim. Hangisi sence en cazip: çikolata, muz yoksa çilek?${note}`
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' })
        return
    }

    const body = (req.body ?? {}) as { message?: unknown; history?: unknown }
    const message = body.message

    if (typeof message !== 'string' || !message.trim()) {
        res.status(400).json({ error: 'message alanı zorunlu ve boş olamaz' })
        return
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
        res.status(400).json({ error: `Mesaj çok uzun (maks ${MAX_MESSAGE_LENGTH} karakter)` })
        return
    }

    const history = Array.isArray(body.history) ? body.history.filter(isChatTurn).slice(-MAX_HISTORY_TURNS) : []

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
        res.status(200).json({ reply: mockReply(message), source: 'mock' })
        return
    }

    try {
        const client = new Anthropic({ apiKey })

        // effort/output_config bu SDK sürümünde beta ad alanı altında — GA bir özellik
        // olduğu için ekstra bir "anthropic-beta" header'ı gerekmiyor.
        const response = await client.beta.messages.create({
            model: 'claude-opus-5',
            max_tokens: 1024,
            system: buildSystemPrompt(),
            output_config: { effort: 'low' },
            messages: [
                ...history.map((turn) => ({ role: turn.role, content: turn.text })),
                { role: 'user' as const, content: message },
            ],
        })

        let reply = ''
        for (const block of response.content) {
            if (block.type === 'text') reply += block.text
        }

        res.status(200).json({ reply: reply || mockReply(message), source: 'ai' })
    } catch (err) {
        console.error('AI assistant error:', err)
        res.status(200).json({ reply: mockReply(message), source: 'mock-fallback' })
    }
}
