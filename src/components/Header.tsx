"use client";

import { Flex, HStack, Link as ChakraLink, IconButton, useColorMode, Menu, MenuButton, MenuList, MenuItem, Box, Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import NextLink from "next/link";
import Image from "next/image";
import { Moon, Sun, List, ShieldCheck } from "phosphor-react";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/content";

export function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    setMounted(true);
    
    const loadProfile = async () => {
      const supabase = createSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (data) setProfile(data as Profile);
      }
    };

    loadProfile();
  }, []);

  if (!mounted) {
    return (
      <Flex as="header" position="sticky" top={0} zIndex={10} bg="rgba(32, 32, 36, 0.8)" backdropFilter="blur(12px)" borderBottom="1px solid" borderColor="whiteAlpha.100" justify="center" py={5} boxShadow="sm">
        <Image src="/ignite-logo.svg" alt="Logotipo do Ignite" width={65} height={61} style={{ height: "2rem", width: "auto" }} />
      </Flex>
    );
  }

  return (
    <Flex
      as="header"
      position="sticky"
      top={0}
      zIndex={10}
      bg={colorMode === "light" ? "rgba(255, 255, 255, 0.8)" : "rgba(32, 32, 36, 0.8)"}
      backdropFilter="blur(12px)"
      borderBottom="1px solid"
      borderColor={colorMode === "light" ? "gray.200" : "whiteAlpha.100"}
      justify="space-between"
      align="center"
      py={4}
      px={{ base: 6, md: 12 }}
      boxShadow="sm"
      transition="background-color 0.2s, border-color 0.2s"
    >
      <NextLink href="/" passHref legacyBehavior>
        <ChakraLink display="flex" alignItems="center">
          <Image
            src="/ignite-logo.svg"
            alt="Logotipo Principal"
            width={40}
            height={40}
            style={{ height: "2rem", width: "auto" }}
          />
        </ChakraLink>
      </NextLink>

      <HStack spacing={8} as="nav" display={{ base: "none", lg: "flex" }}>
        <NextLink href="/explore" passHref legacyBehavior>
          <ChakraLink fontWeight="bold" color={colorMode === "light" ? "gray.800" : "gray.100"} _hover={{ color: "brand.500", textDecoration: "none" }} transition="color 0.2s">
            Explorar Talentos
          </ChakraLink>
        </NextLink>
        <NextLink href="/admin" passHref legacyBehavior>
          <ChakraLink fontWeight="bold" color={colorMode === "light" ? "gray.800" : "gray.100"} _hover={{ color: "brand.500", textDecoration: "none" }} transition="color 0.2s">
            Meu Painel
          </ChakraLink>
        </NextLink>
        {profile?.role === 'admin' && (
          <NextLink href="/admin/users" passHref legacyBehavior>
            <ChakraLink fontWeight="bold" display="flex" alignItems="center" gap={1} color="brand.500" _hover={{ opacity: 0.8, textDecoration: "none" }} transition="opacity 0.2s">
              <ShieldCheck size={18} />
              Gestão
            </ChakraLink>
          </NextLink>
        )}
      </HStack>

      <HStack spacing={4}>
        <IconButton
          aria-label="Alternar tema claro/escuro"
          icon={colorMode === "light" ? <Moon weight="bold" size={20} /> : <Sun weight="bold" size={20} />}
          onClick={toggleColorMode}
          variant="ghost"
          colorScheme={colorMode === "light" ? "blackAlpha" : "whiteAlpha"}
          color={colorMode === "light" ? "gray.800" : "yellow.400"}
          borderRadius="full"
          _hover={{ bg: colorMode === "light" ? "blackAlpha.100" : "whiteAlpha.200" }}
          transition="all 0.2s"
        />

        {profile && <NotificationsDropdown />}

        <Button
          as={NextLink}
          href="/login"
          display={{ base: "none", md: "inline-flex" }}
          size="md"
          colorScheme="brand"
          fontWeight="bold"
          borderRadius="full"
          px={6}
        >
          Começar Agora
        </Button>

        {/* Mobile Menu */}
        <Box display={{ base: "block", lg: "none" }}>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Menu"
              icon={<List weight="bold" size={24} />}
              variant="outline"
              borderColor={colorMode === "light" ? "gray.200" : "whiteAlpha.200"}
              color={colorMode === "light" ? "gray.800" : "gray.100"}
            />
            <MenuList 
              bg={colorMode === "light" ? "white" : "gray.800"} 
              borderColor={colorMode === "light" ? "gray.200" : "whiteAlpha.200"}
              boxShadow="lg"
            >
              <NextLink href="/" passHref legacyBehavior>
                <MenuItem bg="transparent" _hover={{ bg: colorMode === "light" ? "gray.50" : "whiteAlpha.100" }}>Início</MenuItem>
              </NextLink>
              <NextLink href="/explore" passHref legacyBehavior>
                <MenuItem bg="transparent" _hover={{ bg: colorMode === "light" ? "gray.50" : "whiteAlpha.100" }}>Explorar</MenuItem>
              </NextLink>
              <NextLink href="/login" passHref legacyBehavior>
                <MenuItem bg="transparent" fontWeight="bold" color="brand.500" _hover={{ bg: colorMode === "light" ? "gray.50" : "whiteAlpha.100" }}>Entrar / Cadastrar</MenuItem>
              </NextLink>
              <NextLink href="/admin" passHref legacyBehavior>
                <MenuItem bg="transparent" _hover={{ bg: colorMode === "light" ? "gray.50" : "whiteAlpha.100" }}>Meu Painel</MenuItem>
              </NextLink>
              {profile?.role === 'admin' && (
                <NextLink href="/admin/users" passHref legacyBehavior>
                  <MenuItem color="brand.500" fontWeight="bold" bg="transparent" _hover={{ bg: colorMode === "light" ? "gray.50" : "whiteAlpha.100" }}>
                    Gestão Geral
                  </MenuItem>
                </NextLink>
              )}
            </MenuList>
          </Menu>
        </Box>
      </HStack>
    </Flex>
  );
}
