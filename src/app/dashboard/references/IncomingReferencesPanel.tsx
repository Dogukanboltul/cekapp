'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import { createClient } from '@/database/client';

export default function IncomingReferencesPanel({ onAction }: { onAction: () => void }) {
  const supabase = useMemo(() => createClient(), []);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIncoming = async () => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('business_references')
      .select(`
        id, status, created_at,
        requester:requester_id ( company_name, full_name )
      `)
      .eq('target_id', user.id)
      .eq('status', 'PENDING');

    setData(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchIncoming();
  }, [onAction]);

  const updateStatus = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    await supabase
      .from('business_references')
      .update({ status })
      .eq('id', id);

    fetchIncoming();
    onAction();
  };

  if (loading) return <Loader2 className="animate-spin" />;

  if (data.length === 0) return null;

  return (
    <div className="bg-teal-500/5 border border-teal-500/20 p-8 rounded-3xl">

      <h2 className="font-black text-xl mb-6">GELEN REFERANSLAR</h2>

      <div className="space-y-4">
        {data.map(r => (
          <div key={r.id} className="flex justify-between p-4 bg-black rounded-xl">

            <div>
              {r.requester?.company_name || r.requester?.full_name}
            </div>

            <div className="flex gap-2">

              <button
                onClick={() => updateStatus(r.id, 'APPROVED')}
                className="bg-teal-500 text-black px-3 py-1 rounded"
              >
                <Check size={14}/>
              </button>

              <button
                onClick={() => updateStatus(r.id, 'REJECTED')}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                <X size={14}/>
              </button>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
}