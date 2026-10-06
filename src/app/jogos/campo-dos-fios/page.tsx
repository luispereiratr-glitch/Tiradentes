"use client";

import Link from "next/link";
import { useState } from "react";
import { Botao, Casca, estiloLinkSuave } from "@/components/Casca";
import { Icone } from "@/components/Icone";
import { Jogo, Topo, usePartida } from "@/components/Jogo";
import { Resultado } from "@/components/Sessao";
import { embaralhar, vibrar } from "@/lib/jogo";

const RODADAS = 10;
/** Cada acerto seguido vale um pouco mais, até um teto. */
const valeCom = (sequencia: number) => 10 + Math.min(sequencia, 5) * 2;
const MAXIMO = Array.from({ length: RODADAS }, (_, i) => valeCom(i)).reduce((s, n) => s + n, 0);

/** Fio perpendicular à página, na posição (x, y) da malha. O ponto P fica na origem. */
type Fio = { x: number; y: number; sai: boolean };
/** Direção na malha: cada componente vale -1, 0 ou 1. [0, 0] é campo nulo. */
type Direcao = [number, number];
type Rodada = { fios: Fio[]; campos: [number, number][]; total: [number, number]; resposta: Direcao };

const POSICOES = [-2, -1, 0, 1, 2].flatMap((x) => [-2, -1, 0, 1, 2].map((y) => ({ x, y }))).filter((p) => p.x !== 0 || p.y !== 0);
const QUASE_ZERO = 1e-9;

/** Campo em P de um fio: perpendicular à reta que liga o fio a P, com intensidade proporcional a 1/distância. */
function campoDe(f: Fio): [number, number] {
  const sinal = f.sai ? 1 : -1;
  const r2 = f.x * f.x + f.y * f.y;
  return [(sinal * f.y) / r2, (-sinal * f.x) / r2];
}

function montar(quantos: number): Rodada | null {
  const fios = embaralhar(POSICOES)
    .slice(0, quantos)
    .map((p) => ({ ...p, sai: Math.random() < 0.5 }));
  const campos = fios.map(campoDe);
  const total: [number, number] = [campos.reduce((s, c) => s + c[0], 0), campos.reduce((s, c) => s + c[1], 0)];
  const [ax, ay] = total.map(Math.abs);
  // Só servem as montagens em que a soma cai exatamente em uma das oito direções (ou se anula).
  const limpa = (ax < QUASE_ZERO && ay < QUASE_ZERO) || ax < QUASE_ZERO || ay < QUASE_ZERO || Math.abs(ax - ay) < QUASE_ZERO;
  if (!limpa) return null;
  const sinal = (n: number) => (Math.abs(n) < QUASE_ZERO ? 0 : Math.sign(n));
  return { fios, campos, total, resposta: [sinal(total[0]), sinal(total[1])] };
}

/** Começa com um fio só e vai até três, quando é preciso somar vetores de cabeça. */
function sortear(indice: number): Rodada {
  const quantos = indice < 3 ? 1 : indice < 8 ? 2 : 3;
  for (let tentativa = 0; tentativa < 400; tentativa++) {
    const rodada = montar(quantos);
    if (rodada) return rodada;
  }
  return montar(1) ?? sortear(0);
}

const PASSO = 52;
const CENTRO = 150;
const naTela = (x: number, y: number) => ({ x: CENTRO + x * PASSO, y: CENTRO - y * PASSO });

function Flecha({ dx, dy, tamanho, className }: { dx: number; dy: number; tamanho: number; className: string }) {
  const modulo = Math.hypot(dx, dy);
  if (modulo < QUASE_ZERO) return null;
  const [ux, uy] = [dx / modulo, -dy / modulo];
  const ponta = { x: CENTRO + ux * tamanho, y: CENTRO + uy * tamanho };
  const base = { x: ponta.x - ux * 11, y: ponta.y - uy * 11 };
  return (
    <g className={className}>
      <line x1={CENTRO} y1={CENTRO} x2={base.x} y2={base.y} strokeWidth={4} strokeLinecap="round" stroke="currentColor" />
      <polygon points={`${ponta.x},${ponta.y} ${base.x - uy * 7},${base.y + ux * 7} ${base.x + uy * 7},${base.y - ux * 7}`} fill="currentColor" />
    </g>
  );
}

function Malha({ rodada, revelar }: { rodada: Rodada; revelar: boolean }) {
  const maior = Math.max(...rodada.campos.map((c) => Math.hypot(c[0], c[1])));
  return (
    <svg viewBox="0 0 300 300" className="w-full rounded-3xl border border-linha bg-cartao" role="img" aria-label="Fios perpendiculares à página em torno do ponto P">
      {POSICOES.map((p) => {
        const t = naTela(p.x, p.y);
        return <circle key={`${p.x},${p.y}`} cx={t.x} cy={t.y} r={2} className="fill-linha" />;
      })}

      {revelar && (
        <>
          {rodada.campos.map((c, i) => (
            <Flecha key={i} dx={c[0]} dy={c[1]} tamanho={22 + (30 * Math.hypot(c[0], c[1])) / maior} className="text-tinta-2 opacity-60" />
          ))}
          <Flecha dx={rodada.total[0]} dy={rodada.total[1]} tamanho={66} className="text-musgo" />
        </>
      )}

      {rodada.fios.map((f) => {
        const t = naTela(f.x, f.y);
        return (
          <g key={`${f.x},${f.y}`}>
            <circle cx={t.x} cy={t.y} r={15} className="fill-cartao stroke-tinta" strokeWidth={3} />
            {f.sai ? (
              <circle cx={t.x} cy={t.y} r={4.5} className="fill-tinta" />
            ) : (
              <path d={`M${t.x - 7} ${t.y - 7}l14 14m0-14-14 14`} className="stroke-tinta" strokeWidth={3} strokeLinecap="round" />
            )}
          </g>
        );
      })}

      <circle cx={CENTRO} cy={CENTRO} r={5} className="fill-barro" />
      <text x={CENTRO + 9} y={CENTRO + 17} className="fill-barro font-titulo text-[16px] font-semibold">
        P
      </text>
    </svg>
  );
}

