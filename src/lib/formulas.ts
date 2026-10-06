/**
 * Lê as fórmulas escritas em texto corrido no conteúdo (ex.: "B = µ₀·i/(2π·d)") e as devolve em pedaços,
 * para a tela desenhar como nos livros: fração empilhada, raiz com traço e produto sem o ponto.
 * Texto sem fórmula passa intacto.
 */
export type Pedaco = string | { tipo: "fracao"; cima: Pedaco[]; baixo: Pedaco[] } | { tipo: "raiz"; dentro: Pedaco[] };

const ABRE = "([";
const FECHA = ")]";
const FUNCOES = /(sen|cos|tg)$/;

/** Unidades compostas (T·m/A, N/(A·m)) ficam como estão: é assim que os livros as escrevem na linha. */
const UNIDADES = new Set(["T", "m", "A", "N", "s", "C", "kg", "J", "V", "W", "Wb", "Ω", "cm", "mm", "km", "h", "Hz", "Pa", "eV", "MeV", "K", "mol"]);

function soUnidades(trecho: string): boolean {
  const partes = trecho.split(/[·/()[\]\s.,;:]+/).filter(Boolean);
  return partes.length > 0 && partes.every((p) => UNIDADES.has(p.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+$/, "")));
}

/** Índice do fecho que casa com o abre em `inicio`, ou -1. */
function fechoDe(texto: string, inicio: number): number {
  let nivel = 0;
  for (let i = inicio; i < texto.length; i++) {
    if (ABRE.includes(texto[i])) nivel++;
    else if (FECHA.includes(texto[i]) && --nivel === 0) return i;
  }
  return -1;
}

/** Tira os parênteses quando eles envolvem o trecho inteiro: na fração empilhada eles não são mais necessários. */
function semParenteses(trecho: string): string {
  return ABRE.includes(trecho[0]) && fechoDe(trecho, 0) === trecho.length - 1 ? trecho.slice(1, -1) : trecho;
}

/** Onde começa o numerador da barra em `barra`: volta até um espaço, um sinal de igual ou um parêntese sem par. */
function inicioDoNumerador(texto: string, barra: number): number {
  let nivel = 0;
  let i = barra - 1;
  for (; i >= 0; i--) {
    const c = texto[i];
    if (FECHA.includes(c)) nivel++;
    else if (ABRE.includes(c)) {
      if (nivel === 0) break;
      nivel--;
    } else if (nivel === 0) {
      if ("=;".includes(c)) break;
      // "m·g·tg θ/(B·L)": o espaço depois de sen, cos e tg faz parte do numerador.
      if (/\s/.test(c) && !FUNCOES.test(texto.slice(0, i))) break;
    }
  }
  return i + 1;
}

/** Onde termina o denominador que começa em `inicio`. */
function fimDoDenominador(texto: string, inicio: number): number {
  if (ABRE.includes(texto[inicio])) {
    const fecho = fechoDe(texto, inicio);
    return fecho === -1 ? inicio : fecho + 1;
  }
  let nivel = 0;
  let i = inicio;
  for (; i < texto.length; i++) {
    const c = texto[i];
    if (/\s/.test(c) || "=;".includes(c)) break;
    if (ABRE.includes(c)) nivel++;
    else if (FECHA.includes(c) && nivel-- === 0) break;
  }
  // A pontuação da frase não faz parte da fórmula; a vírgula decimal faz.
  while (i > inicio && ".,:".includes(texto[i - 1])) i--;
  return i;
}

export function lerFormulas(texto: string): Pedaco[] {
  const raiz = texto.indexOf("√(");
  if (raiz !== -1) {
    const fecho = fechoDe(texto, raiz + 1);
    if (fecho !== -1) {
      return [...lerFormulas(texto.slice(0, raiz)), { tipo: "raiz", dentro: lerFormulas(texto.slice(raiz + 2, fecho)) }, ...lerFormulas(texto.slice(fecho + 1))];
    }
  }

  for (let barra = texto.indexOf("/"); barra !== -1; barra = texto.indexOf("/", barra + 1)) {
    const inicio = inicioDoNumerador(texto, barra);
    const fim = fimDoDenominador(texto, barra + 1);
    const cima = texto.slice(inicio, barra);
    const baixo = texto.slice(barra + 1, fim);
    if (!cima || !baixo) continue;
    // Razões simples (E/B, m/s, 1/2) ficam na linha; empilha quando há produto ou parênteses.
    const composta = ABRE.includes(baixo[0]) || cima.includes("·") || baixo.includes("·");
    if (!composta || (soUnidades(cima) && soUnidades(baixo))) continue;
    return [
      ...lerFormulas(texto.slice(0, inicio)),
      { tipo: "fracao", cima: lerFormulas(semParenteses(cima)), baixo: lerFormulas(semParenteses(baixo)) },
      ...lerFormulas(texto.slice(fim)),
    ];
  }

  return texto ? [semPontos(texto)] : [];
}

/** Produto por justaposição: "µ₀·i" vira "µ₀i". O ponto fica nas unidades e quando está solto, como separador. */
function semPontos(texto: string): string {
  return texto
    .replace(/·(?=(sen|cos|tg)(?![a-zà-ú]))/g, " ")
    .replace(/((?:sen|cos|tg) [^\s·]+)·/g, "$1 ")
    .replace(/(√\d+)·/g, "$1 ")
    .replace(/\S*·\S*/g, (palavra) => (palavra === "·" || soUnidades(palavra) ? palavra : palavra.replace(/·/g, "")));
}
