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
import { CloudArrowUp, Image as ImageIcon, Trash, CheckCircle, ArrowsClockwise, CaretLeft, CaretRight } from 'phosphor-react';
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
  onBatchSelect?: (mediaItems: MediaFile[]) => void;
  selectedUrl?: string;
}

export function MediaLibrary({ onSelect, onBatchSelect, selectedUrl }: MediaLibraryProps) {
  const [mediaItems, setMediaItems] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const toast = useToast();

  // Estado do processamento de imagem
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewFiles, setPreviewFiles] = useState<{ original: string; processed: string | null }[]>([]);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const [originalSize, setOriginalSize] = useState<{ w: number; h: number; size: number } | null>(null);
  const [processResult, setProcessResult] = useState<ProcessResult | null>(null);
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

  // Processar imagem de preview quando opções ou arquivo selecionado mudam
  useEffect(() => {
    const file = selectedFiles[currentPreviewIndex];
    if (!file) {
      setProcessResult(null);
      setOriginalSize(null);
      return;
    }

    const run = async () => {
      setIsProcessing(true);
      try {
        const img = await loadImage(file);
        setOriginalSize({ w: img.naturalWidth, h: img.naturalHeight, size: file.size });
        
        const result = await processImage(file, options);
        setProcessResult(result);
        
        // Atualizar preview da lista
        setPreviewFiles(prev => {
          const next = [...prev];
          if (next[currentPreviewIndex].processed) URL.revokeObjectURL(next[currentPreviewIndex].processed!);
          next[currentPreviewIndex].processed = URL.createObjectURL(result.blob);
          return next;
        });
      } catch (err) {
        console.error('[ImageProcessor] Error:', err);
      }
      setIsProcessing(false);
    };
    run();
  }, [selectedFiles, currentPreviewIndex, options]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Limpar previews antigos
    previewFiles.forEach(p => {
      URL.revokeObjectURL(p.original);
      if (p.processed) URL.revokeObjectURL(p.processed);
    });

    const newPreviews = files.map(f => ({
      original: URL.createObjectURL(f),
      processed: null
    }));

    setSelectedFiles(files);
    setPreviewFiles(newPreviews);
    setCurrentPreviewIndex(0);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress({ current: 0, total: selectedFiles.length });
    
    const uploadedItems: MediaFile[] = [];
    const errors: string[] = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      setUploadProgress(prev => ({ ...prev, current: i + 1 }));
      const file = selectedFiles[i];

      try {
        // Processar imagem com as opções atuais
        const processed = await processImage(file, options);
        const processedFile = new File([processed.blob], processed.filename, {
          type: processed.blob.type,
        });

        const formData = new FormData();
        formData.append('file', processedFile);

        const result = (await uploadMedia(formData)) as any;
        if (result.success && result.media) {
          uploadedItems.push(result.media as MediaFile);
        } else {
          errors.push(`${file.name}: ${result.message || 'Erro desconhecido'}`);
        }
      } catch (err) {
        errors.push(`${file.name}: Erro ao processar arquivo`);
      }
    }

    if (uploadedItems.length > 0) {
      setMediaItems(prev => [...uploadedItems, ...prev]);
      
      // Se tiver onBatchSelect e enviou múltiplos, usa ele
      if (onBatchSelect && uploadedItems.length > 0) {
        onBatchSelect(uploadedItems);
      } else if (uploadedItems.length > 0) {
        onSelect(uploadedItems[0]);
      }

      toast({
        title: `${uploadedItems.length} arquivo(s) enviados`,
        status: 'success',
        duration: 3000
      });
      resetUploadState();
    }

    if (errors.length > 0) {
      toast({
        title: 'Alguns arquivos falharam',
        description: errors.join('\n'),
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }

    setIsUploading(false);
  };

  const resetUploadState = () => {
    previewFiles.forEach(p => {
      URL.revokeObjectURL(p.original);
      if (p.processed) URL.revokeObjectURL(p.processed);
    });
    setSelectedFiles([]);
    setPreviewFiles([]);
    setCurrentPreviewIndex(0);
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
          <Tab fontSize="sm">Enviar Arquivos {selectedFiles.length > 0 && <Badge ml={2} colorScheme="brand" borderRadius="full">{selectedFiles.length}</Badge>}</Tab>
          <Tab fontSize="sm">Biblioteca de Mídia</Tab>
        </TabList>

        <TabPanels>
          {/* === TAB: UPLOAD === */}
          <TabPanel>
            {selectedFiles.length === 0 ? (
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
                  <Text fontSize="xs" color="whiteAlpha.600">Suporte a múltiplos arquivos em lote</Text>
                </VStack>
                <Button
                  as="label"
                  htmlFor="file-upload-media"
                  cursor="pointer"
                  colorScheme="brand"
                  size="sm"
                >
                  Selecionar Arquivos
                </Button>
                <input
                  id="file-upload-media"
                  ref={fileInputRef}
                  type="file"
                  multiple
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                  accept="image/*"
                />
              </VStack>
            ) : (
              <VStack spacing={4} align="stretch">
                {/* Batch Status / Navigation */}
                {selectedFiles.length > 1 && (
                  <HStack justify="space-between" bg="whiteAlpha.50" p={2} borderRadius="md">
                    <Text fontSize="xs" fontWeight="bold">PROJETO DE LOTE ({selectedFiles.length} arquivos)</Text>
                    <HStack>
                      <IconButton
                        aria-label="Anterior"
                        icon={<CaretLeft />}
                        size="xs"
                        isDisabled={currentPreviewIndex === 0}
                        onClick={() => setCurrentPreviewIndex(i => i - 1)}
                      />
                      <Text fontSize="xs">{currentPreviewIndex + 1} de {selectedFiles.length}</Text>
                      <IconButton
                        aria-label="Próximo"
                        icon={<CaretRight />}
                        size="xs"
                        isDisabled={currentPreviewIndex === selectedFiles.length - 1}
                        onClick={() => setCurrentPreviewIndex(i => i + 1)}
                      />
                    </HStack>
                  </HStack>
                )}

                {/* Preview Original vs Processada */}
                <Grid templateColumns="1fr 1fr" gap={3}>
                  <VStack spacing={1}>
                    <Text fontSize="xs" fontWeight="bold" color="whiteAlpha.500">ORIGINAL</Text>
                    <Box borderRadius="md" overflow="hidden" border="1px solid" borderColor="whiteAlpha.200" h="120px" w="100%">
                      <Image src={previewFiles[currentPreviewIndex]?.original} alt="Original" objectFit="contain" h="100%" w="100%" />
                    </Box>
                    {originalSize && (
                      <Text fontSize="10px" color="whiteAlpha.500">
                        {originalSize.w}×{originalSize.h} • {formatFileSize(originalSize.size)}
                      </Text>
                    )}
                  </VStack>
                  <VStack spacing={1}>
                    <HStack spacing={1}>
                      <Text fontSize="xs" fontWeight="bold" color="brand.300">OTIMIZADA</Text>
                      {savingsPercent > 0 && <Badge colorScheme="green" fontSize="10px">-{savingsPercent}%</Badge>}
                    </HStack>
                    <Box borderRadius="md" overflow="hidden" border="1px solid" borderColor="brand.400" h="120px" w="100%" position="relative">
                      {isProcessing ? (
                        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                          <Spinner size="sm" color="brand.400" />
                        </Box>
                      ) : previewFiles[currentPreviewIndex]?.processed ? (
                        <Image src={previewFiles[currentPreviewIndex].processed!} alt="Processada" objectFit="contain" h="100%" w="100%" />
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

                {/* Opções de Processamento em Lote */}
                <VStack align="stretch" spacing={3}>
                  <Text fontSize="xs" fontWeight="bold" color="whiteAlpha.600">CONFIGURAÇÃO DO LOTE</Text>
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
                </VStack>

                {/* Ações */}
                <HStack justify="flex-end" spacing={2} pt={2}>
                  <Button size="sm" variant="ghost" onClick={resetUploadState} isDisabled={isUploading}>
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="brand"
                    onClick={handleUpload}
                    isLoading={isUploading}
                    loadingText={`Enviando ${uploadProgress.current}/${uploadProgress.total}`}
                    isDisabled={isProcessing || selectedFiles.length === 0}
                    leftIcon={<CloudArrowUp size={16} />}
                  >
                    Iniciar Upload ({selectedFiles.length})
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
