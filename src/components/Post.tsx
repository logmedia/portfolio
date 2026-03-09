"use client";

import { useState } from "react";
import { Box, Flex, Text, Button, Heading } from "@chakra-ui/react";
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

  return (
    <Box
      as="article"
      bg="rgba(32, 32, 36, 0.4)"
      backdropFilter="blur(16px)"
      borderRadius="2xl"
      boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
      border="1px solid"
      borderColor="whiteAlpha.100"
      transition="all 0.3s ease"
      _hover={{ boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)", transform: "translateY(-4px)" }}
      overflow="hidden"
      display="flex"
      flexDirection="column"
    >
      <Box h={{ base: "200px", md: "240px" }} overflow="hidden" position="relative" bg="blackAlpha.500">
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
                bg="brand.500" 
                color="white" 
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

        <Heading size="lg" color="white" mb={3} lineHeight="short">
          {post.title}
        </Heading>
        
        <Text color="gray.400" mb={6} fontSize="md" lineHeight="tall" sx={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {post.subtitle || "Sem subtítulo disponível."}
        </Text>

        <Flex mt="auto" pt={4} align="center" justify="space-between" borderTop="1px solid" borderColor="whiteAlpha.100">
          <Text as="time" fontSize="sm" color="whiteAlpha.500" dateTime={publishedAt.toISOString()}>
            {new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(publishedAt)}
          </Text>
          
          <Box 
            as="a" 
            href={`/post/${post.slug}`} 
            bg="whiteAlpha.100"
            color="white"
            px={6}
            py={2}
            borderRadius="lg"
            _hover={{ bg: "brand.500", textDecoration: "none" }}
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
