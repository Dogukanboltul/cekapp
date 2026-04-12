import { NextResponse } from 'next/server';

// Next.js'in her isteği taze işlemesini sağlar (Önbellek sorununu çözer)
export const dynamic = 'force-dynamic';

/**
 * CEKAPP STRATEJİK HUKUK & RİSK ANALİZ MOTORU - V8 (FINAL)
 */
export async function POST(req: Request) {
  try {
    const { message, isCritical } = await req.json();
    const query = message.toLowerCase().trim();

    let answer = "";
    let steps: string[] = [];

    // --- KATMAN 1: SPESİFİK BUTON SORGULARI (ÖNCELİKLİ) ---
    // Eğer kullanıcı bir butona bastıysa, kritik uyarının önüne geçip detay vermeliyiz.

    if (query.includes("şahsi kefalet")) {
      answer = `**KESİNLİKLE ALMALISINIZ.** Mevcut risk tablosunda şahsi kefalet almak bir tercih değil, ticaretin devamı için zorunluluktur.

**Neden?**
- **Zırh Delme:** Şirket konkordato ilan etse bile, **TBK m.583** uyarınca ortağın verdiği 'Müteselsil Kefalet' bu korumanın dışındadır.
- **Güvence:** Şirkete dokunamazken ortağın şahsi mal varlığına (ev, araç) yönelebilirsiniz.
- **Kritik Şart:** Limit ve tarihi kefilin **kendi el yazısıyla** yazdığından emin olun.`;
      steps = ["KEFALETNAME ŞARTLARI", "HUKUKİ RİSKLERİ GÖR", "HUKUKİ DANIŞMANA SOR"];
    }

    else if (query.includes("risklerim neler") || query.includes("hukuki risk")) {
      answer = `Konkordato sürecindeki bir firmaya mal vermek şu yasal riskleri doğurur:

1. **İİK m.294 (Takip Yasağı):** Borçluya karşı yeni icra takibi yapılamaz, mevcutlar durur.
2. **Tahsilat Erteleme:** Alacağınız 24-48 ay arasına yayılabilir.
3. **Çek Ceza Bağışıklığı:** 'Karşılıksız çek' hapis cezası riskleri bu süreçte uygulanmayabilir.`;
      steps = ["ALACAKLI SIRASI NEDİR?", "ŞAHSİ KEFALET ALMALI MIYIM?", "HUKUKİ DANIŞMANA SOR"];
    }

    else if (query.includes("konkordato nedir")) {
      answer = `**Konkordato**, borçlunun mahkeme koruması altına girmesidir. Sizin için bu durum; borçluya haciz yapamadığınız, alacağınız için yıllarca bekleyebileceğiniz bir 'yasal kalkan' anlamına gelir.`;
      steps = ["HUKUKİ RİSKLERİM NELER?", "ŞAHSİ KEFALET ALMALI MIYIM?", "HUKUKİ DANIŞMANA SOR"];
    }

    else if (query.includes("alacaklı sırası")) {
      answer = `**İİK m.206 Sıra Cetveli** gereği; işçi borçları, rehinli bankalar ve devlet alacakları (vergi) sizden öncedir. Siz 4. sırada (Adi Alacaklı) yer aldığınız için tahsilat şansınız oldukça düşüktür.`;
      steps = ["HUKUKİ RİSKLERİ GÖR", "HUKUKİ DANIŞMANA SOR"];
    }

    else if (query.includes("danışman") || query.includes("avukat") || query.includes("destek")) {
      answer = "Alanında uzman avukatımız en kısa sürede sizinle iletişime geçerek süreci devralacaktır.";
      steps = ["ANA SAYFAYA DÖN"];
    }

    // --- KATMAN 2: GENEL DURUM VE KRİTİK UYARI ---
    // Eğer yukarıdaki butonlardan biri tıklanmadıysa ve durum kritikse bu uyarıyı bas.

    else if (isCritical) {
      answer = "⚠️ STRATEJİK UYARI: Muhatabın yasal bir koruma (konkordato) sürecinde olduğu saptanmıştır. İİK hükümleri gereği tahsilat yasal engellere tabidir. Finansal varlığınızı korumak için işlemi derhal askıya almanız veya şahsi kefalet almanız önerilir.";
      steps = ["KONKORDATO NEDİR?", "HUKUKİ RİSKLERİM NELER?", "ŞAHSİ KEFALET ALMALI MIYIM?", "HUKUKİ DANIŞMANA SOR"];
    }

    else {
      answer = "Sorgulanan veriler şu an için stabil görünmektedir. Ancak basiretli bir tacir olarak yüksek tutarlı işlemlerde ek teminat almanızı öneririz.";
      steps = ["HUKUKİ RİSKLERİ GÖR", "HUKUKİ DANIŞMANA SOR"];
    }

    return NextResponse.json({ success: true, answer, steps });

  } catch (error) {
    console.error("CekApp API Error:", error);
    return NextResponse.json({ 
      success: false, 
      answer: "Teknik bir aksaklık oluştu. Alanında uzman avukatımız sizinle iletişime geçecektir." 
    }, { status: 500 });
  }
}