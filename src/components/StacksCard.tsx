"use client";

import { Box, Flex, Text, Heading, Icon, SimpleGrid, Tooltip } from "@chakra-ui/react";
import { FaWordpress, FaPhp, FaReact, FaGitAlt, FaNodeJs, FaFigma } from "react-icons/fa";
import { SiNextdotjs, SiTypescript, SiTailwindcss, SiJavascript, SiPostgresql, SiFirebase } from "react-icons/si";

interface StackItem {
  name: string;
  icon: any;
  color: string;
}

const STACKS: StackItem[] = [
  { name: "React", icon: FaReact, color: "#61DAFB" },
  { name: "Next.js", icon: SiNextdotjs, color: "white" },
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
  { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
  { name: "WordPress", icon: FaWordpress, color: "#21759B" },
  { name: "PHP", icon: FaPhp, color: "#777BB4" },
  { name: "Node.js", icon: FaNodeJs, color: "#339933" },
  { name: "Git", icon: FaGitAlt, color: "#F05032" },
];

export function StacksCard() {
  return (
    <Box
      bg="rgba(32, 32, 36, 0.4)"
      backdropFilter="blur(16px)"
      borderRadius="2xl"
      p={8}
      mt={6}
      boxShadow="0 8px 32px 0 rgba(0, 0, 0, 0.37)"
      border="1px solid"
      borderColor="whiteAlpha.100"
    >
      <Heading size="md" color="gray.100" mb={6} display="flex" alignItems="center" gap={2}>
        Stacks & Ferramentas
      </Heading>

      <Flex wrap="wrap" gap={6} justify="center">
        {STACKS.map((stack) => (
          <Box
            key={stack.name}
            as="span"
            transition="transform 0.2s ease"
            _hover={{ transform: "scale(1.15)" }}
            cursor="default"
            display="inline-flex"
            title={stack.name}
          >
            <Icon as={stack.icon} color={stack.color} fontSize="32px" />
          </Box>
        ))}
      </Flex>
    </Box>
  );
}