const NOMES: Record<string, string> = {
  "0,1": "para cima",
  "0,-1": "para baixo",
  "1,0": "para a direita",
  "-1,0": "para a esquerda",
  "1,1": "para cima e para a direita",
  "-1,1": "para cima e para a esquerda",
  "1,-1": "para baixo e para a direita",
  "-1,-1": "para baixo e para a esquerda",
  "0,0": "nenhum lado: o campo é nulo",
};

/** As nove respostas, na ordem de uma rosa dos ventos: de cima para baixo, da esquerda para a direita. */
const OPCOES: Direcao[] = [1, 0, -1].flatMap((y) => [-1, 0, 1].map((x): Direcao => [x, y]));

function CampoDosFios() {
  const { encerrar } = usePartida("campo-dos-fios");
  const [indice, setIndice] = useState(0);
  const [rodada, setRodada] = useState(() => sortear(0));
  const [escolha, setEscolha] = useState<Direcao | null>(null);
  const [pontos, setPontos] = useState(0);
  const [sequencia, setSequencia] = useState(0);
  const [fim, setFim] = useState(false);

  const mesma = (a: Direcao, b: Direcao) => a[0] === b[0] && a[1] === b[1];
  const respondida = escolha !== null;
  const certa = respondida && mesma(escolha, rodada.resposta);
  const vale = valeCom(sequencia);

  function escolher(d: Direcao) {
    if (respondida) return;
    setEscolha(d);
    vibrar(mesma(d, rodada.resposta));
    if (mesma(d, rodada.resposta)) setPontos((n) => n + vale);
  }

  function continuar() {
    if (indice + 1 < RODADAS) {
      setSequencia(certa ? sequencia + 1 : 0);
      setIndice(indice + 1);
      setRodada(sortear(indice + 1));
      setEscolha(null);
    } else {
      encerrar(pontos, Math.round(pontos / 2));
      setFim(true);
    }
  }

  function reiniciar() {
    setIndice(0);
    setRodada(sortear(0));
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

  const varios = rodada.fios.length > 1;

  return (
    <div className="flex flex-1 flex-col">
      <Topo meio={`Rodada ${indice + 1} de ${RODADAS}`} pontos={pontos} />
      <h1 className="text-xl leading-snug font-semibold">Para onde aponta o campo em P?</h1>
      <p className="mt-1 mb-3 text-sm text-tinta-2">
        {varios ? "Os fios têm a mesma corrente" : "O fio"} e {varios ? "furam" : "fura"} a página: ponto, corrente saindo; xis, entrando.
      </p>

      <div key={indice} className="animate-subir">
        <Malha rodada={rodada} revelar={respondida} />
      </div>

      {!respondida ? (
        <div className="mx-auto mt-4 grid w-52 grid-cols-3 gap-2 pb-2">
          {OPCOES.map((d) => {
            const centro = d[0] === 0 && d[1] === 0;
            return (
              <button
                key={d.join()}
                onClick={() => escolher(d)}
                aria-label={centro ? "Campo nulo" : `Campo ${NOMES[d.join()]}`}
                className="flex aspect-square items-center justify-center rounded-2xl border-2 border-linha bg-cartao text-sm font-semibold"
              >
                {centro ? (
                  "nulo"
                ) : (
                  <span style={{ transform: `rotate(${-(Math.atan2(d[1], d[0]) * 180) / Math.PI}deg)` }}>
                    <Icone nome="seta" className="size-7" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <>
          <div className="animate-subir mt-3 rounded-2xl bg-papel-2 p-4 text-[15px] leading-relaxed" aria-live="polite">
            <p className={`mb-1 font-titulo text-lg font-semibold ${certa ? "text-musgo-escuro" : "text-erro"}`}>
              {certa ? `Isso mesmo: +${vale}` : `O campo aponta ${NOMES[rodada.resposta.join()]}`}
            </p>
            <p>
              Pela regra da mão direita, cada fio cria em P um campo perpendicular à reta que o liga a P, mais fraco quanto mais longe está o fio.
              {varios ? " As setas cinza são os campos de cada fio; a colorida é a soma vetorial." : ""}
            </p>
          </div>
          <div className="mt-auto pt-4 pb-2">
            <Botao onClick={continuar} autoFocus>
              {indice + 1 < RODADAS ? "Próxima rodada" : "Ver resultado"}
            </Botao>
          </div>
        </>
      )}
    </div>
  );
}

export default function PaginaCampoDosFios() {
  return (
    <Casca foco>
      <Jogo id="campo-dos-fios">
        <CampoDosFios />
      </Jogo>
    </Casca>
  );
}
