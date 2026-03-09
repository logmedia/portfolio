"use client";

import { Flex, HStack, Link as ChakraLink, IconButton, useColorMode, Menu, MenuButton, MenuList, MenuItem, Box } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import NextLink from "next/link";
import Image from "next/image";
import { Moon, Sun, List } from "phosphor-react";

export function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

      <HStack spacing={8} as="nav" display={{ base: "none", md: "flex" }}>
        <NextLink href="/" passHref legacyBehavior>
          <ChakraLink fontWeight="bold" color={colorMode === "light" ? "gray.800" : "gray.100"} _hover={{ color: "brand.500", textDecoration: "none" }} transition="color 0.2s">
            Início
          </ChakraLink>
        </NextLink>
        <NextLink href="#" passHref legacyBehavior>
          <ChakraLink fontWeight="bold" color={colorMode === "light" ? "gray.800" : "gray.100"} _hover={{ color: "brand.500", textDecoration: "none" }} transition="color 0.2s">
            Projetos
          </ChakraLink>
        </NextLink>
        <NextLink href="#" passHref legacyBehavior>
          <ChakraLink fontWeight="bold" color={colorMode === "light" ? "gray.800" : "gray.100"} _hover={{ color: "brand.500", textDecoration: "none" }} transition="color 0.2s">
            Sobre
          </ChakraLink>
        </NextLink>
        <NextLink href="#" passHref legacyBehavior>
          <ChakraLink fontWeight="bold" color={colorMode === "light" ? "gray.800" : "gray.100"} _hover={{ color: "brand.500", textDecoration: "none" }} transition="color 0.2s">
            Contato
          </ChakraLink>
        </NextLink>
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

        {/* Mobile Menu */}
        <Box display={{ base: "block", md: "none" }}>
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
              <NextLink href="#" passHref legacyBehavior>
                <MenuItem bg="transparent" _hover={{ bg: colorMode === "light" ? "gray.50" : "whiteAlpha.100" }}>Projetos</MenuItem>
              </NextLink>
              <NextLink href="#" passHref legacyBehavior>
                <MenuItem bg="transparent" _hover={{ bg: colorMode === "light" ? "gray.50" : "whiteAlpha.100" }}>Sobre</MenuItem>
              </NextLink>
              <NextLink href="#" passHref legacyBehavior>
                <MenuItem bg="transparent" _hover={{ bg: colorMode === "light" ? "gray.50" : "whiteAlpha.100" }}>Contato</MenuItem>
              </NextLink>
            </MenuList>
          </Menu>
        </Box>
      </HStack>
    </Flex>
  );
}
