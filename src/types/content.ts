export type SocialLink = {
  label: string;
  url: string;
};

export type Stack = {
  id: string;
  name: string;
  icon?: string;
  color?: string;
};

export type Profile = {
  id: string;
  name: string;
  role?: "admin" | "editor"; // Access control
  job_title?: string; // e.g. "Web Developer"
  bio?: string;
  avatar_url?: string;
  cover_url?: string;
  socials?: SocialLink[];
  stacks?: string[];
  skills?: any[];
  github_username?: string;
  whatsapp_number?: string;
  whatsapp_public?: boolean;
  status?: "active" | "blocked";
  created_at?: string;
};

export type GalleryItem = {
  url: string;
  caption?: string;
  order: number;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  content?: string;
  hero_image_url?: string;
  gallery?: GalleryItem[];
  tags?: string[]; // Mantemos por compatibilidade legada
  stacks?: Stack[]; // Nova relação real
  external_link?: string;
  rating?: number | null;
  performance?: number;
  difficulty?: number;
  status?: "draft" | "published" | "trash";
  published_at?: string | null;
};

export type Project = Post;

export type Comment = {
  id: string;
  post_id: string;
  author_id: string | null;
  content: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  author?: {
    name?: string;
    avatar_url?: string;
  };
};
