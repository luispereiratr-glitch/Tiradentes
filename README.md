# Caderno

Plataforma de estudos com trilha de questões, revisão espaçada e jogos. Há duas matérias, escolhidas no
cabeçalho: História (Brasil de Dutra a Jango e Guerra Fria, com ênfase na Guerra do Vietnã) e Física
(magnetismo). Cada matéria tem cores, textos, jogos e ranking próprios; nível e sequência são da pessoa.

## Rodar no computador

```bash
npm install
npm run dev
```

Abra http://localhost:3000. Sem configurar o banco, o app roda em **modo local**: basta digitar um nome,
e o progresso fica salvo só naquele navegador.

## Ligar as contas com senha (Supabase)

1. Crie um projeto em https://supabase.com.
2. No SQL Editor, rode o conteúdo de `supabase/schema.sql`.
3. Copie `.env.example` para `.env.local` e preencha as três chaves (Project Settings > API).
4. Reinicie o `npm run dev`.

O login usa só usuário e senha. Como não há e-mail, não existe "esqueci minha senha": para trocar a senha
de alguém, use Authentication > Users no painel do Supabase (o usuário aparece como `nome@estudos.invalid`).

## Publicar (Vercel)

Importe o repositório na Vercel e cadastre as mesmas três variáveis de ambiente do `.env.local`.

## Onde fica cada coisa

| Pasta | Conteúdo |
| --- | --- |
| `src/conteudo/historia/` | Temas, questões, fichas das figuras e linha do tempo |
| `src/conteudo/fisica/` | O mesmo para Física: temas, questões, fichas de conceitos, jogos e resumos |
| `src/conteudo/index.ts` | Registro das matérias (para adicionar outra, crie uma pasta nova e registre aqui) |
| `src/lib/disciplina.ts` | Matéria ativa (guardada no aparelho) |
| `src/lib/jogos.ts` | Todos os jogos que existem; cada matéria lista os seus em `jogos` |
| `src/lib/fisica.ts` | Gerador das contas e vetores usados nos jogos de Física |
| `src/app/globals.css` | Cores de cada matéria: o bloco `html[data-disciplina="…"]` troca a paleta |
| `src/lib/jogo.ts` | Regras de XP, sequência de dias, estrelas e revisão espaçada |
| `src/lib/app.tsx` | Login e progresso do usuário |
| `src/app/` | Telas: trilha, tema, lição, revisão, figuras, jogos, perfil, ranking |
| `supabase/schema.sql` | Tabelas e regras de acesso do banco |

## Como adicionar questões

Em `src/conteudo/historia/questoes-*.ts`, cada questão segue o formato:

```ts
d("dut-13", "medio", "Fuvest", "Enunciado…",
  ["alternativa correta", "errada", "errada", "errada"],
  "Explicação mostrada depois da resposta.",
  "Gancho de memória (opcional)"),
```

- A **primeira alternativa é sempre a correta**; a ordem é embaralhada na tela.
- Questão com desenho: ponha o PNG em `public/questoes/` e preencha o campo `figura` (arquivo, tamanho em pixels e descrição). Veja `src/conteudo/fisica/oficiais.ts`.
- O `id` precisa ser único e não deve mudar depois (o progresso dos alunos é guardado por ele).
- O terceiro campo é o **estilo** da banca. Questões tiradas de uma prova real devem receber também o campo
  `oficial` (ex.: `"Fuvest 2012"`), e só depois de conferidas na prova original.
# Tiradentes
