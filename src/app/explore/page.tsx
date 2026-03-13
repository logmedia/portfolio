import { Header } from "@/components/Header";
import { Box } from "@chakra-ui/react";
import { fetchAllProfiles, fetchStacks } from "@/lib/supabase/queries";
import { ExploreContent } from "@/components/ExploreContent";

export const revalidate = 60;

export default async function UserDirectory() {
  const [profiles, allStacks] = await Promise.all([
    fetchAllProfiles(true),
    fetchStacks()
  ]);

  return (
    <Box minH="100vh" bgGradient="linear(to-b, #05080c, #040507)">
      <Header />
      <ExploreContent profiles={profiles} allStacks={allStacks} />
    </Box>
  );
}
