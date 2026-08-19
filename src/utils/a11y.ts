import type { CSSProperties } from 'react'

// Görsel olarak gizli ama ekran okuyucular tarafından okunabilen içerik için
// standart "sr-only" stili — canlı bölgeler ve gizli form etiketlerinde kullanılır.
export const srOnlyStyle: CSSProperties = {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: 0,
}
