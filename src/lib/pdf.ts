import type { Desempenho } from "./diagnostico";
import type { Resumo } from "./tipos";

type Cor = [number, number, number];
const TINTA: Cor = [31, 42, 36];
const TINTA_2: Cor = [91, 102, 94];
const MUSGO: Cor = [47, 93, 70];
const BARRO: Cor = [196, 98, 58];
const LINHA: Cor = [221, 212, 192];
const FUNDO: Cor = [246, 241, 231];

const TROCAS: [RegExp, string][] = [
  [/[“”]/g, '"'],
  [/[‘’]/g, "'"],
  [/[–—]/g, "-"],
  [/…/g, "..."],
  [/→/g, "->"],
];

/** As fontes padrão do PDF só cobrem o alfabeto latino básico: troca o resto por equivalentes. */
function limpar(texto: string): string {
  let t = texto;
  for (const [de, para] of TROCAS) t = t.replace(de, para);
  return [...t].map((c) => (c.charCodeAt(0) <= 255 ? c : c.normalize("NFD").replace(/[^\x00-\xff]/g, "") || "?")).join("");
}

const MAX_ERRADAS = 10;
const MAX_NA_SINTESE = 6;

/** Corta o texto numa palavra inteira, para caber numa linha ou duas. */
function encurtar(texto: string, max: number): string {
  const limpo = texto.replace(/\s+/g, " ").trim();
  return limpo.length <= max ? limpo : `${limpo.slice(0, limpo.lastIndexOf(" ", max))}...`;
}

export type Capitulo = { alvo: Desempenho; resumo: Resumo; /** O tema foi apontado pelo diagnóstico, e não escolhido à mão. */ sugerido: boolean };

/**
 * Monta e baixa o resumo de um ou mais temas, com o diagnóstico da pessoa e as questões que ela errou.
 * Um tema só sai completo; vários saem em síntese, direto ao que a pessoa errou em cada um.
 */
