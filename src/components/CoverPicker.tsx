"use client";

import { 
  Box, 
  Button, 
  SimpleGrid, 
  Image, 
  Text, 
  VStack, 
  HStack, 
  Icon, 
  useToast,
  Input,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Spinner,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from "@chakra-ui/react";
import { Sparkles, Upload, Image as ImageIcon, Check } from "lucide-react";
import { useState } from "react";
import { updateProfile, generateAICover } from "@/app/actions";
import { MediaPicker } from "./admin/media-picker";

const PRESETS = [
  { id: 'tech', url: '/covers/abstract-tech.png', label: 'Abstract Tech' },
  { id: 'gradient', url: '/covers/minimal-gradient.png', label: 'Minimal Gradient' },
  { id: 'dark', url: '/covers/dark-matter.png', label: 'Dark Matter' },
];

interface CoverPickerProps {
  currentCover?: string;
  onChange?: (url: string) => void;
}

export function CoverPicker({ currentCover, onChange }: CoverPickerProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCover, setSelectedCover] = useState(currentCover);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSelectPreset = async (url: string) => {
    setSelectedCover(url);
    if (onChange) onChange(url);
    onClose();
  };

  const handleGenerateAI = async () => {
    if (!aiPrompt) return;
    
    // Basic frontend rate limiting: 1 request per minute
    const lastGen = localStorage.getItem('last_ai_gen');
    if (lastGen) {
      const diff = Date.now() - parseInt(lastGen);
      if (diff < 60000) {
        toast({
          title: "Limite atingido",
          description: `Por favor, aguarde ${Math.ceil((60000 - diff) / 1000)}s antes de gerar outra imagem.`,
          status: "warning",
          duration: 3000,
        });
        return;
      }
    }
    
    setIsGenerating(true);
    try {
      const result = await generateAICover(aiPrompt);
      
      if (result.success) {
        localStorage.setItem('last_ai_gen', Date.now().toString());
        setSelectedCover(result.url);
        toast({
          title: "Capa gerada com sucesso!",
          status: "success",
          duration: 5000,
        });
        if (onChange && result.url) onChange(result.url);
        onClose();
      } else {
        toast({
          title: "Erro ao gerar imagem",
          description: result.message,
          status: "error",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro crítico",
        description: error.message,
        status: "error",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Box 
        w="full" 
        h="120px" 
        borderRadius="md" 
        bg="whiteAlpha.50" 
        border="1px dashed" 
        borderColor="whiteAlpha.200"
        position="relative"
        overflow="hidden"
        display="flex"
        alignItems="center"
        justifyContent="center"
        role="group"
      >
        {currentCover ? (
          <>
            <Image 
              src={currentCover} 
              alt="Capa" 
              w="full" 
              h="full" 
              objectFit="cover" 
            />
            <Box 
              position="absolute" 
              inset={0} 
              bg="blackAlpha.600" 
              opacity={0} 
              _groupHover={{ opacity: 1 }} 
              transition="all 0.2s"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Button 
                leftIcon={<Sparkles size={18} />} 
                variant="solid" 
                size="sm" 
                colorScheme="brand"
                onClick={onOpen}
              >
                Mudar Capa
              </Button>
            </Box>
          </>
        ) : (
          <Button 
            leftIcon={<Sparkles size={18} />} 
            variant="outline" 
            size="sm" 
            colorScheme="brand"
            onClick={onOpen}
          >
            Adicionar Capa
          </Button>
        )}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay backdropFilter="blur(8px)" />
        <ModalContent bg="gray.900" border="1px solid" borderColor="whiteAlpha.200">
          <ModalHeader>Personalizar Capa</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={8}>
            <Tabs variant="soft-rounded" colorScheme="brand">
              <TabList mb={6}>
                <Tab><HStack spacing={2}><Icon as={ImageIcon} /><Text>Presets</Text></HStack></Tab>
                <Tab><HStack spacing={2}><Icon as={Sparkles} /><Text>IA (Beta)</Text></HStack></Tab>
                <Tab><HStack spacing={2}><Icon as={Upload} /><Text>Upload</Text></HStack></Tab>
              </TabList>

              <TabPanels>
                {/* Presets */}
                <TabPanel p={0}>
                  <SimpleGrid columns={2} spacing={4}>
                    {PRESETS.map((preset) => (
                      <Box 
                        key={preset.id}
                        position="relative"
                        borderRadius="md"
                        overflow="hidden"
                        cursor="pointer"
                        border="2px solid"
                        borderColor={selectedCover === preset.url ? "brand.500" : "transparent"}
                        onClick={() => handleSelectPreset(preset.url)}
                        _hover={{ opacity: 0.8 }}
                        transition="all 0.2s"
                      >
                        <Image src={preset.url} alt={preset.label} h="100px" w="full" objectFit="cover" />
                        <Box 
                          position="absolute" 
                          inset={0} 
                          bg="blackAlpha.400" 
                          display="flex" 
                          alignItems="center" 
                          justifyContent="center"
                        >
                          <Text color="white" fontWeight="bold" fontSize="xs">{preset.label}</Text>
                        </Box>
                        {selectedCover === preset.url && (
                          <Circle size="24px" bg="brand.500" position="absolute" top={2} right={2}>
                            <Icon as={Check} color="white" size={12} />
                          </Circle>
                        )}
                      </Box>
                    ))}
                  </SimpleGrid>
                </TabPanel>

                {/* IA Generation */}
                <TabPanel p={0}>
                  <VStack spacing={4} align="stretch">
                    <FormControl>
                      <FormLabel fontSize="sm" color="whiteAlpha.600">Descreva a capa que você imagina</FormLabel>
                      <Input 
                        placeholder="Ex: Uma paisagem futurista em tons de neon..." 
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        bg="whiteAlpha.50"
                      />
                    </FormControl>
                    <Button 
                      leftIcon={isGenerating ? <Spinner size="xs" /> : <Sparkles size={18} />}
                      colorScheme="brand"
                      onClick={handleGenerateAI}
                      isDisabled={!aiPrompt || isGenerating}
                    >
                      {isGenerating ? "Gerando..." : "Gerar com IA"}
                    </Button>
                    <Text fontSize="xs" color="whiteAlpha.400" textAlign="center">
                      * O recurso de geração real requer integração com API de IA (DALL-E/Stable Diffusion).
                    </Text>
                  </VStack>
                </TabPanel>

                {/* Manual Upload */}
                <TabPanel p={0}>
                  <VStack spacing={4}>
                    <Text fontSize="sm" color="whiteAlpha.600">Suba sua própria imagem de capa (Recomendado: 1920x400)</Text>
                    <MediaPicker 
                      label="Upload de Foto"
                      value={selectedCover}
                      onChange={(url: string) => {
                        handleSelectPreset(url);
                      }} 
                    />
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

function Circle({ size, bg, children, ...props }: any) {
  return (
    <Box 
      w={size} 
      h={size} 
      bg={bg} 
      borderRadius="full" 
      display="flex" 
      alignItems="center" 
      justifyContent="center" 
      {...props}
    >
      {children}
    </Box>
  );
}
