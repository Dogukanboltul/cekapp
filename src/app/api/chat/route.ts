import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const q = body.message ? body.message.toLowerCase().trim() : "";

    let answer = "";
    let steps: string[] = [];

    // --- 1. SENET VE PROTESTO DÖNGÜSÜ ---
    if (q.includes("senet") || q.includes("protesto") || q.includes("bono")) {
      answer = "Senetlerde protesto çekme süresi vadeden sonraki 2 iş günüdür. Bu süreyi kaçırırsanız cirantalara dava açamazsınız. Protesto süresi geçti mi?";
      steps = ["Süre Geçmedi", "Süreyi Kaçırdım", "Protesto Nedir?"];
    } 
    else if (q.includes("geçmedi") || q.includes("noter")) {
      answer = "Harika! Süre geçmediyse hemen notere gidip protesto çekmelisiniz. Bu sayede tüm cirantalara karşı icra takibi hakkınızı korursunuz. Noter masrafı için bütçeniz hazır mı?";
      steps = ["Masraf Ne Kadar?", "İcra Başlat", "Başa Dön"];
    }
    else if (q.includes("kaçırdım") || q.includes("geçti")) {
      answer = "Eyvah! Süreyi kaçırdıysanız sadece asıl borçluya gidebilirsiniz; cirantalara dava açma hakkınız düştü. Yine de asıl borçluya icra başlatalım mı?";
      steps = ["Asıl Borçluya Başlat", "Başka Yol Yok mu?", "Başa Dön"];
    }

    // --- 2. ÇEK VE İCRA DÖNGÜSÜ ---
    else if (q.includes("çek") || q.includes("yazıldı") || q.includes("karşılıksız") || q.includes("icra")) {
      answer = "Çek karşılıksız çıktıysa bankadan 'karşılıksızdır' şerhi aldınız mı? Bu şerh olmadan ihtiyati haciz süreci başlayamaz.";
      steps = ["Şerh Aldım", "Şerh Nedir?", "Başa Dön"];
    }
    else if (q.includes("aldım") || q.includes("şerh")) {
      answer = "Şerhiniz varsa 10 günlük 'Altın Süre' içindeyiz demektir. Borçlunun mallarına anında bloke koymak için ihtiyati haciz davası açalım mı?";
      steps = ["Hemen Bloke Koy", "Maliyet Hesapla", "Başa Dön"];
    }

    // --- 3. RİSK VE SORGULAMA ---
    else if (q.includes("risk") || q.includes("sorgu") || q.includes("karekod")) {
      answer = "Karekod sorgusu %80 güvenlik sağlar. Findeks raporunda son 6 ayın ödeme performansına baktınız mı?";
      steps = ["Baktım, Temiz", "Bakmadım", "Raporu Yorumla"];
    }

    // --- 4. SELAM VE GENEL ---
    else if (q.includes("selam") || q.includes("merhaba") || q.includes("asistan")) {
      answer = "Ben ÇekApp Hukuk Asistanın. Çek, senet veya icra süreçleriyle ilgili sorun nedir?";
      steps = ["Çek Yazıldı", "Senet Protesto", "Risk Sorgula"];
    }

    // --- 5. FALLBACK (ANLAŞILMAZSA) ---
    else {
      answer = "Anladım. İşlemi ilerletmem için: Bu bir 'Çek' mi yoksa 'Senet' mi? Ayrıca vadesi geçti mi?";
      steps = ["Vadesi Geçmiş Çek", "Protestolu Senet", "Yeni Alınacak Çek"];
    }

    // YANIT (Frontend'e giden cevap)
    return NextResponse.json({
      success: true,
      answer: answer,
      steps: steps
    });

  } catch (err) {
    return NextResponse.json({ 
      success: false, 
      answer: "Sunucu bağlantısı koptu. Lütfen terminali kontrol edip tekrar deneyin." 
    });
  }
}