'use client';

import { createClient } from '../../database/client';

async function fetchTrendyolRealFinance(sellerId: string, apiKey: string, apiSecret: string) {
  try {
    const response = await fetch('/api/proxy/trendyol', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sellerId, apiKey, apiSecret })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Sunucu Hatası" }));
      console.error("🚨 Proxy Hatası:", errorData);
      return { success: false, error: errorData.error };
    }

    const data = await response.json();
    return {
      success: true,
      payable: data.totalPayable || 0,
      upcoming: data.totalUpcoming || 0
    };
  } catch (err: any) {
    console.error("🔥 Fetch Patladı:", err.message);
    return { success: false, error: err.message };
  }
}

export async function connectMarketplace(
  platform: 'trendyol' | 'hepsiburada' | 'n11' | 'amazon',
  creds: { sellerId: string; apiKey: string; apiSecret: string; refCode?: string }
) {
  const supabase = createClient();
  const TEMP_USER_ID = '00000000-0000-0000-0000-000000000000'; 

  try {
    const cleanCreds = {
      sellerId: creds.sellerId.trim(),
      apiKey: creds.apiKey.trim(),
      apiSecret: creds.apiSecret.trim(),
      refCode: creds.refCode?.trim() || ""
    };

    // 1. Kimlik Bilgilerini Kaydet
    await supabase.from('platform_credentials').upsert({
      user_id: TEMP_USER_ID,
      platform: platform.toLowerCase(),
      creds: cleanCreds,
      is_active: true
    }, { onConflict: 'user_id, platform' });

    let realPayable = 0;
    let realUpcoming = 0;

    // 2. Canlı Veriyi Çek
    if (platform === 'trendyol') {
      const finance = await fetchTrendyolRealFinance(cleanCreds.sellerId, cleanCreds.apiKey, cleanCreds.apiSecret);
      if (finance.success) {
        realPayable = finance.payable;
        realUpcoming = finance.upcoming;
      }
    }

    // 3. Veritabanını Güncelle (O "0" bakiye burada canlanıyor)
    const { error: balanceError } = await supabase.from('platform_balances').upsert({
      user_id: TEMP_USER_ID,
      platform: platform.toLowerCase(),
      kesinlesmis_bakiye: realPayable,
      valorlu_bakiye: realUpcoming,
      trend: 'up'
    }, { onConflict: 'user_id, platform' });

    if (balanceError) throw balanceError;
    return { success: true };

  } catch (err: any) {
    console.error("❌ İşlem Hatası:", err.message);
    return { success: false, error: err.message };
  }
}