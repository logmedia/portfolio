'use server';

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseCredentials } from "@/lib/env";

const commentSchema = z.object({
  postId: z.string().min(1),
  postSlug: z.string().min(1),
  content: z.string().min(4, "O comentário precisa ter pelo menos 4 caracteres."),
});

export async function createComment(formData: FormData) {
  const parsed = commentSchema.safeParse({
    postId: formData.get("postId"),
    postSlug: formData.get("postSlug"),
    content: formData.get("content"),
  });

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten() };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Você precisa estar autenticado." };
  }

  const { error } = await (supabase.from("comments") as any).insert({
    post_id: parsed.data.postId,
    content: parsed.data.content,
    author_id: user.id as any,
  } as any);

  if (error) {
    return { success: false, message: "Não foi possível enviar seu comentário." };
  }

  revalidatePath(`/post/${parsed.data.postSlug}`);
  return { success: true };
}

const socialsSchema = z.string().optional();
const stacksSchema = z.string().optional();

const profileSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3),
  role: z.string().optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().url().optional().or(z.literal("")),
  coverUrl: z.string().url().optional().or(z.literal("")),
  socials: socialsSchema,
  stacks: stacksSchema,
  skills: z.string().optional(),
  github_username: z.string().optional(),
});

const parseSocials = (input?: string) => {
  if (!input) return [];
  return input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, url] = line.split("|");
      return { label: label?.trim() ?? "Link", url: url?.trim() ?? "#" };
    });
};

const parseStacks = (input?: string) => {
  if (!input) return [];
  return input
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
};

const parseSkills = (input?: string) => {
  if (!input) return [];
  return input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, level, icon] = line.split("|");
      return { 
        name: name?.trim() ?? "Skill", 
        level: Number(level?.trim() ?? 0), 
        icon: icon?.trim() ?? "Code" 
      };
    });
};

export async function saveProfile(formData: FormData) {
  const parsed = profileSchema.safeParse({
    id: formData.get("id")?.toString(),
    name: formData.get("name")?.toString(),
    role: formData.get("role")?.toString(),
    bio: formData.get("bio")?.toString(),
    avatarUrl: formData.get("avatarUrl")?.toString(),
    coverUrl: formData.get("coverUrl")?.toString(),
    socials: formData.get("socials")?.toString(),
    stacks: formData.get("stacks")?.toString(),
    skills: formData.get("skills")?.toString(),
    github_username: formData.get("github_username")?.toString(),
  });

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten() };
  }

  if (!hasSupabaseCredentials()) {
    return { success: false, message: "Configure as chaves do Supabase no .env." };
  }

  const supabase = await createSupabaseServerClient();
  const payload = {
    id: parsed.data.id,
    name: parsed.data.name,
    role: parsed.data.role ?? null,
    bio: parsed.data.bio ?? null,
    avatar_url: parsed.data.avatarUrl || null,
    cover_url: parsed.data.coverUrl || null,
    socials: parseSocials(parsed.data.socials),
    stacks: parseStacks(parsed.data.stacks),
    skills: parseSkills(parsed.data.skills),
    github_username: parsed.data.github_username || null,
  };

  const { error } = await (supabase.from("profiles") as any).upsert(payload as any, { onConflict: "id" });

  if (error) {
    return { success: false, message: "Erro ao salvar perfil." };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

const postSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3),
  slug: z.string().min(3),
  subtitle: z.string().optional(),
  content: z.string().optional(),
  heroImage: z.string().url().optional().or(z.literal("")),
  gallery: z.string().optional(),
  tags: z.string().optional(),
  externalLink: z.string().url().optional().or(z.literal("")),
  rating: z.preprocess((val) => (val === "" || val === null ? null : Number(val)), z.number().min(0).max(5).nullable()),
  performance: z.preprocess((val) => Number(val ?? 100), z.number().min(0).max(100)),
  difficulty: z.preprocess((val) => Number(val ?? 1), z.number().min(1).max(5)),
  status: z.enum(["draft", "published", "trash"]),
});

