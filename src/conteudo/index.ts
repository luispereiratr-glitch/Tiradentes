import type { Disciplina, Questao } from "@/lib/tipos";
import { oficiaisEnem } from "./historia/oficiais-enem";
import { oficiaisFuvest } from "./historia/oficiais-fuvest";
import { oficiaisVestibulares } from "./historia/oficiais-vestibulares";
import { avancadasBrasil } from "./historia/avancadas-brasil";
import { avancadasMundo } from "./historia/avancadas-mundo";
import { eventos, personagens, questoesFiguras } from "./historia/personagens";
import { questoesBrasil } from "./historia/questoes-brasil";
import { questoesMundo } from "./historia/questoes-mundo";
import { temas } from "./historia/temas";

/** Para adicionar outra matéria, crie uma pasta ao lado de `historia` e registre aqui. */
export const disciplinas: Disciplina[] = [
  {
    id: "historia",
    nome: "História",
    temas,
    questoes: [...questoesBrasil, ...questoesMundo, ...questoesFiguras, ...avancadasBrasil, ...avancadasMundo, ...oficiaisEnem, ...oficiaisFuvest, ...oficiaisVestibulares],
    personagens,
    eventos,
  },
];

export const disciplina = disciplinas[0];

export const questoesDe = (tema: string, nivel?: string): Questao[] =>
  disciplina.questoes.filter((q) => q.tema === tema && (!nivel || q.nivel === nivel));
