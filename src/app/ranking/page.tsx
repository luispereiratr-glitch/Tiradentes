"use client";

import { useEffect, useState } from "react";
import { Casca, Topo } from "@/components/Casca";
import { Icone } from "@/components/Icone";
import { useApp } from "@/lib/app";
import { supabase } from "@/lib/supabase";

type Linha = { id: string; usuario: string; xp: number; sequencia: number };

function Ranking() {
  const { usuario, modoLocal } = useApp();
  const [linhas, setLinhas] = useState<Linha[] | null>(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from("perfis")
      .select("id, usuario, xp, sequencia")
      .order("xp", { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (error) setErro(true);
        else setLinhas(data);
      });
  }, []);

  return (
    <>
      <Topo titulo="Ranking" voltar="/perfil" />
      {modoLocal ? (
        <p className="rounded-2xl border border-linha bg-cartao p-5 leading-relaxed text-tinta-2">
          O ranking aparece quando o banco de dados estiver configurado e houver mais gente com conta.
        </p>
      ) : erro ? (
        <p role="alert" className="rounded-2xl bg-erro-claro p-4 text-erro">
          Não foi possível carregar o ranking. Verifique a conexão e tente de novo.
        </p>
      ) : !linhas ? (
        <p className="text-tinta-2">Carregando…</p>
      ) : (
        <ol className="space-y-2">
          {linhas.map((linha, i) => (
            <li
              key={linha.id}
              className={`flex items-center gap-3 rounded-2xl border p-3.5 ${linha.id === usuario!.id ? "border-musgo bg-musgo-claro" : "border-linha bg-cartao"}`}
            >
              <span className={`w-7 text-center font-titulo text-lg font-semibold ${i < 3 ? "text-ouro" : "text-tinta-2"}`}>{i + 1}</span>
              <span className="flex-1 font-semibold">{linha.usuario}</span>
              {linha.sequencia > 0 && (
                <span className="flex items-center gap-1 text-sm font-semibold text-barro">
                  <Icone nome="chama" className="size-4" cheio /> {linha.sequencia}
                </span>
              )}
              <span className="text-sm font-semibold text-musgo tabular-nums">{linha.xp} XP</span>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}

export default function PaginaRanking() {
  return (
    <Casca>
      <Ranking />
    </Casca>
  );
}
