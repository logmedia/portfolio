"use client";

import React, { useRef, useState } from "react";
import {
  Box,
  VStack,
  Heading,
  Text,
  Avatar,
  Card,
  CardBody,
  Link,
  Tag,
  TagLabel,
  HStack,
  Icon,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { ArrowRight } from "lucide-react";
import { getIconComponent } from "@/lib/utils/icons";
import type { Profile } from "@/types/content";

interface TalentCardProps {
  profile: Profile;
}

export function TalentCard({ profile }: TalentCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <NextLink
      href={`/${profile.github_username || profile.id}`}
      passHref
      legacyBehavior
    >
      <Link _hover={{ textDecoration: 'none' }} h="full">
        <Card
          ref={cardRef}
          h="full"
          bg="whiteAlpha.50"
          borderColor="whiteAlpha.200"
          borderWidth="1px"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          _hover={{
            transform: 'translateY(-8px)',
            borderColor: 'brand.500',
            bg: 'whiteAlpha.100',
            boxShadow: "0 10px 30px -10px rgba(0, 229, 255, 0.2)"
          }}
          transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
          borderRadius="2xl"
          overflow="hidden"
          position="relative"
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(500px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 229, 255, 0.06), transparent 40%)`,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.4s',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          {/* Spotlight border effect - Sharper reflection */}
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            borderRadius="2xl"
            pointerEvents="none"
            zIndex={2}
            style={{
              background: `radial-gradient(180px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.9), rgba(0, 229, 255, 0.4) 30%, transparent 70%)`,
            }}
            opacity={isHovered ? 1 : 0}
            transition="opacity 0.3s"
            sx={{
              WebkitMaskImage: 'linear-gradient(black, black), linear-gradient(black, black)',
              WebkitMaskClip: 'content-box, border-box',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              padding: '1.5px', // Slightly thicker hit for the light
            }}
          />

          <CardBody p={8} position="relative" zIndex={3}>
            <VStack spacing={6} h="full">
              <Box position="relative">
                <Avatar
                  size="2xl"
                  name={profile.name}
                  src={profile.avatar_url}
                  border="3px solid"
                  borderColor="brand.500"
                  p={1}
                  bg="blackAlpha.500"
                />
              </Box>

              <VStack spacing={2}>
                <Heading size="md" color="white" textAlign="center">{profile.name}</Heading>
                <Text color="brand.400" fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="2px">
                  {profile.job_title || 'Profissional'}
                </Text>
              </VStack>

              <Text color="whiteAlpha.500" fontSize="sm" noOfLines={3} textAlign="center" lineHeight="shorter">
                {profile.bio || "Este profissional ainda não preencheu sua biografia."}
              </Text>

              <Box flex="1" w="full">
                {profile.skills && Array.isArray(profile.skills) && profile.skills.length > 0 ? (
                  <HStack spacing={2} wrap="wrap" justify="center">
                    {profile.skills.slice(0, 3).map((skill: any, idx: number) => {
                      const SkillIcon = getIconComponent(skill.icon || 'Code');
                      const brandColor = "var(--chakra-colors-brand-500)";
                      return (
                        <Tag
                          key={idx}
                          size="md"
                          variant="solid"
                          bg="rgba(255, 255, 255, 0.08)"
                          backdropFilter="blur(8px)"
                          border="1px solid"
                          borderColor="whiteAlpha.300"
                          color="white"
                          borderRadius="full"
                          px={4}
                          py={2}
                          boxShadow={`0 4px 12px rgba(0, 0, 0, 0.5)`}
                          _hover={{ bg: "whiteAlpha.200", transform: "translateY(-1px)", borderColor: brandColor }}
                          transition="all 0.2s"
                        >
                          <HStack spacing={2}>
                            <Icon as={SkillIcon} color={brandColor} fontSize="14px" />
                            <TagLabel fontSize="11px" fontWeight="800" letterSpacing="widest" textTransform="uppercase" color="white">
                              {skill.name}
                            </TagLabel>
                          </HStack>
                        </Tag>
                      );
                    })}
                    {profile.skills.length > 3 && (
                      <Text fontSize="xs" color="whiteAlpha.400">+{profile.skills.length - 3}</Text>
                    )}
                  </HStack>
                ) : (
                  <HStack justify="center" opacity={0.3}>
                    <Text fontSize="10px" textTransform="uppercase" letterSpacing="1px">Perifil sem expertises definidas</Text>
                  </HStack>
                )}
              </Box>

              <HStack color="brand.500" fontWeight="bold" fontSize="sm" pt={4} spacing={2} _groupHover={{ transform: 'translateX(4px)' }} transition="all 0.2s">
                <Text>Ver Portfólio Completo</Text>
                <ArrowRight size={16} />
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      </Link>
    </NextLink>
  );
}
