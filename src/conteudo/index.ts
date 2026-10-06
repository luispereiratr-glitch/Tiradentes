import type { Disciplina, Questao } from "@/lib/tipos";
import { fisica } from "./fisica";
import { historia } from "./historia";

/**
 * Para adicionar outra matéria, crie uma pasta ao lado de `historia` e registre aqui.
 * Ids de tema e de questão não podem se repetir entre matérias: o progresso é guardado por eles.
 */
export const disciplinas: Disciplina[] = [historia, fisica];

/** As que o aluno pode escolher. Uma matéria ainda sem temas só aparece em desenvolvimento. */
export const disciplinasAbertas = disciplinas.filter((d) => d.temas.length > 0 || process.env.NODE_ENV !== "production");

/** Procura em todas as matérias: o id de um tema é único. */
export const temaDe = (id: string) => disciplinas.flatMap((d) => d.temas).find((t) => t.id === id);

const todas = disciplinas.flatMap((d) => d.questoes);

const materias = new Map(disciplinas.flatMap((d) => d.questoes.map((q) => [q.id, d.id] as const)));

/** Id da matéria a que pertence uma questão. */
export const materiaDaQuestao = (questao: string) => materias.get(questao);

export const questoesDe = (tema: string, nivel?: string): Questao[] =>
  todas.filter((q) => q.tema === tema && (!nivel || q.nivel === nivel));
