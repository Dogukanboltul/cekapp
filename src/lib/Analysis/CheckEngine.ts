/**
 * CheckEngine: ÇekApp'in Karar Mekanizması
 */

export interface CheckAnalysisResult {
  riskScore: number;       // 0-100 arası (0: Güvenli, 100: Tehlikeli)
  recommendation: 'APPROVE' | 'CAUTION' | 'REJECT';
  confidenceLevel: number; // Verinin tutarlılık yüzdesi
}

export const analyzeCheck = (amount: number, dueDate: string, storeScore: number): CheckAnalysisResult => {
  // Basit Karar Algoritması:
  // Mağaza puanı düşükse ve tutar çok yüksekse risk artar.
  const today = new Date();
  const maturityDate = new Date(dueDate);
  const daysToMaturity = Math.ceil((maturityDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

  let score = (amount / 100000) + (daysToMaturity / 30) - (storeScore * 5);
  score = Math.max(0, Math.min(100, score)); // 0-100 arası sınırla

  let recommendation: 'APPROVE' | 'CAUTION' | 'REJECT' = 'APPROVE';
  if (score > 70) recommendation = 'REJECT';
  else if (score > 40) recommendation = 'CAUTION';

  return {
    riskScore: Math.round(score),
    recommendation,
    confidenceLevel: 95 // Şimdilik statik, ilerde AI ile değişecek
  };
};