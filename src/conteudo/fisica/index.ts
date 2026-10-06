import type { Disciplina } from "@/lib/tipos";
import { fichas } from "./fichas";
import { cadeias, eventos, intrusos } from "./jogos";
import { oficiais } from "./oficiais";
import { questoesCampoCorrente } from "./questoes-campo-corrente";
import { questoesContas } from "./questoes-contas";
import { questoesForcaCarga } from "./questoes-forca-carga";
import { questoesForcaFio } from "./questoes-forca-fio";
import { questoesImas } from "./questoes-imas";
import { resumos } from "./resumos";
import { temas } from "./temas";

export const fisica: Disciplina = {
  id: "fisica",
  nome: "Física",
  icone: "atomo",
  jogos: ["conta-rapida", "regra-do-tapa", "mira", "campo-dos-fios", "mais-forte", "atrai-repele"],
  textos: {
    fichas: {
      aba: "Conceitos",
      icone: "atomo",
      intro: "As grandezas, leis e regras que caem na prova. Cada ficha tem um gancho para você não confundir e algumas curiosidades.",
    },
    jogos: {
      "conta-rapida": { nome: "Conta rápida", descricao: "75 segundos de cálculo: campo, força e raio, com a fórmula na ponta da língua." },
      "regra-do-tapa": { nome: "Tapa 3D", descricao: "Gire a cena em 3D e aponte para onde vai a força magnética." },
      mira: { nome: "Mira magnética", descricao: "Regule o campo e curve a partícula até acertar o detector." },
      "campo-dos-fios": { nome: "Campo dos fios", descricao: "Um ou dois fios furando a página: para onde aponta o campo em P?" },
      "mais-forte": { nome: "Mais forte ou mais fraco?", descricao: "Do cérebro ao magnetar: adivinhe qual campo é mais intenso." },
      "atrai-repele": { nome: "Atrai ou repele?", descricao: "45 segundos. Fios, ímãs e cargas: decida no reflexo." },
      // Estes ficam fora do painel de Física, mas os textos e o conteúdo continuam prontos.
      "quem-sou-eu": { nome: "Quem sou eu?", descricao: "Descubra o conceito com o mínimo de pistas." },
      cronologia: { nome: "Escala", descricao: "Coloque os campos magnéticos em ordem, do mais fraco ao mais forte.", icone: "escala" },
      memoria: { nome: "Memória", descricao: "Ligue cada conceito ao que ele diz." },
      intruso: { nome: "O intruso", descricao: "Três combinam, um não. Ache quem está no grupo errado." },
      cadeia: { nome: "Passo a passo", descricao: "Difícil. Monte o raciocínio na ordem certa, com uma única chance." },
    },
    quemSouEu: { rodada: "Conceito", proxima: "Próximo conceito" },
    cronologia: { titulo: "Do mais fraco ao mais forte", instrucao: "Use as setas para ordenar. O campo mais fraco fica no topo." },
    memoria: { titulo: "Ligue o conceito ao que ele diz" },
    cadeia: { instrucao: "Monte a sequência: cada passo leva ao de baixo. Você só confere uma vez." },
    resumo: { datas: "Fórmulas", datasCurto: "FÓRMULAS-CHAVE", itens: "as fórmulas" },
  },
  temas,
  questoes: [...questoesImas, ...questoesCampoCorrente, ...questoesForcaCarga, ...questoesForcaFio, ...questoesContas, ...oficiais],
  personagens: fichas,
  eventos,
  intrusos,
  resumos,
  cadeias,
};
