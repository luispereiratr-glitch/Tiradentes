# Plataforma de Estudos – Plano

## Stack
- **Frontend:** Next.js (App Router) + TypeScript + Tailwind, mobile-first, PWA (instala na tela inicial do celular)
- **Backend/Banco:** Supabase (Postgres + RLS). Hospedagem: Vercel (grátis)
- **Login sem e-mail:** usuário + senha. Internamente vira `usuario@estudos.local` no Supabase Auth
  (senha com hash, sessão segura, RLS isolando o progresso de cada pessoa). Sem recuperação de senha por e-mail;
  reset feito manualmente por você (admin).
- **Sem tutor de IA** (decisão de custo): cada questão traz explicação detalhada e gancho de memória.

## Multi-matéria (futuro)
Tudo é organizado por `disciplina > tema > questão`. Trocar de História para outra área = só inserir dados novos.

## Conteúdo inicial (História)
Temas:
1. Era Dutra (política externa, Constituição de 1946, autoritarismo, anticomunismo)
2. Varguismo x oposição (UDN), nacionalistas x entreguistas, populismo
3. Governo JK
4. Jânio, renúncia e Campanha da Legalidade
5. Governo Jango e golpe de 1964
6. Guerra Fria: mundo bipolar, Plano Marshall, OTAN/Pacto de Varsóvia, coexistência pacífica
7. **Guerra do Vietnã em detalhe** (Dien Bien Phu, Genebra, Tonkin, Tet, My Lai, Vietnamização, Paris, queda de Saigon, protestos)
8. Descolonização da África e Ásia
9. Maio de 1968
10. **Personagens** (Ho Chi Minh, Kruschev, Allende, Pinochet, Gandhi, Mandela, Mao, Rosa Parks, MLK, Malcolm X)

Personagens: fichas com "como lembrar" (gancho mnemônico, frase-chave, associação visual) + jogo de ligar pessoa↔fato.

## Questões
- Níveis: fácil / médio / difícil
- Formatos: múltipla escolha, V/F, associação, ordenar cronologia, "quem sou eu"
- Estilo: bancas ITA, Fuvest, IME, Unicamp, ENEM. **Atenção:** questões são *escritas no estilo* da banca,
  com campo `banca_estilo`. Só ganham o campo `fonte_oficial` (ano/prova) quando conferidas numa prova real.
  Nada de inventar "ITA 2015" falso.
- Cada questão: enunciado, alternativas, gabarito, explicação, tema, nível, tags.

## Gamificação
- XP, níveis, **streak diário**, vidas, baús de recompensa
- Modos: Trilha (tipo Duolingo), Quiz relâmpago cronometrado, Duelo de revisão (erros voltam), Cronologia (arrastar eventos),
  Quem sou eu, Memória (cartas), Boss final por tema
- Revisão espaçada (erradas voltam no momento certo)
- Conquistas e ranking opcional
- Feedback com som/vibração/animação sutil

## Visual
Limpo, sem cara de "template de IA": nada de gradiente roxo, emojis em excesso ou cards genéricos.
Direção: papel/creme quente + verde-musgo profundo como cor de foco (calmo, dá vontade de estudar) + um acento terracota para conquistas.
Tipografia com serifa elegante nos títulos + sans legível no corpo.

## Fases
1. Base: projeto, design system, login, schema Supabase
2. Quiz + banco de questões de História (primeiros ~150) + progresso
3. Gamificação + jogos
4. Questões oficiais das bancas, conferidas nos PDFs das provas
5. Fichas de personagens, PWA, deploy
6. Expansão do banco de questões (contínua)
