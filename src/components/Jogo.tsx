"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useApp } from "@/lib/app";
import { useDisciplina } from "@/lib/disciplina";
import { jogoDe } from "@/lib/jogos";
import type { IdJogo } from "@/lib/tipos";
import { Botao, estiloLinkSuave } from "./Casca";
import { Icone } from "./Icone";

/** Só monta o jogo quando ele faz parte da matéria ativa e ela tem conteúdo para ele. */
export function Jogo({ id, children }: { id: IdJogo; children: React.ReactNode }) {
  const disciplina = useDisciplina();
  const jogo = jogoDe(disciplina, id);

  if (jogo?.disponivel) return children;

  return (
    <div className="flex flex-1 flex-col justify-center text-center">
      {jogo && (
        <span className={`mx-auto mb-5 flex size-20 items-center justify-center rounded-3xl ${jogo.cor}`}>
          <Icone nome={jogo.icone} className="size-10" />
        </span>
      )}
      <h1 className="text-3xl font-semibold">{jogo?.nome ?? "Jogo de outra matéria"}</h1>
      <p className="mx-auto mt-3 max-w-xs leading-relaxed text-tinta-2">
        {jogo
          ? `Este jogo ainda não tem conteúdo de ${disciplina.nome}. Ele abre assim que as rodadas chegarem.`
          : `Este jogo não faz parte do painel de ${disciplina.nome}. Troque de matéria para jogar.`}
      </p>
      <div className="mt-8">
        <Link href="/jogos" className={estiloLinkSuave}>
          Ver os jogos de {disciplina.nome}
        </Link>
      </div>
    </div>
  );
}

/** O jogo na matéria ativa, com o recorde atual e a função que fecha a partida (recorde + XP). */
export function usePartida(id: IdJogo) {
  const { progresso, registrarRecorde, ganharXp } = useApp();
  const disciplina = useDisciplina();
  const jogo = jogoDe(disciplina, id)!;
  return {
    disciplina,
    jogo,
    recorde: progresso.recordes[jogo.recorde] as number | undefined,
    encerrar(pontos: number, xp: number) {
      registrarRecorde(jogo.recorde, pontos);
      if (xp > 0) ganharXp(xp, disciplina.id);
    },
  };
}

/** Tela inicial dos jogos com cronômetro: explica a regra e espera o toque para começar. */
export function Abertura({ id, regra, aoComecar }: { id: IdJogo; regra: string; aoComecar: () => void }) {
  const { jogo, recorde } = usePartida(id);
  return (
    <div className="flex flex-1 flex-col justify-center text-center">
      <span className={`mx-auto mb-5 flex size-20 items-center justify-center rounded-3xl ${jogo.cor}`}>
        <Icone nome={jogo.icone} className="size-10" />
      </span>
      <h1 className="text-3xl font-semibold">{jogo.nome}</h1>
      <p className="mx-auto mt-3 max-w-xs leading-relaxed text-tinta-2">{regra}</p>
      {recorde !== undefined && <p className="mt-3 font-semibold text-ouro">Seu recorde: {recorde}</p>}
      <div className="mt-8 space-y-3">
        <Botao onClick={aoComecar}>Começar</Botao>
        <Link href="/jogos" className={estiloLinkSuave}>
          Voltar
        </Link>
      </div>
    </div>
  );
}

/** Linha do topo de uma partida: sair, o que está no meio (rodada, tempo) e os pontos. */
export function Topo({ meio, pontos }: { meio: React.ReactNode; pontos: number }) {
  return (
    <div className="mb-4 flex items-center justify-between text-sm font-semibold">
      <Link href="/jogos" aria-label="Sair" className="text-tinta-2">
        <Icone nome="errado" />
      </Link>
      <span className="text-tinta-2">{meio}</span>
      <span className="text-musgo tabular-nums">{pontos} pts</span>
    </div>
  );
}

/** Contagem regressiva em segundos; começa quando `ligada` vira verdadeiro. */
export function useContagem(duracao: number, ligada: boolean) {
  const [tempo, setTempo] = useState(duracao);
  const acabou = tempo <= 0;
  useEffect(() => {
    if (!ligada || acabou) return;
    const relogio = setInterval(() => setTempo((t) => t - 1), 1000);
    return () => clearInterval(relogio);
  }, [ligada, acabou]);
  return { tempo: Math.max(tempo, 0), acabou, reiniciar: () => setTempo(duracao) };
}

/** Barra de tempo dos jogos cronometrados. */
export function BarraDeTempo({ tempo, duracao }: { tempo: number; duracao: number }) {
  return (
    <div className="mb-5 h-2 overflow-hidden rounded-full bg-papel-2">
      <div className="h-full rounded-full bg-barro transition-all duration-1000 ease-linear" style={{ width: `${(tempo / duracao) * 100}%` }} />
    </div>
  );
}
