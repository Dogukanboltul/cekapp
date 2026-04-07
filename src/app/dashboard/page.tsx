'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { 
  X, Search, Activity, Megaphone, User, LogOut, 
  ShieldAlert, BrainCircuit, Database
} from 'lucide-react';
import Tesseract from 'tesseract.js';

// BİLEŞENLER
import Sidebar from '@/components/Sidebar'; 
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
import { connectMarketplace } from '@/lib/Action/MarketplaceActions'; 

export default function Dashboard() {
  const router = useRouter();

  // 🧩 UI & NAVİGASYON STATE'LERİ
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // 👤 AUTH STATE
  const [isLoggedIn, setIsLoggedIn] = useState(true); 
  
  // 🛡️ MODAL STATES
  const [isFindeksModalOpen, setIsFindeksModalOpen] = useState(false); 
  const [isRiskRadarModalOpen, setIsRiskRadarModalOpen] = useState(false);

  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // 🛡️ ANALİZ STATE'LERİ
  const [radarStatus, setRadarStatus] = useState<'IDLE' | 'STABLE' | 'CRITICAL'>('IDLE');
  const [targetCompany, setTargetCompany] = useState<string>('');
  const [selectedAnalysis, setSelectedAnalysis] = useState<any>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState<any[]>([]); 

  // PAZARYERİ STATE
  const [marketPlatforms, setMarketPlatforms] = useState<PlatformData[]>([
    { name: 'TRENDYOL', kesinlesmis: 0, valorlu: 0, trend: 'neutral' },
    { name: 'HEPSİBURADA', kesinlesmis: 0, valorlu: 0, trend: 'neutral' },
    { name: 'AMAZON', kesinlesmis: 0, valorlu: 0, trend: 'neutral' },
    { name: 'N11', kesinlesmis: 0, valorlu: 0, trend: 'neutral' },
  ]);

  // ✅ GERÇEK VERİ ÇEKME FONKSİYONU
  const fetchMarketData = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    // 1. Bakiyeleri Çek
    const { data: balances } = await supabase
      .from('platform_balances')
      .select('*')
      .eq('user_id', user.id);

    if (balances) {
      setMarketPlatforms(prev => prev.map(p => {
        const dbRow = balances.find(b => b.platform.toUpperCase() === p.name);
        return dbRow ? { 
          name: p.name, 
          kesinlesmis: Number(dbRow.kesinlesmis_bakiye), 
          valorlu: Number(dbRow.valorlu_bakiye), 
          trend: dbRow.trend as any 
        } : p;
      }));
    }

    // 2. Sorgu Geçmişini Çek
    const { data: queries } = await supabase
      .from('queries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (queries) {
      const formattedQueries = queries.map(q => ({
        ...q,
        title: q.company_name || q.tax_no || "Bilinmeyen Sorgu",
        subtitle: q.tax_no ? `VKN: ${q.tax_no}` : new Date(q.created_at).toLocaleDateString('tr-TR'),
        type: q.type || 'COMPANY',
        risk_score: q.risk_score || 0,
        status: q.status || 'STABLE'
      }));
      setHistoryData(formattedQueries);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    window.location.href = '/logout-success'; 
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'FINDEKS') setIsFindeksModalOpen(true);
    else if (tab === 'RISK_SORGULA') setIsRiskRadarModalOpen(true);
  };

  // ✅ ANALİZ SONUCU İŞLEME (GÜNCELLENMİŞ KALE MANTIĞI)
  const handleAnalysisResult = (analysis: any, name: string, canProceed?: boolean) => {
    const displayName = name || analysis.company_name || analysis.title;
    setTargetCompany(displayName);
    
    const brainData = analysis.brain_data ? analysis.brain_data : analysis;
    setSelectedAnalysis(analysis); 
    
    const currentStatus = brainData?.brain?.status || brainData?.status || 'STABLE';

    if (canProceed === false || currentStatus === 'CRITICAL') {
        setRadarStatus('CRITICAL');
    } else {
        setRadarStatus('STABLE');
    }
    
    setIsRiskRadarModalOpen(false);
    setIsFindeksModalOpen(false);
    fetchMarketData(); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => { fetchMarketData(); }, []);

  const validateFilesLocally = async (files: File[]) => {
    setVerificationError(null);
    setIsProcessing(true);
    const criticalKeywords = ['ÇEK', 'CEK', 'SENET', 'BONO', 'VADE', 'BANKA', 'TUTAR'];
    try {
      for (const file of files) {
        const { data: { text } } = await Tesseract.recognize(file, 'tur');
        if (!criticalKeywords.some(kw => text.toUpperCase().includes(kw))) {
          setVerificationError("YÜKLENEN GÖRSELDE ÇEK/SENET İBARESİ BULUNAMADI.");
          setIsProcessing(false);
          return false;
        }
      }
      setIsProcessing(false);
      return true;
    } catch (err) {
      setIsProcessing(false);
      return true; 
    }
  };

  return (
    <div className="flex min-h-screen bg-[#060a14] text-slate-100 font-sans selection:bg-teal-500/30">
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        historyData={historyData}
        onHistorySelect={(item) => handleAnalysisResult(item, item.title)}
        onAuthClick={() => setIsAuthModalOpen(true)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        
        {(isFindeksModalOpen || isRiskRadarModalOpen) && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#060a14]/85 backdrop-blur-2xl" onClick={() => { setIsFindeksModalOpen(false); setIsRiskRadarModalOpen(false); }} />
            <div className="relative w-full max-w-2xl bg-[#0b1222] border border-white/10 rounded-[3rem] p-4 pt-12 shadow-2xl animate-in zoom-in duration-300">
              <button onClick={() => { setIsFindeksModalOpen(false); setIsRiskRadarModalOpen(false); }} className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-slate-400 hover:text-white"><X size={24} /></button>
              <div className="px-8 mb-6 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20">{isFindeksModalOpen ? <Activity size={20} className="text-teal-500" /> : <Search size={20} className="text-teal-500" />}</div>
                <h2 className="text-sm font-black italic uppercase tracking-widest text-white">{isFindeksModalOpen ? 'Findeks Finansal Analiz' : 'Risk Radar Sorgulama'}</h2>
              </div>
              {isFindeksModalOpen ? <FindeksAI /> : <MarketRadar selectedResult={selectedAnalysis} onResult={handleAnalysisResult} />}
            </div>
          </div>
        )}

        <header className="w-full border-b border-white/5 sticky top-0 z-50 bg-[#060a14]/95 backdrop-blur-md">
          <div className="py-4 px-6 flex justify-between items-center w-full">
            <div className="flex-1 max-w-2xl"><IntelligenceFlow /></div>
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                 {isLoggedIn ? (
                   <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all group shadow-lg">
                     <LogOut size={14} className="text-red-500 group-hover:-translate-x-1 transition-transform" />
                     <span className="text-[10px] font-black italic text-red-500 uppercase tracking-widest">Güvenli Çıkış</span>
                   </button>
                 ) : (
                   <button onClick={() => window.location.href = '/logout-success'} className="flex items-center gap-2 px-5 py-1.5 rounded-full bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 transition-all group">
                     <User size={14} className="text-teal-500" />
                     <span className="text-[10px] font-black italic text-teal-500 uppercase tracking-widest">Giriş Yap</span>
                   </button>
                 )}
               </div>
               <span className="hidden md:block text-[10px] font-black italic text-slate-600 tracking-widest uppercase">Operasyon Merkezi</span>
            </div>
          </div>
        </header>

        <RadarCard platforms={marketPlatforms} onPlatformClick={(n) => { setSelectedPlatform(n); setIsApiModalOpen(true); }} />

        <main className="flex-1 w-full p-4 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <div className="lg:col-span-3 order-3 lg:order-1 space-y-8">
              <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-1 shadow-2xl min-h-[400px]">
                 <div className="p-6 flex items-center gap-2 border-b border-white/5">
                   <Database size={16} className="text-teal-500" />
                   <span className="text-[10px] font-black italic uppercase tracking-widest text-slate-400">Veri Akışı</span>
                 </div>
                 <MarketFlow />
              </div>
            </div>

            <div className="lg:col-span-6 space-y-10 order-1 lg:order-2">
              <div className="relative group">
                {/* 🛡️ KALE GÖRSELİ */}
                {radarStatus === 'IDLE' && (
                  <div className="absolute inset-0 z-40 bg-[#060a14]/90 backdrop-blur-xl rounded-[3.5rem] flex flex-col items-center justify-center border border-white/5 text-center p-10 space-y-8 animate-in fade-in duration-500">
                      <div className="relative w-20 h-20">
                         <div className="absolute inset-0 bg-teal-500/20 blur-3xl animate-pulse" />
                         <BrainCircuit size={80} className="text-teal-500/40" />
                      </div>
                      <div className="space-y-4">
                         <h4 className="font-black italic text-base tracking-[0.2em] uppercase">Güvenli Analiz Protokolü</h4>
                         <p className="text-[11px] text-slate-400 px-4 max-w-xs mx-auto leading-relaxed">İşlem güvenliğiniz için lütfen sağ paneldeki <b>Risk Radar</b> üzerinden sorgulama yaparak başlayın.</p>
                      </div>
                  </div>
                )}
                
                <div className={`w-full bg-[#0b1222]/50 rounded-[3rem] border transition-all duration-700 p-2 shadow-2xl ${radarStatus === 'STABLE' ? 'border-teal-500/30' : radarStatus === 'CRITICAL' ? 'border-red-500/30 ring-1 ring-red-500/20' : 'border-white/5 opacity-30'}`}>
                  {radarStatus !== 'IDLE' && (
                    <div className="px-8 pt-5 flex items-center gap-3">
                      <span className="relative flex h-3 w-3">
                        <span className={`animate-ping absolute h-full w-full rounded-full opacity-75 ${radarStatus === 'STABLE' ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                        <span className={`relative rounded-full h-3 w-3 ${radarStatus === 'STABLE' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                      </span>
                      <span className={`text-[10px] font-black italic uppercase tracking-[0.3em] ${radarStatus === 'STABLE' ? 'text-emerald-500' : 'text-red-500'}`}>
                        {radarStatus === 'STABLE' ? 'Analiz Onaylandı:' : 'KRİTİK ENGEL:'} {targetCompany}
                      </span>
                    </div>
                  )}
                  
                  {/* AnalysisEngine */}
                  <AnalysisEngine 
                    key={targetCompany} 
                    radarStatus={radarStatus} 
                    onValidationError={setVerificationError} 
                    onBeforeUpload={validateFilesLocally} 
                  />

                  {/* 🛡️ OCR HATA MÜHÜRÜ */}
                  {verificationError && (
                    <div className="mx-6 mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 animate-bounce">
                      <ShieldAlert className="text-red-500 shrink-0" size={18} />
                      <p className="text-[10px] font-black text-red-500 uppercase italic tracking-widest leading-tight">
                        {verificationError}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-center -mt-6 relative z-50">
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-6 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-full transition-all group shadow-xl">
                  <Megaphone size={14} className="text-red-500 group-hover:animate-bounce" />
                  <span className="text-[10px] font-black text-red-500 uppercase italic tracking-widest">Karşılıksız Evrak Bildir</span>
                </button>
              </div>

              <div className="w-full bg-[#0b1222]/50 rounded-[3rem] border border-white/5 p-2 shadow-2xl text-white hover:border-teal-500/10 transition-colors">
                <AskCekAppAI />
              </div>
            </div>

            <div className="lg:col-span-3 flex flex-col gap-8 order-2 lg:order-3">
               <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-1 shadow-2xl transition-all hover:border-teal-500/20">
                 <MarketRadar selectedResult={selectedAnalysis} onResult={handleAnalysisResult} />
               </div>
               <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-1 shadow-2xl transition-all hover:border-teal-500/20">
                 <FindeksAI />
               </div>
            </div>
          </div>
        </main>
        
        <FooterAI />

        <ReportForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        <ApiConnectModal 
          isOpen={isApiModalOpen} 
          onClose={() => setIsApiModalOpen(false)} 
          platformName={selectedPlatform}
          onConnect={async (apiKey, apiSecret, sellerId, refCode) => {
            const res = await connectMarketplace(selectedPlatform.toLowerCase() as any, { sellerId, apiKey, apiSecret, refCode });
            if (res.success) { await fetchMarketData(); setIsApiModalOpen(false); }
          }}
        />
      </div>
    </div>
  );
}