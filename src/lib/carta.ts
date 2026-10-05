import { doMaisFracoAoMaisForte, type Desempenho } from "./diagnostico";
import { nivelDoXp } from "./jogo";
import type { Placar } from "./tipos";

export type Carta = {
  nome: string;
  /** Matéria do card, mostrada como o "tipo". */
  materia: string;
  xp: number;
  nivel: number;
  raridade: string;
  /** Apelido divertido, vindo do tema em que a pessoa vai melhor. */
  titulo: string;
  frase: string;
  golpes: { nome: string; tema: string; dano: number }[];
  fraqueza: string | null;
  numeros: { valor: string; rotulo: string }[];
  /** Posição no ranking geral, quando já carregou. */
  posicao: number | null;
};

const raridadeDe = (nivel: number) => (nivel >= 8 ? "Lendária" : nivel >= 5 ? "Rara" : nivel >= 3 ? "Incomum" : "Comum");

export function montarCarta(eu: Placar, materia: string, desempenho: Desempenho[], pontosEmJogos: number, posicao: number | null): Carta {
  const ordem = doMaisFracoAoMaisForte(desempenho);
  const fortes = [...ordem].reverse().slice(0, 2);
  const fraco = ordem.length >= 2 ? ordem[0] : null;
  const nivel = nivelDoXp(eu.xp).nivel;
  const forte = fortes[0]?.tema.titulo;

  return {
    nome: eu.usuario,
    materia,
    xp: eu.xp,
    nivel,
    raridade: raridadeDe(nivel),
    titulo: fortes[0]?.tema.carta.titulo ?? "Calouro Promissor",
    frase: !forte
      ? "Acabou de chegar e já está de olho no pódio."
      : fraco
        ? `Responde ${forte} de olhos fechados, mas ${fraco.tema.titulo} ainda dá um susto.`
        : `Responde ${forte} de olhos fechados.`,
    golpes: fortes.length
      ? fortes.map((d) => ({ nome: d.tema.carta.golpe, tema: d.tema.titulo, dano: d.taxa ?? 0 }))
      : [{ nome: "Primeiro passo", tema: "Responda 5 questões de um tema para liberar golpes", dano: 10 }],
    fraqueza: fraco?.tema.titulo ?? null,
    numeros: [
      { valor: eu.precisao === null ? "—" : `${eu.precisao}%`, rotulo: "de acerto" },
      { valor: String(eu.acertadas), rotulo: eu.acertadas === 1 ? "questão" : "questões" },
      { valor: String(eu.sequencia), rotulo: eu.sequencia === 1 ? "dia seguido" : "dias seguidos" },
      { valor: String(pontosEmJogos), rotulo: "pts em jogos" },
    ],
    posicao,
  };
}

export const LARGURA = 1080;
export const ALTURA = 1500;

const COR = {
  papel: "#f6f1e7",
  papel2: "#ede6d6",
  linha: "#ddd4c0",
  tinta: "#1f2a24",
  tinta2: "#5b665e",
  musgo: "#2f5d46",
  musgoEscuro: "#21432f",
  barro: "#c4623a",
  barroClaro: "#f6dfd3",
  ouro: "#d09a2f",
};

