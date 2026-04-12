'use client';

import React, { useState } from 'react';
import { createClient } from '@/database/client';
import { X, Loader2, Shield, Gavel, Upload, Phone, Image as ImageIcon, Briefcase } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Roller: 'merchant', 'lawyer', 'factoring'
type UserRole = 'merchant' | 'lawyer' | 'factoring';

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<UserRole>('merchant'); // Varsayılan tacir
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [vkn, setVkn] = useState('');
  const [mersis, setMersis] = useState('');
  const [licenseNo, setLicenseNo] = useState(''); // Faktoring için lisans/sicil
  const [idCardFile, setIdCardFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();

    try {
      if (isSignUp) {
        let verificationDocUrl = null;

        // Dosya yükleme (Avukat veya Faktoring için)
        if ((role === 'lawyer' || role === 'factoring') && idCardFile) {
          try {
            const fileExt = idCardFile.name.split('.').pop();
            const fileName = `${role}-${Date.now()}.${fileExt}`;
            const { data: upData } = await supabase.storage.from('verifications').upload(fileName, idCardFile);
            if (upData) verificationDocUrl = upData.path;
          } catch (e) { console.log("Görsel yükleme atlandı."); }
        }

        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone: phone,
              user_role: role, // Rolü direkt gömüyoruz
              doc_url: verificationDocUrl,
              ...(role === 'lawyer' ? { baro_no: licenseNo } : {}),
              ...(role === 'factoring' ? { bddk_license: licenseNo, company_name: companyName } : {}),
              ...(role === 'merchant' ? { company_name: companyName, vkn, mersis } : {})
            }
          }
        });

        if (authError) throw authError;
        
        // KAYIT SONRASI YÖNLENDİRME
        if (data.user) {
          if (role === 'lawyer') window.location.href = '/lawyer';
          else if (role === 'factoring') window.location.href = '/factoring';
          else window.location.href = '/dashboard';
        }

      } else {
        // GİRİŞ YAP
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;

        if (signInData.user) {
          const userRole = signInData.user.user_metadata?.user_role;
          
          if (userRole === 'lawyer') window.location.href = '/lawyer';
          else if (userRole === 'factoring') window.location.href = '/factoring';
          else window.location.href = '/dashboard';
        }
      }
    } catch (err: any) {
      setError(err.message?.toUpperCase() || "BİR HATA OLUŞTU.");
      setLoading(false);
    }
  };

  // Rol bazlı renk ve ikon belirleyici
  const getRoleConfig = () => {
    switch(role) {
      case 'lawyer': return { color: 'bg-blue-600', text: 'text-blue-400', icon: <Gavel size={24} /> };
      case 'factoring': return { color: 'bg-purple-600', text: 'text-purple-400', icon: <Briefcase size={24} /> };
      default: return { color: 'bg-teal-500', text: 'text-teal-500', icon: <Shield size={24} /> };
    }
  };

  const config = getRoleConfig();

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 backdrop-blur-md bg-[#060a14]/80 text-white">
      <div className="relative w-full max-w-md bg-[#0b1222] border border-white/10 rounded-[3rem] p-8 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-500 hover:text-white"><X size={20} /></button>

        <div className="text-center mb-8">
          <div className={`inline-flex p-3 rounded-2xl bg-white/5 border border-white/10 mb-4 ${config.text}`}>
            {config.icon}
          </div>
          <h2 className="text-2xl font-black italic tracking-tighter uppercase">{isSignUp ? 'KAYDOL' : 'GİRİŞ YAP'}</h2>
        </div>

        {/* ROL SEÇİCİ - 3'LÜ YAPI */}
        {isSignUp && (
          <div className="flex p-1 bg-white/5 rounded-2xl mb-6 border border-white/10 font-bold italic">
            <button type="button" onClick={() => setRole('merchant')} className={`flex-1 py-3 rounded-xl text-[8px] uppercase transition-all ${role === 'merchant' ? 'bg-teal-500 text-black' : 'text-slate-500'}`}>TACİR</button>
            <button type="button" onClick={() => setRole('lawyer')} className={`flex-1 py-3 rounded-xl text-[8px] uppercase transition-all ${role === 'lawyer' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>AVUKAT</button>
            <button type="button" onClick={() => setRole('factoring')} className={`flex-1 py-3 rounded-xl text-[8px] uppercase transition-all ${role === 'factoring' ? 'bg-purple-600 text-white' : 'text-slate-500'}`}>FAKTORİNG</button>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <>
              <input type="text" placeholder="Yetkili Ad Soyad" required className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none" onChange={(e) => setFullName(e.target.value)} />
              <div className="relative">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                <input type="tel" placeholder="İletişim Numarası" required className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-sm text-white outline-none" onChange={(e) => setPhone(e.target.value)} />
              </div>

              {/* Dinamik Alanlar */}
              {role === 'merchant' && (
                <>
                  <input type="text" placeholder="Ticari Ünvan" required className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none" onChange={(e) => setCompanyName(e.target.value)} />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="VKN / TC" required className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none" onChange={(e) => setVkn(e.target.value)} />
                    <input type="text" placeholder="Mersis No" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none" onChange={(e) => setMersis(e.target.value)} />
                  </div>
                </>
              )}

              {role === 'lawyer' && (
                <div className="space-y-4">
                  <input type="text" placeholder="Baro Sicil No" required className="w-full bg-blue-500/5 border border-blue-500/20 rounded-2xl py-4 px-6 text-sm text-white outline-none" onChange={(e) => setLicenseNo(e.target.value)} />
                  <UploadLabel file={idCardFile} setFile={setIdCardFile} label="Avukatlık Kimliği Yükle" />
                </div>
              )}

              {role === 'factoring' && (
                <div className="space-y-4">
                  <input type="text" placeholder="Kurum Adı (Örn: QNB Faktoring)" required className="w-full bg-purple-500/5 border border-purple-500/20 rounded-2xl py-4 px-6 text-sm text-white outline-none" onChange={(e) => setCompanyName(e.target.value)} />
                  <input type="text" placeholder="BDDK Lisans / Sicil No" required className="w-full bg-purple-500/5 border border-purple-500/20 rounded-2xl py-4 px-6 text-sm text-white outline-none" onChange={(e) => setLicenseNo(e.target.value)} />
                  <UploadLabel file={idCardFile} setFile={setIdCardFile} label="Yetki Belgesi (PDF/IMG)" />
                </div>
              )}
            </>
          )}

          <input type="email" placeholder="E-posta" required className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Şifre" required className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none" onChange={(e) => setPassword(e.target.value)} />

          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-black text-center uppercase tracking-widest">{error}</div>}

          <button disabled={loading} className={`w-full font-black py-4 rounded-2xl transition-all uppercase italic text-xs shadow-lg ${loading ? 'opacity-50' : 'hover:scale-[1.02]'} ${isSignUp ? `${config.color} text-white` : 'bg-white text-black'}`}>
            {loading ? <Loader2 className="animate-spin mx-auto" /> : (isSignUp ? 'KAYDI TAMAMLA' : 'GİRİŞ YAP')}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <button onClick={() => { setIsSignUp(!isSignUp); setError(null); }} className="text-[10px] text-slate-500 font-bold hover:text-teal-500 uppercase tracking-widest transition-all">
            {isSignUp ? 'Zaten hesabın var mı? Giriş Yap' : 'Henüz yetkin yok mu? Kaydol'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Yardımcı Bileşen: Dosya Yükleme Alanı
function UploadLabel({ file, setFile, label }: any) {
  return (
    <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/10 rounded-2xl bg-white/[0.02] cursor-pointer hover:border-white/30 transition-all">
      {file ? <ImageIcon className="text-teal-500" /> : <Upload className="text-slate-600" />}
      <span className="text-[10px] font-black text-slate-500 uppercase italic mt-2 text-center">{file ? file.name : label}</span>
      <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
    </label>
  );
}