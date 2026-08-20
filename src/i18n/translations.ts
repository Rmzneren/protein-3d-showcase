import type { Lang } from './types'

// Tüm sitedeki statik metinler burada toplanır. `Dictionary` arayüzü `tr` ve `en`
// nesnelerinin AYNI şekle sahip olmasını derleme zamanında zorunlu kılar — bir dilde
// unutulan bir alan burada tsc hatası olarak yakalanır.
//
// Dinamik metinler (bir sayı veya ürün adı içeren) fonksiyon olarak tanımlanır,
// çünkü kelime sırası dile göre değişebilir (örn. "X adedini azalt" vs
// "Decrease quantity of X") — basit string birleştirme bunu doğru veremez.
export interface Dictionary {
    meta: { locale: string }
    nav: {
        home: string
        nutrition: string
        contact: string
        cartAriaWithItems: (count: number) => string
        cartAriaEmpty: string
        switchLanguageAria: string
    }
    pageLoading: { ariaLabel: string }
    home: {
        carouselAriaLabel: string
        liveRegionSelected: (title: string, idx: number, total: number) => string
        prevAriaLabel: string
        nextAriaLabel: string
        cardAriaSelected: (title: string) => string
        cardAriaSelect: (title: string) => string
        dotAriaLabel: (title: string) => string
        hint: string
        detailsButton: string
        trustStats: [string, string, string, string]
        howItWorks: {
            eyebrow: string
            title: string
            steps: [{ title: string; desc: string }, { title: string; desc: string }, { title: string; desc: string }]
        }
        modal: {
            closeAriaLabel: string
            title: string
            ingredientLabels: { protein: string; bcaa: string; sugar: string; kcal: string }
            ingredientDescs: { protein: string; bcaa: string; sugar: string; kcal: string }
            addToCart: string
        }
    }
    nutrition: {
        hero: { eyebrow: string; titlePrefix: string; titleHighlight: string; body: string; imageAlt: string }
        features: [
            { title: string; desc: string },
            { title: string; desc: string },
            { title: string; desc: string },
            { title: string; desc: string },
        ]
        calculator: {
            eyebrow: string
            title: string
            weightLabelPrefix: string
            goalLabel: string
            goals: [{ label: string; desc: string }, { label: string; desc: string }, { label: string; desc: string }]
            resultLabel: string
            recommendedPrefix: string
            perScoop: string
            addToCart: string
            disclaimer: string
        }
        process: {
            eyebrow: string
            title: string
            steps: [
                { title: string; desc: string },
                { title: string; desc: string },
                { title: string; desc: string },
                { title: string; desc: string },
            ]
        }
        comparison: {
            title: string
            subtitle: string
            ourLabel: string
            theirLabel: string
            rows: [{ label: string }, { label: string }, { label: string }]
        }
        testimonials: {
            eyebrow: string
            title: string
            items: [{ name: string; role: string; text: string }, { name: string; role: string; text: string }, { name: string; role: string; text: string }]
            photoAlt: (name: string) => string
            form: {
                title: string
                nameLabel: string
                namePlaceholder: string
                roleLabel: string
                roleNamePlaceholder: string
                ratingLabel: string
                starAriaLabel: (n: number) => string
                textLabel: string
                textPlaceholder: string
                photoAddLabel: string
                photoChangeLabel: string
                photoPreviewAlt: string
                photoRemoveAriaLabel: string
                submit: string
                defaultRole: string
            }
        }
        faq: { title: string; items: [{ q: string; a: string }, { q: string; a: string }, { q: string; a: string }, { q: string; a: string }] }
    }
    contact: {
        hero: { eyebrow: string; title: string; body: string }
        methods: [{ label: string; value: string }, { label: string; value: string }, { label: string; value: string }]
        workingHours: { title: string; rows: [{ day: string; hours: string }, { day: string; hours: string }, { day: string; hours: string }] }
        socials: { title: string; items: [{ label: string }, { label: string }, { label: string }] }
        miniFaq: { title: string; items: [{ q: string; a: string }, { q: string; a: string }] }
        form: {
            title: string
            nameLabel: string
            namePlaceholder: string
            emailLabel: string
            emailPlaceholder: string
            messageLabel: string
            messagePlaceholder: string
            submit: string
        }
    }
    footer: {
        brandBlurb: string
        quickLinksTitle: string
        contactTitle: string
        followTitle: string
        socials: [{ label: string }, { label: string }, { label: string }]
        copyright: (year: number) => string
        tagline: string
    }
    cart: {
        title: string
        closeAriaLabel: string
        emptyLine1: string
        emptyLine2: string
        decreaseAria: (title: string) => string
        increaseAria: (title: string) => string
        removeAria: (title: string) => string
        totalLabel: string
        checkoutButton: string
        disclaimer: string
        liveRegion: (count: number, total: number) => string
    }
    checkout: {
        stepShippingLabel: string
        stepPaymentLabel: string
        liveShipping: string
        livePayment: string
        liveSuccess: (orderNumber: string) => string
        closeAriaLabel: string
        shipping: {
            title: string
            summary: (count: number, total: number) => string
            nameLabel: string
            namePlaceholder: string
            addressLabel: string
            addressPlaceholder: string
            cityLabel: string
            cityPlaceholder: string
            zipLabel: string
            zipPlaceholder: string
            emailLabel: string
            emailPlaceholder: string
            continueButton: string
        }
        payment: {
            backButton: string
            title: string
            cardNumberLabel: string
            cardNameLabel: string
            cardNamePlaceholder: string
            expiryLabel: string
            cvvLabel: string
            payButton: (total: number) => string
            processing: string
            disclaimer: string
        }
        success: {
            title: string
            orderNumberLabel: string
            disclaimer: string
            closeButton: string
        }
    }
    aiAssistant: {
        title: string
        subtitle: string
        openAriaLabel: string
        closeAriaLabel: string
        welcomeMessage: string
        suggestions: [string, string, string]
        inputLabel: string
        inputPlaceholder: string
        sendAriaLabel: string
        typingAnnouncement: string
        errorMessage: string
        genericHttpError: (status: number) => string
    }
}

