"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Botao, Casca, estiloLinkSuave } from "@/components/Casca";
import { Formulas } from "@/components/Formulas";
import { Icone } from "@/components/Icone";
import { Abertura, BarraDeTempo, Jogo, useContagem, usePartida } from "@/components/Jogo";
import { Resultado } from "@/components/Sessao";
import { sortearConta } from "@/lib/fisica";
import { vibrar } from "@/lib/jogo";

const DURACAO = 75;

function Partida({ aoRepetir }: { aoRepetir: () => void }) {
  const { recorde, encerrar } = usePartida("conta-rapida");
  const { tempo, acabou } = useContagem(DURACAO, true);
  const [conta, setConta] = useState(sortearConta);
  const [numero, setNumero] = useState(0);
  const [marcada, setMarcada] = useState<string | null>(null);
  const [pontos, setPontos] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [combo, setCombo] = useState(0);

  useEffect(() => {
    if (acabou) encerrar(pontos, Math.round(pontos / 3));
    // Fecha a partida uma única vez, quando o tempo zera.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acabou]);

  function escolher(opcao: string) {
    if (marcada !== null || acabou) return;
    const certa = opcao === conta.certa;
    setMarcada(opcao);
    vibrar(certa);
    if (certa) {
      setPontos((p) => p + 10 + combo * 2);
      setAcertos((a) => a + 1);
      setCombo((c) => c + 1);
    } else setCombo(0);
    // No erro a fórmula fica na tela um pouco mais, para dar tempo de ler.
    setTimeout(
      () => {
        setMarcada(null);
        setConta(sortearConta());
        setNumero((n) => n + 1);
      },
      certa ? 350 : 2200,
    );
  }

  if (acabou) {
    return (
      <Resultado
        titulo="Tempo esgotado"
        destaque={`${pontos} pts`}
        detalhe={`${acertos} ${acertos === 1 ? "conta certa" : "contas certas"} · +${Math.round(pontos / 3)} XP · recorde ${Math.max(pontos, recorde ?? 0)}`}
        acoes={
          <>
            <Botao onClick={aoRepetir}>Jogar de novo</Botao>
            <Link href="/jogos" className={estiloLinkSuave}>
              Outros jogos
            </Link>
          </>
        }
      />
    );
  }

  const errou = marcada !== null && marcada !== conta.certa;

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-4 flex items-center justify-between font-semibold tabular-nums">
        <span className={`flex items-center gap-1.5 ${tempo <= 10 ? "text-erro" : "text-tinta"}`}>
          <Icone nome="relogio" /> {tempo}s
        </span>
        {combo >= 2 && <span className="animate-pulo rounded-full bg-barro px-3 py-1 text-sm text-papel">Combo ×{combo}</span>}
        <span className="text-musgo">{pontos} pts</span>
      </div>
      <BarraDeTempo tempo={tempo} duracao={DURACAO} />

      <div key={numero} className="animate-subir">
        <h2 className="mb-5 text-[19px] leading-snug font-medium">{conta.enunciado}</h2>
        <div className="grid grid-cols-2 gap-2.5">
          {conta.opcoes.map((opcao) => {
            let estado = "border-linha bg-cartao";
            if (marcada !== null && opcao === conta.certa) estado = "border-musgo bg-musgo-claro";
            else if (marcada === opcao) estado = "border-erro bg-erro-claro animate-tremer";
            return (
              <button
                key={opcao}
                onClick={() => escolher(opcao)}
                className={`rounded-2xl border-2 px-3 py-4 font-titulo text-[17px] font-semibold tabular-nums ${estado}`}
              >
                {opcao}
              </button>
            );
          })}
        </div>
        {errou && (
          <p className="animate-subir mt-4 rounded-2xl bg-papel-2 p-3.5 text-[15px] leading-relaxed" aria-live="polite">
            <span className="font-semibold">Fórmula: </span>
            <Formulas>{conta.dica}</Formulas>
          </p>
        )}
      </div>

      <p className="mt-auto pt-6 text-center text-xs text-tinta-2">µ₀ = 4π × 10⁻⁷ T·m/A · 1 µC = 10⁻⁶ C</p>
    </div>
  );
}

function ContaRapida() {
  const [partida, setPartida] = useState(0);
  if (partida === 0) {
    return (
      <Abertura
        id="conta-rapida"
        regra={`Você tem ${DURACAO} segundos para resolver o máximo de contas. Acertos seguidos valem mais; um erro zera o combo e mostra a fórmula.`}
        aoComecar={() => setPartida(1)}
      />
    );
  }
  return <Partida key={partida} aoRepetir={() => setPartida((n) => n + 1)} />;
}

export default function PaginaContaRapida() {
  return (
    <Casca foco>
      <Jogo id="conta-rapida">
        <ContaRapida />
      </Jogo>
    </Casca>
  );
}
