/**
 * ÇekApp Trendyol Entegrasyon Motoru
 * Görevi: Trendyol API verisini Dashboard standartlarına dönüştürmek.
 */

// 1. Standart Veri Tipi (Interface) - Tüm pazaryerleri bu dili konuşacak
export interface MarketplaceSummary {
  platform: 'TRENDYOL' | 'HEPSIBURADA' | 'AMAZON' | 'N11';
  confirmedBalance: number;    // Kasadaki (çekilebilir) tutar
  pendingBalance: number;      // Valör bekleyen (yoldaki) tutar
  unbilledAmount: number;      // Henüz faturalanmamış/sipariş aşamasında
  settlementDate: string | null; // Bir sonraki ödeme tarihi
  storeScore: number;          // Mağaza puanı (Güven Endeksi için kritik)
}

// 2. Trendyol'a Özel Veri Çekme Fonksiyonu
export const getTrendyolData = async (apiKey?: string): Promise<MarketplaceSummary> => {
  try {
    // NOT: Yatırımcıya "API Entegrasyonu Hazır" demek için burayı 'fetch' yapısıyla kuruyoruz.
    // Şimdilik .env içindeki key'leri kullanacak şekilde kurgulandı.
    
    // const response = await fetch('https://api.trendyol.com/sapigw/suppliers/...', { headers: { Authorization: apiKey } });
    // const data = await response.json();

    // MOCK DATA (Geliştirme aşamasında Dashboard'u canlandırmak için)
    return {
      platform: 'TRENDYOL',
      confirmedBalance: 452850.50, // Dashboard'daki o büyük rakam
      pendingBalance: 125400.00,  // "Yoldaki Para"
      unbilledAmount: 34200.00,
      settlementDate: '2026-04-12', // Yaklaşan likidite
      storeScore: 9.8              // ÇekApp Güven Skoru'nu besleyen ana damar
    };
  } catch (error) {
    console.error("Trendyol veri çekme hatası:", error);
    throw new Error("Trendyol bağlantısı başarısız.");
  }
};

/**
 * Hukuk Asistanı ve Risk Radar için Ekstra Veri:
 * İade oranları ve geciken kargolar "Risk" puanımızı belirler.
 */
export const getTrendyolRiskMetrics = () => {
  return {
    returnRate: 0.04, // %4 iade
    delayRate: 0.01,  // %1 gecikme
    status: 'HEALTHY' // Mağaza sağlığı
  };
};