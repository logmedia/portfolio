import { notFound } from "next/navigation";
import { fetchComments, fetchPostBySlug, fetchProfile } from "@/lib/supabase/queries";
import { PostDetailClient } from "@/components/post/post-detail-client";

interface PostPageProps {
  params: { slug: string };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = params;
  const [post, profile] = await Promise.all([
    fetchPostBySlug(slug),
    fetchProfile(),
  ]);

  if (!post) {
    notFound();
  }

  const comments = await fetchComments(post.id);

  return <PostDetailClient post={post} comments={comments} profile={profile} />;
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = params;
  const post = await fetchPostBySlug(slug);
  if (!post) {
    return { title: "Post não encontrado" };
  }
  return {
    title: `${post.title} • José Renato`,
    description: post.subtitle ?? post.content?.slice(0, 120),
  };
}
