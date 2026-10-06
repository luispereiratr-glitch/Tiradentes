"use client";

import Link from "next/link";
import { useState } from "react";
import { Botao, Casca, estiloLinkSuave } from "@/components/Casca";
import { Formulas } from "@/components/Formulas";
import { Jogo, Topo, usePartida } from "@/components/Jogo";
import { Resultado } from "@/components/Sessao";
import { numero, um } from "@/lib/fisica";
import { vibrar } from "@/lib/jogo";

const RODADAS = 5;
/** Pontos pelo acerto na 1ª, 2ª, 3ª tentativa e daí em diante. */
const PREMIOS = [30, 20, 10, 5];
const VOO = 1150;

/** Parede com a fenda, em pixels do desenho, e quantos pixels vale um metro. */
const PAREDE = 46;
const FENDA = 180;
const ESCALA = 330;

type Rodada = {
  positiva: boolean;
  /** O detector fica acima ou abaixo da fenda. */
  acima: boolean;
  /** Distância da fenda ao detector, em cm. */
  distancia: number;
  /** m/|q| em kg/C e velocidade em m/s. */
  razao: number;
  velocidade: number;
  /** Campo que acerta o detector, em tesla. */
  campo: number;
};

function sortear(): Rodada {
  const campo = um([0.3, 0.4, 0.5, 0.6, 0.8, 1]);
  const distancia = um([10, 12, 16, 20, 24, 30, 40]);
  const razao = um([1, 2, 5]) * 1e-8;
  // 2R = distância, com R = (m/|q|)·v/B.
  const velocidade = (campo * distancia) / 200 / razao;
  return { positiva: Math.random() < 0.5, acima: Math.random() < 0.5, distancia, razao, velocidade, campo };
}

type Tiro = { campo: number; saindo: boolean };

/** Diâmetro da meia-volta, em cm, e se ela sobe na tela. */
function trajetoria(r: Rodada, tiro: Tiro) {
  return { diametro: (2 * r.razao * r.velocidade * 100) / tiro.campo, sobe: r.positiva !== tiro.saindo };
}

