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
        about: string
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
    about: {
        hero: { eyebrow: string; title: string; body: string }
        story: { title: string; paragraphs: [string, string] }
        values: [
            { title: string; desc: string },
            { title: string; desc: string },
            { title: string; desc: string },
            { title: string; desc: string },
        ]
        timeline: {
            eyebrow: string
            title: string
            items: [
                { year: string; title: string; desc: string },
                { year: string; title: string; desc: string },
                { year: string; title: string; desc: string },
                { year: string; title: string; desc: string },
            ]
        }
        certifications: {
            title: string
            items: [{ label: string; desc: string }, { label: string; desc: string }, { label: string; desc: string }, { label: string; desc: string }]
        }
        cta: { title: string; body: string; button: string }
    }
    help: {
        hero: { eyebrow: string; title: string; body: string }
        categories: [
            { title: string; items: [{ q: string; a: string }, { q: string; a: string }, { q: string; a: string }] },
            { title: string; items: [{ q: string; a: string }, { q: string; a: string }, { q: string; a: string }] },
            { title: string; items: [{ q: string; a: string }, { q: string; a: string }, { q: string; a: string }] },
            { title: string; items: [{ q: string; a: string }, { q: string; a: string }, { q: string; a: string }] },
        ]
        cta: { text: string; linkText: string }
    }
    footer: {
        brandBlurb: string
        quickLinksTitle: string
        contactTitle: string
        followTitle: string
        helpLinkLabel: string
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
        about: 'Hakkımızda',
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
                { title: 'KARIŞTIR', desc: "Bir ölçek RV3'ü 250ml su ya da süt ile shaker içinde karıştırın." },
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
            imageAlt: 'RV3 ürün şişesi',
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
            title: 'RV3 vs. Standart Whey',
            subtitle: 'Aynı ölçek, çok farklı sonuç.',
            ourLabel: 'RV3',
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
                defaultRole: 'RV3 Kullanıcısı',
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
    about: {
        hero: {
            eyebrow: 'Hikayemiz',
            title: 'Güçten İlhamla Doğduk',
            body: '2011 yılında küçük bir laboratuvarda başladık; tek hedefimiz sporcuların güvenebileceği, gerçekten saf bir whey protein üretmekti. Bugün binlerce sporcunun günlük rutininin bir parçasıyız.',
        },
        story: {
            title: 'Nasıl Başladık?',
            paragraphs: [
                'Kurucumuz, yıllarca amatör vücut geliştirme camiasında koçluk yaptıktan sonra piyasadaki çoğu proteinin etiketinde yazanla içeriğinin örtüşmediğini fark etti. Bağımsız laboratuvar testlerinden geçmemiş, şeffaf olmayan formüllere karşı bir alternatif yaratma fikriyle RV3 doğdu.',
                'Bugün her parti, üretim hattından çıkmadan önce 200’den fazla parametrede bağımsız olarak test ediliyor. Amacımız hâlâ aynı: etikette ne yazıyorsa şişede tam olarak onun olduğundan emin olmak.',
            ],
        },
        values: [
            { title: 'Bilimsel Titizlik', desc: 'Her formül, piyasaya çıkmadan önce bağımsız laboratuvarlarda kapsamlı testlerden geçer.' },
            { title: 'Tam Şeffaflık', desc: 'Etiketimizde yazan her rakam, gerçek test sonuçlarını yansıtır — gizli dolgu maddesi yok.' },
            { title: 'Sürdürülebilir Kaynak', desc: 'Otlatılmış çiftliklerden gelen ham maddeyle çevreye duyarlı bir tedarik zinciri kuruyoruz.' },
            { title: 'Sporcu Odaklılık', desc: 'Her karar, sahadaki gerçek sporcuların ihtiyaçları düşünülerek alınır.' },
        ],
        timeline: {
            eyebrow: 'Yolculuğumuz',
            title: 'Kilometre Taşlarımız',
            items: [
                { year: '2011', title: 'Kuruluş', desc: 'Küçük bir laboratuvarda, tek bir aroma ve büyük bir hedefle yola çıktık.' },
                { year: '2014', title: 'İlk Bağımsız Sertifikasyon', desc: 'Formüllerimiz ilk kez bağımsız bir laboratuvar tarafından doping-free onayı aldı.' },
                { year: '2018', title: 'Tesis Büyümesi', desc: 'Üretimi büyüttük ve tazeliği korumak için oksijensiz paketleme teknolojisine geçtik.' },
                { year: '2026', title: 'Bugün', desc: '50.000’den fazla sporcuya ulaştık; aynı titizlikle üretmeye devam ediyoruz.' },
            ],
        },
        certifications: {
            title: 'Sertifikalarımız',
            items: [
                { label: 'ISO 22000', desc: 'Gıda güvenliği yönetim sistemi sertifikası' },
                { label: 'HACCP', desc: 'Kritik kontrol noktalarında sürekli denetim' },
                { label: 'Informed-Sport', desc: 'Doping maddesi içermediği bağımsız olarak test edildi' },
                { label: 'GMP Uyumlu', desc: 'İyi üretim uygulamaları standartlarına tam uyum' },
            ],
        },
        cta: {
            title: 'Ürünlerimizi Keşfedin',
            body: 'Laboratuvarımızda geliştirdiğimiz formülleri kendiniz deneyimleyin.',
            button: 'Aromaları İncele',
        },
    },
    help: {
        hero: {
            eyebrow: 'Yardım Merkezi',
            title: 'Nasıl Yardımcı Olabiliriz?',
            body: 'Kargo, iade, ödeme ve siparişlerinle ilgili en çok sorulan soruların cevapları burada. Aradığını bulamazsan bize ulaş.',
        },
        categories: [
            {
                title: 'Kargo & Teslimat',
                items: [
                    { q: 'Kargo ücreti ne kadar?', a: '250₺ ve üzeri siparişlerde kargo ücretsizdir; altındaki siparişlerde sabit 29.90₺ kargo ücreti uygulanır.' },
                    { q: 'Siparişim ne zaman elime ulaşır?', a: 'Siparişler 1-3 iş günü içinde kargoya verilir, teslimat şehrinize göre genellikle 2-5 iş günü içinde tamamlanır.' },
                    { q: 'Kargo takibimi nasıl yapabilirim?', a: 'Siparişin kargoya verildiğinde e-posta adresine bir takip numarası gönderilir; bu numarayla kargo firmasının sitesinden anlık takip yapabilirsin.' },
                ],
            },
            {
                title: 'İade & Değişim',
                items: [
                    { q: 'İade koşulları nelerdir?', a: 'Ürünü teslim aldığın tarihten itibaren 14 gün içinde, ambalajı açılmamış ürünlerde koşulsuz iade hakkın vardır.' },
                    { q: 'Açılmış ürünü iade edebilir miyim?', a: 'Gıda güvenliği nedeniyle açılmış/kullanılmış ambalajlarda iade kabul edemiyoruz; üründen memnun kalmadıysan müşteri hizmetleriyle iletişime geç.' },
                    { q: 'Para iadesi ne kadar sürede yapılır?', a: 'İade talebin onaylandıktan sonra tutar, kullandığın ödeme yöntemine 5-7 iş günü içinde yansır.' },
                ],
            },
            {
                title: 'Ödeme',
                items: [
                    { q: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?', a: 'Tüm kredi ve banka kartlarıyla güvenli ödeme alıyoruz; kapıda ödeme seçeneği şu an mevcut değil.' },
                    { q: 'Ödeme bilgilerim güvende mi?', a: 'Kart bilgilerin hiçbir zaman sunucularımızda saklanmaz; ödeme, sektör standardı şifreleme ile korunan bir altyapı üzerinden geçer.' },
                    { q: 'Taksit seçeneği var mı?', a: '150₺ üzeri siparişlerde bankana bağlı olarak 3 aya kadar taksit imkânı sunuyoruz.' },
                ],
            },
            {
                title: 'Sipariş & Hesap',
                items: [
                    { q: 'Siparişimi nasıl iptal ederim?', a: 'Sipariş henüz kargoya verilmediyse müşteri hizmetlerimizle iletişime geçerek ücretsiz iptal edebilirsin.' },
                    { q: 'Teslimat adresimi değiştirebilir miyim?', a: 'Kargoya verilmeden önce adres değişikliği yapılabilir; kargoya verildikten sonra kargo firmasıyla iletişime geçmen gerekir.' },
                    { q: 'Toplu veya kurumsal sipariş verebilir miyim?', a: '10 adet ve üzeri siparişlerde özel fiyatlandırma sunuyoruz — iletişim sayfasından bize ulaşabilirsin.' },
                ],
            },
        ],
        cta: { text: 'Aradığını bulamadın mı?', linkText: 'Bize ulaş' },
    },
    footer: {
        brandBlurb: 'Laboratuvar kalitesinde saf whey protein formülleri. Performansınız için tasarlandı, lezzetiniz için mükemmelleştirildi.',
        quickLinksTitle: 'Hızlı Bağlantılar',
        contactTitle: 'İletişim',
        followTitle: 'Bizi Takip Edin',
        helpLinkLabel: 'Yardım Merkezi',
        socials: [{ label: 'Web sitemiz' }, { label: 'Bizi paylaşın' }, { label: 'Bize mesaj gönderin' }],
        copyright: (year) => `© ${year} RV3. Tüm hakları saklıdır.`,
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
        subtitle: 'RV3 · her zaman çevrimiçi',
        openAriaLabel: 'AI Beslenme Asistanını aç',
        closeAriaLabel: 'AI Beslenme Asistanını kapat',
        welcomeMessage: 'Merhaba! Ben RV3 AI Beslenme Asistanıyım. Aromalar, dozaj veya kullanım zamanlaması hakkında sorabilirsin. 💪',
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
        about: 'About',
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
                { title: 'MIX', desc: 'Mix one scoop of RV3 with 250ml of water or milk in a shaker.' },
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
            imageAlt: 'RV3 product bottle',
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
            title: 'RV3 vs. Standard Whey',
            subtitle: 'Same scoop, very different result.',
            ourLabel: 'RV3',
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
                defaultRole: 'RV3 User',
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
    about: {
        hero: {
            eyebrow: 'Our Story',
            title: 'Born From a Passion for Strength',
            body: "We started in a small lab back in 2011 with one goal: to make a whey protein athletes could actually trust. Today we're part of thousands of athletes' daily routines.",
        },
        story: {
            title: 'How It Started',
            paragraphs: [
                "After years of coaching in the amateur bodybuilding community, our founder noticed that what was on the label rarely matched what was actually in the tub. RV3 was born from the idea of building an alternative to opaque, untested formulas — one that was independently verified from day one.",
                "Today, every batch is independently tested across 200+ parameters before it ever leaves the production line. Our goal hasn't changed: what's on the label is exactly what's in the bottle.",
            ],
        },
        values: [
            { title: 'Scientific Rigor', desc: 'Every formula goes through extensive independent lab testing before it reaches the market.' },
            { title: 'Full Transparency', desc: 'Every number on our label reflects real test results — no hidden fillers.' },
            { title: 'Sustainable Sourcing', desc: 'We build an environmentally conscious supply chain from grass-fed farms.' },
            { title: 'Athlete-First', desc: 'Every decision is made with the needs of real athletes on the ground in mind.' },
        ],
        timeline: {
            eyebrow: 'Our Journey',
            title: 'Milestones',
            items: [
                { year: '2011', title: 'Founded', desc: 'We started in a small lab with one flavor and one big goal.' },
                { year: '2014', title: 'First Independent Certification', desc: 'Our formulas received their first independent doping-free certification.' },
                { year: '2018', title: 'Facility Growth', desc: 'We scaled up production and moved to oxygen-free packaging to preserve freshness.' },
                { year: '2026', title: 'Today', desc: "We've reached 50,000+ athletes — and we're still holding ourselves to the same standard." },
            ],
        },
        certifications: {
            title: 'Our Certifications',
            items: [
                { label: 'ISO 22000', desc: 'Food safety management system certification' },
                { label: 'HACCP', desc: 'Continuous auditing at critical control points' },
                { label: 'Informed-Sport', desc: 'Independently tested to be free of doping substances' },
                { label: 'GMP Compliant', desc: 'Full compliance with good manufacturing practice standards' },
            ],
        },
        cta: {
            title: 'Explore Our Products',
            body: 'Experience the formulas we developed in our own lab for yourself.',
            button: 'Browse Flavors',
        },
    },
    help: {
        hero: {
            eyebrow: 'Help Center',
            title: 'How Can We Help?',
            body: "Answers to the most common questions about shipping, returns, payment, and your orders. Can't find what you're looking for? Reach out to us.",
        },
        categories: [
            {
                title: 'Shipping & Delivery',
                items: [
                    { q: 'How much does shipping cost?', a: 'Shipping is free on orders over 250₺; orders below that have a flat 29.90₺ shipping fee.' },
                    { q: 'When will my order arrive?', a: 'Orders ship within 1-3 business days and typically arrive within 2-5 business days depending on your city.' },
                    { q: 'How can I track my order?', a: "You'll get a tracking number by email once your order ships, which you can use on the carrier's website for live tracking." },
                ],
            },
            {
                title: 'Returns & Exchanges',
                items: [
                    { q: "What's your return policy?", a: 'You have an unconditional right to return unopened products within 14 days of delivery.' },
                    { q: 'Can I return an opened product?', a: "For food safety reasons we can't accept opened/used packaging — if you're not happy with a product, please contact customer support." },
                    { q: 'How long do refunds take?', a: 'Once your return is approved, the amount is credited back to your original payment method within 5-7 business days.' },
                ],
            },
            {
                title: 'Payment',
                items: [
                    { q: 'What payment methods do you accept?', a: 'We accept secure payment via all major credit and debit cards; cash on delivery is not currently available.' },
                    { q: 'Is my payment information secure?', a: 'Your card details are never stored on our servers — payments run through an infrastructure protected with industry-standard encryption.' },
                    { q: 'Do you offer installment options?', a: 'On orders over 150₺, we offer up to 3 months of installments depending on your bank.' },
                ],
            },
            {
                title: 'Orders & Account',
                items: [
                    { q: 'How do I cancel my order?', a: "If your order hasn't shipped yet, contact our customer support and we'll cancel it free of charge." },
                    { q: 'Can I change my shipping address?', a: "The address can be changed before the order ships; once it has shipped, you'll need to contact the carrier." },
                    { q: 'Can I place a bulk or corporate order?', a: 'We offer special pricing for orders of 10+ units — reach out to us via the contact page.' },
                ],
            },
        ],
        cta: { text: "Can't find what you're looking for?", linkText: 'Contact us' },
    },
    footer: {
        brandBlurb: 'Lab-quality pure whey protein formulas. Designed for your performance, perfected for your taste.',
        quickLinksTitle: 'Quick Links',
        contactTitle: 'Contact',
        followTitle: 'Follow Us',
        helpLinkLabel: 'Help Center',
        socials: [{ label: 'Our website' }, { label: 'Share us' }, { label: 'Message us' }],
        copyright: (year) => `© ${year} RV3. All rights reserved.`,
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
        subtitle: 'RV3 · always online',
        openAriaLabel: 'Open AI Nutrition Assistant',
        closeAriaLabel: 'Close AI Nutrition Assistant',
        welcomeMessage: "Hi! I'm the RV3 AI Nutrition Assistant. Ask me about flavors, dosage, or timing. 💪",
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
