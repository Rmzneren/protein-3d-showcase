import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

// React Router SPA navigasyonu (Link/useNavigate) tarayıcının scroll konumunu
// KENDİLİĞİNDEN sıfırlamaz — sayfa içeriği DOM'da yer değiştirse de scrollY aynı
// kalır. Bunun sonucu: örneğin Ana Sayfa'da aşağı kaydırılmışken "Beslenme Bilimi"ye
// geçilirse yeni sayfa da aynı offset'ten (hero'yu atlayıp bir bölümün ortasından)
// açılır — "scroll bozuk" hissi veren asıl sebep budur. Bu bileşen her rota
// değişiminde scroll'u en tepeye alır; <Routes> ile aynı seviyede, App.tsx içinde
// bir kez monte edilir.
//
// useEffect DEĞİL useLayoutEffect: rota değiştiği anda React önce kısa süreliğine
// route-level code-splitting'in Suspense fallback'ini (bkz. App.tsx > PageFallback,
// sadece ~60vh) DOM'a basıyor — bu tek kare için sayfa çok kısalıyor ve tarayıcı
// eski (uzun sayfadaki) scrollY'yi yeni kısa içeriğe göre aniden aşağı çekip
// kırpıyor. useEffect bu kırpılmış kareyi boyandıktan SONRA çalışıp scrollY'yi
// 0'a çekiyordu — sonuç, kullanıcının "önce fazladan bir scroll görünüp sonra
// kaybolması" olarak algıladığı, göz açıp kapayana kadar süren bir "flash".
// useLayoutEffect boyanmadan ÖNCE, senkron çalıştığı için bu ara kare hiç
// boyanmıyor; kullanıcı geçişin ilk karesinden itibaren doğrudan scrollY=0 görüyor.
export function ScrollToTop() {
    const { pathname } = useLocation()

    useLayoutEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    return null
}
