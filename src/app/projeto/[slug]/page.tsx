import { notFound } from "next/navigation";
import { fetchComments, fetchPostBySlug, fetchProfile, fetchAllPostSlugs } from "@/lib/supabase/queries";
import { PostDetailClient } from "@/components/post/post-detail-client";

interface PostPageProps {
  params: { slug: string };
}

export const revalidate = 3600; // ISR for dynamic posts

export async function generateStaticParams() {
  const slugs = await fetchAllPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Se o post já trouxer o author (pelo join), usamos ele.
  // Caso contrário, fazemos o fetch do perfil principal como fallback.
  const profile = post.author || await fetchProfile();
  const comments = await fetchComments(post.id);

  return <PostDetailClient post={post} comments={comments} profile={profile} />;
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);
  if (!post) {
    return { title: "Projeto não encontrado" };
  }
  return {
    title: `${post.title} • ${post.author?.name || 'LogMedia'}`,
    description: post.subtitle ?? post.content?.slice(0, 120),
  };
}
