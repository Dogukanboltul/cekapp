'use client';

import React, { useState } from 'react';
import { Camera, FileText, BotMessageSquare, ShieldCheck, Zap, Lightbulb } from 'lucide-react';

export default function CekAppAnaSayfa() {
  // Görseldeki üç butonu (Çek Analizi, Senet Analizi, Hızlı Ön Değerlendirme) temsil eden state
  const [activeAnalysis, setActiveAnalysis] = useState('cek');

  // Bilgi kartlarının verileri
  const infoCards = [
    {
      icon: <BotMessageSquare className="w-6 h-6 text-teal-400" />,
      title: "Çek ve Senet Uyumu",
      description: "Sistem yalnızca çekleri değil, senet belgelerini de taramaya uygun bir yapı sunar."
    },
    {
      icon: <Lightbulb className="w-6 h-6 text-teal-400" />,
      title: "Hızlı Risk Görünürlüğü",
      description: "Belge üzerindeki okunabilen verilere göre ön risk skoru ve yorum üretir."
    },
    {
      icon: <Zap className="w-6 h-6 text-teal-400" />,
      title: "Operasyonel Hız",
      description: "Tek ekranda yükleme, analiz, arşivleme ve kayıt akışını bir araya getirir."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-100 p-4 md:p-8 font-sans">
      
      {/* Üst Kısım: Başlık ve Slogan */}
      <header className="mb-12 text-center md:text-left max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-50 tracking-tight">
          Güvenlik ve AI aynı akışta
        </h1>
        <p className="mt-4 text-lg text-slate-400 max-w-3xl">
          ÇekApp yalnızca belge yükleme ekranı değildir. Yapay zeka ile analiz üretirken aynı zamanda güvenli arşivleme, kayıt takibi ve düzenli operasyon akışı sunar.
        </p>
      </header>

      {/* Ana İçerik: Sol Form ve Sağ Bilgi Kartları */}
      <main className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
        
        {/* Sol Taraf: Belge Yükleme Formu */}
        <section className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-slate-50 tracking-tight flex items-center gap-2">
              <Zap className="w-5 h-5 text-teal-400" />
              BELGE YÜKLEME ALANI
            </h2>
            <FileText className="w-6 h-6 text-teal-400" />
          </div>

          <div className="flex flex-col items-center text-center py-12 bg-[#0d121f] rounded-xl border-2 border-dashed border-slate-700 hover:border-teal-500 transition-colors cursor-pointer mb-8">
            <div className="bg-[#1f2937] p-5 rounded-full mb-6">
              <Camera className="w-10 h-10 text-teal-400" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-50 mb-3 tracking-tight">
              Çek veya Senet Yükleyin
            </h3>
            <p className="text-slate-400 max-w-md px-4 mb-6">
              Tek bir görselle belgeyi sisteme alın. Çek ve senet üzerindeki alanlar AI ile okunur, öne çıkan bulgular çıkarılır ve profesyonel ön risk değerlendirmesi oluşturulur.
            </p>
          </div>

          {/* Analiz Tipi Seçim Butonları */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            <button 
              onClick={() => setActiveAnalysis('cek')}
              className={`py-3 px-5 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 
                ${activeAnalysis === 'cek' ? 'bg-teal-500 text-white shadow-lg' : 'bg-[#1f2937] text-slate-300 hover:bg-[#2e3c51]'}`}>
              Çek Analizi
            </button>
            <button 
              onClick={() => setActiveAnalysis('senet')}
              className={`py-3 px-5 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2
                ${activeAnalysis === 'senet' ? 'bg-teal-500 text-white shadow-lg' : 'bg-[#1f2937] text-slate-300 hover:bg-[#2e3c51]'}`}>
              Senet Analizi
            </button>
            <button 
              onClick={() => setActiveAnalysis('hizli')}
              className={`py-3 px-5 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2
                ${activeAnalysis === 'hizli' ? 'bg-teal-500 text-white shadow-lg' : 'bg-[#1f2937] text-slate-300 hover:bg-[#2e3c51]'}`}>
              Hızlı Ön Değerlendirme
            </button>
          </div>

          {/* Ana İşlem Butonu */}
          <button className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold py-4 px-6 rounded-xl text-lg flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-xl">
            Belge Seç
            < Zap className="w-5 h-5" />
          </button>
        </section>

        {/* Sağ Taraf: Bilgi Kartları */}
        <section className="space-y-6">
          {infoCards.map((card, index) => (
            <div key={index} className="bg-[#111827] border border-slate-800 rounded-2xl p-6 flex gap-5 items-start hover:border-slate-700 transition-colors group shadow-lg">
              <div className="bg-[#1f2937] p-3 rounded-lg group-hover:bg-[#2e3c51] transition-colors">
                {card.icon}
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-50 mb-1.5 tracking-tight">{card.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{card.description}</p>
              </div>
            </div>
          ))}

          {/* Kullanım Önerisi Kartı */}
          <div className="bg-[#111827]/60 border border-dashed border-slate-800 rounded-2xl p-6 flex gap-5 items-start">
            <div className="bg-[#1f2937] p-3 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-50 mb-1.5 tracking-tight flex items-center gap-2">
                <Zap className="w-4 h-4 text-teal-400" />
                Kullanım Önerisi
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Düz zeminde, kırpılmış ve net çekilmiş belge görselleri daha yüksek doğruluk sağlar. Çek ve senet üzerindeki kritik alanlar daha rahat okunur.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Alt Kısım: Slogan ve Logo */}
      <footer className="mt-16 text-center border-t border-slate-800 pt-8 max-w-7xl mx-auto flex flex-col items-center gap-4">
        <span className="text-xs text-teal-500 font-medium uppercase tracking-widest">NEDEN ÇEKAPP?</span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-50 tracking-tight">Belge okuma değil, karar desteği</h2>
        <p className="text-slate-400 max-w-xl text-sm leading-relaxed">
          Sadece alan çıkarmakla kalmaz, evrakın içeriğini hızlı anlamanıza yardımcı olur ve ön inceleme sürecini sadeleştirir.
        </p>
      </footer>

    </div>
  );
}