"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Botao, Casca, estiloLinkSuave } from "@/components/Casca";
import { Icone } from "@/components/Icone";
import { Jogo } from "@/components/Jogo";
import { Resultado } from "@/components/Sessao";
import { useApp } from "@/lib/app";
import { useDisciplina } from "@/lib/disciplina";
import { embaralhar, vibrar } from "@/lib/jogo";
import { chaveRecorde, questoesRelampago } from "@/lib/jogos";
import type { Questao } from "@/lib/tipos";

const DURACAO = 60;

function Relampago() {
  const { responder, registrarRecorde, progresso } = useApp();
  const disciplina = useDisciplina();
  const chave = chaveRecorde(disciplina.id, "relampago");
  const recorde = progresso.recordes[chave];
  const [jogando, setJogando] = useState(false);
  const [fila, setFila] = useState<Questao[]>([]);
  const [indice, setIndice] = useState(0);
  const [tempo, setTempo] = useState(DURACAO);
  const [pontos, setPontos] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [combo, setCombo] = useState(0);
  const [marcada, setMarcada] = useState<number | null>(null);
  const [erradas, setErradas] = useState<Questao[]>([]);

  const q = fila[indice % Math.max(fila.length, 1)];
  const opcoes = useMemo(
    () => (q ? embaralhar(q.alternativas.map((texto, i) => ({ texto, certa: i === 0 }))) : []),
    [q],
  );

  const acabou = jogando && tempo <= 0;

  useEffect(() => {
    if (!jogando || acabou) return;
    const relogio = setInterval(() => setTempo((t) => t - 1), 1000);
    return () => clearInterval(relogio);
  }, [jogando, acabou]);

  useEffect(() => {
    if (acabou) registrarRecorde(chave, pontos);
  }, [acabou, pontos, registrarRecorde, chave]);

  function comecar() {
    setFila(embaralhar(questoesRelampago(disciplina)));
    setIndice(0);
    setTempo(DURACAO);
    setPontos(0);
    setAcertos(0);
    setCombo(0);
    setErradas([]);
    setMarcada(null);
    setJogando(true);
  }

  function escolher(i: number) {
    if (marcada !== null || acabou) return;
    const certa = opcoes[i].certa;
    setMarcada(i);
    responder(q, certa, disciplina.id);
    vibrar(certa);
    if (certa) {
      setPontos((p) => p + 10 + combo * 2);
      setAcertos((a) => a + 1);
      setCombo((c) => c + 1);
    } else {
      setCombo(0);
      setErradas((lista) => (lista.some((x) => x.id === q.id) ? lista : [...lista, q]));
    }
    setTimeout(
      () => {
        setMarcada(null);
        setIndice((n) => n + 1);
      },
      certa ? 350 : 900,
    );
  }

  if (!jogando) {
    return (
      <div className="flex flex-1 flex-col justify-center text-center">
        <span className="mx-auto mb-5 flex size-20 items-center justify-center rounded-3xl bg-barro-claro text-barro">
          <Icone nome="raio" className="size-10" />
        </span>
        <h1 className="text-3xl font-semibold">Relâmpago</h1>
        <p className="mx-auto mt-3 max-w-xs leading-relaxed text-tinta-2">
          Você tem {DURACAO} segundos. Cada acerto seguido vale mais pontos; um erro zera o combo.
        </p>
        {recorde !== undefined && <p className="mt-3 font-semibold text-ouro">Seu recorde: {recorde}</p>}
        <div className="mt-8 space-y-3">
          <Botao onClick={comecar}>Começar</Botao>
          <Link href="/jogos" className={estiloLinkSuave}>
            Voltar
          </Link>
        </div>
      </div>
    );
  }

  if (acabou) {
    return (
      <Resultado
        titulo="Tempo esgotado"
        destaque={`${pontos} pts`}
        detalhe={`${acertos} ${acertos === 1 ? "acerto" : "acertos"} · recorde ${Math.max(pontos, recorde ?? 0)}`}
        erradas={erradas}
        acoes={
          <>
            <Botao onClick={comecar}>Jogar de novo</Botao>
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
      <div className="mb-4 flex items-center justify-between font-semibold tabular-nums">
        <span className={`flex items-center gap-1.5 ${tempo <= 10 ? "text-erro" : "text-tinta"}`}>
          <Icone nome="relogio" /> {Math.max(tempo, 0)}s
        </span>
        {combo >= 2 && <span className="animate-pulo rounded-full bg-barro px-3 py-1 text-sm text-papel">Combo ×{combo}</span>}
        <span className="text-musgo">{pontos} pts</span>
      </div>
      <div className="mb-5 h-2 overflow-hidden rounded-full bg-papel-2">
        <div
          className="h-full rounded-full bg-barro transition-all duration-1000 ease-linear"
          style={{ width: `${(Math.max(tempo, 0) / DURACAO) * 100}%` }}
        />
      </div>

      <div key={indice} className="animate-subir">
        <h2 className="mb-5 text-[18px] leading-snug font-medium whitespace-pre-line">{q.enunciado}</h2>
        <div className="space-y-2.5">
          {opcoes.map((op, i) => {
            let estado = "border-linha bg-cartao";
            if (marcada !== null && op.certa) estado = "border-musgo bg-musgo-claro";
            else if (marcada === i) estado = "border-erro bg-erro-claro animate-tremer";
            return (
              <button
                key={op.texto}
                onClick={() => escolher(i)}
                className={`w-full rounded-2xl border-2 px-4 py-3 text-left text-[15px] leading-snug ${estado}`}
              >
                {op.texto}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function PaginaRelampago() {
  return (
    <Casca foco>
      <Jogo id="relampago">
        <Relampago />
      </Jogo>
    </Casca>
  );
}
