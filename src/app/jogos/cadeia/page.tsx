"use client";

import Link from "next/link";
import { useState } from "react";
import { Botao, Casca, estiloLinkSuave } from "@/components/Casca";
import { Icone } from "@/components/Icone";
import { Resultado } from "@/components/Sessao";
import { disciplina } from "@/conteudo";
import { useApp } from "@/lib/app";
import { embaralhar, vibrar } from "@/lib/jogo";
import type { Cadeia } from "@/lib/tipos";

const RODADAS = 3;
const POR_ELO = 10;
const BONUS_PERFEITA = 20;

type Elo = { texto: string; lugar: number };

function embaralharElos(c: Cadeia): Elo[] {
  const elos = c.passos.map((texto, lugar) => ({ texto, lugar }));
  // Garante que a rodada não comece já resolvida.
  let lista = embaralhar(elos);
  while (lista.every((e, i) => e.lugar === i)) lista = embaralhar(elos);
  return lista;
}

const sortear = () => embaralhar(disciplina.cadeias).slice(0, RODADAS);
const maximoDe = (cadeias: Cadeia[]) => cadeias.reduce((s, c) => s + c.passos.length * POR_ELO + BONUS_PERFEITA, 0);

function CausaEConsequencia() {
  const { ganharXp, registrarRecorde } = useApp();
  const [cadeias, setCadeias] = useState(sortear);
  const [rodada, setRodada] = useState(0);
  const [lista, setLista] = useState(() => embaralharElos(cadeias[0]));
  const [conferido, setConferido] = useState(false);
  const [pontos, setPontos] = useState(0);
  const [fim, setFim] = useState(false);

  const cadeia = cadeias[rodada];
  const acertos = lista.filter((e, i) => e.lugar === i).length;
  const perfeita = acertos === lista.length;

  function mover(i: number, passo: number) {
    const j = i + passo;
    if (j < 0 || j >= lista.length) return;
    const nova = [...lista];
    [nova[i], nova[j]] = [nova[j], nova[i]];
    setLista(nova);
  }

  function conferir() {
    setConferido(true);
    vibrar(perfeita);
    setPontos((p) => p + acertos * POR_ELO + (perfeita ? BONUS_PERFEITA : 0));
  }

  function continuar() {
    if (rodada + 1 < cadeias.length) {
      setRodada(rodada + 1);
      setLista(embaralharElos(cadeias[rodada + 1]));
      setConferido(false);
    } else {
      registrarRecorde("cadeia", pontos);
      ganharXp(Math.round(pontos / 2));
      setFim(true);
    }
  }

  function reiniciar() {
    const novas = sortear();
    setCadeias(novas);
    setRodada(0);
    setLista(embaralharElos(novas[0]));
    setConferido(false);
    setPontos(0);
    setFim(false);
  }

  if (fim) {
    return (
      <Resultado
        titulo="Causa e consequência"
        destaque={`${pontos} pts`}
        detalhe={`+${Math.round(pontos / 2)} XP · máximo possível: ${maximoDe(cadeias)}`}
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
          Cadeia {rodada + 1} de {cadeias.length}
        </span>
        <span className="text-musgo tabular-nums">{pontos} pts</span>
      </div>

      <h1 className="text-2xl leading-snug font-semibold">{cadeia.titulo}</h1>
      <p className="mt-1 mb-4 text-sm text-tinta-2">
        Monte a sequência: cada fato leva ao de baixo. Você só confere uma vez, e não há datas para ajudar.
      </p>

      <ol key={rodada} className="animate-subir space-y-2">
        {(conferido ? [...lista].sort((a, b) => a.lugar - b.lugar) : lista).map((elo, i) => {
          // Depois de conferir, a lista aparece na ordem certa; a cor diz se a pessoa tinha posto o elo ali.
          const noLugar = lista[elo.lugar]?.lugar === elo.lugar;
          const estado = !conferido ? "border-linha bg-cartao" : noLugar ? "border-musgo bg-musgo-claro" : "border-erro bg-erro-claro";
          return (
            <li key={elo.texto} className={`flex items-center gap-3 rounded-2xl border-2 p-3 transition-colors ${estado}`}>
              {conferido ? (
                <span className="flex w-9 shrink-0 justify-center">
                  <Icone nome={noLugar ? "certo" : "errado"} className={`size-6 ${noLugar ? "text-musgo" : "text-erro"}`} />
                </span>
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
              <span className="text-[15px] leading-snug">{elo.texto}</span>
            </li>
          );
        })}
      </ol>

      {conferido && (
        <div className="animate-subir mt-4 rounded-2xl bg-papel-2 p-4 text-[15px] leading-relaxed" aria-live="polite">
          <p className={`mb-1 font-titulo text-lg font-semibold ${perfeita ? "text-musgo-escuro" : "text-erro"}`}>
            {perfeita ? "Cadeia perfeita" : `${acertos} de ${lista.length} no lugar certo`}
          </p>
          {!perfeita && <p className="mb-2 text-sm text-tinta-2">Acima está a ordem correta; em vermelho, o que você tinha posto em outro lugar.</p>}
          <p>{cadeia.explicacao}</p>
        </div>
      )}

      <div className="mt-auto pt-5 pb-2">
        {conferido ? (
          <Botao onClick={continuar}>{rodada + 1 < cadeias.length ? "Próxima cadeia" : "Ver resultado"}</Botao>
        ) : (
          <Botao onClick={conferir}>Conferir</Botao>
        )}
      </div>
    </div>
  );
}

export default function PaginaCadeia() {
  return (
    <Casca foco>
      <CausaEConsequencia />
    </Casca>
  );
}
