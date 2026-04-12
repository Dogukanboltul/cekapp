'use client';

import React, { useState } from 'react';
import { X, Lock, Zap, ShieldCheck, Hash, Layers, Loader2 } from 'lucide-react';

interface ApiConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  platformName: string;
  onConnect: (apiKey: string, apiSecret: string, sellerId: string, refCode: string) => void;
}

export default function ApiConnectModal({ isOpen, onClose, platformName, onConnect }: ApiConnectModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [sellerId, setSellerId] = useState('');
  const [refCode, setRefCode] = useState(''); 
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Güvenli Senkronizasyon Simülasyonu
    setTimeout(() => {
      // ✅ Dashboard'daki onConnect beklentisine uygun parametre gönderimi
      onConnect(apiKey, apiSecret, sellerId, refCode);
      setLoading(false);
      
      // Formu temizle ve kapat
      setApiKey('');
      setApiSecret('');
      setSellerId('');
      setRefCode('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Arka Plan Karartma & Blur */}
      <div className="absolute inset-0 bg-[#060a14]/90 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />

      <div className="relative w-full max-w-md bg-[#0b1222] border border-teal-500/20 rounded-[2.5rem] p-8 shadow-[0_0_50px_rgba(20,184,166,0.1)] overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Dekoratif Siber Işık Efekti */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-teal-500/10 blur-[80px] rounded-full" />
        
        {/* Üst Başlık Alanı */}
        <div className="flex justify-between items-start mb-8 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap size={14} className="text-teal-500 fill-current" />
              <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter">
                {platformName} <span className="text-teal-500 text-sm">ENDEKSLE</span>
              </h2>
            </div>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] italic">
              Güvenli API Entegrasyon Protokolü v2.0
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          
          <div className="grid grid-cols-1 gap-4">
            {/* MAĞAZA / SATICI ID */}
            <div className="group">
              <label className="block text-[8px] font-black text-teal-500/50 uppercase tracking-widest ml-4 mb-2 italic">
                Mağaza (Seller) ID
              </label>
              <div className="relative">
                <input 
                  required
                  type="text" 
                  value={sellerId}
                  onChange={(e) => setSellerId(e.target.value)}
                  placeholder="Örn: 1153681"
                  className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-2xl focus:border-teal-500/50 outline-none transition-all text-sm text-white font-mono placeholder:text-white/10"
                />
                <Hash size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-teal-500/50 transition-colors" />
              </div>
            </div>

            {/* API KEY & SECRET */}
            <div className="grid grid-cols-2 gap-3">
              <div className="group">
                <label className="block text-[8px] font-black text-teal-500/50 uppercase tracking-widest ml-4 mb-2 italic text-center">API Key</label>
                <div className="relative">
                  <input 
                    required
                    type="password" 
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-2xl focus:border-teal-500/50 outline-none transition-all text-sm text-white"
                  />
                  <Lock size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/10" />
                </div>
              </div>
              <div className="group">
                <label className="block text-[8px] font-black text-teal-500/50 uppercase tracking-widest ml-4 mb-2 italic text-center">API Secret</label>
                <div className="relative">
                  <input 
                    required
                    type="password" 
                    value={apiSecret}
                    onChange={(e) => setApiSecret(e.target.value)} // ✅ Düzeltildi: setApiKey yerine setApiSecret
                    className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-2xl focus:border-teal-500/50 outline-none transition-all text-sm text-white"
                  />
                  <Lock size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/10" />
                </div>
              </div>
            </div>

            {/* ENTEGRASYON REFERANS KODU */}
            <div className="group">
              <label className="block text-[8px] font-black text-teal-500/50 uppercase tracking-widest ml-4 mb-2 italic">
                Entegrasyon Referans Kodu
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  value={refCode}
                  onChange={(e) => setRefCode(e.target.value)}
                  placeholder="263c4a95-07a5-..."
                  className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-2xl focus:border-teal-500/50 outline-none transition-all text-[10px] font-mono text-white placeholder:text-white/10"
                />
                <Layers size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-teal-500/50 transition-colors" />
              </div>
            </div>
          </div>

          {/* Güvenlik Bilgilendirmesi */}
          <div className="bg-teal-500/5 border border-teal-500/10 rounded-2xl p-4 flex gap-3 items-center">
            <ShieldCheck size={18} className="text-teal-500 shrink-0" />
            <p className="text-[8px] font-bold text-slate-400 leading-relaxed uppercase tracking-wider">
              Entegrasyon verileriniz <span className="text-white">ÇEKAPP SHIELD</span> ile uçtan uca şifrelenir.
            </p>
          </div>

          {/* Aksiyon Butonu */}
          <button 
            type="submit"
            disabled={loading}
            className={`w-full bg-teal-500 hover:bg-teal-600 text-black font-black py-4 rounded-2xl transition-all uppercase text-[11px] italic tracking-widest flex items-center justify-center gap-2
              ${loading ? 'opacity-50 cursor-wait' : 'active:scale-95 shadow-[0_0_30px_rgba(20,184,166,0.2)]'}`}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                HATLAR SENKRONİZE EDİLİYOR...
              </>
            ) : (
              'TERMİNALİ CANLANDIR'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}