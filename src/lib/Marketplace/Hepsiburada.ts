// /src/lib/Marketplace.ts/Hepsiburada.ts

/**
 * Hepsiburada Entegrasyon Modülü
 * Hata Çözümü: 'export' anahtar kelimesi bu dosyayı bir modül yapar.
 */

// Trendyol dosyasında tanımladığımız ortak tipi buraya da çekiyoruz
import { MarketplaceSummary } from './Trendyol';

export const getHepsiburadaData = async (): Promise<MarketplaceSummary> => {
  try {
    // Gelecekte buraya Hepsiburada Merchant API fetch operasyonu gelecek
    
    // MOCK DATA: Dashboard'u besleyen veriler
    return {
      platform: 'HEPSIBURADA',
      confirmedBalance: 215400.75, // Dashboard'daki HB bakiyesi
      pendingBalance: 68200.00,   // Valör bekleyen
      unbilledAmount: 15300.00,
      settlementDate: '2026-04-10',
      storeScore: 9.6              // HB Mağaza Puanı
    };
  } catch (error) {
    console.error("Hepsiburada veri çekme hatası:", error);
    throw new Error("Hepsiburada bağlantısı sağlanamadı.");
  }
};

/**
 * Risk Analiz Motoru için HB Spesifik Veriler
 */
export const getHepsiburadaMetrics = () => {
  return {
    buyboxRate: 0.85, // Buybox kazanma oranı
    merchantStatus: 'ACTIVE'
  };
};