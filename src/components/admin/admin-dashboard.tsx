'use client';

import { useMemo, useState, useTransition } from "react";
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  Input,
  Select,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { savePost, saveProfile, signOut } from "@/app/actions";
import type { Comment, Post, Profile } from "@/types/content";
import { SignOut } from "phosphor-react";

type AdminDashboardProps = {
  profile: Profile;
  posts: Post[];
  comments: Comment[];
};

export function AdminDashboard({ profile, posts, comments }: AdminDashboardProps) {
  const toast = useToast();
  const [selectedPost, setSelectedPost] = useState<Post | null>(posts[0] ?? null);
  const [isSavingProfile, startProfileTransition] = useTransition();
  const [isSavingPost, startPostTransition] = useTransition();
  const [isLoggingOut, startLogoutTransition] = useTransition();
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const safeProfileId = uuidRegex.test(profile.id ?? "") ? profile.id : "";
  const safePostId = uuidRegex.test(selectedPost?.id ?? "") ? selectedPost?.id : "";

  const pendingComments = useMemo(
    () => comments.filter((comment) => comment.status === "pending"),
    [comments]
  );

  const handleLogout = () => {
    startLogoutTransition(async () => {
      await signOut();
    });
  };

  const handleProfileSubmit = (formData: FormData) => {
    startProfileTransition(async () => {
      const result = await saveProfile(formData);
      if (!result.success) {
        toast({ title: result.message ?? "Erro ao salvar", status: "error" });
        return;
      }
      toast({ title: "Perfil atualizado com sucesso", status: "success" });
    });
  };

  const handlePostSubmit = (formData: FormData) => {
    startPostTransition(async () => {
      const result = await savePost(formData);
      if (!result.success) {
        toast({ title: result.message ?? "Erro ao salvar", status: "error" });
        return;
      }
      toast({ title: "Post salvo", status: "success" });
    });
  };

  return (
    <Box bgGradient="linear(to-b, #05080c, #040507)" minH="100vh" py={16}>
      <Stack spacing={10} maxW="6xl" mx="auto" px={{ base: 6, md: 10 }}>
        <HStack justify="space-between" align="start">
          <Stack spacing={2}>
            <Heading size="xl">Painel Administrativo</Heading>
            <Text color="whiteAlpha.700">
              Gerencie seu perfil, os posts do portfólio e comentários enviados pela comunidade.
            </Text>
          </Stack>
          <Button 
            leftIcon={<Icon as={SignOut} />} 
            variant="ghost" 
            colorScheme="red" 
            onClick={handleLogout}
            isLoading={isLoggingOut}
          >
            Sair
          </Button>
        </HStack>

        <Tabs variant="enclosed" colorScheme="brand">
          <TabList overflowX="auto">
            <Tab>Perfil</Tab>
            <Tab>Posts</Tab>
            <Tab>Comentários</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={8} as="section">
                <GridItem>
                  <Card bg="whiteAlpha.50">
                    <CardBody>
                      <form key={profile.id ?? "profile-form"} action={handleProfileSubmit}>
                        <input type="hidden" name="id" value={safeProfileId} />
                        <Stack spacing={4}>
                          <FormControl isRequired>
                            <FormLabel>Nome</FormLabel>
                            <Input name="name" defaultValue={profile.name} placeholder="Nome completo" />
                          </FormControl>
                          <FormControl>
                            <FormLabel>Cargo</FormLabel>
                            <Input name="role" defaultValue={profile.role ?? ""} />
                          </FormControl>
                          <FormControl>
                            <FormLabel>Bio</FormLabel>
                            <Textarea name="bio" defaultValue={profile.bio ?? ""} rows={4} />
                          </FormControl>
                          <FormControl>
                            <FormLabel>Avatar URL</FormLabel>
                            <Input name="avatarUrl" defaultValue={profile.avatar_url ?? ""} />
                          </FormControl>
                          <FormControl>
                            <FormLabel>Capa URL</FormLabel>
                            <Input name="coverUrl" defaultValue={profile.cover_url ?? ""} />
                          </FormControl>
                          <FormControl>
                            <FormLabel>Redes sociais</FormLabel>
                            <Textarea
                              name="socials"
                              placeholder="Formato: Nome|https://link"
                              defaultValue={
                                profile.socials
                                  ?.map((social) => `${social.label}|${social.url}`)
                                  .join("\n") ?? ""
                              }
                              rows={4}
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel>Skills (Nome|Nível|Ícone)</FormLabel>
                            <Textarea
                              name="skills"
                              placeholder="Ex: React|95|BracketsCurly"
                              defaultValue={
                                profile.skills
                                  ?.map((s) => `${s.name}|${s.level}|${s.icon}`)
                                  .join("\n") ?? ""
                              }
                              rows={4}
                            />
                            <Text fontSize="xs" color="whiteAlpha.500" mt={1}>
                              Ícones disponíveis: Code, Palette, Database, Lightning, BracketsCurly, Cpu
                            </Text>
                          </FormControl>
                          <Button type="submit" isLoading={isSavingProfile} loadingText="Salvando">
                            Salvar perfil
                          </Button>
                        </Stack>
                      </form>
                    </CardBody>
                  </Card>
                </GridItem>
                <GridItem>
                  <Card bg="whiteAlpha.50">
                    <CardBody>
                      <Stack spacing={4}>
                        <Heading size="md">Dicas rápidas</Heading>
                        <Text color="whiteAlpha.700">
                          Configure URLs públicas hospedadas no Supabase Storage ou em CDNs confiáveis para garantir performance.
                        </Text>
                        <Divider borderColor="whiteAlpha.200" />
                        <Text color="whiteAlpha.700">
                          Campos como redes e stacks aceitam múltiplos valores, facilitando atualizações rápidas direto do painel.
                        </Text>
                      </Stack>
                    </CardBody>
                  </Card>
                </GridItem>
              </Grid>
            </TabPanel>

            <TabPanel>
              <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
                <GridItem>
                  <Card bg="whiteAlpha.50">
                    <CardBody>
                      <form key={selectedPost?.id ?? "new-post"} action={handlePostSubmit}>
                        <input type="hidden" name="id" value={safePostId} />
                        <Stack spacing={4}>
                          <FormControl isRequired>
                            <FormLabel>Título</FormLabel>
                            <Input name="title" defaultValue={selectedPost?.title ?? ""} />
                          </FormControl>
                          <FormControl isRequired>
                            <FormLabel>Slug</FormLabel>
                            <Input name="slug" defaultValue={selectedPost?.slug ?? ""} />
                          </FormControl>
                          <FormControl>
                            <FormLabel>Subtítulo</FormLabel>
                            <Input name="subtitle" defaultValue={selectedPost?.subtitle ?? ""} />
                          </FormControl>
                          <FormControl>
                            <FormLabel>Hero image</FormLabel>
                            <Input name="heroImage" defaultValue={selectedPost?.hero_image_url ?? ""} />
                          </FormControl>
                          <FormControl>
                            <FormLabel>Galeria (URLs por linha)</FormLabel>
                            <Textarea name="gallery" defaultValue={selectedPost?.gallery?.join("\n") ?? ""} rows={3} />
                          </FormControl>
                          <FormControl>
                            <FormLabel>Tags (separadas por vírgula)</FormLabel>
                            <Input name="tags" defaultValue={selectedPost?.tags?.join(", ") ?? ""} />
                          </FormControl>
                          <FormControl>
                            <FormLabel>Link externo</FormLabel>
                            <Input name="externalLink" defaultValue={selectedPost?.external_link ?? ""} />
                          </FormControl>
                          <FormControl>
                            <FormLabel>Rating (Estrelas)</FormLabel>
                            <Select name="rating" defaultValue={String(selectedPost?.rating ?? 5)}>
                              <option value="">Nenhum</option>
                              {[1, 2, 3, 4, 5].map((number) => (
                                <option key={number} value={number}>
                                  {number} estrelas
                                </option>
                              ))}
                            </Select>
                          </FormControl>
                          <Grid templateColumns="1fr 1fr" gap={4}>
                            <FormControl>
                              <FormLabel>Performance (%)</FormLabel>
                              <Input 
                                type="number" 
                                name="performance" 
                                defaultValue={selectedPost?.performance ?? 100} 
                                min={0} 
                                max={100} 
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel>Dificuldade (1-5)</FormLabel>
                              <Select name="difficulty" defaultValue={String(selectedPost?.difficulty ?? 1)}>
                                {[1, 2, 3, 4, 5].map((number) => (
                                  <option key={number} value={number}>
                                    Nível {number}
                                  </option>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                          <FormControl>
                            <FormLabel>Status</FormLabel>
                            <Select name="status" defaultValue={selectedPost?.status ?? "draft"}>
                              <option value="draft">Rascunho</option>
                              <option value="published">Publicado</option>
                            </Select>
                          </FormControl>
                          <FormControl>
                            <FormLabel>Conteúdo (Markdown)</FormLabel>
                            <Textarea name="content" defaultValue={selectedPost?.content ?? ""} rows={6} />
                          </FormControl>
                          <Button type="submit" isLoading={isSavingPost} loadingText="Salvando">
                            Salvar post
                          </Button>
                        </Stack>
                      </form>
                    </CardBody>
                  </Card>
                </GridItem>
                <GridItem>
                  <Card bg="whiteAlpha.50">
                    <CardBody>
                      <Stack spacing={4}>
                        <HStack justify="space-between" align="center">
                          <Heading size="md">Posts publicados</Heading>
                          <Button size="sm" variant="outline" onClick={() => setSelectedPost(null)}>
                            Novo post
                          </Button>
                        </HStack>
                        <Stack spacing={3} maxH="420px" overflowY="auto">
                          {posts.map((post) => (
                            <Card
                              key={post.id}
                              borderColor={selectedPost?.id === post.id ? "brand.400" : "whiteAlpha.200"}
                              bg={selectedPost?.id === post.id ? "whiteAlpha.200" : "transparent"}
                              cursor="pointer"
                              transition="all 0.2s"
                              onClick={() => setSelectedPost(post)}
                            >
                              <CardBody>
                                <Stack spacing={1}>
                                  <Heading size="sm">{post.title}</Heading>
                                  <Text fontSize="sm" color="whiteAlpha.700">
                                    /post/{post.slug}
                                  </Text>
                                  <HStack spacing={2}>
                                    <Badge colorScheme={post.status === "published" ? "green" : "yellow"}>
                                      {post.status}
                                    </Badge>
                                    <Tag>{post.tags?.[0] ?? "Sem tag"}</Tag>
                                  </HStack>
                                </Stack>
                              </CardBody>
                            </Card>
                          ))}
                          {posts.length === 0 && (
                            <Text color="whiteAlpha.500">Nenhum post publicado ainda.</Text>
                          )}
                        </Stack>
                      </Stack>
                    </CardBody>
                  </Card>
                </GridItem>
              </Grid>
            </TabPanel>

            <TabPanel>
              <Card bg="whiteAlpha.50">
                <CardBody>
                  <Stack spacing={6}>
                    <Stack>
                      <HStack spacing={3} align="center">
                        <Heading size="md">Fila de comentários</Heading>
                        <Badge
                          colorScheme={pendingComments.length ? "yellow" : "green"}
                          rounded="full"
                          px={3}
                        >
                          Pendentes: {pendingComments.length}
                        </Badge>
                      </HStack>
                      <Text color="whiteAlpha.600">
                        Aprove ou rejeite comentários para mantê-los saudáveis. Integre ações server-side quando configurar Supabase Auth.
                      </Text>
                    </Stack>
                    <Stack spacing={4}>
                      {comments.map((comment) => (
                        <Box
                          key={comment.id}
                          border="1px solid"
                          borderColor="whiteAlpha.200"
                          rounded="xl"
                          p={4}
                        >
                          <HStack justify="space-between" mb={2}>
                            <Stack spacing={0}>
                              <Text fontWeight="semibold">{comment.author?.name ?? "Usuário"}</Text>
                              <Text fontSize="sm" color="whiteAlpha.500">
                                Post: {comment.post_id}
                              </Text>
                            </Stack>
                            <Badge colorScheme={comment.status === "approved" ? "green" : "yellow"}>
                              {comment.status}
                            </Badge>
                          </HStack>
                          <Text color="whiteAlpha.800">{comment.content}</Text>
                          <HStack mt={3} spacing={2}>
                            <Button size="sm" variant="outline" disabled>
                              Aprovar
                            </Button>
                            <Button size="sm" variant="ghost" disabled>
                              Rejeitar
                            </Button>
                          </HStack>
                        </Box>
                      ))}
                      {comments.length === 0 && (
                        <Text color="whiteAlpha.500">Nenhum comentário no momento.</Text>
                      )}
                    </Stack>
                  </Stack>
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </Box>
  );
}
