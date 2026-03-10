'use server';

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

  const { error } = await supabase.from("comments").insert({
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
  };

  const { error } = await supabase.from("profiles").upsert(payload as any, { onConflict: "id" });

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
  status: z.enum(["draft", "published"]),
});

const parseGallery = (input?: string) => {
  if (!input) return [];
  return input
    .split("\n")
    .map((url) => url.trim())
    .filter(Boolean);
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
      .upsert(payload as any, { onConflict: "slug" })
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

export async function deletePost(id: string) {
  try {
    const supabase = await createSupabaseServerClient();
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, message: "Não autorizado." };
    }

    const { error } = await (supabase as any).from("posts").delete().eq("id", id);

    if (error) {
      return { success: false, message: "Erro ao excluir projeto." };
    }

    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, message: "Erro crítico ao excluir projeto." };
  }
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
