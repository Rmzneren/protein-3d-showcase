// Bağımsız (React'ten habersiz) dil tipi — hem istemci tarafındaki context'ler hem de
// sunucu tarafında çalışan api/chat.ts ve src/data/flavors.ts bu dosyayı import edebilir
// (tsconfig.api.json sadece api/ + flavors.ts'i tarıyor ama import edilen dosyaları da
// otomatik olarak type-check kapsamına alır — bu yüzden burada DOM/React'e bağımlı
// hiçbir şey olmamalı).
export type Lang = 'tr' | 'en'

export const DEFAULT_LANG: Lang = 'tr'
