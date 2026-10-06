"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Botao, Casca, estiloLinkSuave } from "@/components/Casca";
import { Icone } from "@/components/Icone";
import { Abertura, BarraDeTempo, Jogo, useContagem, usePartida } from "@/components/Jogo";
import { Resultado } from "@/components/Sessao";
import { um } from "@/lib/fisica";
import { vibrar } from "@/lib/jogo";

const DURACAO = 45;

type Resposta = "atrai" | "repele" | "nada";
type Cena = { desenho: React.ReactNode; legenda: string; resposta: Resposta; porque: string };

const RESPOSTAS: { id: Resposta; nome: string }[] = [
  { id: "atrai", nome: "Atrai" },
  { id: "repele", nome: "Repele" },
  { id: "nada", nome: "Nada" },
];

const caixa = "flex items-center justify-center font-titulo font-semibold";

/** Ímã em barra com os polos na ordem dada, ex.: "SN". */
function Ima({ polos }: { polos: string }) {
  return (
    <span className="flex overflow-hidden rounded-lg border-2 border-tinta">
      {[...polos].map((p, i) => (
        <span key={i} className={`${caixa} h-12 w-10 text-lg ${p === "N" ? "bg-erro text-papel" : "bg-musgo text-papel"}`}>
          {p}
        </span>
      ))}
    </span>
  );
}

/** Fio visto de lado, com a seta da corrente. */
function Fio({ sobe }: { sobe: boolean }) {
  return (
    <span className="flex h-28 flex-col items-center">
      <span className="h-full w-1.5 rounded bg-tinta" />
      <span className={`absolute mt-9 rounded-full bg-cartao p-0.5 text-barro ${sobe ? "" : "rotate-180"}`}>
        <Icone nome="cima" className="size-7" />
      </span>
    </span>
  );
}

/** Fio furando a página: ponto = corrente saindo, xis = corrente entrando. */
function Furo({ sai }: { sai: boolean }) {
  return <span className={`${caixa} size-14 rounded-full border-[3px] border-tinta bg-cartao text-2xl`}>{sai ? "•" : "×"}</span>;
}

function Carga({ positiva, parada = false }: { positiva: boolean; parada?: boolean }) {
  return (
    <span className="flex flex-col items-center gap-1">
      <span className={`${caixa} size-12 rounded-full text-2xl text-papel ${positiva ? "bg-erro" : "bg-musgo"}`}>{positiva ? "+" : "−"}</span>
      {parada && <span className="text-xs font-semibold text-tinta-2">parada</span>}
    </span>
  );
}

const Objeto = ({ nome }: { nome: string }) => <span className={`${caixa} h-12 rounded-lg border-2 border-dashed border-tinta-2 px-3 text-sm`}>{nome}</span>;

const par = (a: React.ReactNode, b: React.ReactNode) => (
  <div className="relative flex items-center justify-center gap-10">
    {a}
    {b}
  </div>
);

function sortear(): Cena {
  const a = Math.random() < 0.5;
  const b = Math.random() < 0.5;
  return um<() => Cena>([
    () => ({
      desenho: par(<Fio sobe={a} />, <Fio sobe={b} />),
      legenda: "Dois fios paralelos com corrente",
      resposta: a === b ? "atrai" : "repele",
      porque: a === b ? "Correntes de mesmo sentido se atraem." : "Correntes de sentidos opostos se repelem.",
    }),
    () => ({
      desenho: par(<Furo sai={a} />, <Furo sai={b} />),
      legenda: "Dois fios furando a página (• sai, × entra)",
      resposta: a === b ? "atrai" : "repele",
      porque: a === b ? "As duas correntes têm o mesmo sentido: atração." : "Uma sai e a outra entra: sentidos opostos, repulsão.",
    }),
    () => {
      const esquerda = a ? "SN" : "NS";
      const direita = b ? "SN" : "NS";
      const atrai = esquerda[1] !== direita[0];
      return {
        desenho: par(<Ima polos={esquerda} />, <Ima polos={direita} />),
        legenda: "Dois ímãs em barra",
        resposta: atrai ? "atrai" : "repele",
        porque: atrai ? "Ficam frente a frente polos opostos: atração." : "Ficam frente a frente polos iguais: repulsão.",
      };
    },
    () => ({
      desenho: par(<Carga positiva={a} />, <Carga positiva={b} />),
      legenda: "Duas cargas elétricas",
      resposta: a === b ? "repele" : "atrai",
      porque: a === b ? "Com cargas é o contrário das correntes: iguais se repelem." : "Cargas de sinais opostos se atraem.",
    }),
    () => ({
      desenho: par(<Ima polos={a ? "SN" : "NS"} />, <Objeto nome="prego de ferro" />),
      legenda: "Um ímã e um prego que não é ímã",
      resposta: "atrai",
      porque: "O ferro é imantado por indução e é atraído por qualquer polo.",
    }),
    () => ({
      desenho: par(<Ima polos={a ? "SN" : "NS"} />, <Carga positiva={b} parada />),
      legenda: "Um ímã e uma carga em repouso",
      resposta: "nada",
      porque: "Campo magnético não age sobre carga parada.",
    }),
    () => ({
      desenho: par(<Ima polos={a ? "SN" : "NS"} />, <Objeto nome={b ? "moeda de cobre" : "anel de ouro"} />),
      legenda: "Um ímã e um objeto que não é ferromagnético",
      resposta: "nada",
      porque: "Cobre e ouro praticamente não respondem a um ímã.",
    }),
  ])();
}

