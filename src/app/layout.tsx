import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sansFont = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SpecFlow — Studio Inteligente de Especificação de Produto",
  description:
    "Transforme anotações brutas de discovery em especificações estruturadas de produto (MVP) utilizando Google Gemini 3.6 Flash e validação defensiva Zod.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`dark ${sansFont.variable} ${monoFont.variable}`}>
      <body className="bg-[#131211] text-[#f5f3f0] font-sans min-h-screen antialiased selection:bg-[#ff4d00]/25 selection:text-[#ff8c52]">
        {children}
      </body>
    </html>
  );
}


