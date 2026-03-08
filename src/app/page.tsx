import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Post } from "@/components/Post";
import { Box, Text as ChakraText } from "@chakra-ui/react";
import { fetchPosts, fetchProfile } from "@/lib/supabase/queries";

export default async function Home() {
  const [profile, posts] = await Promise.all([
    fetchProfile(),
    fetchPosts(),
  ]);

  return (
    <Box minH="100vh">
      <Header />
      <div style={{ maxWidth: "70rem", margin: "2rem auto", padding: "0 1rem", display: "grid", gridTemplateColumns: "minmax(0, 256px) 1fr", gap: "2rem", alignItems: "start" }}>
        <aside>
          <Sidebar profile={{
            name: profile.name,
            role: profile.role ?? "",
            avatarUrl: profile.avatar_url ?? "",
            coverUrl: profile.cover_url ?? ""
          }} />
        </aside>
        <main>
          {posts.map(post => (
            <Post key={post.id} post={post} profile={profile} />
          ))}
          {posts.length === 0 && (
            <ChakraText color="whiteAlpha.500" textAlign="center" mt={10}>
              Nenhum post publicado ainda.
            </ChakraText>
          )}
        </main>
      </div>
    </Box>
  );
}
