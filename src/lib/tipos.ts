export type Nivel = "facil" | "medio" | "dificil";

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
  /** Perguntas discursivas da prova com resposta-modelo. */
  guia: { pergunta: string; resposta: string }[];
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
  /** Frase curta usada no jogo da memória. */
  fato: string;
};

export type Evento = { ano: number; texto: string };

export type Disciplina = {
  id: string;
  nome: string;
  temas: Tema[];
  questoes: Questao[];
  personagens: Personagem[];
  eventos: Evento[];
};

export type RegistroQuestao = { a: number; e: number; caixa: number; prox: string };

export type Progresso = {
  xp: number;
  dias: { ultimo: string | null; sequencia: number; melhor: number };
  questoes: Record<string, RegistroQuestao>;
  /** chave `tema:nivel` → melhor número de estrelas (1 a 3) */
  licoes: Record<string, number>;
  recordes: Record<string, number>;
};