function Partida({ aoRepetir }: { aoRepetir: () => void }) {
  const { recorde, encerrar } = usePartida("atrai-repele");
  const { tempo, acabou } = useContagem(DURACAO, true);
  const [cena, setCena] = useState(sortear);
  const [numero, setNumero] = useState(0);
  const [marcada, setMarcada] = useState<Resposta | null>(null);
  const [pontos, setPontos] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [combo, setCombo] = useState(0);

  useEffect(() => {
    if (acabou) encerrar(pontos, Math.round(pontos / 4));
    // Fecha a partida uma única vez, quando o tempo zera.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acabou]);

  function escolher(resposta: Resposta) {
    if (marcada !== null || acabou) return;
    const certa = resposta === cena.resposta;
    setMarcada(resposta);
    vibrar(certa);
    if (certa) {
      setPontos((p) => p + 10 + Math.min(combo, 10));
      setAcertos((a) => a + 1);
      setCombo((c) => c + 1);
    } else setCombo(0);
    setTimeout(
      () => {
        setMarcada(null);
        setCena(sortear());
        setNumero((n) => n + 1);
      },
      certa ? 250 : 1700,
    );
  }

  if (acabou) {
    return (
      <Resultado
        titulo="Tempo esgotado"
        destaque={`${pontos} pts`}
        detalhe={`${acertos} ${acertos === 1 ? "acerto" : "acertos"} · +${Math.round(pontos / 4)} XP · recorde ${Math.max(pontos, recorde ?? 0)}`}
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

  const errou = marcada !== null && marcada !== cena.resposta;

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

      <div key={numero} className="animate-subir flex flex-1 flex-col">
        <p className="mb-3 text-center text-tinta-2">{cena.legenda}</p>
        <div className="flex min-h-44 flex-1 items-center justify-center rounded-3xl border border-linha bg-cartao p-6">{cena.desenho}</div>
        <p className={`mt-3 min-h-12 text-center text-[15px] leading-snug ${errou ? "font-semibold text-erro" : "text-transparent"}`} aria-live="polite">
          {errou ? cena.porque : "."}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2.5 pb-2">
        {RESPOSTAS.map((r) => {
          let estado = "border-linha bg-cartao";
          if (marcada !== null && r.id === cena.resposta) estado = "border-musgo bg-musgo-claro";
          else if (marcada === r.id) estado = "border-erro bg-erro-claro animate-tremer";
          return (
            <button key={r.id} onClick={() => escolher(r.id)} className={`rounded-2xl border-2 py-5 text-lg font-semibold ${estado}`}>
              {r.nome}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AtraiOuRepele() {
  const [partida, setPartida] = useState(0);
  if (partida === 0) {
    return (
      <Abertura
        id="atrai-repele"
        regra={`Aparecem dois objetos: fios, ímãs, cargas. Diga se eles se atraem, se repelem ou se nada acontece. São ${DURACAO} segundos, e correntes não se comportam como cargas.`}
        aoComecar={() => setPartida(1)}
      />
    );
  }
  return <Partida key={partida} aoRepetir={() => setPartida((n) => n + 1)} />;
}

export default function PaginaAtraiOuRepele() {
  return (
    <Casca foco>
      <Jogo id="atrai-repele">
        <AtraiOuRepele />
      </Jogo>
    </Casca>
  );
}
