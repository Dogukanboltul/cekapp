'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/database/client';
import { LogOut, User, ShieldCheck, LogIn } from 'lucide-react';

// Sidebar'dan gelen isOpen ve onAuthClick prop'larını tanımladık
interface UserBadgeProps {
  isOpen: boolean;
  onAuthClick: () => void;
}

export default function UserBadge({ isOpen, onAuthClick }: UserBadgeProps) {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    // İlk yüklemede kullanıcıyı al
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // Oturum değişikliklerini (Login/Logout) dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  // DURUM 1: Kullanıcı Giriş Yapmamışsa
  if (!user) {
    return (
      <button 
        onClick={onAuthClick}
        className={`mt-4 bg-teal-500 hover:bg-teal-400 text-[#060a14] font-black rounded-2xl transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 uppercase italic
          ${isOpen ? 'w-full py-3 text-[11px]' : 'w-12 h-12 py-0'}`}
        title="Sisteme Giriş Yap"
      >
        {isOpen ? 'Müfrezeye Katıl' : <LogIn size={20} />}
      </button>
    );
  }

  // DURUM 2: Kullanıcı Giriş Yapmışsa
  return (
    <div className={`flex items-center bg-white/5 border border-white/10 rounded-2xl mt-4 group transition-all duration-300
      ${isOpen ? 'justify-between p-3 w-full' : 'justify-center p-2 w-12'}`}
    >
      <div className="flex items-center gap-3">
        {/* Profil İkonu */}
        <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-500 shrink-0">
          <User size={16} />
        </div>

        {/* Bilgiler (Sadece Sidebar açıkken görünür) */}
        {isOpen && (
          <div className="flex flex-col min-w-0 animate-in fade-in duration-500">
            <span className="text-[10px] font-black text-white truncate max-w-[100px] uppercase italic">
              {user.email.split('@')[0]}
            </span>
            <div className="flex items-center gap-1">
              <ShieldCheck size={10} className="text-teal-500" />
              <span className="text-[8px] text-slate-500 uppercase font-black italic tracking-tighter">Aktif Tacir</span>
            </div>
          </div>
        )}
      </div>

      {/* Çıkış Butonu (Sadece Sidebar açıkken görünür) */}
      {isOpen && (
        <button 
          onClick={handleLogout}
          className="p-1.5 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
          title="Güvenli Çıkış"
        >
          <LogOut size={16} />
        </button>
      )}
    </div>
  );
}