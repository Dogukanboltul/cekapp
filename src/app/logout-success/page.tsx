'use client';

import React, { useState } from 'react'; // useState eklendi
import { 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  ArrowRight, 
  CheckCircle2, 
  Globe, 
  Lock,
  Star
} from 'lucide-react';
import Link from 'next/link';
import AuthModal from '@/components/AuthModal'; // AuthModal import edildi

export default function MarketingPage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false); // Modal kontrolü

  return (
    <div className="min-h-screen bg-[#060a14] text-slate-100 font-sans selection:bg-teal-500/30 overflow-x-hidden">
      
      {/* 🔐 Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* 🌌 Arka Plan Aura Efektleri */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[150px] rounded-full" />
      </div>

      {/* 🧭 Üst Navigasyon */}
      <nav className="relative z-50 border-b border-white/5 bg-[#060a14]/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setIsAuthOpen(true)}>
            <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(20,184,166,0.3)] group-hover:rotate-12 transition-transform">
              <ShieldCheck className="text-[#060a14]" size={24} />
            </div>
            <span className="text-2xl font-black italic tracking-tighter text-white">CEKAPP</span>
          </div>
          
          <button 
            onClick={() => setIsAuthOpen(true)}
            className="px-6 py-2.5 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-500 text-[10px] font-black uppercase italic tracking-widest hover:bg-teal-500 hover:text-[#060a14] transition-all shadow-lg shadow-teal-500/5"
          >
            Tekrar Giriş Yap
          </button>
        </div>
      </nav>

      {/* ⚡ Hero Section */}
      <section className="relative z-10 pt-28 pb-32 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/5 border border-teal-500/20 mb-4">
            <Star size={14} className="text-teal-400 fill-teal-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-400">Güvenli Çıkış Onaylandı</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-[0.9] text-white uppercase">
            TİCARETİN <span className="text-teal-500">YENİ NESİL</span><br /> RİSK <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">KALKANI.</span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Cekapp ile karşılıksız çek riskini minimize edin, pazaryeri bakiyelerinizi tek ekrandan yönetin ve yapay zeka destekli finansal analizlerle ticaretinizi koruyun.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <button 
              onClick={() => setIsAuthOpen(true)}
              className="w-full sm:w-auto px-12 py-6 bg-teal-500 text-[#060a14] rounded-2xl font-black uppercase italic tracking-widest hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(20,184,166,0.3)]"
            >
              Hemen Başla <ArrowRight size={20} />
            </button>
            <Link 
              href="#features" 
              className="w-full sm:w-auto px-12 py-6 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase italic tracking-widest hover:bg-white/10 transition-all text-center backdrop-blur-md"
            >
              Özellikleri Keşfet
            </Link>
          </div>
        </div>
      </section>

      {/* 📊 Özellikler Grid */}
      <section id="features" className="relative z-10 py-32 bg-[#080e1a] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard 
              icon={<BarChart3 className="text-teal-500" />}
              title="Risk Skorlama"
              desc="Yapay zeka algoritmalarımızla ticari çeklerin ödenme ihtimalini saniyeler içinde analiz edin."
              color="teal"
            />
            <FeatureCard 
              icon={<Globe className="text-blue-500" />}
              title="Pazaryeri Entegresi"
              desc="Trendyol, Hepsiburada ve Amazon bakiyelerinizi tek bir merkezden canlı takip edin."
              color="blue"
            />
            <FeatureCard 
              icon={<Lock className="text-red-500" />}
              title="Güvenli İstihbarat"
              desc="Diğer tacirlerin deneyimlerinden faydalanın, karşılıksız evrak bildirimlerini anlık alın."
              color="red"
            />
          </div>
        </div>
      </section>

      {/* 🛡️ Güven Bölümü */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-teal-500/10 to-transparent border border-teal-500/20 rounded-[4rem] p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <ShieldCheck size={120} className="text-teal-500" />
          </div>
          
          <h2 className="text-4xl font-black italic uppercase text-white mb-12 tracking-tighter">Neden Cekapp?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
            {[
              "7/24 Canlı Risk Analizi",
              "Sınırsız Pazaryeri Mağaza Bağlantısı",
              "Anlık Karşılıksız Evrak Bildirimleri",
              "Yapay Zeka Destekli Finansal Danışman"
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 group">
                <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center group-hover:bg-teal-500/40 transition-colors">
                  <CheckCircle2 className="text-teal-500" size={18} />
                </div>
                <span className="text-sm font-black uppercase italic tracking-widest text-slate-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🏁 Footer */}
      <footer className="py-16 border-t border-white/5 text-center">
        <p className="text-[10px] font-black italic text-slate-700 uppercase tracking-[0.5em]">
          © 2026 CEKAPP TECHNOLOGIES — BEYLİKDÜZÜ / İSTANBUL
        </p>
      </footer>
    </div>
  );
}

// Yardımcı Kart Bileşeni
function FeatureCard({ icon, title, desc, color }: any) {
  const colors: any = {
    teal: 'hover:border-teal-500/40',
    blue: 'hover:border-blue-500/40',
    red: 'hover:border-red-500/40',
  };

  return (
    <div className={`p-10 rounded-[3rem] bg-[#0b1222] border border-white/5 transition-all group ${colors[color]}`}>
      <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-xl">
        {icon}
      </div>
      <h3 className="text-2xl font-black italic uppercase text-white mb-4 tracking-tighter">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}