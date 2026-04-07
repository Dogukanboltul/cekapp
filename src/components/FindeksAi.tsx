'use client';

import React, { useState, useRef } from "react";
import { 
  Cpu, 
  Zap,
  UploadCloud,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface FindeksAIProps {
  firmName?: string;
  isAnalyzed?: boolean;
}

export default function FindeksAI({ firmName, isAnalyzed = false }: FindeksAIProps) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'completed' | 'error'>('idle');
  const [aiResponse, setAiResponse] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf" || selectedFile.type.startsWith("image/")) {
        setFile(selectedFile);
        startAnalysis(selectedFile);
      } else {
        alert("Lütfen sadece PDF veya Görsel yükleyiniz.");
      }
    }
  };

  const startAnalysis = async (selectedFile: File) => {
    setStatus('uploading');
    try {
      setStatus('analyzing');
      // YAPAY ZEKA ANALİZ SİMÜLASYONU
      setTimeout(() => {
        setAiResponse("Firma likidite yapısı güçlü. Kredi skoru 1750+ öngörüldü. Çek ödeme performansı kusursuz.");
        setStatus('completed');
      }, 3000);
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    /* w-full ve mx-0 ile grid hücresine tam yayılmasını sağladık */
    <div className="animate-in slide-in-from-right duration-700 w-full text-left">
      <div className="bg-transparent p-4 relative overflow-hidden group">
        
        <div className="relative z-10 space-y-6">
          {/* Header - Boyutlar MarketRadar ile optimize edildi */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                <Cpu className={`w-4 h-4 text-cyan-500 ${status === 'analyzing' ? 'animate-spin' : ''}`} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-white uppercase italic tracking-widest leading-none">
                  FINDEKS ANALİZÖR
                </span>
                <span className="text-[7px] font-bold text-cyan-500/50 uppercase italic mt-1">AI GÜÇLÜ TARAMA</span>
              </div>
            </div>
            {status === 'completed' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Zap size={16} className="text-cyan-500 animate-pulse" />}
          </div>

          <div className="min-h-[180px] flex flex-col justify-center">
            {status === 'idle' && (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/5 hover:border-cyan-500/50 rounded-[2rem] p-8 transition-all cursor-pointer bg-black/20 flex flex-col items-center gap-4 text-center group/drop"
              >
                <div className="p-4 bg-cyan-500/5 rounded-full group-hover/drop:scale-110 transition-transform duration-500">
                  <UploadCloud className="w-10 h-10 text-cyan-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-black text-white uppercase italic tracking-tighter">RAPORU BURAYA BIRAK</p>
                  <p className="text-[8px] text-slate-500 font-bold uppercase leading-tight italic">PDF, PNG VEYA JPEG</p>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,image/*" />
              </div>
            )}

            {(status === 'uploading' || status === 'analyzing') && (
              <div className="flex flex-col items-center gap-6 py-8 text-center bg-black/10 rounded-[2rem] border border-white/5">
                <div className="relative">
                   <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
                   <Zap size={14} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-500" />
                </div>
                <p className="text-[10px] font-black text-white uppercase italic tracking-widest animate-pulse">
                   {status === 'uploading' ? 'VERİ OKUNUYOR...' : 'AI KATMANLARI TARANIYOR...'}
                </p>
              </div>
            )}

            {status === 'completed' && (
              <div className="space-y-4 animate-in fade-in zoom-in">
                <div className="bg-black/40 border border-teal-500/20 p-4 rounded-2xl backdrop-blur-md">
                   <p className="text-[10px] text-slate-200 font-medium italic leading-relaxed text-left border-l-2 border-cyan-500 pl-3">
                     "{aiResponse}"
                   </p>
                </div>
                <button 
                  onClick={() => setStatus('idle')} 
                  className="w-full py-3 bg-cyan-500/10 hover:bg-cyan-500 text-cyan-500 hover:text-black border border-cyan-500/20 rounded-xl text-[9px] font-black uppercase italic transition-all flex items-center justify-center gap-2"
                >
                  <UploadCloud size={12} /> YENİ DOSYA ANALİZ ET
                </button>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center space-y-4 py-8 bg-red-500/5 rounded-[2rem] border border-red-500/10">
                <AlertCircle className="w-10 h-10 text-red-500 mx-auto animate-bounce" />
                <p className="text-[10px] font-bold text-red-400 uppercase italic">OKUMA HATASI OLUŞTU</p>
                <button onClick={() => setStatus('idle')} className="text-[9px] underline text-slate-500 uppercase font-black italic hover:text-white transition-colors">TEKRAR DENE</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}