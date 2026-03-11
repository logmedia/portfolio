import { Header } from "@/components/Header";
import { Box } from "@chakra-ui/react";
import { fetchPostsByAuthor, fetchProfileByHandle, fetchStacks } from "@/lib/supabase/queries";
import { notFound } from "next/navigation";
import { PortfolioContent } from "@/components/PortfolioContent";

export const dynamic = "force-dynamic";

interface UserPortfolioProps {
  params: {
    username: string;
  };
  searchParams: {
    stack?: string;
  };
}

export default async function UserPortfolio({ params, searchParams }: UserPortfolioProps) {
  const profile = await fetchProfileByHandle(params.username);

  if (!profile) {
    notFound();
  }

  const [posts, stacks] = await Promise.all([
    fetchPostsByAuthor(profile.id),
    fetchStacks(),
  ]);

  return (
    <Box minH="100vh">
      <Header />
      <PortfolioContent 
        profile={profile} 
        posts={posts} 
        stacks={stacks} 
        searchParams={searchParams} 
      />
    </Box>
  );
}
