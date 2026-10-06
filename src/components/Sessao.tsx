"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { temaDe } from "@/conteudo";
import { useApp } from "@/lib/app";
import { useDisciplina } from "@/lib/disciplina";
import { embaralhar, NIVEIS, vibrar } from "@/lib/jogo";
import type { Questao } from "@/lib/tipos";
import { Botao, estiloLinkSuave } from "./Casca";
import { Formulas } from "./Formulas";
import { Icone } from "./Icone";

export type Fim = { acertos: number; total: number; erradas: Questao[] };

/** Desenho da questão, sobre fundo branco: as figuras das provas são traço preto em papel. */
export function Figura({ q, className = "" }: { q: Questao; className?: string }) {
  if (!q.figura) return null;
  const { src, alt, largura, altura } = q.figura;
  return (
    <div className={`rounded-2xl border border-linha bg-white p-3 ${className}`}>
      <Image src={src} alt={alt} width={largura} height={altura} unoptimized className="mx-auto h-auto max-h-72 w-auto max-w-full" />
    </div>
  );
}

export function Explicacao({ q, compacta = false }: { q: Questao; compacta?: boolean }) {
  return (
    <div className="space-y-2 text-[15px] leading-relaxed">
      {compacta && (
        <p className="font-semibold whitespace-pre-line">
          <Formulas>{q.enunciado}</Formulas>
        </p>
      )}
      {compacta && <Figura q={q} />}
      <p>
        <span className="font-semibold text-musgo-escuro">Resposta certa: </span>
        <Formulas>{q.alternativas[0]}</Formulas>
      </p>
      <p>
        <Formulas>{q.explicacao}</Formulas>
      </p>
      {q.lembre && (
        <p className="rounded-xl bg-papel-2 px-3 py-2">
          <span className="font-semibold">Para lembrar: </span>
          <Formulas>{q.lembre}</Formulas>
        </p>
      )}
    </div>
  );
}

/** Roda uma lista de questões, uma por vez, com explicação depois de cada resposta. */
export function Sessao({ questoes, sair, aoFim }: { questoes: Questao[]; sair: string; aoFim: (fim: Fim) => void }) {
  const { responder } = useApp();
  const ativa = useDisciplina();
  const [indice, setIndice] = useState(0);
  const [escolha, setEscolha] = useState<number | null>(null);
  const [acertos, setAcertos] = useState(0);
  const [erradas, setErradas] = useState<Questao[]>([]);

  const q = questoes[indice];
  const opcoes = useMemo(
    () => embaralhar(q.alternativas.map((texto, i) => ({ texto, certa: i === 0 }))),
    [q],
  );
  const respondida = escolha !== null;
  const acertou = respondida && opcoes[escolha].certa;

  function escolher(i: number) {
    if (respondida) return;
    const certa = opcoes[i].certa;
    setEscolha(i);
    responder(q, certa, temaDe(q.tema)?.disciplina ?? ativa.id);
    vibrar(certa);
    if (certa) setAcertos((n) => n + 1);
    else setErradas((lista) => [...lista, q]);
  }

  function continuar() {
    if (indice + 1 < questoes.length) {
      setIndice(indice + 1);
      setEscolha(null);
    } else {
      aoFim({ acertos, total: questoes.length, erradas });
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-5 flex items-center gap-3">
        <Link href={sair} aria-label="Sair" className="text-tinta-2">
          <Icone nome="errado" />
        </Link>
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-papel-2">
          <div
            className="h-full rounded-full bg-musgo transition-all duration-300"
            style={{ width: `${((indice + (respondida ? 1 : 0)) / questoes.length) * 100}%` }}
          />
        </div>
        <span className="text-sm font-semibold text-tinta-2 tabular-nums">
          {indice + 1}/{questoes.length}
        </span>
      </div>

      <div key={q.id} className="animate-subir flex flex-1 flex-col">
        <p className="mb-2 text-xs font-semibold tracking-wide text-tinta-2 uppercase">
          {q.oficial ?? `Estilo ${q.estilo}`} · {NIVEIS.find((n) => n.id === q.nivel)!.nome}
        </p>
        <h2 className="mb-5 text-[19px] leading-snug font-medium whitespace-pre-line">
          <Formulas>{q.enunciado}</Formulas>
        </h2>
        <Figura q={q} className="mb-5" />

        <div className="space-y-2.5">
          {opcoes.map((op, i) => {
            let estado = "border-linha bg-cartao";
            if (respondida && op.certa) estado = "border-musgo bg-musgo-claro animate-pulo";
            else if (respondida && i === escolha) estado = "border-erro bg-erro-claro animate-tremer";
            else if (respondida) estado = "border-linha bg-cartao opacity-55";
            return (
              <button
                key={op.texto}
                onClick={() => escolher(i)}
                disabled={respondida}
                className={`flex w-full items-start gap-3 rounded-2xl border-2 px-4 py-3.5 text-left text-[15px] leading-snug transition ${estado}`}
              >
                <span className="mt-px font-semibold text-tinta-2">{"ABCDE"[i]}</span>
                <span className="flex-1">
                  <Formulas>{op.texto}</Formulas>
                </span>
              </button>
            );
          })}
        </div>

        {respondida && (
          <div
            className={`animate-subir mt-5 rounded-2xl border-2 p-4 ${acertou ? "border-musgo/30 bg-musgo-claro/50" : "border-erro/30 bg-erro-claro/50"}`}
            aria-live="polite"
          >
            <p className={`mb-2 flex items-center gap-2 font-titulo text-lg font-semibold ${acertou ? "text-musgo-escuro" : "text-erro"}`}>
              <Icone nome={acertou ? "certo" : "errado"} />
              {acertou ? "Isso mesmo" : "Não foi dessa vez"}
            </p>
            <Explicacao q={q} />
          </div>
        )}
      </div>

      {respondida && (
        <div className="sticky bottom-0 -mx-5 mt-5 bg-gradient-to-t from-papel from-70% px-5 pt-4 pb-5">
          <Botao onClick={continuar} autoFocus>
            {indice + 1 < questoes.length ? "Continuar" : "Ver resultado"}
          </Botao>
        </div>
      )}
    </div>
  );
}

export function Resultado({
  titulo,
  destaque,
  detalhe,
  estrelas,
  erradas = [],
  acoes,
}: {
  titulo: string;
  destaque: string;
  detalhe?: string;
  estrelas?: number;
  erradas?: Questao[];
  acoes: React.ReactNode;
}) {
  return (
    <div className="animate-subir flex flex-1 flex-col">
      <div className="py-8 text-center">
        {estrelas !== undefined && (
          <div className="mb-4 flex justify-center gap-1.5">
            {[1, 2, 3].map((n) => (
              <span key={n} className={n <= estrelas ? "text-ouro" : "text-linha"}>
                <Icone nome="estrela" className="size-10" cheio />
              </span>
            ))}
          </div>
        )}
        <h1 className="text-2xl font-semibold">{titulo}</h1>
        <p className="mt-2 font-titulo text-5xl font-semibold text-musgo">{destaque}</p>
        {detalhe && <p className="mt-2 text-tinta-2">{detalhe}</p>}
      </div>

      {erradas.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 text-lg font-semibold">Vale reler</h2>
          <div className="space-y-3">
            {erradas.map((q) => (
              <div key={q.id} className="rounded-2xl border border-linha bg-cartao p-4">
                <Explicacao q={q} compacta />
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-auto space-y-3 pb-2">{acoes}</div>
    </div>
  );
}

export function LinkInicio() {
  return (
    <Link href="/" className={estiloLinkSuave}>
      Voltar à trilha
    </Link>
  );
}
