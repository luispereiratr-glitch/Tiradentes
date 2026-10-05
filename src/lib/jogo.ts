import type { Nivel, Placar, Progresso, Questao } from "./tipos";

export const NIVEIS: { id: Nivel; nome: string; xp: number }[] = [
  { id: "facil", nome: "Fácil", xp: 10 },
  { id: "medio", nome: "Médio", xp: 15 },
  { id: "dificil", nome: "Difícil", xp: 25 },
  { id: "desafio", nome: "Desafio", xp: 35 },
];

export const VAZIO: Progresso = {
  xp: 0,
  dias: { ultimo: null, sequencia: 0, melhor: 0 },
  questoes: {},
  licoes: {},
  recordes: {},
  semana: { inicio: "", xp: 0 },
};

/** Dias até a próxima revisão, por caixa (repetição espaçada). */
const INTERVALOS = [0, 1, 3, 7, 14];

/** Data `AAAA-MM-DD` no fuso do aparelho. Com `base`, conta os dias a partir dela e não de hoje. */
export function dia(deslocamento = 0, base?: string): string {
  const d = base ? new Date(`${base}T12:00:00`) : new Date();
  d.setDate(d.getDate() + deslocamento);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function embaralhar<T>(lista: readonly T[]): T[] {
  const r = [...lista];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

export const xpDaQuestao = (q: Questao) => NIVEIS.find((n) => n.id === q.nivel)!.xp;

export function nivelDoXp(xp: number) {
  const nivel = Math.floor(Math.sqrt(xp / 60)) + 1;
  const base = 60 * (nivel - 1) ** 2;
  const proximo = 60 * nivel ** 2;
  return { nivel, fracao: (xp - base) / (proximo - base), falta: proximo - xp };
}

function marcarDia(p: Progresso): Progresso["dias"] {
  const hoje = dia();
  if (p.dias.ultimo === hoje) return p.dias;
  const sequencia = p.dias.ultimo === dia(-1) ? p.dias.sequencia + 1 : 1;
  return { ultimo: hoje, sequencia, melhor: Math.max(p.dias.melhor, sequencia) };
}

/** Domingo da semana de `hoje`: o ranking semanal zera a cada domingo. */
export function inicioDaSemana(hoje = dia()): string {
  return dia(-new Date(`${hoje}T12:00:00`).getDay(), hoje);
}

export function somarXp(p: Progresso, xp: number): Progresso {
  const inicio = inicioDaSemana();
  const naSemana = p.semana.inicio === inicio ? p.semana.xp : 0;
  return { ...p, xp: p.xp + xp, dias: marcarDia(p), semana: { inicio, xp: naSemana + xp } };
}

export function registrarResposta(p: Progresso, q: Questao, acertou: boolean): Progresso {
  const antes = p.questoes[q.id] ?? { a: 0, e: 0, caixa: 0, prox: dia() };
  const caixa = acertou ? Math.min(antes.caixa + 1, INTERVALOS.length - 1) : 0;
  const registro = {
    a: antes.a + (acertou ? 1 : 0),
    e: antes.e + (acertou ? 0 : 1),
    caixa,
    prox: dia(INTERVALOS[caixa]),
  };
  return {
    ...somarXp(p, acertou ? xpDaQuestao(q) : 0),
    questoes: { ...p.questoes, [q.id]: registro },
  };
}

/** Sequência só vale se a pessoa estudou hoje ou ontem. */
export function sequenciaAtiva(p: Progresso, hoje = dia()): number {
  return p.dias.ultimo === hoje || p.dias.ultimo === dia(-1, hoje) ? p.dias.sequencia : 0;
}

/** Resume o progresso de alguém na linha que aparece no ranking. */
export function placarDe(id: string, usuario: string, dados: Partial<Progresso>, hoje = dia()): Placar {
  const p = { ...VAZIO, ...dados };
  const registros = Object.values(p.questoes);
  const acertos = registros.reduce((s, r) => s + r.a, 0);
  const tentativas = registros.reduce((s, r) => s + r.a + r.e, 0);
  return {
    id,
    usuario,
    xp: p.xp,
    xpSemana: p.semana.inicio === inicioDaSemana(hoje) ? p.semana.xp : 0,
    sequencia: sequenciaAtiva(p, hoje),
    acertadas: registros.filter((r) => r.a > 0).length,
    precisao: tentativas ? Math.round((100 * acertos) / tentativas) : null,
    recordes: p.recordes,
  };
}

/** Questões já vistas que estão na hora de revisar, as mais erradas primeiro. */
export function paraRevisar(p: Progresso, todas: Questao[]): Questao[] {
  const hoje = dia();
  return todas
    .filter((q) => {
      const r = p.questoes[q.id];
      return r && r.e > 0 && r.caixa < INTERVALOS.length - 1 && r.prox <= hoje;
    })
    .sort((x, y) => p.questoes[x.id].caixa - p.questoes[y.id].caixa);
}

export function estrelas(acertos: number, total: number): number {
  const taxa = total ? acertos / total : 0;
  return taxa >= 0.9 ? 3 : taxa >= 0.75 ? 2 : taxa >= 0.6 ? 1 : 0;
}

export function vibrar(acertou: boolean) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(acertou ? 30 : [60, 40, 60]);
  }
}
