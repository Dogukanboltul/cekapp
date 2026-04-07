// components/ReportForm.tsx
'use client';

import { createClient } from '@/database/client'; // Supabase istemcisi
import { useState } from 'react';
import { X, Send, ShieldAlert } from 'lucide-react';

export default function ReportForm({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tax_number: '',
    company_name: '',
    reason: 'KARŞILIKSIZ_CEK',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const supabase = createClient();
    
    // Veritabanına kayıt atıyoruz
    const { error } = await supabase
      .from('incidents') // Tablo adın neyse (reports, incidents vb.)
      .insert([
        { 
          target_tax_id: formData.tax_number,
          target_company_name: formData.company_name,
          incident_type: formData.reason,
          details: formData.description,
          status: 'PENDING' // Onay bekliyor
        }
      ]);

    if (!error) {
      alert("Bildirim başarıyla merkeze iletildi.");
      onClose();
    } else {
      console.error(error);
      alert("Hata oluştu, lütfen tekrar deneyin.");
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0b1222] border border-red-500/20 rounded-[2.5rem] p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <ShieldAlert className="text-red-500" />
          <h2 className="text-lg font-black italic uppercase text-white">Karşılıksız Evrak Bildir</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            placeholder="Vergi Numarası / VKN"
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-red-500/50"
            onChange={(e) => setFormData({...formData, tax_number: e.target.value})}
            required
          />
          <input 
            placeholder="Firma Ünvanı"
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-red-500/50"
            onChange={(e) => setFormData({...formData, company_name: e.target.value})}
            required
          />
          <textarea 
            placeholder="Olay Detayı (Tutar, Vade vb.)"
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm min-h-[100px] outline-none focus:border-red-500/50"
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2"
          >
            {loading ? "Gönderiliyor..." : <><Send size={16}/> Bildirimi Tamamla</>}
          </button>
        </form>
      </div>
    </div>
  );
}