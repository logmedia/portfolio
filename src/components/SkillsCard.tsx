"use client";

import { Box, Flex, Text, Stack, Heading, Icon, useColorModeValue } from "@chakra-ui/react";
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
  const bg = useColorModeValue("rgba(255, 255, 255, 0.6)", "rgba(32, 32, 36, 0.4)");
  const borderColor = useColorModeValue("white", "whiteAlpha.100");
  const headingColor = useColorModeValue("gray.800", "gray.100");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const subTextColor = useColorModeValue("gray.500", "gray.400");
  const trackBg = useColorModeValue("gray.200", "whiteAlpha.100");
  const cardShadow = useColorModeValue("0 4px 20px 0 rgba(0, 0, 0, 0.05)", "0 8px 32px 0 rgba(0, 0, 0, 0.37)");

  return (
    <Box
      bg={bg}
      backdropFilter="blur(16px)"
      borderRadius="2xl"
      p={{ base: 5, md: 8 }}
      boxShadow={cardShadow}
      border="1px solid"
      borderColor={borderColor}
    >
      <Heading size="md" color={headingColor} mb={6} display="flex" alignItems="center" gap={2}>
        Habilidades
      </Heading>

      <Stack spacing={6}>
        {SKILLS.map((skill) => (
          <Box key={skill.name}>
            <Flex justify="space-between" align="center" mb={2}>
              <Flex align="center" gap={2}>
                <Icon as={skill.icon} color={skill.color} fontSize="20px" />
                <Text color={textColor} fontWeight="medium" fontSize="sm">
                  {skill.name}
                </Text>
              </Flex>
              <Text color={subTextColor} fontSize="xs">
                {skill.level}%
              </Text>
            </Flex>
            <Box h="6px" w="full" bg={trackBg} borderRadius="full" overflow="hidden">
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
