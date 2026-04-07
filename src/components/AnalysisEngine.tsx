'use client';

import React, { useState, useRef } from 'react';
import { Upload, CheckCircle2, Zap, Activity, Search, AlertTriangle, Loader2 } from 'lucide-react';

interface AnalysisEngineProps {
  onValidationError: (msg: string) => void;
  onBeforeUpload: (files: File[]) => Promise<boolean>;
  radarStatus: 'IDLE' | 'STABLE' | 'CRITICAL'; // 🛡️ Dashboard'dan gelen güvenlik durumu
}

const AnalysisEngine = ({ onValidationError, onBeforeUpload, radarStatus }: AnalysisEngineProps) => {
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [localChecking, setLocalChecking] = useState(false);
  const [status, setStatus] = useState('');
  const [report, setReport] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelection = (type: 'front' | 'back', file: File | null) => {
    if (!file) return;
    onValidationError(""); 
    if (type === 'front') setFrontFile(file);
    else setBackFile(file);
  };

  const handleStartAnalysis = async () => {
    // 🛡️ GÜVENLİK KONTROLÜ: Radar temiz değilse analiz başlatılamaz
    if (radarStatus !== 'STABLE') {
      onValidationError("LÜTFEN ÖNCE RİSK RADAR ÜZERİNDEN FİRMA SORGULAYIN.");
      return;
    }

    if (!frontFile || !backFile) return;
    
    setLoading(true);
    setReport(null);
    setErrorMsg(null);
    onValidationError("");

    try {
      // 🕵️ 1. KATMAN: LOKAL OCR (Tesseract)
      setLocalChecking(true);
      setStatus("LOKAL TARAMA: EVRAK İÇERİĞİ KONTROL EDİLİYOR...");
      
      const isLocalValid = await onBeforeUpload([frontFile, backFile]);
      
      if (!isLocalValid) {
        setLoading(false);
        setLocalChecking(false);
        return; 
      }

      setLocalChecking(false);

      // 🧠 2. KATMAN: AI ANALİZİ (Gemini API)
      const formData = new FormData();
      formData.append('front_image', frontFile);
      formData.append('back_image', backFile);

      setStatus("AI ÜNİTESİ: TİCARİ RİSK ANALİZİ YAPILIYOR...");

      const response = await fetch('/api/analyze-evrak', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.isValid === false) {
        onValidationError(data.error || "Geçersiz evrak formatı.");
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Analiz motoru yanıt vermedi.');
      }
      
      setReport(data);

    } catch (error: any) {
      console.error("Analiz Hatası:", error);
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
      setStatus("");
      setLocalChecking(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return { border: 'border-teal-500', text: 'text-teal-500', bg: 'bg-teal-500/10' };
    if (score >= 45) return { border: 'border-orange-500', text: 'text-orange-500', bg: 'bg-orange-500/10' };
    return { border: 'border-red-600', text: 'text-red-600', bg: 'bg-red-600/10' };
  };

  const colors = report ? getScoreColor(report.score) : null;

  return (
    <div className="space-y-4 md:space-y-8 w-full">
      <div className="px-4 md:px-2 text-center lg:text-left space-y-1">
        <h2 className="text-lg md:text-2xl font-black italic text-white tracking-tight leading-snug uppercase">
          SANİYELER İÇİNDE <span className="text-teal-500">İSTİHBARAT:</span> <br className="md:hidden" />
          EVRAKINIZI YÜKLEYİN, ANALİZİ BAŞLATIN.
        </h2>
        <p className="text-[7px] md:text-[9px] font-bold text-slate-500 italic tracking-[0.15em] uppercase opacity-80">
          * TAM TARAMA VE CİRO SİLSİLESİ KONTROLÜ İÇİN ÖN-ARKA GÖRSEL YÜKLEYİN.
        </p>
      </div>

      <div className="bg-[#0f172a] border border-white/5 rounded-[1.5rem] md:rounded-[3rem] p-3 md:p-10 shadow-2xl relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 z-30 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
            <div className="relative mb-6">
              {localChecking ? (
                <Loader2 className="w-16 h-16 text-teal-500 animate-spin" />
              ) : (
                <>
                  <Activity className="w-16 h-16 text-teal-500 animate-spin" />
                  <Search className="w-6 h-6 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </>
              )}
            </div>
            <p className="text-teal-500 font-black italic tracking-[0.2em] text-[10px] animate-pulse mb-1 uppercase">{status}</p>
            <p className="text-slate-500 text-[7px] uppercase font-bold tracking-widest italic opacity-50">CekApp AI Protocol Active</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 md:gap-6 mb-4 md:mb-8 text-center">
          <input type="file" accept="image/*" ref={frontInputRef} className="hidden" 
            onChange={(e) => handleFileSelection('front', e.target.files?.[0] || null)} 
          />
          <input type="file" accept="image/*" ref={backInputRef} className="hidden" 
            onChange={(e) => handleFileSelection('back', e.target.files?.[0] || null)} 
          />
          
          <div onClick={() => frontInputRef.current?.click()} className={`h-28 md:h-60 rounded-xl md:rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all active:scale-95 ${frontFile ? 'border-teal-500 bg-teal-500/10' : 'border-white/5 hover:border-teal-500/40'}`}>
            {frontFile ? <CheckCircle2 className="text-teal-500 w-6 h-6 md:w-12 md:h-12" /> : <Upload className="text-slate-700 w-5 h-5 md:w-10 md:h-10 opacity-30" />}
            <p className="mt-2 text-[7px] md:text-[10px] font-black text-slate-500 italic uppercase">ÖN YÜZ</p>
          </div>

          <div onClick={() => backInputRef.current?.click()} className={`h-28 md:h-60 rounded-xl md:rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all active:scale-95 ${backFile ? 'border-teal-500 bg-teal-500/10' : 'border-white/5 hover:border-teal-500/40'}`}>
            {backFile ? <CheckCircle2 className="text-teal-500 w-6 h-6 md:w-12 md:h-12" /> : <Upload className="text-slate-700 w-5 h-5 md:w-10 md:h-10 opacity-30" />}
            <p className="mt-2 text-[7px] md:text-[10px] font-black text-slate-500 italic uppercase">ARKA YÜZ</p>
          </div>
        </div>

        <button 
          onClick={handleStartAnalysis}
          disabled={!frontFile || !backFile || loading || radarStatus !== 'STABLE'} 
          className={`w-full py-4 md:py-8 rounded-xl md:rounded-[2rem] font-black text-xs md:text-xl italic tracking-widest md:tracking-[0.3em] transition-all flex items-center justify-center gap-3 md:gap-4 shadow-2xl ${(!frontFile || !backFile || radarStatus !== 'STABLE') ? 'bg-slate-800 text-slate-600 opacity-20 cursor-not-allowed' : 'bg-white text-black hover:bg-teal-500 hover:scale-[1.01]'}`}
        >
          <Zap className="w-4 h-4 md:w-6 md:h-6" /> HEMEN SORGULA
        </button>
      </div>

      {errorMsg && (
        <div className="bg-red-950/30 border border-red-500/50 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in zoom-in-95">
          <AlertTriangle className="text-red-500 w-5 h-5 shrink-0" />
          <p className="text-red-200 text-[10px] md:text-xs font-bold uppercase tracking-wider leading-relaxed">
            Sistem Hatası: {errorMsg}
          </p>
        </div>
      )}

      {report && colors && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className={`${colors.bg} border-2 ${colors.border} rounded-[1.5rem] md:rounded-[3rem] p-5 md:p-10 shadow-2xl`}>
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10">
                <div className={`w-20 h-20 md:w-28 md:h-28 shrink-0 rounded-full border-4 md:border-[8px] ${colors.border} flex items-center justify-center text-2xl md:text-4xl font-black ${colors.text} bg-black italic shadow-inner`}>{report.score}%</div>
                <div className="text-center md:text-left">
                  <h3 className={`text-2xl md:text-4xl font-black italic ${colors.text} uppercase leading-none`}>{report.status}</h3>
                  <div className={`mt-4 p-4 bg-black/60 border-l-4 ${colors.border} rounded-r-xl`}>
                    <p className="text-slate-200 font-bold italic text-[9px] md:text-xs leading-relaxed tracking-wide">
                      <span className="text-teal-500 mr-2">● AI ANALİZİ:</span>
                      {report.aiComment}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 uppercase italic font-black text-[10px] md:text-sm">
              <div className="bg-[#0f172a] p-4 md:p-6 rounded-2xl border border-white/5 text-center group hover:border-teal-500/20 transition-all">
                <p className="text-slate-500 text-[8px] md:text-[10px] mb-1 opacity-60">OKUNAN VADE</p>
                <p className="text-white tracking-widest">{report.extraction.vade}</p>
              </div>
              <div className="bg-[#0f172a] p-4 md:p-6 rounded-2xl border border-white/5 text-center group hover:border-teal-500/20 transition-all">
                <p className="text-slate-500 text-[8px] md:text-[10px] mb-1 opacity-60">OKUNAN TUTAR</p>
                <p className="text-teal-500 tracking-widest">{report.extraction.tutar}</p>
              </div>
              <div className="bg-[#0f172a] p-4 md:p-6 rounded-2xl border border-white/5 text-center group hover:border-teal-500/20 transition-all">
                <p className="text-slate-500 text-[8px] md:text-[10px] mb-1 opacity-60">KEŞİDECİ VKN</p>
                <p className="text-white tracking-widest">{report.extraction.vkn}</p>
              </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisEngine;