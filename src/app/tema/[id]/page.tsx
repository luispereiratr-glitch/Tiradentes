"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { Casca, Topo } from "@/components/Casca";
import { Icone } from "@/components/Icone";
import { disciplina, questoesDe } from "@/conteudo";
import { useApp } from "@/lib/app";
import { NIVEIS } from "@/lib/jogo";

function Conteudo() {
  const { id } = useParams<{ id: string }>();
  const { progresso } = useApp();
  const tema = disciplina.temas.find((t) => t.id === id);
  if (!tema) notFound();

  return (
    <>
      <Topo titulo={tema.titulo} voltar="/" />
      <p className="mb-6 leading-relaxed text-tinta-2">{tema.resumo}</p>

      <h2 className="mb-3 text-lg font-semibold">Fases</h2>
      <ol className="mb-8 space-y-3">
        {NIVEIS.map((n, i) => {
          const doNivel = questoesDe(tema.id, n.id);
          const quantidade = doNivel.length;
          const respondidas = doNivel.filter((q) => progresso.questoes[q.id]).length;
          const feitas = progresso.licoes[`${tema.id}:${n.id}`] ?? 0;
          const corpo = (
            <>
              <span
                className={`flex size-11 shrink-0 items-center justify-center rounded-full font-titulo text-lg font-semibold bg-musgo text-papel`}
              >
                {i + 1}
              </span>
              <span className="flex-1">
                <span className="block font-semibold">{n.nome}</span>
                <span className="block text-sm text-tinta-2">
                  {respondidas === 0
                    ? "Começar"
                    : `${respondidas} ${respondidas === 1 ? "feita" : "feitas"}${respondidas < quantidade ? " · há questões novas" : ""}`}
                </span>
              </span>
              <span className="flex gap-0.5">
                {[1, 2, 3].map((e) => (
                  <span key={e} className={e <= feitas ? "text-ouro" : "text-linha"}>
                    <Icone nome="estrela" className="size-4" cheio />
                  </span>
                ))}
              </span>
            </>
          );
          const estilo = "flex items-center gap-3 rounded-2xl border border-linha bg-cartao p-4";
          return (
            <li key={n.id}>
              {quantidade > 0 ? (
                <Link href={`/licao/${tema.id}/${n.id}`} className={`${estilo} transition active:scale-[0.99]`}>
                  {corpo}
                </Link>
              ) : (
                <div className={`${estilo} opacity-70`}>{corpo}</div>
              )}
            </li>
          );
        })}
      </ol>

      <h2 className="mb-1 text-lg font-semibold">Perguntas da prova</h2>
      <p className="mb-3 text-sm text-tinta-2">Tente responder de cabeça antes de abrir a resposta-modelo.</p>
      <div className="space-y-3">
        {tema.guia.map((item) => (
          <details key={item.pergunta} className="group rounded-2xl border border-linha bg-cartao">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-3 p-4 font-semibold [&::-webkit-details-marker]:hidden">
              {item.pergunta}
              <Icone nome="baixo" className="mt-0.5 size-5 shrink-0 text-tinta-2 transition group-open:rotate-180" />
            </summary>
            <p className="px-4 pb-4 text-[15px] leading-relaxed">{item.resposta}</p>
          </details>
        ))}
      </div>
    </>
  );
}

export default function PaginaTema() {
  return (
    <Casca>
      <Conteudo />
    </Casca>
  );
}
