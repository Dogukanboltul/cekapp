/**
 * n11 Entegrasyon Modülü
 * Görevi: n11 API verilerini Dashboard standartlarına dönüştürmek.
 */

// Ortak tipi Trendyol dosyasından alıyoruz ki her yer aynı dili konuşsun
import { MarketplaceSummary } from './Trendyol';

export const getN11Data = async (): Promise<MarketplaceSummary> => {
  try {
    /**
     * İleride buraya n11 SOAP/REST API bağlantısı gelecek.
     * n11'in valör süreleri Trendyol'dan farklı olduğu için 
     * 'pendingBalance' hesaplaması burada özelleşecek.
     */
    
    // MOCK DATA (Dashboard'u canlandırmak için)
    return {
      platform: 'N11',
      confirmedBalance: 112500.25, // n11'deki çekilebilir tutar
      pendingBalance: 32150.00,   // Gelecek ödemeler
      unbilledAmount: 8900.00,
      settlementDate: '2026-04-18', // Ödeme günü
      storeScore: 9.4              // Mağaza başarı puanı
    };
  } catch (error) {
    console.error("n11 veri çekme hatası:", error);
    throw new Error("n11 API bağlantısı sağlanamadı.");
  }
};

/**
 * n11 Özel Risk Metrikleri
 */
export const getN11Metrics = () => {
  return {
    disputeRate: 0.02, // Müşteri uyuşmazlık oranı
    merchantLevel: 'GOLD' // Mağaza seviyesi
  };
};