import { getTrendyolData } from './Trendyol';
import { getAmazonData } from './Amazon';
import { getHepsiburadaData } from './Hepsiburada';
import { getN11Data } from './n11';

export type MarketplaceData = {
  platform: string;
  confirmedBalance: number;
  pendingBalance: number;
  lastUpdate: string;
};

export const getAllMarketplaceData = async (): Promise<MarketplaceData[]> => {
  // Tüm API'leri paralelde ateşliyoruz (Hız için)
  const results = await Promise.all([
    getTrendyolData(),
    getAmazonData(),
    getHepsiburadaData(),
    getN11Data(),
  ]);

  return results.map(data => ({
    platform: data.platform,
    confirmedBalance: data.confirmedBalance,
    pendingBalance: data.pendingBalance,
    lastUpdate: new Date().toISOString(),
  }));
};