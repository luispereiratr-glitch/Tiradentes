"use client";

import { useEffect, useRef, useState } from "react";
import { Botao, Casca, Topo } from "@/components/Casca";
import { useApp } from "@/lib/app";
import { useDisciplina } from "@/lib/disciplina";
import { ALTURA, desenharCarta, LARGURA, montarCarta } from "@/lib/carta";
import { desempenhoPorTema } from "@/lib/diagnostico";
import { jogosDe } from "@/lib/jogos";
import { naMateria, posicaoNaMateria, useRanking } from "@/lib/ranking";

const NOME_DO_ARQUIVO = "meu-card-caderno.png";

function Carta() {
  const { progresso } = useApp();
  const disciplina = useDisciplina();
  const { eu, placares } = useRanking();
  const tela = useRef<HTMLCanvasElement>(null);
  const [pronta, setPronta] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  // Com menos de três pessoas na matéria a posição não diz nada; fica fora do card.
  const naDisputa = (placares ?? []).filter((p) => naMateria(p, disciplina.id).xp > 0);
  const posicao = naDisputa.length >= 3 && naMateria(eu, disciplina.id).xp > 0 ? posicaoNaMateria(eu, naDisputa, disciplina.id) : null;

  useEffect(() => {
    if (!tela.current) return;
    const pontosEmJogos = jogosDe(disciplina).reduce((s, j) => s + (progresso.recordes[j.recorde] ?? 0), 0);
    const carta = montarCarta(eu, disciplina.nome, desempenhoPorTema(progresso, disciplina), pontosEmJogos, posicao);
    let ativo = true;
    desenharCarta(tela.current, carta).then(() => {
      if (ativo) setPronta(true);
    });
    return () => {
      ativo = false;
    };
    // `eu` é recalculado a cada render a partir do progresso; redesenhar só quando os dados mudam.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progresso, posicao, disciplina]);

  const comoArquivo = () =>
    new Promise<File | null>((resolver) =>
      tela.current!.toBlob((blob) => resolver(blob && new File([blob], NOME_DO_ARQUIVO, { type: "image/png" })), "image/png"),
    );

  async function baixar() {
    const arquivo = await comoArquivo();
    if (!arquivo) return setAviso("Não foi possível gerar a imagem.");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(arquivo);
    link.download = NOME_DO_ARQUIVO;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }

  async function compartilhar() {
    const arquivo = await comoArquivo();
    if (!arquivo) return setAviso("Não foi possível gerar a imagem.");
    if (!navigator.canShare?.({ files: [arquivo] })) return baixar();
    // Fechar a janela de compartilhamento sem enviar não é erro.
    await navigator.share({ files: [arquivo], title: "Meu card no Caderno" }).catch(() => null);
  }

  return (
    <>
      <Topo titulo="Meu card" voltar="/perfil" />
      <p className="mb-4 leading-relaxed text-tinta-2">
        Seu card muda conforme você estuda: os golpes vêm dos temas em que você mais acerta, e a fraqueza, de onde mais erra.
      </p>

      <canvas
        ref={tela}
        width={LARGURA}
        height={ALTURA}
        role="img"
        aria-label="Card de jogador com nome, XP, golpes e fraqueza"
        className={`mx-auto mb-5 w-full max-w-sm rounded-[5.5%] shadow-[0_10px_30px_rgba(31,42,36,0.18)] transition-opacity ${pronta ? "opacity-100" : "opacity-0"}`}
      />

      <div className="space-y-3">
        <Botao onClick={compartilhar} disabled={!pronta}>
          Compartilhar
        </Botao>
        <Botao variante="suave" onClick={baixar} disabled={!pronta}>
          Baixar PNG
        </Botao>
        {aviso && (
          <p role="alert" className="rounded-2xl bg-erro-claro p-3 text-sm text-erro">
            {aviso}
          </p>
        )}
      </div>
    </>
  );
}

export default function PaginaCarta() {
  return (
    <Casca>
      <Carta />
    </Casca>
  );
}
