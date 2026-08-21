# RV3 — Saf Güç, Saf Lezzet

<p align="right"><a href="./README.en.md">🇬🇧 English version</a></p>

<p align="center">
  <img src="./docs/screenshots/home.jpg" alt="RV3 ana sayfa" width="100%" />
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" />
  <img alt="GSAP" src="https://img.shields.io/badge/GSAP-3-88CE02?logo=greensock&logoColor=white" />
  <img alt="Vercel" src="https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white" />
</p>

**RV3**, whey protein ürünlerini interaktif bir 3D vitrinle tanıtan, tamamen ön yüz odaklı bir tanıtım/showcase sitesidir. React 19, TypeScript ve GSAP animasyonlarıyla hazırlanmış; Claude destekli bir beslenme asistanı, sepet/checkout demosu ve baştan sona Türkçe/İngilizce dil desteği içerir.

🔗 **Canlı demo:** [protein-3d-showcase.vercel.app](https://protein-3d-showcase.vercel.app/)

---

## ✨ Özellikler

- 🧴 **İnteraktif ürün vitrini** — sürükle/bırak, ok tuşları ve fare tekerleğiyle gezilebilen, her aroma için renk temalı bir carousel (`src/pages/HomePage.tsx`)
- 🎨 **GSAP animasyon katmanı** — özel imleç, patlama/parçacık efektleri (`BurstCanvas`), canvas tabanlı parçacık arka planı ve sıvı damla efekti
- 🤖 **AI Beslenme Asistanı** — Anthropic Claude API'siyle çalışan, sağ altta sabit duran sohbet widget'ı; API anahtarı yoksa anahtar kelime tabanlı bir demo yanıt moduna düşer
- 🧠 **3D robot maskotu** — Spline ile oluşturulmuş, düşük performanslı cihaz/yavaş bağlantıda otomatik olarak statik bir ikona düşen lazy-loaded sahne
- 🛒 **Sepet + checkout demosu** — animasyonlu interaktif kredi kartıyla çok adımlı bir checkout akışı (yalnızca görsel demo, gerçek bir ödeme altyapısına bağlı değildir)
- 🌍 **Tam TR/EN dil desteği** — arayüz metinleri, aroma isimleri/rozetleri ve AI asistanı dahil her şey seçilen dile göre değişir
- 📊 **Beslenme bilimi sayfası** — protein ihtiyacı hesaplayıcı, karşılaştırma tablosu, kullanıcı yorumları
- 🏢 **Hakkımızda & Yardım Merkezi** sayfaları — marka hikayesi, sertifikalar, kategorilere ayrılmış SSS akordiyonu
- ⚡ **Performans odaklı** — rota bazlı kod bölme (`lazy` + `Suspense`), WebP'ye sıkıştırılmış ürün görselleri, düşük cihaz/veri tasarrufu modunda ağır 3D içeriğin devre dışı bırakılması

## 🖼️ Ekran görüntüleri

| Ana Sayfa | Hakkımızda |
|---|---|
| ![Ana sayfa](./docs/screenshots/home.jpg) | ![Hakkımızda](./docs/screenshots/about.jpg) |

## 🧱 Teknoloji Yığını

| Katman | Teknoloji |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 8 |
| Routing | react-router-dom 7 |
| Animasyon | GSAP 3 |
| 3D sahne | Spline (`@splinetool/react-spline`) |
| İkonlar | lucide-react |
| AI asistan | `@anthropic-ai/sdk` (Claude), Vercel serverless function |
| Lint | oxlint |
| Deploy | Vercel (statik SPA + `api/` serverless fonksiyonu) |

## 🚀 Kurulum

```bash
git clone https://github.com/Rmzneren/protein-3d-showcase.git
cd protein-3d-showcase
npm install
npm run dev
```

Uygulama varsayılan olarak `http://localhost:5173` adresinde açılır.

> ⚠️ Sadece `vite`'ın kendi dev sunucusuyla (`npm run dev`) çalıştırıldığında `/api/chat` uç noktası (AI asistan) 404 döner — bu uç nokta bir Vercel serverless fonksiyonudur. Gerçek davranışını test etmek için `vercel dev` kullanın ya da projeyi Vercel'e deploy edin. Anahtar tanımlı olmasa da widget, kural tabanlı demo yanıtlarla çalışmaya devam eder.

### Ortam değişkenleri

`.env.example` dosyasını `.env` olarak kopyalayın:

```bash
cp .env.example .env
```

| Değişken | Zorunlu mu? | Açıklama |
|---|---|---|
| `ANTHROPIC_API_KEY` | Hayır | AI asistanının gerçek Claude yanıtları vermesi için. Boş bırakılırsa `/api/chat` anahtar kelime eşleşmeli bir mock yanıta düşer, widget yine çalışır. |

## 📜 Komutlar

| Komut | Açıklama |
|---|---|
| `npm run dev` | Vite dev sunucusunu HMR ile başlatır |
| `npm run build` | Tip kontrolü (`tsc -b`) + production build |
| `npm run lint` | oxlint ile lint kontrolü |
| `npm run preview` | Production build'i yerelde sunar |
| `npm run typecheck:api` | `api/` klasörünü (Vercel serverless fonksiyonları) ayrıca tip kontrolünden geçirir — `build` bunu çalıştırmaz |
| `npm run optimize:images` | `public/images/*.png` dosyalarını sharp ile `.webp`'e sıkıştırır |

Bu projede bir test framework'ü/test suite'i bulunmuyor.

## 📁 Proje Yapısı

```
src/
├── App.tsx                # Sticky navbar, rota tanımları, global overlay bileşenleri
├── main.tsx                # BrowserRouter içinde <App> mount edilir
├── context/                 # CartContext, LanguageContext
├── hooks/                    # useCart, useLanguage
├── i18n/                      # translations.ts — tüm TR/EN metinler
├── data/flavors.ts              # Aroma verisi — tek doğruluk kaynağı (server tarafında da kullanılır)
├── pages/                         # HomePage, AboutPage, NutritionPage, ContactPage, HelpPage
├── components/                     # AiAssistant, CartDrawer, CheckoutModal, AnimatedCreditCard,
│                                     ParticleBackground, BurstCanvas, LiquidDripCanvas, SplineRobot, Footer
└── utils/                            # deviceCapability.ts, scrollReveal.ts
api/
└── chat.ts                 # Vercel serverless function — Claude çağrısı + mock fallback
public/images/               # WebP'ye sıkıştırılmış ürün görselleri
scripts/optimize-images.mjs   # PNG → WebP dönüştürme scripti
```

## ⚠️ Önemli Not

Bu proje **tamamen bir tanıtım/portföy showcase'idir**. Sepet, checkout ve animasyonlu kredi kartı akışı görsel bir demodur — hiçbir gerçek ödeme altyapısına bağlı değildir, girilen bilgiler hiçbir yere gönderilmez ya da saklanmaz. Gerçek bir ödeme akışına ihtiyacınız varsa lisanslı bir ödeme sağlayıcısı (iyzico, Stripe vb.) entegre edilmelidir.

## 📄 Lisans

Bu depo `private: true` bir kişisel/portföy projesidir; açık bir lisans belirtilmemiştir, tüm hakları saklıdır.
