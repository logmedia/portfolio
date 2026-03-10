'use client';

import { useState, useEffect, useTransition, useRef } from 'react';
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
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Badge,
  Divider,
} from '@chakra-ui/react';
import { CloudArrowUp, Image as ImageIcon, Trash, CheckCircle, ArrowsClockwise } from 'phosphor-react';
import { getMediaLibrary, uploadMedia, deleteMedia } from '@/app/actions';
import {
  processImage,
  loadImage,
  formatFileSize,
  PRESETS,
  FORMAT_LABELS,
  DEFAULT_OPTIONS,
  type ProcessOptions,
  type ProcessResult,
  type ImageFormat,
  type ImagePreset,
} from '@/lib/image-processor';

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

  // Estado do processamento de imagem
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedPreview, setProcessedPreview] = useState<string | null>(null);
  const [processResult, setProcessResult] = useState<ProcessResult | null>(null);
  const [originalSize, setOriginalSize] = useState<{ w: number; h: number; size: number } | null>(null);
  const [options, setOptions] = useState<ProcessOptions>({ ...DEFAULT_OPTIONS });
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      const result = (await getMediaLibrary()) as any;
      if (result.success && result.media) {
        setMediaItems(result.media as MediaFile[]);
      }
    } catch {}
    setIsLoading(false);
  };

  useEffect(() => { fetchMedia(); }, []);

  // Processar imagem quando opções mudam
  useEffect(() => {
    if (!selectedFile) return;
    const run = async () => {
      setIsProcessing(true);
      try {
        const result = await processImage(selectedFile, options);
        setProcessResult(result);
        if (processedPreview) URL.revokeObjectURL(processedPreview);
        setProcessedPreview(URL.createObjectURL(result.blob));
      } catch (err) {
        console.error('[ImageProcessor] Error:', err);
      }
      setIsProcessing(false);
    };
    run();
  }, [selectedFile, options]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({ title: 'Arquivo muito grande', description: 'O limite é de 10MB.', status: 'warning' });
      return;
    }

    setSelectedFile(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));

    const img = await loadImage(file);
    setOriginalSize({ w: img.naturalWidth, h: img.naturalHeight, size: file.size });
  };

  const handleUpload = () => {
    if (!processResult || !selectedFile) return;

    startUploadTransition(async () => {
      try {
        const processedFile = new File([processResult.blob], processResult.filename, {
          type: processResult.blob.type,
        });

        const formData = new FormData();
        formData.append('file', processedFile);

        const result = (await uploadMedia(formData)) as any;
        if (result.success && result.media) {
          toast({ title: 'Upload concluído!', status: 'success' });
          setMediaItems([result.media as MediaFile, ...mediaItems]);
          onSelect(result.media as MediaFile);
          resetUploadState();
        } else {
          toast({ title: 'Erro no upload', description: result.message, status: 'error' });
        }
      } catch {
        toast({ title: 'Erro de conexão', status: 'error' });
      }
    });
  };

  const resetUploadState = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (processedPreview) URL.revokeObjectURL(processedPreview);
    setPreviewUrl(null);
    setProcessedPreview(null);
    setProcessResult(null);
    setOriginalSize(null);
    setOptions({ ...DEFAULT_OPTIONS });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (id: string, path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Deseja excluir permanentemente este arquivo?')) return;

    const result = await deleteMedia(id, path);
    if (result.success) {
      setMediaItems(mediaItems.filter((item) => item.id !== id));
      toast({ title: 'Arquivo excluído', status: 'success' });
    } else {
      toast({ title: 'Erro ao excluir', status: 'error' });
    }
  };

  const savingsPercent = originalSize && processResult
    ? Math.round((1 - processResult.size / originalSize.size) * 100)
    : 0;

  return (
    <Box bg="gray.900" borderRadius="xl" border="1px solid" borderColor="whiteAlpha.200" overflow="hidden">
      <Tabs variant="soft-rounded" colorScheme="brand" p={4}>
        <TabList mb={4}>
          <Tab fontSize="sm">Enviar Arquivo</Tab>
          <Tab fontSize="sm">Biblioteca de Mídia</Tab>
        </TabList>

        <TabPanels>
          {/* === TAB: UPLOAD === */}
          <TabPanel>
            {!selectedFile ? (
              <VStack
                spacing={4}
                py={12}
                border="2px dashed"
                borderColor="whiteAlpha.300"
                borderRadius="xl"
                _hover={{ borderColor: 'brand.400', bg: 'whiteAlpha.50' }}
                transition="all 0.2s"
              >
                <CloudArrowUp size={48} style={{ opacity: 0.5 }} />
                <VStack spacing={1}>
                  <Text fontWeight="bold">Solte arquivos aqui para enviar</Text>
                  <Text fontSize="xs" color="whiteAlpha.600">Ou clique para selecionar do seu computador</Text>
                </VStack>
                <Button
                  as="label"
                  htmlFor="file-upload-media"
                  cursor="pointer"
                  colorScheme="brand"
                  size="sm"
                >
                  Selecionar Arquivo
                </Button>
                <input
                  id="file-upload-media"
                  ref={fileInputRef}
                  type="file"
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                  accept="image/*"
                />
              </VStack>
            ) : (
              <VStack spacing={4} align="stretch">
                {/* Preview Original vs Processada */}
                <Grid templateColumns="1fr 1fr" gap={3}>
                  <VStack spacing={1}>
                    <Text fontSize="xs" fontWeight="bold" color="whiteAlpha.500">ORIGINAL</Text>
                    <Box borderRadius="md" overflow="hidden" border="1px solid" borderColor="whiteAlpha.200" maxH="120px">
                      {previewUrl && <Image src={previewUrl} alt="Original" objectFit="contain" maxH="120px" mx="auto" />}
                    </Box>
                    {originalSize && (
                      <Text fontSize="10px" color="whiteAlpha.500">
                        {originalSize.w}×{originalSize.h} • {formatFileSize(originalSize.size)}
                      </Text>
                    )}
                  </VStack>
                  <VStack spacing={1}>
                    <HStack spacing={1}>
                      <Text fontSize="xs" fontWeight="bold" color="brand.300">PROCESSADA</Text>
                      {savingsPercent > 0 && <Badge colorScheme="green" fontSize="10px">-{savingsPercent}%</Badge>}
                    </HStack>
                    <Box borderRadius="md" overflow="hidden" border="1px solid" borderColor="brand.400" maxH="120px" position="relative">
                      {isProcessing ? (
                        <Box display="flex" alignItems="center" justifyContent="center" h="120px">
                          <Spinner size="sm" color="brand.400" />
                        </Box>
                      ) : processedPreview ? (
                        <Image src={processedPreview} alt="Processada" objectFit="contain" maxH="120px" mx="auto" />
                      ) : null}
                    </Box>
                    {processResult && (
                      <Text fontSize="10px" color="brand.300">
                        {processResult.width}×{processResult.height} • {formatFileSize(processResult.size)}
                      </Text>
                    )}
                  </VStack>
                </Grid>

                <Divider borderColor="whiteAlpha.200" />

                {/* Opções de Processamento */}
                <Grid templateColumns="1fr 1fr" gap={3}>
                  <VStack align="stretch" spacing={1}>
                    <Text fontSize="xs" fontWeight="bold" color="whiteAlpha.500">FORMATO</Text>
                    <Select
                      size="sm"
                      bg="blackAlpha.300"
                      value={options.format}
                      onChange={(e) => setOptions({ ...options, format: e.target.value as ImageFormat })}
                    >
                      {(Object.entries(FORMAT_LABELS) as [ImageFormat, string][]).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </Select>
                  </VStack>

                  <VStack align="stretch" spacing={1}>
                    <Text fontSize="xs" fontWeight="bold" color="whiteAlpha.500">DIMENSÃO</Text>
                    <Select
                      size="sm"
                      bg="blackAlpha.300"
                      value={options.preset}
                      onChange={(e) => setOptions({ ...options, preset: e.target.value as ImagePreset })}
                    >
                      {(Object.entries(PRESETS) as [ImagePreset, { label: string }][]).map(([key, val]) => (
                        <option key={key} value={key}>{val.label}</option>
                      ))}
                    </Select>
                  </VStack>
                </Grid>

                {options.format !== 'png' && (
                  <VStack align="stretch" spacing={1}>
                    <HStack justify="space-between">
                      <Text fontSize="xs" fontWeight="bold" color="whiteAlpha.500">QUALIDADE</Text>
                      <Text fontSize="xs" color="brand.300" fontWeight="bold">{Math.round(options.quality * 100)}%</Text>
                    </HStack>
                    <Slider
                      min={10}
                      max={100}
                      step={5}
                      value={options.quality * 100}
                      onChange={(val) => setOptions({ ...options, quality: val / 100 })}
                      colorScheme="brand"
                    >
                      <SliderTrack bg="whiteAlpha.200">
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                  </VStack>
                )}

                {/* Ações */}
                <HStack justify="flex-end" spacing={2}>
                  <Button size="sm" variant="ghost" onClick={resetUploadState}>
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="brand"
                    onClick={handleUpload}
                    isLoading={isUploading}
                    isDisabled={!processResult || isProcessing}
                    leftIcon={<CloudArrowUp size={16} />}
                  >
                    Enviar {processResult ? formatFileSize(processResult.size) : ''}
                  </Button>
                </HStack>
              </VStack>
            )}
          </TabPanel>

          {/* === TAB: BIBLIOTECA === */}
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
                      onClick={(e: React.MouseEvent) => handleDelete(item.id, item.path, e)}
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
