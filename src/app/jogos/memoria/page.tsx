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

const PARES = 6;

type Carta = { chave: string; par: string; texto: string; nome: boolean };

function sortear(personagens: Personagem[]): Carta[] {
  return embaralhar(
    embaralhar(personagens)
      .slice(0, PARES)
      .flatMap((p) => [
        { chave: `${p.id}:nome`, par: p.id, texto: p.nome, nome: true },
        { chave: `${p.id}:fato`, par: p.id, texto: p.fato, nome: false },
      ]),
  );
}

function Memoria() {
  const { ganharXp, registrarRecorde } = useApp();
  const disciplina = useDisciplina();
  const [cartas, setCartas] = useState(() => sortear(disciplina.personagens));
  const [abertas, setAbertas] = useState<number[]>([]);
  const [achadas, setAchadas] = useState<string[]>([]);
  const [jogadas, setJogadas] = useState(0);
  const [fim, setFim] = useState(false);

  const pontos = Math.max(10, 100 - (jogadas - PARES) * 5);

  function virar(i: number) {
    if (abertas.length === 2 || abertas.includes(i) || achadas.includes(cartas[i].par)) return;
    const novas = [...abertas, i];
    setAbertas(novas);
    if (novas.length < 2) return;

    setJogadas((n) => n + 1);
    const [a, b] = novas.map((n) => cartas[n]);
    if (a.par === b.par) {
      vibrar(true);
      const total = [...achadas, a.par];
      setAchadas(total);
      setAbertas([]);
      if (total.length === PARES) {
        const finais = Math.max(10, 100 - (jogadas + 1 - PARES) * 5);
        registrarRecorde(chaveRecorde(disciplina.id, "memoria"), finais);
        ganharXp(30, disciplina.id);
        setTimeout(() => setFim(true), 700);
      }
    } else {
      setTimeout(() => setAbertas([]), 1100);
    }
  }

  function reiniciar() {
    setCartas(sortear(disciplina.personagens));
    setAbertas([]);
    setAchadas([]);
    setJogadas(0);
    setFim(false);
  }

  if (fim) {
    return (
      <Resultado
        titulo="Todos os pares"
        destaque={`${pontos} pts`}
        detalhe={`${jogadas} jogadas · +30 XP`}
        acoes={
          <>
            <Botao onClick={reiniciar}>Jogar de novo</Botao>
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
      <div className="mb-4 flex items-center justify-between text-sm font-semibold">
        <Link href="/jogos" aria-label="Sair" className="text-tinta-2">
          <Icone nome="errado" />
        </Link>
        <span className="text-tinta-2">
          {achadas.length}/{PARES} pares
        </span>
        <span className="text-musgo tabular-nums">{jogadas} jogadas</span>
      </div>
      <h1 className="mb-4 text-2xl font-semibold">{disciplina.textos.memoria.titulo}</h1>

      <div className="grid grid-cols-3 gap-2.5">
        {cartas.map((carta, i) => {
          const achada = achadas.includes(carta.par);
          const visivel = achada || abertas.includes(i);
          return (
            <button
              key={carta.chave}
              onClick={() => virar(i)}
              aria-label={visivel ? carta.texto : "Carta virada"}
              className={`flex aspect-[3/4] items-center justify-center rounded-2xl border-2 p-2 text-center leading-tight transition ${
                achada
                  ? "border-musgo bg-musgo-claro text-musgo-escuro"
                  : visivel
                    ? "animate-pulo border-barro bg-cartao"
                    : "border-musgo-escuro bg-musgo text-papel/40"
              } ${carta.nome ? "font-titulo text-[15px] font-semibold" : "text-xs"}`}
            >
              {visivel ? carta.texto : <Icone nome={disciplina.icone} className="size-7" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function PaginaMemoria() {
  return (
    <Casca foco>
      <Jogo id="memoria">
        <Memoria />
      </Jogo>
    </Casca>
  );
}
