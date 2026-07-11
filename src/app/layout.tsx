import type { Metadata } from "next";
import { Jost, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ReceitaPopup } from "@/components/ReceitaPopup";
import { RoletaPopup } from "@/components/RoletaPopup";

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jost",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tua Pharma — Farmácia de Manipulação | Fórmulas sob medida",
  description:
    "Manipulados com precisão farmacêutica, vitaminas, suplementos e dermocosméticos. Clube de vantagens, frete grátis acima de R$199 e envio da sua receita online.",
  keywords: [
    "farmácia de manipulação",
    "manipulados",
    "suplementos",
    "vitaminas",
    "Tua Pharma",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${jost.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <WhatsAppButton />
          <RoletaPopup />
          <ReceitaPopup />
        </Providers>
      </body>
    </html>
  );
}
