---
name: Maintenance_Standard
description: Guidelines for code maintenance, Git practices, and Changelog updates.
---

# Projeto Logmedia Portfolio - Padrões de Manutenção

Este documento define os procedimentos obrigatórios que o agente deve seguir após completar qualquer implementação ou correção.

## 1. Atualização do Changelog
Sempre que houver uma correção de bug (`fix`), nova funcionalidade (`feat`) ou ajuste de infraestrutura (`chore`), as notas de atualização devem ser atualizadas.

- **Arquivo**: `src/lib/constants/changelog.ts`
- **Procedimento**:
    1. Incremente a versão (ex: de `v1.2.1` para `v1.2.2`).
    2. Adicione um novo objeto ao topo do array `CHANGELOG_DATA`.
    3. Use tipos claros: `feat` (Verde), `fix` (Vermelho) ou `chore` (Azul).
    4. Mantenha as descrições em Português (PT-BR).

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