const parseGallery = (input?: string) => {
  if (!input) return [];
  // Tentar parsear como JSON (novo formato com caption/order)
  try {
    const parsed = JSON.parse(input);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  // Fallback: formato legado (URLs separadas por newline)
  return input
    .split("\n")
    .map((url, i) => url.trim())
    .filter(Boolean)
    .map((url, i) => ({ url, caption: '', order: i }));
};

export async function savePost(formData: FormData) {
  try {
    const parsed = postSchema.safeParse({
      id: formData.get("id")?.toString(),
      title: formData.get("title")?.toString(),
      slug: formData.get("slug")?.toString(),
      subtitle: formData.get("subtitle")?.toString(),
      content: formData.get("content")?.toString(),
      heroImage: formData.get("heroImage")?.toString(),
      gallery: formData.get("gallery")?.toString(),
      tags: formData.get("tags")?.toString(),
      externalLink: formData.get("externalLink")?.toString(),
      rating: formData.get("rating")?.toString(),
      performance: formData.get("performance")?.toString(),
      difficulty: formData.get("difficulty")?.toString(),
      status: formData.get("status")?.toString() as "draft" | "published",
    });

    if (!parsed.success) {
      return { success: false, errors: parsed.error.flatten() };
    }

    if (!hasSupabaseCredentials()) {
      return { success: false, message: "Configure as chaves do Supabase no .env." };
    }

    const supabase = await createSupabaseServerClient();
    
    // Check authentication for admin actions
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, message: "Não autorizado. Faça login novamente." };
    }

    // Garantir que existe um perfil para este usuário no banco (evita erro de FK)
    // Se não existir, criamos um básico usando upsert por segurança
    const { error: profileError } = await (supabase as any).from("profiles").upsert({
      id: user.id,
      name: user.email?.split("@")[0] || "Admin",
    }, { onConflict: "id" });

    if (profileError) {
      console.error("Erro ao sincronizar perfil:", profileError);
      return { success: false, message: `Erro ao preparar perfil: ${profileError.message}` };
    }

    // Pegar IDs das stacks do formData (enviados como stacks[])
    const selectedStackIds = formData.getAll("stacks[]").map(id => id.toString());

    // Segurança: Se for um update (tem ID), validar se o post pertence ao usuário
    if (parsed.data.id) {
      const { data: existingPost } = await supabase
        .from("posts")
        .select("author_id")
        .eq("id", parsed.data.id)
        .single();
      
      if (existingPost && (existingPost as any).author_id !== user.id) {
        return { success: false, message: "Você não tem permissão para editar este projeto." };
      }
    }

    const payload = {
      id: parsed.data.id || undefined,
      title: parsed.data.title,
      slug: parsed.data.slug,
      subtitle: parsed.data.subtitle ?? null,
      content: parsed.data.content ?? null,
      hero_image_url: parsed.data.heroImage || null,
      gallery: parseGallery(parsed.data.gallery),
      tags: parseStacks(parsed.data.tags), // Mantemos tags legadas
      external_link: parsed.data.externalLink || null,
      rating: parsed.data.rating,
      performance: parsed.data.performance,
      difficulty: parsed.data.difficulty,
      status: parsed.data.status,
      author_id: user.id,
    };

    console.log("Saving project payload:", payload);

    const { data: post, error } = await (supabase as any)
      .from("posts")
      .upsert(payload as any, { onConflict: "id" })
      .select()
      .single();

    if (error || !post) {
      console.error("savePost error:", error);
      return { success: false, message: `Erro no banco: ${error?.message || "Sem resposta do post"}` };
    }

    console.log("Project saved successfully:", post);

    // Sincronizar stacks (Muitos-para-Muitos)
    // 1. Remover relações antigas
    const { error: deleteError } = await (supabase as any).from("post_stacks").delete().eq("post_id", (post as any).id);
    if (deleteError) {
      console.error("Error deleting old stacks:", deleteError);
    }

    // 2. Inserir novas relações
    if (selectedStackIds.length > 0) {
      const relations = selectedStackIds.map(stackId => ({
        post_id: (post as any).id,
        stack_id: stackId
      }));
      const { error: insertError } = await (supabase as any).from("post_stacks").insert(relations);
      if (insertError) {
        console.error("Error inserting new stacks:", insertError);
      }
    }

    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath(`/projeto/${(post as any).slug}`);

    // Revalidate the author's public profile to ensure dynamic stacks are updated
    const { data } = await supabase
      .from("profiles")
      .select("github_username, id")
      .eq("id", user.id)
      .single();
      
    if (data) {
      const authorProfile = data as any;
      revalidatePath(`/${authorProfile.github_username || authorProfile.id}`);
    }
    
    // Buscar o post atualizado com stacks para o frontend sincronizar
    const { data: updatedPost } = await (supabase as any)
      .from("posts")
      .select(`
        *,
        stacks:post_stacks(
          stack:stacks(*)
        )
      `)
      .eq("id", post.id)
      .single();

    // Formatar o retorno para o tipo Post esperado pelo frontend
    const formattedPost = updatedPost ? {
      ...updatedPost,
      stacks: updatedPost.stacks?.map((s: any) => s.stack).filter(Boolean) || []
    } : post;

    return { success: true, post: formattedPost };
  } catch (error) {
    console.error("savePost fatal error:", error);
    return { success: false, message: "Erro inesperado ao salvar projeto." };
  }
}

