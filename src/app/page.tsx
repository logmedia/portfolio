"use client";

import { Box, Grid, GridItem } from "@chakra-ui/react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Post } from "@/components/Post";

export default function Home() {
  const handleEditProfile = () => {
    window.alert("Funcionalidade de edição em desenvolvimento.");
  };

  return (
    <Box minH="100vh">
      <Header />
      <Box maxW="70rem" my={8} mx="auto" px={4}>
        <Grid
          templateColumns={{ base: "1fr", md: "256px 1fr" }}
          gap={8}
          alignItems="start"
        >
          <GridItem>
            <Sidebar onEditProfile={handleEditProfile} />
          </GridItem>
          <GridItem as="main">
            <Post />
            <Post />
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
}
