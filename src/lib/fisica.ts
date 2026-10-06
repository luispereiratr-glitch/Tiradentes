import { embaralhar } from "./jogo";

const SOBRESCRITOS = "⁰¹²³⁴⁵⁶⁷⁸⁹";

const potencia = (n: number) => (n < 0 ? "⁻" : "") + [...String(Math.abs(n))].map((c) => SOBRESCRITOS[Number(c)]).join("");

/** Número com dois algarismos significativos, vírgula decimal e potência de dez quando é muito grande ou pequeno. */
export function numero(x: number): string {
  if (x === 0) return "0";
  const curto = (n: number) => String(parseFloat(n.toPrecision(2))).replace(".", ",");
  let expoente = Math.floor(Math.log10(Math.abs(x)));
  if (expoente >= -2 && expoente <= 3) return curto(x);
  let mantissa = parseFloat((x / 10 ** expoente).toPrecision(2));
  if (mantissa >= 10) {
    mantissa /= 10;
    expoente += 1;
  }
  return `${curto(mantissa)} × 10${potencia(expoente)}`;
}

export const um = <T,>(lista: readonly T[]): T => lista[Math.floor(Math.random() * lista.length)];

export type Vetor = [number, number, number];

export const vetorial = (a: Vetor, b: Vetor): Vetor => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const vezes = (a: Vetor, k: number): Vetor => [a[0] * k, a[1] * k, a[2] * k];
export const iguais = (a: Vetor, b: Vetor) => a.every((n, i) => n === b[i]);
export const nulo = (a: Vetor) => a.every((n) => n === 0);

/** As seis direções dos eixos, com o nome usado nos textos. */
export const EIXOS: { v: Vetor; nome: string }[] = [
  { v: [1, 0, 0], nome: "+x" },
  { v: [-1, 0, 0], nome: "−x" },
  { v: [0, 1, 0], nome: "+y" },
  { v: [0, -1, 0], nome: "−y" },
  { v: [0, 0, 1], nome: "+z" },
  { v: [0, 0, -1], nome: "−z" },
];

export const nomeDoEixo = (v: Vetor) => EIXOS.find((e) => iguais(e.v, v))!.nome;

export type Conta = { enunciado: string; opcoes: string[]; certa: string; dica: string };

type Modelo = () => { enunciado: string; valor: number; unidade: string; dica: string; pi?: boolean };

