export type ChangelogEntry = {
  version: string;
  date: string;
  title: string;
  changes: {
    type: "feat" | "fix" | "chore";
    description: string;
  }[];
};

export const CHANGELOG_DATA: ChangelogEntry[] = [
  {
    version: "v1.2.1",
    date: "12 de Março, 2026",
    title: "Estabilidade do Editor & Refinamento de Design",
    changes: [
      { type: "fix", description: "Corrigida importação do BubbleMenu para compatibilidade total com Turbopack (Vercel Build)." },
      { type: "fix", description: "Corrigido erro de salvamento de projetos causado por conflitos de extensões no ModernEditor." },
      { type: "fix", description: "Resolvido loop de renderização infinita no editor HTML ao sincronizar conteúdo." },
      { type: "fix", description: "Ajustada posição do ícone de alterar capa no mockup de perfil para evitar sobreposição." },
      { type: "fix", description: "Sincronização global da transparência Glassmorphism para 5% atendendo às novas diretrizes de design." },
      { type: "chore", description: "Implementação de logs de diagnóstico detalhados para ações administrativas (Posts & Perfil)." },
      { type: "feat", description: "Criada Skill de Manutenção para garantir padronização de Changelog e Git." },
    ],
  },
  {
    version: "v1.2.0",
    date: "12 de Março, 2026",
    title: "Galeria Moderna, Integração WhatsApp & UX Social",
    changes: [
      { type: "feat", description: "Nova Galeria de Projetos com slider horizontal moderno, efeito 'peek' mobile e animação de zoom." },
      { type: "feat", description: "Integração inteligente de WhatsApp com controle de privacidade no painel administrativo." },
      { type: "feat", description: "Editor de Redes Sociais reformulado com preenchimento automático de URLs base (Input de Usuário)." },
      { type: "feat", description: "Barra de salvamento flutuante adicionada à aba Perfil para maior agilidade na edição." },
      { type: "fix", description: "Tratamento de Erro 500 na integração de login de novos usuários via GitHub corrigido." },
    ],
  },
  {
    version: "v1.1.0",
    date: "11 de Março, 2026",
    title: "Skills Dinâmicas & Gerenciador Interativo",
    changes: [
      { type: "feat", description: "Novo gerenciador visual interativo de habilidades no painel administrativo." },
      { type: "feat", description: "Stacks e Tecnologias do perfil agora são geradas automaticamente baseadas nos projetos publicados." },
      { type: "feat", description: "Adicionado histórico de atualizações (Changelog) no rodapé do site." },
      { type: "fix", description: "Problema resolvido com o carregamento em cache dos perfis de usuários recém-criados." },
    ],
  },
  {
    version: "v1.0.0",
    date: "10 de Março, 2026",
    title: "Lançamento Inicial",
    changes: [
      { type: "feat", description: "Lançamento da plataforma base com portfólio dinâmico." },
      { type: "feat", description: "Sistema de postagem de projetos com editor avançado e suporte a Supabase." },
      { type: "feat", description: "Configuração do tema moderno usando Chakra UI e Glassmorphism." },
    ],
  },
];

export const CURRENT_VERSION = CHANGELOG_DATA[0].version;
