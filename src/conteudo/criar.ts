import type { Cadeia, Intruso, Nivel, Questao } from "@/lib/tipos";

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

export const intruso = (tema: string, grupo: string, itens: string[], fora: string, explicacao: string): Intruso => ({
  tema,
  grupo,
  itens,
  intruso: fora,
  explicacao,
});

export const cadeia = (tema: string, titulo: string, passos: string[], explicacao: string): Cadeia => ({ tema, titulo, passos, explicacao });
