const TRACOS = {
  casa: "M4 11.5 12 5l8 6.5V20h-5.5v-5h-5v5H4z",
  raio: "M13 3 5 14h6l-1 7 8-11h-6z",
  ciclo: "M4 12a8 8 0 0 1 13.7-5.6L20 9M20 4v5h-5M20 12a8 8 0 0 1-13.7 5.6L4 15M4 20v-5h5",
  pessoas: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14.5a6 6 0 0 1 3.5 5.5",
  perfil: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20.5a7.5 7.5 0 0 1 15 0",
  chama: "M12 3c1 3.5 5 5.5 5 10.5a5 5 0 0 1-10 0c0-2 1-3.2 2-4.2.4 1.4 1.2 2.2 2 2.2 0-3 .2-5.5 1-8.5z",
  estrela: "m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z",
  cadeado: "M7 11V8a5 5 0 0 1 10 0v3M5.5 11h13v9.5h-13z",
  seta: "M5 12h14M13 6l6 6-6 6",
  voltar: "M19 12H5M11 6l-6 6 6 6",
  certo: "m5 12.5 4.5 4.5L19 7.5",
  errado: "M6 6l12 12M18 6 6 18",
  cima: "m6 14 6-6 6 6",
  baixo: "m6 10 6 6 6-6",
  trofeu: "M8 4h8v5a4 4 0 0 1-8 0zM8 6H4.5v1.5A3.5 3.5 0 0 0 8 11M16 6h3.5v1.5A3.5 3.5 0 0 1 16 11M12 13v4M8.5 20h7M10 17h4",
  relogio: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7.5V12l3 2",
  livro: "M5 4.5h10a3 3 0 0 1 3 3V20H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h10",
} as const;

export type NomeIcone = keyof typeof TRACOS;

export function Icone({ nome, className = "size-5", cheio = false }: { nome: NomeIcone; className?: string; cheio?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={cheio ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={TRACOS[nome]} />
    </svg>
  );
}
