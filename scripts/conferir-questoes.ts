/**
 * Confere o banco de questões: quantidade por tema e nível, ids repetidos e
 * padrões que entregam a resposta (a correta ser sempre a mais longa, por exemplo).
 * Uso: npx tsx scripts/conferir-questoes.ts
 */
import { disciplina } from "../src/conteudo";
import type { Questao } from "../src/lib/tipos";

const NIVEIS = ["facil", "medio", "dificil", "desafio"] as const;
const pct = (n: number, total: number) => (total ? `${Math.round((100 * n) / total)}%` : "–");

function posicaoPorTamanho(q: Questao): "maior" | "menor" | "meio" {
  const tamanhos = q.alternativas.map((a) => a.length);
  const certa = tamanhos[0];
  const outras = tamanhos.slice(1);
  if (outras.every((t) => certa > t)) return "maior";
  if (outras.every((t) => certa < t)) return "menor";
  return "meio";
}

function relatorio(nome: string, lista: Questao[]) {
  const multipla = lista.filter((q) => q.alternativas.length > 2);
  const maior = multipla.filter((q) => posicaoPorTamanho(q) === "maior").length;
  const menor = multipla.filter((q) => posicaoPorTamanho(q) === "menor").length;
  const acaso = multipla.reduce((s, q) => s + 1 / q.alternativas.length, 0);
  console.log(
    `${nome.padEnd(22)} ${String(lista.length).padStart(4)} questões | correta é a maior: ${pct(maior, multipla.length).padStart(4)} | a menor: ${pct(menor, multipla.length).padStart(4)} | esperado ao acaso: ${pct(acaso, multipla.length)}`,
  );
}

const todas = disciplina.questoes;
const autorais = todas.filter((q) => !q.oficial);

console.log("Questões por tema e nível (autorais + oficiais):");
for (const t of disciplina.temas) {
  const doTema = todas.filter((q) => q.tema === t.id);
  const porNivel = NIVEIS.map((n) => `${n} ${String(doTema.filter((q) => q.nivel === n).length).padStart(3)}`).join(" | ");
  console.log(`  ${t.id.padEnd(16)} ${porNivel} | total ${doTema.length}`);
}

console.log("\nTamanho da alternativa correta:");
relatorio("todas", todas);
relatorio("autorais", autorais);
relatorio("oficiais", todas.filter((q) => q.oficial));
for (const n of NIVEIS) relatorio(`autorais ${n}`, autorais.filter((q) => q.nivel === n));

/** Posição da correta por tamanho (1 = a mais longa). O ideal é ficar perto de uma distribuição uniforme. */
const posicoes = [0, 0, 0, 0, 0];
const multiplas = autorais.filter((q) => q.alternativas.length > 2 && !/^(Apenas I|I, II)/.test(q.alternativas[0]));
for (const q of multiplas) posicoes[q.alternativas.filter((a) => a.length > q.alternativas[0].length).length]++;
console.log(`\nPosição da correta por tamanho nas autorais (1ª = maior): ${posicoes.map((n, i) => `${i + 1}ª ${pct(n, multiplas.length)}`).join(" | ")}`);

if (process.argv.includes("--posicoes")) {
  for (const q of multiplas) {
    const pos = q.alternativas.filter((a) => a.length > q.alternativas[0].length).length + 1;
    console.log(`  ${q.id.padEnd(8)} ${pos}ª  ${q.alternativas.map((a) => a.length).join(" ")}`);
  }
}

const vf = autorais.filter((q) => q.alternativas.length === 2);
const falso = vf.filter((q) => q.alternativas[0] === "Falso").length;
console.log(`\nVerdadeiro ou falso: ${vf.length} questões, ${falso} com resposta "Falso".`);

const ids = new Map<string, number>();
for (const q of todas) ids.set(q.id, (ids.get(q.id) ?? 0) + 1);
const repetidos = [...ids].filter(([, n]) => n > 1).map(([id]) => id);
const semTema = todas.filter((q) => !disciplina.temas.some((t) => t.id === q.tema)).map((q) => q.id);
const poucas = todas.filter((q) => q.alternativas.length < 2 || new Set(q.alternativas).size !== q.alternativas.length).map((q) => q.id);
console.log(`Ids repetidos: ${repetidos.join(", ") || "nenhum"}`);
console.log(`Tema inexistente: ${semTema.join(", ") || "nenhum"}`);
console.log(`Alternativas faltando ou repetidas: ${poucas.join(", ") || "nenhuma"}`);

if (process.argv.includes("--listar")) {
  console.log("\nAutorais em que a correta é a maior:");
  for (const q of autorais) if (q.alternativas.length > 2 && posicaoPorTamanho(q) === "maior") console.log(`  ${q.id} (${q.nivel})`);
}
