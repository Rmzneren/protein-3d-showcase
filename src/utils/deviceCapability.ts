// Ağır WebGL/3D içerik (Spline robotu gibi) yüklemeden önce cihazın/bağlantının
// bunu kaldırıp kaldıramayacağını tahmin eder. Hiçbir API desteklenmiyorsa (örn.
// Safari — Network Information API'yi desteklemez) varsayılan olarak "yükle" der;
// amaç zayıf cihazları korumak, güçlü cihazlarda deneyimi kısıtlamak değil.

interface NetworkInformation {
    saveData?: boolean
    effectiveType?: 'slow-2g' | '2g' | '3g' | '4g'
}

interface NavigatorWithHints extends Navigator {
    connection?: NetworkInformation
    deviceMemory?: number
}

export function shouldLoadHeavy3D(): boolean {
    if (typeof navigator === 'undefined') return true
    const nav = navigator as NavigatorWithHints

    // Kullanıcı "Veri Tasarrufu" modunu açıkça istemişse asla ağır içerik yükleme
    if (nav.connection?.saveData) return false

    // Yavaş mobil bağlantılarda (2G/3G) ~1.5MB'lık WebGL sahnesi kullanıcıyı bekletir
    const slowTypes = ['slow-2g', '2g', '3g']
    if (nav.connection?.effectiveType && slowTypes.includes(nav.connection.effectiveType)) return false

    // Chrome/Edge'de bildirilen cihaz belleği düşükse (ör. eski/düşük segment telefon) atla
    if (typeof nav.deviceMemory === 'number' && nav.deviceMemory < 4) return false

    return true
}
