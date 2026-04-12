'use client';

import React from 'react';
import { Download } from 'lucide-react';

interface PDFButtonProps {
  req: any;
  onDownloaded: () => void;
}

// jspdf'i sadece buton render olduğunda (client-side) içeri alıyoruz
export default function PDFButton({ req, onDownloaded }: PDFButtonProps) {
  const handleDownload = async () => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text("VENARI FINANCE - FAKTORING SOZLESMESI", 20, 30);
    doc.setFontSize(12);
    doc.text(`Islem ID: #VN-${req.id.toUpperCase()}`, 20, 50);
    doc.text(`Tutar: ${req.amount} TL`, 20, 60);
    
    doc.save(`Venari_Sozlesme_${req.id.slice(0,5)}.pdf`);
    onDownloaded(); // Yükleme adımına geçişi tetikler
  };

  return (
    <button 
      onClick={handleDownload}
      className="w-full py-5 bg-teal-500 text-black font-black uppercase text-xs rounded-2xl flex items-center justify-center gap-2"
    >
      <Download size={16} /> PDF İndir ve Devam Et
    </button>
  );
}