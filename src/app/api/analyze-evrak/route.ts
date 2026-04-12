import { NextResponse } from 'next/server';

/**
 * ⚖️ CEKAPP STRATEJİK HUKUK & RİSK ANALİZ MOTORU - V7 (ULTIMATE)
 * Kapsam: Konkordato, Hukuki Riskler, Şahsi Kefalet Gerekliliği, İİK & TBK Mevzuatı.
 */

export async function POST(req: Request) {
  try {
    const { message, isCritical } = await req.json();
    const query = message.toLowerCase().trim();

    let answer = "";
    let steps: string[] = [];

    // -------------------------------------------------------------------------
    // 1. KATMAN: DOĞRUDAN AVUKAT / DANIŞMAN TALEBİ (MUTLAK ÖNCELİK)
    // -------------------------------------------------------------------------
    if (
      query.includes("danışman") || 
      query.includes("avukat") || 
      query.includes("istiyorum") || 
      query.includes("destek")
    ) {
      answer = "Alanında uzman avukatımız sizinle iletişime geçecektir.";
      steps = ["ANA SAYFAYA DÖN", "RİSK ANALİZİNİ YENİLE"];
    }

    // -------------------------------------------------------------------------
    // 2. KATMAN: KONKORDATO NEDİR?
    // -------------------------------------------------------------------------
    else if (query.includes("konkordato nedir") || query.includes("konkordato ne demek")) {
      answer = `**Konkordato**, mali durumu sarsılmış borçlunun, alacaklılarıyla anlaşarak borçlarını yapılandırmasıdır. 

Ancak bir satıcı olarak sizin için bu bir **'yasal dokunulmazlık'** sürecidir:
- Borçluya karşı icra takibi yapılamaz.
- Mevcut takipler ve hacizler dondurulur.
- Alacaklarınız faizsiz ve 2-4 yıla yayılan taksitlere bölünebilir.
- Borçlu koruma kalkanı kazanırken, siz tahsilat için belirsiz bir sürece girersiniz.`;
      
      steps = ["HUKUKİ RİSKLERİM NELER?", "ŞAHSİ KEFALET ALMALI MIYIM?", "HUKUKİ DANIŞMANA SOR"];
    }

    // -------------------------------------------------------------------------
    // 3. KATMAN: HUKUKİ RİSK ANALİZİ
    // -------------------------------------------------------------------------
    else if (query.includes("hukuki risk") || query.includes("risklerim neler")) {
      answer = `Konkordato sürecindeki bir firmaya mal vermek şu yasal riskleri doğurur:

1. **İİK m.294 (Takip Yasağı):** Karar anından itibaren borçluya yeni icra takibi yapılamaz. Rehinli alacaklılar bile muhafaza işlemi yapamaz.
2. **Çek Ceza Bağışıklığı:** Borçlu mühlet içinde olduğu için karşılıksız çekten doğan hapis cezalarından kurtulabilir.
3. **Komiser Denetimi:** Alacağınızın ödenip ödenmeyeceğine mahkemenin atadığı komiser karar verir. Bu süreçte muhatabınız artık firma sahibi değil, hukuk sistemidir.`;
      
      steps = ["ALACAKLI SIRASI NEDİR?", "ŞAHSİ KEFALET ALMALI MIYIM?", "HUKUKİ DANIŞMANA SOR"];
    }

    // -------------------------------------------------------------------------
    // 4. KATMAN: ŞAHSİ KEFALET ALMALI MIYIM? (ÖZEL SORU & ANALİZ)
    // -------------------------------------------------------------------------
    else if (query.includes("şahsi kefalet almalı mıyım") || query.includes("kefalet gerekli mi")) {
      answer = `**KESİNLİKLE ALMALISINIZ.** Mevcut risk tablosunda şahsi kefalet almak bir tercih değil, ticaretin devamı için zorunluluktur.

**Neden Almalısınız?**
- **Zırh Delme Metodu:** Şirket konkordato ilan ederek kendini korumaya alsa da, **TBK m.583** uyarınca ortağın verdiği 'Müteselsil Kefalet' bu korumanın dışındadır. Şirkete dokunamazken ortağın şahsi malına çökebilirsiniz.
- **Tahsilat Garantisi:** Şirketten alamadığınız parayı ortağın şahsi gayrimenkulünden veya banka hesabından tahsil etme şansınız olur.
- **Caydırıcılık:** Kendi mal varlığıyla riske giren borçlu, ödeme planında sizi her zaman ilk sıraya koyacaktır.

**Kritik Şart:** Kefaletnamenin geçerli olması için limit ve tarihin kefilin **kendi el yazısıyla** yazıldığından emin olun. Bu imzayı almadan sevkiyatı onaylamanız sermayenizi kontrolsüz riske atmaktır.`;
      
      steps = ["KEFALETNAME ŞARTLARI", "HUKUKİ RİSKLERİ GÖR", "HUKUKİ DANIŞMANA SOR"];
    }

    // -------------------------------------------------------------------------
    // 5. KATMAN: ALACAKLI SIRASI (İİK 206)
    // -------------------------------------------------------------------------
    else if (query.includes("alacaklı sırası") || query.includes("paramı")) {
      answer = `**İİK m.206 Sıra Cetveli** sizin için en büyük tahsilat engelidir. Para dağıtılırken öncelik şöyledir:
1. İşçi alacakları.
2. Rehinli/İpotekli bankalar.
3. Devlet alacakları (Vergi/SGK).
4. **Ticari Alacaklılar (SİZ).**

İlk üç sıra temizlenmeden adi alacaklılara (4. sıra) ödeme yapılması yasal ve finansal olarak çok düşük bir ihtimaldir.`;
      
      steps = ["HUKUKİ RİSKLERİ GÖR", "HUKUKİ DANIŞMANA SOR"];
    }

    // -------------------------------------------------------------------------
    // 6. KATMAN: DEFAULT / KRİTİK DURUM
    // -------------------------------------------------------------------------
    else {
      if (isCritical) {
        answer = "⚠️ STRATEJİK UYARI: Muhatabın yasal bir koruma (konkordato) sürecinde olduğu saptanmıştır. İİK hükümleri gereği tahsilat yasal engellere tabidir. Finansal varlığınızı korumak için işlemi derhal askıya almanız önerilir.";
        steps = ["KONKORDATO NEDİR?", "HUKUKİ RİSKLERİM NELER?", "ŞAHSİ KEFALET ALMALI MIYIM?", "HUKUKİ DANIŞMANA SOR"];
      } else {
        answer = `Sorgu analiz edildi. Mevcut sicil kaydı temiz görünse de, basiretli bir tacir olarak sevkiyatı şahsi kefalet veya ek teminatla güvence altına almanız tavsiye edilir.`;
        steps = ["HUKUKİ RİSKLERİ GÖR", "HUKUKİ DANIŞMANA SOR"];
      }
    }

    return NextResponse.json({
      success: true,
      answer: answer,
      steps: steps
    });

  } catch (error) {
    console.error("CekApp AI Error:", error);
    return NextResponse.json({ 
      success: false, 
      answer: "Alanında uzman avukatımız sizinle iletişime geçecektir." 
    }, { status: 500 });
  }
}