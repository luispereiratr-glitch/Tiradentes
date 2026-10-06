import type { NomeIcone } from "@/components/Icone";
import type { Disciplina, IdJogo } from "./tipos";

type Base = {
  id: IdJogo;
  icone: NomeIcone;
  cor: string;
  /** Conquista do perfil: fazer `pontos` em uma partida. */
  conquista?: { nome: string; pontos: number };
};

/** Todos os jogos que existem. O `id` é a pasta em `/jogos`; cada matéria escolhe os seus e lhes dá nome. */
const JOGOS: Base[] = [
  { id: "relampago", icone: "raio", cor: "bg-barro-claro text-barro", conquista: { nome: "Raio", pontos: 150 } },
  { id: "quem-sou-eu", icone: "pessoas", cor: "bg-musgo-claro text-musgo-escuro", conquista: { nome: "Detetive", pontos: 160 } },
  { id: "cronologia", icone: "relogio", cor: "bg-papel-2 text-tinta" },
  { id: "memoria", icone: "livro", cor: "bg-[#f3e6c4] text-[#7a5a12]" },
  { id: "intruso", icone: "lupa", cor: "bg-erro-claro text-erro", conquista: { nome: "Faro fino", pontos: 100 } },
  { id: "cadeia", icone: "elos", cor: "bg-musgo text-papel", conquista: { nome: "Elo por elo", pontos: 170 } },
  { id: "conta-rapida", icone: "raio", cor: "bg-barro-claro text-barro", conquista: { nome: "Calculadora humana", pontos: 150 } },
  { id: "regra-do-tapa", icone: "eixos", cor: "bg-musgo text-papel", conquista: { nome: "Mão certeira", pontos: 150 } },
  { id: "mira", icone: "alvo", cor: "bg-musgo-claro text-musgo-escuro", conquista: { nome: "Na mosca", pontos: 130 } },
  { id: "campo-dos-fios", icone: "ciclo", cor: "bg-papel-2 text-tinta", conquista: { nome: "Superposição", pontos: 150 } },
  { id: "mais-forte", icone: "escala", cor: "bg-[#f3e6c4] text-[#7a5a12]" },
  { id: "atrai-repele", icone: "ima", cor: "bg-erro-claro text-erro", conquista: { nome: "Reflexo magnético", pontos: 200 } },
];

/**
 * Chave do recorde de um jogo no progresso. Cada matéria tem os seus recordes;
 * os de História ficam sem prefixo porque já estavam salvos assim antes de haver outras matérias.
 */
export const chaveRecorde = (disciplina: string, jogo: IdJogo) => (disciplina === "historia" ? jogo : `${disciplina}:${jogo}`);

/** No relâmpago não dá tempo de ler textos longos nem de estudar um desenho: só entram os enunciados curtos e sem figura. */
export const questoesRelampago = (d: Disciplina) => d.questoes.filter((q) => q.enunciado.length < 170 && !q.figura);

/** O mínimo de conteúdo para um jogo rodar. Os que não aparecem aqui geram as próprias rodadas. */
const TEM_CONTEUDO: Partial<Record<IdJogo, (d: Disciplina) => boolean>> = {
  relampago: (d) => questoesRelampago(d).length > 0,
  "quem-sou-eu": (d) => d.personagens.length >= 4,
  cronologia: (d) => d.eventos.length >= 4,
  memoria: (d) => d.personagens.length >= 6,
  intruso: (d) => d.intrusos.length > 0,
  cadeia: (d) => d.cadeias.length > 0,
  "mais-forte": (d) => d.eventos.length >= 4,
};

/** Os jogos do painel da matéria, com os textos dela, a chave do recorde e se já há conteúdo para jogar. */
export const jogosDe = (d: Disciplina) =>
  d.jogos.map((id) => ({
    ...JOGOS.find((j) => j.id === id)!,
    ...d.textos.jogos[id]!,
    recorde: chaveRecorde(d.id, id),
    disponivel: TEM_CONTEUDO[id]?.(d) ?? true,
  }));

/** `undefined` quando o jogo não faz parte do painel da matéria. */
export const jogoDe = (d: Disciplina, id: IdJogo) => jogosDe(d).find((j) => j.id === id);
