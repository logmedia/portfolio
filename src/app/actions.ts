'use server';

import { revalidatePath } from "next/cache";
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
  rating: z.preprocess((val) => Number(val ?? 0), z.number().min(0).max(5)),
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
    status: formData.get("status")?.toString() as "draft" | "published",
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
    title: parsed.data.title,
    slug: parsed.data.slug,
    subtitle: parsed.data.subtitle ?? null,
    content: parsed.data.content ?? null,
    hero_image_url: parsed.data.heroImage || null,
    gallery: parseGallery(parsed.data.gallery),
    tags: parseStacks(parsed.data.tags),
    external_link: parsed.data.externalLink || null,
    rating: parsed.data.rating,
    status: parsed.data.status,
  };

  const { error } = await supabase.from("posts").upsert(payload as any, { onConflict: "slug" });

  if (error) {
    return { success: false, message: "Erro ao salvar post." };
  }

  revalidatePath("/");
  revalidatePath(`/post/${parsed.data.slug}`);
  revalidatePath("/admin");
  return { success: true };
}
