import { createClient } from "@supabase/supabase-js";
import { dia, placarDe } from "@/lib/jogo";
import type { Progresso } from "@/lib/tipos";

/**
 * Monta o ranking a partir do progresso de todo mundo. O progresso é privado (RLS),
 * então a leitura é feita aqui com a chave de serviço e só o resumo sai para o navegador.
 */
export async function GET(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const chaveServico = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !chaveServico) {
    return Response.json({ erro: "Ranking indisponível: servidor sem configuração." }, { status: 503 });
  }

  const admin = createClient(url, chaveServico, { auth: { persistSession: false } });
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const { data: sessao } = token ? await admin.auth.getUser(token) : { data: null };
  if (!sessao?.user) return Response.json({ erro: "Entre na sua conta para ver o ranking." }, { status: 401 });

  // O dia vem do aparelho de quem pede: o servidor roda em outro fuso e erraria a virada da semana.
  const pedido = new URL(request.url).searchParams.get("hoje") ?? "";
  const hoje = /^\d{4}-\d{2}-\d{2}$/.test(pedido) ? pedido : dia();

  const [perfis, progressos] = await Promise.all([
    admin.from("perfis").select("id, usuario, xp"),
    admin.from("progresso").select("user_id, dados"),
  ]);
  if (perfis.error || progressos.error) {
    return Response.json({ erro: "Não foi possível carregar o ranking." }, { status: 500 });
  }

  const dadosDe = new Map(progressos.data.map((linha) => [linha.user_id as string, linha.dados as Partial<Progresso>]));
  const placares = perfis.data.map((perfil) =>
    placarDe(perfil.id, perfil.usuario, dadosDe.get(perfil.id) ?? { xp: perfil.xp }, hoje),
  );
  return Response.json({ placares });
}
