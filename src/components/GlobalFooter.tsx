"use client";

import { Box, Container, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { ChangelogFooter } from "./ChangelogFooter";

export function GlobalFooter() {
  const borderColor = useColorModeValue("whiteAlpha.200", "whiteAlpha.100");

  return (
    <Box as="footer" borderTop="1px solid" borderColor={borderColor} py={6} mt="auto" w="full">
      <Container maxW="container.xl">
        <Flex direction={{ base: "column", md: "row" }} justify="space-between" align="center" gap={4}>
          <Text fontSize="xs" color="whiteAlpha.500">
            © {new Date().getFullYear()} Logmedia. Todos os direitos reservados.
          </Text>
          <ChangelogFooter />
        </Flex>
      </Container>
    </Box>
  );
}
