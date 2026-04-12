'use client';

import React from 'react';
import { Download } from 'lucide-react';

export interface PDFSectionProps {
  req: any;
  userEmail: string;
  onDownloaded: () => void;
  formatCurrency: (amount: number) => string;
}

export default function PDFSection({ req, userEmail, onDownloaded, formatCurrency }: PDFSectionProps) {
  const handleDownload = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

      const primaryColor = "#14b8a6"; // Teal 500
      const darkColor = "#09090b";
      const grayColor = "#52525b";

      // --- 1. UST BILGI / HEADER ---
      doc.setFillColor(darkColor);
      doc.rect(0, 0, 210, 45, 'F');
      
      doc.setTextColor("#ffffff");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(26);
      doc.text("VENARI", 20, 25);
      doc.setFont("helvetica", "normal");
      doc.text("FINANCE", 65, 25);
      
      doc.setFontSize(9);
      doc.setTextColor(primaryColor);
      doc.text("DIJITAL LIKIDITE VE FINANSMAN TERMINALI - V1.0", 20, 34);

      let y = 60;

      // --- 2. BELGE BASLIGI ---
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(darkColor);
      doc.text("FAKTORING BILGI ILETIM VE PLATFORM ONAYI", 105, y, { align: "center" });
      
      y += 10;
      doc.setDrawColor(primaryColor);
      doc.setLineWidth(0.5);
      doc.line(20, y, 190, y);
      
      y += 15;

      // --- 3. ISLEM DETAYLARI TABLOSU ---
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("A. ISLEM KUNYESI VE FINANSAL DETAYLAR", 20, y);
      
      y += 8;
      const addDataRow = (label: string, value: string, currentY: number, isTotal = false) => {
        if (isTotal) {
          doc.setFillColor("#f0fdfa");
          doc.rect(20, currentY - 5, 170, 9, 'F');
          doc.setFont("helvetica", "bold");
          doc.setTextColor(primaryColor);
        } else {
          doc.setFont("helvetica", "normal");
          doc.setTextColor(grayColor);
        }
        
        doc.setFontSize(9);
        doc.text(label, 25, currentY);
        doc.text(value, 185, currentY, { align: "right" });
        doc.setDrawColor("#f4f4f5");
        doc.line(20, currentY + 4, 190, currentY + 4);
        return currentY + 10;
      };

      y = addDataRow("Sistematik Referans No:", `#VN-${req.id.toUpperCase().slice(0,12)}`, y);
      y = addDataRow("Basvuru Sahibi / Musteri:", userEmail, y);
      y = addDataRow("Bildirilen Alacak Tutari:", formatCurrency(req.amount), y);
      y = addDataRow("Olası Faktoring Orani:", `%${req.commission_rate || '0.00'}`, y);
      y = addDataRow("Venari Platform Komisyonu:", "0.00 TL (Tahsil Edilmeyecektir)", y);
      y = addDataRow("ONAYLANAN ISLEM TUTARI:", formatCurrency(req.final_offer_amount), y, true);

      y += 15;

      // --- 4. HUKUKI MADDELER ---
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(darkColor);
      doc.text("B. BILGI PAYLASIMI VE PLATFORM SARTLARI", 20, y);
      y += 8;

      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(grayColor);

      const madde1 = "1. SIFIR KOMISYON BEYANI: Venari Finance, yalnizca taraflari bir araya getiren guvenli bir teknoloji altyapisidir. Isbu islem dolayisiyla Musteri'den hicbir suretle platform kullanim ucreti, komisyon veya ek masraf tahsil edilmez.";
      
      const madde2 = "2. VERI ILETIM ONAYI: Musteri, isbu belge ile alacaga iliskin bilgilerin (fatura, cek, senet vb.) ve sirket evraklarinin, finansman saglanmasi amaciyla Venari Finance uzerinden lisansli faktoring sirketlerine iletilmesini gayrikabili rucu onaylar.";

      const madde3 = "3. TARAFSIZLIK VE TEMLIK: Venari Finance, alacagin temlik edildigi taraf veya isleme taraf olan bir finans kurulusu degildir. Temlik islemi, bu onayin ardindan Musteri ile ilgili faktoring firmasi arasinda ayrica yapilacak sozlesme ile gerceklesecektir.";

      const madde4 = "4. ISLAK IMZA VE YURURLUK: Isbu belge Venari Terminal tarafindan uretilmistir. Belgenin gecerliligi, ciktisinin alinarak Musteri tarafindan islak imza ve kase ile onaylanmasi ve sisteme geri yuklenmesi ile baslar.";

      const addParagraph = (text: string, currentY: number) => {
        const lines = doc.splitTextToSize(text, 170);
        doc.text(lines, 20, currentY, { lineHeightFactor: 1.5 });
        return currentY + (lines.length * 4.5) + 4;
      };

      y = addParagraph(madde1, y);
      y = addParagraph(madde2, y);
      y = addParagraph(madde3, y);
      y = addParagraph(madde4, y);

      // --- 5. ONAY KUTUCUKLARI (LEGAL CHECKBOXES) ---
      y += 5;
      doc.setDrawColor(primaryColor);
      doc.rect(20, y, 4, 4);
      doc.setFontSize(8);
      doc.text("Venari'nin komisyon almadigini ve alacaga taraf olmadigini anladim.", 28, y + 3);
      
      y += 8;
      doc.rect(20, y, 4, 4);
      doc.text("Alacak bilgilerimin finansman icin faktoring firmasina iletilmesini onayliyorum.", 28, y + 3);

      // --- 6. İMZA ALANI ---
      y += 35;
      doc.setDrawColor(darkColor);
      doc.setLineWidth(0.5);
      
      // Müşteri
      doc.line(20, y, 90, y);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(darkColor);
      doc.text("MUSTERI ONAYI", 20, y + 5);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text("Ad/Soyad - Kase ve Islak Imza", 20, y + 10);
      
      // Venari Terminal
      doc.line(120, y, 190, y);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("VENARI FINANCE TERMINALI", 120, y + 5);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text("Dijital Onay Kodu: " + req.id.slice(0,8).toUpperCase(), 120, y + 10);
      doc.text("Tarih: " + new Date().toLocaleDateString('tr-TR'), 120, y + 15);

      // --- 7. FOOTER ---
      doc.setFontSize(7);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(grayColor);
      doc.text("Bu dokuman KVKK ve 5070 sayili Elektronik Imza Kanunu standartlarina uygun olarak uretilmistir.", 105, 285, { align: "center" });

      doc.save(`Venari_Bilgi_Iletim_Onayi_${req.id.slice(0,8)}.pdf`);
      onDownloaded(); 
    } catch (error) {
      console.error("PDF Üretim Hatası:", error);
    }
  };

  return (
    <div className="space-y-8 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="relative group">
        <div className="absolute inset-0 bg-teal-500/20 blur-3xl rounded-full scale-50 group-hover:scale-100 transition-transform duration-700"></div>
        <div className="relative w-24 h-24 bg-zinc-900 border border-teal-500/20 text-teal-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl">
          <Download size={36} strokeWidth={2} />
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-3xl font-black uppercase italic text-white tracking-tighter">
          ADIM 1: <span className="text-teal-500">BİLGİ İLETİMİ ONAYI</span>
        </h2>
        <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-2xl max-w-sm mx-auto">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-relaxed">
            Bilgilerinizin <span className="text-white">komisyonsuz</span> bir şekilde faktoring firmasına iletilmesi için hazırlanan belgeyi indirin ve imzalayın.
          </p>
        </div>
      </div>
      
      <button 
        onClick={handleDownload} 
        className="w-full py-6 bg-teal-500 text-black font-black uppercase text-xs rounded-[1.5rem] hover:bg-teal-400 hover:scale-[1.02] transition-all shadow-[0_20px_40px_rgba(20,184,166,0.25)] flex items-center justify-center gap-3 active:scale-95"
      >
        <Download size={18} strokeWidth={3} /> BİLGİ İLETİM ONAYINI İNDİR
      </button>

      <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">
        İndirme işlemi sonrası 2. adım otomatik olarak aktifleşecektir.
      </p>
    </div>
  );
}