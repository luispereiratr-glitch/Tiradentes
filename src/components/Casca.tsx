"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useApp } from "@/lib/app";
import { nivelDoXp, sequenciaAtiva } from "@/lib/jogo";
import { Icone, type NomeIcone } from "./Icone";

const ABAS: { href: string; nome: string; icone: NomeIcone }[] = [
  { href: "/", nome: "Trilha", icone: "casa" },
  { href: "/jogos", nome: "Jogos", icone: "raio" },
  { href: "/revisao", nome: "Revisão", icone: "ciclo" },
  { href: "/figuras", nome: "Figuras", icone: "pessoas" },
  { href: "/perfil", nome: "Perfil", icone: "perfil" },
];

export function Carregando() {
  return (
    <div className="flex flex-1 items-center justify-center text-tinta-2" role="status">
      Carregando…
    </div>
  );
}

/** Moldura das páginas logadas. `foco` esconde a navegação (lições e jogos em andamento). */
export function Casca({ children, foco = false }: { children: React.ReactNode; foco?: boolean }) {
  const { pronto, usuario, carregado, progresso } = useApp();
  const router = useRouter();
  const caminho = usePathname();

  useEffect(() => {
    if (pronto && !usuario) router.replace("/entrar");
  }, [pronto, usuario, router]);

  if (!pronto || !usuario || !carregado) return <Carregando />;

  const sequencia = sequenciaAtiva(progresso);
  const { nivel } = nivelDoXp(progresso.xp);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col">
      {!foco && (
        <header className="flex items-center justify-between px-5 pt-5 pb-2">
          <Link href="/" className="font-titulo text-xl font-semibold text-musgo-escuro">
            Caderno
          </Link>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 ${sequencia ? "bg-barro-claro text-barro" : "bg-papel-2 text-tinta-2"}`}
              title="Dias seguidos estudando"
            >
              <Icone nome="chama" className="size-4" cheio={sequencia > 0} />
              {sequencia}
            </span>
            <span className="rounded-full bg-musgo-claro px-2.5 py-1 text-musgo-escuro" title={`${progresso.xp} XP`}>
              Nível {nivel}
            </span>
          </div>
        </header>
      )}

      <main className={`flex flex-1 flex-col px-5 ${foco ? "py-5" : "pt-3 pb-28"}`}>{children}</main>

      {!foco && (
        <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-linha bg-cartao/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
          <ul className="mx-auto flex max-w-xl">
            {ABAS.map((aba) => {
              const ativa = aba.href === "/" ? caminho === "/" || caminho.startsWith("/tema") : caminho.startsWith(aba.href);
              return (
                <li key={aba.href} className="flex-1">
                  <Link
                    href={aba.href}
                    aria-current={ativa ? "page" : undefined}
                    className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium ${ativa ? "text-musgo" : "text-tinta-2"}`}
                  >
                    <Icone nome={aba.icone} className="size-6" />
                    {aba.nome}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
}

export function Botao({
  children,
  variante = "primario",
  className = "",
  ...resto
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variante?: "primario" | "suave" }) {
  const cores =
    variante === "primario"
      ? "bg-musgo text-papel shadow-[0_3px_0_var(--color-musgo-escuro)] active:translate-y-[3px] active:shadow-none disabled:bg-linha disabled:text-tinta-2 disabled:shadow-none"
      : "border border-linha bg-cartao text-tinta";
  return (
    <button {...resto} className={`w-full rounded-2xl px-5 py-3.5 text-base font-semibold transition ${cores} ${className}`}>
      {children}
    </button>
  );
}

export const estiloBotaoLink =
  "block w-full rounded-2xl bg-musgo px-5 py-3.5 text-center text-base font-semibold text-papel shadow-[0_3px_0_var(--color-musgo-escuro)] active:translate-y-[3px] active:shadow-none";
export const estiloLinkSuave =
  "block w-full rounded-2xl border border-linha bg-cartao px-5 py-3.5 text-center text-base font-semibold text-tinta";

export function Topo({ titulo, voltar }: { titulo: string; voltar: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <Link href={voltar} aria-label="Voltar" className="rounded-full border border-linha bg-cartao p-2 text-tinta-2">
        <Icone nome="voltar" />
      </Link>
      <h1 className="text-xl font-semibold">{titulo}</h1>
    </div>
  );
}
