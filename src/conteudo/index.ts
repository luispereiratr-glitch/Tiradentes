import type { Disciplina, Questao } from "@/lib/tipos";
import { oficiaisEnem } from "./historia/oficiais-enem";
import { oficiaisFuvest } from "./historia/oficiais-fuvest";
import { oficiaisVestibulares } from "./historia/oficiais-vestibulares";
import { avancadasBrasil } from "./historia/avancadas-brasil";
import { avancadasMundo } from "./historia/avancadas-mundo";
import { cadeias, intrusos } from "./historia/jogos";
import { novasBrasil1 } from "./historia/novas-brasil-1";
import { novasBrasil2 } from "./historia/novas-brasil-2";
import { novasMundo1 } from "./historia/novas-mundo-1";
import { novasMundo2 } from "./historia/novas-mundo-2";
import { eventos, personagens, questoesFiguras } from "./historia/personagens";
import { questoesBrasil } from "./historia/questoes-brasil";
import { questoesMundo } from "./historia/questoes-mundo";
import { resumos } from "./historia/resumos";
import { temas } from "./historia/temas";

/** Para adicionar outra matéria, crie uma pasta ao lado de `historia` e registre aqui. */
export const disciplinas: Disciplina[] = [
  {
    id: "historia",
    nome: "História",
    temas,
    questoes: [...questoesBrasil, ...questoesMundo, ...questoesFiguras, ...avancadasBrasil, ...avancadasMundo, ...novasBrasil1, ...novasBrasil2, ...novasMundo1, ...novasMundo2, ...oficiaisEnem, ...oficiaisFuvest, ...oficiaisVestibulares],
    personagens,
    eventos,
    intrusos,
    resumos,
    cadeias,
  },
];

export const disciplina = disciplinas[0];

export const questoesDe = (tema: string, nivel?: string): Questao[] =>
  disciplina.questoes.filter((q) => q.tema === tema && (!nivel || q.nivel === nivel));
