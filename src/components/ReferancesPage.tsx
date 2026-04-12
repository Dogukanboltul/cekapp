'use client';

import React, { useState } from 'react';
import { ShieldCheck, Zap, Star, Building2, Quote, ExternalLink, Search, UserPlus, Send, BellRing } from 'lucide-react';

// 📊 MEVCUT REFERANS VERİLERİ (Bozulmadı)
const productionReferences = [
  { id: 1, companyName: "Global Lojistik Çözümleri A.Ş.", sector: "Uluslararası Taşımacılık & Depolama", logoText: "GL", color: "from-teal-600 to-emerald-500", comment: "ÇekApp'in Saha Zekası özelliği, vadeli satışlarımızdaki risk analiz süresini %70 azalttı. Artık şüpheli çekleri anında tespit edebiliyoruz.", activeSince: "2023", verified: true },
  { id: 2, companyName: "TeknoMarket Perakende Grubu", sector: "E-Ticaret & Elektronik", logoText: "TM", color: "from-blue-600 to-indigo-500", comment: "Findeks verilerini saha zekasıyla harmanlaması muazzam. Özellikle konkordato riski taşıyan firmaları önceden uyarması sermayemizi korudu.", activeSince: "2024", verified: true },
  { id: 3, companyName: "Mega İnşaat & Taahhüt", sector: "İnşaat Malzemeleri & Tedarik", logoText: "Mİ", color: "from-amber-600 to-orange-500", comment: "Yüksek tutarlı çeklerde şahsi kefalet gerekliliğini yasal dayanaklarıyla (TBK m.583) göstermesi, tahsilat güvenliğimiz için devrim niteliğinde.", activeSince: "2023", verified: true },
];