const tr: Dictionary = {
    meta: { locale: 'tr-TR' },
    nav: {
        home: 'Ana Sayfa',
        nutrition: 'Beslenme Bilimi',
        contact: 'İletişim',
        cartAriaWithItems: (count) => `Sepeti aç, içinde ${count} ürün var`,
        cartAriaEmpty: 'Sepeti aç',
        switchLanguageAria: 'İngilizceye geç',
    },
    pageLoading: { ariaLabel: 'Sayfa yükleniyor' },
    home: {
        carouselAriaLabel: 'Aroma seçim vitrini',
        liveRegionSelected: (title, idx, total) => `${title} seçili, ${idx} / ${total}`,
        prevAriaLabel: 'Önceki aroma',
        nextAriaLabel: 'Sonraki aroma',
        cardAriaSelected: (title) => `${title} — seçili aroma, detayları görmek için Enter'a basın`,
        cardAriaSelect: (title) => `${title} aromasını seç`,
        dotAriaLabel: (title) => `${title} aromasına git`,
        hint: 'Sürükle, tıkla ya da ok tuşlarıyla aromalar arasında gez',
        detailsButton: 'DETAYLARI İNCELE',
        trustStats: ['Mutlu Sporcu', 'Sektör Tecrübesi', 'Doğal İçerik', 'Müşteri Puanı'],
        howItWorks: {
            eyebrow: 'Basit & Etkili',
            title: 'Nasıl Kullanılır?',
            steps: [
                { title: 'KARIŞTIR', desc: "Bir ölçek PROTEIN3D'yi 250ml su ya da süt ile shaker içinde karıştırın." },
                { title: 'DOĞRU ZAMANDA TÜKET', desc: 'Maksimum verim için antrenman öncesi veya sonrası 30 dakika içinde için.' },
                { title: 'SONUÇLARI GÖR', desc: 'Düzenli kullanımla kas gelişiminizi ve toparlanmanızı hızlandırın.' },
            ],
        },
        modal: {
            closeAriaLabel: 'Detayları kapat',
            title: 'Formülün Sırrı',
            ingredientLabels: { protein: 'PROTEİN', bcaa: 'BCAA', sugar: 'ŞEKER', kcal: 'KCAL' },
            ingredientDescs: {
                protein: 'Kas gelişimini destekleyen yüksek kaliteli protein kaynağı.',
                bcaa: 'Toparlanmayı hızlandıran dallı zincirli amino asitler.',
                sugar: 'Kan şekerini dengede tutan sade ve şeffaf formül.',
                kcal: 'Dengeli enerji için optimize edilmiş kalori değeri.',
            },
            addToCart: 'SEPETE EKLE',
        },
    },
    nutrition: {
        hero: {
            eyebrow: 'Laboratuvar Onaylı Formül',
            titlePrefix: 'Beslenme Bilimi: ',
            titleHighlight: 'Saf Güç',
            body: 'Laboratuvar ortamında geliştirilen formülümüz, vücudunuzun ihtiyaç duyduğu her şeyi en saf haliyle sunar — kaynağından şişeye kadar her adım test edilir.',
            imageAlt: 'PROTEIN3D ürün şişesi',
        },
        features: [
            { title: 'Hızlı Emilim', desc: 'Mikro-filtreli teknoloji ile kaslarınıza saniyeler içinde ulaşır.' },
            { title: 'Güvenli İçerik', desc: 'Doping maddesi içermez, tamamen doğal kaynaklı formül.' },
            { title: 'Kalp Dostu', desc: 'Düşük kolesterol, yüksek kaliteli amino asit profili.' },
            { title: 'Hidrasyon Desteği', desc: 'Elektrolit dengesiyle antrenman performansınızı zirveye taşır.' },
        ],
        calculator: {
            eyebrow: 'Size Özel',
            title: 'Protein İhtiyacınızı Hesaplayın',
            weightLabelPrefix: 'Kilonuz:',
            goalLabel: 'Hedefiniz',
            goals: [
                { label: 'Koruma / Genel Sağlık', desc: 'Mevcut kas kütlenizi korumak ve genel sağlığınızı desteklemek için.' },
                { label: 'Kas Kütlesi Kazanımı', desc: 'Antrenmanla birlikte kas gelişimini hızlandırmak için.' },
                { label: 'Yağ Yakımı (Kesim)', desc: 'Kalori açığındayken kas kütlesini korumak, daha yüksek protein alımı gerektirir.' },
            ],
            resultLabel: 'Günlük Protein İhtiyacınız',
            recommendedPrefix: 'Önerilen aroma:',
            perScoop: '/ ölçek',
            addToCart: 'Sepete Ekle',
            disclaimer: 'Bu hesaplama genel bir tahmindir; kişisel ihtiyaçlarınız için bir diyetisyene danışın.',
        },
        process: {
            eyebrow: 'Kaynağından Şişeye',
            title: 'Üretim Sürecimiz',
            steps: [
                { title: 'Kaynak Seçimi', desc: 'Otlatılmış inek sütünden elde edilen, sertifikalı çiftliklerden gelen ham whey ile başlıyoruz.' },
                { title: 'Mikro-Filtrasyon', desc: 'Düşük ısıda çapraz akış filtrasyonuyla besin değeri korunur, laktoz oranı en aza indirilir.' },
                { title: 'Laboratuvar Testi', desc: 'Her parti, ağır metal ve doping taraması dahil 200’den fazla parametrede bağımsız test edilir.' },
                { title: 'Oksijensiz Paketleme', desc: 'Tazeliği korumak için azot ortamında, ışık geçirmez ambalajlarla mühürlenir.' },
            ],
        },
        comparison: {
            title: 'PROTEIN3D vs. Standart Whey',
            subtitle: 'Aynı ölçek, çok farklı sonuç.',
            ourLabel: 'PROTEIN3D',
            theirLabel: 'Standart Whey',
            rows: [{ label: 'Protein (ölçek başına)' }, { label: 'BCAA' }, { label: 'Şeker' }],
        },
        testimonials: {
            eyebrow: 'Gerçek Sonuçlar',
            title: 'Sporcularımız Ne Diyor?',
            items: [
                { name: 'Emre K.', role: 'Amatör Vücut Geliştirme', text: 'Çikolatalı aroma gerçekten sudan farksız karışıyor, şişkinlik yapmıyor. 3 aydır düzenli kullanıyorum, fark net.' },
                { name: 'Selin A.', role: 'Pilates Eğitmeni', text: 'Muzlu aromayı özellikle antrenman öncesi tercih ediyorum, mide de hiç rahatsızlık yapmıyor.' },
                { name: 'Barış T.', role: 'Amatör Triatlet', text: 'Berry Fusion toparlanma sürecimi belirgin şekilde hızlandırdı, düşük şeker oranı da artı puan.' },
            ],
            photoAlt: (name) => `${name} tarafından yoruma eklenen fotoğraf`,
            form: {
                title: 'Deneyimini Paylaş',
                nameLabel: 'İsminiz',
                namePlaceholder: 'İsminiz',
                roleLabel: 'Rolünüz (opsiyonel)',
                roleNamePlaceholder: 'Rolünüz (opsiyonel)',
                ratingLabel: 'Puanınız',
                starAriaLabel: (n) => `${n} yıldız`,
                textLabel: 'Yorumunuz',
                textPlaceholder: 'Deneyiminizi anlatın…',
                photoAddLabel: 'Fotoğraf Ekle (opsiyonel)',
                photoChangeLabel: 'Fotoğrafı Değiştir',
                photoPreviewAlt: 'Eklediğiniz fotoğrafın önizlemesi',
                photoRemoveAriaLabel: 'Fotoğrafı kaldır',
                submit: 'Yorumu Paylaş',
                defaultRole: 'PROTEIN3D Kullanıcısı',
            },
        },
        faq: {
            title: 'Sıkça Sorulan Sorular',
            items: [
                { q: 'Proteini günün hangi saatinde tüketmeliyim?', a: 'En yüksek verim için antrenman sonrası 30 dakika içinde tüketilmesi önerilir. Kas onarımını desteklemek amacıyla gece yatmadan önce de tüketebilirsiniz.' },
                { q: 'Laktoz intoleransım var, kullanabilir miyim?', a: 'Formülümüz mikro-filtrasyon teknolojisiyle üretildiği için laktoz oranı son derece düşüktür. Yine de hassasiyeti yüksek kullanıcıların doktoruna danışması önerilir.' },
                { q: 'Günde kaç ölçek tüketmeliyim?', a: 'Vücut ağırlığı ve aktivite seviyesine göre değişmekle birlikte, ortalama olarak günde 1-2 ölçek (25-50g) tüketim yeterlidir.' },
                { q: 'Ürün doping listesinde yasaklı madde içeriyor mu?', a: 'Hayır. Tüm formüllerimiz bağımsız laboratuvarlarca test edilir ve herhangi bir doping maddesi içermez.' },
            ],
        },
    },
    contact: {
        hero: {
            eyebrow: 'Bize Ulaşın',
            title: 'İletişime Geçin',
            body: 'Sorularınız mı var veya iş birliği mi yapmak istiyorsunuz? Size yardımcı olmaktan mutluluk duyarız.',
        },
        methods: [
            { label: 'E-posta', value: 'hello@brand.com' },
            { label: 'Telefon', value: '+90 555 000 00 00' },
            { label: 'Adres', value: 'Tekirdağ, Türkiye' },
        ],
        workingHours: {
            title: 'Çalışma Saatleri',
            rows: [
                { day: 'Pazartesi – Cuma', hours: '09:00 – 18:00' },
                { day: 'Cumartesi', hours: '10:00 – 16:00' },
                { day: 'Pazar', hours: 'Kapalı' },
            ],
        },
        socials: {
            title: 'Bizi Sosyal Medyada Takip Edin',
            items: [{ label: 'Web sitemiz' }, { label: 'Bizi paylaşın' }, { label: 'Bize mesaj gönderin' }],
        },
        miniFaq: {
            title: 'Hızlı Sorular',
            items: [
                { q: 'Ne kadar sürede yanıt alırım?', a: 'Mesajlarınıza genellikle 24 saat içinde dönüş yapıyoruz.' },
                { q: 'Toplu sipariş için indirim var mı?', a: 'Evet, 10+ adet siparişlerde özel fiyatlandırma sunuyoruz — bize yazın.' },
            ],
        },
        form: {
            title: 'Bize Mesaj Gönderin',
            nameLabel: 'Adınız',
            namePlaceholder: 'Adınız',
            emailLabel: 'E-posta',
            emailPlaceholder: 'E-posta',
            messageLabel: 'Mesajınız',
            messagePlaceholder: 'Mesajınız',
            submit: 'Gönder',
        },
    },
    footer: {
        brandBlurb: 'Laboratuvar kalitesinde saf whey protein formülleri. Performansınız için tasarlandı, lezzetiniz için mükemmelleştirildi.',
        quickLinksTitle: 'Hızlı Bağlantılar',
        contactTitle: 'İletişim',
        followTitle: 'Bizi Takip Edin',
        socials: [{ label: 'Web sitemiz' }, { label: 'Bizi paylaşın' }, { label: 'Bize mesaj gönderin' }],
        copyright: (year) => `© ${year} PROTEIN3D. Tüm hakları saklıdır.`,
        tagline: 'Kas gelişiminiz için saf güç, saf lezzet.',
    },
    cart: {
        title: 'Sepetim',
        closeAriaLabel: 'Sepeti kapat',
        emptyLine1: 'Sepetin şu an boş.',
        emptyLine2: 'Bir aroma seçip "Sepete Ekle" ile başla.',
        decreaseAria: (title) => `${title} adedini azalt`,
        increaseAria: (title) => `${title} adedini artır`,
        removeAria: (title) => `${title} ürününü sepetten çıkar`,
        totalLabel: 'Toplam',
        checkoutButton: 'Ödemeye Geç',
        disclaimer: 'Bu bir portföy demosudur — gerçek bir ödeme alınmaz.',
        liveRegion: (count, total) => `Sepette ${count} farklı ürün, toplam ${total} lira`,
    },
    checkout: {
        stepShippingLabel: 'Adım 1: Teslimat',
        stepPaymentLabel: 'Adım 2: Ödeme',
        liveShipping: 'Teslimat bilgileri adımı',
        livePayment: 'Ödeme bilgileri adımı',
        liveSuccess: (orderNumber) => `Sipariş tamamlandı, sipariş numarası ${orderNumber}`,
        closeAriaLabel: 'Kapat',
        shipping: {
            title: 'Teslimat Bilgileri',
            summary: (count, total) => `Toplam ${count} ürün · ${total}₺`,
            nameLabel: 'Ad Soyad',
            namePlaceholder: 'Ayşe Yılmaz',
            addressLabel: 'Adres',
            addressPlaceholder: 'Mahalle, cadde, no',
            cityLabel: 'Şehir',
            cityPlaceholder: 'İstanbul',
            zipLabel: 'Posta Kodu',
            zipPlaceholder: '34000',
            emailLabel: 'E-posta',
            emailPlaceholder: 'ornek@mail.com',
            continueButton: 'Ödemeye Devam Et',
        },
        payment: {
            backButton: 'Teslimat bilgilerine dön',
            title: 'Ödeme Bilgileri',
            cardNumberLabel: 'Kart Numarası',
            cardNameLabel: 'Kart Üzerindeki İsim',
            cardNamePlaceholder: 'Ayşe Yılmaz',
            expiryLabel: 'Son Kullanma (AA/YY)',
            cvvLabel: 'CVV',
            payButton: (total) => `${total}₺ Öde`,
            processing: 'İşleniyor…',
            disclaimer: 'Bu bir portföy demosudur — kart bilgilerin hiçbir yere gönderilmez, gerçek bir işlem gerçekleşmez.',
        },
        success: {
            title: 'Siparişin Alındı!',
            orderNumberLabel: 'Sipariş numaran:',
            disclaimer: 'Bu bir portföy demosudur — gerçek bir sipariş oluşturulmadı, hiçbir ödeme alınmadı.',
            closeButton: 'Kapat',
        },
    },
    aiAssistant: {
        title: 'AI Beslenme Asistanı',
        subtitle: 'PROTEIN3D · her zaman çevrimiçi',
        openAriaLabel: 'AI Beslenme Asistanını aç',
        closeAriaLabel: 'AI Beslenme Asistanını kapat',
        welcomeMessage: 'Merhaba! Ben PROTEIN3D AI Beslenme Asistanıyım. Aromalar, dozaj veya kullanım zamanlaması hakkında sorabilirsin. 💪',
        suggestions: ['Hangi aroma bana uygun?', 'Ne zaman içmeliyim?', 'Laktoz intoleransım var, olur mu?'],
        inputLabel: 'Mesajınız',
        inputPlaceholder: 'Bir soru sor…',
        sendAriaLabel: 'Gönder',
        typingAnnouncement: 'Asistan yazıyor…',
        errorMessage: 'Şu an bağlanamıyorum. Lütfen birazdan tekrar dene.',
        genericHttpError: (status) => `İstek başarısız oldu (${status})`,
    },
}

