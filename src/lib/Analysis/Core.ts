/**
 * Analysis Core: Sistemin Karar Odası
 * Hünkarım, isimleri DashboardActions ile tam eşledik.
 */

import { analyzeCheck } from './CheckEngine';
import { calculateLiquidityGap } from './LiquidityRadar';
import { getFindeksCreditProfile, calculateHybridScore } from './FindeksBridge';

export const getFinalTrustReport = async (
  checkAmount: number, 
  checkDueDate: string,
  taxNumber: string = "3400000000", 
  totalMarketplaceBalance: number = 500000,
  storeScore: number = 9.5
) => {
  // 1. Banka Profilini Çek
  const creditProfile = await getFindeksCreditProfile(taxNumber);

  // 2. Çek Riskini Hesapla
  const checkRisk = analyzeCheck(checkAmount, checkDueDate, storeScore);

  // 3. Nakit Akışını Kontrol Et
  const liquidity = calculateLiquidityGap(totalMarketplaceBalance, checkAmount);

  // 4. ÇekApp "Mühür" Skoru (Final Trust Score)
  const finalTrustScore = calculateHybridScore(creditProfile.score, storeScore);

  return {
    taxNumber,
    // DashboardActions 'riskScore' beklediği için bu ismi ekledik:
    riskScore: Math.round(finalTrustScore), 
    finalTrustScore: Math.round(finalTrustScore),
    checkRisk,
    liquidity,
    creditStatus: creditProfile.status,
    timestamp: new Date().toISOString()
  };
};