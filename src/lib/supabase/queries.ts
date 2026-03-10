import { createClient } from "@supabase/supabase-js";
import type { Comment, Post, Profile } from "@/types/content";
import type { Database } from "./types";

const createPublicClient = () => {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

const fallbackProfile: Profile = {
  id: "11111111-1111-1111-1111-111111111111",
  name: "José Renato",
  role: "Web Developer",
  bio: "Crio experiências web modernas focadas em performance e design.",
  avatar_url: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=400&h=400&fit=crop",
  cover_url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&fit=crop",
  socials: [
    { label: "GitHub", url: "https://github.com" },
    { label: "LinkedIn", url: "https://linkedin.com" },
  ],
  stacks: ["Next.js", "React", "Tailwind", "Supabase", "PostgreSQL"],
};

const fallbackPosts: Post[] = [
  {
    id: "post-1",
    slug: "design-system-nova-era",
    title: "Design System para a nova era",
    subtitle: "Como construí um DS modular para múltiplos produtos.",
    content:
      "## Contexto\n\nConstruí um design system escalável utilizando tokens e automações.",
    hero_image_url: "/placeholder/post-1.jpg",
    tags: ["design", "tokens"],
    external_link: "https://github.com",
    rating: 5,
    status: "published",
  },
  {
    id: "post-2",
    slug: "supabase-realtime-comentarios",
    title: "Comentários em tempo real com Supabase",
    subtitle: "Fluxo completo de moderação e aprovação.",
    content:
      "## Realtime\n\nUtilizei Supabase Realtime para entregar comentários instantâneos ao admin.",
    hero_image_url: "/placeholder/post-2.jpg",
    tags: ["supabase", "realtime"],
    rating: 4,
    status: "published",
  },
];

const fallbackComments: Comment[] = [
  {
    id: "comment-1",
    post_id: "post-1",
    author_id: "local-profile",
    content: "Projeto incrível! Curti ver o uso de animations e Supabase.",
    status: "approved",
    created_at: new Date().toISOString(),
    author: {
      name: "Visitante",
      avatar_url: "https://avatars.githubusercontent.com/u/1?v=4",
    },
  },
  {
    id: "comment-2",
    post_id: "post-2",
    author_id: "local-profile",
    content: "Curti o painel admin!",
    status: "approved",
    created_at: new Date().toISOString(),
    author: {
      name: "Dev Front",
      avatar_url: "https://avatars.githubusercontent.com/u/2?v=4",
    },
  },
];

export async function fetchProfile(): Promise<Profile> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from("profiles").select("*").single();

    if (error || !data) {
      return fallbackProfile;
    }

    const profileData = data as any;

    return {
      id: profileData.id,
      name: profileData.name,
      role: profileData.role ?? undefined,
      bio: profileData.bio ?? undefined,
      avatar_url: profileData.avatar_url ?? undefined,
      cover_url: profileData.cover_url ?? undefined,
      socials: (profileData.socials as Profile["socials"]) ?? [],
      stacks: (profileData.stacks as string[]) ?? [],
      skills: (profileData.skills as any[]) ?? [],
    };
  } catch (error) {
    console.error("fetchProfile ERROR:", error);
    return fallbackProfile;
  }
}

export async function fetchPosts(): Promise<Post[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return fallbackPosts;
    }

    return data as Post[];
  } catch (error) {
    console.error("fetchPosts ERROR:", error);
    return fallbackPosts;
  }
}

export async function fetchPostBySlug(slug: string): Promise<Post | null> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      return fallbackPosts.find((post) => post.slug === slug) ?? null;
    }

    return data as Post;
  } catch (error) {
    console.error("fetchPostBySlug", error);
    return fallbackPosts.find((post) => post.slug === slug) ?? null;
  }
}

export async function fetchAllPostSlugs(): Promise<string[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("posts")
      .select("slug")
      .eq("status", "published");

    if (error || !data) {
      return fallbackPosts.map((post) => post.slug);
    }
    
    return data.map((post: any) => post.slug);
  } catch (error) {
    console.error("fetchAllPostSlugs", error);
    return fallbackPosts.map((post) => post.slug);
  }
}

export async function fetchComments(postId: string): Promise<Comment[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return fallbackComments.filter((comment) => comment.post_id === postId);
    }

    return data as Comment[];
  } catch (error) {
    console.error("fetchComments", error);
    return fallbackComments.filter((comment) => comment.post_id === postId);
  }
}

export async function fetchRecentComments(limit = 20): Promise<Comment[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data || data.length === 0) {
      return fallbackComments.slice(0, limit);
    }

    return data as Comment[];
  } catch (error) {
    console.error("fetchRecentComments", error);
    return fallbackComments.slice(0, limit);
  }
}
