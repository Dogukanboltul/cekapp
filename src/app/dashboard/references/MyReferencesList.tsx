'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/database/client';

export default function MyReferencesList({ refreshKey }: { refreshKey: number }) {
  const supabase = useMemo(() => createClient(), []);
  const [refs, setRefs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('business_references')
      .select(`
        id, status, created_at,
        target:target_id ( company_name, full_name, tax_no )
      `)
      .eq('requester_id', user.id)
      .order('created_at', { ascending: false });

    setRefs(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  return (
    <div className="bg-[#0f0f0f] p-8 rounded-3xl space-y-6">

      <h2 className="text-2xl font-black italic">REFERANSLARIM</h2>

      {loading ? (
        <Loader2 className="animate-spin" />
      ) : refs.length === 0 ? (
        <p className="text-gray-500 text-sm">Henüz referans yok</p>
      ) : (
        <div className="space-y-4">

          {refs.map(r => (
            <div key={r.id} className="p-5 bg-black rounded-2xl flex justify-between">

              <div>
                <p className="font-bold">
                  {r.target?.company_name || r.target?.full_name}
                </p>

                <p className="text-xs text-gray-500">
                  {new Date(r.created_at).toLocaleDateString('tr-TR')}
                </p>
              </div>

              <div className={`text-xs font-black px-3 py-1 rounded-lg ${
                r.status === 'APPROVED'
                  ? 'bg-teal-500/10 text-teal-400'
                  : r.status === 'REJECTED'
                  ? 'bg-red-500/10 text-red-400'
                  : 'bg-blue-500/10 text-blue-400'
              }`}>
                {r.status === 'PENDING'
                  ? 'BEKLİYOR'
                  : r.status === 'APPROVED'
                  ? 'ONAYLANDI'
                  : 'RED'}
              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}