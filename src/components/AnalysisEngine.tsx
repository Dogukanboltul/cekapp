'use client';

import React, { useState, useRef } from 'react';
import { Upload, CheckCircle2, Zap, UserCheck, Landmark, Scale, AlertCircle, Activity } from 'lucide-react';

const AnalysisEngine = () => {
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<boolean>(false);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const handleStartAnalysis = () => {
    if (!frontFile || !backFile) return;
    setLoading(true);
    setReport(false);
    // Operasyonel Simülasyon: 2 saniye analiz süresi
    setTimeout(() => { 
      setLoading(false); 
      setReport(true); 
    }, 2000);
  };

  return (
    <div className="space-y-12">
      {/* YÜKLEME ALANI */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-[4rem] p-12 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 text-center">
          <input type="file" ref={frontInputRef} className="hidden" onChange={(e) => setFrontFile(e.target.files?.[0] || null)} />
          <input type="file" ref={backInputRef} className="hidden" onChange={(e) => setBackFile(e.target.files?.[0] || null)} />
          
          <div onClick={() => frontInputRef.current?.click()} className={`h-72 rounded-[3.5rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all active:scale-95 ${frontFile ? 'border-teal-500 bg-teal-500/10' : 'border-slate-800 hover:border-teal-500/40'}`}>
            {frontFile ? <CheckCircle2 className="text-teal-500 w-16 h-16" /> : <Upload className="text-slate-700 w-12 h-12" />}
            <p className="mt-4 text-[11px] font-black text-slate-500 italic uppercase">EVRAK ÖN YÜZ</p>
          </div>

          <div onClick={() => backInputRef.current?.click()} className={`h-72 rounded-[3.5rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all active:scale-95 ${backFile ? 'border-teal-500 bg-teal-500/10' : 'border-slate-800 hover:border-teal-500/40'}`}>
            {backFile ? <CheckCircle2 className="text-teal-500 w-16 h-16" /> : <Upload className="text-slate-700 w-12 h-12" />}
            <p className="mt-4 text-[11px] font-black text-slate-500 italic uppercase">EVRAK ARKA YÜZ</p>
          </div>
        </div>

        <button 
          onClick={handleStartAnalysis}
          disabled={!frontFile || !backFile || loading} 
          className={`w-full py-10 rounded-[3rem] font-black text-2xl italic tracking-[0.4em] transition-all flex items-center justify-center gap-6 shadow-2xl ${(!frontFile || !backFile) ? 'bg-slate-800 text-slate-600 opacity-20 cursor-not-allowed' : 'bg-white text-black hover:bg-teal-500'}`}
        >
          {loading ? <Activity className="animate-spin" /> : <Zap className="w-8 h-8" />}
          {loading ? 'ANALİZ EDİLİYOR...' : 'ANALİZİ BAŞLAT'}
        </button>
      </div>

      {/* ANALİZ SONUCU (REPORT) */}
      {report && (
        <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-700 text-left">
           <div className="bg-red-600/10 border-4 border-red-600/30 rounded-[4rem] p-12 flex items-center gap-12 shadow-[0_0_60px_rgba(220,38,38,0.15)]">
              <div className="w-32 h-32 rounded-full border-[10px] border-red-600 flex items-center justify-center text-5xl font-black text-red-600 bg-black italic leading-none">14%</div>
              <div className="text-left">
                <h3 className="text-5xl font-black italic text-red-500 leading-none tracking-tighter uppercase">KRİTİK RİSK</h3>
                <p className="text-slate-200 font-black mt-4 italic tracking-widest text-sm uppercase">SİSTEMSEL ANALİZ: VERİ VE İMZA UYUMSUZ.</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: UserCheck, title: "İMZA KONTROLÜ", desc: "İMZA ÖRNEĞİ VERİTABANIYLA %40 UYUMSUZ." },
                { icon: Landmark, title: "BANKA PERFORMANSI", desc: "KEŞİDECİ ÖDEME SKORU SON DÖNEMDE DÜŞÜK." },
                { icon: Scale, title: "HUKUKİ DURUM", desc: "AKTİF 2 ADET İCRA TAKİBİ BULUNMAKTADIR." },
                { icon: AlertCircle, title: "RİSK SKORU", desc: "CİRO ZİNCİRİNDE TİCARİ BOŞLUKLAR VAR." }
              ].map((item, idx) => (
                <div key={idx} className="bg-[#0f172a] border border-white/5 p-8 rounded-[3rem] flex items-start gap-6 group hover:border-teal-500 transition-all">
                  <item.icon className="w-10 h-10 text-teal-500 shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <h4 className="text-[12px] font-black text-white italic mb-2 uppercase tracking-widest">{item.title}</h4>
                    <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase italic">{item.desc}</p>
                  </div>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisEngine;