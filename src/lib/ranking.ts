"use client";

import { useEffect, useState } from "react";
import { materiaDaQuestao } from "@/conteudo";
import { useApp } from "./app";
import { dia, placarDe } from "./jogo";
import { supabase } from "./supabase";
import type { Placar, PlacarMateria } from "./tipos";

/** Placar de todo mundo, com a linha de quem está logado sempre em primeiro. `placares` é `null` enquanto carrega. */
export function useRanking(): { eu: Placar; placares: Placar[] | null; erro: boolean } {
  const { usuario, progresso, modoLocal } = useApp();
  const [remotos, setRemotos] = useState<Placar[] | null>(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    let ativo = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      const resposta = await fetch(`/api/ranking?hoje=${dia()}`, {
        headers: { Authorization: `Bearer ${data.session?.access_token ?? ""}` },
      }).catch(() => null);
      const corpo = resposta?.ok ? await resposta.json().catch(() => null) : null;
      if (!ativo) return;
      if (corpo?.placares) setRemotos(corpo.placares);
      else setErro(true);
    })();
    return () => {
      ativo = false;
    };
  }, []);

  // A própria linha sai sempre do progresso em memória: o que acabou de ser feito já aparece.
  const eu = placarDe(usuario!.id, usuario!.nome, progresso, materiaDaQuestao);
  const placares = modoLocal ? [eu] : remotos && [eu, ...remotos.filter((p) => p.id !== eu.id)];
  return { eu, placares, erro };
}

const SEM_NADA: PlacarMateria = { xp: 0, xpSemana: 0, acertadas: 0, precisao: null };

/** Os números de uma pessoa em uma matéria; zerados se ela nunca a estudou. */
export const naMateria = (p: Placar, materia: string) => p.materias[materia] ?? SEM_NADA;

/** Posição (a partir de 1) no ranking de uma matéria, por XP. */
export const posicaoNaMateria = (eu: Placar, placares: Placar[], materia: string) =>
  placares.filter((p) => naMateria(p, materia).xp > naMateria(eu, materia).xp).length + 1;
