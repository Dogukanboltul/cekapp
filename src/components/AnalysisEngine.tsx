'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Upload, CheckCircle2, Zap, Activity, AlertTriangle, ShieldAlert, FileText, Search, Trash2 } from 'lucide-react';

interface AnalysisEngineProps {
  onValidationError: (msg: string) => void;
  onBeforeUpload: (files: File[]) => Promise<boolean>;
  onDeleteQuery?: (id: string) => Promise<void>; // 🔥 Silme callback'i
  radarStatus: 'IDLE' | 'STABLE' | 'CRITICAL';
  initialData?: any; 
}

const AnalysisEngine = ({ onValidationError, onBeforeUpload, onDeleteQuery, radarStatus, initialData }: AnalysisEngineProps) => {
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [report, setReport] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setReport(initialData);
      setFrontFile(null);
      setBackFile(null);
    }
  }, [initialData]);

  // 🔥 Sorgu Silme Fonksiyonu
  const handleDelete = async () => {
    if (!report?.id || !onDeleteQuery) return;
    
    if (window.confirm("Bu analiz kaydını kalıcı olarak silmek istediğinize emin misiniz?")) {
      try {
        setLoading(true);
        setStatus("KAYIT SİLİNİYOR...");
        await onDeleteQuery(report.id);
        setReport(null); // Raporu ekrandan kaldır
      } catch (error: any) {
        setErrorMsg("Silme işlemi başarısız oldu.");
      } finally {
        setLoading(false);
        setStatus("");
      }
    }
  };

  const handleStartAnalysis = async () => {
    if (radarStatus !== 'STABLE') {
      onValidationError("SİSTEM KISITLAMASI: RİSKLİ FİRMALAR İÇİN ANALİZ MOTORU DEVRE DIŞIDIR.");
      return;
    }
    if (!frontFile || !backFile) return;
    
    setLoading(true);
    setReport(null);
    setErrorMsg(null);

    try {
      setStatus("LOKAL TARAMA: EVRAK GÜVENLİĞİ DENETLENİYOR...");
      const isLocalValid = await onBeforeUpload([frontFile, backFile]);
      if (!isLocalValid) { setLoading(false); return; }

      const formData = new FormData();
      formData.append('front_image', frontFile);
      formData.append('back_image', backFile);

      setStatus("AI ÜNİTESİ: TİCARİ İSTİHBARAT VERİLERİ İŞLENİYOR...");
      const response = await fetch('/api/analyze-evrak', { method: 'POST', body: formData });
      const data = await response.json();

      if (data.isValid === false) {
        onValidationError(data.error || "Evrak doğrulama hatası.");
        setLoading(false);
        return;
      }
      setReport(data);
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
      setStatus("");
    }
  };

  const isHighRisk = report?.risk_score < 30 || radarStatus === 'CRITICAL';

  return (
    <div className="space-y-4 md:space-y-8 w-full">
      {/* Başlık ve Açıklama Bölümü */}
      <div className="px-4 md:px-2 text-center lg:text-left space-y-1">
        <h2 className="text-lg md:text-2xl font-black italic text-white tracking-tight uppercase">
          TİCARİ <span className="text-teal-500">KARAR DESTEK:</span> <br className="md:hidden" /> EVRAK ANALİZİ
        </h2>
      </div>

      <div className={`border rounded-[1.5rem] md:rounded-[3rem] p-3 md:p-10 shadow-2xl relative min-h-[420px] flex flex-col justify-center overflow-hidden transition-all duration-700
        ${isHighRisk ? 'bg-amber-950/10 border-amber-600/30' : 'bg-[#0f172a] border-white/5'}`}>
        
        {radarStatus === 'CRITICAL' ? (
          <div className="flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
            <div className="bg-amber-600/20 p-6 rounded-full mb-6 border border-amber-600/40">
              <ShieldAlert size={64} className="text-amber-500" />
            </div>
            <h3 className="text-2xl md:text-4xl font-black text-white uppercase italic mb-4">İŞLEM ENGELLENDİ</h3>
            <p className="max-w-md text-slate-500 font-bold uppercase text-[9px] md:text-[11px] tracking-widest">
              KRİTİK RİSKLİ FİRMALAR İÇİN ANALİZ MOTORU DURDURULDU.
            </p>
          </div>
        ) : (
          <>
            {loading && (
              <div className="absolute inset-0 z-30 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center animate-in fade-in duration-300">
                <Activity className="w-16 h-16 text-teal-500 animate-spin mb-4" />
                <p className="text-teal-500 font-black italic tracking-[0.2em] text-[10px] uppercase">{status}</p>
              </div>
            )}

            {report ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8 relative">
                 {/* Üst Bar: Başlık + Silme Butonu */}
                 <div className="flex items-center justify-between border-b border-white/5 pb-6">
                    <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center border 
                          ${report.risk_score < 30 ? 'bg-amber-600/10 border-amber-600/20' : 'bg-teal-500/10 border-teal-500/20'}`}>
                          {report.risk_score < 30 ? <AlertTriangle className="text-amber-600" size={28} /> : <FileText className="text-teal-500" size={28} />}
                        </div>
                        <div>
                          <h4 className="text-white text-xl font-black italic uppercase tracking-widest leading-none">{report.company_name || report.title}</h4>
                          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-2">Ticari İstihbarat Çıktısı</p>
                        </div>
                    </div>

                    {/* 🔥 SİLME BUTONU (Sadece geçmiş sorguysa id vardır) */}
                    {report.id && (
                      <button 
                        onClick={handleDelete}
                        className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-90 shadow-lg"
                        title="Sorguyu Sil"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-black/40 p-8 rounded-[2rem] border border-white/5 flex flex-col items-center justify-center">
                       <p className={`font-black text-6xl italic leading-none ${report.risk_score < 30 ? 'text-amber-500' : 'text-teal-500'}`}>
                         %{report.risk_score || '0'}
                       </p>
                       <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-3">GÜVEN ENDEKSİ</p>
                    </div>
                    
                    <div className={`p-6 rounded-[2rem] border flex flex-col justify-center
                      ${report.risk_score < 30 ? 'bg-amber-600/5 border-amber-600/20' : 'bg-teal-500/5 border-teal-500/20'}`}>
                      <p className={`font-black uppercase text-[10px] tracking-widest leading-relaxed
                        ${report.risk_score < 30 ? 'text-amber-500' : 'text-teal-500'}`}>
                        {report.risk_score < 30 
                          ? "FİRMANIN ÖDEME GEÇMİŞİ KRİTİK SEVİYEDEDİR. İŞLEM ÖNCESİ EK TEMİNAT TAVSİYE EDİLİR."
                          : "FİRMA VERİLERİ ANALİZ EDİLMİŞTİR. TİCARİ TEAMÜLLER ÇERÇEVESİNDE İŞLEM YAPILABİLİR."}
                      </p>
                    </div>
                 </div>

                 <button onClick={() => setReport(null)} className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] hover:text-white transition-all">
                   <Search size={12} /> YENİ SORGULAMA
                 </button>
              </div>
            ) : (
              <div className="animate-in fade-in duration-500">
                {/* Dosya Yükleme Alanları (Ön-Arka Yüz) */}
                <div className="grid grid-cols-2 gap-3 md:gap-6 mb-8">
                   {/* ... (Dosya inputları aynı kalıyor) ... */}
                </div>

                <button 
                  onClick={handleStartAnalysis}
                  disabled={!frontFile || !backFile || loading || radarStatus !== 'STABLE'} 
                  className="w-full py-5 md:py-10 rounded-2xl bg-white text-black font-black text-sm md:text-2xl italic tracking-[0.3em] hover:bg-teal-500 transition-all active:scale-95"
                >
                  <Zap size={24} /> ANALİZİ BAŞLAT
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AnalysisEngine;