import type { Metadata, Viewport } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import { AppProvider } from "@/lib/app";
import "./globals.css";

const titulo = Fraunces({ variable: "--fonte-titulo", subsets: ["latin"] });
const corpo = Instrument_Sans({ variable: "--fonte-corpo", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Caderno",
  description: "Estudo com questões, revisão e jogos.",
};

export const viewport: Viewport = {
  themeColor: "#f6f1e7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${titulo.variable} ${corpo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
