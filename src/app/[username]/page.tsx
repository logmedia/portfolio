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
    // TEMPORARY DEBUG: Print the raw handle and profile fetching result instead of 404
    return (
      <Box p={8} bg="black" color="white" minH="100vh">
        <h1 style={{color: "white"}}>Debug Info for /{params.username}</h1>
        <pre>{JSON.stringify({ 
          handle: params.username, 
          profileResult: profile,
          envUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Exists" : "Missing",
          envKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Exists" : "Missing"
        }, null, 2)}</pre>
      </Box>
    );
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
