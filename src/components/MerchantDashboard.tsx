'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation'; 
import { 
  Search, LogOut, BrainCircuit, Database, Zap, Megaphone 
} from 'lucide-react';

// BİLEŞENLER
import RadarCard, { PlatformData } from '@/components/RadarCard'; 
import MarketRadar from '@/components/MarketRadar'; 
import MarketFlow from '@/components/Marketflow'; 
import ReportForm from '@/components/ReportForm';
import AnalysisEngine from '@/components/AnalysisEngine';
import FooterAI from '@/components/FooterAi'; 
import IntelligenceFlow from '@/components/IntelligenceFlow'; 
import AskCekAppAI from '@/components/AskCekAppAI'; 
import FindeksAI from '@/components/FindeksAi'; 
import ApiConnectModal from '@/components/ApiConnectModal';

// VERİ KATMANI
import { createClient } from '@/database/client';

export default function MerchantDashboard({ user }: { user: any }) {
  const router = useRouter();

  // 🧩 UI & NAVİGASYON STATE'LERİ
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); 
  const [selectedPlatform, setSelectedPlatform] = useState('');
  
  // 🛡️ ANALİZ STATE'LERİ
  const [radarStatus, setRadarStatus] = useState<'IDLE' | 'STABLE' | 'CRITICAL'>('IDLE');
  const [targetCompany, setTargetCompany] = useState<string>('');
  const [selectedAnalysis, setSelectedAnalysis] = useState<any>(null);

  // PAZARYERİ STATE
  const [marketPlatforms, setMarketPlatforms] = useState<PlatformData[]>([
    { name: 'TRENDYOL', kesinlesmis: 0, valorlu: 0, trend: 'neutral' },
    { name: 'HEPSİBURADA', kesinlesmis: 0, valorlu: 0, trend: 'neutral' },
    { name: 'AMAZON', kesinlesmis: 0, valorlu: 0, trend: 'neutral' },
    { name: 'N11', kesinlesmis: 0, valorlu: 0, trend: 'neutral' },
  ]);

  // Eksik olan fonksiyonlar
  const handleValidationError = (msg: string) => console.warn("Validation Error:", msg);
  const handleBeforeUpload = async (files: File[]) => true;

  // ✅ VERİ ÇEKME
  const fetchMarketData = useCallback(async () => {
    const supabase = createClient();
    if (!user) return;

    const { data: balances } = await supabase.from('platform_balances').select('*').eq('user_id', user.id);
    if (balances) {
      setMarketPlatforms(prev => prev.map(p => {
        const dbRow = balances.find(b => b.platform.toUpperCase() === p.name);
        return dbRow ? { ...p, kesinlesmis: Number(dbRow.kesinlesmis_bakiye), valorlu: Number(dbRow.valorlu_bakiye), trend: dbRow.trend as any } : p;
      }));
    }
  }, [user]);

  // ✅ ANALİZ TETİKLEYİCİ
  const handleAnalysisResult = useCallback((analysis: any, name?: string) => {
    if (!analysis) return;
    const finalName = name || analysis.company_name || analysis.title || "İsimsiz Sorgu";
    setTargetCompany(finalName);
    setSelectedAnalysis(analysis); 
    const currentStatus = analysis.status || (analysis.risk_score && analysis.risk_score < 70 ? 'CRITICAL' : 'STABLE');
    setRadarStatus(currentStatus as any);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // ✅ ÇIKIŞ İŞLEMİ
  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/'; 
  };

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 5000);
    return () => clearInterval(interval);
  }, [fetchMarketData]);

  return (
    <div className="flex flex-col min-w-0 w-full animate-in fade-in duration-500 bg-[#060a14]">
      <header className="w-full border-b border-white/5 sticky top-0 z-50 bg-[#060a14]/95 backdrop-blur-md">
        <div className="py-4 px-6 flex justify-between items-center max-w-[1800px] mx-auto">
          <IntelligenceFlow />
          <div className="flex items-center gap-4">
             {isLoggedIn && (
                <button onClick={handleSignOut} className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 transition-all text-red-500 text-[10px] font-black uppercase tracking-widest">
                  <LogOut size={14} /> Çıkış
                </button>
             )}
          </div>
        </div>
      </header>

      <RadarCard platforms={marketPlatforms} onPlatformClick={(n) => { setSelectedPlatform(n); setIsApiModalOpen(true); }} />

      <main className="max-w-[1800px] mx-auto p-4 md:p-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-[#0b1222]/50 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <div className="p-6 flex items-center gap-2 border-b border-white/5">
                <Database size={16} className="text-teal-500" />
                <span className="text-[10px] font-black italic uppercase tracking-widest text-slate-400">Canlı Veri Akışı</span>
              </div>
              <MarketFlow />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-8">
            <div className={`relative min-h-[600px] bg-[#0b1222]/50 rounded-[3.5rem] border transition-all duration-700 p-2 shadow-2xl 
              ${radarStatus === 'STABLE' ? 'border-teal-500/30 shadow-teal-500/5' : radarStatus === 'CRITICAL' ? 'border-red-500/30 ring-1 ring-red-500/20 shadow-red-500/5' : 'border-white/5'}`}>
              
              {radarStatus === 'IDLE' ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10 space-y-6">
                  <div className="w-24 h-24 bg-teal-500/5 rounded-full flex items-center justify-center border border-teal-500/10">
                    <BrainCircuit size={40} className="text-teal-500/10 animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-[10px] font-black uppercase italic tracking-[0.3em] text-slate-700">Analiz Motoru Beklemede</h3>
                  </div>
                </div>
              ) : (
                <div className="animate-in fade-in zoom-in-95 duration-700">
                  <div className="px-8 pt-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className={`h-2 w-2 rounded-full ${radarStatus === 'STABLE' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500 animate-ping'}`} />
                        <span className={`text-[10px] font-black uppercase italic tracking-widest ${radarStatus === 'STABLE' ? 'text-emerald-500' : 'text-red-500'}`}>
                          {radarStatus === 'STABLE' ? 'GÜVENLİ TİCARİ PROFİL' : 'YÜKSEK RİSK ANALİZİ'}
                        </span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{targetCompany}</span>
                  </div>
                  {/* HATA BURADAYDI - PROPS EKLENDİ */}
                  <AnalysisEngine 
                    key={selectedAnalysis?.id || targetCompany} 
                    radarStatus={radarStatus} 
                    initialData={selectedAnalysis}
                    onValidationError={handleValidationError}
                    onBeforeUpload={handleBeforeUpload}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-center -mt-12 relative z-50">
              <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-8 py-3 bg-[#060a14] hover:bg-red-500/10 border border-red-500/30 rounded-full transition-all group shadow-2xl backdrop-blur-md">
                <Megaphone size={14} className="text-red-500 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black text-red-500 uppercase italic tracking-widest">Karşılıksız Bildirimi Yap</span>
              </button>
            </div>

            <div className="bg-[#0b1222]/50 rounded-[3rem] border border-white/5 p-2 shadow-2xl backdrop-blur-sm">
              <AskCekAppAI radarStatus={radarStatus} />
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="bg-gradient-to-b from-teal-500/10 to-[#0b1222]/80 border border-teal-500/20 rounded-[2.5rem] p-1 shadow-[0_0_50px_rgba(20,184,166,0.05)]">
              <div className="p-5 border-b border-white/5 flex items-center gap-3">
                 <Zap size={18} className="text-teal-500 fill-teal-500/20" />
                 <h4 className="text-[10px] font-black uppercase italic tracking-widest">Hızlı Risk Radarı</h4>
              </div>
              <div className="p-3">
                 <MarketRadar 
                    selectedResult={selectedAnalysis} 
                    onResult={(res: any) => { if(res) handleAnalysisResult(res, res.company_name); }} 
                 />
              </div>
            </div>
            <FindeksAI />
          </div>
        </div>
      </main>
      
      <FooterAI />
      
      <ReportForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ApiConnectModal isOpen={isApiModalOpen} onClose={() => setIsApiModalOpen(false)} platformName={selectedPlatform} onConnect={() => {}} />
    </div>
  );
}