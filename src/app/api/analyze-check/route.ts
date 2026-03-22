import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // 1. API Key Kontrolü
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: "API Anahtarı (.env.local) bulunamadı!" }, { status: 500 });
    }

    // 2. Gelen Veriyi Al (Yeni page.tsx yapısına uygun: data ve type geliyor)
    const body = await req.json();
    const { type, data } = body; 

    if (!data) {
      return NextResponse.json({ success: false, error: "Analiz edilecek veri (görsel veya metin) eksik!" }, { status: 400 });
    }

    // 3. Dinamik Prompt ve İçerik Hazırlığı
    const isHizli = type === 'hizli';
    
    // Prompt'u moda göre seçiyoruz
    const systemPrompt = isHizli 
      ? "Sen bir ticari istihbarat uzmanısın. Paylaşılan metindeki IBAN, Vergi No (VKN), TCKN veya hesap bilgilerini ayıkla. Bu verilerin formatını ve ticari riskini (0-100) analiz et. Yanıtı SADECE saf JSON ver: { \"banka\": \"Tespit Edilen Kurum\", \"seri\": \"Tespit Edilen No\", \"risk_skoru\": 0, \"mesaj\": \"...\" }"
      : "Sen bir çek/senet analiz uzmanısın. Görseldeki banka adı, seri no ve risk skorunu (0-100) oku. Yanıtı SADECE saf JSON formatında ver, başka metin ekleme: { \"banka\": \"...\", \"seri\": \"...\", \"risk_skoru\": 0, \"mesaj\": \"...\" }";

    // Gemini'ye gidecek parça listesi
    const contentParts: any[] = [{ text: systemPrompt }];

    if (isHizli) {
      // Hızlı analizde data direkt metindir
      contentParts.push({ text: `Analiz edilecek ticari veri: ${data}` });
    } else {
      // Çek/Senet modunda data Base64 görseldir
      contentParts.push({ inline_data: { mime_type: "image/jpeg", data: data } });
    }

    // 4. Gemini API İstek
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    
    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: contentParts }],
        generationConfig: { 
          responseMimeType: "application/json",
          temperature: 0.1 
        }
      })
    });

    // 5. Hata Yönetimi
    if (!geminiRes.ok) {
      const errorData = await geminiRes.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || "Google API Hatası";
      
      if (geminiRes.status === 429) {
        return NextResponse.json({ 
          success: false, 
          error: "Hız sınırına takıldık. Lütfen 30-60 saniye bekleyip tekrar dene." 
        }, { status: 429 });
      }
      
      return NextResponse.json({ success: false, error: errorMessage }, { status: geminiRes.status });
    }

    // 6. Veriyi İşle ve Dön
    const resJson = await geminiRes.json();
    const rawText = resJson.candidates[0].content.parts[0].text;
    const aiResult = JSON.parse(rawText);

    return NextResponse.json({
      success: true,
      banka: aiResult.banka || "Tespit Edilemedi",
      seri: aiResult.seri || "---",
      final_risk: aiResult.risk_skoru || 0,
      risk_seviyesi: aiResult.risk_skoru > 60 ? "Riskli" : "Güvenli",
      detay: aiResult.mesaj || "Analiz başarıyla tamamlandı."
    });

  } catch (err: any) {
    console.error("SERVER ERROR:", err.message);
    return NextResponse.json({ success: false, error: "Sunucu hatası: " + err.message }, { status: 500 });
  }
}