function Mira() {
  const { encerrar } = usePartida("mira");
  const [rodada, setRodada] = useState(sortear);
  const [indice, setIndice] = useState(0);
  const [campo, setCampo] = useState(0.5);
  const [saindo, setSaindo] = useState(true);
  const [tiro, setTiro] = useState<Tiro | null>(null);
  const [tentativas, setTentativas] = useState(0);
  const [fase, setFase] = useState<"ajuste" | "voo" | "acerto">("ajuste");
  const [pontos, setPontos] = useState(0);
  const [fim, setFim] = useState(false);

  const premio = PREMIOS[Math.min(tentativas, PREMIOS.length) - 1] ?? PREMIOS[0];
  const caminho = tiro && trajetoria(rodada, tiro);
  const bateuNoLado = caminho && caminho.sobe === rodada.acima;

  function lancar() {
    const novo = { campo, saindo };
    // O controle anda de 0,05 em 0,05 T: só o valor exato leva ao detector.
    const acertou = trajetoria(rodada, novo).sobe === rodada.acima && Math.abs(campo - rodada.campo) < 0.02;
    setTiro(novo);
    setTentativas((n) => n + 1);
    setFase("voo");
    setTimeout(() => {
      vibrar(acertou);
      if (acertou) setPontos((p) => p + PREMIOS[Math.min(tentativas, PREMIOS.length - 1)]);
      setFase(acertou ? "acerto" : "ajuste");
    }, VOO);
  }

  function continuar() {
    if (indice + 1 < RODADAS) {
      setIndice(indice + 1);
      setRodada(sortear());
      setTiro(null);
      setTentativas(0);
      setFase("ajuste");
    } else {
      encerrar(pontos, Math.round(pontos / 2));
      setFim(true);
    }
  }

  function reiniciar() {
    setRodada(sortear());
    setIndice(0);
    setTiro(null);
    setTentativas(0);
    setFase("ajuste");
    setPontos(0);
    setFim(false);
  }

  if (fim) {
    return (
      <Resultado
        titulo="Fim de jogo"
        destaque={`${pontos} pts`}
        detalhe={`+${Math.round(pontos / 2)} XP · máximo possível: ${RODADAS * PREMIOS[0]}`}
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

  const y = (cm: number, sobe: boolean) => FENDA + ((sobe ? -1 : 1) * cm * ESCALA) / 100;
  const raio = caminho ? (caminho.diametro * ESCALA) / 200 : 0;
  // Enquanto a pessoa ajusta, o fundo mostra o sentido escolhido; durante o voo, o do tiro.
  const sentido = fase === "ajuste" ? saindo : (tiro?.saindo ?? saindo);

  return (
    <div className="flex flex-1 flex-col">
      <Topo meio={`Lançamento ${indice + 1} de ${RODADAS}`} pontos={pontos} />

      <p className="mb-3 rounded-2xl bg-papel-2 px-4 py-3 text-[15px] leading-relaxed">
        <span className="font-semibold">Carga {rodada.positiva ? "positiva" : "negativa"}</span>, com m/|q| = {numero(rodada.razao)} kg/C e v ={" "}
        {numero(rodada.velocidade)} m/s. O detector está <span className="font-semibold">{rodada.distancia} cm {rodada.acima ? "acima" : "abaixo"}</span> da
        fenda.
      </p>

      <svg viewBox="0 0 320 360" className="w-full rounded-3xl border border-linha bg-cartao" role="img" aria-label="Câmara com campo magnético, fenda de entrada e detector">
        {/* Campo: ponto = saindo da página, xis = entrando */}
        {Array.from({ length: 6 }, (_, i) =>
          Array.from({ length: 7 }, (_, j) => (
            <text key={`${i}-${j}`} x={82 + i * 44} y={34 + j * 50} textAnchor="middle" dominantBaseline="middle" className="fill-linha text-[17px] font-semibold">
              {sentido ? "•" : "×"}
            </text>
          )),
        )}

        {/* Parede com régua de 10 em 10 cm */}
        <line x1={PAREDE} y1={0} x2={PAREDE} y2={360} className="stroke-tinta" strokeWidth={4} />
        {[10, 20, 30, 40, 50].flatMap((cm) =>
          [true, false].map((sobe) => (
            <g key={`${cm}-${sobe}`}>
              <line x1={PAREDE - 9} y1={y(cm, sobe)} x2={PAREDE} y2={y(cm, sobe)} className="stroke-tinta-2" strokeWidth={1.5} />
              <text x={PAREDE - 13} y={y(cm, sobe)} textAnchor="end" dominantBaseline="middle" className="fill-tinta-2 text-[11px]">
                {cm}
              </text>
            </g>
          )),
        )}
        <text x={PAREDE - 13} y={FENDA} textAnchor="end" dominantBaseline="middle" className="fill-tinta-2 text-[11px]">
          0
        </text>

        {/* Fenda e sentido de entrada */}
        <line x1={PAREDE} y1={FENDA - 7} x2={PAREDE} y2={FENDA + 7} className="stroke-cartao" strokeWidth={5} />
        <path d={`M${PAREDE + 4} ${FENDA}h26m-8-6 8 6-8 6`} fill="none" className="stroke-musgo" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

        {/* Detector */}
        <rect
          x={PAREDE - 4}
          y={y(rodada.distancia, rodada.acima) - 8}
          width={10}
          height={16}
          rx={3}
          className={fase === "acerto" ? "animate-pulo fill-musgo" : "fill-ouro"}
        />

        {tiro && (
          <path
            key={tentativas}
            d={`M${PAREDE} ${FENDA}A${raio} ${raio} 0 0 ${caminho!.sobe ? 0 : 1} ${PAREDE} ${y(caminho!.diametro, caminho!.sobe)}`}
            fill="none"
            pathLength={1}
            strokeDasharray={1}
            strokeWidth={3.5}
            strokeLinecap="round"
            className={`animate-tracar ${fase === "acerto" ? "stroke-musgo" : "stroke-barro"}`}
          />
        )}
      </svg>

      {fase === "acerto" ? (
        <div className="animate-subir mt-3 rounded-2xl bg-papel-2 p-4 text-[15px] leading-relaxed" aria-live="polite">
          <p className="mb-1 font-titulo text-lg font-semibold text-musgo-escuro">
            No detector: +{premio} ({tentativas === 1 ? "de primeira" : `${tentativas} tentativas`})
          </p>
          <p>
            <Formulas>{`Meia volta leva a partícula a um diâmetro da fenda: 2R = 2·(m/|q|)·v/B = ${rodada.distancia} cm exige B = ${numero(rodada.campo)} T.`}</Formulas>
          </p>
        </div>
      ) : (
        <>
          <div className="mt-3 flex items-center gap-3">
            <label htmlFor="campo" className="w-24 shrink-0 font-titulo text-lg font-semibold tabular-nums">
              B = {numero(campo)} T
            </label>
            <input
              id="campo"
              type="range"
              min={0.1}
              max={1}
              step={0.05}
              value={campo}
              disabled={fase === "voo"}
              onChange={(e) => setCampo(Number(e.target.value))}
              className="h-10 flex-1 accent-musgo"
            />
          </div>
          <div className="mt-1 grid grid-cols-2 gap-2">
            {[true, false].map((opcao) => (
              <button
                key={String(opcao)}
                onClick={() => setSaindo(opcao)}
                disabled={fase === "voo"}
                aria-pressed={saindo === opcao}
                className={`rounded-2xl border-2 py-2.5 text-sm font-semibold ${saindo === opcao ? "border-musgo bg-musgo-claro text-musgo-escuro" : "border-linha bg-cartao text-tinta-2"}`}
              >
                {opcao ? "• Campo saindo da página" : "× Campo entrando"}
              </button>
            ))}
          </div>

          <p className="mt-2 min-h-11 text-sm leading-snug text-tinta-2" aria-live="polite">
            {fase === "ajuste" && caminho
              ? !bateuNoLado
                ? "A partícula curvou para o lado errado. Confira a regra do tapa: carga, velocidade para a direita e sentido do campo."
                : `Bateu a ${numero(caminho.diametro)} cm da fenda; o detector está a ${rodada.distancia} cm.${tentativas >= 2 ? " Lembre: 2R = 2·(m/|q|)·v/B." : ""}`
              : "A partícula entra pela fenda indo para a direita e dá meia volta."}
          </p>

          <div className="mt-auto pt-2 pb-2">
            <Botao onClick={lancar} disabled={fase === "voo"}>
              {fase === "voo" ? "Voando…" : tentativas === 0 ? "Lançar" : "Lançar de novo"}
            </Botao>
          </div>
        </>
      )}

      {fase === "acerto" && (
        <div className="mt-auto pt-4 pb-2">
          <Botao onClick={continuar} autoFocus>
            {indice + 1 < RODADAS ? "Próximo lançamento" : "Ver resultado"}
          </Botao>
        </div>
      )}
    </div>
  );
}

export default function PaginaMira() {
  return (
    <Casca foco>
      <Jogo id="mira">
        <Mira />
      </Jogo>
    </Casca>
  );
}
