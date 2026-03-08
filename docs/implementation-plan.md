# Plano de Implementação

## Visão Geral
- Stack: Next.js 14 (App Router) + Tailwind CSS + Supabase (Auth, Database, Storage) + TypeScript.
- Objetivo: Portfólio moderno com feed público, páginas detalhadas de posts, comentários autenticados e painel `/admin` para gerenciar perfil, posts e comentários.

## Modelagem de Dados (Supabase)
- `profiles`: id (uuid), name, role, bio, avatar_url, cover_url, socials (jsonb), stacks (jsonb), updated_at.
- `posts`: id (uuid), author_id, slug, title, subtitle, content (markdown), hero_image_url, gallery (jsonb), external_link, rating (int), tags (array), status (draft/published), published_at, updated_at.
- `comments`: id, post_id, author_id, content, status (pending/approved/rejected), created_at.
- `post_tags`: post_id, tag (text) – opcional se não usar array.

## Principais Funcionalidades
1. **Público**
   - Home: cards com destaque, filtros por tag, rating.
   - Página de post (`/post/[slug]`): conteúdo completo, galeria, link externo, rating.
   - Comentários: listagem + formulário autenticado.
   - Perfil/resumo + redes sociais + footer com ícones de stack.
2. **Admin (`/admin`)**
   - Autenticação Supabase (GitHub ou magic link).
   - Dashboard com abas: Perfil, Posts, Comentários.
   - Perfil: editar dados pessoais, redes e stacks.
   - Posts: CRUD completo (hero image + galeria via Supabase Storage, tags, status, rating).
   - Comentários: aprovar/rejeitar, listar por post, filtros.

## Backlog de Implementação
1. **Configuração inicial**
   - Variáveis de ambiente (`.env.example`).
   - Client/server Supabase (`lib/supabase/client.ts`, `server.ts`).
   - Utilitários (helper de classes, formatter, tipos compartilhados).
2. **UI Base**
   - Temas/cores no Tailwind, fontes personalizadas.
   - Componentes atômicos (botões, inputs, cards, badges, rating, avatar).
3. **Domínio Público**
   - Layout principal, hero, feed (SSR com Supabase).
   - Página de post com server actions para comentários.
4. **Autenticação + Admin**
   - Middleware protegendo `/admin`.
   - Layout do painel, navegação lateral, formulários com React Hook Form + Zod.
   - CRUD posts (listar, criar, editar, deletar) usando server actions.
5. **Comentários & Auditoria**
   - Serviços para aprovar/recusar, paginação.
   - Notificações opcionais (TODO/placeholder).
6. **Polimento & Deploy**
   - Testes básicos (unit + e2e opcional com Playwright).
   - README detalhado com instruções e fluxos.
   - Scripts de seed/migração SQL inicial.

Este plano serve como guia; itens podem ser ajustados conforme decisões futuras.
