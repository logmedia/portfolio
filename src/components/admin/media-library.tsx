'use client';

import { useState, useEffect, useTransition } from 'react';
import {
  Box,
  Button,
  Grid,
  Image,
  Text,
  VStack,
  HStack,
  useToast,
  Spinner,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  IconButton,
} from '@chakra-ui/react';
import { CloudArrowUp, Image as ImageIcon, Trash, CheckCircle } from 'phosphor-react';
import { getMediaLibrary, uploadMedia, deleteMedia } from '@/app/actions';

interface MediaFile {
  id: string;
  filename: string;
  url: string;
  path: string;
  type: string;
  created_at: string;
}

interface MediaLibraryProps {
  onSelect: (media: MediaFile) => void;
  selectedUrl?: string;
}

export function MediaLibrary({ onSelect, selectedUrl }: MediaLibraryProps) {
  const [mediaItems, setMediaItems] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, startUploadTransition] = useTransition();
  const toast = useToast();

  const fetchMedia = async () => {
    setIsLoading(true);
    const result = (await getMediaLibrary()) as any;
    if (result.success && result.media) {
      setMediaItems(result.media as MediaFile[]);
    } else {
      toast({ title: result.message || 'Erro ao carregar mídia', status: 'error' });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limite de 5MB para evitar erro 400 de payload no Vercel/Next.js
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Arquivo muito grande', description: 'O limite é de 5MB.', status: 'warning' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    startUploadTransition(async () => {
      try {
        const result = (await uploadMedia(formData)) as any;
        if (result.success && result.media) {
          toast({ title: 'Upload concluído!', status: 'success' });
          setMediaItems([result.media as MediaFile, ...mediaItems]);
          onSelect(result.media as MediaFile);
        } else {
          toast({ title: 'Erro no servidor', description: result.message || 'Erro no upload', status: 'error' });
        }
      } catch (err: any) {
        toast({ title: 'Erro de conexão', description: 'O servidor não respondeu corretamente.', status: 'error' });
      }
    });
  };

  const handleDelete = async (id: string, path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Deseja excluir permanentemente este arquivo?')) return;

    const result = await deleteMedia(id, path);
    if (result.success) {
      setMediaItems(mediaItems.filter((item) => item.id !== id));
      toast({ title: 'Arquivo excluído', status: 'success' });
    } else {
      toast({ title: result.message || 'Erro ao excluir', status: 'error' });
    }
  };

  return (
    <Box bg="gray.900" borderRadius="xl" border="1px solid" borderColor="whiteAlpha.200" overflow="hidden">
      <Tabs variant="soft-rounded" colorScheme="brand" p={4}>
        <TabList mb={4}>
          <Tab fontSize="sm">Enviar Arquivo</Tab>
          <Tab fontSize="sm">Biblioteca de Mídia</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <VStack
              spacing={4}
              py={12}
              border="2px dashed"
              borderColor="whiteAlpha.300"
              borderRadius="xl"
              _hover={{ borderColor: 'brand.400', bg: 'whiteAlpha.50' }}
              transition="all 0.2s"
              position="relative"
            >
                <CloudArrowUp size={48} style={{ opacity: 0.5 }} />
                <VStack spacing={1}>
                  <Text fontWeight="bold">Solte arquivos aqui para enviar</Text>
                  <Text fontSize="xs" color="whiteAlpha.600">Ou clique para selecionar do seu computador</Text>
                </VStack>
                <Button
                  as="label"
                  htmlFor="file-upload"
                  cursor="pointer"
                  colorScheme="brand"
                  size="sm"
                  isLoading={isUploading}
                >
                  Selecionar Arquivo
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                  accept="image/*"
                />
              </VStack>
            </TabPanel>

            <TabPanel px={0}>
              {isLoading ? (
                <Box display="flex" justifyContent="center" py={12}>
                  <Spinner color="brand.400" />
                </Box>
              ) : mediaItems.length === 0 ? (
                <VStack py={12} color="whiteAlpha.400">
                  <ImageIcon size={40} />
                  <Text>Nenhum arquivo encontrado</Text>
                </VStack>
              ) : (
                <Grid templateColumns="repeat(auto-fill, minmax(100px, 1fr))" gap={3} maxH="400px" overflowY="auto" px={2}>
                  {mediaItems.map((item) => (
                    <Box
                      key={item.id}
                      position="relative"
                      borderRadius="md"
                      overflow="hidden"
                      cursor="pointer"
                      sx={{ aspectRatio: "1/1" }}
                      border="2px solid"
                      borderColor={selectedUrl === item.url ? "brand.400" : "transparent"}
                      onClick={() => onSelect(item)}
                      role="group"
                    >
                      <Image
                        src={item.url}
                        alt={item.filename}
                        objectFit="cover"
                        w="100%"
                        h="100%"
                        fallbackSrc="https://via.placeholder.com/100?text=..."
                      />
                      
                      {selectedUrl === item.url && (
                        <Box
                          position="absolute"
                          top={1}
                          right={1}
                          bg="brand.400"
                          borderRadius="full"
                          p={0.5}
                        >
                          <CheckCircle color="white" weight="fill" size={16} />
                        </Box>
                      )}

                    <IconButton
                      aria-label="Deletar"
                      icon={<Trash />}
                      size="xs"
                      colorScheme="red"
                      position="absolute"
                      bottom={1}
                      right={1}
                      visibility="hidden"
                      _groupHover={{ visibility: "visible" }}
                      onClick={(e) => handleDelete(item.id, item.path, e)}
                    />
                  </Box>
                ))}
              </Grid>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
