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
    version: "v1.2.3",
    date: "12 de Março, 2026",
    title: "Correção de Filtros & Visibilidade",
    changes: [
      { type: "fix", description: "Corrigida a lógica de busca que ocultava talentos sem GitHub vinculado, permitindo que todas as tecnologias (Stacks) apareçam no filtro." },
      { type: "fix", description: "Melhorada a resiliência do mapeamento de tecnologias no diretório de talentos." },
    ],
  },
  {
    version: "v1.2.2",
    date: "12 de Março, 2026",
    title: "Harmonização de Design & Explore 2.0",
    changes: [
      { type: "feat", description: "Filtros de Stacks (Tecnologias) na página Explore agora totalmente funcionais com integração ao banco." },
      { type: "fix", description: "Redesenho das tags de Expertises com Glassmorphism de alto contraste para legibilidade absoluta." },
      { type: "fix", description: "Padronização global de opacidade (5%) em todos os cartões, garantindo harmonia visual premium." },
      { type: "fix", description: "Consolidação da fonte 'Space Grotesk' e remoção de variáveis de estilo legadas." },
    ],
  },
  {
    version: "v1.2.1",
    date: "12 de Março, 2026",
    title: "Estabilidade do Editor & Refinamento de Design",
    changes: [
      { type: "fix", description: "Otimizado layout de edição de perfil com visualização lateral (Side-by-Side) e mockup ampliado." },
      { type: "fix", description: "Melhorias de estabilidade no editor de projetos, corrigindo erros ao salvar e travamentos de interface." },
      { type: "fix", description: "Refinamento visual global com transparência suave (Glassmorphism) atendendo ao novo guia de design." },
      { type: "fix", description: "Ajustada posição dos controles de edição do perfil para maior visibilidade e fluidez." },
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
