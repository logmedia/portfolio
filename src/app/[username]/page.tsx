import { Header } from "@/components/Header";
import { Box } from "@chakra-ui/react";
import { fetchPostsByAuthor, fetchProfileByHandle, fetchStacks, fetchSiteSettings } from "@/lib/supabase/queries";
import { notFound } from "next/navigation";
import { PortfolioContent } from "@/components/PortfolioContent";

export const dynamic = "force-dynamic";

interface UserPortfolioProps {
  params: Promise<{
    username: string;
  }>;
  searchParams: Promise<{
    stack?: string;
  }>;
}

export default async function UserPortfolio({ params, searchParams }: UserPortfolioProps) {
  const resolvedParams = await params;
  const username = resolvedParams.username;
  const resolvedSearchParams = await searchParams;

  const [profile, siteSettings] = await Promise.all([
    fetchProfileByHandle(username),
    fetchSiteSettings()
  ]);

  if (!profile) {
    notFound();
  }

  const [posts, stacks] = await Promise.all([
    fetchPostsByAuthor(profile.id),
    fetchStacks(),
  ]);

  // Dynamically extract and deduplicate stack names from published projects
  const uniqueStackNames = Array.from(
    new Set(
      posts.flatMap((post) => post.stacks?.map((stack: any) => stack.name) || [])
    )
  ).filter(Boolean);

  profile.stacks = uniqueStackNames;

  return (
    <Box minH="100vh">
      <Header />
      <PortfolioContent 
        profile={profile} 
        posts={posts} 
        stacks={stacks} 
        searchParams={resolvedSearchParams} 
        siteSettings={siteSettings}
      />
    </Box>
  );
}

export async function generateMetadata({ params }: UserPortfolioProps) {
  const resolvedParams = await params;
  const username = resolvedParams.username;
  
  const [profile, settings] = await Promise.all([
    fetchProfileByHandle(username),
    fetchSiteSettings()
  ]);

  if (!profile) {
    return { title: "Perfil não encontrado" };
  }

  const title = `${profile.name} | ${profile.job_title || 'Desenvolvedor'} • ${settings?.site_name || 'Portfolio'}`;
  const description = profile.bio || settings?.seo_description || '';
  const image = profile.avatar_url || settings?.og_image_url;

  return {
    title,
    description,
    keywords: settings?.seo_keywords?.join(', '),
    openGraph: {
      title,
      description,
      images: image ? [image] : [],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    }
  };
}