export default function ReferencesPage() {
  const [targetCompany, setTargetCompany] = useState('');
  const [checkResult, setCheckResult] = useState<'IDLE' | 'MEMBER' | 'NOT_MEMBER'>('IDLE');

  // 🔍 Üyelik Sorgulama Mantığı
  const handleCheck = () => {
    if (!targetCompany) return;
    // Simülasyon: İsmi büyük harf olanları üye sayalım (Gerçekte DB sorgusu gelecek)
    const isMember = targetCompany.includes('A.Ş') || targetCompany.length % 2 === 0;
    setCheckResult(isMember ? 'MEMBER' : 'NOT_MEMBER');
  };

  return (
    <div className="p-10 animate-in fade-in duration-700 bg-[#060a14] min-h-screen">
      
      {/* 🚀 SAYFA BAŞLIĞI */}
      <div className="mb-12 flex items-center justify-between pb-6 border-b border-white/5">
        <div>
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
            GÜVEN<span className="text-teal-500">İM</span> AĞIMIZ
          </h2>
          <p className="text-slate-500 font-bold text-[11px] uppercase tracking-[0.2em] mt-3 flex items-center gap-2">
            <Zap size={14} className="text-teal-500" /> Saha Zekası ve Ticari Güven İçin Bizi Seçen Seçkin Partnerlerimiz
          </p>
        </div>
      </div>

      {/* 🛠️ YENİ: REFERANS EKLEME & SORGULAMA ALANI */}
      <div className="mb-16 max-w-4xl mx-auto">
        <div className="bg-[#0f172a] border border-white/10 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <Building2 size={120} />
            </div>
            
            <div className="relative z-10">
                <h3 className="text-xl font-black text-white italic uppercase mb-6 flex items-center gap-3">
                    <Search className="text-teal-500" /> YENİ REFERANS TALEBİ
                </h3>
                
                <div className="flex flex-col md:flex-row gap-4">
                    <input 
                        type="text"
                        value={targetCompany}
                        onChange={(e) => setTargetCompany(e.target.value)}
                        placeholder="FİRMA ADI VEYA VERGİ NO..."
                        className="flex-1 bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white font-black italic uppercase placeholder:text-slate-700 focus:border-teal-500 outline-none transition-all"
                    />
                    <button 
                        onClick={handleCheck}
                        className="bg-teal-500 text-black px-10 py-4 rounded-2xl font-black italic uppercase hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(20,184,166,0.3)]"
                    >
                        SORGULA
                    </button>
                </div>

                {/* 🔴 DURUM: ÜYE DEĞİL (DAVET) */}
                {checkResult === 'NOT_MEMBER' && (
                    <div className="mt-8 p-6 rounded-3xl bg-amber-500/5 border border-amber-500/20 animate-in slide-in-from-top-4 duration-500">
                        <div className="flex gap-4">
                            <div className="p-3 bg-amber-500/20 rounded-2xl text-amber-500 h-fit">
                                <UserPlus size={24} />
                            </div>
                            <div>
                                <h4 className="text-amber-500 font-black italic uppercase text-sm">ÜYELİK BULUNAMADI!</h4>
                                <p className="text-slate-400 text-[11px] font-bold uppercase mt-1">Bu firma ÇekApp üyesi değildir. Lütfen önce davet ediniz.</p>
                                <button className="mt-4 flex items-center gap-2 bg-amber-500 text-black px-6 py-2 rounded-xl text-[10px] font-black uppercase italic hover:bg-amber-400 transition-all">
                                    DAVET MESAJI GÖNDER <Send size={12} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 🟢 DURUM: ÜYE (BİLDİRİM) */}
                {checkResult === 'MEMBER' && (
                    <div className="mt-8 p-6 rounded-3xl bg-teal-500/5 border border-teal-500/20 animate-in slide-in-from-top-4 duration-500">
                        <div className="flex gap-4">
                            <div className="p-3 bg-teal-500/20 rounded-2xl text-teal-500 h-fit">
                                <BellRing size={24} className="animate-pulse" />
                            </div>
                            <div>
                                <h4 className="text-teal-500 font-black italic uppercase text-sm">FİRMA ÇEKAPP ÜYESİ!</h4>
                                <p className="text-slate-400 text-[11px] font-bold uppercase mt-1">Bu firmaya yeni bir referans talebi bildirimi gönderilecek.</p>
                                <button className="mt-4 bg-teal-500 text-black px-6 py-2 rounded-xl text-[10px] font-black uppercase italic hover:shadow-[0_0_15px_rgba(20,184,166,0.4)] transition-all">
                                    REFERANS TALEBİ GÖNDER
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* 📂 REFERANS KARTLARI IZGARASI (Bozulmadı) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {productionReferences.map((ref) => (
          <div key={ref.id} className="bg-[#0f172a] border border-white/5 p-7 rounded-[2.5rem] flex flex-col hover:border-teal-500/20 transition-all duration-300 group hover:bg-gradient-to-br hover:from-[#0f172a] hover:to-[#111c33] active:scale-98 shadow-xl">
            <div className="flex justify-between items-start mb-6">
              <div className={`w-16 h-16 rounded-3xl flex items-center justify-center bg-gradient-to-br ${ref.color} shadow-lg border border-white/10 shrink-0`}>
                <span className="text-black font-black text-2xl italic uppercase tracking-tighter">{ref.logoText}</span>
              </div>
              {ref.verified && (
                <div className="flex items-center gap-1.5 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
                  <ShieldCheck size={12} className="text-teal-500" />
                  <span className="text-teal-500 text-[9px] font-black uppercase tracking-wider">Doğrulandı</span>
                </div>
              )}
            </div>
            <h4 className="text-white font-black uppercase italic tracking-tight text-xl mb-1 truncate group-hover:text-teal-500 transition-colors">{ref.companyName}</h4>
            <div className="flex items-center gap-2 mb-6 text-slate-500 text-[10px] font-black uppercase tracking-widest truncate">
              <Building2 size={12} /> {ref.sector}
            </div>
            <div className="relative flex-1 mb-6">
              <Quote size={20} className="text-teal-500/20 absolute -left-1 -top-2 rotate-12" />
              <p className="text-slate-300 text-[13px] font-medium leading-relaxed italic relative pl-4 border-l border-white/5 group-hover:border-teal-500/20 transition-all">"{ref.comment}"</p>
            </div>
            <div className="pt-5 border-t border-white/5 flex justify-between items-center mt-auto">
              <p className="text-slate-600 text-[9px] font-bold uppercase tracking-wider">Aktif Partner • {ref.activeSince}'den Beri</p>
              <button className="flex items-center gap-1.5 text-[9px] font-black text-white/30 group-hover:text-teal-500 transition-colors uppercase italic"><ExternalLink size={12} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}