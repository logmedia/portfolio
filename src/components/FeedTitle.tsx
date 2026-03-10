"use client";

import { Flex, Heading, Icon } from "@chakra-ui/react";
import { Code } from "phosphor-react";

export function FeedTitle() {
  return (
    <Flex align="center" gap={3} px={2}>
      <Icon as={Code} fontSize="24px" color="brand.500" />
      <Heading size="lg" color="gray.800" _dark={{ color: "gray.100" }} letterSpacing="tight">
        Últimos Projetos
      </Heading>
    </Flex>
  );
}
