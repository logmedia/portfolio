"use client";

import { Box, Flex, Avatar, Text, Button, Image } from "@chakra-ui/react";
import { PencilLine } from "phosphor-react";

interface Profile {
  name: string;
  role: string;
  avatarUrl: string;
  coverUrl: string;
}

const DEFAULT_PROFILE: Profile = {
  name: "José Renato",
  role: "Web Developer",
  avatarUrl: "https://avatars.githubusercontent.com/u/99501874?v=4",
  coverUrl:
    "https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?q=60&w=500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};

interface SidebarProps {
  profile?: Partial<Profile>;
  onEditProfile?: () => void;
}

export function Sidebar({ profile, onEditProfile }: SidebarProps) {
  const { name, role, avatarUrl, coverUrl } = { ...DEFAULT_PROFILE, ...profile };

  return (
    <Box
      as="aside"
      bg="rgba(32, 32, 36, 0.4)"
      backdropFilter="blur(16px)"
      borderRadius="2xl"
      overflow="hidden"
      boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
      border="1px solid"
      borderColor="whiteAlpha.100"
    >
      <Image
        w="full"
        h="72px"
        objectFit="cover"
        src={coverUrl}
        alt={`Imagem de capa do perfil de ${name}`}
      />
      <Flex direction="column" align="center" mt="-calc(1.5rem + 6px)">
        <Avatar
          size="xl"
          src={avatarUrl}
          name={name}
          border="4px solid"
          borderColor="brand.900" /* matching gray-800 from theme */
          outline="2px solid"
          outlineColor="brand.500"
          bg="brand.800"
        />
        <Text mt={4} color="gray.100" fontWeight="bold" lineHeight="1.6">
          {name}
        </Text>
        <Text fontSize="sm" color="gray.400" lineHeight="1.6">
          {role}
        </Text>
      </Flex>
      <Box
        as="footer"
        borderTop="1px solid"
        borderColor="whiteAlpha.200"
        mt={6}
        pt={6}
        px={8}
        pb={8}
      >
        <Button
          w="full"
          h="50px"
          variant="outline"
          colorScheme="brand"
          borderColor="brand.500"
          color="brand.500"
          leftIcon={<PencilLine size={20} />}
          onClick={onEditProfile}
          _hover={{
            bg: "brand.500",
            color: "white",
            transform: "scale(1.02)",
            boxShadow: "0 0 15px rgba(0, 135, 95, 0.3)",
          }}
          transition="all 0.2s ease"
        >
          Editar seu perfil
        </Button>
      </Box>
    </Box>
  );
}
