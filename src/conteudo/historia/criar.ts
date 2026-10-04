import type { Nivel, Questao } from "@/lib/tipos";

/** Atalho para escrever questões de um tema. A primeira alternativa é a correta. */
export const criar =
  (tema: string) =>
  (
    id: string,
    nivel: Nivel,
    estilo: string,
    enunciado: string,
    alternativas: string[],
    explicacao: string,
    lembre?: string,
  ): Questao => ({ id, tema, nivel, estilo, enunciado, alternativas, explicacao, lembre });