export async function moveToTrash(id: string) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Não autorizado." };

    const { error } = await (supabase as any)
      .from("posts")
      .update({ status: "trash" })
      .eq("id", id);

    if (error) return { success: false, message: "Erro ao mover para lixeira." };

    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, message: "Erro crítico ao mover para lixeira." };
  }
}

export async function restoreFromTrash(id: string) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Não autorizado." };

    const { error } = await (supabase as any)
      .from("posts")
      .update({ status: "draft" })
      .eq("id", id);

    if (error) return { success: false, message: "Erro ao restaurar projeto." };

    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, message: "Erro crítico ao restaurar projeto." };
  }
}

export async function permanentlyDeletePost(id: string, mediaToDelete: { id: string, path: string }[] = []) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Não autorizado." };

    // 1. Limpar mídias selecionadas (Storage + DB)
    if (mediaToDelete.length > 0) {
      console.log(`[permanentlyDeletePost] Deleting ${mediaToDelete.length} media files...`);
      
      // Deletar do Storage
      const paths = mediaToDelete.map(m => m.path);
      const { error: storageError } = await supabase.storage.from("media").remove(paths);
      if (storageError) console.error("Error removing media from storage:", storageError);

      // Deletar do Banco (Tabela media)
      const mediaIds = mediaToDelete.map(m => m.id);
      const { error: dbMediaError } = await (supabase as any)
        .from("media")
        .delete()
        .in("id", mediaIds);
      if (dbMediaError) console.error("Error removing media from DB:", dbMediaError);
    }

    // 2. Excluir o projeto permanentemente
    const { error } = await (supabase as any).from("posts").delete().eq("id", id);

    if (error) return { success: false, message: "Erro ao excluir projeto permanentemente." };

    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Permanently delete error:", error);
    return { success: false, message: "Erro crítico ao excluir projeto." };
  }
}

export async function deletePost(id: string) {
  return moveToTrash(id);
}

const stackSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nome é obrigatório"),
  icon: z.string().optional(),
  color: z.string().optional(),
});

