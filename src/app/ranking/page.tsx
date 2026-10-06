"use client";

import { useState } from "react";
import { Casca } from "@/components/Casca";
import { Icone } from "@/components/Icone";
import { useApp } from "@/lib/app";
import { useDisciplina } from "@/lib/disciplina";
import { jogosDe } from "@/lib/jogos";
import { naMateria, useRanking } from "@/lib/ranking";
import type { Placar } from "@/lib/tipos";

type Aba = "geral" | "semana" | "questoes" | "jogos";

const ABAS: { id: Aba; nome: string }[] = [
  { id: "geral", nome: "Geral" },
  { id: "semana", nome: "Semana" },
  { id: "questoes", nome: "Questões" },
  { id: "jogos", nome: "Jogos" },
];

const TODOS = "todos";
type Jogos = ReturnType<typeof jogosDe>;

type Criterio = {
  descricao: string;
  vazio: string;
  pontos: (p: Placar) => number;
  valor: (p: Placar) => string;
  detalhe?: (p: Placar) => string | null;
  /** Quem está zerado neste critério fica fora da lista. */
  soPontuados?: boolean;
};

function criterioDe(aba: Aba, jogo: string, jogos: Jogos, materia: { id: string; nome: string }): Criterio {
  const m = (p: Placar) => naMateria(p, materia.id);
  const somaDosJogos = (p: Placar) => jogos.reduce((s, j) => s + (p.recordes[j.recorde] ?? 0), 0);

  if (aba === "geral") {
    return {
      descricao: `Todo o XP ganho em ${materia.nome}, em questões, fases e jogos, desde o primeiro dia.`,
      vazio: `Ninguém pontuou em ${materia.nome} ainda. O primeiro lugar está vago.`,
      pontos: (p) => m(p).xp,
      valor: (p) => `${m(p).xp} XP`,
      detalhe: (p) => `${m(p).acertadas} ${m(p).acertadas === 1 ? "questão acertada" : "questões acertadas"}`,
      soPontuados: true,
    };
  }
  if (aba === "semana") {
    return {
      descricao: `XP ganho em ${materia.nome} desde domingo. Zera toda semana, então todo mundo larga junto.`,
      vazio: "Ninguém pontuou nesta semana ainda. O primeiro lugar está vago.",
      pontos: (p) => m(p).xpSemana,
      valor: (p) => `${m(p).xpSemana} XP`,
      soPontuados: true,
    };
  }
  if (aba === "questoes") {
    return {
      descricao: `Questões diferentes de ${materia.nome} acertadas. Repetir a mesma questão não soma de novo.`,
      vazio: `Ninguém acertou questões de ${materia.nome} ainda.`,
      pontos: (p) => m(p).acertadas,
      valor: (p) => `${m(p).acertadas} ${m(p).acertadas === 1 ? "acertada" : "acertadas"}`,
      detalhe: (p) => (m(p).precisao === null ? null : `${m(p).precisao}% de acerto`),
      soPontuados: true,
    };
  }
  if (jogo === TODOS) {
    return {
      descricao: `Soma dos recordes de cada pessoa em todos os jogos de ${materia.nome}.`,
      vazio: "Ninguém jogou ainda. O primeiro lugar está vago.",
      pontos: somaDosJogos,
      valor: (p) => `${somaDosJogos(p)} pts`,
      detalhe: (p) => {
        const jogados = jogos.filter((j) => p.recordes[j.recorde]).length;
        return `${jogados} de ${jogos.length} jogos`;
      },
      soPontuados: true,
    };
  }
  const chave = jogos.find((j) => j.id === jogo)!.recorde;
  return {
    descricao: "O melhor resultado de cada pessoa em uma única partida.",
    vazio: "Ninguém jogou este jogo ainda. O recorde é de quem chegar primeiro.",
    pontos: (p) => p.recordes[chave] ?? 0,
    valor: (p) => `${p.recordes[chave] ?? 0} pts`,
    soPontuados: true,
  };
}

const DEGRAUS = [
  { altura: "h-24", cor: "bg-ouro text-cartao" },
  { altura: "h-16", cor: "bg-linha text-tinta" },
  { altura: "h-12", cor: "bg-barro-claro text-barro" },
];

