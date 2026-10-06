"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Botao, Casca, estiloLinkSuave } from "@/components/Casca";
import { Jogo, Topo, usePartida } from "@/components/Jogo";
import { Resultado } from "@/components/Sessao";
import { EIXOS, iguais, nomeDoEixo, nulo, um, type Vetor, vetorial, vezes } from "@/lib/fisica";
import { vibrar } from "@/lib/jogo";

const RODADAS = 10;
/** Cada acerto seguido vale um pouco mais, até um teto. */
const valeCom = (sequencia: number) => 10 + Math.min(sequencia, 5) * 2;
const MAXIMO = Array.from({ length: RODADAS }, (_, i) => valeCom(i)).reduce((s, n) => s + n, 0);

type Tipo = "positiva" | "negativa" | "fio";
type Rodada = { tipo: Tipo; v: Vetor; b: Vetor; f: Vetor };
type Resposta = Vetor | "nula";

function sortear(): Rodada {
  const tipo = um<Tipo>(["positiva", "negativa", "fio"]);
  const v = um(EIXOS).v;
  // De vez em quando o movimento é paralelo ao campo: aí não há força.
  const paralelo = Math.random() < 0.15;
  const b = um(EIXOS.filter((e) => nulo(vetorial(v, e.v)) === paralelo)).v;
  return { tipo, v, b, f: vezes(vetorial(v, b), tipo === "negativa" ? -1 : 1) };
}

const acertou = (r: Rodada, resposta: Resposta) => (resposta === "nula" ? nulo(r.f) : iguais(r.f, resposta));

function explicar(r: Rodada): string {
  const movimento = r.tipo === "fio" ? "na corrente" : "na velocidade";
  if (nulo(r.f)) return `${r.tipo === "fio" ? "A corrente" : "A velocidade"} é paralela ao campo: sen θ = 0 e a força é nula.`;
  const palma = nomeDoEixo(vetorial(r.v, r.b));
  const base = `Polegar ${movimento} (${nomeDoEixo(r.v)}), dedos no campo (${nomeDoEixo(r.b)}): a palma fica voltada para ${palma}.`;
  return r.tipo === "negativa" ? `${base} A carga é negativa, então a força é o oposto: ${nomeDoEixo(r.f)}.` : base;
}

const CENTRO = { x: 160, y: 158 };
const ESCALA = 86;

/** Projeção ortográfica: `giro` em torno do eixo z (vertical) e `inclinacao` da câmera para baixo. */
function projetar([x, y, z]: Vetor, giro: number, inclinacao: number) {
  const lado = x * Math.cos(giro) - y * Math.sin(giro);
  const fundo = x * Math.sin(giro) + y * Math.cos(giro);
  return {
    x: CENTRO.x + ESCALA * lado,
    y: CENTRO.y - ESCALA * (z * Math.cos(inclinacao) + fundo * Math.sin(inclinacao)),
    fundo: fundo * Math.cos(inclinacao) - z * Math.sin(inclinacao),
  };
}

function Seta({ ate, cor, rotulo }: { ate: { x: number; y: number }; cor: string; rotulo: string }) {
  const dx = ate.x - CENTRO.x;
  const dy = ate.y - CENTRO.y;
  const comprimento = Math.hypot(dx, dy) || 1;
  const [ux, uy] = [dx / comprimento, dy / comprimento];
  const base = { x: ate.x - ux * 16, y: ate.y - uy * 16 };
  return (
    <g>
      <line x1={CENTRO.x} y1={CENTRO.y} x2={base.x} y2={base.y} stroke={cor} strokeWidth={6} strokeLinecap="round" />
      <polygon points={`${ate.x},${ate.y} ${base.x - uy * 9},${base.y + ux * 9} ${base.x + uy * 9},${base.y - ux * 9}`} fill={cor} />
      <text x={ate.x + ux * 4 - uy * 16} y={ate.y + uy * 4 + ux * 16} textAnchor="middle" dominantBaseline="middle" fill={cor} className="font-titulo text-[19px] font-semibold">
        {rotulo}
      </text>
    </g>
  );
}

