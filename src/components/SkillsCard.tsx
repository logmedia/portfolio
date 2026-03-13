"use client";

import { Box, Flex, Text, Stack, Heading, Icon, useColorModeValue } from "@chakra-ui/react";
import * as PhosphorIcons from "phosphor-react";
import { Code, Lightning } from "phosphor-react";
import { 
  TbBrandAdobePhotoshop, TbBrandAdobeIllustrator, TbBrandAdobeAfterEffect,
  TbBrandAdobeIndesign, TbBrandFigma, TbBrandTailwind, TbBrandNextjs,
  TbBrandReact, TbBrandTypescript, TbBrandNodejs, TbBrandSupabase,
  TbBrandAdobe
} from "react-icons/tb";

// Brand icons map (Identical to admin to ensure consistency)
const BRAND_ICONS: Record<string, any> = {
  TbBrandAdobePhotoshop, TbBrandAdobeIllustrator, TbBrandAdobeAfterEffect,
  TbBrandAdobeIndesign, TbBrandFigma, TbBrandTailwind, TbBrandNextjs,
  TbBrandReact, TbBrandTypescript, TbBrandNodejs, TbBrandSupabase,
  TbBrandAdobe
};

interface Skill {
  name: string;
  level: number;
  icon: string;
  color?: string;
  customSvg?: string;
}

interface SkillsCardProps {
  skills?: Skill[];
}

export function SkillsCard({ skills }: SkillsCardProps) {
  const bg = useColorModeValue("whiteAlpha.500", "whiteAlpha.500");
  const borderColor = useColorModeValue("whiteAlpha.300", "whiteAlpha.200");
  const headingColor = useColorModeValue("gray.800", "gray.100");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const subTextColor = useColorModeValue("gray.500", "gray.400");
  const trackBg = useColorModeValue("gray.200", "whiteAlpha.100");
  const cardShadow = useColorModeValue("xl", "2xl");

  const getIconComponent = (iconName: string, customSvg?: string) => {
    if (iconName === "custom" && customSvg) {
      return () => (
        <Box 
          dangerouslySetInnerHTML={{ __html: customSvg }} 
          boxSize="full"
          sx={{ 'svg': { width: '100%', height: '100%', fill: 'currentColor' } }}
        />
      );
    }
    if (BRAND_ICONS[iconName]) return BRAND_ICONS[iconName];
    return (PhosphorIcons as any)[iconName] || (PhosphorIcons as any)[iconName + "Logo"] || Code;
  };

  return (
    <Box
      bg={bg}
      backdropFilter="blur(16px)"
      borderRadius="2xl"
      p={{ base: 5, md: 8 }}
      boxShadow={cardShadow}
      border="1px solid"
      borderColor={borderColor}
      mb={6}
    >
      <Heading size="md" color={headingColor} mb={6} display="flex" alignItems="center" gap={2}>
        <Icon as={Lightning} color="brand.500" />
        Habilidades
      </Heading>

      <Stack spacing={6}>
        {(skills || []).map((skill, index) => {
          const IconComponent = getIconComponent(skill.icon, skill.customSvg);
          const skillColor = skill.color || "#0BC5EA"; // cyan.400 approx or brand
          
          return (
            <Box key={`${skill.name}-${index}`}>
              <Flex justify="space-between" align="center" mb={2}>
                <Flex align="center" gap={2}>
                  <Icon 
                    as={IconComponent} 
                    color={skillColor} 
                    fontSize="20px"
                    transition="all 0.3s"
                    _hover={{ transform: 'scale(1.2)' }}
                  />
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
