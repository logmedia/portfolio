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
  Stack as ChakraStack,
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
import type { Post, Profile, Comment as ContentComment, Stack } from "@/types/content";
import { SignOut, Cube, Desktop, ChatCircleText, Stack as StackIcon } from "phosphor-react";
import { StacksManagement } from "./stacks-management";
import { StackSelector } from "./stack-selector";
import { useEffect } from "react";

type AdminDashboardProps = {
  profile: Profile;
  posts: Post[];
  comments: ContentComment[];
  stacks: Stack[];
};

export function AdminDashboard({ profile, posts, comments, stacks }: AdminDashboardProps) {
  const toast = useToast();
  const [selectedPost, setSelectedPost] = useState<Post | null>(posts[0] ?? null);
  const [isSavingProfile, startProfileTransition] = useTransition();
  const [isSavingPost, startPostTransition] = useTransition();
  const [isLoggingOut, startLogoutTransition] = useTransition();
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const safeProfileId = uuidRegex.test(profile.id ?? "") ? profile.id : "";
  const safePostId = uuidRegex.test(selectedPost?.id ?? "") ? selectedPost?.id : "";
  
  // Estado local para as stacks selecionadas no projeto atual
  const [selectedStackIds, setSelectedStackIds] = useState<string[]>([]);

  // Sincronizar stacks quando o post selecionado muda
  useEffect(() => {
    setSelectedStackIds(selectedPost?.stacks?.map(s => s.id) ?? []);
  }, [selectedPost]);

  // Auxiliar para verificar se a stack está selecionada no post
  const isStackSelected = (stackId: string) => {
    return selectedPost?.stacks?.some(s => s.id === stackId) ?? false;
  };

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
      toast({ title: "Projeto salvo com sucesso!", status: "success" });
    });
  };

  return (
    <Box bgGradient="linear(to-b, #05080c, #040507)" minH="100vh" py={16}>      <ChakraStack spacing={10} maxW="6xl" mx="auto" px={{ base: 6, md: 10 }}>
        <HStack justify="space-between" align="start">
          <ChakraStack spacing={2}>
            <Heading size="xl">Painel Administrativo</Heading>
            <Text color="whiteAlpha.700">
              Gerencie seu perfil, os projetos do portfólio e as tecnologias utilizadas.
            </Text>
          </ChakraStack>
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
          <TabList overflowX="auto" borderBottomColor="whiteAlpha.200">
            <Tab fontWeight="semibold"><Icon as={Cube} mr={2} /> Perfil</Tab>
            <Tab fontWeight="semibold"><Icon as={Desktop} mr={2} /> Projetos</Tab>
            <Tab fontWeight="semibold"><Icon as={StackIcon} mr={2} /> Stacks</Tab>
            <Tab fontWeight="semibold"><Icon as={ChatCircleText} mr={2} /> Comentários</Tab>
          </TabList>
          <TabPanels>
            <TabPanel px={0} pt={8}>
              <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={8} as="section">
                <GridItem>
                  <Card bg="whiteAlpha.50" border="1px solid" borderColor="whiteAlpha.100">
                    <CardBody>
                      <form key={profile.id ?? "profile-form"} action={handleProfileSubmit}>
                        <input type="hidden" name="id" value={safeProfileId} />
                        <ChakraStack spacing={4}>
                          <FormControl isRequired>
                            <FormLabel>Nome</FormLabel>
                            <Input name="name" defaultValue={profile.name} placeholder="Nome completo" bg="blackAlpha.300" />
                          </FormControl>
                          <FormControl>
                            <FormLabel>Cargo</FormLabel>
                            <Input name="role" defaultValue={profile.role ?? ""} bg="blackAlpha.300" />
                          </FormControl>
                          <FormControl>
                            <FormLabel>Bio</FormLabel>
                            <Textarea name="bio" defaultValue={profile.bio ?? ""} rows={4} bg="blackAlpha.300" />
                          </FormControl>
                          <FormControl>
                            <FormLabel>Avatar URL</FormLabel>
                            <Input name="avatarUrl" defaultValue={profile.avatar_url ?? ""} bg="blackAlpha.300" />
                          </FormControl>
                          <FormControl>
                            <FormLabel>Capa URL</FormLabel>
                            <Input name="coverUrl" defaultValue={profile.cover_url ?? ""} bg="blackAlpha.300" />
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
                              bg="blackAlpha.300"
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel>Habilidades Atuais (Nome|Nível|Ícone)</FormLabel>
                            <Textarea
                              name="skills"
                              placeholder="Ex: React|95|BracketsCurly"
                              defaultValue={
                                profile.skills
                                  ?.map((s) => `${s.name}|${s.level}|${s.icon}`)
                                  .join("\n") ?? ""
                              }
                              rows={4}
                              bg="blackAlpha.300"
                            />
                            <Text fontSize="xs" color="whiteAlpha.500" mt={1}>
                              Ícones: Code, Palette, Database, Lightning, BracketsCurly, Cpu
                            </Text>
                          </FormControl>
                          <Button type="submit" isLoading={isSavingProfile} loadingText="Salvando" colorScheme="brand">
                            Salvar Perfil
                          </Button>
                        </ChakraStack>
                      </form>
                    </CardBody>
                  </Card>
                </GridItem>
                <GridItem>
                  <Card bg="whiteAlpha.50" border="1px solid" borderColor="whiteAlpha.100">
                    <CardBody>
                      <ChakraStack spacing={4}>
                        <Heading size="md">Dashboard de Controle</Heading>
                        <Text color="whiteAlpha.700" fontSize="sm">
                          Configure URLs públicas hospedadas no Supabase Storage ou em CDNs confiáveis.
                        </Text>
                        <Divider borderColor="whiteAlpha.200" />
                        <Text color="whiteAlpha.700" fontSize="sm">
                          Dica: Use ícones do Phosphor para uma estética consistente em todo o site.
                        </Text>
                      </ChakraStack>
                    </CardBody>
                  </Card>
                </GridItem>
              </Grid>
            </TabPanel>

            <TabPanel px={0} pt={8}>
              <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
                <GridItem>
                  <Card bg="whiteAlpha.50" border="1px solid" borderColor="whiteAlpha.100">
                    <CardBody>
                      <form key={selectedPost?.id ?? "new-project"} action={handlePostSubmit}>
                        <input type="hidden" name="id" value={safePostId} />
                        <ChakraStack spacing={4}>
                          <FormControl isRequired>
                            <FormLabel>Título do Projeto</FormLabel>
                            <Input name="title" defaultValue={selectedPost?.title ?? ""} bg="blackAlpha.300" />
                          </FormControl>
                          <FormControl isRequired>
                            <FormLabel>Slug</FormLabel>
                            <Input name="slug" defaultValue={selectedPost?.slug ?? ""} bg="blackAlpha.300" />
                          </FormControl>
                          <FormControl>
                            <FormLabel>Subtítulo / Especialidade</FormLabel>
                            <Input name="subtitle" defaultValue={selectedPost?.subtitle ?? ""} bg="blackAlpha.300" />
                          </FormControl>

                          <Box border="1px solid" borderColor="whiteAlpha.100" p={5} borderRadius="xl" bg="blackAlpha.200">
                            <FormLabel fontWeight="bold" mb={4}>Tecnologias do Projeto</FormLabel>
                            <StackSelector 
                              allStacks={stacks}
                              selectedStackIds={selectedStackIds}
                              onChange={setSelectedStackIds}
                            />
                            {stacks.length === 0 && (
                              <Text fontSize="xs" color="whiteAlpha.500" mt={2}>
                                Nenhuma stack cadastrada. Vá até a aba "Stacks" primeiro.
                              </Text>
                            )}
                          </Box>

                          <FormControl>
                            <FormLabel>Hero image (URL)</FormLabel>
                            <Input name="heroImage" defaultValue={selectedPost?.hero_image_url ?? ""} bg="blackAlpha.300" />
                          </FormControl>
                          <FormControl>
                            <FormLabel>Galeria (URLs por linha)</FormLabel>
                            <Textarea name="gallery" defaultValue={selectedPost?.gallery?.join("\n") ?? ""} rows={3} bg="blackAlpha.300" />
                          </FormControl>
                          <FormControl>
                            <FormLabel>Link Externo (Demo/Repo)</FormLabel>
                            <Input name="externalLink" defaultValue={selectedPost?.external_link ?? ""} bg="blackAlpha.300" />
                          </FormControl>
                          <FormControl>
                            <FormLabel>Nível de Avaliação (1-5)</FormLabel>
                            <Select name="rating" defaultValue={String(selectedPost?.rating ?? 5)} bg="blackAlpha.300">
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
                                bg="blackAlpha.300"
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel>Dificuldade Tech (1-5)</FormLabel>
                              <Select name="difficulty" defaultValue={String(selectedPost?.difficulty ?? 1)} bg="blackAlpha.300">
                                {[1, 2, 3, 4, 5].map((number) => (
                                  <option key={number} value={number}>
                                    Nível {number}
                                  </option>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                          <FormControl>
                            <FormLabel>Status de Visibilidade</FormLabel>
                            <Select name="status" defaultValue={selectedPost?.status ?? "draft"} bg="blackAlpha.300">
                              <option value="draft">Rascunho (Privado)</option>
                              <option value="published">Publicado (Visível)</option>
                            </Select>
                          </FormControl>
                          <FormControl>
                            <FormLabel>Documentação / Conteúdo (Markdown)</FormLabel>
                            <Textarea name="content" defaultValue={selectedPost?.content ?? ""} rows={6} bg="blackAlpha.300" />
                          </FormControl>
                          <Button type="submit" isLoading={isSavingPost} loadingText="Salvando" colorScheme="brand">
                            Salvar Projeto
                          </Button>
                        </ChakraStack>
                      </form>
                    </CardBody>
                  </Card>
                </GridItem>
                <GridItem>
                  <Card bg="whiteAlpha.50" border="1px solid" borderColor="whiteAlpha.100">
                    <CardBody>
                      <ChakraStack spacing={4}>
                        <HStack justify="space-between" align="center">
                          <Heading size="md">Projetos Ativos</Heading>
                          <Button size="sm" variant="outline" onClick={() => setSelectedPost(null)}>
                            Novo Projeto
                          </Button>
                        </HStack>
                        <ChakraStack spacing={3} maxH="600px" overflowY="auto">
                          {posts.map((post) => (
                            <Card
                              key={post.id}
                              borderColor={selectedPost?.id === post.id ? "brand.400" : "whiteAlpha.200"}
                              bg={selectedPost?.id === post.id ? "whiteAlpha.200" : "transparent"}
                              cursor="pointer"
                              transition="all 0.2s"
                              onClick={() => setSelectedPost(post)}
                              _hover={{ borderColor: "brand.300" }}
                            >
                              <CardBody p={3}>
                                <ChakraStack spacing={2}>
                                  <Heading size="xs">{post.title}</Heading>
                                  <Text fontSize="xs" color="whiteAlpha.500" noOfLines={1}>
                                    /projeto/{post.slug}
                                  </Text>
                                  <HStack spacing={1} flexWrap="wrap">
                                    <Badge size="sm" fontSize="10px" colorScheme={post.status === "published" ? "green" : "yellow"}>
                                      {post.status}
                                    </Badge>
                                    {post.stacks?.map(s => (
                                      <Tag key={s.id} size="sm" fontSize="10px" variant="subtle" bg="whiteAlpha.100">
                                        {s.name}
                                      </Tag>
                                    ))}
                                  </HStack>
                                </ChakraStack>
                              </CardBody>
                            </Card>
                          ))}
                          {posts.length === 0 && (
                            <Text color="whiteAlpha.500">Nenhum projeto cadastrado.</Text>
                          )}
                        </ChakraStack>
                      </ChakraStack>
                    </CardBody>
                  </Card>
                </GridItem>
              </Grid>
            </TabPanel>

            <TabPanel px={0} pt={8}>
              <StacksManagement stacks={stacks} />
            </TabPanel>

            <TabPanel px={0} pt={8}>
              <Card bg="whiteAlpha.50" border="1px solid" borderColor="whiteAlpha.100">
                <CardBody>
                  <ChakraStack spacing={6}>
                    <ChakraStack>
                      <HStack spacing={3} align="center">
                        <Heading size="md">Comentários Pendentes</Heading>
                        <Badge
                          colorScheme={pendingComments.length ? "yellow" : "green"}
                          rounded="full"
                          px={3}
                        >
                          {pendingComments.length} aguardando
                        </Badge>
                      </HStack>
                      <Text color="whiteAlpha.600" fontSize="sm">
                        Assegure a qualidade da comunidade moderando o conteúdo enviado.
                      </Text>
                    </ChakraStack>
                    <ChakraStack spacing={4}>
                      {comments.map((comment) => (
                        <Box
                          key={comment.id}
                          border="1px solid"
                          borderColor="whiteAlpha.200"
                          rounded="xl"
                          p={4}
                          bg="blackAlpha.200"
                        >
                          <HStack justify="space-between" mb={2}>
                            <ChakraStack spacing={0}>
                              <Text fontWeight="semibold" fontSize="sm">{comment.author?.name ?? "Usuário"}</Text>
                              <Text fontSize="xs" color="whiteAlpha.500">
                                Ref: {comment.post_id}
                              </Text>
                            </ChakraStack>
                            <Badge colorScheme={comment.status === "approved" ? "green" : "yellow"}>
                              {comment.status}
                            </Badge>
                          </HStack>
                          <Text color="whiteAlpha.800" fontSize="sm">{comment.content}</Text>
                          <HStack mt={3} spacing={2}>
                            <Button size="xs" colorScheme="green" variant="solid" isDisabled>
                              Aprovar
                            </Button>
                            <Button size="xs" colorScheme="red" variant="ghost" isDisabled>
                              Rejeitar
                            </Button>
                          </HStack>
                        </Box>
                      ))}
                      {comments.length === 0 && (
                        <Text color="whiteAlpha.500">Silêncio no momento... Sem comentários.</Text>
                      )}
                    </ChakraStack>
                  </ChakraStack>
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </ChakraStack>
    </Box>
  );
}
