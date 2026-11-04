import { COLEGIOS, OUTRO } from "@/lib/colegios";

const destaques = COLEGIOS.filter((c) => c.sigla === "CTBMPA" || c.sigla === "CAMAR");
const demais = COLEGIOS.filter((c) => !destaques.includes(c) && c.id !== OUTRO);

/** Lista de colégios para o cadastro e o perfil. `valor` vazio mostra o "Escolha…". */
export function SeletorColegio({
  valor,
  aoMudar,
  className = "",
}: {
  valor: string;
  aoMudar: (id: string) => void;
  className?: string;
}) {
  return (
    <select
      value={valor}
      onChange={(e) => aoMudar(e.target.value)}
      required
      className={`w-full appearance-none rounded-2xl border-2 border-linha bg-cartao px-4 py-3.5 text-base outline-none focus:border-musgo ${valor ? "" : "text-tinta-2"} ${className}`}
    >
      <option value="" disabled>
        Escolha o seu colégio…
      </option>
      {destaques.map((c) => (
        <option key={c.id} value={c.id}>
          {c.nome}
          {c.sigla ? ` (${c.sigla})` : ""}
        </option>
      ))}
      <optgroup label="Outros colégios da região">
        {demais.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nome}
          </option>
        ))}
      </optgroup>
      <option value={OUTRO}>Meu colégio não está na lista</option>
    </select>
  );
}
