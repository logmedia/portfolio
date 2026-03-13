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
  Checkbox,
} from "@chakra-ui/react";
import { deletePost, savePost, saveProfile, signOut, updateCommentStatus, deleteComment as removeCommentAction, checkUsernameAvailability, fetchAllProfiles } from "@/app/actions";
import type { Post, Profile, Comment as ContentComment, Stack, GalleryItem } from "@/types/content";
import { SignOut, Cube, Desktop, ChatCircleText, Stack as StackIcon, Trash, Recycle, Users } from "phosphor-react";

import { UserManagementContent } from "../UserManagementContent";
import { StacksManagement } from "./stacks-management";
import { TrashManager } from "./trash-manager";
import { StackSelector } from "./stack-selector";
import { MediaPicker } from "./media-picker";
import { GalleryManager } from "./gallery-manager";
import { ActivityFeed } from "./activity-feed";
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

import { CoverPicker } from "../CoverPicker";
import { SkillsManager } from "./skills-manager";
import { SocialsManager } from "./socials-manager";
import { ProfileHeaderEditor } from "../ProfileHeaderEditor";

type AdminDashboardProps = {
  profile: Profile;
  posts: Post[];
  comments: ContentComment[];
  stacks: Stack[];
  activities: any[];
};

export function AdminDashboard({ profile, posts, comments, stacks, activities }: AdminDashboardProps) {
  const toast = useToast();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isSavingProfile, startProfileTransition] = useTransition();
  const [isSavingPost, startPostTransition] = useTransition();
  const [isDeletingPost, startDeleteTransition] = useTransition();
  const [isLoggingOut, startLogoutTransition] = useTransition();
  const [isCommentPending, startCommentTransition] = useTransition();
  const [isDirty, setIsDirty] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [localPosts, setLocalPosts] = useState<Post[]>(posts);

  // Sync with props when they change (SSR)
  useEffect(() => {
    setLocalPosts(posts);
  }, [posts]);

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

  // Admin state
  const [allUsers, setAllUsers] = useState<Profile[]>([]);
  const isAdmin = (profile as any).role === 'admin';

  useEffect(() => {
    if (isAdmin) {
      fetchAllProfiles().then(data => setAllUsers(data as any));
    }
  }, [isAdmin, profile.id]);

  // Profile username state
  const [profileUsername, setProfileUsername] = useState((profile as any).github_username ?? "");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameFeedback, setUsernameFeedback] = useState<{ available: boolean, message: string } | null>(null);

  // Debounce username check
  useEffect(() => {
    // Skip if it hasn't changed from initial
    if (profileUsername === (profile as any).github_username) {
      setUsernameFeedback(null);
      return;
    }

    if (!profileUsername || profileUsername.length < 3) {
      setUsernameFeedback({ available: false, message: "O nome deve ter pelo menos 3 caracteres." });
      return;
    }

    // Debounce
    const timer = setTimeout(async () => {
      setIsCheckingUsername(true);
      const res = await checkUsernameAvailability(profileUsername, profile.id);
      setUsernameFeedback(res);
      setIsCheckingUsername(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [profileUsername, profile.id]);

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

  const handleNewProject = () => {
    setSelectedPost(null);
    setFormKey(prev => prev + 1);
    setIsDirty(false);
  };

  const handlePostSubmit = (formData: FormData) => {
    startPostTransition(async () => {
      console.log("[AdminDashboard] Starting savePost with formData...");
      const result = await savePost(formData);
      console.log("[AdminDashboard] savePost result:", result);
      
      if (!result.success) {
        console.error("[AdminDashboard] Save failed:", result.message, result.errors);
        toast({ 
          title: "Erro ao salvar", 
          description: result.message || "Verifique o console para detalhes", 
          status: "error",
          duration: 5000,
          isClosable: true
        });
        return;
      }
      toast({ title: "Projeto salvo com sucesso!", status: "success" });
      setIsDirty(false);
      
      // Sincronizar o estado local com o que o banco retornou
      if (result.post) {
        const savedPost = result.post as Post;
        setSelectedPost(savedPost);
        setLocalPosts(prev => {
          // 1. Se estávamos editando um fallback (ID não-UUID), substituímos ele especificamente
          const isFallback = selectedPost?.id && !uuidRegex.test(selectedPost.id);
          if (isFallback) {
            return prev.map(p => p.id === selectedPost.id ? savedPost : p);
          }

          // 2. Tentar atualizar por ID (caso padrão para posts já salvos)
          const existsById = prev.some(p => p.id === savedPost.id);
          if (existsById) {
            return prev.map(p => p.id === savedPost.id ? savedPost : p);
          }

          // 3. Fallback de segurança: se o slug for o mesmo de algum anterior (mesmo que o ID mudou)
          const existsBySlug = prev.some(p => p.slug === savedPost.slug);
          if (existsBySlug) {
            return prev.map(p => p.slug === savedPost.slug ? savedPost : p);
          }

          // 4. Se chegou aqui, é um projeto realmente novo
          return [savedPost, ...prev];
        });
      }
    });
  };

  const activePosts = useMemo(() => localPosts.filter(p => p.status !== 'trash'), [localPosts]);

  const handleDeletePost = (id: string) => {
    startDeleteTransition(async () => {
      const result = await deletePost(id);
      if (!result.success) {
        toast({ title: result.message ?? "Erro ao excluir", status: "error" });
        return;
      }
      toast({ title: "Projeto excluído com sucesso!", status: "success" });
      setLocalPosts(prev => prev.filter(p => p.id !== id));
      if (selectedPost?.id === id) setSelectedPost(null);
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
            <HStack spacing={3} align="center">
              <Heading size="xl">Painel Administrativo</Heading>
              <Badge 
                colorScheme={isAdmin ? "brand" : "gray"} 
                variant="solid" 
                px={3} 
                py={1} 
                borderRadius="full"
                fontSize="xs"
                textTransform="uppercase"
              >
                {isAdmin ? "Administrador" : "Editor"}
              </Badge>
            </HStack>
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

        <Tabs 
          variant="enclosed" 
          colorScheme="brand"
          onChange={(index) => {
            if (index === 1) {
              handleNewProject();
            }
          }}
        >
          <TabList overflowX="auto" borderBottomColor="whiteAlpha.200">
            <Tab fontWeight="semibold"><Icon as={Cube} mr={2} /> Perfil</Tab>
            <Tab fontWeight="semibold"><Icon as={Desktop} mr={2} /> Projetos</Tab>
            <Tab fontWeight="semibold"><Icon as={StackIcon} mr={2} /> Stacks</Tab>
            <Tab fontWeight="semibold"><Icon as={ChatCircleText} mr={2} /> Comentários</Tab>
            <Tab fontWeight="semibold"><Icon as={Recycle} mr={2} /> Lixeira</Tab>
            {isAdmin && <Tab fontWeight="semibold"><Icon as={Users} mr={2} /> Usuários</Tab>}
          </TabList>
          <TabPanels>
            <TabPanel px={0} pt={8}>
              <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={8} as="section">
                <GridItem>
                  <Card variant="outline">
                    <CardBody>
                      <form 
                        key={profile.id ?? "profile-form"} 
                        action={handleProfileSubmit}
                        onChange={() => setIsDirty(true)}
                      >
                        <input type="hidden" name="id" value={safeProfileId} />
                        <ChakraStack spacing={4}>
                          {/* Top Action Bar */}
                          <HStack justify="space-between" align="center" bg="blackAlpha.800" p={2} borderRadius="lg" position="sticky" top="0" zIndex="10" backdropFilter="blur(16px)">
                            <Text fontWeight="bold" fontSize="sm" ml={2}>
                              Configurações do Perfil
                            </Text>
                            <Button 
                              type="submit" 
                              isLoading={isSavingProfile} 
                              loadingText="Salvando" 
                              colorScheme="brand"
                              size="sm"
                              isDisabled={usernameFeedback?.available === false}
                            >
                              Salvar Perfil
                            </Button>
                          </HStack>

                          <FormControl isRequired>
                            <FormLabel>Nome</FormLabel>
                            <Input name="name" defaultValue={profile.name} placeholder="Nome completo" bg="blackAlpha.300" />
                          </FormControl>
                          <FormControl>
                            <FormLabel>Cargo Atual</FormLabel>
                            <Input name="role" defaultValue={(profile as any).job_title ?? ""} bg="blackAlpha.300" />
                          </FormControl>
                          <FormControl>
                            <FormLabel>Bio</FormLabel>
                            <Textarea name="bio" defaultValue={profile.bio ?? ""} rows={4} bg="blackAlpha.300" />
                          </FormControl>
                          <Box mb={6} maxW="400px" mx="auto">
                            <ProfileHeaderEditor 
                              avatarUrl={profileAvatarUrl}
                              coverUrl={profileCoverUrl}
                              onAvatarChange={(url) => {
                                setProfileAvatarUrl(url);
                                setIsDirty(true);
                              }}
                              onCoverChange={(url) => {
                                setProfileCoverUrl(url);
                                setIsDirty(true);
                              }}
                              userName={profile.name}
                              jobTitle={(profile as any).job_title ?? "Web Developer"}
                            />
                          </Box>

                          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
                            <MediaPicker 
                              label="Alterar Avatar" 
                              value={profileAvatarUrl} 
                              onChange={(url) => {
                                setProfileAvatarUrl(url);
                                setIsDirty(true);
                              }} 
                            />
                            <MediaPicker 
                              label="Alterar Capa" 
                              value={profileCoverUrl} 
                              onChange={(url) => {
                                setProfileCoverUrl(url);
                                setIsDirty(true);
                              }} 
                            />
                          </Grid>
                          {/* Hidden inputs to maintain form functionality with old schema */}
                          <input type="hidden" name="avatarUrl" value={profileAvatarUrl} />
                          <input type="hidden" name="coverUrl" value={profileCoverUrl} />
                           <FormControl isInvalid={usernameFeedback?.available === false}>
                             <FormLabel>Nome de Usuário (URL do Perfil)</FormLabel>
                             <Input 
                               name="github_username" 
                               value={profileUsername} 
                               onChange={(e) => {
                                 setProfileUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''));
                                 setIsDirty(true);
                               }}
                               placeholder="ex: logmedia" 
                               bg="blackAlpha.300" 
                             />
                             {isCheckingUsername && (
                               <Text fontSize="xs" color="brand.400" mt={1}>
                                 <Spinner size="xs" mr={1} /> Verificando disponibilidade...
                               </Text>
                             )}
                             {!isCheckingUsername && usernameFeedback && (
                               <Text fontSize="xs" color={usernameFeedback.available ? "green.400" : "red.400"} mt={1}>
                                 {usernameFeedback.message}
                               </Text>
                             )}
                           </FormControl>

                             <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={4}>
                               <FormControl>
                                 <FormLabel>WhatsApp (apenas números)</FormLabel>
                                 <Input 
                                   name="whatsapp_number" 
                                   defaultValue={profile.whatsapp_number ?? ""} 
                                   placeholder="ex: 5511999999999" 
                                   bg="blackAlpha.300" 
                                   onChange={() => setIsDirty(true)}
                                 />
                               </FormControl>
                               <FormControl display="flex" alignItems="center" pt={8}>
                                 <Checkbox 
                                   name="whatsapp_public" 
                                   defaultChecked={profile.whatsapp_public}
                                   colorScheme="brand"
                                   onChange={() => setIsDirty(true)}
                                 >
                                   Tornar Público
                                 </Checkbox>
                               </FormControl>
                             </Grid>
                             <Text fontSize="xs" color="whiteAlpha.400" mt={2}>
                               Sua página pública será: portfolio.logmedia.com.br/<b>{profileUsername || "seu-nome"}</b>
                             </Text>
                          <FormControl>
                            <SocialsManager initialSocials={(profile.socials as any) || []} />
                          </FormControl>
                          <FormControl>
                            <SkillsManager initialSkills={profile.skills || []} />
                          </FormControl>
                        </ChakraStack>
                      </form>
                    </CardBody>
                  </Card>
                </GridItem>
                <GridItem>
                  <Card variant="outline">
                    <CardBody>
                       <ChakraStack spacing={4}>
                         <Heading size="md">Dashboard de Controle</Heading>
                         <Text color="whiteAlpha.700" fontSize="sm">
                           Configure URLs públicas hospedadas no Supabase Storage ou em CDNs confiáveis.
                         </Text>
                         <Divider borderColor="whiteAlpha.200" />
                          <ActivityFeed activities={activities} />

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
                  <Card variant="outline">
                    <CardBody>
                      <form 
                        key={selectedPost?.id || `new-project-${formKey}`} 
                        action={handlePostSubmit}
                        onChange={() => setIsDirty(true)}
                      >
                        <input type="hidden" name="id" value={safePostId} />
                        <ChakraStack spacing={6}>
                          {/* Top Action Bar */}
                          <HStack justify="space-between" align="center" bg="blackAlpha.800" p={2} borderRadius="lg" position="sticky" top="0" zIndex="10" backdropFilter="blur(16px)">
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
                                  // Auto-generate slug with a random string to prevent constraints
                                  const slugInput = document.querySelector('input[name="slug"]') as HTMLInputElement;
                                  if (slugInput) {
                                    const baseSlug = generateSlug(e.target.value);
                                    // appending a random ID to guarantee uniqueness for new posts
                                    const randomHash = Math.random().toString(36).substring(2, 6);
                                    slugInput.value = baseSlug ? `${baseSlug}-${randomHash}` : '';
                                    // Trigger an event so React or other listeners know the input changed
                                    slugInput.dispatchEvent(new Event('change', { bubbles: true }));
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
                            <Input 
                              name="slug" 
                              defaultValue={selectedPost?.slug ?? ""} 
                              bg="blackAlpha.300" 
                              onChange={() => setIsDirty(true)}
                            />
                            <Text fontSize="xs" color="whiteAlpha.400" mt={1}>
                              Este slug deve ser único. Ele é gerado automaticamente para novos projetos.
                            </Text>
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

                          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                            <FormControl>
                              <FormLabel fontSize="sm">Status de Visibilidade</FormLabel>
                              <Select name="status" defaultValue={selectedPost?.status ?? "draft"} bg="blackAlpha.300">
                                <option value="draft">Rascunho (Privado)</option>
                                <option value="published">Publicado (Visível)</option>
                              </Select>
                            </FormControl>
                            <FormControl>
                              <FormLabel fontSize="sm">Data de Publicação</FormLabel>
                              <Input 
                                type="datetime-local" 
                                name="publishedAt" 
                                defaultValue={selectedPost?.published_at ? new Date(selectedPost.published_at).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)} 
                                bg="blackAlpha.300"
                                color="white"
                                size="sm"
                                sx={{
                                  "&::-webkit-calendar-picker-indicator": {
                                    filter: "invert(1)",
                                    opacity: 0.8,
                                    cursor: "pointer",
                                    padding: "4px",
                                    borderRadius: "4px",
                                    _hover: {
                                      opacity: 1,
                                      bg: "whiteAlpha.100"
                                    }
                                  },
                                  "&::-webkit-datetime-edit": {
                                    color: "whiteAlpha.900"
                                  },
                                  colorScheme: "dark"
                                }}
                              />
                            </FormControl>
                          </Grid>


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
                  <Card variant="outline">
                    <CardBody>
                      <ChakraStack spacing={4}>
                        <HStack justify="space-between" align="center">
                          <Heading size="md">Projetos Ativos</Heading>
                          <Button size="sm" variant="outline" onClick={handleNewProject}>
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
            {isAdmin && (
              <TabPanel px={0} pt={8}>
                <UserManagementContent users={allUsers} />
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </ChakraStack>
    </Box>
  );
}
