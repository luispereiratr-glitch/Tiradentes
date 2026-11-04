/**
 * Colégios que aparecem no cadastro. Cada colégio tem o seu ranking.
 * O `id` fica gravado no perfil de cada aluno: não mude o id de um colégio que já tem gente.
 * Para incluir um colégio novo, basta acrescentar uma linha aqui.
 */
export type Colegio = { id: string; nome: string; sigla?: string };

export const OUTRO = "outro";

const DESTAQUES: Colegio[] = [
  { id: "ctbmpa", nome: "Colégio Tiradentes da Brigada Militar de Porto Alegre", sigla: "CTBMPA" },
  { id: "camar", nome: "Colégio Adventista Marechal Rondon", sigla: "CAMAR" },
];

const DEMAIS: Colegio[] = [
  { id: "cmpa", nome: "Colégio Militar de Porto Alegre", sigla: "CMPA" },
  { id: "aplicacao-ufrgs", nome: "Colégio de Aplicação da UFRGS" },
  { id: "ifrs-poa", nome: "IFRS – Campus Porto Alegre", sigla: "IFRS" },
  { id: "julinho", nome: "Colégio Estadual Júlio de Castilhos", sigla: "Julinho" },
  { id: "instituto-educacao", nome: "Instituto de Educação General Flores da Cunha" },
  { id: "parobe", nome: "Escola Técnica Estadual Parobé" },
  { id: "florinda", nome: "Colégio Estadual Florinda Tubino Sampaio" },
  { id: "protasio", nome: "Colégio Estadual Protásio Alves" },
  { id: "inacio-montanha", nome: "Colégio Estadual Inácio Montanha" },
  { id: "anchieta", nome: "Colégio Anchieta" },
  { id: "farroupilha", nome: "Colégio Farroupilha" },
  { id: "marista-rosario", nome: "Colégio Marista Rosário" },
  { id: "marista-assuncao", nome: "Colégio Marista Assunção" },
  { id: "marista-ipanema", nome: "Colégio Marista Ipanema" },
  { id: "marista-sao-pedro", nome: "Colégio Marista São Pedro" },
  { id: "marista-champagnat", nome: "Colégio Marista Champagnat" },
  { id: "leonardo-da-vinci", nome: "Colégio Leonardo da Vinci" },
  { id: "joao-xxiii", nome: "Colégio João XXIII" },
  { id: "bom-conselho", nome: "Colégio Bom Conselho" },
  { id: "provincia-sao-pedro", nome: "Colégio Província de São Pedro" },
  { id: "israelita", nome: "Colégio Israelita Brasileiro" },
  { id: "mae-de-deus", nome: "Colégio Mãe de Deus" },
  { id: "monteiro-lobato", nome: "Colégio Monteiro Lobato" },
  { id: "santa-ines", nome: "Colégio Santa Inês" },
  { id: "sevigne", nome: "Colégio Sévigné" },
  { id: "santa-doroteia", nome: "Colégio Santa Doroteia" },
  { id: "la-salle-dores", nome: "Colégio La Salle Dores" },
  { id: "la-salle-santo-antonio", nome: "Colégio La Salle Santo Antônio" },
  { id: "la-salle-sao-joao", nome: "Colégio La Salle São João" },
  { id: "la-salle-canoas", nome: "Colégio La Salle Canoas" },
  { id: "batista", nome: "Colégio Batista" },
  { id: "concordia", nome: "Colégio Concórdia" },
  { id: "americano", nome: "Colégio Americano" },
  { id: "pastor-dohms", nome: "Colégio Pastor Dohms" },
  { id: "dom-bosco", nome: "Colégio Dom Bosco" },
  { id: "sao-judas-tadeu", nome: "Colégio São Judas Tadeu" },
  { id: "sinodal", nome: "Colégio Sinodal (São Leopoldo)" },
  { id: "liberato", nome: "Fundação Escola Técnica Liberato (Novo Hamburgo)", sigla: "Liberato" },
].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

/** Na ordem do seletor: os destaques primeiro, depois o resto em ordem alfabética e, por fim, "outro". */
export const COLEGIOS: Colegio[] = [
  ...DESTAQUES,
  ...DEMAIS,
  { id: OUTRO, nome: "Meu colégio não está na lista" },
];

export const colegioDe = (id: string | null | undefined) => COLEGIOS.find((c) => c.id === id);

/** Nome curto para títulos e chips: a sigla, se houver. */
export const nomeCurto = (id: string | null | undefined) => {
  const c = colegioDe(id);
  if (!c) return null;
  if (c.id === OUTRO) return "Outros colégios";
  return c.sigla ?? c.nome;
};

export const colegioValido = (id: unknown): id is string => typeof id === "string" && !!colegioDe(id);
