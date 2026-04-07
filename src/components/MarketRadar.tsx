'use client';

import React, { useState, useEffect } from "react";
import { 
  Zap, Loader2, BrainCircuit, CheckCircle2, 
  ChevronRight, Scale
} from "lucide-react";
import { createClient } from '@/database/client';

interface MarketRadarProps {
  onResult?: (analysis: any, query: string, canProceed: boolean) => void;
  selectedResult?: any; 
}

export default function MarketRadar({ onResult, selectedResult }: MarketRadarProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  // 🛡️ MERKEZİ KARAR MEKANİZMASI (KALE)
  const processDecision = (result: any, companyName: string) => {
    const isCritical = result.brain?.status === "CRITICAL";
    if (onResult) {
      // Eğer CRITICAL ise canProceed = false döner, aksi halde true.
      onResult(result, companyName, !isCritical);
    }
  };

  // ✅ Sidebar'dan seçim yapıldığında veriyi yükle ve kararı tetikle
  useEffect(() => {
    if (selectedResult) {
      // 🧠 Hafızadan/DB'den gelen veriyi tam yapısına kavuştur
      const dataToSet = selectedResult.brain_data || selectedResult;
      
      // Veri yapısı esnekliği için (brain objesi içindeyse veya direkt kendisiyse)
      const finalData = dataToSet.brain ? dataToSet : { 
        brain: {
          status: selectedResult.status === 'completed' ? (selectedResult.risk_score < 30 ? 'CRITICAL' : 'STABLE') : (selectedResult.status || 'STABLE'),
          score: selectedResult.risk_score?.toString() || "0",
          insight: dataToSet.insight || "GEÇMİŞ SORGULAMA VERİSİ YÜKLENDİ.",
          tags: dataToSet.tags || []
        },
        alerts: dataToSet.alerts || []
      };

      setAnalysis(finalData);
      setQuery(selectedResult.company_name || selectedResult.tax_no || "");
      
      // Geçmişten seçilse dahi kale kontrolünü çalıştırarak Dashboard'u kilitle/aç
      processDecision(finalData, selectedResult.company_name || selectedResult.tax_no || "");
    }
  }, [selectedResult]);

  const handleDeepScan = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuery = query.trim().toUpperCase();
    if (!cleanQuery) return;

    setLoading(true);
    setAnalysis(null);

    try {
      // 🌐 Search API Integration
      const serperKey = "8179010e4967fc4512262d77869b04f8a2b84dc8";
      const searchQuery = `"${cleanQuery}" (icra OR dava OR konkordato OR "borç yapılandırma" OR iflas OR "karşılıksız çek") site:ilan.gov.tr OR site:haberler.com OR site:memurlar.net`;

      const response = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: { "X-API-KEY": serperKey, "Content-Type": "application/json" },
        body: JSON.stringify({ q: searchQuery, gl: "tr", hl: "tr", num: 8 })
      });

      const data = await response.json();
      const organic = data?.organic || [];

      // 🔍 Risk Analiz Motoru
      const foundAlerts = organic.map((item: any) => {
        const text = (item.title + " " + item.snippet).toLowerCase();
        if (text.includes("icra")) return { type: 'DANGER', label: 'İCRA KAYDI', msg: item.title, link: item.link };
        if (text.includes("konkordato")) return { type: 'DANGER', label: 'KONKORDATO', msg: item.title, link: item.link };
        if (text.includes("iflas")) return { type: 'DANGER', label: 'İFLAS KARARI', msg: item.title, link: item.link };
        if (text.includes("karşılıksız")) return { type: 'WARNING', label: 'ÇEK SORUNU', msg: item.title, link: item.link };
        if (text.includes("dava")) return { type: 'INFO', label: 'HUKUKİ TAKİP', msg: item.title, link: item.link };
        return null;
      }).filter(Boolean);

      const hasDanger = foundAlerts.some((a: any) => a.type === 'DANGER');
      const hasWarning = foundAlerts.some((a: any) => a.type === 'WARNING');
      
      const brainPower = {
        status: hasDanger ? "CRITICAL" : hasWarning ? "CAUTION" : "STABLE",
        score: hasDanger ? "15" : hasWarning ? "55" : "98",
        summary: hasDanger ? "YÜKSEK RİSK: VARLIK HACZİ VEYA TASFİYE SİNYALİ." : "ORTA RİSK: ÖDEME DİSİPLİNİNDE DALGALANMA.",
        insight: hasDanger 
          ? "Sistem aktif icra veya konkordato ilanı saptadı. İşlem durdurulmalı."
          : hasWarning 
            ? "Piyasada negatif veriler var. Vadeli işlemlerde ek teminat stratejisi izlenmeli."
            : "Dijital ayak izi ve sicil kayıtları şeffaf. Yakın dönemde olumsuz bir ilana rastlanmadı.",
        tags: hasDanger ? ["İflas Riski", "Hukuki Blokaj"] : hasWarning ? ["Gecikme Riski", "Sınırlı Güven"] : ["Stabil Sicil", "Tam Onay"]
      };

      const finalResult = { alerts: foundAlerts.slice(0, 3), brain: brainPower };
      setAnalysis(finalResult);

      // 🔥 DB KAYIT (UPSERT STRATEJİSİ)
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await supabase.from('queries').upsert({
          user_id: user.id,
          tax_no: cleanQuery, 
          company_name: cleanQuery,
          risk_score: parseInt(brainPower.score),
          status: 'completed',
          brain_data: finalResult 
        }, { onConflict: 'user_id, tax_no' });
      }

      processDecision(finalResult, cleanQuery);

    } catch (err) {
      console.error("Scan error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="space-y-4 w-full animate-in fade-in duration-700">
      <div className="bg-[#0b1222] border border-white/10 rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden group">
        <div className="absolute -right-6 -top-6 opacity-5 group-hover:opacity-15 transition-all duration-1000">
          <BrainCircuit size={140} className="text-teal-500 animate-pulse" />
        </div>
        
        <div className="relative z-10 space-y-5 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-teal-500/10 p-2 rounded-xl border border-teal-500/20">
                 <BrainCircuit size={18} className="text-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
              </div>
              <div>
                <h3 className="text-[11px] font-black text-white tracking-widest uppercase italic leading-none">RISK RADAR</h3>
                <p className="text-[7px] font-bold text-teal-500/50 uppercase mt-1 italic tracking-tighter">AKIL YÜRÜTME MOTORU</p>
              </div>
            </div>
            {analysis && (
              <div className={`px-3 py-1 rounded-full border text-[9px] font-black italic tracking-tighter ${analysis.brain?.status === 'STABLE' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                RİSK SKORU: %{analysis.brain?.score}
              </div>
            )}
          </div>

          <form onSubmit={handleDeepScan} className="flex gap-2">
            <input 
              type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="FİRMA ÜNVANI SORGULA..."
              className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-4 text-[11px] font-black text-white outline-none focus:border-teal-900 uppercase italic placeholder:text-white/10 transition-all"
            />
            <button 
              type="submit" disabled={loading} 
              className="shrink-0 bg-teal-900 hover:bg-teal-800 w-12 h-12 flex items-center justify-center rounded-xl transition-all"
            >
              {loading ? <Loader2 className="animate-spin text-white" size={20} /> : <Zap size={20} className="text-white fill-white" />}
            </button>
          </form>

          {analysis && !loading && (
            <div className="animate-in slide-in-from-top-4 duration-500 space-y-4 pt-2">
              <div className={`p-5 rounded-[2rem] border relative overflow-hidden ${analysis.brain?.status === 'STABLE' ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-red-500/5 border-red-500/10'}`}>
                <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2">
                    <Scale size={12} className={analysis.brain?.status === 'STABLE' ? 'text-emerald-500' : 'text-red-500'} />
                    <span className={`text-[9px] font-black uppercase italic ${analysis.brain?.status === 'STABLE' ? 'text-emerald-500' : 'text-red-500'}`}>STRATEJİK ANALİZ</span>
                  </div>
                </div>
                
                <p className="text-[11px] font-black text-white italic leading-relaxed uppercase mb-3">
                  "{analysis.brain?.insight}"
                </p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {analysis.brain?.tags?.map((tag: string, i: number) => (
                    <span key={i} className="text-[7px] font-black bg-white/5 px-2 py-1 rounded-md text-slate-400 border border-white/5 uppercase italic">#{tag}</span>
                  ))}
                </div>
              </div>

              <div className="space-y-2 text-left">
                <p className="text-[8px] font-black text-slate-600 uppercase italic px-2 tracking-widest">SİCİL KANITLARI:</p>
                {analysis.alerts?.length > 0 ? (
                  analysis.alerts.map((alert: any, i: number) => (
                    <a 
                      key={i} href={alert.link} target="_blank" rel="noopener noreferrer"
                      className="group/item bg-black/40 border border-white/5 p-4 rounded-2xl flex flex-col gap-1 border-l-4 hover:bg-white/5 transition-all"
                      style={{ borderLeftColor: alert.type === 'DANGER' ? '#ef4444' : alert.type === 'WARNING' ? '#f59e0b' : '#3b82f6' }}
                    >
                      <div className="flex justify-between items-center">
                        <span className={`text-[8px] font-black uppercase italic ${alert.type === 'DANGER' ? 'text-red-500' : 'text-amber-500'}`}>{alert.label}</span>
                        <ChevronRight size={12} className="text-slate-700 group-hover/item:text-white transition-all" />
                      </div>
                      <p className="text-[10px] font-black text-white/80 italic leading-snug uppercase line-clamp-2">{alert.msg}</p>
                    </a>
                  ))
                ) : (
                  <div className="bg-emerald-950/20 border border-emerald-900/30 p-5 rounded-2xl flex items-center gap-4 border-l-4 border-l-emerald-600">
                    <CheckCircle2 size={24} className="text-emerald-500 shrink-0" />
                    <p className="text-[9px] font-black text-white/50 uppercase italic">TEMİZ SİCİL: AKTİF OLUMSUZ KAYIT TESPİT EDİLEMEDİ.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}