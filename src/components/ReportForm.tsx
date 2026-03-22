'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, Upload, ShieldAlert } from 'lucide-react';

// TS HATASINI ÇÖZEN KISIM BURASI
interface ReportFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReportForm: React.FC<ReportFormProps> = ({ isOpen, onClose }) => {
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({ front: false, back: false, type: 'ÇEK', amount: '', firm: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!formData.front || !formData.back || !formData.firm || !formData.amount) {
      alert("LÜTFEN TÜM ALANLARI DOLDURUN!");
      return;
    }
    setSuccess(true);
    setTimeout(() => { setSuccess(false); onClose(); }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-red-500/50 rounded-[3.5rem] p-10 max-w-xl w-full relative shadow-2xl">
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-500 hover:text-white"><X /></button>
        <div className="mb-10 border-l-4 border-red-600 pl-6 text-left">
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">EVRAK BİLDİRİMİ</h2>
          <p className="text-slate-500 text-[10px] font-black tracking-[0.3em] mt-2 uppercase italic">MANUEL VERİ GİRİŞİ</p>
        </div>
        {success ? (
          <div className="py-16 text-center animate-in zoom-in-95">
            <CheckCircle2 className="w-20 h-20 text-teal-500 mx-auto mb-6" />
            <p className="text-white font-black tracking-widest text-lg uppercase italic">KAYIT İLETİLDİ</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8 text-left">
            <div className="grid grid-cols-2 gap-6">
              <div onClick={() => setFormData({...formData, front: true})} className={`h-36 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${formData.front ? 'border-teal-500 bg-teal-500/10' : 'border-slate-800 bg-black/40'}`}>
                {formData.front ? <CheckCircle2 className="text-teal-500 w-10 h-10" /> : <Upload className="text-slate-700 w-10 h-10" />}
                <span className="text-[9px] font-black mt-3 text-slate-500 uppercase tracking-widest text-center px-2 italic">1) ÖN YÜZ</span>
              </div>
              <div onClick={() => setFormData({...formData, back: true})} className={`h-36 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${formData.back ? 'border-teal-500 bg-teal-500/10' : 'border-slate-800 bg-black/40'}`}>
                {formData.back ? <CheckCircle2 className="text-teal-500 w-10 h-10" /> : <Upload className="text-slate-700 w-10 h-10" />}
                <span className="text-[9px] font-black mt-3 text-slate-500 uppercase tracking-widest text-center px-2 italic">2) ARKA YÜZ</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6">
               <div className="text-left">
                  <label className="text-[10px] font-black text-slate-400 ml-3 mb-2 block tracking-widest uppercase italic">TİP</label>
                  <select className="w-full bg-black border border-slate-800 rounded-xl p-4 text-[11px] font-black text-white focus:border-red-500 outline-none" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}><option>ÇEK</option><option>SENET</option></select>
               </div>
               <div className="col-span-2 text-left">
                  <label className="text-[10px] font-black text-slate-400 ml-3 mb-2 block tracking-widest uppercase italic">TUTAR (TL)</label>
                  <input type="text" placeholder="0.000,00" className="w-full bg-black border border-slate-800 rounded-xl p-4 text-[11px] font-black text-white focus:border-red-500 outline-none" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
               </div>
            </div>
            <div className="text-left">
              <label className="text-[10px] font-black text-slate-400 ml-3 mb-2 block tracking-widest uppercase italic">FİRMA ÜNVANI</label>
              <input type="text" placeholder="RESMİ ÜNVANI YAZINIZ" className="w-full bg-black border border-slate-800 rounded-2xl p-5 text-[12px] font-black text-white focus:border-red-500 outline-none" value={formData.firm} onChange={(e) => setFormData({...formData, firm: e.target.value})} />
            </div>
            <button type="submit" className="w-full py-6 rounded-[2.5rem] bg-red-600 hover:bg-red-500 text-white font-black text-[14px] tracking-[0.4em] italic shadow-xl transition-all flex items-center justify-center gap-4 active:scale-95 cursor-pointer">
              <ShieldAlert className="w-6 h-6" /> İŞLEMİ BİTİR
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReportForm;