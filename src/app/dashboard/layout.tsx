'use client';

import Sidebar from '@/components/Sidebar';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/database/client';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);
  // 🛑 activeTab state'ini buradan kaldırdık çünkü her değişimde {children}'ı öldürüyor.
  const [historyData, setHistoryData] = useState<any[]>([]);

  const fetchSidebarData = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    const { data: queries, error } = await supabase
      .from('queries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error && queries) {
      setHistoryData(queries);
    }
  }, []);

  useEffect(() => {
    fetchSidebarData();
    const interval = setInterval(fetchSidebarData, 10000);
    return () => clearInterval(interval);
  }, [fetchSidebarData]);

  // 🔥 SIDEBAR TIKLAMA HABERLEŞMESİ
  const handleHistorySelect = (item: any) => {
    // page.tsx bunu 'sidebar-select' event'i ile dinliyor, sayfa asla yenilenmiyor.
    const event = new CustomEvent('sidebar-select', { detail: item });
    window.dispatchEvent(event);
  };

  const handleHistoryDelete = async (id: string) => {
    const event = new CustomEvent('sidebar-delete', { detail: { id } });
    window.dispatchEvent(event);
    // Sidebar'ın anlık güncellenmesi için veriyi tekrar çek
    setTimeout(fetchSidebarData, 500);
  };

  return (
    <div className="flex h-screen bg-[#060a14] overflow-hidden">
      <Sidebar 
        isOpen={isOpen} 
        setIsOpen={setIsOpen} 
        activeTab="" // Artık Layout yönetmiyor, Sidebar pathname'e bakıyor
        onTabChange={() => {}} // Tab değişse bile Layout state'i değişmediği için children etkilenmez
        historyData={historyData}
        onHistorySelect={handleHistorySelect} 
        onDeleteHistory={handleHistoryDelete}
        onAuthClick={() => {}} 
      />

      <main className="flex-1 overflow-y-auto custom-scrollbar relative">
        {/* page.tsx burasıdır ve artık yukarıdaki state değişimlerinden etkilenmez */}
        {children}
      </main>
    </div>
  );
}