/** Problemas de uma conta só, com números redondos. Onde aparece π, a resposta fica em função dele. */
const MODELOS: Modelo[] = [
  () => {
    const i = um([1, 2, 4, 5, 10, 20]);
    const d = um([1, 2, 4, 5, 10, 20]);
    return { enunciado: `Fio reto e longo com corrente de ${i} A. Qual é o campo a ${d} cm dele?`, valor: (2e-7 * i) / (d / 100), unidade: "T", dica: "B = 2 × 10⁻⁷·i/d, com d em metros" };
  },
  () => {
    const q = um([1, 2, 4, 5]);
    const v = um([1, 2, 3, 5]) * 10 ** um([3, 4, 5]);
    const b = um([0.1, 0.2, 0.5, 2]);
    return { enunciado: `Carga de ${q} µC a ${numero(v)} m/s, perpendicular a um campo de ${numero(b)} T. Qual é a força?`, valor: q * 1e-6 * v * b, unidade: "N", dica: "F = |q|·v·B, com a carga em coulombs" };
  },
  () => {
    const q = um([2, 4, 6, 8]);
    const v = um([1, 2, 3, 5]) * 10 ** um([3, 4, 5]);
    const b = um([0.1, 0.2, 0.5, 2]);
    return { enunciado: `Carga de ${q} µC a ${numero(v)} m/s, formando 30° com um campo de ${numero(b)} T. Qual é a força?`, valor: q * 1e-6 * v * b * 0.5, unidade: "N", dica: "F = |q|·v·B·sen 30°, e sen 30° = 0,5" };
  },
  () => {
    const razao = um([1, 2, 4, 5]) * 1e-8;
    const v = um([1, 2, 4]) * 10 ** um([5, 6]);
    const b = um([0.1, 0.2, 0.5]);
    return { enunciado: `Partícula com m/|q| = ${numero(razao)} kg/C entra a ${numero(v)} m/s, perpendicular a um campo de ${numero(b)} T. Qual é o raio da órbita?`, valor: (razao * v) / b, unidade: "m", dica: "R = (m/|q|)·v/B" };
  },
  () => {
    const b = um([0.2, 0.4, 0.5, 1.5]);
    const i = um([2, 4, 5, 10]);
    const l = um([10, 20, 50]);
    return { enunciado: `Fio de ${l} cm com corrente de ${i} A, perpendicular a um campo de ${numero(b)} T. Qual é a força?`, valor: (b * i * l) / 100, unidade: "N", dica: "F = B·i·L, com L em metros" };
  },
  () => {
    const i1 = um([5, 10, 20, 50]);
    const i2 = um([5, 10, 20, 50]);
    const d = um([1, 2, 5, 10]);
    return { enunciado: `Dois fios paralelos a ${d} cm um do outro, com correntes de ${i1} A e ${i2} A. Qual é a força em cada metro de fio?`, valor: (2e-7 * i1 * i2) / (d / 100), unidade: "N", dica: "F/L = 2 × 10⁻⁷·i₁·i₂/d, com d em metros" };
  },
  () => {
    const n = um([500, 1000, 2000, 5000]);
    const i = um([1, 2, 5]);
    return { enunciado: `Solenoide com ${n} espiras por metro e corrente de ${i} A. Qual é o campo no interior?`, valor: 4e-7 * n * i, unidade: "T", pi: true, dica: "B = µ₀·n·i = 4π × 10⁻⁷·n·i" };
  },
  () => {
    const e = um([2, 4, 6]) * 10 ** um([3, 4]);
    const b = um([0.1, 0.2, 0.5]);
    return { enunciado: `Seletor de velocidades com E = ${numero(e)} V/m e B = ${numero(b)} T. Que velocidade passa sem desvio?`, valor: e / b, unidade: "m/s", dica: "v = E/B" };
  },
  () => {
    const i = um([1, 2, 5, 10]);
    const r = um([5, 10, 20]);
    return { enunciado: `Espira circular de raio ${r} cm com corrente de ${i} A. Qual é o campo no centro?`, valor: (2e-7 * i) / (r / 100), unidade: "T", pi: true, dica: "B = µ₀·i/(2R) = 2π × 10⁻⁷·i/R, com R em metros" };
  },
  () => {
    const m = um([10, 20, 40]);
    const l = um([20, 50]);
    const b = um([0.2, 0.5]);
    return { enunciado: `Fio horizontal de ${l} cm e ${m} g levita em um campo de ${numero(b)} T perpendicular a ele (g = 10 m/s²). Qual é a corrente?`, valor: ((m / 1000) * 10) / (b * (l / 100)), unidade: "A", dica: "B·i·L = m·g, com massa em kg e L em metros" };
  },
  () => {
    const u = um([2, 4, 8]) * 10 ** um([-4, -3]);
    const d = um([1, 2, 4]);
    const b = um([0.01, 0.02, 0.05]);
    return { enunciado: `Líquido condutor escoa entre placas a ${d} cm uma da outra, em um campo de ${numero(b)} T. A tensão medida é ${numero(u)} V. Qual é a velocidade?`, valor: u / (b * (d / 100)), unidade: "m/s", dica: "q·E = q·v·B, com E = U/d: v = U/(B·d)" };
  },
];

/** Erros típicos: fator 2, potência de dez errada, unidade não convertida. */
const DESVIOS = [2, 0.5, 10, 0.1, 4, 0.25, 100, 0.01];

export function sortearConta(): Conta {
  const { enunciado, valor, unidade, dica, pi } = um(MODELOS)();
  const comPi = (texto: string) => (texto.includes(" × ") ? texto.replace(" × ", "π × ") : `${texto}π`);
  const escrever = (v: number) => `${pi ? comPi(numero(v)) : numero(v)} ${unidade}`;
  const certa = escrever(valor);
  const erradas = [...new Set(embaralhar(DESVIOS).map((k) => escrever(valor * k)))].filter((o) => o !== certa).slice(0, 3);
  return { enunciado, certa, dica, opcoes: embaralhar([certa, ...erradas]) };
}
