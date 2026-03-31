import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, X, RotateCcw, Scale } from 'lucide-react';

type Message = { role: 'user' | 'ai', content: string, nextSteps?: string[] };

export default function AskCekAppAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'auto' });
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
        body: JSON.stringify({ message: userMsg }),
      });
      const result = await response.json();
      if (result.success) {
        setChat(prev => [...prev, { role: 'ai', content: result.answer, nextSteps: result.steps }]);
      }
    } catch (error) {
      setChat(prev => [...prev, { role: 'ai', content: "Sistem hatası oluştu." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="fixed bottom-6 right-6 p-4 bg-[#1e293b] text-white rounded-2xl shadow-2xl z-50 hover:bg-indigo-700 transition-all"
      >
        {isOpen ? <X size={24} /> : <div className="flex items-center gap-2 font-bold text-sm">HUKUK ASİSTANI <MessageSquare size={20} /></div>}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[400px] h-[620px] bg-white rounded-[2rem] shadow-[0_40px_80px_rgba(0,0,0,0.5)] border-2 border-slate-300 flex flex-col z-50 overflow-hidden animate-in zoom-in duration-300">
          
          {/* HEADER - TAMAMEN OPAK */}
          <div className="p-6 bg-[#0f172a] text-white flex justify-between items-center shrink-0 border-b-2 border-indigo-500">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-xl"><Scale size={20} className="text-white" /></div>
              <div>
                <h3 className="font-black text-xs tracking-widest uppercase">ÇekApp Hukuk</h3>
                <p className="text-[10px] text-indigo-400 font-bold">KESİN ANALİZ</p>
              </div>
            </div>
            <button onClick={() => setChat([])} className="text-slate-400 hover:text-white p-1 transition-colors"><RotateCcw size={20}/></button>
          </div>

          {/* SOHBET ALANI */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#f8fafc]">
            {chat.length === 0 && (
              <div className="py-12 px-6 text-center">
                <div className="w-16 h-16 bg-white border-2 border-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">⚖️</div>
                <h4 className="text-black font-black text-xl mb-2">Ben ÇekApp Hukuk Asistanın.</h4>
                <p className="text-slate-800 font-bold text-xs">Sorun nedir? Yaz, anında analiz edeyim.</p>
              </div>
            )}

            {chat.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} gap-2`}>
                {/* MESAJ BALONU - AI CEVABI SİMSİYAH YAZI */}
                <div className={`max-w-[85%] px-5 py-4 rounded-[1.5rem] text-[14px] font-bold shadow-md leading-relaxed ${
                  m.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-white text-black border-2 border-slate-200 rounded-bl-none'
                }`}>
                  {m.content}
                </div>
                
                {/* BUTONLAR - NET VE SİYAH YAZILI */}
                {m.nextSteps && (
                  <div className="flex flex-wrap gap-2 px-1 mt-2 mb-4">
                    {m.nextSteps.map((step, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => handleAsk(step)} 
                        className="px-4 py-2 bg-white text-black border-2 border-[#1e293b] rounded-xl text-[11px] font-black uppercase tracking-wider hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm"
                      >
                        {step}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {loading && (
              <div className="flex gap-2 p-4 bg-white w-fit rounded-2xl border-2 border-slate-200 shadow-sm ml-2">
                <div className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-black rounded-full animate-bounce"></div>
              </div>
            )}
          </div>

          {/* INPUT ALANI */}
          <div className="p-5 bg-white border-t-2 border-slate-200">
            <div className="flex items-center gap-3 bg-slate-100 p-2 rounded-2xl border-2 border-slate-300 focus-within:border-indigo-600 focus-within:bg-white transition-all shadow-inner">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAsk(input)}
                placeholder="Hukuki sorunuzu yazın..." 
                className="flex-1 bg-transparent outline-none text-sm px-2 text-black font-black placeholder:text-slate-500"
              />
              <button 
                onClick={() => handleAsk(input)} 
                disabled={loading || !input.trim()}
                className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition-all"
              >
                <Send size={20}/>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}