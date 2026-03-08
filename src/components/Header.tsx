"use client";

import { Flex } from "@chakra-ui/react";
import Image from "next/image";

export function Header() {
  return (
    <Flex
      as="header"
      position="sticky"
      top={0}
      zIndex={10}
      bg="rgba(32, 32, 36, 0.8)"
      backdropFilter="blur(12px)"
      borderBottom="1px solid"
      borderColor="whiteAlpha.100"
      justify="center"
      py={5}
      boxShadow="sm"
    >
      <Image
        src="/ignite-logo.svg"
        alt="Logotipo do Ignite"
        width={65}
        height={61}
        style={{ height: "2rem", width: "auto" }}
      />
    </Flex>
  );
}
