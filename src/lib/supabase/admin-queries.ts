import { createSupabaseServerClient } from "./server";
import type { Post, Profile } from "@/types/content";

/**
 * Busca o perfil do administrador logado (Server-side)
 */
export async function fetchAdminProfile(userId?: string): Promise<Profile | null> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    const targetUserId = userId || user?.id;
    if (!targetUserId) return null;

    const { data, error } = await (supabase.from("profiles") as any)
      .select("*")
      .eq("id", targetUserId)
      .single();

    if (error || !data) return null;
    
    const profileData = data as any;
    return {
      id: profileData.id,
      name: profileData.name,
      role: profileData.role ?? undefined,
      bio: profileData.bio ?? undefined,
      avatar_url: profileData.avatar_url ?? undefined,
      cover_url: profileData.cover_url ?? undefined,
      socials: profileData.socials ?? [],
      stacks: profileData.stacks ?? [],
      skills: profileData.skills ?? [],
      github_username: profileData.github_username ?? undefined,
    } as Profile;
  } catch (error) {
    console.error("fetchAdminProfile ERROR:", error);
    return null;
  }
}

/**
 * Versão do fetchPosts para ser usada no lado do servidor com autenticação e filtro de autor
 */
export async function fetchAdminPosts(userId: string): Promise<Post[]> {
  try {
    const supabase = await createSupabaseServerClient();
    
    const { data, error } = await (supabase.from("posts") as any)
      .select(`
        *,
        stacks:post_stacks(
          stack:stacks(*)
        )
      `)
      .eq("author_id", userId)
      .order("created_at", { ascending: false });

    if (error || !data) {
      console.warn("Could not fetch admin posts", error);
      return [];
    }

    return data.map((post: any) => ({
      ...post,
      stacks: post.stacks?.map((ps: any) => ps.stack).filter(Boolean) || []
    })) as Post[];
  } catch (error) {
    console.error("fetchAdminPosts ERROR:", error);
    return [];
  }
}

/**
 * Busca todos os usuários (apenas para Admins)
 */
export async function fetchAdminUsers(): Promise<Profile[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await (supabase.from("profiles") as any)
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data as Profile[];
  } catch (error) {
    console.error("fetchAdminUsers ERROR:", error);
    return [];
  }
}

/**
 * Busca atividades recentes do usuário
 */
export async function fetchRecentActivities(limit = 10): Promise<any[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("activity_log")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data) {
      console.warn("Could not fetch recent activities", error);
      return [];
    }

    return data;
  } catch (error) {
    console.error("fetchRecentActivities ERROR:", error);
    return [];
  }
}