function Cena({ rodada, resposta, aoEscolher }: { rodada: Rodada; resposta: Resposta | null; aoEscolher: (v: Vetor) => void }) {
  const [giro, setGiro] = useState(0.6);
  const [inclinacao, setInclinacao] = useState(0.42);
  const arrasto = useRef<{ x: number; y: number; andou: number } | null>(null);
  const p = (v: Vetor) => projetar(v, giro, inclinacao);

  function mover(e: React.PointerEvent) {
    const a = arrasto.current;
    // Com o mouse, só gira enquanto o botão está apertado.
    if (!a || (e.pointerType === "mouse" && e.buttons === 0)) return;
    const [dx, dy] = [e.clientX - a.x, e.clientY - a.y];
    arrasto.current = { x: e.clientX, y: e.clientY, andou: a.andou + Math.abs(dx) + Math.abs(dy) };
    setGiro((g) => g - dx * 0.012);
    setInclinacao((i) => Math.min(1.25, Math.max(-0.25, i + dy * 0.01)));
  }

  function tocar(v: Vetor) {
    // Quem acabou de arrastar a cena não quis responder.
    if ((arrasto.current?.andou ?? 0) > 8) return;
    aoEscolher(v);
  }

  const respondida = resposta !== null;
  const alvos = EIXOS.map((e) => ({ ...e, ponto: p(vezes(e.v, 1.32)) })).sort((a, b) => b.ponto.fundo - a.ponto.fundo);
  const corDoAlvo = (v: Vetor) => {
    if (!respondida) return "fill-cartao stroke-linha text-tinta-2";
    if (iguais(v, rodada.f)) return "fill-musgo stroke-musgo-escuro text-papel";
    if (resposta !== "nula" && iguais(v, resposta)) return "fill-erro-claro stroke-erro text-erro";
    return "fill-cartao stroke-linha text-tinta-2 opacity-40";
  };

  return (
    <svg
      viewBox="0 0 320 316"
      className="w-full touch-none rounded-3xl border border-linha bg-cartao select-none"
      onPointerDown={(e) => (arrasto.current = { x: e.clientX, y: e.clientY, andou: 0 })}
      onPointerMove={mover}
      onPointerLeave={() => (arrasto.current = null)}
      role="group"
      aria-label="Cena em três dimensões. Arraste para girar e toque em um dos eixos para responder."
    >
      {EIXOS.filter((e) => e.nome.startsWith("+")).map((e) => {
        const [a, b] = [p(vezes(e.v, -1.12)), p(vezes(e.v, 1.12))];
        return <line key={e.nome} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="stroke-linha" strokeWidth={2} strokeDasharray="5 5" />;
      })}

      {alvos.map((e) => (
        <g key={e.nome} role="button" aria-label={`Força para ${e.nome}`} onClick={() => tocar(e.v)} className={`cursor-pointer ${corDoAlvo(e.v)}`}>
          <circle cx={e.ponto.x} cy={e.ponto.y} r={19} strokeWidth={2.5} />
          <text x={e.ponto.x} y={e.ponto.y + 1} textAnchor="middle" dominantBaseline="middle" fill="currentColor" stroke="none" className="text-[14px] font-semibold">
            {e.nome}
          </text>
        </g>
      ))}

      <Seta ate={p(vezes(rodada.b, 0.95))} cor="var(--color-barro)" rotulo="B" />
      <Seta ate={p(vezes(rodada.v, 0.95))} cor="var(--color-musgo)" rotulo={rodada.tipo === "fio" ? "i" : "v"} />

      {rodada.tipo !== "fio" && (
        <g>
          <circle cx={CENTRO.x} cy={CENTRO.y} r={14} className={rodada.tipo === "positiva" ? "fill-erro" : "fill-tinta"} />
          <text x={CENTRO.x} y={CENTRO.y + 1} textAnchor="middle" dominantBaseline="middle" className="fill-papel text-[20px] font-bold">
            {rodada.tipo === "positiva" ? "+" : "−"}
          </text>
        </g>
      )}
    </svg>
  );
}

const SUJEITO: Record<Tipo, string> = {
  positiva: "Carga positiva com velocidade v",
  negativa: "Carga negativa com velocidade v",
  fio: "Fio com corrente i",
};

function Tapa() {
  const { encerrar } = usePartida("regra-do-tapa");
  const [rodada, setRodada] = useState(sortear);
  const [indice, setIndice] = useState(0);
  const [resposta, setResposta] = useState<Resposta | null>(null);
  const [pontos, setPontos] = useState(0);
  const [sequencia, setSequencia] = useState(0);
  const [fim, setFim] = useState(false);

  const respondida = resposta !== null;
  const certa = respondida && acertou(rodada, resposta);
  const vale = valeCom(sequencia);

  function escolher(r: Resposta) {
    if (respondida) return;
    setResposta(r);
    vibrar(acertou(rodada, r));
    if (acertou(rodada, r)) setPontos((n) => n + vale);
  }

  function continuar() {
    if (indice + 1 < RODADAS) {
      setSequencia(certa ? sequencia + 1 : 0);
      setIndice(indice + 1);
      setRodada(sortear());
      setResposta(null);
    } else {
      encerrar(pontos, Math.round(pontos / 2));
      setFim(true);
    }
  }

  function reiniciar() {
    setRodada(sortear());
    setIndice(0);
    setResposta(null);
    setPontos(0);
    setSequencia(0);
    setFim(false);
  }

  if (fim) {
    return (
      <Resultado
        titulo="Fim de jogo"
        destaque={`${pontos} pts`}
        detalhe={`+${Math.round(pontos / 2)} XP · máximo possível: ${MAXIMO}`}
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
      <Topo meio={`Rodada ${indice + 1} de ${RODADAS}`} pontos={pontos} />
      <h1 className="text-xl leading-snug font-semibold">{SUJEITO[rodada.tipo]}, em um campo B</h1>
      <p className="mt-1 mb-3 text-sm text-tinta-2">Para onde aponta a força? Arraste para girar a cena e toque no eixo certo.</p>

      <Cena key={indice} rodada={rodada} resposta={resposta} aoEscolher={escolher} />

      {!respondida && (
        <button onClick={() => escolher("nula")} className="mt-3 w-full rounded-2xl border-2 border-linha bg-cartao py-3 font-semibold">
          A força é nula
        </button>
      )}

      {respondida && (
        <div className="animate-subir mt-3 rounded-2xl bg-papel-2 p-4 text-[15px] leading-relaxed" aria-live="polite">
          <p className={`mb-1 font-titulo text-lg font-semibold ${certa ? "text-musgo-escuro" : "text-erro"}`}>
            {certa ? `Na mosca: +${vale}` : nulo(rodada.f) ? "A força era nula" : `A força aponta para ${nomeDoEixo(rodada.f)}`}
          </p>
          <p>{explicar(rodada)}</p>
        </div>
      )}

      {respondida && (
        <div className="mt-auto pt-4 pb-2">
          <Botao onClick={continuar} autoFocus>
            {indice + 1 < RODADAS ? "Próxima rodada" : "Ver resultado"}
          </Botao>
        </div>
      )}
    </div>
  );
}

export default function PaginaTapa() {
  return (
    <Casca foco>
      <Jogo id="regra-do-tapa">
        <Tapa />
      </Jogo>
    </Casca>
  );
}
