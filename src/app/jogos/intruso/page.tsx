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
import type { Intruso as Rodada } from "@/lib/tipos";

const RODADAS = 8;
/** Cada acerto seguido vale um pouco mais, até um teto. */
const valeCom = (sequencia: number) => 10 + Math.min(sequencia, 5) * 2;
const maximoDe = (rodadas: number) => Array.from({ length: rodadas }, (_, i) => valeCom(i)).reduce((s, n) => s + n, 0);

function sortear(intrusos: Rodada[]) {
  return embaralhar(intrusos)
    .slice(0, RODADAS)
    .map((r) => ({ r, opcoes: embaralhar([...r.itens, r.intruso]) }));
}

function Intruso() {
  const { ganharXp, registrarRecorde } = useApp();
  const disciplina = useDisciplina();
  const [rodadas, setRodadas] = useState(() => sortear(disciplina.intrusos));
  const [indice, setIndice] = useState(0);
  const [escolha, setEscolha] = useState<string | null>(null);
  const [pontos, setPontos] = useState(0);
  const [sequencia, setSequencia] = useState(0);
  const [fim, setFim] = useState(false);

  const { r, opcoes } = rodadas[indice];
  const respondida = escolha !== null;
  const acertou = escolha === r.intruso;
  const vale = valeCom(sequencia);

  function escolher(opcao: string) {
    if (respondida) return;
    const certa = opcao === r.intruso;
    setEscolha(opcao);
    vibrar(certa);
    if (certa) setPontos((n) => n + vale);
  }

  function continuar() {
    if (indice + 1 < rodadas.length) {
      setSequencia(acertou ? sequencia + 1 : 0);
      setIndice(indice + 1);
      setEscolha(null);
    } else {
      registrarRecorde(chaveRecorde(disciplina.id, "intruso"), pontos);
      ganharXp(Math.round(pontos / 2), disciplina.id);
      setFim(true);
    }
  }

  function reiniciar() {
    setRodadas(sortear(disciplina.intrusos));
    setIndice(0);
    setEscolha(null);
    setPontos(0);
    setSequencia(0);
    setFim(false);
  }

  if (fim) {
    return (
      <Resultado
        titulo="Fim de jogo"
        destaque={`${pontos} pts`}
        detalhe={`+${Math.round(pontos / 2)} XP · máximo possível: ${maximoDe(rodadas.length)}`}
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
          Rodada {indice + 1} de {rodadas.length}
        </span>
        <span className="text-musgo tabular-nums">{pontos} pts</span>
      </div>

      <div key={indice} className="animate-subir flex flex-1 flex-col">
        <p className="mb-1 text-xs font-semibold tracking-wide text-tinta-2 uppercase">Três destes são</p>
        <h1 className="mb-1 text-2xl leading-snug font-semibold">{r.grupo}</h1>
        <p className="mb-5 text-tinta-2">Toque no que não pertence ao grupo.</p>

        <div className="space-y-2.5">
          {opcoes.map((opcao) => {
            let estado = "border-linha bg-cartao";
            if (respondida && opcao === r.intruso) estado = "border-musgo bg-musgo-claro animate-pulo";
            else if (respondida && opcao === escolha) estado = "border-erro bg-erro-claro animate-tremer";
            else if (respondida) estado = "border-linha bg-cartao opacity-55";
            return (
              <button
                key={opcao}
                onClick={() => escolher(opcao)}
                disabled={respondida}
                className={`w-full rounded-2xl border-2 px-4 py-4 text-left text-[16px] leading-snug font-semibold transition ${estado}`}
              >
                {opcao}
              </button>
            );
          })}
        </div>

        {respondida && (
          <div className="animate-subir mt-5 rounded-2xl bg-papel-2 p-4 text-[15px] leading-relaxed" aria-live="polite">
            <p className={`mb-1 font-titulo text-lg font-semibold ${acertou ? "text-musgo-escuro" : "text-erro"}`}>
              {acertou ? `Achou o intruso: +${vale}` : `O intruso era: ${r.intruso}`}
            </p>
            <p>{r.explicacao}</p>
          </div>
        )}
      </div>

      {respondida && (
        <div className="mt-5 pb-2">
          <Botao onClick={continuar} autoFocus>
            {indice + 1 < rodadas.length ? "Próxima rodada" : "Ver resultado"}
          </Botao>
        </div>
      )}
    </div>
  );
}

export default function PaginaIntruso() {
  return (
    <Casca foco>
      <Jogo id="intruso">
        <Intruso />
      </Jogo>
    </Casca>
  );
}
