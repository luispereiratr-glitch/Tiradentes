export const CHAVE_DISCIPLINA = "estudos:disciplina";

/** Aplica a matéria ao documento: o CSS troca cores, fonte e fundo a partir de `data-disciplina`. */
export function aplicarTema(disciplina: string) {
  document.documentElement.dataset.disciplina = disciplina;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", coresDoTema().papel);
}

/** Roda antes da primeira pintura, para a página não piscar com as cores da matéria errada. */
export const scriptDoTema = (validas: string[]) =>
  `(function(){try{var d=localStorage.getItem(${JSON.stringify(CHAVE_DISCIPLINA)});if(${JSON.stringify(validas)}.indexOf(d)>=0)document.documentElement.dataset.disciplina=d}catch(e){}})()`;

const VARIAVEIS = {
  papel: "papel",
  papel2: "papel-2",
  linha: "linha",
  tinta: "tinta",
  tinta2: "tinta-2",
  musgo: "musgo",
  musgoEscuro: "musgo-escuro",
  barro: "barro",
  barroClaro: "barro-claro",
  ouro: "ouro",
} as const;

export type Cores = Record<keyof typeof VARIAVEIS, string>;

/** Cores da matéria ativa, em hexadecimal. O card e o PDF são desenhados fora do CSS e precisam dos valores. */
export function coresDoTema(): Cores {
  const raiz = getComputedStyle(document.documentElement);
  return Object.fromEntries(
    Object.entries(VARIAVEIS).map(([nome, variavel]) => [nome, raiz.getPropertyValue(`--color-${variavel}`).trim()]),
  ) as Cores;
}
