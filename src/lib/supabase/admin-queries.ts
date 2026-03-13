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
      job_title: profileData.job_title ?? undefined,
      role: profileData.role ?? undefined,
      bio: profileData.bio ?? undefined,
      avatar_url: profileData.avatar_url ?? undefined,
      cover_url: profileData.cover_url || "/covers/abstract-tech.png",
      socials: profileData.socials ?? [],
      stacks: profileData.stacks ?? [],
      skills: profileData.skills ?? [],
      github_username: profileData.github_username ?? undefined,
      whatsapp_number: profileData.whatsapp_number ?? undefined,
      whatsapp_public: profileData.whatsapp_public ?? false,
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

/**
 * Busca o resumo de estatísticas de visitas
 */
export async function fetchAnalyticsSummary() {
  try {
    const supabase = await createSupabaseServerClient();
    
    // Total de Visualizações
    const { count: totalViews } = await supabase
      .from("visit_logs")
      .select("*", { count: 'exact', head: true });

    // Visitantes Únicos (baseado em ip_hash)
    const { data: uniqueData } = await supabase
      .from("visit_logs")
      .select("ip_hash");
    
    const uniqueVisitors = new Set((uniqueData as any[])?.map(v => v.ip_hash)).size;

    // Visualizações nas últimas 24h
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count: recentViews } = await supabase
      .from("visit_logs")
      .select("*", { count: 'exact', head: true })
      .gte("created_at", twentyFourHoursAgo);

    // Top Páginas
    const { data: topPagesData } = await supabase
      .from("visit_logs")
      .select("path");
    
    const pathCounts: Record<string, number> = {};
    (topPagesData as any[])?.forEach(v => {
      pathCounts[v.path] = (pathCounts[v.path] || 0) + 1;
    });
    
    const topPages = Object.entries(pathCounts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalViews: totalViews || 0,
      uniqueVisitors,
      recentViews: recentViews || 0,
      topPages
    };
  } catch (error) {
    console.error("fetchAnalyticsSummary ERROR:", error);
    return {
      totalViews: 0,
      uniqueVisitors: 0,
      recentViews: 0,
      topPages: []
    };
  }
}
