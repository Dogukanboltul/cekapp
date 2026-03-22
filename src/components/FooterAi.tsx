'use client';

import React from 'react';
import { Target } from 'lucide-react';

export default function FooterAI() {
  return (
    <footer className="w-full bg-black/90 border-t border-white/10 py-8 mt-auto">
      <div className="max-w-7xl mx-auto text-center">
        <Target className="mx-auto w-10 h-10 text-slate-800 opacity-20 mb-3" />
        <p className="text-[9px] sm:text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] italic">
          Cekapp AI Destekli Veri Kontrol Merkezi
        </p>
      </div>
    </footer>
  );
}