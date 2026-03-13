"use client";

import { Box, Flex, Text, Heading, Icon, SimpleGrid, Tooltip, useColorModeValue } from "@chakra-ui/react";
import { FaWordpress, FaPhp, FaReact, FaGitAlt, FaNodeJs, FaFigma } from "react-icons/fa";
import { SiNextdotjs, SiTypescript, SiTailwindcss, SiJavascript, SiPostgresql, SiFirebase, SiSupabase } from "react-icons/si";

const ICON_MAP: Record<string, any> = {
  "React": { icon: FaReact, color: "#61DAFB" },
  "Next.js": { icon: SiNextdotjs, color: "white" },
  "TypeScript": { icon: SiTypescript, color: "#3178C6" },
  "Tailwind CSS": { icon: SiTailwindcss, color: "#06B6D4" },
  "WordPress": { icon: FaWordpress, color: "#21759B" },
  "PHP": { icon: FaPhp, color: "#777BB4" },
  "Node.js": { icon: FaNodeJs, color: "#339933" },
  "Git": { icon: FaGitAlt, color: "#F05032" },
  "Figma": { icon: FaFigma, color: "#F24E1E" },
  "Supabase": { icon: SiSupabase, color: "#3ECF8E" },
  "Firebase": { icon: SiFirebase, color: "#FFCA28" },
  "JavaScript": { icon: SiJavascript, color: "#F7DF1E" },
  "PostgreSQL": { icon: SiPostgresql, color: "#4169E1" },
};

interface StacksCardProps {
  stacks?: string[];
}

export function StacksCard({ stacks }: StacksCardProps) {
  const bg = useColorModeValue("whiteAlpha.50", "whiteAlpha.50");
  const borderColor = useColorModeValue("whiteAlpha.200", "whiteAlpha.100");
  const headingColor = useColorModeValue("gray.800", "gray.100");
  const cardShadow = useColorModeValue("lg", "xl");
  
  // Custom logic to flip the Next.js icon black when in light mode
  const nextJsColor = useColorModeValue("black", "white");

  return (
    <Box
      bg={bg}
      backdropFilter="blur(16px)"
      borderRadius="2xl"
      p={{ base: 5, md: 8 }}
      mt={6}
      boxShadow={cardShadow}
      border="1px solid"
      borderColor={borderColor}
    >
      <Heading size="md" color={headingColor} mb={6} display="flex" alignItems="center" gap={2}>
        Stacks & Ferramentas
      </Heading>

      <Flex wrap="wrap" gap={6} justify="center">
        {(stacks || []).map((stackName) => {
          const item = ICON_MAP[stackName] || { icon: FaGitAlt, color: "gray.400" };
          return (
            <Box
              key={stackName}
              as="span"
              transition="transform 0.2s ease"
              _hover={{ transform: "scale(1.15)" }}
              cursor="default"
              display="inline-flex"
              title={stackName}
            >
              <Icon as={item.icon} color={stackName === "Next.js" ? nextJsColor : item.color} fontSize="32px" />
            </Box>
          );
        })}
        {(!stacks || stacks.length === 0) && (
          <Text fontSize="sm" color="whiteAlpha.500">Nenhuma stack listada.</Text>
        )}
      </Flex>
    </Box>
  );
}
