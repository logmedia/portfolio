---
name: Maintenance_Standard
description: Guidelines for code maintenance, Git practices, and Changelog updates.
---

# Projeto Logmedia Portfolio - Padrões de Manutenção

Este documento define os procedimentos obrigatórios que o agente deve seguir após completar qualquer implementação ou correção.

## 1. Atualização do Changelog (Foco no Essencial)
O Changelog deve refletir apenas mudanças que tragam benefícios diretos ou visíveis para o usuário. Evite poluir a lista com erros de build, logs internos ou ajustes técnicos triviais que não impactam quem usa o site.

- **Arquivo**: `src/lib/constants/changelog.ts`
- **Critérios de Inclusão**:
    - **Impacto**: A mudança resolve um bug funcional ou melhora a interface?
    - **Concisão**: Agrupe ajustes técnicos sob descrições simples (ex: "Melhorias de Estabilidade").
    - **Frequência**: Não atualize para cada commit. Junte um pacote de melhorias reais antes de subir uma versão.
- **Procedimento**:
    1. Incremente a versão apenas em atualizações significativas.
    2. Adicione um novo objeto ao topo do array `CHANGELOG_DATA`.
    3. Use tipos claros: `feat` ou `fix`. Evite `chore` no changelog público, a menos que seja algo estrutural.
    4. Mantenha as descrições focadas no benefício final, em Português (PT-BR).

## 2. Padrões de Git
Após o término do trabalho e atualização do changelog, o Git deve ser sincronizado.

- **Mensagens de Commit**: Siga o padrão *Conventional Commits*.
    - `feat: ...` para novas funcionalidades.
    - `fix: ...` para correções de bugs.
    - `refactor: ...` para mudanças de código que não corrigem nem adicionam features.
    - `chore: ...` para atualizações de dependências ou build.
- **Push**: Sempre realize o `push` para a branch principal (`main`) após o commit.

## 3. Verificação de Tokens de Design
Antes de finalizar, verifique se nenhum componente introduziu cores ou opacidades *hardcoded* que fujam do `DESIGN_SYSTEM.md`.
- **Glassmorphism**: O padrão atual é `whiteAlpha.50` (5%) para fundos.
- **Accent Color**: `brand.500` (#22b99d).

## 4. Prioridade Mobile-First
Toda alteração de layout (Grid, Flex, etc.) deve ser testada para responsividade.
- **Grids**: Use objetos de breakpoint (ex: `{{ base: "1fr", md: "1fr 1fr" }}`) para garantir que o layout empilhe corretamente em telas menores.
- **Imagens e Mockups**: Garanta que elementos fixos no desktop não quebrem o layout ou causem scroll horizontal no mobile. Use `w="full"` ou `maxW` adequados.

