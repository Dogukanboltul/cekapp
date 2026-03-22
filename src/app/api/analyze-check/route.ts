import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const serperKey = process.env.SERPER_API_KEY;
    if (!serperKey) {
      return NextResponse.json({ success: false, error: "SERPER API key eksik." }, { status: 500 });
    }

    const { data: firmaAdi } = await req.json();
    if (!firmaAdi || firmaAdi.length < 3) {
      return NextResponse.json({ success: false, error: "Firma adı geçersiz." }, { status: 400 });
    }

    // SERPER GOOGLE ARAMA
    const query = `"${firmaAdi}" konkordato OR iflas OR mühlet OR haciz site:ilan.gov.tr`;
    const serperRes = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: { "X-API-KEY": serperKey, "Content-Type": "application/json" },
      body: JSON.stringify({ q: query, gl: "tr", hl: "tr" })
    });

    if (!serperRes.ok) throw new Error("Serper API hatası.");
    const searchData = await serperRes.json();
    const organic = searchData?.organic || [];
    const snippetsText = organic.map((o: any) => o.snippet || o.title || '').join(' ').toLowerCase();

    // BASİT YORUMLAMA
    const dangerWords = ["konkordato", "iflas", "mühlet", "haciz", "protesto", "tasfiye", "mahkemesi"];
    const detected = dangerWords.filter(w => snippetsText.includes(w));
    let riskScore = 0;
    let yorum = "";

    if (detected.length > 0) {
      riskScore = 70 + Math.min(detected.length * 5, 30); // max 100
      yorum = `KRİTİK BULGU: Google sonuçlarında firma hakkında [${detected.join(", ")}] kayıtları saptandı!`;
    } else if (snippetsText.length < 50) {
      riskScore = 20;
      yorum = `Dijital veri sınırlı. Banka teyidi ile işlem önerilir.`;
    } else {
      riskScore = 10;
      yorum = `Resmi ilan ve haberlerde aktif risk kaydı yok.`;
    }

    return NextResponse.json({
      success: true,
      firma: firmaAdi,
      final_risk: riskScore,
      risk_seviyesi: riskScore > 70 ? "Kritik" : riskScore > 40 ? "Orta" : "Güvenli",
      detay: yorum
    });

  } catch (err: any) {
    console.error("SERVER ERROR:", err);
    return NextResponse.json({ success: false, error: "Analiz motoru hata verdi." }, { status: 500 });
  }
}