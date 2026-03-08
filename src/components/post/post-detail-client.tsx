'use client';

import { useTransition } from "react";
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
} from "@chakra-ui/react";
import { Star, ArrowLeft } from "lucide-react";
import type { Comment, Post, Profile } from "@/types/content";
import { createComment } from "@/app/actions";

const ratingArray = [0, 1, 2, 3, 4];

const markdownComponents: Components = {
  h1: (props) => <Heading size="xl" mt={10} mb={4} {...props} />,
  h2: (props) => <Heading size="lg" mt={8} mb={3} {...props} />,
  h3: (props) => <Heading size="md" mt={6} mb={2} {...props} />,
  p: (props) => (
    <Text fontSize="lg" color="whiteAlpha.800" lineHeight="tall" mb={4} {...props} />
  ),
  ul: (props) => <Stack as="ul" pl={4} spacing={2} {...props} />,
  li: (props) => <Text as="li" color="whiteAlpha.800" {...props} />,
};

type PostDetailClientProps = {
  post: Post;
  comments: Comment[];
  profile: Profile;
};

export function PostDetailClient({ post, comments, profile }: PostDetailClientProps) {
  const toast = useToast();
  const [isPending, startTransition] = useTransition();

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
    <Box bgGradient="linear(to-b, #030507, #060b11, #04070b)" minH="100vh" py={20}>
      <Container maxW="4xl">
        <Button as={Link} href="/" variant="ghost" leftIcon={<ArrowLeft size={16} />} mb={8}>
          Voltar para o feed
        </Button>

        <Card bg="whiteAlpha.100" borderColor="whiteAlpha.200" mb={10}>
          <CardBody>
            <Stack spacing={6}>
              <Stack spacing={3}>
                <Tag w="fit-content" colorScheme="brand">
                  {post.tags?.[0] ?? "Estudo de caso"}
                </Tag>
                <Heading size="2xl">{post.title}</Heading>
                <Text color="whiteAlpha.700" fontSize="xl">
                  {post.subtitle}
                </Text>
                <HStack spacing={1} color="yellow.300">
                  {ratingArray.map((value) => (
                    <Icon
                      key={`rating-${value}`}
                      as={Star}
                      fill={value < (post.rating ?? 0) ? "currentColor" : "transparent"}
                      strokeWidth={1.2}
                    />
                  ))}
                </HStack>
              </Stack>
              {post.hero_image_url && (
                <Box
                  borderRadius="2xl"
                  overflow="hidden"
                  border="1px solid"
                  borderColor="whiteAlpha.200"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.hero_image_url} alt={post.title} style={{ width: "100%", height: "auto" }} />
                </Box>
              )}
              <ReactMarkdown components={markdownComponents}>{post.content ?? "Conteúdo em breve."}</ReactMarkdown>
              {post.external_link && (
                <Button as={Link} href={post.external_link} target="_blank" rel="noreferrer" variant="outline">
                  Ver projeto ao vivo
                </Button>
              )}
            </Stack>
          </CardBody>
        </Card>

        <Card id="comments" bg="whiteAlpha.50" borderColor="whiteAlpha.200">
          <CardBody>
            <Stack spacing={6}>
              <Stack spacing={1}>
                <Heading size="lg">Comentários</Heading>
                <Text color="whiteAlpha.600">
                  Usuários autenticados podem enviar feedback. Comentários passam por aprovação no painel admin.
                </Text>
              </Stack>
              <form action={handleSubmit}>
                <input type="hidden" name="postId" value={post.id} />
                <input type="hidden" name="postSlug" value={post.slug} />
                <Stack spacing={4}>
                  <Textarea
                    name="content"
                    placeholder="Compartilhe seu feedback ou dúvida"
                    minH="120px"
                    bg="blackAlpha.300"
                    borderColor="whiteAlpha.300"
                    _hover={{ borderColor: "brand.400" }}
                  />
                  <Button type="submit" isLoading={isPending} loadingText="Enviando">
                    Enviar comentário
                  </Button>
                </Stack>
              </form>
              <Divider borderColor="whiteAlpha.200" />
              <Stack spacing={4}>
                {comments.map((comment) => (
                  <Stack key={comment.id} spacing={2} borderBottom="1px solid" borderColor="whiteAlpha.100" pb={4}>
                    <HStack spacing={3}>
                      <Avatar size="sm" src={comment.author?.avatar_url} name={comment.author?.name ?? "Usuário"} />
                      <Box>
                        <Text fontWeight="semibold">{comment.author?.name ?? "Usuário"}</Text>
                        <Text fontSize="xs" color="whiteAlpha.500">
                          {new Date(comment.created_at).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </Text>
                      </Box>
                    </HStack>
                    <Text color="whiteAlpha.800">{comment.content}</Text>
                  </Stack>
                ))}
                {comments.length === 0 && (
                  <Text color="whiteAlpha.500">Ainda não há comentários aprovados.</Text>
                )}
              </Stack>
            </Stack>
          </CardBody>
        </Card>
        <Stack mt={16} align="center" spacing={3}>
          <Avatar size="lg" src={profile.avatar_url} name={profile.name} />
          <Text color="whiteAlpha.700">Quer editar este post? Acesse o painel /admin.</Text>
        </Stack>
      </Container>
    </Box>
  );
}
