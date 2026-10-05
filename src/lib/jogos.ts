import type { NomeIcone } from "@/components/Icone";

/** Jogos disponíveis. O `id` é a pasta em `/jogos` e a chave do recorde no progresso. */
export const JOGOS: { id: string; nome: string; descricao: string; icone: NomeIcone; cor: string }[] = [
  {
    id: "relampago",
    nome: "Relâmpago",
    descricao: "60 segundos. Quantas você acerta em sequência?",
    icone: "raio",
    cor: "bg-barro-claro text-barro",
  },
  {
    id: "quem-sou-eu",
    nome: "Quem sou eu?",
    descricao: "Descubra a figura histórica com o mínimo de pistas.",
    icone: "pessoas",
    cor: "bg-musgo-claro text-musgo-escuro",
  },
  {
    id: "cronologia",
    nome: "Linha do tempo",
    descricao: "Coloque os acontecimentos na ordem certa.",
    icone: "relogio",
    cor: "bg-papel-2 text-tinta",
  },
  {
    id: "memoria",
    nome: "Memória",
    descricao: "Ligue cada figura ao que ela fez.",
    icone: "livro",
    cor: "bg-[#f3e6c4] text-[#7a5a12]",
  },
  {
    id: "intruso",
    nome: "O intruso",
    descricao: "Três combinam, um não. Ache quem está no grupo errado.",
    icone: "lupa",
    cor: "bg-erro-claro text-erro",
  },
  {
    id: "cadeia",
    nome: "Causa e consequência",
    descricao: "Difícil. Monte a cadeia de fatos, sem datas e com uma única chance.",
    icone: "elos",
    cor: "bg-musgo text-papel",
  },
];
