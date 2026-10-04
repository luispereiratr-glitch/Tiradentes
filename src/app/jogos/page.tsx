"use client";

import Link from "next/link";
import { Casca } from "@/components/Casca";
import { Icone, type NomeIcone } from "@/components/Icone";
import { useApp } from "@/lib/app";

const JOGOS: { id: string; nome: string; descricao: string; icone: NomeIcone; cor: string }[] = [
  {
    id: "relampago",
    nome: "Relâmpago",
    descricao: "60 segundos. Quantas você acerta em sequência?",
    icone: "raio",
    cor: "bg-barro-claro text-barro",
  },
  {
    id: "quem-sou-eu",
    nome: "Quem sou eu?",
    descricao: "Descubra a figura histórica com o mínimo de pistas.",
    icone: "pessoas",
    cor: "bg-musgo-claro text-musgo-escuro",
  },
  {
    id: "cronologia",
    nome: "Linha do tempo",
    descricao: "Coloque os acontecimentos na ordem certa.",
    icone: "relogio",
    cor: "bg-papel-2 text-tinta",
  },
  {
    id: "memoria",
    nome: "Memória",
    descricao: "Ligue cada figura ao que ela fez.",
    icone: "livro",
    cor: "bg-[#f3e6c4] text-[#7a5a12]",
  },
];

function Lista() {
  const { progresso } = useApp();
  return (
    <>
      <h1 className="mb-1 text-[28px] font-semibold">Jogos</h1>
      <p className="mb-5 text-tinta-2">Partidas curtas. Todas rendem XP e contam para a sequência.</p>
      <ul className="space-y-3">
        {JOGOS.map((jogo) => (
          <li key={jogo.id}>
            <Link
              href={`/jogos/${jogo.id}`}
              className="flex items-center gap-4 rounded-2xl border border-linha bg-cartao p-4 transition active:scale-[0.99]"
            >
              <span className={`flex size-14 shrink-0 items-center justify-center rounded-2xl ${jogo.cor}`}>
                <Icone nome={jogo.icone} className="size-7" />
              </span>
              <span className="flex-1">
                <span className="block font-titulo text-lg font-semibold">{jogo.nome}</span>
                <span className="block text-sm leading-snug text-tinta-2">{jogo.descricao}</span>
                {progresso.recordes[jogo.id] !== undefined && (
                  <span className="mt-1 flex items-center gap-1 text-xs font-semibold text-ouro">
                    <Icone nome="trofeu" className="size-4" /> Recorde: {progresso.recordes[jogo.id]}
                  </span>
                )}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function Jogos() {
  return (
    <Casca>
      <Lista />
    </Casca>
  );
}
