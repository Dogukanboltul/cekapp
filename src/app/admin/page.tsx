'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Users, Activity, RefreshCw, Database,
  ChevronRight, LayoutDashboard, Search,
  ShieldCheck, Clock
} from 'lucide-react';
import { createClient } from '@/database/client';

/* ================= TYPES ================= */
type Profile = {
  id: string;
  full_name: string | null;
  username: string | null;
  updated_at: string;
};

type Stats = {
  total: number;
  checks: number;
};

/* ================= COMPONENT ================= */
export default function CekappMasterAdmin() {
  const supabase = useMemo(() => createClient(), []);

  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, checks: 0 });
  const [error, setError] = useState<string | null>(null);

  /* ================= FETCH ================= */
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, username, updated_at')
        .order('id', { ascending: false })
        .limit(200);

      if (profilesError) throw profilesError;

      const { count: checkCount, error: checkError } = await supabase
        .from('checks')
        .select('*', { count: 'exact', head: true });

      if (checkError) throw checkError;

      setProfiles(profilesData || []);
      setStats({
        total: profilesData?.length || 0,
        checks: checkCount || 0
      });

    } catch (err: any) {
      console.error(err);
      setError('Veriler alınamadı. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  /* ================= INIT ================= */
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ================= REALTIME ================= */
  useEffect(() => {
    const channel = supabase
      .channel('realtime-profiles')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        () => fetchData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData, supabase]);

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#020202] text-[#f0f0f0] font-sans uppercase italic tracking-tighter">

      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-white to-red-500 z-50"></div>

      <main className="max-w-[1600px] mx-auto p-8">

        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 bg-teal-500 rounded-full animate-pulse"></div>
              <h1 className="text-6xl font-black">CEKAPP<span className="text-teal-500">.</span>CORE</h1>
            </div>
            <p className="text-slate-500 text-xs tracking-widest">MASTER PANEL</p>
          </div>

          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-teal-500 transition"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            YENİLE
          </button>
        </header>

        {/* ERROR */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-xl text-red-400">
            {error}
          </div>
        )}

        {/* METRICS */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <MetricCard label="Kullanıcılar" value={stats.total} icon={<Users />} />
          <MetricCard label="Sorgular" value={stats.checks} icon={<Activity />} />
          <MetricCard label="Sunucu" value="99.9" unit="%" icon={<Database />} />
        </div>

        {/* TABLE */}
        <div className="bg-[#080808] border border-white/10 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex justify-between">
            <h2 className="flex items-center gap-2 font-bold">
              <LayoutDashboard size={18} /> PROFILES
            </h2>
            <span className="text-xs text-slate-500 flex items-center gap-2">
              <Clock size={12} /> CANLI
            </span>
          </div>

          {/* CONTENT */}
          <div className="overflow-x-auto">

            {loading ? (
              <p className="p-6 text-slate-500">Yükleniyor...</p>
            ) : profiles.length === 0 ? (
              <p className="p-6 text-slate-500">Veri bulunamadı</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="text-slate-500 text-xs">
                  <tr>
                    <th className="p-4 text-left">Kullanıcı</th>
                    <th className="p-4 text-left">Username</th>
                    <th className="p-4 text-right">Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((p) => (
                    <tr key={p.id} className="border-t border-white/5 hover:bg-white/5">
                      <td className="p-4">
                        <div>
                          <p className="font-bold">{p.full_name || 'İsimsiz'}</p>
                          <p className="text-xs text-slate-500">
                            {new Date(p.updated_at).toLocaleString()}
                          </p>
                        </div>
                      </td>

                      <td className="p-4 text-slate-400">
                        @{p.username || 'yok'}
                      </td>

                      <td className="p-4 text-right">
                        <span className="text-green-400 text-xs flex items-center justify-end gap-1">
                          <ShieldCheck size={14} /> aktif
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

          </div>
        </div>

      </main>
    </div>
  );
}

/* ================= METRIC ================= */
function MetricCard({ label, value, icon, unit = "" }: any) {
  return (
    <div className="p-6 bg-[#080808] border border-white/10 rounded-2xl">
      <div className="flex justify-between mb-3">
        {icon}
        <span className="text-xs text-slate-500">{label}</span>
      </div>
      <div className="text-3xl font-bold">
        {value}{unit}
      </div>
    </div>
  );
}