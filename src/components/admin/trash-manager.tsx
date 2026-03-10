'use client';

import { useState, useTransition } from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Badge,
  Icon,
  useToast,
  Card,
  CardBody,
  Heading,
  SimpleGrid,
  Checkbox,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Image,
} from '@chakra-ui/react';
import { ArrowCounterClockwise, Trash, Warning, Check } from 'phosphor-react';
import { restoreFromTrash, permanentlyDeletePost, getMediaLibrary } from '@/app/actions';
import type { Post } from '@/types/content';

interface TrashManagerProps {
  posts: Post[];
}

export function TrashManager({ posts }: TrashManagerProps) {
  const trashPosts = posts.filter(p => p.status === 'trash');
  const toast = useToast();
  const [isActionPending, startActionTransition] = useTransition();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Media deletion state
  const [associatedMedia, setAssociatedMedia] = useState<{ id: string, path: string, url: string }[]>([]);
  const [selectedMediaIds, setSelectedMediaIds] = useState<string[]>([]);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);

  const handleRestore = (id: string) => {
    startActionTransition(async () => {
      const result = await restoreFromTrash(id);
      if (result.success) {
        toast({ title: 'Projeto restaurado!', status: 'success' });
      } else {
        toast({ title: result.message, status: 'error' });
      }
    });
  };

  const openDeleteModal = async (post: Post) => {
    setSelectedPost(post);
    setIsLoadingMedia(true);
    onOpen();

    // Buscar mídias do projeto na biblioteca de mídia
    const result = await getMediaLibrary();
    if (result.success && result.media) {
      // Filtrar mídias que pertencem a este projeto com base na URL
      const projectUrls = [
        post.hero_image_url,
        ...(post.gallery?.map(g => (typeof g === 'string' ? g : g.url)) || [])
      ].filter(Boolean);

      const foundMedia = result.media.filter((m: any) => projectUrls.includes(m.url));
      setAssociatedMedia(foundMedia);
      // Selecionar todos por padrão
      setSelectedMediaIds(foundMedia.map((m: any) => m.id));
    }
    setIsLoadingMedia(false);
  };

  const handlePermanentDelete = () => {
    if (!selectedPost) return;

    startActionTransition(async () => {
      const mediaToDelete = associatedMedia
        .filter(m => selectedMediaIds.includes(m.id))
        .map(m => ({ id: m.id, path: m.path }));

      const result = await permanentlyDeletePost(selectedPost.id, mediaToDelete);
      
      if (result.success) {
        toast({ title: 'Projeto excluído permanentemente!', status: 'success' });
        onClose();
        setSelectedPost(null);
      } else {
        toast({ title: result.message, status: 'error' });
      }
    });
  };

  if (trashPosts.length === 0) {
    return (
      <Card bg="whiteAlpha.50" border="1px dashed" borderColor="whiteAlpha.200">
        <CardBody textAlign="center" py={10}>
          <Icon as={Trash} size={40} color="whiteAlpha.300" mb={4} />
          <Text color="whiteAlpha.500">A lixeira está vazia.</Text>
        </CardBody>
      </Card>
    );
  }

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        {trashPosts.map((post) => (
          <Card key={post.id} bg="whiteAlpha.50" border="1px solid" borderColor="whiteAlpha.100" overflow="hidden">
            <CardBody p={4}>
              <HStack justify="space-between">
                <HStack spacing={4}>
                  {post.hero_image_url && (
                    <Box w="60px" h="40px" borderRadius="md" overflow="hidden">
                      <Image src={post.hero_image_url} alt="" objectFit="cover" w="100%" h="100%" />
                    </Box>
                  )}
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold" fontSize="sm">{post.title}</Text>
                    <Text fontSize="xs" color="whiteAlpha.500">{post.subtitle || '/projeto/' + post.slug}</Text>
                  </VStack>
                </HStack>
                
                <HStack spacing={2}>
                  <Button
                    size="xs"
                    leftIcon={<ArrowCounterClockwise />}
                    variant="ghost"
                    colorScheme="blue"
                    onClick={() => handleRestore(post.id)}
                    isLoading={isActionPending}
                  >
                    Restaurar
                  </Button>
                  <Button
                    size="xs"
                    leftIcon={<Trash />}
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => openDeleteModal(post)}
                    isLoading={isActionPending}
                  >
                    Excluir Permanentemente
                  </Button>
                </HStack>
              </HStack>
            </CardBody>
          </Card>
        ))}
      </VStack>

      {/* Modal de Exclusão Permanente */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent bg="gray.900" border="1px solid" borderColor="whiteAlpha.200">
          <ModalHeader>Excluir Projeto Permanentemente</ModalHeader>
          <ModalBody>
            <VStack spacing={6} align="stretch">
              <Box bg="red.900" p={4} borderRadius="xl" border="1px solid" borderColor="red.500">
                <HStack align="start" spacing={3}>
                  <Icon as={Warning} color="red.200" mt={1} />
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold" color="red.200" fontSize="sm">Atenção!</Text>
                    <Text color="red.100" fontSize="xs">
                      Esta ação não pode ser desfeita. O projeto e os dados associados serão removidos do banco de dados.
                    </Text>
                  </VStack>
                </HStack>
              </Box>

              {associatedMedia.length > 0 && (
                <Box>
                  <Text fontWeight="bold" fontSize="sm" mb={3}>Limpeza de Arquivos (Storage):</Text>
                  <Text fontSize="xs" color="whiteAlpha.600" mb={4}>
                    Selecione quais arquivos de mídia associados a este projeto deseja remover do Supabase Storage:
                  </Text>
                  <SimpleGrid columns={2} gap={3}>
                    {associatedMedia.map((media) => (
                      <Box 
                        key={media.id} 
                        p={2} 
                        bg="whiteAlpha.50" 
                        borderRadius="md" 
                        border="1px solid" 
                        borderColor={selectedMediaIds.includes(media.id) ? "brand.400" : "whiteAlpha.100"}
                        position="relative"
                        cursor="pointer"
                        onClick={() => {
                          setSelectedMediaIds(prev => 
                            prev.includes(media.id) ? prev.filter(id => id !== media.id) : [...prev, media.id]
                          );
                        }}
                      >
                        <HStack spacing={3}>
                          <Image src={media.url} w="40px" h="40px" objectFit="cover" borderRadius="sm" />
                          <VStack align="start" spacing={0} flex={1}>
                            <Text fontSize="10px" color="whiteAlpha.800" noOfLines={1}>{media.path.split('/').pop()}</Text>
                            <Badge fontSize="8px" colorScheme={selectedMediaIds.includes(media.id) ? "red" : "gray"}>
                              {selectedMediaIds.includes(media.id) ? "Remover" : "Manter"}
                            </Badge>
                          </VStack>
                          {selectedMediaIds.includes(media.id) && (
                            <Icon as={Check} color="brand.400" />
                          )}
                        </HStack>
                      </Box>
                    ))}
                  </SimpleGrid>
                </Box>
              )}

              {isLoadingMedia && (
                <Text fontSize="xs" color="whiteAlpha.500" fontStyle="italic">Buscando mídias associadas...</Text>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter borderTop="1px solid" borderColor="whiteAlpha.100" pt={4}>
            <Button variant="ghost" mr={3} onClick={onClose} size="sm">Cancelar</Button>
            <Button 
                colorScheme="red" 
                size="sm" 
                leftIcon={<Trash />} 
                onClick={handlePermanentDelete}
                isLoading={isActionPending}
            >
              Excluir Tudo Permanentemente
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