export async function saveStack(formData: FormData) {
  try {
    const parsed = stackSchema.safeParse({
      id: formData.get("id")?.toString(),
      name: formData.get("name")?.toString(),
      icon: formData.get("icon")?.toString(),
      color: formData.get("color")?.toString(),
    });

    if (!parsed.success) {
      return { success: false, errors: parsed.error.flatten() };
    }

    const supabase = await createSupabaseServerClient();
    
    // Check authentication for admin actions
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, message: "Não autorizado. Faça login novamente." };
    }

    const payload = {
      id: parsed.data.id || undefined,
      name: parsed.data.name,
      icon: parsed.data.icon || null,
      color: parsed.data.color || null,
    };

    // Use onConflict 'name' as fallback to avoid duplicate names and handle new entries better
    const { error } = await (supabase as any)
      .from("stacks")
      .upsert(payload, { onConflict: parsed.data.id ? "id" : "name" });

    if (error) {
      console.error("saveStack error:", error);
      return { success: false, message: `Erro no banco: ${error.message}` };
    }

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("saveStack fatal error:", error);
    return { success: false, message: "Erro inesperado ao salvar stack." };
  }
}

export async function deleteStack(id: string) {
  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await (supabase as any).from("stacks").delete().eq("id", id);

    if (error) {
      return { success: false, message: "Erro ao excluir stack." };
    }

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { success: false, message: "Erro crítico ao excluir stack." };
  }
}

export async function signInWithGitHub() {
  try {
    const supabase = await createSupabaseServerClient();
    
    const headersList = await headers();
    const host = headersList.get("host");
    const protocol = host?.includes("localhost") ? "http" : "https";
    const origin = `${protocol}://${host}`;

    // In a server action,เราต้อง handle redirect specifically for OAuth
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${origin}/auth/callback`,
        queryParams: {
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error("signInWithGitHub error:", error);
      return { success: false, message: error.message };
    }

    if (data.url) {
      return { success: true, url: data.url };
    }

    return { success: false, message: "Não foi possível gerar a URL de autenticação." };
  } catch (error: any) {
    console.error("signInWithGitHub fatal error:", error);
    return { success: false, message: "Erro inesperado ao iniciar login com GitHub." };
  }
}

export async function syncProfileWithGitHub(githubUsername: string) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !githubUsername) return { success: false, message: "Não autenticado ou username ausente" };

    // Buscar dados mais recentes do GitHub API
    const response = await fetch(`https://api.github.com/users/${githubUsername}`);
    if (!response.ok) {
      console.warn("Could not fetch data from GitHub API", response.statusText);
      return { success: false, message: "Erro ao buscar dados do GitHub" };
    }

    const githubData = await response.json();

    // Atualizar perfil com dados novos do Git
    const { error } = await (supabase.from("profiles") as any).update({
      name: githubData.name || githubData.login,
      avatar_url: githubData.avatar_url,
      bio: githubData.bio || null,
      updated_at: new Date().toISOString(),
    }).eq("id", user.id);

    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error("syncProfileWithGitHub ERROR:", error);
    return { success: false, message: error.message };
  }
}

export async function signIn(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return { success: false, message: "Email e senha são obrigatórios." };
    }

    if (!hasSupabaseCredentials()) {
      return { success: false, message: "Erro de configuração: Variáveis de ambiente faltando no servidor." };
    }

    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("signIn error:", error);
    return { success: false, message: "Ocorreu um erro inesperado no servidor. Verifique as configurações." };
  }
}

export async function signOut() {
  try {
    if (!hasSupabaseCredentials()) {
      redirect("/login");
    }
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
    revalidatePath("/");
  } catch (error) {
    console.error("signOut error:", error);
  } finally {
    redirect("/login");
  }
}
export async function getMediaLibrary() {
  console.log("[getMediaLibrary] Start");
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Não autorizado." };

    const { data, error } = await (supabase as any)
      .from("media")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[getMediaLibrary] DB error:", error);
      return { success: false, message: "Erro ao buscar mídia." };
    }

    // Serialização defensiva
    const safeMedia = JSON.parse(JSON.stringify(data || [], (k, v) => 
      typeof v === 'bigint' ? v.toString() : v
    ));

    console.log("[getMediaLibrary] Success, items:", safeMedia.length);
    return { success: true, media: safeMedia };
  } catch (error: any) {
    console.error("[getMediaLibrary] Fatal error:", error);
    return { success: false, message: "Erro interno ao carregar biblioteca." };
  }
}

