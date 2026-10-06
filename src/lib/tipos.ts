import type { NomeIcone } from "@/components/Icone";

export type Nivel = "facil" | "medio" | "dificil" | "desafio";

export type Questao = {
  id: string;
  tema: string;
  nivel: Nivel;
  /** Banca cujo estilo a questão segue. Não é uma questão oficial dessa banca. */
  estilo: string;
  /** Preenchido só quando a questão foi conferida numa prova real, ex.: "Fuvest 2012". */
  oficial?: string;
  enunciado: string;
  /** Desenho que acompanha o enunciado: arquivo em `public/questoes`, com o tamanho em pixels e uma descrição para quem não o vê. */
  figura?: { src: string; alt: string; largura: number; altura: number };
  /** A primeira alternativa é sempre a correta; a ordem é embaralhada na tela. */
  alternativas: string[];
  explicacao: string;
  lembre?: string;
};

export type Tema = {
  id: string;
  disciplina: string;
  grupo: string;
  titulo: string;
  periodo: string;
  resumo: string;
  /** Textos do card de jogador: o apelido de quem domina o tema e o nome do "golpe". */
  carta: { titulo: string; golpe: string };
  /** Perguntas discursivas da prova com resposta-modelo. */
  guia: { pergunta: string; resposta: string }[];
};

/** Material de estudo de um tema, usado no resumo em PDF. */
export type Resumo = {
  /** Parágrafos com o que não pode faltar. */
  essencial: string[];
  /** Pares [rótulo, texto], em ordem. Em História, [quando, o que aconteceu]; o título da seção vem de `textos.resumo`. */
  datas: [string, string][];
  /** Pares [termo, definição]. */
  conceitos: [string, string][];
  /** Confusões e pegadinhas comuns. */
  cuidado: string[];
};

/** Ficha de estudo. Em História é uma figura; em outra matéria pode ser um conceito, uma lei, uma grandeza. */
export type Personagem = {
  id: string;
  nome: string;
  lugar: string;
  quem: string;
  gancho: string;
  palavras: string[];
  /** Da pista mais difícil para a mais fácil. */
  pistas: string[];
  /** Fatos menos conhecidos, escritos sem citar o nome: aparecem na ficha e viram pistas difíceis no Quem sou eu. */
  curiosidades: string[];
  /** Frase curta usada no jogo da memória. */
  fato: string;
};

/**
 * Item dos jogos de ordenar e de comparar: `ano` é o valor que define a ordem (o ano, em História; uma medida, em outras matérias).
 * `rotulo` é o que aparece depois de conferir, quando o número sozinho não basta (ex.: "3 × 10⁸ m/s").
 */
export type Evento = { ano: number; texto: string; rotulo?: string };

/** Rodada do jogo O intruso: `itens` pertencem ao `grupo`, `intruso` não. */
export type Intruso = { tema: string; grupo: string; itens: string[]; intruso: string; explicacao: string };

/** Rodada do jogo Causa e consequência: `passos` na ordem em que um leva ao outro. */
export type Cadeia = { tema: string; titulo: string; passos: string[]; explicacao: string };

export type IdJogo =
  | "relampago"
  | "quem-sou-eu"
  | "cronologia"
  | "memoria"
  | "intruso"
  | "cadeia"
  | "conta-rapida"
  | "regra-do-tapa"
  | "mira"
  | "campo-dos-fios"
  | "mais-forte"
  | "atrai-repele";

/** O que muda de nome de uma matéria para outra. As telas e as regras dos jogos são as mesmas. */
export type Textos = {
  /** Aba das fichas (`personagens`). */
  fichas: { aba: string; icone: NomeIcone; intro: string };
  /** Nome e descrição dos jogos da matéria (os listados em `Disciplina.jogos`). */
  jogos: Partial<Record<IdJogo, { nome: string; descricao: string; icone?: NomeIcone }>>;
  quemSouEu: { rodada: string; proxima: string };
  cronologia: { titulo: string; instrucao: string };
  memoria: { titulo: string };
  cadeia: { instrucao: string };
  /** Seção do resumo em PDF feita com `Resumo.datas`: título, título curto e como citá-la numa frase ("as datas"). */
  resumo: { datas: string; datasCurto: string; itens: string };
};

export type Disciplina = {
  id: string;
  nome: string;
  icone: NomeIcone;
  /** Os jogos do painel desta matéria, na ordem em que aparecem. */
  jogos: IdJogo[];
  textos: Textos;
  temas: Tema[];
  questoes: Questao[];
  personagens: Personagem[];
  eventos: Evento[];
  intrusos: Intruso[];
  /** Resumo de estudo por id de tema. */
  resumos: Record<string, Resumo>;
  cadeias: Cadeia[];
};

export type RegistroQuestao = { a: number; e: number; caixa: number; prox: string };

export type Progresso = {
  xp: number;
  dias: { ultimo: string | null; sequencia: number; melhor: number };
  questoes: Record<string, RegistroQuestao>;
  /** chave `tema:nivel` → melhor número de estrelas (1 a 3) */
  licoes: Record<string, number>;
  /** Melhor pontuação por jogo; a chave vem de `chaveRecorde`. */
  recordes: Record<string, number>;
  /** XP ganho desde o domingo `inicio`; alimenta o ranking semanal. */
  semana: { inicio: string; xp: number };
  /** O mesmo XP, separado por matéria: é o que conta no ranking de cada uma. */
  materias: Record<string, { xp: number; semana: { inicio: string; xp: number } }>;
};

/** O que uma pessoa fez em uma matéria. */
export type PlacarMateria = {
  xp: number;
  xpSemana: number;
  /** Questões diferentes acertadas ao menos uma vez. */
  acertadas: number;
  /** Percentual de acerto sobre todas as tentativas; `null` se ainda não respondeu nada. */
  precisao: number | null;
};

/** Linha do ranking: o que os outros usuários podem ver de cada pessoa. */
export type Placar = {
  id: string;
  usuario: string;
  xp: number;
  xpSemana: number;
  sequencia: number;
  /** Questões diferentes acertadas ao menos uma vez. */
  acertadas: number;
  /** Percentual de acerto sobre todas as tentativas; `null` se ainda não respondeu nada. */
  precisao: number | null;
  recordes: Record<string, number>;
  /** Os mesmos números, por matéria. Quem nunca estudou uma matéria não tem a chave dela. */
  materias: Record<string, PlacarMateria>;
};
