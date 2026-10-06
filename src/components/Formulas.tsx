import { lerFormulas, type Pedaco } from "@/lib/formulas";

function desenhar(pedacos: Pedaco[]): React.ReactNode {
  return pedacos.map((p, i) => {
    if (typeof p === "string") return p;
    if (p.tipo === "fracao") {
      return (
        <span key={i} className="mx-[0.15em] inline-flex flex-col items-center align-middle text-[0.92em] leading-[1.3] whitespace-nowrap">
          <span className="px-[0.25em]">{desenhar(p.cima)}</span>
          <span className="w-full border-t-[1.5px] border-current px-[0.25em] text-center">{desenhar(p.baixo)}</span>
        </span>
      );
    }
    return (
      <span key={i} className="mx-[0.1em] inline-flex items-stretch align-middle whitespace-nowrap">
        {/* O sinal da raiz estica até a altura do que está dentro dele. */}
        <svg viewBox="0 0 10 20" preserveAspectRatio="none" className="w-[0.6em] shrink-0" aria-hidden>
          <path d="M0.5 12 2.8 11 5.5 19 9.6 0.7" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>
        <span className="border-t-[1.5px] border-current px-[0.15em]">{desenhar(p.dentro)}</span>
      </span>
    );
  });
}

/** Texto do conteúdo com as fórmulas desenhadas como nos livros: fração empilhada, raiz com traço, produto sem ponto. */
export function Formulas({ children }: { children: string }) {
  return <>{desenhar(lerFormulas(children))}</>;
}
