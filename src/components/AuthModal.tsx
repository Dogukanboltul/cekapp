'use client';

import React, { useState } from 'react';
import { createClient } from '@/database/client';
import { X, Mail, Lock, Loader2, Shield, Building2, Briefcase } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();

    const { data, error: authError } = isSignUp 
      ? await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              full_name: fullName,
              company_name: companyName,
              sector: sector,
            },
            emailRedirectTo: `${window.location.origin}/dashboard`,
          }
        })
      : await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message === 'Invalid login credentials' 
        ? 'BİLGİLER HATALI, ERİŞİM REDDEDİLDİ.' 
        : authError.message.toUpperCase());
      setLoading(false);
    } else {
      if (isSignUp && data.user && !data.session) {
        setError("KAYIT BAŞARILI. LÜTFEN E-POSTA ADRESİNİZİ ONAYLAYIN.");
        setLoading(false);
      } else {
        onClose();
        window.location.href = '/dashboard';
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 backdrop-blur-md bg-[#060a14]/80">
      <div className="relative w-full max-w-md bg-[#0b1222] border border-white/10 rounded-[3rem] p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
          <X size={20} />
        </button>

        <div className="text-center mb-10">
          <div className="inline-flex p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 mb-4 text-teal-500">
            <Shield size={24} />
          </div>
          <h2 className="text-2xl font-black italic tracking-tighter text-white uppercase">
            {isSignUp ? 'YENİ KAYIT' : 'SİSTEME GİRİŞ'}
          </h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">CekApp Güvenli İstihbarat Portalı</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase ml-4 italic">Ad Soyad</label>
                <div className="relative group">
                  <input 
                    type="text" placeholder="ADINIZI VE SOYADINIZI GİRİNİZ" required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-teal-500/40 outline-none transition-all text-white placeholder:text-slate-800 uppercase"
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase ml-4 italic">Ticari Ünvan</label>
                <div className="relative group">
                  <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-teal-500 transition-colors" size={18} />
                  <input 
                    type="text" placeholder="RESMİ TİCARİ ÜNVAN GİRİNİZ" required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-sm focus:border-teal-500/40 outline-none transition-all text-white placeholder:text-slate-800 uppercase"
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase ml-4 italic">Sektör</label>
                <div className="relative group">
                  <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-teal-500 transition-colors" size={18} />
                  <select 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-sm focus:border-teal-500/40 outline-none transition-all text-white appearance-none cursor-pointer placeholder:text-slate-800"
                    onChange={(e) => setSector(e.target.value)}
                  >
                    <option value="" className="bg-[#0b1222]">SEKTÖR SEÇİNİZ</option>
                    <option value="ecommerce" className="bg-[#0b1222]">E-TİCARET / PERAKENDE</option>
                    <option value="fmcg" className="bg-[#0b1222]">HIZLI TÜKETİM (FMCG)</option>
                    <option value="construction" className="bg-[#0b1222]">İNSAAT / YAPI</option>
                    <option value="textile" className="bg-[#0b1222]">TEKSTİL / KONFEKSİYON</option>
                    <option value="logistics" className="bg-[#0b1222]">LOJİSTİK / DIŞ TİCARET</option>
                    <option value="technology" className="bg-[#0b1222]">TEKNOLOJİ / BİLİŞİM</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-500 uppercase ml-4 italic">E-Posta Adresi</label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-teal-500 transition-colors" size={18} />
              <input 
                type="email" placeholder="E-POSTA ADRESİ GİRİNİZ" required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-sm focus:border-teal-500/40 outline-none transition-all text-white placeholder:text-slate-800 uppercase"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-500 uppercase ml-4 italic">Güvenlik Anahtarı</label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-teal-500 transition-colors" size={18} />
              <input 
                type="password" placeholder="••••••••" required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-sm focus:border-teal-500/40 outline-none transition-all text-white placeholder:text-slate-800"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[9px] font-black text-center uppercase tracking-widest italic">
              {error}
            </div>
          )}

          <button 
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-400 text-[#060a14] font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 uppercase italic text-xs shadow-lg shadow-teal-500/10 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : (isSignUp ? 'Kayıt Ol' : 'Erişim İzni Al')}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <button 
            onClick={() => { setIsSignUp(!isSignUp); setError(null); }} 
            className="text-[10px] text-slate-500 font-bold hover:text-teal-500 transition-colors uppercase tracking-widest"
          >
            {isSignUp ? 'Zaten bir hesabın var mı? Giriş Yap' : 'Henüz yetkin yok mu? Kayıt Ol'}
          </button>
        </div>
      </div>
    </div>
  );
}