/** Os três primeiros, com o líder no centro. */
function Podio({ tres, euId, valor }: { tres: Placar[]; euId: string; valor: (p: Placar) => string }) {
  return (
    <ol className="mb-4 grid grid-cols-3 items-end gap-2">
      {[1, 0, 2].map((posicao) => {
        const p = tres[posicao];
        const degrau = DEGRAUS[posicao];
        return (
          <li key={p.id} className={`flex min-w-0 flex-col items-center ${posicao === 0 ? "order-2" : posicao === 1 ? "order-1" : "order-3"}`}>
            <span
              className={`mb-1.5 flex items-center justify-center rounded-full font-titulo font-semibold uppercase ${posicao === 0 ? "size-16 text-2xl" : "size-12 text-lg"} ${p.id === euId ? "bg-musgo text-papel" : "bg-cartao text-musgo-escuro"} border-2 ${posicao === 0 ? "border-ouro" : "border-linha"}`}
            >
              {p.usuario.slice(0, 2)}
            </span>
            <span className="w-full truncate text-center text-sm font-semibold">{p.usuario}</span>
            <span className="mb-1.5 text-xs font-semibold text-musgo tabular-nums">{valor(p)}</span>
            <span className={`flex w-full items-start justify-center rounded-t-2xl pt-2 font-titulo text-xl font-semibold ${degrau.altura} ${degrau.cor}`}>
              {posicao === 0 ? <Icone nome="trofeu" className="size-7" /> : posicao + 1}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function Ranking() {
  const { modoLocal } = useApp();
  const disciplina = useDisciplina();
  const jogos = jogosDe(disciplina);
  const { eu, placares, erro } = useRanking();
  const [aba, setAba] = useState<Aba>("geral");
  const [jogo, setJogo] = useState(TODOS);

  const criterio = criterioDe(aba, jogo, jogos, disciplina);
  const lista = (placares ?? [])
    .filter((p) => !criterio.soPontuados || criterio.pontos(p) > 0)
    .sort((a, b) => criterio.pontos(b) - criterio.pontos(a) || naMateria(b, disciplina.id).xp - naMateria(a, disciplina.id).xp || a.usuario.localeCompare(b.usuario));
  const minhaPosicao = lista.findIndex((p) => p.id === eu.id) + 1;
  const comPodio = lista.length >= 3;

  return (
    <>
      <h1 className="mb-1 text-[28px] font-semibold">Ranking de {disciplina.nome}</h1>
      <p className="mb-4 text-tinta-2">
        {!placares
          ? "Quem está estudando mais na turma."
          : minhaPosicao
            ? `Você está em ${minhaPosicao}º de ${lista.length}.`
            : `Você ainda não pontuou aqui. Cada matéria tem o seu ranking.`}
      </p>

      <div className="mb-3 grid grid-cols-4 gap-1 rounded-2xl bg-papel-2 p-1" role="tablist">
        {ABAS.map((a) => (
          <button
            key={a.id}
            role="tab"
            aria-selected={aba === a.id}
            onClick={() => setAba(a.id)}
            className={`rounded-xl py-2 text-sm font-semibold transition ${aba === a.id ? "bg-cartao text-musgo-escuro shadow-sm" : "text-tinta-2"}`}
          >
            {a.nome}
          </button>
        ))}
      </div>

      {aba === "jogos" && (
        <div className="-mx-5 mb-3 flex gap-2 overflow-x-auto px-5 pb-1">
          {[{ id: TODOS, nome: "Todos", icone: "trofeu" as const }, ...jogos].map((j) => (
            <button
              key={j.id}
              aria-pressed={jogo === j.id}
              onClick={() => setJogo(j.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold ${jogo === j.id ? "border-musgo bg-musgo text-papel" : "border-linha bg-cartao text-tinta-2"}`}
            >
              <Icone nome={j.icone} className="size-4" /> {j.nome}
            </button>
          ))}
        </div>
      )}

      <p className="mb-5 text-sm leading-relaxed text-tinta-2">{criterio.descricao}</p>

      {erro ? (
        <p role="alert" className="rounded-2xl bg-erro-claro p-4 text-erro">
          Não foi possível carregar o ranking. Verifique a conexão e tente de novo.
        </p>
      ) : !placares ? (
        <p className="text-tinta-2">Carregando…</p>
      ) : lista.length === 0 ? (
        <p className="rounded-2xl border border-linha bg-cartao p-5 leading-relaxed text-tinta-2">{criterio.vazio}</p>
      ) : (
        <div key={`${aba}:${jogo}`} className="animate-subir">
          {comPodio && <Podio tres={lista.slice(0, 3)} euId={eu.id} valor={criterio.valor} />}
          <ol className="space-y-2">
            {lista.map((p, i) => {
              const detalhe = criterio.detalhe?.(p);
              return (
                <li
                  key={p.id}
                  className={`flex items-center gap-3 rounded-2xl border p-3.5 ${p.id === eu.id ? "border-musgo bg-musgo-claro" : "border-linha bg-cartao"}`}
                >
                  <span className={`w-7 text-center font-titulo text-lg font-semibold ${i < 3 ? "text-ouro" : "text-tinta-2"}`}>{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">
                      {p.usuario}
                      {p.id === eu.id && <span className="font-normal text-tinta-2"> (você)</span>}
                    </span>
                    {detalhe && <span className="block text-sm text-tinta-2">{detalhe}</span>}
                  </span>
                  {p.sequencia > 0 && (
                    <span className="flex items-center gap-1 text-sm font-semibold text-barro" title="Dias seguidos estudando">
                      <Icone nome="chama" className="size-4" cheio /> {p.sequencia}
                    </span>
                  )}
                  <span className="text-sm font-semibold text-musgo tabular-nums">{criterio.valor(p)}</span>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {modoLocal && (
        <p className="mt-4 text-sm leading-relaxed text-tinta-2">
          Modo local: só você aparece. Os outros entram quando o banco de dados estiver configurado.
        </p>
      )}
    </>
  );
}

export default function PaginaRanking() {
  return (
    <Casca>
      <Ranking />
    </Casca>
  );
}
