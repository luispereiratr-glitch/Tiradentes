"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { Botao, Casca, estiloLinkSuave } from "@/components/Casca";
import { type Fim, Resultado, Sessao } from "@/components/Sessao";
import { disciplina, questoesDe } from "@/conteudo";
import { useApp } from "@/lib/app";
import { embaralhar, estrelas, NIVEIS } from "@/lib/jogo";

const BONUS = 20;
const POR_SESSAO = 8;

function Licao() {
  const { tema: temaId, nivel } = useParams<{ tema: string; nivel: string }>();
  const { progresso, concluirLicao, ganharXp } = useApp();
  const tema = disciplina.temas.find((t) => t.id === temaId);
  const dadosNivel = NIVEIS.find((n) => n.id === nivel);

  const ineditas = () => questoesDe(temaId, nivel).filter((q) => !progresso.questoes[q.id]);
  /** Cada sessão traz questões ainda não feitas; quando acabam, repete as já feitas. */
  const montar = () => {
    const novas = ineditas();
    return embaralhar(novas.length ? novas : questoesDe(temaId, nivel)).slice(0, POR_SESSAO);
  };

  const [questoes, setQuestoes] = useState(montar);
  const [rodada, setRodada] = useState(0);
  const [fim, setFim] = useState<Fim | null>(null);

  if (!tema || !dadosNivel || questoes.length === 0) notFound();

  const voltar = `/tema/${tema.id}`;

  function terminar(resultado: Fim) {
    const nota = estrelas(resultado.acertos, resultado.total);
    if (nota > 0) {
      concluirLicao(`${tema!.id}:${nivel}`, nota);
      ganharXp(BONUS);
    }
    setFim(resultado);
  }

  function novaSessao() {
    setQuestoes(montar());
    setFim(null);
    setRodada((r) => r + 1);
  }

  if (fim) {
    const nota = estrelas(fim.acertos, fim.total);
    const temMais = ineditas().length > 0;
    return (
      <Resultado
        titulo={nota > 0 ? "Sessão concluída" : "Quase lá"}
        destaque={`${fim.acertos}/${fim.total}`}
        detalhe={
          nota > 0
            ? `+${fim.acertos * dadosNivel.xp + BONUS} XP nesta sessão`
            : "As explicações abaixo ajudam. O que você errou volta na Revisão."
        }
        estrelas={nota}
        erradas={fim.erradas}
        acoes={
          <>
            <Botao onClick={novaSessao}>{temMais ? "Quero questões novas" : "Refazer questões"}</Botao>
            {!temMais && (
              <p className="text-center text-sm text-tinta-2">Você já fez todas as questões deste nível.</p>
            )}
            <Link href={voltar} className={estiloLinkSuave}>
              Voltar ao tema
            </Link>
          </>
        }
      />
    );
  }

  return <Sessao key={rodada} questoes={questoes} sair={voltar} aoFim={terminar} />;
}

export default function PaginaLicao() {
  return (
    <Casca foco>
      <Licao />
    </Casca>
  );
}
