import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Post } from "@/components/Post";
import { SkillsCard } from "@/components/SkillsCard";
import { StacksCard } from "@/components/StacksCard";
import { Box, Flex, Text as ChakraText } from "@chakra-ui/react";
import { fetchPosts, fetchProfile } from "@/lib/supabase/queries";

export default async function Home() {
  const [profile, posts] = await Promise.all([
    fetchProfile(),
    fetchPosts(),
  ]);

  return (
    <Box minH="100vh">
      <Header />
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
            avatarUrl: profile.avatar_url ?? "",
            coverUrl: profile.cover_url ?? "",
            socials: profile.socials
          }} />
          <SkillsCard />
          <StacksCard />
        </Box>
        <Box as="main" w="100%">
          <Flex direction="column" gap={{ base: 6, md: 8 }}>
            {posts.map(post => (
              <Post key={post.id} post={post} profile={profile} />
            ))}
            {posts.length === 0 && (
              <ChakraText color="whiteAlpha.500" textAlign="center" mt={10}>
                Nenhum post publicado ainda.
              </ChakraText>
            )}
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