export async function baixarResumo(dados: { nome: string; capitulos: Capitulo[]; todos: Desempenho[] }) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const LARGURA = doc.internal.pageSize.getWidth();
  const ALTURA = doc.internal.pageSize.getHeight();
  const MARGEM = 50;
  const util = LARGURA - 2 * MARGEM;
  let y = MARGEM;

  const reservar = (altura: number) => {
    if (y + altura > ALTURA - MARGEM - 14) {
      doc.addPage();
      y = MARGEM;
    }
  };

  function texto(conteudo: string, o: { tam?: number; negrito?: boolean; cor?: Cor; recuo?: number; depois?: number; fonte?: "helvetica" | "times" } = {}) {
    const tam = o.tam ?? 10.5;
    const recuo = o.recuo ?? 0;
    doc.setFont(o.fonte ?? "helvetica", o.negrito ? "bold" : "normal");
    doc.setFontSize(tam);
    doc.setTextColor(...(o.cor ?? TINTA));
    const entrelinha = tam * 1.42;
    for (const linha of doc.splitTextToSize(limpar(conteudo), util - recuo) as string[]) {
      reservar(entrelinha);
      doc.text(linha, MARGEM + recuo, y + tam);
      y += entrelinha;
    }
    y += o.depois ?? 6;
  }

  function secao(titulo: string) {
    y += 10;
    reservar(60);
    texto(titulo, { tam: 15, negrito: true, cor: MUSGO, fonte: "times", depois: 2 });
    doc.setDrawColor(...LINHA);
    doc.setLineWidth(1);
    doc.line(MARGEM, y, LARGURA - MARGEM, y);
    y += 10;
  }

  /** Item com marcador ou rótulo em negrito à esquerda. */
  function item(rotulo: string, conteudo: string, larguraRotulo: number) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    const linhasRotulo = doc.splitTextToSize(limpar(rotulo), larguraRotulo - 8) as string[];
    doc.setFont("helvetica", "normal");
    const linhas = doc.splitTextToSize(limpar(conteudo), util - larguraRotulo) as string[];
    const entrelinha = 10.5 * 1.42;
    reservar(Math.min(Math.max(linhas.length, linhasRotulo.length), 3) * entrelinha);
    const topo = y;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...BARRO);
    linhasRotulo.forEach((l, i) => doc.text(l, MARGEM, topo + 10.5 + i * entrelinha));
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...TINTA);
    for (const linha of linhas) {
      reservar(entrelinha);
      doc.text(linha, MARGEM + larguraRotulo, y + 10.5);
      y += entrelinha;
    }
    y = Math.max(y, topo + linhasRotulo.length * entrelinha) + 5;
  }

  const { capitulos, todos } = dados;
  const varios = capitulos.length > 1;
  const hoje = new Date().toLocaleDateString("pt-BR");

  function faixa() {
    doc.setFillColor(...MUSGO);
    doc.rect(0, 0, LARGURA, 8, "F");
  }

  function mapa() {
    const comparaveis = todos.filter((d) => d.taxa !== null);
    if (comparaveis.length < 2) return;
    // O mapa só faz sentido inteiro: se não couber no fim da página, vai para a próxima.
    reservar(70 + comparaveis.length * 18);
    secao("Seu mapa da matéria");
    for (const d of [...comparaveis].sort((a, b) => a.taxa! - b.taxa!)) {
      const destaque = capitulos.some((c) => c.alvo.tema.id === d.tema.id);
      doc.setFont("helvetica", destaque ? "bold" : "normal");
      doc.setFontSize(10);
      doc.setTextColor(...TINTA);
      doc.text(limpar(d.tema.titulo), MARGEM, y + 9);
      doc.text(`${d.taxa}%`, LARGURA - MARGEM, y + 9, { align: "right" });
      const inicioBarra = MARGEM + 230;
      const larguraBarra = util - 230 - 42;
      doc.setFillColor(...LINHA);
      doc.roundedRect(inicioBarra, y + 2, larguraBarra, 7, 3.5, 3.5, "F");
      doc.setFillColor(...(destaque ? BARRO : MUSGO));
      if (d.taxa! > 0) doc.roundedRect(inicioBarra, y + 2, Math.max((larguraBarra * d.taxa!) / 100, 7), 7, 3.5, 3.5, "F");
      y += 18;
    }
  }

  /** Nível de dificuldade em que a pessoa mais erra no tema, quando ele destoa da média. */
  function nivelQuePesa(alvo: Desempenho): string {
    const pior = alvo.niveis.filter((n) => n.respostas >= 3).sort((a, b) => a.taxa - b.taxa)[0];
    return pior && alvo.taxa !== null && pior.taxa < alvo.taxa ? ` O que mais pesa são as questões de nível ${pior.nome} (${pior.taxa}% de acerto).` : "";
  }

  const rotulo = (titulo: string) => texto(titulo, { tam: 8.5, negrito: true, cor: BARRO, depois: 3 });

  /** Versão curta de um tema, centrada no que a pessoa errou. */
  function sintese({ alvo, resumo }: Capitulo, numero: number) {
    y += 16;
    reservar(170);
    texto(`${numero}. ${alvo.tema.titulo}`, { tam: 17, negrito: true, cor: MUSGO, fonte: "times", depois: 1 });
    texto(`${alvo.taxa}% de acerto em ${alvo.respostas} respostas.${nivelQuePesa(alvo)}`, { cor: TINTA_2, depois: 4 });
    doc.setDrawColor(...LINHA);
    doc.setLineWidth(1);
    doc.line(MARGEM, y, LARGURA - MARGEM, y);
    y += 10;

    if (alvo.erradas.length > 0) {
      rotulo("O QUE VOCÊ ERROU");
      for (const { questao: q, vezes } of alvo.erradas.slice(0, MAX_NA_SINTESE)) {
        reservar(50);
        texto(`${encurtar(q.enunciado, 150)}${vezes > 1 ? ` (errou ${vezes} vezes)` : ""}`, { tam: 9.5, cor: TINTA_2, depois: 1 });
        texto(`Certo: ${q.alternativas[0]}`, { negrito: true, depois: q.lembre ? 1 : 7 });
        if (q.lembre) texto(q.lembre, { cor: MUSGO, depois: 7 });
      }
      const resto = alvo.erradas.length - MAX_NA_SINTESE;
      if (resto > 0) texto(`Há mais ${resto} ${resto === 1 ? "questão errada" : "questões erradas"} deste tema esperando na Revisão.`, { tam: 9.5, cor: TINTA_2, depois: 8 });
    }

    reservar(60);
    rotulo("NÃO CONFUNDA");
    for (const aviso of resumo.cuidado) item("!", aviso, 16);
    y += 4;

    reservar(50);
    rotulo("DATAS-CHAVE");
    texto(resumo.datas.map(([quando, oque]) => `${quando}: ${oque}`).join("  ·  "), { tam: 9.5, depois: 4 });
  }

  /** Versão completa de um tema. */
  function capitulo({ alvo, resumo, sugerido }: Capitulo) {
  faixa();
  texto("CADERNO · RESUMO SOB MEDIDA", { tam: 9, negrito: true, cor: BARRO, depois: 4 });
  texto(alvo.tema.titulo, { tam: 26, negrito: true, fonte: "times", depois: 0 });
  texto(`${alvo.tema.periodo} · preparado para ${dados.nome} em ${hoje}`, { cor: TINTA_2, depois: 14 });

  // Diagnóstico
  const erradas = `${alvo.erradas.length} ${alvo.erradas.length === 1 ? "questão errada" : "questões erradas"} ao menos uma vez`;
  const diagnostico =
    alvo.taxa === null
      ? "Você ainda não respondeu questões deste tema. Use o resumo como ponto de partida e depois teste na trilha."
      : `${sugerido ? "É onde você mais erra: " : ""}${alvo.taxa}% de acerto em ${alvo.respostas} respostas, com ${erradas}.${nivelQuePesa(alvo)}`;
  const recuoCaixa = 14;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  const linhasDiagnostico = (doc.splitTextToSize(limpar(diagnostico), util - recuoCaixa) as string[]).length;
  const alturaCaixa = 58 + linhasDiagnostico * 15;
  doc.setFillColor(...FUNDO);
  doc.roundedRect(MARGEM, y, util, alturaCaixa, 8, 8, "F");
  const topoCaixa = y;
  y += 12;
  texto(sugerido ? "POR QUE ESTE TEMA" : "SEU DESEMPENHO NESTE TEMA", { tam: 8.5, negrito: true, cor: MUSGO, recuo: recuoCaixa, depois: 2 });
  texto(diagnostico, { recuo: recuoCaixa, depois: 2 });
  texto(`Você já fez ${alvo.feitas} das ${alvo.total} questões do tema.`, { cor: TINTA_2, recuo: recuoCaixa });
  y = topoCaixa + alturaCaixa + 6;

  secao("O essencial");
  for (const paragrafo of resumo.essencial) texto(paragrafo, { depois: 8 });

  secao("Linha do tempo");
  for (const [quando, oque] of resumo.datas) item(quando, oque, 104);

  secao("Conceitos que a prova cobra");
  for (const [termo, definicao] of resumo.conceitos) {
    reservar(40);
    texto(termo, { negrito: true, depois: 1 });
    texto(definicao, { depois: 8 });
  }

  secao("Não confunda");
  for (const aviso of resumo.cuidado) item("!", aviso, 16);

  secao("Perguntas da prova, com resposta-modelo");
  for (const { pergunta, resposta } of alvo.tema.guia) {
    reservar(60);
    texto(pergunta, { negrito: true, depois: 2 });
    texto(resposta, { depois: 10 });
  }

  if (alvo.erradas.length > 0) {
    secao("Onde você errou");
    texto("As questões deste tema que você já errou, com a resposta certa e o porquê. Releia antes de voltar à revisão.", { cor: TINTA_2, depois: 10 });
    alvo.erradas.slice(0, MAX_ERRADAS).forEach(({ questao: q }, i) => {
      reservar(70);
      texto(`${i + 1}. ${q.enunciado}`, { negrito: true, depois: 3 });
      texto(`Resposta certa: ${q.alternativas[0]}`, { cor: MUSGO, depois: 3 });
      texto(q.explicacao, { depois: q.lembre ? 3 : 10 });
      if (q.lembre) texto(`Para lembrar: ${q.lembre}`, { cor: BARRO, depois: 10 });
    });
  }

  }

  if (varios) {
    faixa();
    texto("CADERNO · RESUMO SOB MEDIDA", { tam: 9, negrito: true, cor: BARRO, depois: 4 });
    texto("Meus pontos fracos", { tam: 26, negrito: true, fonte: "times", depois: 0 });
    texto(`Preparado para ${dados.nome} em ${hoje}`, { cor: TINTA_2, depois: 12 });
    texto(
      `Direto ao ponto: os ${capitulos.length} temas em que você mais erra, com o que você errou em cada um, o que não confundir e as datas-chave.`,
      { depois: 10 },
    );
    capitulos.forEach((c, i) =>
      item(`${i + 1}.`, `${c.alvo.tema.titulo}${c.alvo.taxa === null ? "" : `: ${c.alvo.taxa}% de acerto em ${c.alvo.respostas} respostas`}`, 22),
    );
    mapa();
  }
  capitulos.forEach((c, i) => (varios ? sintese(c, i + 1) : capitulo(c)));
  if (!varios) mapa();

  const paginas = doc.getNumberOfPages();
  for (let n = 1; n <= paginas; n++) {
    doc.setPage(n);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...TINTA_2);
    doc.text(limpar(`Caderno · ${varios ? "Meus pontos fracos" : capitulos[0].alvo.tema.titulo}`), MARGEM, ALTURA - 28);
    doc.text(`${n} / ${paginas}`, LARGURA - MARGEM, ALTURA - 28, { align: "right" });
  }

  doc.save(varios ? "resumo-pontos-fracos.pdf" : `resumo-${capitulos[0].alvo.tema.id}.pdf`);
}
