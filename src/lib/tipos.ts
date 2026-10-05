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
  /** Pares [quando, o que aconteceu], em ordem. */
  datas: [string, string][];
  /** Pares [termo, definição]. */
  conceitos: [string, string][];
  /** Confusões e pegadinhas comuns. */
  cuidado: string[];
};

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

export type Evento = { ano: number; texto: string };

/** Rodada do jogo O intruso: `itens` pertencem ao `grupo`, `intruso` não. */
export type Intruso = { tema: string; grupo: string; itens: string[]; intruso: string; explicacao: string };

/** Rodada do jogo Causa e consequência: `passos` na ordem em que um leva ao outro. */
export type Cadeia = { tema: string; titulo: string; passos: string[]; explicacao: string };

export type Disciplina = {
  id: string;
  nome: string;
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
  recordes: Record<string, number>;
  /** XP ganho desde o domingo `inicio`; alimenta o ranking semanal. */
  semana: { inicio: string; xp: number };
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
};
