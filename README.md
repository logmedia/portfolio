## Visão Geral

Portfólio moderno desenvolvido em **Next.js 14 (App Router)** com **Chakra UI**, Tailwind utilitário, animações por Framer Motion e backend **Supabase** para autenticação, banco e storage. Oferece:

- Página pública com hero interativo, cards de estudos de caso, rating, tags e rodapé com stacks.
- Página individual `/post/[slug]` com conteúdo em Markdown, galeria e formulário de comentários autenticados.
- Painel `/admin` com abas para editar perfil, cadastrar/editar posts e auditar comentários.

Consulte o plano completo em [docs/implementation-plan.md](docs/implementation-plan.md).

## Stack Principal

- Next.js 14 · React 19 · TypeScript
- Chakra UI + Tailwind utilitário + Framer Motion
- Supabase (Auth, PostgreSQL, Storage)
- Zod + Server Actions para validações
- React Hook Form (integração futura) e Chakra Forms no painel admin

## Pré-requisitos

- Node.js 20.14.x (recomendado 20.19+ para evitar avisos do ESLint)
- npm 10+
- Conta Supabase e projeto configurado

## Configuração

1. **Instale dependências**

```bash
npm install
```

2. **Variáveis de ambiente**

Crie `.env.local` baseado em [.env.example](.env.example):

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_JWT_SECRET=...
```

3. **Banco de dados**

Execute o script inicial em seu projeto Supabase:

```sql
\i supabase/migrations/0001_init.sql
```

4. **Servidor de desenvolvimento**

```bash
npm run dev
# http://localhost:3000
```

## Scripts

| Comando        | Descrição                              |
| -------------- | --------------------------------------- |
| `npm run dev`  | Inicia o Next.js em modo desenvolvimento |
| `npm run build`| Gera build de produção                  |
| `npm run start`| Serve o build otimizado                 |
| `npm run lint` | Executa ESLint no projeto               |

## Estrutura Relevante

- `src/app/page.tsx` · Home consumindo Supabase + Chakra
- `src/app/post/[slug]/page.tsx` · Página detalhada com comentários
- `src/app/admin/page.tsx` · Painel multi-abas protegido futuramente
- `src/app/actions.ts` · Server Actions (comentários, perfil, posts)
- `src/lib/supabase/*` · Cliente, tipos e consultas com fallbacks locais
- `src/components/home/*` e `src/components/admin/*` · Camadas de UI client-side
- `supabase/migrations/` · Esquema do banco inicial

## Fluxo do Painel

1. **Perfil**: atualiza nome, cargo, bio, avatar, capa, redes e stacks. Formato de redes: `Label|https://url` por linha.
2. **Posts**: CRUD básico com hero, galeria (uma URL por linha), tags, rating, status e conteúdo em Markdown.
3. **Comentários**: lista itens recentes e prepara terreno para ações de aprovação/rejeição.

As ações usam Supabase; se as chaves não estiverem configuradas, uma mensagem amigável é exibida.

## Deploy na Vercel

1. Configure variáveis de ambiente no painel da Vercel (mesmas do `.env`).
2. Habilite `NODE_VERSION=20`.
3. Opcional: use o Supabase Integration para sincronizar secrets automaticamente.

## Próximos Passos

- Proteger `/admin` com Supabase Auth (middleware) e magic link/GitHub.
- Implementar aprovação/rejeição de comentários (server actions adicionais).
- Adicionar uploads da galeria via Supabase Storage diretamente do painel.
- Automatizar geração de sitemap/feeds e testes E2E.
