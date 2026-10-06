"use client";

import Link from "next/link";
import { useState } from "react";
import { Botao, Casca, estiloLinkSuave } from "@/components/Casca";
import { Icone } from "@/components/Icone";
import { Jogo, Topo, usePartida } from "@/components/Jogo";
import { Resultado } from "@/components/Sessao";
import { embaralhar, vibrar } from "@/lib/jogo";

const VIDAS = 3;
/** Cada acerto seguido vale um pouco mais, até um teto. */
const valeCom = (sequencia: number) => 10 + Math.min(sequencia, 5) * 2;

function MaisForte() {
  const { disciplina, encerrar } = usePartida("mais-forte");
  const [fila, setFila] = useState(() => embaralhar(disciplina.eventos));
  const [indice, setIndice] = useState(0);
  const [palpite, setPalpite] = useState<boolean | null>(null);
  const [pontos, setPontos] = useState(0);
  const [sequencia, setSequencia] = useState(0);
  const [vidas, setVidas] = useState(VIDAS);
  const [fim, setFim] = useState(false);

  const atual = fila[indice];
  const proximo = fila[indice + 1];
  const maior = proximo.ano > atual.ano;
  const respondida = palpite !== null;
  const certa = palpite === maior;

  function escolher(dizMaior: boolean) {
    if (respondida) return;
    const acertou = dizMaior === maior;
    setPalpite(dizMaior);
    vibrar(acertou);
    if (acertou) setPontos((p) => p + valeCom(sequencia));
    const restam = acertou ? vidas : vidas - 1;
    setVidas(restam);
    setTimeout(
      () => {
        if (restam === 0 || indice + 2 >= fila.length) {
          encerrar(pontos + (acertou ? valeCom(sequencia) : 0), Math.round((pontos + (acertou ? valeCom(sequencia) : 0)) / 2));
          setFim(true);
          return;
        }
        setSequencia(acertou ? sequencia + 1 : 0);
        setIndice(indice + 1);
        setPalpite(null);
      },
      acertou ? 1100 : 2000,
    );
  }

  function reiniciar() {
    setFila(embaralhar(disciplina.eventos));
    setIndice(0);
    setPalpite(null);
    setPontos(0);
    setSequencia(0);
    setVidas(VIDAS);
    setFim(false);
  }

  if (fim) {
    return (
      <Resultado
        titulo={vidas > 0 ? "Você zerou a lista" : "Acabaram as vidas"}
        destaque={`${pontos} pts`}
        detalhe={`+${Math.round(pontos / 2)} XP`}
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

  const cartao = "rounded-3xl border-2 p-5 text-center";

  return (
    <div className="flex flex-1 flex-col">
      <Topo
        meio={
          <span className="flex items-center gap-1" aria-label={`${vidas} vidas`}>
            {Array.from({ length: VIDAS }, (_, i) => (
              <span key={i} className={i < vidas ? "text-barro" : "text-linha"}>
                <Icone nome="chama" className="size-5" cheio />
              </span>
            ))}
          </span>
        }
        pontos={pontos}
      />

      <div className={`${cartao} border-linha bg-cartao`}>
        <p className="text-[17px] leading-snug">{atual.texto}</p>
        <p className="mt-2 font-titulo text-3xl font-semibold text-musgo">{atual.rotulo ?? atual.ano}</p>
      </div>

      <p className="my-3 text-center text-sm font-semibold tracking-wide text-tinta-2 uppercase">comparado a ele, este é…</p>

      <div
        key={indice}
        className={`animate-subir ${cartao} ${!respondida ? "border-musgo bg-musgo-claro" : certa ? "border-musgo bg-musgo-claro" : "animate-tremer border-erro bg-erro-claro"}`}
        aria-live="polite"
      >
        <p className="text-[17px] leading-snug">{proximo.texto}</p>
        <p className={`mt-2 font-titulo text-3xl font-semibold ${respondida ? (certa ? "text-musgo-escuro" : "text-erro") : "text-tinta-2"}`}>
          {respondida ? (proximo.rotulo ?? proximo.ano) : "?"}
        </p>
        {respondida && <p className="mt-1 text-sm font-semibold">{maior ? "Mais forte" : "Mais fraco"}</p>}
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2.5 pt-5 pb-2">
        <button onClick={() => escolher(true)} disabled={respondida} className="flex flex-col items-center gap-1 rounded-2xl border-2 border-linha bg-cartao py-4 text-lg font-semibold disabled:opacity-50">
          <Icone nome="cima" className="size-7 text-musgo" />
          Mais forte
        </button>
        <button onClick={() => escolher(false)} disabled={respondida} className="flex flex-col items-center gap-1 rounded-2xl border-2 border-linha bg-cartao py-4 text-lg font-semibold disabled:opacity-50">
          <Icone nome="baixo" className="size-7 text-barro" />
          Mais fraco
        </button>
      </div>
    </div>
  );
}

export default function PaginaMaisForte() {
  return (
    <Casca foco>
      <Jogo id="mais-forte">
        <MaisForte />
      </Jogo>
    </Casca>
  );
}
