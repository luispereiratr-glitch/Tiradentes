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
import type { Evento } from "@/lib/tipos";

const RODADAS = 3;
const POR_RODADA = 4;

function sortear(eventos: Evento[]): Evento[] {
  const escolhidos = embaralhar(eventos).slice(0, POR_RODADA);
  // Garante que a rodada não comece já na ordem certa.
  const ordenado = (lista: Evento[]) => lista.every((e, i) => i === 0 || lista[i - 1].ano < e.ano);
  let lista = embaralhar(escolhidos);
  while (ordenado(lista)) lista = embaralhar(escolhidos);
  return lista;
}

function Cronologia() {
  const { ganharXp, registrarRecorde } = useApp();
  const disciplina = useDisciplina();
  const textos = disciplina.textos.cronologia;
  const [rodada, setRodada] = useState(1);
  const [lista, setLista] = useState(() => sortear(disciplina.eventos));
  const [conferido, setConferido] = useState(false);
  const [pontos, setPontos] = useState(0);
  const [fim, setFim] = useState(false);

  const certa = [...lista].sort((a, b) => a.ano - b.ano);
  const acertos = lista.filter((e, i) => e.ano === certa[i].ano).length;

  function mover(i: number, passo: number) {
    const j = i + passo;
    if (j < 0 || j >= lista.length) return;
    const nova = [...lista];
    [nova[i], nova[j]] = [nova[j], nova[i]];
    setLista(nova);
  }

  function conferir() {
    setConferido(true);
    vibrar(acertos === lista.length);
    setPontos((p) => p + acertos * 10 + (acertos === lista.length ? 10 : 0));
  }

  function continuar() {
    if (rodada < RODADAS) {
      setRodada(rodada + 1);
      setLista(sortear(disciplina.eventos));
      setConferido(false);
    } else {
      registrarRecorde(chaveRecorde(disciplina.id, "cronologia"), pontos);
      ganharXp(Math.round(pontos / 2), disciplina.id);
      setFim(true);
    }
  }

  function reiniciar() {
    setRodada(1);
    setLista(sortear(disciplina.eventos));
    setConferido(false);
    setPontos(0);
    setFim(false);
  }

  if (fim) {
    return (
      <Resultado
        titulo={disciplina.textos.jogos.cronologia!.nome}
        destaque={`${pontos} pts`}
        detalhe={`+${Math.round(pontos / 2)} XP · máximo possível: ${RODADAS * (POR_RODADA * 10 + 10)}`}
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
      <div className="mb-5 flex items-center justify-between text-sm font-semibold">
        <Link href="/jogos" aria-label="Sair" className="text-tinta-2">
          <Icone nome="errado" />
        </Link>
        <span className="text-tinta-2">
          Rodada {rodada} de {RODADAS}
        </span>
        <span className="text-musgo tabular-nums">{pontos} pts</span>
      </div>

      <h1 className="text-2xl font-semibold">{textos.titulo}</h1>
      <p className="mt-1 mb-4 text-sm text-tinta-2">{textos.instrucao}</p>

      <ol className="space-y-2.5">
        {lista.map((evento, i) => {
          const noLugar = evento.ano === certa[i].ano;
          const estado = !conferido ? "border-linha bg-cartao" : noLugar ? "border-musgo bg-musgo-claro" : "border-erro bg-erro-claro";
          return (
            <li key={evento.ano} className={`flex items-center gap-3 rounded-2xl border-2 p-3 transition-colors ${estado}`}>
              {conferido ? (
                <span className="min-w-12 shrink-0 text-center font-titulo text-lg font-semibold whitespace-nowrap">{evento.rotulo ?? evento.ano}</span>
              ) : (
                <span className="flex shrink-0 flex-col gap-1">
                  <button
                    onClick={() => mover(i, -1)}
                    disabled={i === 0}
                    aria-label="Mover para cima"
                    className="rounded-lg bg-papel-2 p-1.5 disabled:opacity-30"
                  >
                    <Icone nome="cima" />
                  </button>
                  <button
                    onClick={() => mover(i, 1)}
                    disabled={i === lista.length - 1}
                    aria-label="Mover para baixo"
                    className="rounded-lg bg-papel-2 p-1.5 disabled:opacity-30"
                  >
                    <Icone nome="baixo" />
                  </button>
                </span>
              )}
              <span className="text-[15px] leading-snug">{evento.texto}</span>
            </li>
          );
        })}
      </ol>

      {conferido && (
        <p className="animate-subir mt-4 rounded-2xl bg-papel-2 p-4 text-[15px] leading-relaxed">
          {acertos === lista.length ? (
            "Ordem perfeita."
          ) : (
            <>
              <span className="font-semibold">Ordem certa: </span>
              {certa.map((e) => e.rotulo ?? e.ano).join(" → ")}
            </>
          )}
        </p>
      )}

      <div className="mt-auto pt-5 pb-2">
        {conferido ? (
          <Botao onClick={continuar}>{rodada < RODADAS ? "Próxima rodada" : "Ver resultado"}</Botao>
        ) : (
          <Botao onClick={conferir}>Conferir</Botao>
        )}
      </div>
    </div>
  );
}

export default function PaginaCronologia() {
  return (
    <Casca foco>
      <Jogo id="cronologia">
        <Cronologia />
      </Jogo>
    </Casca>
  );
}
