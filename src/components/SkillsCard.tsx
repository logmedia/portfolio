"use client";

import { Box, Flex, Text, Stack, Heading, Icon, useColorModeValue } from "@chakra-ui/react";
import { Cpu, Palette, Code, Database, BracketsCurly, Lightning } from "phosphor-react";

interface Skill {
  name: string;
  level: number;
  icon: any;
  color: string;
}

const ICON_MAP: Record<string, any> = {
  Code,
  Palette,
  Database,
  Lightning,
  BracketsCurly,
  Cpu,
};

const COLOR_MAP: Record<string, string> = {
  Code: "cyan.400",
  Palette: "pink.400",
  Database: "purple.400",
  Lightning: "yellow.400",
  BracketsCurly: "blue.400",
  Cpu: "green.400",
};

interface SkillsCardProps {
  skills?: any[];
}

export function SkillsCard({ skills }: SkillsCardProps) {
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
        {(skills || []).map((skill) => {
          const IconComponent = ICON_MAP[skill.icon] || Code;
          const skillColor = COLOR_MAP[skill.icon] || "brand.500";
          
          return (
            <Box key={skill.name}>
              <Flex justify="space-between" align="center" mb={2}>
                <Flex align="center" gap={2}>
                  <Icon as={IconComponent} color={skillColor} fontSize="20px" />
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
                  bgGradient={`linear(to-r, ${skillColor}, brand.500)`}
                  transition="width 1s ease-in-out"
                />
              </Box>
            </Box>
          );
        })}
        {(!skills || skills.length === 0) && (
          <Text fontSize="sm" color={subTextColor}>Configure suas skills no painel admin.</Text>
        )}
      </Stack>
    </Box>
  );
}
