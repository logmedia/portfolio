<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->
- [x] Verify that the copilot-instructions.md file in the .github directory is created.
  - Arquivo recriado após scaffold em 08/03/2026.

- [x] Clarify Project Requirements
	<!-- Ask for project type, language, and frameworks if not specified. Skip if already provided. -->
	- Next.js 14 App Router + Tailwind + Supabase, com áreas pública e /admin, CRUD de posts, comentários e edição de perfil.

- [x] Scaffold the Project
	<!--
	Ensure that the previous step has been marked as completed.
	Call project setup tool with projectType parameter.
	Run scaffolding command to create project files and folders.
	Use '.' as the working directory.
	If no appropriate projectType is available, search documentation using available tools.
	Otherwise, create the project structure manually using available file creation tools.
	-->
	- Executado `npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm` em 08/03/2026.

- [x] Customize the Project
	<!--
	Verify that all previous steps have been completed successfully and you have marked the step as completed.
	Develop a plan to modify codebase according to user requirements.
	Apply modifications using appropriate tools and user-provided references.
	Skip this step for "Hello World" projects.
	-->
	- Plano registrado em docs/implementation-plan.md e implementação inicial (UI Chakra, rotas públicas e /admin, integrações Supabase) concluída.

- [x] Install Required Extensions
	<!-- ONLY install extensions provided mentioned in the get_project_setup_info. Skip this step otherwise and mark as completed. -->
	- Nenhuma extensão adicional necessária para este workspace.

- [x] Compile the Project
	<!--
	Verify that all previous steps have been completed.
	Install any missing dependencies.
	Run diagnostics and resolve any issues.
	Check for markdown files in project folder for relevant instructions on how to do this.
	-->
	- `npm run lint` executado em 08/03/2026 sem erros.

- [x] Create and Run Task
	<!--
	Verify that all previous steps have been completed.
	Check https://code.visualstudio.com/docs/debugtest/tasks to determine if the project needs a task. If so, use the create_and_run_task to create and launch a task based on package.json, README.md, and project structure.
	Skip this step otherwise.
	 -->
	- Não há tasks personalizadas necessárias além dos scripts npm (`dev`, `build`, `lint`).

- [x] Launch the Project
	<!--
	Verify that all previous steps have been completed.
	Prompt user for debug mode, launch only if confirmed.
	 -->
	- `npm run dev` iniciado em 08/03/2026 para pré-visualização local.

- [ ] Ensure Documentation is Complete
	<!--
	Verify that all previous steps have been completed.
	Verify that README.md and the copilot-instructions.md file in the .github directory exists and contains current project information.
	Clean up the copilot-instructions.md file in the .github directory by removing all HTML comments.
	 -->

<!--
## Execution Guidelines
PROGRESS TRACKING:
- If any tools are available to manage the above todo list, use it to track progress through this checklist.
- After completing each step, mark it complete and add a summary.
- Read current todo list status before starting each new step.

COMMUNICATION RULES:
- Avoid verbose explanations or printing full command outputs.
- If a step is skipped, state that briefly (e.g. "No extensions needed").
- Do not explain project structure unless asked.
- Keep explanations concise and focused.

DEVELOPMENT RULES:
- Use '.' as the working directory unless user specifies otherwise.
- Avoid adding media or external links unless explicitly requested.
- Use placeholders only with a note that they should be replaced.
- Ensure all generated components serve a clear purpose within o usuário.
- If a feature is assumed but not confirmada, peça esclarecimento antes de incluir.
- Se o projeto for uma extensão VS Code, use a VS Code API tool ao precisar de referência.

FOLDER CREATION RULES:
- Use sempre o diretório atual como raiz.
- Ao rodar comandos, use '.' quando necessário para garantir caminho correto.
- Não crie novas pastas além da .vscode quando não solicitado.
- Caso algum comando de scaffold exija pasta vazia, informe o usuário para ajustar e reabrir no VS Code.

EXTENSION INSTALLATION RULES:
- Instale apenas extensões fornecidas pelo get_project_setup_info. Nenhuma outra.

PROJECT CONTENT RULES:
- Sem detalhes → assuma "Hello World".
- Evite links/integrações extras não requisitadas.
- Não gere mídias (imagens, vídeos) sem pedido explícito.
- Se usar assets de placeholder, avise que devem ser trocados depois.
- Garanta que cada componente criado atenda ao fluxo solicitado.

TASK COMPLETION RULES:
- Tarefa completa quando:
  - Projeto scaffoldado e builda sem erros
  - Arquivo copilot-instructions.md existe e atualizado
  - README.md atualizado
  - Usuário recebe instruções claras para rodar/debugar

Antes de iniciar nova etapa, registre o progresso.
-->
- Trabalhe sequencialmente.
- Mantenha a comunicação objetiva.
- Siga boas práticas de desenvolvimento.
