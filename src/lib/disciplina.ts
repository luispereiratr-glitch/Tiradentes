"use client";

import { useSyncExternalStore } from "react";
import { disciplinasAbertas } from "@/conteudo";
import { aplicarTema, CHAVE_DISCIPLINA } from "./tema";

const PADRAO = disciplinasAbertas[0].id;
const ouvintes = new Set<() => void>();

function assinar(avisar: () => void) {
  ouvintes.add(avisar);
  return () => void ouvintes.delete(avisar);
}

function trocar(id: string) {
  localStorage.setItem(CHAVE_DISCIPLINA, id);
  aplicarTema(id);
  ouvintes.forEach((avisar) => avisar());
}

/** A matéria escolhida fica guardada no aparelho; XP, nível e sequência são da pessoa e valem para todas. */
export function useDisciplinas() {
  const id = useSyncExternalStore(
    assinar,
    () => localStorage.getItem(CHAVE_DISCIPLINA) ?? PADRAO,
    () => PADRAO,
  );
  const ativa = disciplinasAbertas.find((d) => d.id === id) ?? disciplinasAbertas[0];
  return { ativa, todas: disciplinasAbertas, trocar };
}

/** A matéria que a pessoa está estudando agora. */
export const useDisciplina = () => useDisciplinas().ativa;
