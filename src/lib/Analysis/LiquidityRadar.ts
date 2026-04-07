/**
 * LiquidityRadar: Yaklaşan Ödemeler ve Alacaklar Çarpışma Analizi
 */

export const calculateLiquidityGap = (totalMarketplaceBalance: number, upcomingChecksTotal: number) => {
  const gap = totalMarketplaceBalance - upcomingChecksTotal;
  
  return {
    gap,
    isSafe: gap > 0,
    warningMessage: gap < 0 
      ? `Hünkarım, önümüzdeki 10 gün içinde ${Math.abs(gap).toLocaleString('tr-TR')} TL açık görünüyor!`
      : "Nakit akışı sağlıklı, tüm ödemeler karşılanıyor."
  };
};