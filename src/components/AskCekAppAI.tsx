'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, X, RotateCcw, Scale, ShieldAlert } from 'lucide-react';

type Message = { role: 'user' | 'ai', content: string, nextSteps?: string[] };

interface AskCekAppAIProps {
  radarStatus?: 'IDLE' | 'STABLE' | 'CRITICAL';
  forceOpen?: boolean; 
}

export default function AskCekAppAI({ radarStatus, forceOpen }: AskCekAppAIProps) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { if (forceOpen) setIsOpen(true); }, [forceOpen]);

  // 🧠 ASİSTAN KARŞILAMA MANTIĞI (DİNAMİK)
  useEffect(() => {
    if (mounted && isOpen && chat.length === 0) {
      setLoading(true);
      setTimeout(() => {
        if (radarStatus === 'CRITICAL') {
          setChat([{ 
            role: 'ai', 
            content: "⚠️ DİKKAT: Sorguladığınız firma hakkında riskli bulgular (İcra/Konkordato) saptandı. Ticari güvenliğiniz için detaylı risk analizi yapmamı ister misiniz?",
            nextSteps: ["HUKUKİ RİSKLERİ GÖR", "ŞAHSİ KEFALET ALMALI MIYIM?", "HUKUKİ DANIŞMANA SOR"]
          }]);
        } else {
          // YEŞİL DURUM (STABLE / IDLE) KARŞILAMASI
          setChat([{ 
            role: 'ai', 
            content: "✅ ANALİZ TAMAMLANDI: Sorguladığınız firma hakkında herhangi bir riskli bulgu (İcra/Konkordato) SAPTANMADI. Mevcut sicil verileri stabil görünmektedir. Yine de detaylı risk analizi yapmamı ister misiniz?",
            nextSteps: ["HUKUKİ RİSKLERİ GÖR", "ŞAHSİ KEFALET ALMALI MIYIM?", "HUKUKİ DANIŞMANA SOR"]
          }]);
        }
        setLoading(false);
      }, 600);
    }
  }, [isOpen, radarStatus, chat.length, mounted]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat, loading]);

  const handleAsk = async (text: string) => {
    if (!text || text.trim().length === 0 || loading) return;
    const userMsg = text.trim();
    setLoading(true);
    setInput("");
    
    setChat(prev => [...prev, { role: 'user', content: userMsg }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMsg,
          isCritical: radarStatus === 'CRITICAL' 
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setChat(prev => [...prev, { role: 'ai', content: result.answer, nextSteps: result.steps }]);
      } else {
        setChat(prev => [...prev, { role: 'ai', content: "Alanında uzman avukatımız sizinle iletişime geçecektir." }]);
      }
    } catch (error) {
      setChat(prev => [...prev, { role: 'ai', content: "📡 Bağlantı hatası. Lütfen tekrar deneyin." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <>
      {/* TETİKLEYİCİ BUTON */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`fixed bottom-6 right-6 p-4 text-white rounded-2xl shadow-2xl z-[100] transition-all duration-500 hover:scale-105 active:scale-95 ${
          radarStatus === 'CRITICAL' 
          ? 'bg-red-600 animate-pulse ring-4 ring-red-600/20' 
          : 'bg-[#1e293b] hover:bg-indigo-700'
        }`}
      >
        {isOpen ? <X size={24} /> : (
          <div className="flex items-center gap-2 font-bold text-sm">
            {radarStatus === 'CRITICAL' && <ShieldAlert size={20} className="animate-bounce" />}
            HUKUK ASİSTANI <MessageSquare size={20} />
          </div>
        )}
      </button>

      {/* CHAT PENCERESİ */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[420px] h-[650px] bg-white rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.4)] border-2 border-slate-200 flex flex-col z-[100] overflow-hidden animate-in zoom-in duration-300">
          
          {/* HEADER */}
          <div className={`p-6 text-white flex justify-between items-center shrink-0 ${
            radarStatus === 'CRITICAL' ? 'bg-red-700' : 'bg-[#0f172a]'
          }`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl"><Scale size={20} /></div>
              <div>
                <h3 className="font-black text-xs tracking-widest uppercase">CekApp Hukuk Motoru</h3>
                <p className="text-[10px] text-white/60 font-bold uppercase tracking-tighter">
                  {radarStatus === 'CRITICAL' ? '⚠️ YÜKSEK RİSK TESPİTİ' : 'GÜVENLİ TİCARİ ANALİZ'}
                </p>
              </div>
            </div>
            <button onClick={() => { setChat([]); setInput(""); }} className="text-white/40 hover:text-white transition-colors">
              <RotateCcw size={18}/>
            </button>
          </div>

          {/* CHAT BODY */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#fdfdfe] scroll-smooth">
            {chat.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} gap-3`}>
                <div className={`max-w-[90%] px-5 py-4 rounded-[1.8rem] text-[14px] font-medium shadow-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : (radarStatus === 'CRITICAL' && i === 0)
                  ? 'bg-red-50 text-red-900 border-2 border-red-200 rounded-bl-none'
                  : 'bg-white text-slate-800 border-2 border-slate-100 rounded-bl-none shadow-indigo-100/50'
                }`}>
                  {m.content}
                </div>
                
                {m.nextSteps && (
                  <div className="flex flex-wrap gap-2 px-1 mt-1">
                    {m.nextSteps.map((step, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => handleAsk(step)} 
                        className="px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-wider bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                      >
                        {step}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-2 p-4 bg-white w-fit rounded-2xl border border-slate-100 shadow-sm ml-2">
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              </div>
            )}
          </div>

          {/* INPUT AREA */}
          <div className="p-5 bg-white border-t border-slate-100">
            <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border-2 border-slate-200 focus-within:border-indigo-600 transition-all">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAsk(input)}
                placeholder="Hukuki riskinizi sorgulayın..." 
                className="flex-1 bg-transparent outline-none text-sm px-3 text-slate-900 font-semibold"
              />
              <button 
                onClick={() => handleAsk(input)} 
                disabled={loading || !input.trim()}
                className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-slate-300 transition-all"
              >
                <Send size={18}/>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}