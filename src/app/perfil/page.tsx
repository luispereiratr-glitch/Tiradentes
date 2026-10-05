"use client";

import Link from "next/link";
import { Botao, Casca, estiloBotaoLink, estiloLinkSuave } from "@/components/Casca";
import { Icone } from "@/components/Icone";
import { useApp } from "@/lib/app";
import { nivelDoXp, sequenciaAtiva } from "@/lib/jogo";
import type { Progresso } from "@/lib/tipos";

const acertadas = (p: Progresso) => Object.values(p.questoes).filter((r) => r.a > 0).length;
const estrelasTotais = (p: Progresso) => Object.values(p.licoes).reduce((s, n) => s + n, 0);

const CONQUISTAS: { nome: string; descricao: string; feita: (p: Progresso) => boolean }[] = [
  { nome: "Primeiro passo", descricao: "Acerte sua primeira questão", feita: (p) => acertadas(p) >= 1 },
  { nome: "Meio caminho", descricao: "Acerte 50 questões diferentes", feita: (p) => acertadas(p) >= 50 },
  { nome: "Centena", descricao: "Acerte 100 questões diferentes", feita: (p) => acertadas(p) >= 100 },
  { nome: "Sem medo do difícil", descricao: "Conclua uma fase difícil", feita: (p) => Object.keys(p.licoes).some((k) => k.endsWith(":dificil")) },
  { nome: "Desafiante", descricao: "Conclua uma fase Desafio", feita: (p) => Object.keys(p.licoes).some((k) => k.endsWith(":desafio")) },
  { nome: "Nota máxima", descricao: "Tire 3 estrelas em uma fase", feita: (p) => Object.values(p.licoes).includes(3) },
  { nome: "Constelação", descricao: "Junte 30 estrelas", feita: (p) => estrelasTotais(p) >= 30 },
  { nome: "Raio", descricao: "Faça 150 pontos no Relâmpago", feita: (p) => (p.recordes.relampago ?? 0) >= 150 },
  { nome: "Detetive", descricao: "Faça 160 pontos no Quem sou eu?", feita: (p) => (p.recordes["quem-sou-eu"] ?? 0) >= 160 },
  { nome: "Faro fino", descricao: "Faça 100 pontos em O intruso", feita: (p) => (p.recordes.intruso ?? 0) >= 100 },
  { nome: "Elo por elo", descricao: "Faça 170 pontos em Causa e consequência", feita: (p) => (p.recordes.cadeia ?? 0) >= 170 },
];

function Perfil() {
  const { usuario, progresso, sair, modoLocal } = useApp();
  const { nivel } = nivelDoXp(progresso.xp);
  const registros = Object.values(progresso.questoes);
  const tentativas = registros.reduce((s, r) => s + r.a + r.e, 0);
  const acertos = registros.reduce((s, r) => s + r.a, 0);

  const numeros = [
    { rotulo: "XP total", valor: progresso.xp },
    { rotulo: "Dias seguidos", valor: sequenciaAtiva(progresso) },
    { rotulo: "Questões feitas", valor: registros.length },
    { rotulo: "Taxa de acerto", valor: tentativas ? `${Math.round((acertos / tentativas) * 100)}%` : "—" },
  ];

  return (
    <>
      <h1 className="text-[28px] font-semibold">{usuario!.nome}</h1>
      <p className="mb-5 text-tinta-2">
        Nível {nivel} · melhor sequência: {progresso.dias.melhor} {progresso.dias.melhor === 1 ? "dia" : "dias"}
      </p>

      <dl className="mb-7 grid grid-cols-2 gap-3">
        {numeros.map((n) => (
          <div key={n.rotulo} className="rounded-2xl border border-linha bg-cartao p-4">
            <dd className="font-titulo text-2xl font-semibold text-musgo">{n.valor}</dd>
            <dt className="text-sm text-tinta-2">{n.rotulo}</dt>
          </div>
        ))}
      </dl>

      <h2 className="mb-3 text-lg font-semibold">Conquistas</h2>
      <ul className="mb-7 space-y-2">
        {CONQUISTAS.map((c) => {
          const feita = c.feita(progresso);
          return (
            <li key={c.nome} className={`flex items-center gap-3 rounded-2xl border border-linha p-3 ${feita ? "bg-cartao" : "opacity-60"}`}>
              <span className={`flex size-10 shrink-0 items-center justify-center rounded-full ${feita ? "bg-ouro text-cartao" : "bg-papel-2 text-tinta-2"}`}>
                <Icone nome={feita ? "trofeu" : "cadeado"} />
              </span>
              <span>
                <span className="block font-semibold">{c.nome}</span>
                <span className="block text-sm text-tinta-2">{c.descricao}</span>
              </span>
            </li>
          );
        })}
      </ul>

      <div className="space-y-3">
        <Link href="/resumo" className={estiloBotaoLink}>
          Resumo em PDF do meu ponto fraco
        </Link>
        <Link href="/carta" className={estiloLinkSuave}>
          Meu card para compartilhar
        </Link>
        <Botao variante="suave" onClick={sair}>
          Sair da conta
        </Botao>
      </div>
      {modoLocal && (
        <p className="mt-4 text-sm leading-relaxed text-tinta-2">
          Modo local: o progresso está salvo só neste aparelho e neste navegador.
        </p>
      )}
    </>
  );
}

export default function PaginaPerfil() {
  return (
    <Casca>
      <Perfil />
    </Casca>
  );
}
