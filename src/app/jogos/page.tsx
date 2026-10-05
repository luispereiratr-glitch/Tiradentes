"use client";

import Link from "next/link";
import { Casca } from "@/components/Casca";
import { Icone } from "@/components/Icone";
import { useApp } from "@/lib/app";
import { JOGOS } from "@/lib/jogos";

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
