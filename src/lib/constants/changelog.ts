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
