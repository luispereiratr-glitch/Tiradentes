"use client";

import Link from "next/link";
import { Casca, estiloBotaoLink } from "@/components/Casca";
import { Icone } from "@/components/Icone";
import { disciplina } from "@/conteudo";

function iniciais(nome: string) {
  const partes = nome.split(" ");
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

function Fichas() {
  return (
    <>
      <h1 className="mb-1 text-[28px] font-semibold">Figuras</h1>
      <p className="mb-5 leading-relaxed text-tinta-2">
        Os nomes que caem na prova. Cada ficha tem um gancho para você não confundir ninguém.
      </p>

      <div className="space-y-3">
        {disciplina.personagens.map((p) => (
          <details key={p.id} className="group rounded-2xl border border-linha bg-cartao">
            <summary className="flex cursor-pointer list-none items-center gap-3 p-4 [&::-webkit-details-marker]:hidden">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-musgo font-titulo text-lg font-semibold text-papel">
                {iniciais(p.nome)}
              </span>
              <span className="flex-1">
                <span className="block font-titulo text-lg leading-tight font-semibold">{p.nome}</span>
                <span className="block text-sm text-tinta-2">{p.lugar}</span>
              </span>
              <Icone nome="baixo" className="size-5 text-tinta-2 transition group-open:rotate-180" />
            </summary>
            <div className="space-y-3 px-4 pb-4 text-[15px] leading-relaxed">
              <p>{p.quem}</p>
              <p className="rounded-xl bg-barro-claro px-3 py-2.5">
                <span className="font-semibold text-barro">Para lembrar: </span>
                {p.gancho}
              </p>
              <ul className="flex flex-wrap gap-1.5">
                {p.palavras.map((palavra) => (
                  <li key={palavra} className="rounded-full bg-papel-2 px-2.5 py-1 text-xs font-semibold">
                    {palavra}
                  </li>
                ))}
              </ul>
            </div>
          </details>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        <Link href="/jogos/quem-sou-eu" className={estiloBotaoLink}>
          Treinar no Quem sou eu?
        </Link>
      </div>
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
