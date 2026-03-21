import { NextRequest, NextResponse } from 'next/server';

/* ---------------- UTIL ---------------- */

function detectMimeType(base64: string, provided?: string | null) {
  if (provided) return provided;
  if (base64.startsWith('/9j/')) return 'image/jpeg';
  if (base64.startsWith('iVBORw0KGgo')) return 'image/png';
  if (base64.startsWith('UklGR')) return 'image/webp';
  return 'image/jpeg';
}

function cleanJson(text: string) {
  return text
    .replace(/^```json/i, '')
    .replace(/^```/, '')
    .replace(/```$/, '')
    .trim();
}

function safeParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/* ---------------- PROMPT ---------------- */

function buildPrompt(hasBackImage: boolean) {
  return `
Sen uzman banka risk analistisisin.
Gönderilen belge görsellerini incele.

KURALLAR:
- Ön yüz ana kaynaktır.
- Arka yüz varsa birlikte değerlendir.
- Sadece net görülen verilere dayan.
- Tahmin yapma.
- Profesyonel ve net yaz.

RİSK SKORU KURALLARI:
- Silinti / oynama varsa +40
- İmza/kaşe eksikse +30
- Arka yüzde yoğun ciro varsa +20
- Okunaksızlık varsa +10
- Temizse 0-20 arası ver

ARKA YÜZ: ${hasBackImage ? 'VAR' : 'YOK'}

SADECE JSON DÖN:
{
  "cek_turu": "Çek | Senet | Belirsiz",
  "vkn": "-",
  "seri": "-",
  "banka": "-",
  "mesaj": "...",
  "risk_skoru": 0,
  "risk_seviyesi": "Düşük | Orta | Yüksek | Kritik",
  "bulgular": ["..."]
}
`.trim();
}

/* ---------------- MOCK DB ---------------- */
/* Gerçekte bunu Supabase / DB ile değiştir */

async function getCheckHistory(seri: string, vkn: string) {
  if (!seri || seri === '-') {
    return { found: false, count: 0, risk: 0 };
  }

  // Demo simülasyon
  const random = Math.floor(Math.random() * 3);

  if (random === 0) {
    return { found: false, count: 0, risk: 10 };
  }

  return {
    found: true,
    count: random + 1,
    risk: 60 + random * 10,
  };
}

/* ---------------- GEMINI ---------------- */

async function callGemini(
  frontBase64Data: string,
  frontMimeType?: string | null,
  backBase64Data?: string | null,
  backMimeType?: string | null
) {
  const parts: any[] = [
    { text: buildPrompt(!!backBase64Data) },
    {
      inline_data: {
        mime_type: detectMimeType(frontBase64Data, frontMimeType),
        data: frontBase64Data,
      },
    },
  ];

  if (backBase64Data) {
    parts.push({ text: 'Arka yüz görselidir.' });
    parts.push({
      inline_data: {
        mime_type: detectMimeType(backBase64Data, backMimeType),
        data: backBase64Data,
      },
    });
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 1500,
          responseMimeType: 'application/json',
        },
      }),
    }
  );

  const text = await res.text();

  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('AI cevabı parse edilemedi');
  }

  if (!res.ok) {
    throw new Error(data?.error?.message || 'Gemini API hatası');
  }

  const raw =
    data?.candidates?.[0]?.content?.parts
      ?.map((p: any) => p?.text || '')
      .join('') ||
    data?.candidates?.[0]?.content?.text ||
    '';

  if (!raw) {
    throw new Error('AI cevap üretmedi');
  }

  return cleanJson(raw);
}

/* ---------------- API ---------------- */

export async function POST(req: NextRequest) {
  try {
    const {
      frontBase64Data,
      frontMimeType,
      backBase64Data,
      backMimeType,
    } = await req.json();

    if (!frontBase64Data) {
      return NextResponse.json(
        { success: false, error: 'Ön yüz zorunlu.' },
        { status: 400 }
      );
    }

    const raw = await callGemini(
      frontBase64Data,
      frontMimeType,
      backBase64Data,
      backMimeType
    );

    const parsed = safeParse(raw);

    if (!parsed) {
      return NextResponse.json(
        { success: false, error: 'AI JSON üretmedi', raw },
        { status: 500 }
      );
    }

    /* -------- AI RISK -------- */

    const aiRisk = Math.min(
      100,
      Math.max(0, Number(parsed?.risk_skoru) || 50)
    );

    /* -------- DB RISK -------- */

    const history = await getCheckHistory(
      parsed?.seri,
      parsed?.vkn
    );

    const sistemRisk = history.risk;

    /* -------- FINAL RISK -------- */

    const finalRisk = Math.min(
      100,
      Math.round(aiRisk * 0.4 + sistemRisk * 0.6)
    );

    /* -------- USER MESSAGE -------- */

    let ozet = 'Orta Risk';
    if (finalRisk < 30) ozet = 'Düşük Risk';
    else if (finalRisk < 60) ozet = 'Orta Risk';
    else if (finalRisk < 80) ozet = 'Yüksek Risk';
    else ozet = 'Kritik Risk';

    let bildirim = null;

    if (history.found) {
      bildirim = `📢 Bu çek ${history.count} farklı kişi tarafından daha önce analiz edildi.`;
    }

    return NextResponse.json({
      success: true,

      cek_turu: parsed?.cek_turu ?? 'Belirsiz',
      vkn: parsed?.vkn ?? '-',
      seri: parsed?.seri ?? '-',
      banka: parsed?.banka ?? '-',

      ozet,
      detay: parsed?.mesaj ?? 'Detay üretilemedi',

      ai_risk: aiRisk,
      sistem_risk: sistemRisk,
      final_risk: finalRisk,

      risk_seviyesi: parsed?.risk_seviyesi ?? ozet,
      bulgular: Array.isArray(parsed?.bulgular) ? parsed.bulgular : [],

      daha_once_goruldu: history.found,
      analiz_sayisi: history.count,
      bildirim,

      arka_yuz_kullanildi: !!backBase64Data,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || 'Analiz başarısız',
      },
      { status: 500 }
    );
  }
}