export type SocialLink = {
  label: string;
  url: string;
};

export type StackIcon = {
  name: string;
  url: string;
};

export type Profile = {
  id: string;
  name: string;
  role?: string;
  bio?: string;
  avatar_url?: string;
  cover_url?: string;
  socials?: SocialLink[];
  stacks?: string[];
  skills?: any[];
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  content?: string;
  hero_image_url?: string;
  gallery?: string[];
  tags?: string[];
  external_link?: string;
  rating?: number | null;
  performance?: number;
  difficulty?: number;
  status?: "draft" | "published";
  published_at?: string | null;
};

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
