'use client';

import { useState, useTransition } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import Link from "next/link";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Divider,
  Heading,
  HStack,
  Icon,
  Stack,
  Tag,
  Text,
  Textarea,
  useToast,
  Flex,
  useColorModeValue,
  Badge,
  VStack,
  CircularProgress,
  CircularProgressLabel,
  SimpleGrid,
  Tooltip,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { ArrowLeft, BookOpen, Clock, Crosshair, Code, GitMerge, ChartBar, Globe } from "phosphor-react";
import { getIconComponent } from "@/lib/utils/icons";

import type { Comment, Post, Profile, GalleryItem } from "@/types/content";
import { createComment } from "@/app/actions";
import { GalleryCarousel } from "@/components/gallery-carousel";

const pulseRing = keyframes`
  0% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(72, 187, 120, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(72, 187, 120, 0); }
  100% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(72, 187, 120, 0); }
`;


const markdownComponents = (textColor: string, headingColor: string): Components => ({
  h1: ({node, ...props}: any) => <Heading size="xl" mt={10} mb={4} color={headingColor} {...props} />,
  h2: ({node, ...props}: any) => <Heading size="lg" mt={8} mb={3} color={headingColor} {...props} />,
  h3: ({node, ...props}: any) => <Heading size="md" mt={6} mb={2} color={headingColor} {...props} />,
  p: ({node, ...props}: any) => (
    <Text fontSize="lg" color={textColor} lineHeight="tall" mb={6} {...props} />
  ),
  ul: ({node, children, ...props}: any) => (
    <Box as="ul" pl={6} mb={6} sx={{ '& > li': { mb: 2 } }} {...props}>
      {children}
    </Box>
  ),
  li: ({node, ...props}: any) => <Box as="li" fontSize="md" color={textColor} {...props} />,
  code: ({node, inline, ...props}: any) => (
    <Box 
      as="code" 
      bg="whiteAlpha.100" 
      px={2} 
      py={0.5} 
      borderRadius="md" 
      fontFamily="monospace" 
      fontSize="sm" 
      {...props} 
    />
  ),
});

type PostDetailClientProps = {
  post: Post;
  comments: Comment[];
  profile: Profile;
};

