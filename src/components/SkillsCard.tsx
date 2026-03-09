"use client";

import { Box, Flex, Text, Stack, Heading, Icon } from "@chakra-ui/react";
import { Cpu, Palette, Code, Database, BracketsCurly, Lightning } from "phosphor-react";

interface Skill {
  name: string;
  level: number;
  icon: any;
  color: string;
}

const SKILLS: Skill[] = [
  { name: "Frontend", level: 95, icon: Code, color: "cyan.400" },
  { name: "UI Design", level: 85, icon: Palette, color: "pink.400" },
  { name: "Backend", level: 80, icon: Database, color: "purple.400" },
  { name: "Performance", level: 90, icon: Lightning, color: "yellow.400" },
  { name: "React/Next.js", level: 98, icon: BracketsCurly, color: "blue.400" },
  { name: "Mobile", level: 75, icon: Cpu, color: "green.400" },
];

export function SkillsCard() {
  return (
    <Box
      bg="rgba(32, 32, 36, 0.4)"
      backdropFilter="blur(16px)"
      borderRadius="2xl"
      p={8}
      boxShadow="0 8px 32px 0 rgba(0, 0, 0, 0.37)"
      border="1px solid"
      borderColor="whiteAlpha.100"
    >
      <Heading size="md" color="gray.100" mb={6} display="flex" alignItems="center" gap={2}>
        Habilidades
      </Heading>

      <Stack spacing={6}>
        {SKILLS.map((skill) => (
          <Box key={skill.name}>
            <Flex justify="space-between" align="center" mb={2}>
              <Flex align="center" gap={2}>
                <Icon as={skill.icon} color={skill.color} fontSize="20px" />
                <Text color="gray.200" fontWeight="medium" fontSize="sm">
                  {skill.name}
                </Text>
              </Flex>
              <Text color="gray.400" fontSize="xs">
                {skill.level}%
              </Text>
            </Flex>
            <Box h="6px" w="full" bg="whiteAlpha.100" borderRadius="full" overflow="hidden">
              <Box
                h="full"
                w={`${skill.level}%`}
                borderRadius="full"
                bgGradient={`linear(to-r, ${skill.color}, brand.500)`}
                transition="width 1s ease-in-out"
              />
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
