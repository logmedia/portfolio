"use client";

import { useState } from "react";
import { Box, Flex, Text, Heading, useColorModeValue, Badge, Icon, HStack, VStack, CircularProgress, CircularProgressLabel, Tooltip } from "@chakra-ui/react";
import Link from "next/link";
import { keyframes } from "@emotion/react";
import type { Post as PostType, Profile } from "@/types/content";

import { BookOpen, Clock, Crosshair, Code, GitMerge, ChartBar } from "phosphor-react";
import { getIconComponent } from "@/lib/utils/icons";
import Image from "next/image";

interface PostProps {
  post: PostType;
  profile: Profile;
}

const pulseRing = keyframes`
  0% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(72, 187, 120, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(72, 187, 120, 0); }
  100% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(72, 187, 120, 0); }
`;


export function Post({ post, profile }: PostProps) {
  const [imgSrc, setImgSrc] = useState(post.hero_image_url || "/nano_banana.png");
  
  const publishedAt = post.published_at ? new Date(post.published_at) : new Date();

  // Dynamic Colors
  const bg = useColorModeValue("whiteAlpha.50", "whiteAlpha.50");
  const telemetryBg = useColorModeValue("blackAlpha.50", "blackAlpha.50");
  const borderColor = useColorModeValue("whiteAlpha.300", "whiteAlpha.200");
  const headingColor = useColorModeValue("gray.800", "white");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const metaTextColor = useColorModeValue("gray.500", "whiteAlpha.500");
  const cardShadow = useColorModeValue("xl", "2xl");
  const hoverShadow = useColorModeValue("2xl", "dark-lg");
  const btnBg = useColorModeValue("gray.100", "whiteAlpha.100");
  const btnColor = useColorModeValue("gray.800", "white");
  
  const iconBg = useColorModeValue("white", "whiteAlpha.100");
  const iconBorder = useColorModeValue("gray.200", "whiteAlpha.50");
  const nextJsColor = useColorModeValue("black", "white");
  const emptyBarColor = useColorModeValue("gray.200", "whiteAlpha.200");

  const performanceScore = post.performance ?? 100;
  const rating = post.difficulty ?? 1;

  return (
    <Box
      as="article"
      bg={bg}
      backdropFilter="blur(16px)"
      borderRadius="2xl"
      boxShadow={cardShadow}
      border="1px solid"
      borderColor={borderColor}
      transition="all 0.3s ease"
      _hover={{ boxShadow: hoverShadow, transform: "translateY(-4px)", borderColor: "brand.500" }}
      overflow="hidden"
      display="flex"
      flexDirection="column"
    >
      {/* Target Repo Header */}
      <Flex justify="space-between" align="center" px={{ base: 4, md: 6 }} py={4} borderBottom="1px solid" borderColor={borderColor}>
        <HStack spacing={3}>
          <Icon as={BookOpen} color="gray.400" fontSize="20px" />
          <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }} color={headingColor} fontFamily="monospace">
            <Link href={`/${post.author?.github_username || profile.github_username || ""}`}>
              <Box as="span" color="brand.500" _hover={{ textDecoration: "underline" }}>
                {post.author?.github_username || profile.github_username || "logmedia"}
              </Box>
            </Link>
            <Box as="span" color="gray.500" mx={2}>/</Box>
            {post.slug}
          </Text>
        </HStack>
        <Badge 
          colorScheme="green" 
          variant="subtle" 
          borderRadius="full" 
          px={{ base: 2, md: 3 }} 
          py={1} 
          textTransform="lowercase" 
          display="flex" 
          alignItems="center" 
          gap={2}
          fontSize="xs"
        >
          <Box w="6px" h="6px" borderRadius="full" bg="green.400" animation={`${pulseRing} 2s infinite`} />
          operational
        </Badge>
      </Flex>

      <Flex direction={{ base: "column", md: "row" }}>
        {/* Left Side: Telemetry & Cover Image Thumbnail */}
        <Box 
          w={{ base: "100%", md: "260px" }} 
          borderRight={{ md: "1px solid" }} 
          borderBottom={{ base: "1px solid", md: "none" }} 
          borderColor={borderColor} 
          p={{ base: 5, md: 6 }} 
          bg={telemetryBg}
        >
          <VStack spacing={6} align="stretch">
            {/* Small Hero Image */}
            <Box h="120px" borderRadius="xl" overflow="hidden" position="relative" border="1px solid" borderColor={borderColor}>
              <Image 
                src={imgSrc} 
                alt={`Capa do post ${post.title}`}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 260px"
                onError={() => setImgSrc("/nano_banana.png")}
              />
            </Box>
            
            {/* Performance Speedometer */}
            <Box>
              <Flex justify="space-between" mb={3} align="center">
                <Text fontSize="xs" fontWeight="bold" color={metaTextColor} textTransform="uppercase" letterSpacing="wider">
                  Performance
                </Text>
                <Icon as={ChartBar} color="brand.500" />
              </Flex>
              <HStack spacing={4}>
                <CircularProgress value={performanceScore} color="brand.500" size="50px" thickness="8px" trackColor={emptyBarColor}>
                  <CircularProgressLabel fontSize="xs" fontWeight="bold" color={headingColor}>
                    {performanceScore}%
                  </CircularProgressLabel>
                </CircularProgress>
                <VStack align="start" spacing={0}>
                  <Text fontSize="sm" fontWeight="bold" color={headingColor}>Lighthouse</Text>
                  <Text fontSize="xs" color={metaTextColor}>SEO & Speed</Text>
                </VStack>
              </HStack>
            </Box>
            
            {/* Difficulty / Rating */}
            <Box>
              <Flex justify="space-between" mb={3} align="center">
                <Text fontSize="xs" fontWeight="bold" color={metaTextColor} textTransform="uppercase" letterSpacing="wider">
                  Complexidade
                </Text>
                <Icon as={Crosshair} color={rating >= 4 ? "orange.400" : "brand.500"} />
              </Flex>
              <HStack spacing={1} w="100%">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Box 
                    key={i} 
                    h="6px" 
                    flex="1" 
                    borderRadius="sm" 
                    bg={
                      i < rating 
                        ? (rating >= 4 ? "orange.400" : rating === 3 ? "yellow.400" : "brand.500") 
                        : emptyBarColor
                    } 
                    transition="background 0.3s"
                  />
                ))}
              </HStack>
            </Box>
          </VStack>
        </Box>

        {/* Right Side: Content & Actions */}
        <Box flex="1" p={{ base: 5, md: 8 }} display="flex" flexDirection="column">
          
          <Heading size="lg" color={headingColor} mb={3} lineHeight="short" letterSpacing="tight">
            {post.title}
          </Heading>
          
          <Text color={textColor} mb={8} fontSize="md" lineHeight="tall" sx={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {post.subtitle || "Sem subtítulo disponível."}
          </Text>

          {/* Stacks Overlay */}
          <Box mb={8}>
            <Text fontSize="xs" fontWeight="bold" color={metaTextColor} textTransform="uppercase" letterSpacing="wider" mb={3}>
              Tecnologias Utilizadas
            </Text>
            <Flex gap={3} flexWrap="wrap">
              {post.stacks && post.stacks.length > 0 ? post.stacks.map(stack => {
                const ResolvedIcon = getIconComponent(stack.icon);
                const stackColor = stack.color || "brand.500";
                
                return (
                  <Tooltip key={stack.id} label={stack.name} placement="top" hasArrow bg="gray.800" color="white">
                    <Flex 
                      align="center" 
                      justify="center" 
                      w="40px" 
                      h="40px" 
                      bg={iconBg} 
                      border="1px solid" 
                      borderColor={iconBorder} 
                      borderRadius="lg"
                      boxShadow="sm"
                      _hover={{ borderColor: stackColor, transform: "translateY(-4px)", boxShadow: "md" }}
                      transition="all 0.2s"
                      cursor="default"
                    >
                      <Icon as={ResolvedIcon} color={stack.icon?.toLowerCase() === 'nextjs' ? nextJsColor : stackColor} fontSize="20px" />
                    </Flex>
                  </Tooltip>
                );
              }) : (
                <Text fontSize="sm" color={metaTextColor}>Nenhuma stack listada.</Text>
              )}
            </Flex>
          </Box>

          {/* Footer Actions */}
          <Flex mt="auto" align="center" justify="space-between" borderTop="1px dashed" borderColor={borderColor} pt={5}>
            <HStack color={metaTextColor} fontSize="sm" spacing={{ base: 3, md: 5 }}>
              <HStack spacing={1.5} title="Data de Publicação">
                <Icon as={GitMerge} fontSize="16px" />
                <Text as="time" dateTime={publishedAt.toISOString()} fontFamily="monospace">
                  {new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(publishedAt)}
                </Text>
              </HStack>
              <HStack spacing={1.5} title="Tempo estimado de leitura">
                <Icon as={Clock} fontSize="16px" />
                <Text fontFamily="monospace">
                  {post.content ? Math.max(1, Math.ceil(post.content.length / 500)) : 1}m read
                </Text>
              </HStack>
            </HStack>
            
            <Box 
              as="a" 
              href={`/projeto/${post.slug}`} 
              bg={btnBg}
              color={btnColor}
              px={6}
              py={2.5}
              borderRadius="lg"
              fontSize="sm"
              fontWeight="bold"
              fontFamily="monospace"
              border="1px solid"
              borderColor="transparent"
              _hover={{ bg: "brand.500", color: "white", borderColor: "brand.400", textDecoration: "none" }}
              transition="all 0.2s"
            >
              Exibir Detalhes_
            </Box>
          </Flex>

        </Box>
      </Flex>
    </Box>
  );
}