export function PostDetailClient({ post, comments, profile }: PostDetailClientProps) {
  const toast = useToast();
  const [isPending, startTransition] = useTransition();

  // Dynamic Colors
  const bg = useColorModeValue("gray.50", "#05080c");
  const cardBg = useColorModeValue("white", "rgba(32, 32, 36, 0.4)");
  const telemetryBg = useColorModeValue("gray.100", "rgba(20, 20, 23, 0.3)");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const headingColor = useColorModeValue("gray.800", "white");
  const textColor = useColorModeValue("gray.700", "gray.300");
  const subTextColor = useColorModeValue("gray.500", "whiteAlpha.500");
  const iconBg = useColorModeValue("white", "whiteAlpha.50");
  const emptyBarColor = useColorModeValue("gray.200", "whiteAlpha.200");
  const nextJsColor = useColorModeValue("black", "white");

  const publishedAt = post.published_at ? new Date(post.published_at) : new Date();
  const performanceScore = post.performance ?? 100;
  const difficulty = post.difficulty ?? 1;

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await createComment(formData);
      if (!result.success) {
        toast({
          title: result.message ?? "Erro ao enviar comentário",
          status: "error",
        });
        return;
      }
      toast({ title: "Comentário enviado para revisão", status: "success" });
    });
  };

  return (
    <Box bg={bg} minH="100vh" py={{ base: 10, md: 20 }}>
      <Container maxW="6xl">
        <Button 
          as={Link} 
          href="/" 
          variant="ghost" 
          leftIcon={<Icon as={ArrowLeft} />} 
          mb={8}
          color={subTextColor}
          _hover={{ color: "brand.500", bg: "transparent" }}
        >
          Voltar para o feed
        </Button>

        <Card 
          bg={cardBg} 
          backdropFilter="blur(16px)" 
          borderColor={borderColor} 
          borderWidth="1px" 
          borderRadius="3xl"
          overflow="hidden"
          boxShadow="2xl"
          mb={12}
        >
          {/* Header Area */}
          <Box borderBottom="1px solid" borderColor={borderColor} px={{ base: 6, md: 10 }} py={6}>
            <Flex justify="space-between" align="center" mb={6}>
              <HStack spacing={3}>
                <Icon as={BookOpen} color="gray.400" fontSize="24px" />
                <Text fontWeight="bold" fontSize={{ base: "md", md: "xl" }} color={headingColor} fontFamily="monospace">
                  <Box as="span" color="brand.500">logmedia</Box>
                  <Box as="span" color="gray.500" mx={2}>/</Box>
                  {post.slug}
                </Text>
              </HStack>
              <Badge 
                colorScheme="green" 
                variant="subtle" 
                borderRadius="full" 
                px={4} 
                py={1.5} 
                display="flex" 
                alignItems="center" 
                gap={2}
                fontSize="xs"
              >
                <Box w="8px" h="8px" borderRadius="full" bg="green.400" animation={`${pulseRing} 2s infinite`} />
                operational
              </Badge>
            </Flex>
            
            <Heading size="2xl" color={headingColor} mb={4} letterSpacing="tight">
              {post.title}
            </Heading>
            <Text color={textColor} fontSize="xl" maxW="3xl">
              {post.subtitle}
            </Text>
          </Box>

          <Flex direction={{ base: "column", lg: "row" }}>
            {/* Left Content Column */}
            <Box flex="1" p={{ base: 6, md: 10 }} borderRight={{ lg: "1px solid" }} borderColor={borderColor}>
              {post.hero_image_url && (
                <Box borderRadius="2xl" overflow="hidden" mb={10} border="1px solid" borderColor={borderColor}>
                  <img src={post.hero_image_url} alt={post.title} style={{ width: "100%", height: "auto" }} />
                </Box>
              )}

              <Box className="markdown-content">
                <ReactMarkdown components={markdownComponents(textColor, headingColor)}>
                  {post.content ?? "Conteúdo em breve."}
                </ReactMarkdown>
              </Box>

              {post.gallery && post.gallery.length > 0 && (
                <Box mt={16}>
                  <Heading size="md" mb={6} color={headingColor}>Galeria do Projeto</Heading>
                  <GalleryCarousel items={post.gallery as unknown as GalleryItem[]} />
                </Box>
              )}
            </Box>

            {/* Right Telemetry Column */}
            <Box w={{ base: "100%", lg: "320px" }} bg={telemetryBg} p={{ base: 6, md: 8 }}>
              <VStack spacing={10} align="stretch" position="sticky" top="40px">
                {/* Score Section */}
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color={subTextColor} textTransform="uppercase" letterSpacing="wider" mb={4}>
                    Métricas de Performance
                  </Text>
                  <Flex align="center" gap={6} bg={cardBg} p={5} borderRadius="2xl" border="1px solid" borderColor={borderColor}>
                    <CircularProgress value={performanceScore} color="brand.500" size="70px" thickness="10px" trackColor={emptyBarColor}>
                      <CircularProgressLabel fontSize="sm" fontWeight="bold" color={headingColor}>
                        {performanceScore}%
                      </CircularProgressLabel>
                    </CircularProgress>
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="bold" color={headingColor}>Lighthouse</Text>
                      <Text fontSize="xs" color={subTextColor}>Optimized Build</Text>
                    </VStack>
                  </Flex>
                </Box>

                {/* Complexity Section */}
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color={subTextColor} textTransform="uppercase" letterSpacing="wider" mb={4}>
                    Nível de Complexidade
                  </Text>
                  <VStack align="stretch" spacing={2}>
                    <HStack justify="space-between">
                      <Text fontSize="sm" fontWeight="semibold" color={headingColor}>Dificuldade</Text>
                      <Text fontSize="sm" fontWeight="bold" color="brand.500">Tier {difficulty}</Text>
                    </HStack>
                    <HStack spacing={1.5}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Box 
                          key={i} 
                          h="8px" 
                          flex="1" 
                          borderRadius="full" 
                          bg={i < difficulty ? (difficulty >= 4 ? "orange.400" : "brand.500") : emptyBarColor}
                        />
                      ))}
                    </HStack>
                  </VStack>
                </Box>

                {/* Stacks Section */}
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color={subTextColor} textTransform="uppercase" letterSpacing="wider" mb={4}>
                    Tecnologias Envolvidas
                  </Text>
                  <Flex gap={3} flexWrap="wrap">
                    {post.stacks && post.stacks.length > 0 ? post.stacks.map(stack => {
                      const ResolvedIcon = getIconComponent(stack.icon);
                      const stackColor = stack.color || "brand.500";
                      
                      return (
                        <Tooltip key={stack.id} label={stack.name} hasArrow>
                          <Flex 
                            align="center" 
                            justify="center" 
                            w="45px" 
                            h="45px" 
                            bg={iconBg} 
                            borderRadius="xl" 
                            border="1px solid" 
                            borderColor={borderColor}
                            _hover={{ borderColor: stackColor, transform: "scale(1.1)" }}
                            transition="all 0.2s"
                          >
                            <Icon as={ResolvedIcon} color={stack.icon?.toLowerCase() === 'nextjs' ? nextJsColor : stackColor} fontSize="22px" />
                          </Flex>
                        </Tooltip>
                      );
                    }) : (
                      <Text fontSize="sm" color={subTextColor}>Nenhuma stack listada.</Text>
                    )}
                  </Flex>
                </Box>

                <Divider borderColor={borderColor} />

                {/* Meta Section */}
                <VStack align="stretch" spacing={4}>
                  <HStack color={subTextColor} fontSize="sm">
                    <Icon as={GitMerge} />
                    <Text fontFamily="monospace">Deployed on {new Intl.DateTimeFormat('pt-BR').format(publishedAt)}</Text>
                  </HStack>
                  <HStack color={subTextColor} fontSize="sm">
                    <Icon as={Clock} />
                    <Text fontFamily="monospace">{post.content ? Math.max(1, Math.ceil(post.content.length / 500)) : 1} min technical read</Text>
                  </HStack>
                  {post.external_link && (
                    <Button 
                      as="a" 
                      href={post.external_link} 
                      target="_blank" 
                      leftIcon={<Icon as={Globe} />}
                      colorScheme="brand"
                      size="lg"
                      borderRadius="xl"
                      mt={4}
                    >
                      Acessar Live App
                    </Button>
                  )}
                </VStack>
              </VStack>
            </Box>
          </Flex>
        </Card>

        {/* Comments Section */}
        <Box id="comments" maxW="4xl">
          <Heading size="lg" mb={8} color={headingColor}>Discussão do Case</Heading>
          
          <Card bg={cardBg} borderColor={borderColor} borderRadius="2xl" mb={8} borderStyle="dashed">
            <CardBody p={8}>
              <form action={handleSubmit}>
                <input type="hidden" name="postId" value={post.id} />
                <input type="hidden" name="postSlug" value={post.slug} />
                <Stack spacing={4}>
                  <Textarea
                    name="content"
                    placeholder="Contribuir com o projeto ou tirar dúvida..."
                    minH="120px"
                    bg={useColorModeValue("white", "blackAlpha.400")}
                    borderColor={borderColor}
                    _focus={{ borderColor: "brand.500", boxShadow: "none" }}
                    borderRadius="xl"
                  />
                  <Button type="submit" isLoading={isPending} colorScheme="brand" borderRadius="xl" size="lg">
                    Publicar Comentário_
                  </Button>
                </Stack>
              </form>
            </CardBody>
          </Card>

          <Stack spacing={6}>
            {comments.map((comment) => (
              <Box 
                key={comment.id} 
                p={6} 
                bg={cardBg} 
                borderRadius="2xl" 
                border="1px solid" 
                borderColor={borderColor}
              >
                <HStack spacing={4} mb={4}>
                  <Avatar size="sm" src={comment.author?.avatar_url} name={comment.author?.name ?? "Visitante"} />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold" color={headingColor}>{comment.author?.name ?? "Anônimo"}</Text>
                    <Text fontSize="xs" color={subTextColor}>
                      {new Date(comment.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })}
                    </Text>
                  </VStack>
                </HStack>
                <Text color={textColor}>{comment.content}</Text>
              </Box>
            ))}
            {comments.length === 0 && (
              <Text textAlign="center" color={subTextColor} py={10}>Nenhum feedback registrado ainda.</Text>
            )}
          </Stack>
        </Box>

        {/* Profile Footer */}
        <Flex mt={24} direction="column" align="center" gap={4}>
          <Avatar size="xl" src={profile.avatar_url} name={profile.name} border="4px solid" borderColor="brand.500" />
          <VStack spacing={1}>
            <Text fontWeight="bold" fontSize="lg" color={headingColor}>{profile.name}</Text>
            <Text color={subTextColor}>{profile.role}</Text>
          </VStack>
          <Text fontSize="sm" color={subTextColor} mt={4}>
            Quer saber mais sobre este projeto? Entre em contato.
          </Text>
        </Flex>
      </Container>
    </Box>
  );
}
