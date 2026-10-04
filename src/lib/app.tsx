"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { registrarResposta, sequenciaAtiva, somarXp, VAZIO } from "./jogo";
import { emailDe, normalizarUsuario, supabase, validarCadastro } from "./supabase";
import type { Progresso, Questao } from "./tipos";

type Usuario = { id: string; nome: string };

type App = {
  /** Sessão verificada (ainda pode não haver usuário). */
  pronto: boolean;
  usuario: Usuario | null;
  /** Progresso do usuário já carregado. */
  carregado: boolean;
  progresso: Progresso;
  modoLocal: boolean;
  entrar: (usuario: string, senha: string) => Promise<string | null>;
  cadastrar: (usuario: string, senha: string) => Promise<string | null>;
  sair: () => Promise<void>;
  responder: (q: Questao, acertou: boolean) => void;
  ganharXp: (xp: number) => void;
  concluirLicao: (chave: string, estrelas: number) => void;
  registrarRecorde: (jogo: string, pontos: number) => void;
};

const Contexto = createContext<App | null>(null);
const CHAVE_USUARIO_LOCAL = "estudos:usuario-local";
const chaveProgresso = (id: string) => `estudos:progresso:${id}`;

function lerLocal(id: string): Partial<Progresso> | null {
  try {
    const bruto = localStorage.getItem(chaveProgresso(id));
    return bruto ? JSON.parse(bruto) : null;
  } catch {
    return null;
  }
}

function deSessao(sessao: Session | null): Usuario | null {
  if (!sessao) return null;
  const nome = sessao.user.user_metadata?.usuario ?? sessao.user.email?.split("@")[0] ?? "aluno";
  return { id: sessao.user.id, nome };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [pronto, setPronto] = useState(false);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  // Id do usuário cujo progresso está em memória.
  const [carregadoPara, setCarregadoPara] = useState<string | null>(null);
  const [progresso, setProgresso] = useState<Progresso>(VAZIO);
  const carregado = usuario !== null && carregadoPara === usuario.id;
  const envio = useRef<ReturnType<typeof setTimeout> | null>(null);

  // O Supabase renova o token de tempos em tempos; só troca o usuário se o id mudar.
  const definirUsuario = useCallback((novo: Usuario | null) => {
    setUsuario((atual) => (atual?.id === novo?.id ? atual : novo));
  }, []);

  useEffect(() => {
    if (!supabase) {
      const nome = localStorage.getItem(CHAVE_USUARIO_LOCAL);
      // localStorage só existe no navegador, então a leitura precisa acontecer depois da montagem.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      definirUsuario(nome ? { id: `local-${nome}`, nome } : null);
      setPronto(true);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      definirUsuario(deSessao(data.session));
      setPronto(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_evento, sessao) => definirUsuario(deSessao(sessao)));
    return () => data.subscription.unsubscribe();
  }, [definirUsuario]);

  useEffect(() => {
    if (!usuario) return;
    let ativo = true;
    (async () => {
      let dados = lerLocal(usuario.id);
      if (supabase) {
        const { data } = await supabase.from("progresso").select("dados").eq("user_id", usuario.id).maybeSingle();
        const remoto = data?.dados as Partial<Progresso> | undefined;
        // Fica com o mais avançado: cobre o caso de ter estudado sem internet.
        if (remoto && (remoto.xp ?? 0) >= (dados?.xp ?? 0)) dados = remoto;
      }
      if (!ativo) return;
      setProgresso({ ...VAZIO, ...dados });
      setCarregadoPara(usuario.id);
    })();
    return () => {
      ativo = false;
    };
  }, [usuario]);

  useEffect(() => {
    if (!usuario || !carregado) return;
    localStorage.setItem(chaveProgresso(usuario.id), JSON.stringify(progresso));
    if (!supabase) return;
    const cliente = supabase;
    if (envio.current) clearTimeout(envio.current);
    envio.current = setTimeout(async () => {
      const agora = new Date().toISOString();
      await cliente.from("progresso").upsert({ user_id: usuario.id, dados: progresso, atualizado_em: agora });
      await cliente
        .from("perfis")
        .update({ xp: progresso.xp, sequencia: sequenciaAtiva(progresso), atualizado_em: agora })
        .eq("id", usuario.id);
    }, 800);
  }, [progresso, usuario, carregado]);

  const entrar = useCallback(
    async (nomeBruto: string, senha: string) => {
      const nome = normalizarUsuario(nomeBruto);
      if (!supabase) {
        if (nome.length < 2) return "Digite um nome com pelo menos 2 letras.";
        localStorage.setItem(CHAVE_USUARIO_LOCAL, nome);
        definirUsuario({ id: `local-${nome}`, nome });
        return null;
      }
      const { error } = await supabase.auth.signInWithPassword({ email: emailDe(nome), password: senha });
      return error ? "Usuário ou senha incorretos." : null;
    },
    [definirUsuario],
  );

  const cadastrar = useCallback(
    async (nomeBruto: string, senha: string) => {
      if (!supabase) return entrar(nomeBruto, senha);
      const nome = normalizarUsuario(nomeBruto);
      const invalido = validarCadastro(nome, senha);
      if (invalido) return invalido;
      const resposta = await fetch("/api/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario: nome, senha }),
      }).catch(() => null);
      if (!resposta) return "Sem conexão. Tente de novo.";
      if (!resposta.ok) return (await resposta.json().catch(() => null))?.erro ?? "Não foi possível criar a conta.";
      return entrar(nome, senha);
    },
    [entrar],
  );

  const sair = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
    else localStorage.removeItem(CHAVE_USUARIO_LOCAL);
    definirUsuario(null);
  }, [definirUsuario]);

  const responder = useCallback((q: Questao, acertou: boolean) => {
    setProgresso((p) => registrarResposta(p, q, acertou));
  }, []);

  const ganharXp = useCallback((xp: number) => setProgresso((p) => somarXp(p, xp)), []);

  const concluirLicao = useCallback((chave: string, estrelas: number) => {
    setProgresso((p) =>
      estrelas > (p.licoes[chave] ?? 0) ? { ...p, licoes: { ...p.licoes, [chave]: estrelas } } : p,
    );
  }, []);

  const registrarRecorde = useCallback((jogo: string, pontos: number) => {
    setProgresso((p) =>
      pontos > (p.recordes[jogo] ?? 0) ? { ...p, recordes: { ...p.recordes, [jogo]: pontos } } : p,
    );
  }, []);

  const valor = useMemo<App>(
    () => ({
      pronto,
      usuario,
      carregado,
      progresso,
      modoLocal: !supabase,
      entrar,
      cadastrar,
      sair,
      responder,
      ganharXp,
      concluirLicao,
      registrarRecorde,
    }),
    [pronto, usuario, carregado, progresso, entrar, cadastrar, sair, responder, ganharXp, concluirLicao, registrarRecorde],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useApp(): App {
  const app = useContext(Contexto);
  if (!app) throw new Error("useApp precisa estar dentro de <AppProvider>");
  return app;
}