export async function uploadMedia(formData: FormData) {
  console.log("[uploadMedia] Start");
  try {
    const file = formData.get("file") as any;
    if (!file || !file.name) {
      return { success: false, message: "Nenhum arquivo válido enviado." };
    }

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Não autorizado." };

    console.log("[uploadMedia] File received:", file.name, "Size:", file.size);

    // Converter para Buffer para evitar problemas com File no servidor
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const now = new Date();
    const path = `uploads/${user.id}/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    console.log("[uploadMedia] Uploading to storage path:", path);

    // 1. Upload para o Storage usando Buffer
    const { error: storageError } = await supabase.storage
      .from("media")
      .upload(path, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert: true
      });

    if (storageError) {
      console.error("[uploadMedia] Storage error:", storageError);
      return { success: false, message: `Erro no storage: ${storageError.message}` };
    }

    const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(path);

    const mediaPayload = {
      filename: file.name,
      path: path,
      url: publicUrl,
      type: file.type,
      size: file.size,
      user_id: user.id,
    };

    console.log("[uploadMedia] Inserting into DB...");
    const { data: mediaRecord, error: dbError } = await (supabase as any)
      .from("media")
      .insert(mediaPayload)
      .select()
      .single();

    if (dbError) {
      console.error("[uploadMedia] DB error:", dbError);
      return { success: false, message: `Erro no banco: ${dbError.message}` };
    }

    const safeRecord = JSON.parse(JSON.stringify(mediaRecord, (k, v) => 
      typeof v === 'bigint' ? v.toString() : v
    ));

    console.log("[uploadMedia] Success!");
    return { success: true, media: safeRecord };
  } catch (error: any) {
    console.error("[uploadMedia] Fatal error:", error);
    return { success: false, message: `Erro inesperado: ${error.message || 'Erro desconhecido'}` };
  }
}

export async function deleteMedia(id: string, path: string) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Não autorizado." };

    if (!path.startsWith(`uploads/${user.id}/`)) {
      return { success: false, message: "Você não tem permissão para deletar este arquivo." };
    }

    // 1. Deletar do Storage
    const { error: storageError } = await supabase.storage.from("media").remove([path]);
    if (storageError) console.error("Error removing from storage:", storageError);

    // 2. Deletar do Banco
    const { error: dbError } = await (supabase as any).from("media").delete().eq("id", id).eq("user_id", user.id);
    if (dbError) return { success: false, message: "Erro ao deletar do banco." };

    return { success: true };
  } catch (error) {
    return { success: false, message: "Erro crítico ao deletar mídia." };
  }
}

export async function adminUpdateUserStatus(targetUserId: string, newStatus: 'active' | 'blocked') {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Não autenticado." };

    // Verificar se o usuário atual é admin
    const { data: adminProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if ((adminProfile as any)?.role !== 'admin') {
      return { success: false, message: "Acesso negado. Apenas administradores." };
    }

    const { error } = await (supabase as any)
      .from("profiles")
      .update({ status: newStatus })
      .eq("id", targetUserId);

    if (error) return { success: false, message: "Erro ao atualizar status." };

    revalidatePath("/explore");
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { success: false, message: "Erro crítico ao atualizar usuário." };
  }
}

export async function adminDeleteUser(targetUserId: string) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Não autenticado." };

    // Verificar se o usuário atual é admin
    const { data: adminProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if ((adminProfile as any)?.role !== 'admin') {
      return { success: false, message: "Acesso negado." };
    }

    // Deletar perfil (posts serão deletados em cascata se configurado, ou precisam ser lidados)
    // No Supabase, se tiver cascata de delete está ok.
    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", targetUserId);

    if (error) return { success: false, message: "Erro ao deletar usuário." };

    revalidatePath("/explore");
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { success: false, message: "Erro crítico ao deletar usuário." };
  }
}

export async function adminSendNotification(targetUserId: string | null, title: string, content: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Não autenticado." };

    // Verificar se o usuário atual é admin
    const { data: adminProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if ((adminProfile as any)?.role !== 'admin') {
      return { success: false, message: "Acesso negado." };
    }

    const { error } = await (supabase as any)
      .from("notifications")
      .insert({
        user_id: targetUserId, // null significa global
        title,
        content,
        type
      });

    if (error) return { success: false, message: "Erro ao enviar notificação." };

    return { success: true };
  } catch (error) {
    return { success: false, message: "Erro ao processar notificação." };
  }
}

/**
 * Atualiza campos específicos do perfil (sem usar form data se preferir)
 */
export async function updateProfile(data: Partial<{
  name: string;
  role: string;
  bio: string;
  avatar_url: string;
  cover_url: string;
  github_username: string;
}>) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, message: "Não autenticado" };

  const { error } = await (supabase.from("profiles") as any)
    .update(data as any)
    .eq("id", user.id);

  if (error) {
    console.error("updateProfile ERROR:", error);
    return { success: false, message: "Erro ao atualizar perfil" };
  }

  revalidatePath("/admin");
  revalidatePath("/explore");
  return { success: true };
}

export async function updateCommentStatus(commentId: string, status: 'approved' | 'rejected') {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Não autenticado." };

    // Verificar se o usuário é admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if ((profile as any)?.role !== 'admin') {
      return { success: false, message: "Acesso negado." };
    }

    const { error } = await (supabase.from("comments") as any)
      .update({ status })
      .eq("id", commentId);

    if (error) throw error;

    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("updateCommentStatus ERROR:", error);
    return { success: false, message: error.message };
  }
}

export async function deleteComment(commentId: string) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Não autenticado." };

    const { error } = await (supabase.from("comments") as any)
      .delete()
      .eq("id", commentId);

    if (error) throw error;

    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("deleteComment ERROR:", error);
    return { success: false, message: error.message };
  }
}

export async function generateAICover(prompt: string) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Não autenticado." };

    console.log("[generateAICover] Generating for prompt:", prompt);
    
    // Sanitize prompt for URL
    const sanitizedPrompt = encodeURIComponent(prompt);
    const seed = Math.floor(Math.random() * 1000000);
    const aiUrl = `https://image.pollinations.ai/prompt/${sanitizedPrompt}?width=1920&height=400&nologo=true&seed=${seed}`;

    // 1. Fetch generated image
    const response = await fetch(aiUrl);
    if (!response.ok) throw new Error("Falha ao gerar imagem com IA.");
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Upload to Supabase Storage
    const now = new Date();
    const filename = `ai-cover-${Date.now()}.jpg`;
    const path = `uploads/${user.id}/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/ai/${filename}`;

    const { error: storageError } = await supabase.storage
      .from("media")
      .upload(path, buffer, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (storageError) throw storageError;

    const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(path);

    // 3. Register in media table
    const { data: mediaRecord, error: dbError } = await (supabase as any)
      .from("media")
      .insert({
        filename: filename,
        path: path,
        url: publicUrl,
        type: 'image/jpeg',
        size: buffer.length,
        user_id: user.id,
      })
      .select()
      .single();

    if (dbError) throw dbError;

    // We no longer automatically update the profile here. This allows the CoverPicker to be used as a controlled component in forms.

    return { 
      success: true, 
      url: publicUrl,
      media: JSON.parse(JSON.stringify(mediaRecord, (k, v) => typeof v === 'bigint' ? v.toString() : v))
    };
  } catch (error: any) {
    console.error("generateAICover ERROR:", error);
    return { success: false, message: error.message || "Erro ao processar imagem IA." };
  }
}
