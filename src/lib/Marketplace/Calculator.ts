/**
 * ÇekApp Finansal Hesaplama Motoru
 */

export const calculateLiquidityPower = (confirmed: number, pending: number): number => {
  // Likidite Gücü Skoru: Hazır para + (Bekleyen para * Güven Katsayısı)
  const confidenceFactor = 0.85; 
  return confirmed + (pending * confidenceFactor);
};

export const calculateCheckRisk = (amount: number, daysToMaturity: number, findeksScore: number) => {
  // Basit Risk Skoru: Vade uzadıkça ve Findeks düştükçe risk artar
  const riskFactor = (amount / findeksScore) * (daysToMaturity / 30);
  return {
    isRisky: riskFactor > 5,
    score: Math.min(100, riskFactor * 10)
  };
};