import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const frontFile = data.get('front_image') as File;
    const backFile = data.get('back_image') as File;

    if (!frontFile || !backFile) {
      return NextResponse.json({ isValid: false, error: "Görseller eksik." }, { status: 400 });
    }

    const frontBase64 = Buffer.from(await frontFile.arrayBuffer()).toString("base64");
    const backBase64 = Buffer.from(await backFile.arrayBuffer()).toString("base64");

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash", 
      generationConfig: { responseMimeType: "application/json", temperature: 0.1 }
    });

    const prompt = `
      GÖREV: SEN BİR TİCARİ EVRAK DENETÇİSİSİN. 
      ÖNCE GÖRSELDEKİ METİNLERİ TARA VE ŞU KARAR MEKANİZMASINI ÇALIŞTIR:

      1. ADIM (ÇEK KONTROLÜ): 
         - Görselde "ÇEK", "KEŞİDECİ", "HAMİL", "MUHATAP BANKA", "HESAP NO" veya "KAREKOD" var mı?
         - Eğer varsa: "type": "CEK" olarak belirle ve verileri çıkar.

      2. ADIM (SENET KONTROLÜ): 
         - Görselde "BONO", "EMRÜMUHARREREDİR", "BORÇLU", "ALACAKLI", "NAKDEN" veya "MALEN" ibareleri var mı?
         - Eğer varsa: "type": "SENET" olarak belirle ve verileri (Ödeyecek, Alacaklı, Vade) çıkar.

      3. ADIM (RET): 
         - Eğer yukarıdaki iki gruba da girmiyorsa (Fatura, kimlik, manzara vb.):
         - "isValid": false döndür.
         - "aiComment": "YÜKLENEN GÖRSEL GEÇERLİ BİR ÇEK VEYA SENET DEĞİLDİR. LÜTFEN TİCARİ BİR EVRAK YÜKLEYİN." yaz.

      YANIT FORMATI (JSON):
      {
        "isValid": boolean,
        "type": "CEK" | "SENET" | "GECERSIZ",
        "score": number,
        "status": "GÜVENLİ" | "RİSKLİ" | "GEÇERSİZ",
        "aiComment": "string",
        "extraction": { 
            "vade": "string", 
            "tutar": "string", 
            "vkn": "string",
            "evrak_tipi": "string"
        }
      }
    `;

    const result = await model.generateContent([
      { text: prompt },
      { inlineData: { data: frontBase64, mimeType: frontFile.type } },
      { inlineData: { data: backBase64, mimeType: backFile.type } }
    ]);

    const responseText = result.response.text();
    const cleanJson = JSON.parse(responseText.replace(/```json|```/g, "").trim());

    return NextResponse.json(cleanJson);

  } catch (error: any) {
    console.error("🔥 MOTOR HATASI:", error);
    // 404 Hatası hala geliyorsa terminalde bunu göreceksin:
    return NextResponse.json({ 
      isValid: false, 
      error: "ANALİZ MOTORUNA ERİŞİLEMEDİ. LÜTFEN API ANAHTARINI VE İNTERNETİNİZİ KONTROL EDİN." 
    }, { status: 500 });
  }
}