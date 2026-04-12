'use client';

import React, { useState } from 'react';
import { createClient } from '@/database/client';
import { 
  FileText, Upload, Download, CheckCircle2, 
  X, Loader2, ShieldAlert, Check 
} from 'lucide-react';

interface ContractStepProps {
  request: any;
  onComplete: () => void;
  onCancel: () => void;
}

export default function ContractStep({ request, onComplete, onCancel }: ContractStepProps) {
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState<'download' | 'upload' | 'success'>('download');

  // --- 1. SÖZLEŞME İNDİRME ---
  const handleDownload = () => {
    // Burada gerçek bir PDF üretme veya hazır template linki olmalı
    window.open('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '_blank');
    setStep('upload');
  };

  // --- 2. SÖZLEŞME YÜKLEME ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `contract_${request.id}_${Math.random()}.${fileExt}`;
    const filePath = `contracts/${fileName}`;

    try {
      // Storage'a yükle
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // DB Güncelle (Durumu 'completed' yap ve sözleşme linkini ekle)
      const { error: updateError } = await supabase
        .from('factoring_requests')
        .update({ 
          status: 'completed',
          contract_url: filePath,
          completed_at: new Date().toISOString()
        })
        .eq('id', request.id);

      if (updateError) throw updateError;

      setStep('success');
      setTimeout(() => {
        onComplete();
      }, 2000);

    } catch (error: any) {
      alert("Yükleme hatası: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-[#09090b] border border-zinc-800/60 rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden">
      {/* Kapatma Butonu */}
      <button onClick={onCancel} className="absolute top-6 right-6 text-zinc-600 hover:text-white transition-colors">
        <X size={20} />
      </button>

      {/* Üst Bilgi */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
          <FileText className="text-emerald-500" size={32} />
        </div>
        <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">Sözleşme Protokolü</h2>
        <p className="text-zinc-500 text-[10px] font-bold mt-2 tracking-[0.2em] uppercase">Müşteri: {request.applicant_name}</p>
      </div>

      <div className="space-y-4">
        {/* STEP 1: İNDİRME */}
        <div className={`p-6 rounded-2xl border transition-all ${step === 'download' ? 'bg-zinc-800/40 border-emerald-500/50' : 'bg-transparent border-zinc-800 opacity-50'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${step !== 'download' ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-500'}`}>
                {step !== 'download' ? <Check size={14} /> : "01"}
              </div>
              <div>
                <p className="text-sm font-bold text-white">Sözleşmeyi Hazırla</p>
                <p className="text-[10px] text-zinc-500 uppercase font-black">PDF formatında döküman oluşturun</p>
              </div>
            </div>
            {step === 'download' && (
              <button onClick={handleDownload} className="bg-white text-black px-6 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-emerald-400 transition-all flex items-center gap-2">
                <Download size={14} /> İndir
              </button>
            )}
          </div>
        </div>

        {/* STEP 2: YÜKLEME */}
        <div className={`p-6 rounded-2xl border transition-all ${step === 'upload' ? 'bg-zinc-800/40 border-emerald-500/50 animate-pulse' : 'bg-transparent border-zinc-800 opacity-50'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 font-black text-xs">
                {step === 'success' ? <Check className="text-emerald-500" size={14} /> : "02"}
              </div>
              <div>
                <p className="text-sm font-bold text-white">İmzalı Belgeyi Yükle</p>
                <p className="text-[10px] text-zinc-500 uppercase font-black">Taranmış PDF veya Görsel</p>
              </div>
            </div>
            {step === 'upload' && (
              <label className="cursor-pointer bg-emerald-500 text-black px-6 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-emerald-400 transition-all flex items-center gap-2">
                {uploading ? <Loader2 size={14} className="animate-spin" /> : <><Upload size={14} /> Yükle</>}
                <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,image/*" disabled={uploading} />
              </label>
            )}
          </div>
        </div>

        {/* STEP 3: BAŞARI */}
        {step === 'success' && (
          <div className="p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center flex flex-col items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="text-emerald-500" size={40} />
            <p className="text-white font-black italic uppercase tracking-widest text-sm">İşlem Başarıyla Tamamlandı</p>
            <p className="text-zinc-500 text-[9px] uppercase font-bold tracking-widest">Portföy ekranına yönlendiriliyorsunuz...</p>
          </div>
        )}
      </div>

      <div className="mt-10 flex items-center gap-4 p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl">
        <ShieldAlert className="text-amber-500 shrink-0" size={18} />
        <p className="text-[9px] text-amber-500/70 font-bold leading-relaxed uppercase tracking-tighter">
          Sözleşme yüklendiği anda finansman süreci resmi olarak başlar. Lütfen evrakın doğruluğundan emin olun.
        </p>
      </div>
    </div>
  );
}