'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, Activity, Zap, CheckCircle2, ShieldAlert, FileText, Search, AlertCircle, Scale, Landmark, UserCheck, X
} from 'lucide-react';

export default function Page() {
  // --- STATE YÖNETİMİ ---
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  // --- FONKSİYONLAR ---
  const handleStartAnalysis = () => {
    if (!frontFile || !backFile) return;
    setLoading(true);
    setReport(false);
    setTimeout(() => {
      setLoading(false);
      setReport(true);
    }, 2000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("BİLDİRİM ALINDI: Veriler merkezi risk havuzuna iletildi.");
    setIsReportModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#060a14] text-slate-100 font-sans uppercase tracking-tighter overflow-x-hidden">
      
      {/* 1. LOADING OVERLAY */}
      {loading && (
        <div className="fixed inset-0 z-[999] bg-black/95 flex flex-col items-center justify-center">
          <Activity className="w-16 h-16 text-teal-500 animate-pulse mb-6" />
          <p className="text-2xl font-black italic tracking-[0.5em] text-teal-500">KATMANLAR TARANIYOR...</p>
        </div>
      )}

      {/* 2. KARŞILIKSIZ ÇEK BİLDİRİM MODAL (POP-UP) */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-[800] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-[#0f172a] border-2 border-red-600/30 rounded-[3rem] w-full max-w-2xl p-10 relative shadow-[0_0_100px_rgba(220,38,38,0.15)]">
            <button onClick={() => setIsReportModalOpen(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors cursor-pointer">
              <X className="w-6 h-6" />
            </button>
            <div className="mb-8 text-left border-b border-white/5 pb-4">
              <h2 className="text-4xl font-black italic text-red-500 tracking-tighter uppercase leading-none">KARA LİSTE BİLDİRİMİ</h2>
              <p className="text-[10px] font-black text-slate-500 mt-2 tracking-[0.3em] italic">ANLIK RİSK VERİ GİRİŞİ</p>
            </div>
            <form className="space-y-6 text-left" onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input required type="text" placeholder="KEŞİDECİ VKN/TCNO" className="w-full bg-black/40 border border-slate-800 rounded-2xl p-4 text-white focus:border-red-600 outline-none transition-all italic font-bold" />
                <input required type="text" placeholder="ÇEK SERİ NO" className="w-full bg-black/40 border border-slate-800 rounded-2xl p-4 text-white focus:border-red-600 outline-none transition-all italic font-bold" />
                <input required type="number" placeholder="TUTAR (TL)" className="w-full bg-black/40 border border-slate-800 rounded-2xl p-4 text-white focus:border-red-600 outline-none transition-all italic font-bold" />
                <input required type="text" placeholder="BANKA / ŞUBE" className="w-full bg-black/40 border border-slate-800 rounded-2xl p-4 text-white focus:border-red-600 outline-none transition-all italic font-bold" />
              </div>
              <textarea placeholder="DURUM NOTU (OPSİYONEL)" className="w-full bg-black/40 border border-slate-800 rounded-3xl p-6 text-white focus:border-red-600 outline-none h-24 transition-all italic font-bold resize-none"></textarea>
              <button type="submit" className="w-full py-6 bg-red-600 text-white rounded-[2rem] font-black text-lg italic tracking-widest hover:bg-red-700 transition-all active:scale-95 flex items-center justify-center gap-4 cursor-pointer">
                <ShieldAlert className="w-6 h-6" /> VERİTABANINA RAPORLA
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. HEADER */}
      <header className="max-w-7xl mx-auto py-10 px-6 flex justify-between items-center border-b border-white/5">
          <h1 className="text-5xl font-black italic tracking-tighter leading-none">ÇEK<span className="text-teal-500">APP</span></h1>
          <button 
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-3 px-8 py-4 bg-red-600/10 border-2 border-red-600/40 text-red-500 rounded-full font-black text-[12px] hover:bg-red-600 hover:text-white transition-all italic tracking-widest cursor-pointer active:scale-90 shadow-[0_0_20px_rgba(220,38,38,0.1)]"
          >
            <ShieldAlert className="w-5 h-5 animate-bounce" /> KARŞILIKSIZ ÇEK BİLDİR
          </button>
      </header>

      {/* 4. ANA İÇERİK */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 px-6 py-16">
        <section className="lg:col-span-2 space-y-12 text-center lg:text-left">
          
          {/* DOSYA YÜKLEME ALANI */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-[4rem] p-12 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <input type="file" ref={frontInputRef} className="hidden" onChange={(e) => setFrontFile(e.target.files?.[0] || null)} />
              <input type="file" ref={backInputRef} className="hidden" onChange={(e) => setBackFile(e.target.files?.[0] || null)} />
              
              <div onClick={() => frontInputRef.current?.click()} className={`h-72 rounded-[3.5rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all active:scale-95 ${frontFile ? 'border-teal-500 bg-teal-500/10' : 'border-slate-800 hover:border-teal-500/40'}`}>
                {frontFile ? <CheckCircle2 className="text-teal-500 w-16 h-16" /> : <Upload className="text-slate-700 w-12 h-12" />}
                <p className="mt-4 text-[11px] font-black text-slate-500 italic">EVRAK ÖN YÜZ</p>
              </div>

              <div onClick={() => backInputRef.current?.click()} className={`h-72 rounded-[3.5rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all active:scale-95 ${backFile ? 'border-teal-500 bg-teal-500/10' : 'border-slate-800 hover:border-teal-500/40'}`}>
                {backFile ? <CheckCircle2 className="text-teal-500 w-16 h-16" /> : <Upload className="text-slate-700 w-12 h-12" />}
                <p className="mt-4 text-[11px] font-black text-slate-500 italic">EVRAK ARKA YÜZ</p>
              </div>
            </div>

            <button 
              onClick={handleStartAnalysis}
              disabled={!frontFile || !backFile} 
              className={`w-full py-10 rounded-[3rem] font-black text-2xl italic tracking-[0.4em] transition-all flex items-center justify-center gap-6 shadow-2xl cursor-pointer active:scale-95 ${(!frontFile || !backFile) ? 'bg-slate-800 text-slate-600 opacity-20 cursor-not-allowed' : 'bg-white text-black hover:bg-teal-500'}`}
            >
              <Zap className="w-8 h-8" /> ANALİZİ BAŞLAT
            </button>
          </div>

          {/* ANALİZ SONUCU VE RİSK AYIRICI ÖZELLİKLER */}
          {report && (
            <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-700">
               <div className="bg-red-600/10 border-4 border-red-600/30 rounded-[4rem] p-12 flex items-center gap-12">
                  <div className="w-32 h-32 rounded-full border-[10px] border-red-600 flex items-center justify-center text-5xl font-black text-red-600 bg-black">14%</div>
                  <div>
                    <h3 className="text-5xl font-black italic text-red-500 leading-none tracking-tighter uppercase">KRİTİK RİSK</h3>
                    <p className="text-slate-200 font-black mt-4 italic tracking-widest text-sm uppercase leading-tight">İSİM-İMZA UYUMSUZLUĞU VE PİYASA RİSKİ TESPİT EDİLDİ.</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#0f172a] border border-white/5 p-8 rounded-[3rem] flex items-start gap-6 hover:border-red-500/30 transition-all group">
                    <UserCheck className="w-10 h-10 text-red-500 group-hover:scale-110 transition-transform" />
                    <div>
                      <h4 className="text-[12px] font-black text-white italic mb-2 uppercase tracking-widest">İMZA DOĞRULAMA</h4>
                      <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase italic">İmza örneği sistemdeki verilerle %40 uyumsuz. Taklit riski yüksek.</p>
                    </div>
                  </div>
                  <div className="bg-[#0f172a] border border-white/5 p-8 rounded-[3rem] flex items-start gap-6 hover:border-teal-500/30 transition-all group">
                    <Landmark className="w-10 h-10 text-teal-500 group-hover:scale-110 transition-transform" />
                    <div>
                      <h4 className="text-[12px] font-black text-white italic mb-2 uppercase tracking-widest">BANKA LİMİTİ</h4>
                      <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase italic">Şubedeki kredi limiti ve çek ödeme performansı negatif seyirde.</p>
                    </div>
                  </div>
                  <div className="bg-[#0f172a] border border-white/5 p-8 rounded-[3rem] flex items-start gap-6 hover:border-red-500/30 transition-all group">
                    <Scale className="w-10 h-10 text-red-500 group-hover:scale-110 transition-transform" />
                    <div>
                      <h4 className="text-[12px] font-black text-white italic mb-2 uppercase tracking-widest">HUKUKİ GEÇMİŞ</h4>
                      <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase italic">Keşideci hakkında son dönemde 2 adet aktif icra takibi saptandı.</p>
                    </div>
                  </div>
                  <div className="bg-[#0f172a] border border-white/5 p-8 rounded-[3rem] flex items-start gap-6 hover:border-teal-500/30 transition-all group">
                    <AlertCircle className="w-10 h-10 text-teal-500 group-hover:scale-110 transition-transform" />
                    <div>
                      <h4 className="text-[12px] font-black text-white italic mb-2 uppercase tracking-widest">CİRO ZİNCİRİ</h4>
                      <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase italic">Ciro silsilesi şeklen uygundur ancak hamil riski araştırılmalıdır.</p>
                    </div>
                  </div>
               </div>
            </div>
          )}
        </section>

        {/* SAĞ TARAF (ASIDE) */}
        <aside className="space-y-10">
           <div className="p-10 bg-[#0f172a] border border-slate-800 rounded-[3.5rem] shadow-xl text-left">
              <h4 className="text-[11px] font-black text-slate-500 mb-8 uppercase italic tracking-widest border-b border-white/5 pb-4 text-center">İSTİHBARAT ARAÇLARI</h4>
              <div className="space-y-6">
                 <button className="w-full flex items-center justify-between p-5 bg-black/40 rounded-3xl border border-white/5 hover:border-teal-500 transition-all cursor-pointer group">
                    <span className="text-[10px] font-black italic text-slate-300 uppercase">TC/VKN SORGULA</span>
                    <Search className="w-5 h-5 text-teal-500 group-hover:scale-125 transition-transform" />
                 </button>
                 <button className="w-full flex items-center justify-between p-5 bg-black/40 rounded-3xl border border-white/5 hover:border-teal-500 transition-all cursor-pointer group">
                    <span className="text-[10px] font-black italic text-slate-300 uppercase">GEÇMİŞ TARAMALAR</span>
                    <FileText className="w-5 h-5 text-teal-500 group-hover:scale-125 transition-transform" />
                 </button>
              </div>
           </div>

           <div className="p-12 bg-teal-500/5 border-2 border-teal-500/10 rounded-[4rem] text-center italic shadow-inner">
              <p className="text-[20px] font-black text-teal-400 uppercase leading-none tracking-tighter">
                "SATIŞI HERKES YAPAR, ÖNEMLİ OLAN <br/> <span className="text-white">OPERASYONDUR.</span>"
              </p>
           </div>
        </aside>
      </main>
    </div>
  );
}