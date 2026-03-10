"use client";

import { useState } from "react";
import { Box, Flex, Text, Button, Heading, useColorModeValue } from "@chakra-ui/react";
import NextLink from "next/link";
import type { Post as PostType, Profile } from "@/types/content";

interface PostProps {
  post: PostType;
  profile: Profile;
}

export function Post({ post, profile }: PostProps) {
  const [imgSrc, setImgSrc] = useState(post.hero_image_url || "/nano_banana.png");
  
  const publishedAt = post.published_at 
    ? new Date(post.published_at) 
    : new Date();

  const bg = useColorModeValue("rgba(255, 255, 255, 0.6)", "rgba(32, 32, 36, 0.4)");
  const borderColor = useColorModeValue("white", "whiteAlpha.100");
  const headingColor = useColorModeValue("gray.800", "white");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const metaTextColor = useColorModeValue("gray.500", "whiteAlpha.500");
  const borderTopColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const cardShadow = useColorModeValue("0 4px 20px 0 rgba(0, 0, 0, 0.05)", "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)");
  const hoverShadow = useColorModeValue("0 10px 25px -3px rgba(0, 0, 0, 0.1)", "0 10px 15px -3px rgba(0, 0, 0, 0.2)");
  const btnBg = useColorModeValue("gray.100", "whiteAlpha.100");
  const btnColor = useColorModeValue("gray.800", "white");
  const tagBg = useColorModeValue("brand.100", "brand.500");
  const tagColor = useColorModeValue("brand.700", "white");
  const imgOverlay = useColorModeValue("gray.200", "blackAlpha.500");

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
      _hover={{ boxShadow: hoverShadow, transform: "translateY(-4px)" }}
      overflow="hidden"
      display="flex"
      flexDirection="column"
    >
      <Box h={{ base: "200px", md: "240px" }} overflow="hidden" position="relative" bg={imgOverlay}>
        <img 
          src={imgSrc} 
          alt={`Capa do post ${post.title}`}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={() => {
            setImgSrc("/nano_banana.png");
          }}
        />
      </Box>

      <Box p={{ base: 5, md: 8 }} flex="1" display="flex" flexDirection="column">
        {post.tags && post.tags.length > 0 && (
          <Flex gap={2} mb={4} flexWrap="wrap">
            {post.tags.map(tag => (
              <Box 
                key={tag} 
                px={3} 
                py={1} 
                bg={tagBg} 
                color={tagColor} 
                fontSize="xs" 
                fontWeight="bold" 
                borderRadius="full"
                textTransform="uppercase"
                letterSpacing="wider"
              >
                {tag}
              </Box>
            ))}
          </Flex>
        )}

        <Heading size="lg" color={headingColor} mb={3} lineHeight="short">
          {post.title}
        </Heading>
        
        <Text color={textColor} mb={6} fontSize="md" lineHeight="tall" sx={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {post.subtitle || "Sem subtítulo disponível."}
        </Text>

        <Flex mt="auto" pt={4} align="center" justify="space-between" borderTop="1px solid" borderColor={borderTopColor}>
          <Text as="time" fontSize="sm" color={metaTextColor} dateTime={publishedAt.toISOString()}>
            {new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(publishedAt)}
          </Text>
          
          <Box 
            as="a" 
            href={`/post/${post.slug}`} 
            bg={btnBg}
            color={btnColor}
            px={6}
            py={2}
            borderRadius="lg"
            _hover={{ bg: "brand.500", color: "white", textDecoration: "none" }}
            transition="all 0.2s"
            fontWeight="medium"
          >
            Ver detalhes <Box as="span" ml={1}>→</Box>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}