function retangulo(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Desenha o card no canvas (1080 × 1500), com as fontes do próprio app. */
export async function desenharCarta(canvas: HTMLCanvasElement, c: Carta) {
  const raiz = getComputedStyle(document.documentElement);
  const serifa = `${raiz.getPropertyValue("--fonte-titulo").trim() || "Georgia"}, Georgia, serif`;
  const sans = `${raiz.getPropertyValue("--fonte-corpo").trim() || "system-ui"}, system-ui, sans-serif`;
  await Promise.all([document.fonts.load(`600 60px ${serifa}`), document.fonts.load(`600 30px ${sans}`), document.fonts.load(`400 30px ${sans}`)]).catch(
    () => null,
  );

  canvas.width = LARGURA;
  canvas.height = ALTURA;
  const ctx = canvas.getContext("2d")!;
  ctx.textBaseline = "alphabetic";

  /** Escreve reduzindo a fonte até caber em `max`. */
  function escrever(texto: string, x: number, y: number, o: { fonte: string; peso: number; tam: number; cor: string; max?: number; alinhar?: CanvasTextAlign }) {
    let tam = o.tam;
    ctx.font = `${o.peso} ${tam}px ${o.fonte}`;
    while (o.max && ctx.measureText(texto).width > o.max && tam > 18) {
      tam -= 2;
      ctx.font = `${o.peso} ${tam}px ${o.fonte}`;
    }
    ctx.fillStyle = o.cor;
    ctx.textAlign = o.alinhar ?? "left";
    ctx.fillText(texto, x, y);
    return ctx.measureText(texto).width;
  }

  function quebrar(texto: string, max: number): string[] {
    const linhas: string[] = [];
    let atual = "";
    for (const palavra of texto.split(" ")) {
      const tentativa = atual ? `${atual} ${palavra}` : palavra;
      if (ctx.measureText(tentativa).width > max && atual) {
        linhas.push(atual);
        atual = palavra;
      } else atual = tentativa;
    }
    return [...linhas, atual];
  }

  // Moldura dourada e fundo de papel
  ctx.fillStyle = COR.ouro;
  retangulo(ctx, 0, 0, LARGURA, ALTURA, 60);
  ctx.fill();
  ctx.fillStyle = COR.papel;
  retangulo(ctx, 26, 26, LARGURA - 52, ALTURA - 52, 40);
  ctx.fill();

  const E = 72; // margem esquerda do conteúdo
  const D = LARGURA - 72;

  // Cabeçalho: nome e XP (o "HP" do card)
  const larguraXp = escrever(String(c.xp), D, 136, { fonte: serifa, peso: 600, tam: 68, cor: COR.barro, alinhar: "right" });
  escrever("XP", D - larguraXp - 12, 136, { fonte: sans, peso: 700, tam: 28, cor: COR.barro, alinhar: "right" });
  escrever(c.nome, E, 136, { fonte: serifa, peso: 600, tam: 68, cor: COR.tinta, max: D - E - larguraXp - 90 });
  escrever(`Nível ${c.nivel} · Carta ${c.raridade}`, E, 184, { fonte: sans, peso: 600, tam: 28, cor: COR.tinta2 });

  // Ilustração
  const AY = 216;
  const AH = 500;
  const degrade = ctx.createLinearGradient(E, AY, D, AY + AH);
  degrade.addColorStop(0, COR.musgoEscuro);
  degrade.addColorStop(1, COR.musgo);
  ctx.save();
  retangulo(ctx, E, AY, D - E, AH, 30);
  ctx.clip();
  ctx.fillStyle = degrade;
  ctx.fillRect(E, AY, D - E, AH);
  ctx.strokeStyle = "rgba(246,241,231,0.09)";
  ctx.lineWidth = 3;
  for (let raio = 170; raio <= 620; raio += 75) {
    ctx.beginPath();
    ctx.arc(LARGURA / 2, AY + 205, raio, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  escrever(`TIPO ${c.materia.toUpperCase()}`, E + 34, AY + 54, { fonte: sans, peso: 700, tam: 22, cor: "rgba(246,241,231,0.75)" });
  if (c.posicao) {
    const rotulo = `${c.posicao}º no ranking`;
    ctx.font = `700 24px ${sans}`;
    const w = ctx.measureText(rotulo).width + 44;
    ctx.fillStyle = COR.ouro;
    retangulo(ctx, D - 30 - w, AY + 24, w, 46, 23);
    ctx.fill();
    escrever(rotulo, D - 30 - w / 2, AY + 56, { fonte: sans, peso: 700, tam: 24, cor: COR.tinta, alinhar: "center" });
  }

  ctx.fillStyle = COR.papel;
  ctx.beginPath();
  ctx.arc(LARGURA / 2, AY + 205, 128, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = COR.ouro;
  ctx.lineWidth = 8;
  ctx.stroke();
  escrever(c.nome.slice(0, 2).toUpperCase(), LARGURA / 2, AY + 246, { fonte: serifa, peso: 600, tam: 116, cor: COR.musgoEscuro, alinhar: "center" });
  escrever(c.titulo, LARGURA / 2, AY + 430, { fonte: serifa, peso: 600, tam: 58, cor: COR.papel, alinhar: "center", max: D - E - 80 });

  // Frase
  ctx.font = `400 31px ${sans}`;
  const frase = quebrar(c.frase, D - E - 40).slice(0, 2);
  frase.forEach((linha, i) => escrever(linha, LARGURA / 2, 778 + i * 42, { fonte: sans, peso: 400, tam: 31, cor: COR.tinta2, alinhar: "center" }));

  // Golpes
  let y = 880;
  for (const golpe of c.golpes) {
    ctx.strokeStyle = COR.linha;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(E, y);
    ctx.lineTo(D, y);
    ctx.stroke();
    ctx.fillStyle = COR.barro;
    ctx.beginPath();
    ctx.arc(E + 26, y + 62, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COR.papel;
    ctx.beginPath();
    ctx.arc(E + 26, y + 62, 10, 0, Math.PI * 2);
    ctx.fill();
    const larguraDano = escrever(String(golpe.dano), D, y + 84, { fonte: serifa, peso: 600, tam: 70, cor: COR.tinta, alinhar: "right" });
    const max = D - E - 76 - larguraDano - 30;
    escrever(golpe.nome, E + 76, y + 60, { fonte: serifa, peso: 600, tam: 46, cor: COR.tinta, max });
    escrever(golpe.tema, E + 76, y + 100, { fonte: sans, peso: 400, tam: 26, cor: COR.tinta2, max });
    y += 130;
  }
  ctx.beginPath();
  ctx.moveTo(E, y);
  ctx.lineTo(D, y);
  ctx.stroke();

  // Números
  const NY = 1168;
  const vao = 18;
  const largura = (D - E - vao * 3) / 4;
  c.numeros.forEach((n, i) => {
    const x = E + i * (largura + vao);
    ctx.fillStyle = COR.papel2;
    retangulo(ctx, x, NY, largura, 124, 22);
    ctx.fill();
    escrever(n.valor, x + largura / 2, NY + 62, { fonte: serifa, peso: 600, tam: 48, cor: COR.musgo, alinhar: "center", max: largura - 24 });
    escrever(n.rotulo, x + largura / 2, NY + 100, { fonte: sans, peso: 600, tam: 22, cor: COR.tinta2, alinhar: "center", max: largura - 20 });
  });

  // Rodapé: fraqueza e marca
  escrever("FRAQUEZA", E, 1356, { fonte: sans, peso: 700, tam: 22, cor: COR.tinta2 });
  escrever(c.fraqueza ?? "Nenhuma até agora", E, 1402, { fonte: serifa, peso: 600, tam: 38, cor: COR.barro, max: 620 });
  escrever("Caderno", D, 1402, { fonte: serifa, peso: 600, tam: 40, cor: COR.musgoEscuro, alinhar: "right" });
  escrever(new Date().toLocaleDateString("pt-BR"), D, 1356, { fonte: sans, peso: 600, tam: 22, cor: COR.tinta2, alinhar: "right" });
}
