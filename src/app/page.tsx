"use client";

import Link from "next/link";
import { Casca } from "@/components/Casca";
import { Icone } from "@/components/Icone";
import { disciplina, questoesDe } from "@/conteudo";
import { useApp } from "@/lib/app";
import { NIVEIS, nivelDoXp, paraRevisar } from "@/lib/jogo";

function Trilha() {
  const { usuario, progresso } = useApp();
  const { nivel, fracao, falta } = nivelDoXp(progresso.xp);
  const revisar = paraRevisar(progresso, disciplina.questoes).length;
  const grupos = [...new Set(disciplina.temas.map((t) => t.grupo))];

  return (
    <>
      <section className="mb-6">
        <h1 className="text-[28px] leading-tight font-semibold">Olá, {usuario!.nome}</h1>
        <div className="mt-4 rounded-2xl border border-linha bg-cartao p-4">
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-semibold">Nível {nivel}</span>
            <span className="text-tinta-2">faltam {falta} XP para o próximo</span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-papel-2">
            <div className="h-full rounded-full bg-ouro transition-all" style={{ width: `${fracao * 100}%` }} />
          </div>
        </div>
        {revisar > 0 && (
          <Link
            href="/revisao"
            className="mt-3 flex items-center justify-between rounded-2xl bg-barro-claro px-4 py-3.5 font-semibold text-barro"
          >
            <span>
              {revisar} {revisar === 1 ? "questão" : "questões"} para revisar hoje
            </span>
            <Icone nome="seta" />
          </Link>
        )}
      </section>

      {grupos.map((grupo) => (
        <section key={grupo} className="mb-7">
          <h2 className="mb-3 text-sm font-semibold tracking-wide text-tinta-2 uppercase [font-family:var(--font-sans)]">
            {grupo}
          </h2>
          <ul className="space-y-3">
            {disciplina.temas
              .filter((t) => t.grupo === grupo)
              .map((tema) => {
                const feitas = questoesDe(tema.id).filter((q) => progresso.questoes[q.id]).length;
                return (
                  <li key={tema.id}>
                    <Link
                      href={`/tema/${tema.id}`}
                      className="block rounded-2xl border border-linha bg-cartao p-4 transition active:scale-[0.99]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg leading-snug font-semibold">{tema.titulo}</h3>
                          <p className="text-sm text-tinta-2">{tema.periodo}</p>
                        </div>
                        <div className="flex shrink-0 gap-0.5 pt-1">
                          {NIVEIS.map((n) => (
                            <span key={n.id} className={progresso.licoes[`${tema.id}:${n.id}`] ? "text-ouro" : "text-linha"}>
                              <Icone nome="estrela" className="size-5" cheio />
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="mt-2 text-sm font-semibold text-musgo">
                        {feitas === 0 ? "Começar" : `${feitas} ${feitas === 1 ? "questão feita" : "questões feitas"}`}
                      </p>
                    </Link>
                  </li>
                );
              })}
          </ul>
        </section>
      ))}
    </>
  );
}

export default function Inicio() {
  return (
    <Casca>
      <Trilha />
    </Casca>
  );
}
