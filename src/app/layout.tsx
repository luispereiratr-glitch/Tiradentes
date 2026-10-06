import type { Metadata, Viewport } from "next";
import { Fraunces, Instrument_Sans, Space_Grotesk } from "next/font/google";
import { disciplinasAbertas } from "@/conteudo";
import { AppProvider } from "@/lib/app";
import { scriptDoTema } from "@/lib/tema";
import "./globals.css";

const titulo = Fraunces({ variable: "--fonte-titulo", subsets: ["latin"] });
const corpo = Instrument_Sans({ variable: "--fonte-corpo", subsets: ["latin"] });
const tituloFisica = Space_Grotesk({ variable: "--fonte-titulo-fisica", subsets: ["latin"] });

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
    <html lang="pt-BR" className={`${titulo.variable} ${corpo.variable} ${tituloFisica.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptDoTema(disciplinasAbertas.map((d) => d.id)) }} />
      </head>
      <body className="min-h-full flex flex-col">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
