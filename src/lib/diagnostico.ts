import { NIVEIS } from "./jogo";
import type { Disciplina, Progresso, Questao, Tema } from "./tipos";

export type Desempenho = {
  tema: Tema;
  /** Total de respostas dadas (certas e erradas), contando repetições. */
  respostas: number;
  acertos: number;
  /** Percentual de acerto; `null` se ainda não respondeu nada do tema. */
  taxa: number | null;
  feitas: number;
  total: number;
  /** Questões do tema que a pessoa já errou, das mais erradas para as menos. */
  erradas: { questao: Questao; vezes: number }[];
  /** Taxa de acerto em cada nível de dificuldade já respondido. */
  niveis: { nome: string; taxa: number; respostas: number }[];
};

/** Abaixo disso a taxa de acerto de um tema diz pouco e ele fica fora do diagnóstico. */
export const MINIMO_DE_RESPOSTAS = 5;

export function desempenhoPorTema(p: Progresso, d: Disciplina): Desempenho[] {
  return d.temas.map((tema) => {
    const doTema = d.questoes.filter((q) => q.tema === tema.id);
    const vistas = doTema.filter((q) => p.questoes[q.id]);
    const acertos = vistas.reduce((s, q) => s + p.questoes[q.id].a, 0);
    const erros = vistas.reduce((s, q) => s + p.questoes[q.id].e, 0);
    const respostas = acertos + erros;
    return {
      tema,
      respostas,
      acertos,
      taxa: respostas ? Math.round((100 * acertos) / respostas) : null,
      feitas: vistas.length,
      total: doTema.length,
      erradas: vistas
        .filter((q) => p.questoes[q.id].e > 0)
        .sort((x, y) => p.questoes[y.id].e - p.questoes[x.id].e || p.questoes[x.id].caixa - p.questoes[y.id].caixa)
        .map((questao) => ({ questao, vezes: p.questoes[questao.id].e })),
      niveis: NIVEIS.flatMap((n) => {
        const doNivel = vistas.filter((q) => q.nivel === n.id);
        const certas = doNivel.reduce((s, q) => s + p.questoes[q.id].a, 0);
        const total = certas + doNivel.reduce((s, q) => s + p.questoes[q.id].e, 0);
        return total ? [{ nome: n.nome, taxa: Math.round((100 * certas) / total), respostas: total }] : [];
      }),
    };
  });
}

/**
 * Nota usada para comparar temas. A taxa é puxada para 50% quando há poucas respostas,
 * para que 1 erro em 5 não pese mais do que 8 erros em 40.
 */
const nota = (d: Desempenho) => (d.acertos + 2) / (d.respostas + 4);

const avaliados = (lista: Desempenho[]) => lista.filter((d) => d.respostas >= MINIMO_DE_RESPOSTAS);

/** Temas com dados suficientes, do mais difícil para o mais fácil para a pessoa. */
export function doMaisFracoAoMaisForte(lista: Desempenho[]): Desempenho[] {
  return avaliados(lista).sort((a, b) => nota(a) - nota(b) || b.respostas - a.respostas);
}

export const pontoFraco = (lista: Desempenho[]): Desempenho | null => doMaisFracoAoMaisForte(lista)[0] ?? null;

/** Abaixo desta taxa de acerto o tema conta como ponto fraco. */
export const LIMITE_DE_PONTO_FRACO = 70;
const MINIMO_DE_PONTOS_FRACOS = 3;

/**
 * Todos os pontos fracos, do pior para o melhor: os temas abaixo do limite ou, se forem poucos,
 * os três em que a pessoa vai pior (mesmo indo bem em todos, sempre há o que revisar).
 */
export function pontosFracos(lista: Desempenho[]): Desempenho[] {
  const ordem = doMaisFracoAoMaisForte(lista);
  const abaixo = ordem.filter((d) => d.taxa! < LIMITE_DE_PONTO_FRACO);
  return abaixo.length >= MINIMO_DE_PONTOS_FRACOS ? abaixo : ordem.slice(0, MINIMO_DE_PONTOS_FRACOS);
}
