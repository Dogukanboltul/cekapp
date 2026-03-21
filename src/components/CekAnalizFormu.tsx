'use client';

import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  Sparkles,
  Building2,
  Users,
  FileSearch,
} from 'lucide-react';
import imageCompression from 'browser-image-compression';

type AiData = {
  vkn: string;
  seri: string;
  banka: string;
  mesaj: string;
  risk_skoru: number;
  risk_seviyesi: string;
  bulgular: string[];
  ciro_sayisi?: number;
  taraflar?: string[];
  bildirim?: string;
};

async function compressImage(file: File) {
  return imageCompression(file, {
    maxSizeMB: 0.4,
    maxWidthOrHeight: 1400,
    useWebWorker: true,
  });
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function CekAnalizFormu() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AiData | null>(null);
  const [error, setError] = useState('');

  const handleFile = async (e: any) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const compressed = await compressImage(f);
    setFile(compressed);
    setPreview(URL.createObjectURL(compressed));
  };

  const analyze = async () => {
    if (!file) return;
    setLoading(true);
    setError('');

    try {
      const base64 = await fileToBase64(file);
      const res = await fetch('/api/analyze-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ frontBase64Data: base64 }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Analiz başarısız');

      setData({
        vkn: json.vkn || '-',
        seri: json.seri || '-',
        banka: json.banka || '-',
        mesaj: json.detay || '',
        risk_skoru: Number(json.final_risk || 0),
        risk_seviyesi: json.ozet || 'Orta',
        bulgular: Array.isArray(json.bulgular) ? json.bulgular : [],
        ciro_sayisi: json.analiz_sayisi || 0,
        bildirim: json.bildirim,
      });
    } catch (err: any) {
      setError(err.message || 'Analiz hatası');
    }
    setLoading(false);
  };

  const decision = useMemo(() => {
    if (!data) return { text: '', color: 'text-gray-400', icon: CheckCircle2, bg: 'bg-slate-800' };
    if (data.risk_skoru < 30) return { text: 'GÜVENLİ İŞLEM', color: 'text-green-400', icon: CheckCircle2, bg: 'bg-green-900/20' };
    if (data.risk_skoru > 70) return { text: 'KRİTİK RİSK', color: 'text-red-400', icon: XCircle, bg: 'bg-red-900/20' };
    return { text: 'DİKKATLİ OLUN', color: 'text-yellow-400', icon: AlertTriangle, bg: 'bg-yellow-900/20' };
  }, [data]);

  const DecisionIcon = decision.icon;

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-200 font-sans">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-green-500 p-2 rounded-lg">
            <Building2 className="text-slate-950" size={28} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">CEK<span className="text-green-500">APP</span></h1>
        </div>

        {!data ? (
          <div className="bg-slate-900 border-2 border-dashed border-slate-800 rounded-3xl p-10 text-center">
            <input type="file" id="cek-upload" hidden onChange={handleFile} accept="image/*" />
            <label htmlFor="cek-upload" className="cursor-pointer flex flex-col items-center gap-4">
              <div className="bg-slate-800 p-5 rounded-full text-green-500">
                <FileSearch size={40} />
              </div>
              <div>
                <p className="text-lg font-bold text-white">Çek Görselini Yükle</p>
                <p className="text-sm text-slate-500">Analiz için ön yüzü net çekin</p>
              </div>
            </label>

            {preview && (
              <div className="mt-8 relative">
                <img src={preview} className="rounded-2xl border-4 border-slate-800 max-h-64 mx-auto" alt="Önizleme" />
                <button 
                  onClick={analyze}
                  disabled={loading}
                  className="mt-6 w-full bg-green-500 hover:bg-green-400 text-slate-950 font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-green-500/20"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                  {loading ? 'ANALİZ EDİLİYOR...' : 'ANALİZİ BAŞLAT'}
                </button>
              </div>
            )}
            {error && <p className="mt-4 text-red-400 font-medium bg-red-900/10 p-3 rounded-xl">{error}</p>}
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* KARAR KARTI */}
            <div className={`p-6 rounded-3xl ${decision.bg} border border-white/5 flex items-center justify-between`}>
              <div className="flex items-center gap-4">
                <DecisionIcon className={decision.color} size={40} />
                <div>
                  <p className="text-xs font-bold text-slate-500 tracking-widest uppercase">Yapay Zeka Kararı</p>
                  <p className={`text-2xl font-black ${decision.color}`}>{decision.text}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-500 uppercase">Risk Skoru</p>
                <p className="text-3xl font-black text-white">%{data.risk_skoru}</p>
              </div>
            </div>

            {/* BİLGİ KARTLARI */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900 p-5 rounded-3xl border border-white/5">
                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Banka</p>
                <p className="text-lg font-bold text-white">{data.banka}</p>
              </div>
              <div className="bg-slate-900 p-5 rounded-3xl border border-white/5">
                <p className="text-xs font-bold text-slate-500 uppercase mb-1">VKN / TC</p>
                <p className="text-lg font-bold text-white">{data.vkn}</p>
              </div>
            </div>

            {/* ANALİZ ÖZETİ */}
            <div className="bg-slate-900 p-6 rounded-3xl border border-white/5">
              <h3 className="flex items-center gap-2 font-black text-white mb-4 uppercase tracking-tighter">
                <Sparkles className="text-green-500" size={18} /> Uzman Analizi
              </h3>
              <p className="text-slate-300 leading-relaxed italic">"{data.mesaj}"</p>
              
              <div className="mt-6 space-y-2">
                {data.bulgular.map((b, i) => (
                  <div key={i} className="flex gap-3 items-start bg-slate-800/50 p-3 rounded-xl text-sm border border-white/5">
                    <span className="text-green-500 mt-1">⚡</span>
                    <span className="text-slate-400">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {data.bildirim && (
               <div className="bg-blue-900/20 border border-blue-500/20 p-4 rounded-2xl text-blue-400 text-sm flex gap-3">
                 <span>📢</span> {data.bildirim}
               </div>
            )}

            <button
              onClick={() => setData(null)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} /> YENİ ANALİZ YAP
            </button>
          </div>
        )}
      </div>
    </div>
  );
}