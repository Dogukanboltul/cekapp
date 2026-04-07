/**
 * FindeksBridge: Geleneksel Bankacılık ve E-Ticaret Veri Köprüsü
 */

export interface CreditProfile {
  score: number;         // Findeks Notu (0-1900)
  status: 'VERY_GOOD' | 'GOOD' | 'RISKY' | 'CRITICAL';
  lastUpdated: string;
}

export const getFindeksCreditProfile = async (taxNumber: string): Promise<CreditProfile> => {
  // NOT: Burası gerçek Findeks API'sine (veya KKB sorgusuna) bağlanacak.
  // Esnafın "TC/Vergi No" ile yaptığı sorgu buraya düşer.
  
  // MOCK DATA (Dashboard testi için)
  const mockScore = 1450; 
  
  let status: CreditProfile['status'] = 'GOOD';
  if (mockScore > 1700) status = 'VERY_GOOD';
  else if (mockScore < 1000) status = 'CRITICAL';
  else if (mockScore < 1300) status = 'RISKY';

  return {
    score: mockScore,
    status,
    lastUpdated: new Date().toISOString()
  };
};

/**
 * Hibrit Skor: Findeks + Mağaza Puanı Karışımı
 * Bankanın görmediği, sadece ÇekApp'in bildiği "Gerçek Ticari Güç"
 */
export const calculateHybridScore = (findeks: number, storeScore: number) => {
  // %60 E-Ticaret Performansı, %40 Banka Geçmişi
  return (storeScore * 10 * 0.6) + ((findeks / 19) * 0.4);
};