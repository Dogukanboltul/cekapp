'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Loader2, ArrowUpRight } from 'lucide-react';
import { createClient } from '@/database/client';

export default function ReferenceRequestForm({ onSuccess }: { onSuccess: () => void }) {
  const supabase = useMemo(() => createClient(), []);

  const [query, setQuery] = useState('');
  const [companies, setCompanies] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) {
      setCompanies([]);
      return;
    }

    const delay = setTimeout(async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, company_name, full_name, tax_no')
        .or(`tax_no.eq.${query},company_name.ilike.%${query}%,full_name.ilike.%${query}%`)
        .limit(5);

      setCompanies(data || []);
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  const sendRequest = async () => {
    if (!selected) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setLoading(true);

    const { error } = await supabase
      .from('business_references')
      .insert([
        {
          requester_id: user.id,
          target_id: selected.id,
          status: 'PENDING'
        }
      ]);

    setLoading(false);

    if (!error) {
      setQuery('');
      setSelected(null);
      setCompanies([]);
      onSuccess();
    }
  };

  return (
    <div className="bg-[#0f0f0f] p-8 rounded-3xl space-y-6">

      <h2 className="text-2xl font-black italic">REFERANS İSTE</h2>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Firma adı / VKN"
        className="w-full bg-black border border-white/10 px-4 py-4 rounded-xl"
      />

      {companies.map(c => (
        <button
          key={c.id}
          onClick={() => setSelected(c)}
          className="w-full flex justify-between p-3 bg-black rounded-xl"
        >
          {c.company_name || c.full_name}
          <ArrowUpRight size={16} />
        </button>
      ))}

      {selected && (
        <div className="p-4 bg-teal-500/10 rounded-xl space-y-3">
          <p className="font-bold">
            {selected.company_name || selected.full_name}
          </p>

          <button
            onClick={sendRequest}
            className="w-full bg-teal-500 text-black py-3 rounded-xl font-bold"
          >
            {loading ? 'GÖNDERİLİYOR...' : 'REFERANS İSTE'}
          </button>
        </div>
      )}

    </div>
  );
}