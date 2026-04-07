import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ÇEKAPP | AI Ticari İstihbarat",
  description: "Yapay Zeka Destekli Ticari Risk Analizi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={`${inter.className} bg-[#060a14] antialiased`}>
        {children}
      </body>
    </html>
  );
}