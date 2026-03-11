"use client";

import { Sidebar } from "@/components/Sidebar";
import { Post } from "@/components/Post";
import { SkillsCard } from "@/components/SkillsCard";
import { StacksCard } from "@/components/StacksCard";
import { Box, Flex, Text as ChakraText } from "@chakra-ui/react";
import { FeedTitle } from "@/components/FeedTitle";
import { StackFilter } from "@/components/StackFilter";
import { Suspense } from "react";

interface PortfolioContentProps {
  profile: any;
  posts: any[];
  stacks: any[];
  searchParams: {
    stack?: string;
  };
}

export function PortfolioContent({ profile, posts, stacks, searchParams }: PortfolioContentProps) {
  const filteredPosts = searchParams.stack 
    ? posts.filter(post => post.stacks?.some((s: any) => s.id === searchParams.stack))
    : posts;

  return (
    <Box
      maxW="70rem"
      mx="auto"
      p={{ base: 4, md: 8 }}
      display="grid"
      gridTemplateColumns={{ base: "1fr", lg: "280px 1fr" }}
      gap={{ base: 6, lg: 10 }}
      alignItems="start"
    >
      <Box as="aside" w="100%">
        <Sidebar profile={{
          name: profile.name,
          role: profile.role ?? "",
          bio: profile.bio ?? "",
          avatar_url: profile.avatar_url ?? "",
          cover_url: profile.cover_url ?? "",
          socials: profile.socials
        }} />
        <SkillsCard skills={profile.skills} />
        <StacksCard stacks={profile.stacks} />
      </Box>
      <Box as="main" w="100%">
        <Flex direction="column" gap={{ base: 6, md: 8 }}>
          
          <FeedTitle />
          
          <Suspense fallback={null}>
            <StackFilter stacks={stacks} />
          </Suspense>

          {filteredPosts.map(post => (
            <Post key={post.id} post={post} profile={profile} />
          ))}
          
          {filteredPosts.length === 0 && (
            <ChakraText color="gray.500" _dark={{ color: "whiteAlpha.500" }} textAlign="center" mt={10}>
              {searchParams.stack 
                ? "Nenhum projeto encontrado com esta tecnologia." 
                : "Nenhum projeto publicado ainda."}
            </ChakraText>
          )}
        </Flex>
      </Box>
    </Box>
  );
}
