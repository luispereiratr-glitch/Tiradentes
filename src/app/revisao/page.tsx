"use client";

import Link from "next/link";
import { useState } from "react";
import { Botao, Casca, estiloBotaoLink } from "@/components/Casca";
import { Icone } from "@/components/Icone";
import { type Fim, LinkInicio, Resultado, Sessao } from "@/components/Sessao";
import { disciplina } from "@/conteudo";
import { useApp } from "@/lib/app";
import { paraRevisar } from "@/lib/jogo";
import type { Questao } from "@/lib/tipos";

const MAXIMO = 10;

function Revisao({ aoFocar }: { aoFocar: (foco: boolean) => void }) {
  const { progresso } = useApp();
  const pendentes = paraRevisar(progresso, disciplina.questoes);
  const [sessao, setSessao] = useState<Questao[] | null>(null);
  const [fim, setFim] = useState<Fim | null>(null);

  if (fim) {
    return (
      <Resultado
        titulo="Revisão feita"
        destaque={`${fim.acertos}/${fim.total}`}
        detalhe="O que você acertou volta daqui a alguns dias; o que errou volta amanhã."
        erradas={fim.erradas}
        acoes={<LinkInicio />}
      />
    );
  }

  if (sessao) return <Sessao questoes={sessao} sair="/" aoFim={setFim} />;

  function comecar() {
    aoFocar(true);
    setSessao(pendentes.slice(0, MAXIMO));
  }

  return (
    <div className="flex flex-1 flex-col">
      <h1 className="mb-1 text-[28px] font-semibold">Revisão</h1>
      <p className="mb-6 leading-relaxed text-tinta-2">
        As questões que você errou voltam aqui em intervalos cada vez maiores, até fixarem de vez.
      </p>

      <div className="rounded-2xl border border-linha bg-cartao p-6 text-center">
        <span className="mx-auto mb-3 flex size-16 items-center justify-center rounded-full bg-musgo-claro text-musgo-escuro">
          <Icone nome={pendentes.length ? "ciclo" : "certo"} className="size-8" />
        </span>
        {pendentes.length ? (
          <>
            <p className="font-titulo text-4xl font-semibold text-musgo">{pendentes.length}</p>
            <p className="mb-5 text-tinta-2">{pendentes.length === 1 ? "questão esperando" : "questões esperando"} por você</p>
            <Botao onClick={comecar}>
              Revisar {Math.min(pendentes.length, MAXIMO)} agora
            </Botao>
          </>
        ) : (
          <>
            <p className="font-titulo text-xl font-semibold">Nada para revisar hoje</p>
            <p className="mt-1 mb-5 text-tinta-2">Os erros das lições e dos jogos aparecem aqui no dia certo.</p>
            <Link href="/" className={estiloBotaoLink}>
              Ir para a trilha
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaginaRevisao() {
  const [foco, setFoco] = useState(false);
  return (
    <Casca foco={foco}>
      <Revisao aoFocar={setFoco} />
    </Casca>
  );
}
