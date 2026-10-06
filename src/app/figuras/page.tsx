"use client";

import Link from "next/link";
import { Casca, estiloBotaoLink } from "@/components/Casca";
import { Formulas } from "@/components/Formulas";
import { Icone } from "@/components/Icone";
import { useDisciplina } from "@/lib/disciplina";
import { jogoDe } from "@/lib/jogos";

function iniciais(nome: string) {
  const partes = nome.split(" ");
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

function Fichas() {
  const disciplina = useDisciplina();
  const textos = disciplina.textos.fichas;
  const jogo = jogoDe(disciplina, "quem-sou-eu");
  return (
    <>
      <h1 className="mb-1 text-[28px] font-semibold">{textos.aba}</h1>
      <p className="mb-5 leading-relaxed text-tinta-2">{textos.intro}</p>

      {disciplina.personagens.length === 0 && (
        <p className="rounded-2xl border border-linha bg-cartao p-5 leading-relaxed text-tinta-2">As fichas de {disciplina.nome} entram em breve.</p>
      )}

      <div className="space-y-3">
        {disciplina.personagens.map((p) => (
          <details key={p.id} className="group rounded-2xl border border-linha bg-cartao">
            <summary className="flex cursor-pointer list-none items-center gap-3 p-4 [&::-webkit-details-marker]:hidden">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-musgo font-titulo text-lg font-semibold text-papel">
                {iniciais(p.nome)}
              </span>
              <span className="flex-1">
                <span className="block font-titulo text-lg leading-tight font-semibold">{p.nome}</span>
                <span className="block text-sm text-tinta-2">
                  <Formulas>{p.lugar}</Formulas>
                </span>
              </span>
              <Icone nome="baixo" className="size-5 text-tinta-2 transition group-open:rotate-180" />
            </summary>
            <div className="space-y-3 px-4 pb-4 text-[15px] leading-relaxed">
              <p>
                <Formulas>{p.quem}</Formulas>
              </p>
              <p className="rounded-xl bg-barro-claro px-3 py-2.5">
                <span className="font-semibold text-barro">Para lembrar: </span>
                <Formulas>{p.gancho}</Formulas>
              </p>
              <div>
                <h2 className="mb-1.5 text-sm font-semibold tracking-wide text-tinta-2 uppercase [font-family:var(--font-sans)]">
                  Curiosidades
                </h2>
                <ul className="list-disc space-y-1.5 pl-5 marker:text-barro">
                  {p.curiosidades.map((c) => (
                    <li key={c}>
                      <Formulas>{c}</Formulas>
                    </li>
                  ))}
                </ul>
              </div>
              <ul className="flex flex-wrap gap-1.5">
                {p.palavras.map((palavra) => (
                  <li key={palavra} className="rounded-full bg-papel-2 px-2.5 py-1 text-xs font-semibold">
                    <Formulas>{palavra}</Formulas>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        ))}
      </div>

      {jogo?.disponivel && (
        <div className="mt-6 space-y-3">
          <Link href="/jogos/quem-sou-eu" className={estiloBotaoLink}>
            Treinar no {jogo.nome}
          </Link>
        </div>
      )}
    </>
  );
}

export default function PaginaFiguras() {
  return (
    <Casca>
      <Fichas />
    </Casca>
  );
}