const en: Dictionary = {
    meta: { locale: 'en-US' },
    nav: {
        home: 'Home',
        nutrition: 'Nutrition Science',
        contact: 'Contact',
        cartAriaWithItems: (count) => `Open cart, ${count} items inside`,
        cartAriaEmpty: 'Open cart',
        switchLanguageAria: 'Türkçeye geç',
    },
    pageLoading: { ariaLabel: 'Loading page' },
    home: {
        carouselAriaLabel: 'Flavor selection showcase',
        liveRegionSelected: (title, idx, total) => `${title} selected, ${idx} / ${total}`,
        prevAriaLabel: 'Previous flavor',
        nextAriaLabel: 'Next flavor',
        cardAriaSelected: (title) => `${title} — selected flavor, press Enter to view details`,
        cardAriaSelect: (title) => `Select ${title} flavor`,
        dotAriaLabel: (title) => `Go to ${title} flavor`,
        hint: 'Drag, click, or use the arrow keys to browse flavors',
        detailsButton: 'VIEW DETAILS',
        trustStats: ['Happy Athletes', 'Years of Experience', 'Natural Ingredients', 'Customer Rating'],
        howItWorks: {
            eyebrow: 'Simple & Effective',
            title: 'How to Use',
            steps: [
                { title: 'MIX', desc: 'Mix one scoop of PROTEIN3D with 250ml of water or milk in a shaker.' },
                { title: 'DRINK AT THE RIGHT TIME', desc: 'For maximum effect, drink within 30 minutes before or after your workout.' },
                { title: 'SEE THE RESULTS', desc: 'Speed up your muscle growth and recovery with regular use.' },
            ],
        },
        modal: {
            closeAriaLabel: 'Close details',
            title: 'The Secret of the Formula',
            ingredientLabels: { protein: 'PROTEIN', bcaa: 'BCAA', sugar: 'SUGAR', kcal: 'KCAL' },
            ingredientDescs: {
                protein: 'A high-quality protein source that supports muscle growth.',
                bcaa: 'Branched-chain amino acids that speed up recovery.',
                sugar: 'A clean, transparent formula that keeps blood sugar stable.',
                kcal: 'A calorie value optimized for balanced energy.',
            },
            addToCart: 'ADD TO CART',
        },
    },
    nutrition: {
        hero: {
            eyebrow: 'Lab-Certified Formula',
            titlePrefix: 'Nutrition Science: ',
            titleHighlight: 'Pure Power',
            body: 'Developed in a laboratory setting, our formula delivers everything your body needs in its purest form — every step from source to bottle is tested.',
            imageAlt: 'PROTEIN3D product bottle',
        },
        features: [
            { title: 'Fast Absorption', desc: 'Micro-filtered technology reaches your muscles within seconds.' },
            { title: 'Safe Ingredients', desc: 'No doping substances — a completely naturally sourced formula.' },
            { title: 'Heart Friendly', desc: 'Low cholesterol, high-quality amino acid profile.' },
            { title: 'Hydration Support', desc: 'Electrolyte balance takes your workout performance to the top.' },
        ],
        calculator: {
            eyebrow: 'Just For You',
            title: 'Calculate Your Protein Needs',
            weightLabelPrefix: 'Your weight:',
            goalLabel: 'Your Goal',
            goals: [
                { label: 'Maintenance / General Health', desc: 'To preserve your current muscle mass and support overall health.' },
                { label: 'Muscle Mass Gain', desc: 'To accelerate muscle growth alongside training.' },
                { label: 'Fat Loss (Cutting)', desc: 'A calorie deficit calls for higher protein intake to preserve muscle mass.' },
            ],
            resultLabel: 'Your Daily Protein Need',
            recommendedPrefix: 'Recommended flavor:',
            perScoop: '/ scoop',
            addToCart: 'Add to Cart',
            disclaimer: 'This calculation is a general estimate — consult a dietitian for your personal needs.',
        },
        process: {
            eyebrow: 'From Source to Bottle',
            title: 'Our Production Process',
            steps: [
                { title: 'Sourcing', desc: 'We start with raw whey from certified farms, sourced from grass-fed cows.' },
                { title: 'Micro-Filtration', desc: 'Low-temperature cross-flow filtration preserves nutritional value and minimizes lactose.' },
                { title: 'Lab Testing', desc: 'Every batch is independently tested across 200+ parameters, including heavy metals and doping screening.' },
                { title: 'Oxygen-Free Packaging', desc: 'Sealed in light-blocking packaging under nitrogen to preserve freshness.' },
            ],
        },
        comparison: {
            title: 'PROTEIN3D vs. Standard Whey',
            subtitle: 'Same scoop, very different result.',
            ourLabel: 'PROTEIN3D',
            theirLabel: 'Standard Whey',
            rows: [{ label: 'Protein (per scoop)' }, { label: 'BCAA' }, { label: 'Sugar' }],
        },
        testimonials: {
            eyebrow: 'Real Results',
            title: 'What Our Athletes Say',
            items: [
                { name: 'Emre K.', role: 'Amateur Bodybuilder', text: "The chocolate flavor really mixes as smoothly as water, no bloating at all. I've been using it regularly for 3 months and the difference is clear." },
                { name: 'Selin A.', role: 'Pilates Instructor', text: "I especially like the banana flavor before training — it never upsets my stomach." },
                { name: 'Barış T.', role: 'Amateur Triathlete', text: 'Berry Fusion noticeably sped up my recovery, and the low sugar content is a bonus.' },
            ],
            photoAlt: (name) => `Photo added to the review by ${name}`,
            form: {
                title: 'Share Your Experience',
                nameLabel: 'Your name',
                namePlaceholder: 'Your name',
                roleLabel: 'Your role (optional)',
                roleNamePlaceholder: 'Your role (optional)',
                ratingLabel: 'Your rating',
                starAriaLabel: (n) => `${n} stars`,
                textLabel: 'Your review',
                textPlaceholder: 'Tell us about your experience…',
                photoAddLabel: 'Add photo (optional)',
                photoChangeLabel: 'Change photo',
                photoPreviewAlt: 'Preview of your added photo',
                photoRemoveAriaLabel: 'Remove photo',
                submit: 'Submit Review',
                defaultRole: 'PROTEIN3D User',
            },
        },
        faq: {
            title: 'Frequently Asked Questions',
            items: [
                { q: 'What time of day should I take protein?', a: 'For best results, take it within 30 minutes after training. You can also take it before bed to support muscle repair overnight.' },
                { q: "I'm lactose intolerant — can I use it?", a: 'Our formula is produced with micro-filtration technology, so its lactose content is extremely low. Highly sensitive users should still consult their doctor.' },
                { q: 'How many scoops should I take per day?', a: 'This varies by body weight and activity level, but on average 1–2 scoops (25–50g) per day is sufficient.' },
                { q: 'Does the product contain any banned substances?', a: 'No. All our formulas are independently lab-tested and contain no doping substances.' },
            ],
        },
    },
    contact: {
        hero: {
            eyebrow: 'Get in Touch',
            title: 'Contact Us',
            body: "Have questions or want to collaborate? We'd love to help.",
        },
        methods: [
            { label: 'Email', value: 'hello@brand.com' },
            { label: 'Phone', value: '+90 555 000 00 00' },
            { label: 'Address', value: 'Tekirdağ, Turkey' },
        ],
        workingHours: {
            title: 'Working Hours',
            rows: [
                { day: 'Monday – Friday', hours: '09:00 – 18:00' },
                { day: 'Saturday', hours: '10:00 – 16:00' },
                { day: 'Sunday', hours: 'Closed' },
            ],
        },
        socials: {
            title: 'Follow Us on Social Media',
            items: [{ label: 'Our website' }, { label: 'Share us' }, { label: 'Message us' }],
        },
        miniFaq: {
            title: 'Quick Questions',
            items: [
                { q: 'How soon will I hear back?', a: 'We typically respond to messages within 24 hours.' },
                { q: 'Is there a discount for bulk orders?', a: "Yes, we offer special pricing for orders of 10+ units — just reach out." },
            ],
        },
        form: {
            title: 'Send Us a Message',
            nameLabel: 'Your name',
            namePlaceholder: 'Your name',
            emailLabel: 'Email',
            emailPlaceholder: 'Email',
            messageLabel: 'Your message',
            messagePlaceholder: 'Your message',
            submit: 'Send',
        },
    },
    footer: {
        brandBlurb: 'Lab-quality pure whey protein formulas. Designed for your performance, perfected for your taste.',
        quickLinksTitle: 'Quick Links',
        contactTitle: 'Contact',
        followTitle: 'Follow Us',
        socials: [{ label: 'Our website' }, { label: 'Share us' }, { label: 'Message us' }],
        copyright: (year) => `© ${year} PROTEIN3D. All rights reserved.`,
        tagline: 'Pure power, pure taste, for your muscle growth.',
    },
    cart: {
        title: 'My Cart',
        closeAriaLabel: 'Close cart',
        emptyLine1: 'Your cart is empty right now.',
        emptyLine2: 'Pick a flavor and start with "Add to Cart".',
        decreaseAria: (title) => `Decrease quantity of ${title}`,
        increaseAria: (title) => `Increase quantity of ${title}`,
        removeAria: (title) => `Remove ${title} from cart`,
        totalLabel: 'Total',
        checkoutButton: 'Proceed to Checkout',
        disclaimer: 'This is a portfolio demo — no real payment is taken.',
        liveRegion: (count, total) => `${count} different items in cart, total ${total} TL`,
    },
    checkout: {
        stepShippingLabel: 'Step 1: Shipping',
        stepPaymentLabel: 'Step 2: Payment',
        liveShipping: 'Shipping details step',
        livePayment: 'Payment details step',
        liveSuccess: (orderNumber) => `Order complete, order number ${orderNumber}`,
        closeAriaLabel: 'Close',
        shipping: {
            title: 'Shipping Information',
            summary: (count, total) => `Total ${count} items · ${total}₺`,
            nameLabel: 'Full Name',
            namePlaceholder: 'Jane Doe',
            addressLabel: 'Address',
            addressPlaceholder: 'Street, number, apt',
            cityLabel: 'City',
            cityPlaceholder: 'Istanbul',
            zipLabel: 'ZIP Code',
            zipPlaceholder: '10001',
            emailLabel: 'Email',
            emailPlaceholder: 'name@example.com',
            continueButton: 'Continue to Payment',
        },
        payment: {
            backButton: 'Back to shipping details',
            title: 'Payment Information',
            cardNumberLabel: 'Card Number',
            cardNameLabel: 'Name on Card',
            cardNamePlaceholder: 'Jane Doe',
            expiryLabel: 'Expiry (MM/YY)',
            cvvLabel: 'CVV',
            payButton: (total) => `Pay ${total}₺`,
            processing: 'Processing…',
            disclaimer: "This is a portfolio demo — your card details are never sent anywhere, no real transaction occurs.",
        },
        success: {
            title: 'Order Received!',
            orderNumberLabel: 'Your order number:',
            disclaimer: 'This is a portfolio demo — no real order was created, no payment was taken.',
            closeButton: 'Close',
        },
    },
    aiAssistant: {
        title: 'AI Nutrition Assistant',
        subtitle: 'PROTEIN3D · always online',
        openAriaLabel: 'Open AI Nutrition Assistant',
        closeAriaLabel: 'Close AI Nutrition Assistant',
        welcomeMessage: "Hi! I'm the PROTEIN3D AI Nutrition Assistant. Ask me about flavors, dosage, or timing. 💪",
        suggestions: ['Which flavor suits me?', 'When should I drink it?', "I'm lactose intolerant, is that okay?"],
        inputLabel: 'Your message',
        inputPlaceholder: 'Ask a question…',
        sendAriaLabel: 'Send',
        typingAnnouncement: 'Assistant is typing…',
        errorMessage: "I can't connect right now. Please try again shortly.",
        genericHttpError: (status) => `Request failed (${status})`,
    },
}

export const translations: Record<Lang, Dictionary> = { tr, en }
