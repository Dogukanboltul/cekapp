'use client';

import React, { useState, useEffect } from "react";
import { 
  FileText, Handshake, Landmark, ShieldCheck, 
  AlertOctagon, Scale, Gavel, ShieldAlert, BellRing,
  Timer, Search, ShieldX, Ban, LandmarkIcon, Info
} from "lucide-react";

export default function MarketRadar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // --- ÇEKAPP AKADEMİ: 100 GERÇEK ALTIN KURAL (TAM LİSTE) ---
  const allTips = [
    { id: 1, type: "ÇEK", label: "HUKUK", text: "Çek bir ödeme aracıdır; ibraz edildiğinde bankada karşılığı bulunmalıdır.", icon: <Gavel size={14} /> },
    { id: 2, type: "SENET", label: "USUL", text: "Senette 'Kayıtsız şartsız belirli bir bedeli ödeme vaadi' ibaresi zorunludur.", icon: <Scale size={14} /> },
    { id: 3, type: "ÇEK", label: "GÜVENLİK", text: "Miktar kısmında rakam ve yazı farklıysa, yazı ile olan miktar esas alınır.", icon: <FileText size={14} /> },
    { id: 4, type: "SENET", label: "İCRA", text: "Protesto süresi, vadenin bitimini takip eden 2 iş günüdür.", icon: <AlertOctagon size={14} /> },
    { id: 5, type: "ÇEK", label: "VADE", text: "İbraz süresi; aynı şehirde 10 gün, farklı şehirde 1 aydır.", icon: <Timer size={14} /> },
    { id: 6, type: "SENET", label: "İSPAT", text: "Bedeli malen alınmıştır ibaresi, malın teslim edildiğine kanıttır.", icon: <Handshake size={14} /> },
    { id: 7, type: "ÇEK", label: "ADLİ", text: "Karşılıksız çek şikayet süresi, arkası vurulduktan sonra 3 aydır.", icon: <Gavel size={14} /> },
    { id: 8, type: "SENET", label: "TEKNİK", text: "Vade tarihi olmayan senetler 'görüldüğünde ödenecek' senet sayılır.", icon: <Timer size={14} /> },
    { id: 9, type: "ÇEK", label: "GEÇERSİZLİK", text: "İmza el yazısıyla atılmalıdır; kaşe veya mühür çeki geçersiz kılar.", icon: <ShieldX size={14} /> },
    { id: 10, type: "SENET", label: "GÜVENLİK", text: "Şahıs senetlerinde borçlunun TC kimlik numarası mutlaka yazılmalıdır.", icon: <ShieldCheck size={14} /> },
    { id: 11, type: "ÇEK", label: "OPERASYON", text: "Şirket çeklerinde imza sirkülerindeki yetki sınırını kontrol edin.", icon: <Search size={14} /> },
    { id: 12, type: "SENET", label: "RİSK", text: "Ciro silsilesinde kopukluk olan senetleri kesinlikle almayın.", icon: <Ban size={14} /> },
    { id: 13, type: "ÇEK", label: "SAHTECİLİK", text: "Çek kağıdındaki filigranı ve UV ışık güvenlik liflerini inceleyin.", icon: <Search size={14} /> },
    { id: 14, type: "SENET", label: "HUKUK", text: "Senedin zamanaşımı süresi vadeden itibaren 3 yıldır.", icon: <Timer size={14} /> },
    { id: 15, type: "ÇEK", label: "İCRA", text: "Karşılıksız çıkan çekte ihtiyati haciz kararı hızlıca alınmalıdır.", icon: <Gavel size={14} /> },
    { id: 16, type: "SENET", label: "YETKİ", text: "Vekaleten atılan imzalarda vekaletname kapsamını mutlaka görün.", icon: <ShieldCheck size={14} /> },
    { id: 17, type: "ÇEK", label: "CİRO", text: "Hamiline çeklerde ciro zorunlu değildir, teslim ile devir olur.", icon: <Handshake size={14} /> },
    { id: 18, type: "SENET", label: "AVAL", text: "Aval veren kişi borçluyla birlikte müteselsilen sorumludur.", icon: <Scale size={14} /> },
    { id: 19, type: "ÇEK", label: "BANKA", text: "Kapanmış banka hesaplarına ait çek koçanları piyasada dolaşabilir.", icon: <LandmarkIcon size={14} /> },
    { id: 20, type: "SENET", label: "USUL", text: "Ödeme yeri belirtilmemişse, tanzim yeri ödeme yeri kabul edilir.", icon: <LandmarkIcon size={14} /> },
    { id: 21, type: "ÇEK", label: "KRİTİK", text: "Çek tazminatı talebi için ibraz süresinde bankaya gidilmelidir.", icon: <AlertOctagon size={14} /> },
    { id: 22, type: "SENET", label: "GÜVENLİK", text: "Senedin ön yüzündeki yazı tipi ve kalem farklarına dikkat edin.", icon: <Search size={14} /> },
    { id: 23, type: "ÇEK", label: "SİCİL", text: "Keşidecinin Findeks çek raporunda 'gecikmeli ödeme' var mı bakın.", icon: <FileText size={14} /> },
    { id: 24, type: "SENET", label: "KORUMA", text: "Protestolu senet sayısı artan firmalardan evrak almayın.", icon: <ShieldAlert size={14} /> },
    { id: 25, type: "ÇEK", label: "BANKA", text: "Çek karnesinin basım tarihi eskiyse firmanın güvenilirliği yüksektir.", icon: <LandmarkIcon size={14} /> },
    { id: 26, type: "SENET", label: "HUKUK", text: "Senet üzerine yazılan 'teminat' şerhi senedin vasfını bozabilir.", icon: <Scale size={14} /> },
    { id: 27, type: "ÇEK", label: "VADE", text: "İleri tarihli çeklerde dahi bankaya ibraz ödeme yükümü doğurur.", icon: <Timer size={14} /> },
    { id: 28, type: "SENET", label: "TEKNİK", text: "Ödeme günü tatile gelirse, takip eden ilk iş günü ödeme yapılır.", icon: <Timer size={14} /> },
    { id: 29, type: "ÇEK", label: "ADLİ", text: "Çek üzerindeki tahrifatlar ağır ceza kapsamında suç teşkil eder.", icon: <AlertOctagon size={14} /> },
    { id: 30, type: "SENET", label: "İCRA", text: "Borçlu adresinin MERNİS adresiyle uyuşup uyuşmadığına bakın.", icon: <Search size={14} /> },
    { id: 31, type: "ÇEK", label: "OPERASYON", text: "Karekodlu çeklerde sorgulama yapmadan evrakı teslim almayın.", icon: <Search size={14} /> },
    { id: 32, type: "SENET", label: "KORUMA", text: "Yabancı para birimli senetlerde kur farkı şartlarını kontrol edin.", icon: <Scale size={14} /> },
    { id: 33, type: "ÇEK", label: "HUKUK", text: "İbraz süresi geçtikten sonra çek artık sadece delil vasfındadır.", icon: <FileText size={14} /> },
    { id: 34, type: "SENET", label: "RİSK", text: "Hatır senetleri gerçek bir ticarete dayanmadığı için risklidir.", icon: <ShieldAlert size={14} /> },
    { id: 35, type: "ÇEK", label: "GÜVENLİK", text: "Çekin sağ üst köşesindeki karekodun okunabilirliğini kontrol edin.", icon: <Search size={14} /> },
    { id: 36, type: "SENET", label: "USUL", text: "Senedin tanzim tarihi yoksa, belge bono vasfını tamamen kaybeder.", icon: <Ban size={14} /> },
    { id: 37, type: "ÇEK", label: "İSTİHBARAT", text: "Keşidecinin son 6 aydaki karşılıksız çek adedini sorgulayın.", icon: <FileText size={14} /> },
    { id: 38, type: "SENET", label: "ADLİ", text: "Açığa atılan imzalar sonradan doldurulursa itiraz hakkı doğurur.", icon: <Gavel size={14} /> },
    { id: 39, type: "ÇEK", label: "KORUMA", text: "Ciro eden firmaların ticaret sicil gazetesindeki yetkisine bakın.", icon: <LandmarkIcon size={14} /> },
    { id: 40, type: "SENET", label: "GÜVENLİK", text: "İmza atılırken borçlunun bizzat yanınızda olduğundan emin olun.", icon: <ShieldCheck size={14} /> },
    { id: 41, type: "ÇEK", label: "USUL", text: "Bankaya ibraz edilen çekin arkasına 'karşılıksızdır' şerhi vurdurun.", icon: <AlertOctagon size={14} /> },
    { id: 42, type: "SENET", label: "TEKNİK", text: "Senet borçlusu şirketse, kaşe üzerine atılan çift imza risklidir.", icon: <ShieldX size={14} /> },
    { id: 43, type: "ÇEK", label: "RİSK", text: "Faktoringe verilen çeklerin fatura ile tam uyumlu olması gerekir.", icon: <FileText size={14} /> },
    { id: 44, type: "SENET", label: "HUKUK", text: "Kambiyo takibi yapabilmek için senedin aslı icra dairesine sunulur.", icon: <Gavel size={14} /> },
    { id: 45, type: "ÇEK", label: "VADE", text: "Keşide tarihi resmi tatil olan çekler geçersiz sayılmaz.", icon: <Timer size={14} /> },
    { id: 46, type: "SENET", label: "İCRA", text: "Ödemeyen senet için protesto çekmek, cirantaların sorumluluğunu korur.", icon: <ShieldCheck size={14} /> },
    { id: 47, type: "ÇEK", label: "BANKA", text: "Bankanın ödemekle yükümlü olduğu asgari tutarı talep etmeyi unutmayın.", icon: <Scale size={14} /> },
    { id: 48, type: "SENET", label: "USUL", text: "Senetteki borçlu ismi ile TC kimlik numarası mutlaka eşleşmelidir.", icon: <Search size={14} /> },
    { id: 49, type: "ÇEK", label: "GÜVENLİK", text: "Çek yaprağının dokusu ve kağıt kalitesi sahtecilik ipucudur.", icon: <Search size={14} /> },
    { id: 50, type: "SENET", label: "RİSK", text: "Borçlunun varlık yapısı ve ödeme gücü hakkında ön araştırma yapın.", icon: <ShieldAlert size={14} /> },
    { id: 51, type: "ÇEK", label: "SİCİL", text: "Yeni açılan şirketlerin kestiği yüksek meblağlı çeklere karşı temkinli olun.", icon: <Info size={14} /> },
    { id: 52, type: "SENET", label: "HUKUK", text: "Senette borçlu imzasının yanına 'bedeli alınmıştır' yazılması ispat yükünü değiştirir.", icon: <Gavel size={14} /> },
    { id: 53, type: "ÇEK", label: "BANKA", text: "Çek ödenmediğinde bankanın ödemek zorunda olduğu yasal miktar her Ocak'ta güncellenir.", icon: <LandmarkIcon size={14} /> },
    { id: 54, type: "SENET", label: "TEKNİK", text: "Senet üzerine atılan şirket kaşesinin net ve okunur olması icra takibi için şarttır.", icon: <FileText size={14} /> },
    { id: 55, type: "ÇEK", label: "USUL", text: "Çek defteri sahibi dışında birinin imzasıyla kesilen çekler sahtecilik sayılır.", icon: <ShieldX size={14} /> },
    { id: 56, type: "SENET", label: "VADE", text: "Senette vade 'Ayın son günü' olarak belirtilmişse, o ayın takvimdeki son günü esas alınır.", icon: <Timer size={14} /> },
    { id: 57, type: "ÇEK", label: "ADLİ", text: "Karşılıksız çekten dolayı verilen adli para cezası ödenmezse hapis cezasına çevrilebilir.", icon: <Gavel size={14} /> },
    { id: 58, type: "SENET", label: "CİRO", text: "Senedi ciro eden her şahıs, kendisinden sonra gelenlere karşı borçtan sorumlu olur.", icon: <Handshake size={14} /> },
    { id: 59, type: "ÇEK", label: "İCRA", text: "Çek tazminatı, çek bedelinin %10'undan az olamaz; dava açarken mutlaka talep edin.", icon: <Scale size={14} /> },
    { id: 60, type: "SENET", label: "İSPAT", text: "İki şahıs arasındaki 100 bin TL üzeri alacak iddiaları senetle ispatlanmak zorundadır.", icon: <Scale size={14} /> },
    { id: 61, type: "ÇEK", label: "OPERASYON", text: "Banka onaylı (bloke) çekler, ödeme garantisi en yüksek olan çek türüdür.", icon: <ShieldCheck size={14} /> },
    { id: 62, type: "SENET", label: "YETKİ", text: "Ticari mümessilin senet imzalama yetkisi özel olarak verilmiş olmalıdır.", icon: <Search size={14} /> },
    { id: 63, type: "ÇEK", label: "BANKA", text: "Çek takas sistemine girdiğinde, provizyon alınması ödeme anlamına gelmez.", icon: <LandmarkIcon size={14} /> },
    { id: 64, type: "SENET", label: "KORUMA", text: "Yırtılmış ve bantlanmış senetler, imza yerinden zarar görmüşse geçersiz olabilir.", icon: <ShieldX size={14} /> },
    { id: 65, type: "ÇEK", label: "GÜVENLİK", text: "Çek üzerinde 'Emre Yazılıdır' ibaresi varsa, sadece ciro yoluyla devredilebilir.", icon: <FileText size={14} /> },
    { id: 66, type: "SENET", label: "İCRA", text: "Senede dayalı takiplerde borçlunun 5 gün içinde itiraz etme hakkı vardır.", icon: <Gavel size={14} /> },
    { id: 67, type: "ÇEK", label: "SAHTECİLİK", text: "Mikro yazı teknolojisi içeren çeklerde, yazıların büyüteçle dağılmadığını görün.", icon: <Search size={14} /> },
    { id: 68, type: "SENET", label: "HUKUK", text: "Senet borçlusu vefat ederse, borç mirası reddetmeyen varislere geçer.", icon: <Landmark size={14} /> },
    { id: 69, type: "ÇEK", label: "VADE", text: "Çekte keşide tarihi olarak '31 Şubat' gibi imkansız bir gün yazılırsa geçersizdir.", icon: <Timer size={14} /> },
    { id: 70, type: "SENET", label: "TEKNİK", text: "Senedin arka yüzündeki cirolar karalanmışsa, o ciro yapılmamış sayılır.", icon: <Ban size={14} /> },
    { id: 71, type: "ÇEK", label: "RİSK", text: "Çek karnesini kaybeden kişi, mahkemeden derhal ödeme yasağı kararı almalıdır.", icon: <ShieldAlert size={14} /> },
    { id: 72, type: "SENET", label: "OPERASYON", text: "Kısmi ödemeleri senedin arkasına işletip borçluya imzalattırmayı unutmayın.", icon: <Handshake size={14} /> },
    { id: 73, type: "ÇEK", label: "ADLİ", text: "Çeki çalan veya bulan kişi onu tahsil etmeye çalışırsa nitelikli hırsızlık suçudur.", icon: <Gavel size={14} /> },
    { id: 74, type: "SENET", label: "GÜVENLİK", text: "Beyaz boşluklara sonradan ekleme yapılmaması için metni sıkışık yazın.", icon: <FileText size={14} /> },
    { id: 75, type: "ÇEK", label: "HUKUK", text: "Çek aslı olmadan yapılan fotokopi veya tarama üzerinden işlem yapılamaz.", icon: <ShieldX size={14} /> },
    { id: 76, type: "SENET", label: "TEKNİK", text: "Senedin ön yüzündeki tüm el yazılarının aynı kalemle yazılması güvenliği artırır.", icon: <Search size={14} /> },
    { id: 77, type: "ÇEK", label: "BANKA", text: "Hesapta para olmasına rağmen banka ödeme yapmıyorsa 'haksız ret' davası açılabilir.", icon: <Scale size={14} /> },
    { id: 78, type: "SENET", label: "İCRA", text: "Zamanaşımına uğrayan senet, icra takibi yerine genel mahkemede alacak davasına konu olur.", icon: <Gavel size={14} /> },
    { id: 79, type: "ÇEK", label: "VADE", text: "İbraz süresinin son günü tatile gelirse, süre tatilin bitimini izleyen ilk iş gününe uzar.", icon: <Timer size={14} /> },
    { id: 80, type: "SENET", label: "GÜVENLİK", text: "Senedin sol kenarına borçlunun parmak izini alarak sahtecilik iddiasını çürütebilirsiniz.", icon: <ShieldCheck size={14} /> },
    { id: 81, type: "ÇEK", label: "SİCİL", text: "Karşılıksız çek keşide eden tüzel kişilerin yönetim kurulu üyelerine çek yasağı gelir.", icon: <Ban size={14} /> },
    { id: 82, type: "SENET", label: "HUKUK", text: "Senet üzerine yazılan 'ceza şartı' hükümleri kambiyo hukukunda geçersiz sayılabilir.", icon: <Scale size={14} /> },
    { id: 83, type: "ÇEK", label: "BANKA", text: "Çekin bankaya 'gecikmeli' ibraz edilmesi, cirantaların sorumluluğunu sona erdirir.", icon: <AlertOctagon size={14} /> },
    { id: 84, type: "SENET", label: "TEKNİK", text: "Bonoda bedelin TL dışında başka bir para birimiyle yazılması kur riskini artırır.", icon: <Timer size={14} /> },
    { id: 85, type: "ÇEK", label: "OPERASYON", text: "Yurt dışı bankalarına ait çeklerin ibraz süreleri ülkeler arası mesafe ile değişir.", icon: <LandmarkIcon size={14} /> },
    { id: 86, type: "SENET", label: "İSPAT", text: "Ticari defterlerde kayıtlı olmayan bir senet, ticari ilişkiden bağımsız sayılabilir.", icon: <Search size={14} /> },
    { id: 87, type: "ÇEK", label: "ADLİ", text: "Sahte çek düzenlemek 'Resmi Belgede Sahtecilik' suçudur ve 5-8 yıl hapsi vardır.", icon: <Gavel size={14} /> },
    { id: 88, type: "SENET", label: "İCRA", text: "Maaş haczinde senede dayalı borçlar, kişinin maaşının en fazla 1/4'üne konulur.", icon: <Scale size={14} /> },
    { id: 89, type: "ÇEK", label: "VADE", text: "Keşide tarihi olmayan bir çek, çek vasfı taşımaz, sadece basit bir borç ikrarıdır.", icon: <Ban size={14} /> },
    { id: 90, type: "SENET", label: "USUL", text: "Senet üzerinde tahrifat (silinti/kazıntı) varsa borçlu itiraz edebilir.", icon: <AlertOctagon size={14} /> },
    { id: 91, type: "ÇEK", label: "KORUMA", text: "Banka görevlisinin çek arkasına attığı imzanın yetkili olduğunu teyit edin.", icon: <ShieldCheck size={14} /> },
    { id: 92, type: "SENET", label: "RİSK", text: "Aynı borç için hem çek hem senet almak, mükerrer takibe neden olabilir.", icon: <ShieldAlert size={14} /> },
    { id: 93, type: "ÇEK", label: "GÜVENLİK", text: "Çizgili çek (crossed check) sadece bir bankaya veya banka müşterisine ödenir.", icon: <FileText size={14} /> },
    { id: 94, type: "SENET", label: "HUKUK", text: "Borçlu senedi ödediğinde senedin aslını mutlaka imha etmeli veya şerh düşmelidir.", icon: <Ban size={14} /> },
    { id: 95, type: "ÇEK", label: "BANKA", text: "Ödeme yasağı kararı kaldırılmadıkça banka hesapta para olsa bile ödeme yapamaz.", icon: <LandmarkIcon size={14} /> },
    { id: 96, type: "SENET", label: "TEKNİK", text: "Bono üzerine yazılan 'bedeli nakden alınmıştır' şerhi, para akışının kanıtıdır.", icon: <Handshake size={14} /> },
    { id: 97, type: "ÇEK", label: "OPERASYON", text: "ÇekApp risk puanı 700 altı olan firmaların çeklerini kabul etmek risklidir.", icon: <ShieldAlert size={14} /> },
    { id: 98, type: "SENET", label: "GÜVENLİK", text: "TC kimlik numarası yazılmayan şahıs senetlerinde itiraz süreci uzayabilir.", icon: <Search size={14} /> },
    { id: 99, type: "ÇEK", label: "İCRA", text: "Çek aslı kaybolmuşsa 'zayi belgesi' olmadan icra takibi başlatılamaz.", icon: <Gavel size={14} /> },
    { id: 100, type: "SENET", label: "HUKUK", text: "Senedin arka yüzündeki boş ciro, senedi 'hamiline' vasfına sokar.", icon: <Handshake size={14} /> }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false); 
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 3 >= allTips.length ? 0 : prev + 3));
        setIsVisible(true);
      }, 1000); 
    }, 15000); 
    return () => clearInterval(interval);
  }, [allTips.length]);

  const currentTips = allTips.slice(currentIndex, currentIndex + 3);

  return (
    <aside className="space-y-4 max-w-full lg:max-w-[400px]">
      
      {/* HEADER */}
      <div className="bg-[#0b1222] border border-white/10 rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden text-left">
        <div className="absolute -right-4 -top-4 opacity-5">
          <BellRing size={120} className="text-red-500 animate-pulse" />
        </div>
        
        <div className="relative z-10 flex flex-col gap-1">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-500/10 p-2.5 rounded-2xl border border-red-500/20">
                <ShieldAlert size={20} className="text-red-500" />
              </div>
              <div className="text-left">
                <h3 className="text-[14px] font-black text-white tracking-[0.15em] uppercase italic leading-none">ÇEKAPP UYARIYOR</h3>
                <p className="text-[8px] font-bold text-slate-500 uppercase mt-2 italic tracking-widest leading-none">100 ALTIN KURAL // TİCARİ REHBER</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-black/40 rounded-full border border-white/5">
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
              <span className="text-[8px] font-black text-red-500 uppercase tracking-tighter">GÜNCEL</span>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT: 100 MADDELİK AKIŞ */}
      <div className="bg-[#0b1222]/50 border border-white/5 rounded-[2.5rem] p-5 space-y-4 backdrop-blur-xl min-h-[460px] flex flex-col justify-center overflow-hidden">
        {currentTips.map((tip, index) => (
          <div 
            key={tip.id} 
            style={{ transitionDelay: isVisible ? `${index * 300}ms` : '0ms' }}
            className={`group bg-black/40 border border-white/[0.03] p-6 rounded-[2rem] flex flex-col gap-3 transition-all duration-[1200ms] border-l-4 relative
              ${tip.type === 'ÇEK' ? 'border-l-blue-600/50' : 'border-l-purple-600/50'}
              ${isVisible ? 'opacity-100 translate-y-0 blur-0 scale-100' : 'opacity-0 translate-y-10 blur-md scale-95'}
            `}
          >
            {/* ETİKET */}
            <div className={`absolute top-5 right-6 px-2.5 py-0.5 rounded-md text-[7px] font-black tracking-widest border uppercase
               ${tip.type === 'ÇEK' ? 'bg-blue-500/5 border-blue-500/20 text-blue-400/80' : 'bg-purple-500/5 border-purple-500/20 text-purple-400/80'}`}>
               {tip.label}
            </div>

            <div className="flex items-center gap-3 text-left">
               <div className={`p-2 rounded-xl border bg-black/50 ${tip.type === 'ÇEK' ? 'text-blue-500 border-blue-500/20' : 'text-purple-500 border-purple-500/20'}`}>
                 {tip.icon}
               </div>
               <div className="flex flex-col text-left">
                 <span className={`text-[11px] font-black italic tracking-widest text-left ${tip.type === 'ÇEK' ? 'text-blue-400' : 'text-purple-400'}`}>
                   {tip.type} ANALİZİ
                 </span>
               </div>
            </div>
            
            <p className="text-[12px] font-black text-white/90 leading-relaxed uppercase italic text-left pl-1 pr-10">
              "{tip.text}"
            </p>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="bg-black/20 px-6 py-4 rounded-full border border-white/5 flex items-center justify-center gap-3">
        <ShieldCheck size={12} className="text-slate-700" />
        <span className="text-[7px] font-black text-slate-600 uppercase italic tracking-[0.2em] leading-none text-center">TÜM BİLGİLER GÜNCEL MEVZUATA UYGUNDUR</span>
      </div>
    </aside>
  );
}