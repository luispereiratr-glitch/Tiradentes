"use client";

import { useState } from "react";
import { Botao, Casca, Topo } from "@/components/Casca";
import { disciplina } from "@/conteudo";
import { useApp } from "@/lib/app";
import { type Desempenho, desempenhoPorTema, MINIMO_DE_RESPOSTAS, pontoFraco, pontosFracos } from "@/lib/diagnostico";
import { baixarResumo } from "@/lib/pdf";

function Resumo() {
  const { usuario, progresso } = useApp();
  const todos = desempenhoPorTema(progresso, disciplina);
  const fraco = pontoFraco(todos);
  const fracos = pontosFracos(todos);
  const [escolhido, setEscolhido] = useState<string | null>(null);
  const [gerando, setGerando] = useState(false);
  const [erro, setErro] = useState(false);

  const alvo = todos.find((d) => d.tema.id === (escolhido ?? fraco?.tema.id)) ?? null;
  // Os mais difíceis para a pessoa primeiro; os que ela ainda não fez ficam no fim.
  const ordenados = [...todos].sort((a, b) => (a.taxa ?? 101) - (b.taxa ?? 101));

  async function gerar(alvos: Desempenho[]) {
    setGerando(true);
    setErro(false);
    try {
      await baixarResumo({
        nome: usuario!.nome,
        todos,
        capitulos: alvos.map((d) => ({
          alvo: d,
          resumo: disciplina.resumos[d.tema.id],
          sugerido: alvos.length > 1 || d.tema.id === fraco?.tema.id,
        })),
      });
    } catch {
      setErro(true);
    }
    setGerando(false);
  }

  return (
    <>
      <Topo titulo="Resumo sob medida" voltar="/perfil" />

      <div className="mb-6 rounded-2xl bg-barro-claro p-4">
        {fraco ? (
          <>
            <p className="text-xs font-semibold tracking-wide text-barro uppercase">Seu ponto mais fraco</p>
            <p className="mt-1 font-titulo text-2xl leading-tight font-semibold">{fraco.tema.titulo}</p>
            <p className="mt-1 text-[15px] leading-relaxed">
              {fraco.taxa}% de acerto em {fraco.respostas} respostas. O PDF junta o essencial desse tema, as datas, os conceitos e as questões
              que você errou.
            </p>
            {fracos.length > 1 && (
              <div className="mt-4">
                <Botao onClick={() => gerar(fracos)} disabled={gerando}>
                  {gerando ? "Gerando…" : `Baixar síntese dos meus ${fracos.length} pontos fracos`}
                </Botao>
                <p className="mt-2 text-sm leading-relaxed text-tinta-2">Entram: {fracos.map((d) => d.tema.titulo).join(", ")}.</p>
              </div>
            )}
          </>
        ) : (
          <>
            <p className="font-titulo text-xl font-semibold">Ainda sem diagnóstico</p>
            <p className="mt-1 text-[15px] leading-relaxed">
              Responda pelo menos {MINIMO_DE_RESPOSTAS} questões de um tema para o Caderno descobrir onde você mais erra. Enquanto isso, escolha
              um tema abaixo.
            </p>
          </>
        )}
      </div>

      <h2 className="mb-1 text-lg font-semibold">Escolha o tema do PDF</h2>
      <p className="mb-3 text-sm text-tinta-2">Do que você mais erra para o que mais acerta.</p>
      <ul className="mb-6 space-y-2">
        {ordenados.map((d) => {
          const marcado = d.tema.id === alvo?.tema.id;
          return (
            <li key={d.tema.id}>
              <button
                onClick={() => setEscolhido(d.tema.id)}
                aria-pressed={marcado}
                className={`w-full rounded-2xl border-2 p-3.5 text-left transition ${marcado ? "border-musgo bg-musgo-claro" : "border-linha bg-cartao"}`}
              >
                <span className="flex items-baseline justify-between gap-3">
                  <span className="font-semibold">{d.tema.titulo}</span>
                  <span className="shrink-0 text-sm font-semibold text-tinta-2 tabular-nums">{d.taxa === null ? "sem respostas" : `${d.taxa}%`}</span>
                </span>
                <span className="mt-2 block h-2 overflow-hidden rounded-full bg-papel-2">
                  <span
                    className={`block h-full rounded-full ${d.tema.id === fraco?.tema.id ? "bg-barro" : "bg-musgo"}`}
                    style={{ width: `${d.taxa ?? 0}%` }}
                  />
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="sticky bottom-24 space-y-2">
        <Botao onClick={() => alvo && gerar([alvo])} disabled={!alvo || gerando}>
          {gerando ? "Gerando…" : alvo ? `Baixar resumo completo: ${alvo.tema.titulo}` : "Escolha um tema"}
        </Botao>
        {erro && (
          <p role="alert" className="rounded-2xl bg-erro-claro p-3 text-sm text-erro">
            Não foi possível gerar o PDF. Tente de novo.
          </p>
        )}
      </div>
    </>
  );
}

export default function PaginaResumo() {
  return (
    <Casca>
      <Resumo />
    </Casca>
  );
}
