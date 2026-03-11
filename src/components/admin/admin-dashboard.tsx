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
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  ButtonGroup,
  VStack,
  Spinner,
} from "@chakra-ui/react";
import { deletePost, savePost, saveProfile, signOut, updateCommentStatus, deleteComment as removeCommentAction } from "@/app/actions";
import type { Post, Profile, Comment as ContentComment, Stack, GalleryItem } from "@/types/content";
import { SignOut, Cube, Desktop, ChatCircleText, Stack as StackIcon, Trash, Recycle } from "phosphor-react";
import { StacksManagement } from "./stacks-management";
import { TrashManager } from "./trash-manager";
import { StackSelector } from "./stack-selector";
import { MediaPicker } from "./media-picker";
import { GalleryManager } from "./gallery-manager";
import { useEffect } from "react";
import dynamic from "next/dynamic";

const ModernEditor = dynamic(() => import("./modern-editor").then(mod => mod.ModernEditor), {
  ssr: false,
  loading: () => (
    <Box p={20} textAlign="center">
      <Spinner size="xl" color="brand.500" thickness="4px" />
      <Text mt={4} color="gray.400" fontFamily="monospace">Carregando editor avançado...</Text>
    </Box>
  )
});
import { GithubActivity } from "./github-activity";
import { CoverPicker } from "../CoverPicker";

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
  const [isDeletingPost, startDeleteTransition] = useTransition();
  const [isLoggingOut, startLogoutTransition] = useTransition();
  const [isCommentPending, startCommentTransition] = useTransition();
  const [isDirty, setIsDirty] = useState(false);
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const safeProfileId = uuidRegex.test(profile.id ?? "") ? profile.id : "";
  const safePostId = uuidRegex.test(selectedPost?.id ?? "") ? selectedPost?.id : "";
  
  const [selectedStackIds, setSelectedStackIds] = useState<string[]>([]);
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [postContent, setPostContent] = useState("");
  
  // Profile media state
  const [profileAvatarUrl, setProfileAvatarUrl] = useState(profile.avatar_url ?? "");
  const [profileCoverUrl, setProfileCoverUrl] = useState(profile.cover_url ?? "");

  // Sincronizar stacks quando o post selecionado muda
  useEffect(() => {
    setSelectedStackIds(selectedPost?.stacks?.map(s => s.id) ?? []);
    setHeroImageUrl(selectedPost?.hero_image_url ?? "");
    setPostContent(selectedPost?.content ?? "");
    // Parse gallery: pode ser GalleryItem[] ou string[] legado
    const rawGallery = selectedPost?.gallery;
    if (Array.isArray(rawGallery)) {
      if (rawGallery.length > 0 && typeof rawGallery[0] === 'string') {
        // Formato legado: array de strings
        setGalleryItems((rawGallery as unknown as string[]).map((url, i) => ({ url, caption: '', order: i })));
      } else {
        setGalleryItems(rawGallery as GalleryItem[]);
      }
    } else {
      setGalleryItems([]);
    }
    setIsDirty(false);
  }, [selectedPost]);

  // Auxiliar para verificar se a stack está selecionada no post
  const isStackSelected = (stackId: string) => {
    return selectedPost?.stacks?.some(s => s.id === stackId) ?? false;
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
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
      setIsDirty(false);
      
      // Sincronizar o estado local com o que o banco retornou
      if (result.post) {
        setSelectedPost(result.post as Post);
      }
    });
  };

  const activePosts = useMemo(() => posts.filter(p => p.status !== 'trash'), [posts]);

  const handleDeletePost = (id: string) => {
    
    startDeleteTransition(async () => {
      const result = await deletePost(id);
      if (!result.success) {
        toast({ title: result.message ?? "Erro ao excluir", status: "error" });
        return;
      }
      toast({ title: "Projeto excluído com sucesso!", status: "success" });
    });
  };
  
  const handleCommentStatus = (id: string, status: 'approved' | 'rejected') => {
    startCommentTransition(async () => {
      const result = await updateCommentStatus(id, status);
      if (result.success) {
        toast({ title: `Comentário ${status === 'approved' ? 'aprovado' : 'rejeitado'}!`, status: "success" });
      } else {
        toast({ title: result.message ?? "Erro ao processar comentário", status: "error" });
      }
    });
  };

  const handleDeleteComment = (id: string) => {
    startCommentTransition(async () => {
      const result = await removeCommentAction(id);
      if (result.success) {
        toast({ title: "Comentário excluído!", status: "success" });
      } else {
        toast({ title: result.message ?? "Erro ao excluir comentário", status: "error" });
      }
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
            <Tab fontWeight="semibold"><Icon as={Recycle} mr={2} /> Lixeira</Tab>
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
                          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
                            <MediaPicker 
                              label="Avatar (Foto de Perfil)" 
                              value={profileAvatarUrl} 
                              onChange={(url) => {
                                setProfileAvatarUrl(url);
                                setIsDirty(true);
                              }} 
                            />
                            <VStack align="start" spacing={2}>
                              <FormLabel mb={0}>Capa do Perfil</FormLabel>
                              <CoverPicker 
                                currentCover={profileCoverUrl} 
                                onUpdate={() => {
                                  // Opcional: recarregar dados ou apenas deixar o form cuidar
                                }}
                              />
                              <Text fontSize="xs" color="whiteAlpha.400">Presets modernos, Upload ou IA</Text>
                            </VStack>
                          </Grid>
                          {/* Hidden inputs to maintain form functionality with old schema */}
                          <input type="hidden" name="avatarUrl" value={profileAvatarUrl} />
                          <input type="hidden" name="coverUrl" value={profileCoverUrl} />
                           <FormControl>
                             <FormLabel>GitHub Username (para gráfico)</FormLabel>
                             <Input name="github_username" defaultValue={(profile as any).github_username ?? ""} placeholder="ex: josh" bg="blackAlpha.300" />
                           </FormControl>
                          <FormControl>
                            <FormLabel>Redes sociais</FormLabel>
                            <Textarea
                              name="socials"
                              placeholder="Formato: Nome|https://link"
                              defaultValue={
                                Array.isArray(profile.socials)
                                  ? profile.socials.map((social) => `${social.label}|${social.url}`).join("\n")
                                  : ""
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
                                Array.isArray(profile.skills)
                                  ? profile.skills.map((s) => `${s.name}|${s.level}|${s.icon}`).join("\n")
                                  : ""
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
                         
                         <GithubActivity username={(profile as any).github_username} />

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
                      <form 
                        key={selectedPost?.id ?? "new-project"} 
                        action={handlePostSubmit}
                        onChange={() => setIsDirty(true)}
                      >
                        <input type="hidden" name="id" value={safePostId} />
                        <ChakraStack spacing={6}>
                          {/* Top Action Bar */}
                          <HStack justify="space-between" align="center" bg="blackAlpha.400" p={2} borderRadius="lg" position="sticky" top="0" zIndex="10" backdropFilter="blur(8px)">
                            <Text fontWeight="bold" fontSize="sm" ml={2}>
                              {selectedPost ? "Editando Projeto" : "Novo Projeto"}
                            </Text>
                            <HStack spacing={2}>
                              {selectedPost?.slug && (
                                <Button
                                  as="a"
                                  href={`/projeto/${selectedPost.slug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  size="sm"
                                  variant="outline"
                                  borderColor="whiteAlpha.300"
                                  _hover={{ bg: 'whiteAlpha.100' }}
                                >
                                  Visualizar
                                </Button>
                              )}
                              <Button 
                                type="submit" 
                                isLoading={isSavingPost} 
                                isDisabled={!isDirty && !!selectedPost}
                                loadingText="Salvando" 
                                colorScheme="brand" 
                                size="sm" 
                                px={8}
                              >
                                Salvar
                              </Button>
                            </HStack>
                          </HStack>

                          <FormControl isRequired>
                            <FormLabel fontSize="sm">Título do Projeto</FormLabel>
                            <Input 
                              name="title" 
                              defaultValue={selectedPost?.title ?? ""} 
                              bg="blackAlpha.300"
                              onChange={(e) => {
                                setIsDirty(true);
                                if (!selectedPost) {
                                  // Apenas auto-gera se for um novo projeto
                                  const slugInput = document.querySelector('input[name="slug"]') as HTMLInputElement;
                                  if (slugInput) {
                                    slugInput.value = generateSlug(e.target.value);
                                  }
                                }
                              }}
                            />
                          </FormControl>

                          <FormControl>
                            <FormLabel fontSize="sm">Subtítulo / Especialidade</FormLabel>
                            <Input name="subtitle" defaultValue={selectedPost?.subtitle ?? ""} bg="blackAlpha.300" />
                          </FormControl>

                          <FormControl>
                            <FormLabel fontSize="sm">Documentação / Conteúdo (HTML)</FormLabel>
                            <Box borderRadius="md" overflow="hidden" border="1px solid" borderColor="whiteAlpha.200">
                              <ModernEditor
                                initialContent={postContent}
                                onChange={(content) => {
                                  setPostContent(content);
                                  setIsDirty(true);
                                }}
                              />
                            </Box>
                            <input type="hidden" name="content" value={postContent} />
                          </FormControl>

                          <Box border="1px solid" borderColor="whiteAlpha.100" p={5} borderRadius="xl" bg="blackAlpha.200">
                            <FormLabel fontWeight="bold" mb={4} fontSize="sm">Tecnologias do Projeto</FormLabel>
                            <StackSelector 
                              allStacks={stacks}
                              selectedStackIds={selectedStackIds}
                              onChange={(ids) => {
                                setSelectedStackIds(ids);
                                setIsDirty(true);
                              }}
                            />
                          </Box>

                          <FormControl isRequired>
                            <FormLabel fontSize="sm">Slug (URL amigável)</FormLabel>
                            <Input name="slug" defaultValue={selectedPost?.slug ?? ""} bg="blackAlpha.300" />
                          </FormControl>

                          <Grid templateColumns={{ base: "1fr", md: "1fr" }} gap={4}>
                            <MediaPicker 
                              label="Foto de Destaque" 
                              value={heroImageUrl} 
                              onChange={(url) => {
                                setHeroImageUrl(url);
                                setIsDirty(true);
                              }} 
                            />
                            
                            <FormControl>
                              <FormLabel fontSize="sm">Link Externo (Demo/Repo)</FormLabel>
                              <Input name="externalLink" defaultValue={selectedPost?.external_link ?? ""} bg="blackAlpha.300" />
                            </FormControl>
                          </Grid>

                          <FormControl>
                            <FormLabel fontSize="sm">Galeria de Fotos</FormLabel>
                            <input type="hidden" name="gallery" value={JSON.stringify(galleryItems)} />
                            <GalleryManager
                              items={galleryItems}
                              onChange={(items) => {
                                setGalleryItems(items);
                                setIsDirty(true);
                              }}
                            />
                          </FormControl>

                          <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                            <FormControl>
                              <FormLabel fontSize="sm">Avaliação (1-5)</FormLabel>
                              <Select name="rating" defaultValue={String(selectedPost?.rating ?? 5)} bg="blackAlpha.300" size="sm">
                                <option value="">Nenhum</option>
                                {[1, 2, 3, 4, 5].map((number) => (
                                  <option key={number} value={number}>{number} estrelas</option>
                                ))}
                              </Select>
                            </FormControl>
                            <FormControl>
                              <FormLabel fontSize="sm">Perf. (%)</FormLabel>
                              <Input type="number" name="performance" defaultValue={selectedPost?.performance ?? 100} min={0} max={100} bg="blackAlpha.300" size="sm" />
                            </FormControl>
                            <FormControl>
                              <FormLabel fontSize="sm">Dificuldade</FormLabel>
                              <Select name="difficulty" defaultValue={String(selectedPost?.difficulty ?? 1)} bg="blackAlpha.300" size="sm">
                                {[1, 2, 3, 4, 5].map((number) => (
                                  <option key={number} value={number}>Nível {number}</option>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>

                          <FormControl>
                            <FormLabel fontSize="sm">Status de Visibilidade</FormLabel>
                            <Select name="status" defaultValue={selectedPost?.status ?? "draft"} bg="blackAlpha.300">
                              <option value="draft">Rascunho (Privado)</option>
                              <option value="published">Publicado (Visível)</option>
                            </Select>
                          </FormControl>


                          <Divider borderColor="whiteAlpha.100" />

                          {/* Danger Zone */}
                          {selectedPost && (
                            <Box p={4} border="1px solid" borderColor="red.900" bg="red.900" borderRadius="xl" opacity={0.8} _hover={{ opacity: 1 }} transition="all 0.2s">
                              <HStack justify="space-between">
                                <ChakraStack spacing={0}>
                                  <Text fontSize="sm" fontWeight="bold" color="red.200">Zona de Perigo</Text>
                                  <Text fontSize="xs" color="red.300">Excluir este projeto permanentemente</Text>
                                </ChakraStack>
                                
                                <Popover placement="top-end">
                                  <PopoverTrigger>
                                    <Button variant="ghost" colorScheme="red" size="sm" leftIcon={<Trash />}>
                                      Mover para Lixeira
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent bg="gray.800" borderColor="red.500">
                                    <PopoverArrow bg="gray.800" />
                                    <PopoverHeader fontWeight="bold" border="0">Confirmar Exclusão?</PopoverHeader>
                                    <PopoverBody fontSize="sm">
                                      Esta ação não pode ser desfeita. O projeto será removido do banco de dados.
                                    </PopoverBody>
                                    <PopoverFooter border="0" display="flex" justifyContent="flex-end">
                                      <ButtonGroup size="sm">
                                        <Button 
                                          colorScheme="red" 
                                          onClick={() => handleDeletePost(selectedPost.id)}
                                          isLoading={isDeletingPost}
                                        >
                                          Sim, Excluir
                                        </Button>
                                      </ButtonGroup>
                                    </PopoverFooter>
                                  </PopoverContent>
                                </Popover>
                              </HStack>
                            </Box>
                          )}
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
                          {activePosts.map((post) => (
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
                          {activePosts.length === 0 && (
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
                            <Button 
                              size="xs" 
                              colorScheme="green" 
                              variant="solid" 
                              isLoading={isCommentPending}
                              onClick={() => handleCommentStatus(comment.id, 'approved')}
                              isDisabled={comment.status === 'approved'}
                            >
                              Aprovar
                            </Button>
                            <Button 
                              size="xs" 
                              colorScheme="orange" 
                              variant="ghost"
                              isLoading={isCommentPending}
                              onClick={() => handleCommentStatus(comment.id, 'rejected')}
                              isDisabled={comment.status === 'rejected'}
                            >
                              Rejeitar
                            </Button>
                            <Button 
                              size="xs" 
                              colorScheme="red" 
                              variant="ghost"
                              isLoading={isCommentPending}
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              Excluir
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

            <TabPanel px={0} pt={8}>
              <TrashManager posts={posts} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </ChakraStack>
    </Box>
  );
}
