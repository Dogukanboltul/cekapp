'use client';

import React, { useState } from "react";
import { Fingerprint, History, Users, Building2, Search, Loader2 } from "lucide-react";

export default function IdentityIntelligence() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const scanIdentity = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const serperKey = "8179010e4967fc4512262d77869b04f8a2b84dc8";
      // SADECE KİMLİK ODAKLI SORGU
      const q = `"${query}" (kuruluş yılı OR kurucusu OR sermayesi) site:ticaretsicil.gov.tr OR site:ito.org.tr`;

      const res = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: { "X-API-KEY": serperKey, "Content-Type": "application/json" },
        body: JSON.stringify({ q, gl: "tr", hl: "tr" })
      });
      const result = await res.json();
      
      // REALİSTİK AYIKLAMA (Snippet'tan yıl ve anahtar kelime avı)
      const allText = result.organic?.map((o: any) => o.snippet).join(" ").toLowerCase();
      const years = allText.match(/\b(19\d{2}|20\d{2})\b/g);
      const estYear = years ? Math.min(...years.map(Number)) : "Bilinmiyor";

      setData({
        year: estYear,
        type: allText.includes("limitet") ? "LTD. ŞTİ." : allText.includes("anonim") ? "A.Ş." : "Belirlenemedi",
        foundingNote: estYear !== "Bilinmiyor" && (2026 - Number(estYear) < 2) 
          ? "RİSK: YENİ KURULUŞ (DÜŞÜK GÜVEN)" 
          : "TECRÜBELİ YAPI"
      });
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  return (
    <div className="bg-[#0b1222] border border-white/5 rounded-[2.5rem] p-6 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Fingerprint className="text-teal-500" size={18} />
        <h3 className="text-[11px] font-black text-white uppercase italic tracking-widest">KİMLİK DOĞRULAMA (DNA)</h3>
      </div>

      <form onSubmit={scanIdentity} className="flex gap-2">
        <input 
          type="text" value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="FİRMA ADI..."
          className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-[10px] text-white outline-none focus:border-teal-500 uppercase"
        />
        <button className="bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-all">
          {loading ? <Loader2 className="animate-spin text-teal-500" size={16} /> : <Search size={16} className="text-slate-400" />}
        </button>
      </form>

      {data && (
        <div className="grid grid-cols-2 gap-3 pt-2 animate-in fade-in">
          <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
            <p className="text-[7px] text-slate-500 uppercase font-black">Kuruluş</p>
            <p className="text-[11px] text-white font-black italic">{data.year}</p>
          </div>
          <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
            <p className="text-[7px] text-slate-500 uppercase font-black">Tür</p>
            <p className="text-[11px] text-white font-black italic">{data.type}</p>
          </div>
          <div className="col-span-2 bg-teal-500/5 p-3 rounded-2xl border border-teal-500/10">
            <p className="text-[8px] text-teal-500 font-black italic uppercase leading-tight">{data.foundingNote}</p>
          </div>
        </div>
      )}
    </div>
  );
}