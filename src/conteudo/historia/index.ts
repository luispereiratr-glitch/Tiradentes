import type { Disciplina } from "@/lib/tipos";
import { avancadasBrasil } from "./avancadas-brasil";
import { avancadasMundo } from "./avancadas-mundo";
import { cadeias, intrusos } from "./jogos";
import { novasBrasil1 } from "./novas-brasil-1";
import { novasBrasil2 } from "./novas-brasil-2";
import { novasMundo1 } from "./novas-mundo-1";
import { novasMundo2 } from "./novas-mundo-2";
import { oficiaisEnem } from "./oficiais-enem";
import { oficiaisFuvest } from "./oficiais-fuvest";
import { oficiaisVestibulares } from "./oficiais-vestibulares";
import { eventos, personagens, questoesFiguras } from "./personagens";
import { questoesBrasil } from "./questoes-brasil";
import { questoesMundo } from "./questoes-mundo";
import { resumos } from "./resumos";
import { temas } from "./temas";

export const historia: Disciplina = {
  id: "historia",
  nome: "História",
  icone: "livro",
  jogos: ["relampago", "quem-sou-eu", "cronologia", "memoria", "intruso", "cadeia"],
  textos: {
    fichas: {
      aba: "Figuras",
      icone: "pessoas",
      intro: "Os nomes que caem na prova. Cada ficha tem um gancho para você não confundir ninguém e curiosidades que viram pista no Quem sou eu?",
    },
    jogos: {
      relampago: { nome: "Relâmpago", descricao: "60 segundos. Quantas você acerta em sequência?" },
      "quem-sou-eu": { nome: "Quem sou eu?", descricao: "Descubra a figura histórica com o mínimo de pistas." },
      cronologia: { nome: "Linha do tempo", descricao: "Coloque os acontecimentos na ordem certa." },
      memoria: { nome: "Memória", descricao: "Ligue cada figura ao que ela fez." },
      intruso: { nome: "O intruso", descricao: "Três combinam, um não. Ache quem está no grupo errado." },
      cadeia: { nome: "Causa e consequência", descricao: "Difícil. Monte a cadeia de fatos, sem datas e com uma única chance." },
    },
    quemSouEu: { rodada: "Figura", proxima: "Próxima figura" },
    cronologia: { titulo: "Do mais antigo ao mais recente", instrucao: "Use as setas para ordenar. O mais antigo fica no topo." },
    memoria: { titulo: "Ligue a figura ao feito" },
    cadeia: { instrucao: "Monte a sequência: cada fato leva ao de baixo. Você só confere uma vez, e não há datas para ajudar." },
    resumo: { datas: "Linha do tempo", datasCurto: "DATAS-CHAVE", itens: "as datas" },
  },
  temas,
  questoes: [...questoesBrasil, ...questoesMundo, ...questoesFiguras, ...avancadasBrasil, ...avancadasMundo, ...novasBrasil1, ...novasBrasil2, ...novasMundo1, ...novasMundo2, ...oficiaisEnem, ...oficiaisFuvest, ...oficiaisVestibulares],
  personagens,
  eventos,
  intrusos,
  resumos,
  cadeias,
};
