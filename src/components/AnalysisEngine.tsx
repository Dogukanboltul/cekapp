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
    setTimeout(() => { 
      setLoading(false); 
      setReport(true); 
    }, 2000);
  };

  return (
    <div className="space-y-4 md:space-y-12 w-full">
      {/* YÜKLEME ALANI */}
      <div className="bg-[#0f172a] border border-white/5 rounded-[1.5rem] md:rounded-[4rem] p-3 md:p-12 shadow-2xl">
        
        {/* MOBİLDE YAN YANA (grid-cols-2), MASAÜSTÜNDE YAN YANA (md:grid-cols-2) */}
        <div className="grid grid-cols-2 gap-3 md:gap-8 mb-4 md:mb-10 text-center">
          <input type="file" ref={frontInputRef} className="hidden" onChange={(e) => setFrontFile(e.target.files?.[0] || null)} />
          <input type="file" ref={backInputRef} className="hidden" onChange={(e) => setBackFile(e.target.files?.[0] || null)} />
          
          {/* ÖN YÜZ - Mobilde h-32 (kompakt), Masaüstünde h-72 */}
          <div 
            onClick={() => frontInputRef.current?.click()} 
            className={`h-32 md:h-72 rounded-2xl md:rounded-[3.5rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all active:scale-95 ${frontFile ? 'border-teal-500 bg-teal-500/10' : 'border-white/5 hover:border-teal-500/40'}`}
          >
            {frontFile ? <CheckCircle2 className="text-teal-500 w-8 h-8 md:w-16 md:h-16" /> : <Upload className="text-slate-700 w-6 h-6 md:w-12 md:h-12" />}
            <p className="mt-2 text-[8px] md:text-[11px] font-black text-slate-500 italic uppercase">ÖN YÜZ</p>
          </div>

          {/* ARKA YÜZ */}
          <div 
            onClick={() => backInputRef.current?.click()} 
            className={`h-32 md:h-72 rounded-2xl md:rounded-[3.5rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all active:scale-95 ${backFile ? 'border-teal-500 bg-teal-500/10' : 'border-white/5 hover:border-teal-500/40'}`}
          >
            {backFile ? <CheckCircle2 className="text-teal-500 w-8 h-8 md:w-16 md:h-16" /> : <Upload className="text-slate-700 w-6 h-6 md:w-12 md:h-12" />}
            <p className="mt-2 text-[8px] md:text-[11px] font-black text-slate-500 italic uppercase">ARKA YÜZ</p>
          </div>
        </div>

        {/* ANALİZ BUTONU - Mobilde daha ince, tam ekran genişliği */}
        <button 
          onClick={handleStartAnalysis}
          disabled={!frontFile || !backFile || loading} 
          className={`w-full py-4 md:py-10 rounded-xl md:rounded-[3rem] font-black text-xs md:text-2xl italic tracking-widest md:tracking-[0.4em] transition-all flex items-center justify-center gap-3 md:gap-6 shadow-2xl ${(!frontFile || !backFile) ? 'bg-slate-800 text-slate-600 opacity-20 cursor-not-allowed' : 'bg-white text-black hover:bg-teal-500'}`}
        >
          {loading ? <Activity className="animate-spin w-4 h-4 md:w-8 md:h-8" /> : <Zap className="w-4 h-4 md:w-8 md:h-8" />}
          {loading ? 'ANALİZ EDİLİYOR...' : 'ANALİZİ BAŞLAT'}
        </button>
      </div>

      {/* ANALİZ SONUCU (REPORT) */}
      {report && (
        <div className="space-y-4 md:space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700 text-left">
           {/* SKOR KARTI - Mobilde kompakt */}
           <div className="bg-red-600/10 border-2 border-red-600/30 rounded-2xl md:rounded-[4rem] p-4 md:p-12 flex items-center gap-4 md:gap-12 shadow-lg">
              <div className="w-12 h-12 md:w-32 md:h-32 shrink-0 rounded-full border-4 md:border-[10px] border-red-600 flex items-center justify-center text-lg md:text-5xl font-black text-red-600 bg-black italic leading-none">14%</div>
              <div className="min-w-0">
                <h3 className="text-xl md:text-5xl font-black italic text-red-500 leading-none tracking-tighter uppercase truncate">KRİTİK RİSK</h3>
                <p className="text-slate-400 font-black mt-1 md:mt-4 italic tracking-widest text-[7px] md:text-sm uppercase">VERİ VE İMZA UYUMSUZ.</p>
              </div>
           </div>

           {/* DETAY KARTLARI - Mobilde 2x2 düzeni */}
           <div className="grid grid-cols-2 gap-3 md:gap-6">
              {[
                { icon: UserCheck, title: "İMZA", desc: "UYUMSUZ" },
                { icon: Landmark, title: "BANKA", desc: "DÜŞÜK SKOR" },
                { icon: Scale, title: "HUKUK", desc: "2 İCRA" },
                { icon: AlertCircle, title: "SKOR", desc: "RİSKLİ" }
              ].map((item, idx) => (
                <div key={idx} className="bg-[#0f172a] border border-white/5 p-3 md:p-8 rounded-xl md:rounded-[3rem] flex flex-col items-center md:items-start text-center md:text-left gap-2 md:gap-6">
                  <item.icon className="w-5 h-5 md:w-10 md:h-10 text-teal-500 shrink-0" />
                  <div className="min-w-0">
                    <h4 className="text-[8px] md:text-[12px] font-black text-white italic mb-0.5 uppercase tracking-widest">{item.title}</h4>
                    <p className="text-[7px] md:text-[10px] text-slate-500 font-bold uppercase italic truncate">{item.desc}</p>
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