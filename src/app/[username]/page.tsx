import { Header } from "@/components/Header";
import { Box } from "@chakra-ui/react";
import { fetchPostsByAuthor, fetchProfileByHandle, fetchStacks } from "@/lib/supabase/queries";
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

  const profile = await fetchProfileByHandle(username);

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
      />
    </Box>
  );
}
