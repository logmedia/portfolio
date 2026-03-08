'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";
import { FaGithub, FaLinkedin, FaInstagram, FaGlobe } from "react-icons/fa";
import { Star } from "lucide-react";
import type { Post, Profile } from "@/types/content";

const MotionBox = motion(Box);

const socialIconMap: Record<string, React.ComponentType<{ size?: string | number }>> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  instagram: FaInstagram,
  site: FaGlobe,
};

function getSocialIcon(label: string) {
  const key = label.toLowerCase();
  return socialIconMap[key] ?? FaGlobe;
}

type HomeClientProps = {
  profile: Profile;
  posts: Post[];
};

export function HomeClient({ profile, posts }: HomeClientProps) {
  const featuredPosts = posts.slice(0, 3);

  return (
    <Box bgGradient="linear(to-b, #020305, #050a10, #03080b)" minH="100vh" py={{ base: 16, md: 24 }}>
      <Container maxW="6xl">
        <Flex direction={{ base: "column", md: "row" }} gap={10} align="center" mb={16}>
          <Stack flex="1" spacing={8}>
            <Stack spacing={4}>
              <Tag colorScheme="whiteAlpha" size="lg" w="fit-content" rounded="full">
                Portfólio Vivo · 2026
              </Tag>
              <Heading size="3xl" lineHeight="shorter">
                {profile.name}
              </Heading>
              <Text fontSize="xl" color="whiteAlpha.700">
                {profile.role} · {profile.bio ?? "Crio experiências digitais com foco em movimento e performance."}
              </Text>
            </Stack>
            <HStack spacing={4} wrap="wrap">
              {profile.socials?.map((social) => {
                const IconComp = getSocialIcon(social.label);
                return (
                  <Button
                    as={Link}
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    variant="outline"
                    leftIcon={<Icon as={IconComp} />}
                  >
                    {social.label}
                  </Button>
                );
              })}
            </HStack>
          </Stack>
          <Box flex="0.6">
            <Card variant="filled" bg="whiteAlpha.50" border="1px solid" borderColor="whiteAlpha.200">
              <CardBody>
                <Stack spacing={6}>
                  <Stack direction="row" spacing={4} align="center">
                    <Avatar size="xl" src={profile.avatar_url} name={profile.name} />
                    <Box>
                      <Text fontWeight="bold">Perfil</Text>
                      <Text fontSize="sm" color="whiteAlpha.600">
                        Atualizado constantemente via painel /admin
                      </Text>
                    </Box>
                  </Stack>
                  <Divider borderColor="whiteAlpha.200" />
                  <Stack spacing={3}>
                    <Text fontSize="sm" color="whiteAlpha.600">
                      Stacks favoritas
                    </Text>
                    <HStack spacing={2} wrap="wrap">
                      {(profile.stacks ?? ["Next.js", "React", "Tailwind", "Supabase"]).map((stack) => (
                        <Tag key={stack} colorScheme="whiteAlpha" rounded="full" px={4} py={2}>
                          {stack}
                        </Tag>
                      ))}
                    </HStack>
                  </Stack>
                </Stack>
              </CardBody>
            </Card>
          </Box>
        </Flex>

        <Stack spacing={6} mb={6} direction={{ base: "column", md: "row" }} align={{ base: "flex-start", md: "flex-end" }}>
          <Box flex="1">
            <Heading size="lg">Atualizações recentes</Heading>
            <Text color="whiteAlpha.700">Cases detalhados com rating, galeria e tags inteligentes.</Text>
          </Box>
          <Button as={Link} href="/admin" variant="solid">
            Acessar painel admin
          </Button>
        </Stack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {featuredPosts.map((post, index) => (
            <MotionBox
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card as={Link} href={`/post/${post.slug}`} _hover={{ transform: "translateY(-4px)", transition: "all 0.2s" }}>
                <CardBody>
                  <Stack spacing={4}>
                    <Tag colorScheme="brand" w="fit-content">
                      {post.tags?.[0] ?? "Destaque"}
                    </Tag>
                    <Heading size="md">{post.title}</Heading>
                    <Text color="whiteAlpha.700">{post.subtitle}</Text>
                    <HStack spacing={1} color="yellow.300">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <Icon
                          key={`${post.id}-star-${starIndex}`}
                          as={Star}
                          fill={starIndex < (post.rating ?? 0) ? "currentColor" : "transparent"}
                          strokeWidth={1.2}
                        />
                      ))}
                    </HStack>
                  </Stack>
                </CardBody>
                <CardFooter>
                  <Button variant="ghost" size="sm">
                    Ler estudo de caso
                  </Button>
                </CardFooter>
              </Card>
            </MotionBox>
          ))}
        </SimpleGrid>

        <Card mt={16} bg="whiteAlpha.100" borderColor="whiteAlpha.200">
          <CardBody>
            <Stack direction={{ base: "column", md: "row" }} align="center" justify="space-between" spacing={4}>
              <Stack>
                <Heading size="md">Comentários da comunidade</Heading>
                <Text color="whiteAlpha.700">Usuários autenticados podem enviar feedback e perguntas nos posts.</Text>
              </Stack>
              <Button as={Link} href="#comments" variant="outline">
                Ver exemplos
              </Button>
            </Stack>
          </CardBody>
        </Card>

        <Stack mt={24} align="center" spacing={3}>
          <Text color="whiteAlpha.500">Construído com</Text>
          <HStack spacing={6} color="whiteAlpha.800">
            {['Next.js', 'React', 'Chakra UI', 'Supabase', 'Tailwind'].map((stack) => (
              <Text key={stack} fontWeight="semibold">
                {stack}
              </Text>
            ))}
          </HStack>
          <Text color="whiteAlpha.500">© {new Date().getFullYear()} José Renato</Text>
        </Stack>
      </Container>
    </Box>
  );
}
