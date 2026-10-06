"use client";

import Link from "next/link";
import { useState } from "react";
import { Botao, Casca, estiloLinkSuave } from "@/components/Casca";
import { Icone } from "@/components/Icone";
import { Jogo } from "@/components/Jogo";
import { Resultado } from "@/components/Sessao";
import { useApp } from "@/lib/app";
import { useDisciplina } from "@/lib/disciplina";
import { embaralhar, vibrar } from "@/lib/jogo";
import { chaveRecorde } from "@/lib/jogos";
import type { Personagem } from "@/lib/tipos";

const RODADAS = 5;
const PISTAS = 4;

/** Duas pistas difíceis sorteadas (curiosidades incluídas) e as duas mais fáceis, fixas: cada partida é diferente. */
function pistasDe(p: Personagem): string[] {
  const faceis = p.pistas.slice(-2);
  const dificeis = embaralhar([...p.curiosidades, ...p.pistas.slice(0, -2)]).slice(0, PISTAS - faceis.length);
  return [...dificeis, ...faceis];
}

function sortear(todos: Personagem[]) {
  return embaralhar(todos)
    .slice(0, RODADAS)
    .map((p) => ({
      p,
      dicas: pistasDe(p),
      opcoes: embaralhar([p, ...embaralhar(todos.filter((x) => x.id !== p.id)).slice(0, 3)]),
    }));
}

function QuemSouEu() {
  const { ganharXp, registrarRecorde } = useApp();
  const disciplina = useDisciplina();
  const textos = disciplina.textos.quemSouEu;
  const [rodadas, setRodadas] = useState(() => sortear(disciplina.personagens));
  const [indice, setIndice] = useState(0);
  const [pistas, setPistas] = useState(1);
  const [escolha, setEscolha] = useState<string | null>(null);
  const [pontos, setPontos] = useState(0);
  const [fim, setFim] = useState(false);

  const { p, dicas, opcoes } = rodadas[indice];
  const vale = (dicas.length - pistas + 1) * 10;
  const respondida = escolha !== null;
  const acertou = escolha === p.id;

  function escolher(id: string) {
    if (respondida) return;
    setEscolha(id);
    vibrar(id === p.id);
    if (id === p.id) setPontos((n) => n + vale);
  }

  function continuar() {
    if (indice + 1 < rodadas.length) {
      setIndice(indice + 1);
      setPistas(1);
      setEscolha(null);
    } else {
      registrarRecorde(chaveRecorde(disciplina.id, "quem-sou-eu"), pontos);
      ganharXp(Math.round(pontos / 2), disciplina.id);
      setFim(true);
    }
  }

  function reiniciar() {
    setRodadas(sortear(disciplina.personagens));
    setIndice(0);
    setPistas(1);
    setEscolha(null);
    setPontos(0);
    setFim(false);
  }

  if (fim) {
    return (
      <Resultado
        titulo="Fim de jogo"
        destaque={`${pontos} pts`}
        detalhe={`+${Math.round(pontos / 2)} XP · máximo possível: ${rodadas.length * PISTAS * 10}`}
        acoes={
          <>
            <Botao onClick={reiniciar}>Jogar de novo</Botao>
            <Link href="/figuras" className={estiloLinkSuave}>
              Rever as fichas
            </Link>
            <Link href="/jogos" className={estiloLinkSuave}>
              Outros jogos
            </Link>
          </>
        }
      />
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-5 flex items-center justify-between text-sm font-semibold">
        <Link href="/jogos" aria-label="Sair" className="text-tinta-2">
          <Icone nome="errado" />
        </Link>
        <span className="text-tinta-2">
          {textos.rodada} {indice + 1} de {rodadas.length}
        </span>
        <span className="text-musgo tabular-nums">{pontos} pts</span>
      </div>

      <div key={p.id} className="animate-subir flex flex-1 flex-col">
        <h1 className="mb-4 text-2xl font-semibold">{disciplina.textos.jogos["quem-sou-eu"]!.nome}</h1>
        <ol className="mb-4 space-y-2">
          {dicas.slice(0, respondida ? dicas.length : pistas).map((pista, i) => (
            <li key={pista} className="animate-subir flex gap-3 rounded-2xl border border-linha bg-cartao p-3.5 text-[15px] leading-snug">
              <span className="font-titulo font-semibold text-barro">{i + 1}</span>
              {pista}
            </li>
          ))}
        </ol>

        {!respondida && pistas < dicas.length && (
          <button
            onClick={() => setPistas(pistas + 1)}
            className="mb-5 self-start text-sm font-semibold text-musgo underline underline-offset-4"
          >
            Mais uma pista (a resposta passa a valer {vale - 10})
          </button>
        )}

        <div className="grid grid-cols-2 gap-2.5">
          {opcoes.map((op) => {
            let estado = "border-linha bg-cartao";
            if (respondida && op.id === p.id) estado = "border-musgo bg-musgo-claro animate-pulo";
            else if (respondida && op.id === escolha) estado = "border-erro bg-erro-claro animate-tremer";
            else if (respondida) estado = "border-linha bg-cartao opacity-55";
            return (
              <button
                key={op.id}
                onClick={() => escolher(op.id)}
                disabled={respondida}
                className={`rounded-2xl border-2 px-3 py-4 text-[15px] leading-tight font-semibold ${estado}`}
              >
                {op.nome}
              </button>
            );
          })}
        </div>

        {respondida && (
          <div className="animate-subir mt-5 rounded-2xl bg-papel-2 p-4 text-[15px] leading-relaxed">
            <p className={`mb-1 font-titulo text-lg font-semibold ${acertou ? "text-musgo-escuro" : "text-erro"}`}>
              {acertou ? `Acertou: +${vale}` : `Era ${p.nome}`}
            </p>
            <p>{p.quem}</p>
            <p className="mt-2">
              <span className="font-semibold">Para lembrar: </span>
              {p.gancho}
            </p>
          </div>
        )}
      </div>

      {respondida && (
        <div className="mt-5 pb-2">
          <Botao onClick={continuar}>{indice + 1 < rodadas.length ? textos.proxima : "Ver resultado"}</Botao>
        </div>
      )}
    </div>
  );
}

export default function PaginaQuemSouEu() {
  return (
    <Casca foco>
      <Jogo id="quem-sou-eu">
        <QuemSouEu />
      </Jogo>
    </Casca>
  );
}
