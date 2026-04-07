import { MarketplaceSummary } from './Trendyol'; // Ortak tipi kullanıyoruz

export const getAmazonData = async (): Promise<MarketplaceSummary> => {
  return {
    platform: 'AMAZON',
    confirmedBalance: 156000.00,
    pendingBalance: 45000.00,
    unbilledAmount: 12000.00,
    settlementDate: '2026-04-15',
    storeScore: 9.9 // Amazon'da yüksek puan altındır
  };
};