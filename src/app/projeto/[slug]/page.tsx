import { notFound } from "next/navigation";
import { fetchComments, fetchPostBySlug, fetchProfile, fetchAllPostSlugs, fetchSiteSettings } from "@/lib/supabase/queries";
import { PostDetailClient } from "@/components/post/post-detail-client";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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
  const [post, siteSettings] = await Promise.all([
    fetchPostBySlug(slug),
    fetchSiteSettings()
  ]);

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!post) {
    notFound();
  }

  // Se o post já trouxer o author (pelo join), usamos ele.
  // Caso contrário, fazemos o fetch do perfil principal como fallback.
  const profile = post.author || await fetchProfile();
  const comments = await fetchComments(post.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": post.title,
    "image": post.hero_image_url || siteSettings?.og_image_url,
    "author": {
      "@type": "Person",
      "name": profile?.name
    },
    "datePublished": (post as any).created_at,
    "url": `${process.env.NEXT_PUBLIC_APP_URL || ''}/projeto/${post.slug}`
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PostDetailClient 
        post={post} 
        comments={comments} 
        profile={profile} 
        siteSettings={siteSettings} 
        isAuthor={user?.id === (post as any).author_id}
      />
    </>
  );
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([
    fetchPostBySlug(slug),
    fetchSiteSettings()
  ]);

  if (!post) {
    return { title: "Projeto não encontrado" };
  }

  const title = post.seo_title || `${post.title} • ${post.author?.name || settings?.site_name || 'LogMedia'}`;
  const description = post.seo_description || post.subtitle || post.content?.slice(0, 160) || settings?.seo_description || '';
  const image = post.seo_image_url || post.hero_image_url || settings?.og_image_url;

  return {
    title,
    description,
    keywords: post.seo_keywords?.join(', ') || settings?.seo_keywords?.join(', '),
    openGraph: {
      title,
      description,
      images: image ? [image] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    }
  };
}
