'use client';

import React, { useState, useEffect } from "react";
import { Zap, Fingerprint, Layers, Timer, TrendingUp, AlertTriangle, ShieldAlert, Scale, Ban, FileSignature, Landmark } from "lucide-react";

export default function MarketRadar() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(false);
  
  const [alertText, setAlertText] = useState("PİYASA ÇEK ANALİZİ BAŞLATILIYOR...");
  const [alertType, setAlertType] = useState<'CRITICAL' | 'DANGER' | 'WARNING'>('DANGER');
  const [status, setStatus] = useState({ label: "ÇEK RADARI", val: "AKTİF" });

  useEffect(() => {
    const sektorler = ["TEKSTİL", "LOJİSTİK", "GIDA", "E-TİCARET", "OTOMOTİV", "YAPI MARKET"];
    const sehirler = ["İSTANBUL", "ANKARA", "İZMİR", "BURSA", "GAZİANTEP", "DENİZLİ"];
    const cekTipleri = ["HAMİLİNE ÇEK", "NAMA YAZILI ÇEK", "EMRE YAZILI ÇEK", "TACİR ÇEKİ", "ŞAHSİ ÇEK"];
    
    const generateIntelligence = () => {
      const rand = Math.random();
      const s = sektorler[Math.floor(Math.random() * sektorler.length)];
      const h = sehirler[Math.floor(Math.random() * sehirler.length)];
      const c = cekTipleri[Math.floor(Math.random() * cekTipleri.length)];
      const miktar = (Math.random() * 65 + 5).toFixed(1);

      // SENARYO 1: KARŞILIKSIZ ÇEK BOMBASI (KORKU)
      if (rand > 0.7) {
        setAlertType('CRITICAL');
        setAlertText(`FLAŞ: ${h} MERKEZLİ ${s} FİRMASININ ${miktar}M ₺'LİK ÇEKİ "ARKASI YAZILARAK" İADE EDİLDİ!`);
        setStatus({ label: "İADELER", val: "ARTISTA" });
      } 
      // SENARYO 2: ÇEK KANUNU & İLK KEZ ALACAKLAR (TEKNİK TOKAT)
      else if (rand > 0.4) {
        setAlertType('WARNING');
        const uyari = [
          "ÇEKİN ÖN YÜZÜNDE 'TACİR' VEYA 'TACİR OLMAYAN' İBARESİNE DİKKAT ET!",
          "İLK KEZ ÇEK ALIYORSAN: CİRO SİLSİLESİNDE İMZA EKSİKLİĞİ TÜM HAKKINI ÖLDÜRÜR!",
          "GEÇERSİZ ÇEK: DÜZENLEME TARİHİ VE YERİ EKSİK ÇEK, SADECE 'ADİ SENET' SAYILIR!",
          "KAREKODU OKUTULMAYAN ÇEKİ ASLA KABUL ETME; SAHTE ÇEK RİSKİ %60 ARTTI!",
          "BANKAYA İBRAZ SÜRESİ (10 GÜN) GEÇERSE ÇEK TAZMİNATI HAKKIN KAYBOLUR!"
        ];
        setAlertText(`KONTROL: ${uyari[Math.floor(Math.random() * uyari.length)]}`);
        setStatus({ label: "ÖNLEM", val: "ZORUNLU" });
      } 
      // SENARYO 3: PİYASA İSTİHBARATI (SÜKSE)
      else if (rand > 0.15) {
        setAlertType('DANGER');
        setAlertText(`UYARI: ${s} SEKTÖRÜNDE VADESİ GELMEMİŞ ${c} HAREKETLİLİĞİ ŞÜPHELİ DÜZEYDE.`);
        setStatus({ label: "RİSK", val: "YÜKSEK" });
      }
      // SENARYO 4: KONKORDATO & ÇEK ÖDEME YASAĞI
      else {
        setAlertType('CRITICAL');
        setAlertText(`MAHKEME: ${h} 2. ASLİYE TİCARET'TEN ${s} DEVİNE ÇEK ÖDEME YASAĞI GELDİ!`);
        setStatus({ label: "YASAK", val: "İHTİYATİ" });
      }
    };

    const interval = setInterval(generateIntelligence, 4800);
    generateIntelligence();
    return () => clearInterval(interval);
  }, []);

  const handleAction = () => { if (query.trim()) setActive(true); };

  return (
    <aside className="space-y-4 max-w-full lg:max-w-[380px] animate-in fade-in slide-in-from-right-10 duration-700">
      
      {/* 1. ANA ÇEK RADARI & FLAŞ HABER PANELİ */}
      <div className={`p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden transition-all duration-700 border ${
        alertType === 'CRITICAL' ? 'bg-red-700 border-red-400' : 
        alertType === 'DANGER' ? 'bg-[#450a0a] border-red-500' : 'bg-orange-600 border-orange-400'
      }`}>
        {/* Shimmer Efekti */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-white/10">
              {alertType === 'CRITICAL' ? <Ban size={12} className="text-white animate-pulse" /> : <Landmark size={12} className="text-white animate-bounce" />}
              <p className="text-[9px] font-black text-white tracking-[0.2em] uppercase italic leading-none">
                {alertType === 'CRITICAL' ? 'BANKA BLOKAJI' : 'ÇEK İSTİHBARAT'}
              </p>
            </div>
            <Timer size={14} className="text-white/40" />
          </div>
          
          <div className="min-h-[75px] flex items-center">
            <p className="text-[13px] font-black text-white uppercase italic leading-[1.4] tracking-tight drop-shadow-lg text-left">
              {alertText}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/10">
             <div>
                <p className="text-[7px] font-black text-white/50 uppercase leading-none mb-1">{status.label}</p>
                <p className="text-[11px] font-black text-yellow-400 italic uppercase leading-none">{status.val}</p>
             </div>
             <div className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-lg border border-white/5">
                <span className="w-1 h-1 bg-red-500 rounded-full animate-ping"></span>
                <span className="text-[8px] font-black text-white uppercase italic">LIVE DATA</span>
             </div>
          </div>
        </div>
        <TrendingUp className="absolute -right-4 -bottom-4 w-24 h-24 text-black/10 rotate-12" />
      </div>

      {/* 2. ÇEK & KONKORDATO SORGULAMA */}
      <div className="bg-[#0b1222] border border-white/5 rounded-[2.5rem] p-7 shadow-2xl relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Layers size={14} className="text-red-600" />
            <span className="text-[10px] font-black text-slate-500 uppercase italic tracking-[0.2em] leading-none">ÇEK & RİSK SORGULAMA</span>
          </div>
          <FileSignature size={14} className="text-slate-800" />
        </div>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(false); }}
            onKeyDown={(e) => e.key === 'Enter' && handleAction()}
            placeholder="FİRMA ÜNVANI / VKN..."
            className="flex-1 bg-black border border-white/10 rounded-2xl px-6 py-4 text-[12px] font-black text-white outline-none focus:border-red-600 uppercase italic transition-all placeholder:text-slate-800"
          />
          <button onClick={handleAction} className="bg-red-600 hover:bg-red-700 p-4 rounded-2xl transition-all active:scale-95 shadow-[0_0_20px_rgba(220,38,38,0.4)]">
            <Zap className="w-5 h-5 text-white fill-white" />
          </button>
        </div>

        {active && (
          <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-top-4">
            <button onClick={() => window.open(`https://www.ilan.gov.tr/arama?q=${query}+konkordato`, '_blank')} className="bg-white/5 border border-white/10 py-4 rounded-xl text-[9px] font-black text-white uppercase italic hover:bg-white/10 transition-all italic">KONKORDATO SORGULA</button>
            <button onClick={() => window.open(`https://www.google.com/search?q=${query}+karşılıksız+çek+haberi`, '_blank')} className="bg-white/5 border border-white/10 py-4 rounded-xl text-[9px] font-black text-white uppercase italic hover:bg-white/10 transition-all italic">İSTİHBARAT TARA</button>
          </div>
        )}
      </div>

      {/* 3. KRİTİK ÇEK VERİLERİ */}
      <div className="bg-[#0b1222] border border-white/5 rounded-[2.5rem] p-6 shadow-2xl">
        <p className="text-[9px] font-black text-slate-600 uppercase italic tracking-widest mb-4 leading-none">PİYASA ÇEK ENDEKSİ</p>
        <div className="space-y-3">
          {[
            { s: "İBRAZ SÜRESİNDEKİ ÇEKLER", r: "YÜKSEK", p: "92", c: "red" },
            { s: "KARŞILIKSIZ İŞLEM ORANI", r: "KRİTİK", p: "85", c: "red" },
            { s: "YENİ KONKORDATO TALEBİ", r: "RİSKLİ", p: "68", c: "orange" }
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-center bg-black/40 p-3.5 rounded-xl border border-white/[0.03]">
              <span className="text-[10px] font-black text-white/50 uppercase italic truncate w-32">{item.s}</span>
              <div className="text-right">
                <p className={`text-[8px] font-black italic ${item.c === 'red' ? 'text-red-600' : 'text-orange-500'}`}>{item.r}</p>
                <div className="w-16 h-1 bg-white/5 mt-1 rounded-full overflow-hidden">
                  <div className={`h-full ${item.c === 'red' ? 'bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]' : 'bg-orange-600'}`} style={{ width: `${item.p}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. MANTRA: TAHSİLAT VURGUSU */}
      <div className="p-8 bg-red-600/[0.02] border border-red-600/10 rounded-[3rem] text-center group hover:bg-red-600/[0.05] transition-all">
        <Fingerprint className="text-red-600/10 w-9 h-9 mx-auto mb-3 group-hover:scale-110 transition-transform duration-500" />
        <p className="text-[14px] font-black text-slate-400 uppercase tracking-tighter italic leading-tight">
          "SATIŞI HERKES YAPAR, <br/> ÖNEMLİ OLAN <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">TAHSİLATTIR.</span>"
        </p>
      </div>

    </aside>
  );
}