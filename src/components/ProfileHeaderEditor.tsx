'use client';

import { 
  Box, 
  Button, 
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
  TabPanel,
  Avatar,
  SimpleGrid,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { Sparkles, Upload, Image as ImageIcon, Check, Camera, Palette } from "lucide-react";
import { useState } from "react";
import { generateAICover } from "@/app/actions";
import { MediaPicker } from "./admin/media-picker";
import { motion, AnimatePresence } from "framer-motion";

const MotionBox = motion(Box);

const PRESETS = [
  { id: 'tech', url: '/covers/abstract-tech.png', label: 'Abstract Tech' },
  { id: 'gradient', url: '/covers/minimal-gradient.png', label: 'Minimal Gradient' },
  { id: 'dark', url: '/covers/dark-matter.png', label: 'Dark Matter' },
];

interface ProfileHeaderEditorProps {
  avatarUrl: string;
  coverUrl: string;
  onAvatarChange: (url: string) => void;
  onCoverChange: (url: string) => void;
  userName?: string;
  jobTitle?: string;
}

export function ProfileHeaderEditor({ 
  avatarUrl, 
  coverUrl, 
  onAvatarChange, 
  onCoverChange,
  userName = "Seu Nome",
  jobTitle = "Web Developer"
}: ProfileHeaderEditorProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeTab, setActiveTab] = useState<"avatar" | "cover">("cover");
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const toast = useToast();

  const openEditor = (tab: "avatar" | "cover") => {
    setActiveTab(tab);
    onOpen();
  };

  const handleGenerateAI = async (withBanana = false) => {
    if (!aiPrompt && !withBanana) return;
    
    setIsGenerating(true);
    try {
      // "Nano Banana" style enhancement
      const finalPrompt = withBanana 
        ? `${aiPrompt || 'modern tech wallpaper'} with a stylized nano banana aesthetic, vibrant colors, premium texture, hyper-realistic, 8k`
        : aiPrompt;

      const result = await generateAICover(finalPrompt);
      
      if (result.success && result.url) {
        onCoverChange(result.url);
        toast({
          title: "Capa gerada com sucesso!",
          status: "success",
          duration: 5000,
        });
        onClose();
      } else {
        toast({ title: "Erro ao gerar", description: result.message, status: "error" });
      }
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, status: "error" });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <VStack spacing={0} align="stretch" bg="gray.900" borderRadius="2xl" overflow="hidden" border="1px solid" borderColor="whiteAlpha.100" pb={8}>
        <Box 
          w="full" 
          h="140px" 
          position="relative"
          bg="whiteAlpha.50"
        >
          {/* Cover Image + Overlay */}
          <Box w="full" h="full" position="relative" role="group" cursor="pointer" onClick={() => openEditor('cover')}>
            <Image 
              src={coverUrl} 
              alt="Capa" 
              w="full" 
              h="full" 
              objectFit="cover" 
              fallbackSrc="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop"
            />
            <AnimatePresence>
              <MotionBox
                position="absolute"
                inset={0}
                bg="blackAlpha.600"
                display="flex"
                alignItems="center"
                justifyContent="center"
                pb={10} // Shift content up to clear the avatar
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <VStack spacing={1}>
                  <Icon as={ImageIcon} boxSize={5} color="white" />
                  <Text color="white" fontWeight="bold" fontSize="2xs">Alterar Capa</Text>
                </VStack>
              </MotionBox>
            </AnimatePresence>
          </Box>

          {/* Avatar Overlay - Centered exactly like Mobile */}
          <Box 
            position="absolute" 
            bottom="-50px" 
            left="50%"
            transform="translateX(-50%)"
            zIndex={2}
          >
            <Box position="relative" role="group" cursor="pointer" onClick={(e) => { e.stopPropagation(); openEditor('avatar'); }}>
              <Avatar 
                size="2xl" 
                src={avatarUrl} 
                name={userName}
                border="4px solid"
                borderColor="gray.900"
                boxShadow="2xl"
                bg="brand.500"
              />
              <AnimatePresence>
                <MotionBox
                  position="absolute"
                  inset={0}
                  borderRadius="full"
                  bg="blackAlpha.700"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  backdropFilter="blur(4px)"
                >
                  <Icon as={Camera} boxSize={6} color="white" />
                </MotionBox>
              </AnimatePresence>
            </Box>
          </Box>
        </Box>

        {/* Info Preview Section */}
        <VStack mt="60px" spacing={1} align="center" px={4}>
          <Text color="white" fontWeight="bold" fontSize="xl" lineHeight="1.2" textAlign="center">
            {userName}
          </Text>
          <Text fontSize="xs" color="brand.400" fontWeight="bold" letterSpacing="wider" textTransform="uppercase" textAlign="center">
            {jobTitle}
          </Text>
        </VStack>
      </VStack>

      {/* Modal Editor */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay backdropFilter="blur(12px)" bg="blackAlpha.700" />
        <ModalContent bg="gray.900" border="1px solid" borderColor="whiteAlpha.200" borderRadius="2xl">
          <ModalHeader color="white">
            {activeTab === 'cover' ? 'Personalizar Capa' : 'Alterar Foto de Perfil'}
          </ModalHeader>
          <ModalCloseButton color="whiteAlpha.600" />
          <ModalBody pb={8}>
            <Tabs variant="soft-rounded" colorScheme="brand" defaultIndex={activeTab === 'cover' ? 0 : 2}>
              <TabList mb={6} bg="whiteAlpha.50" p={1} borderRadius="full">
                {activeTab === 'cover' && (
                  <>
                    <Tab borderRadius="full"><HStack spacing={2}><Icon as={ImageIcon} /><Text>Presets</Text></HStack></Tab>
                    <Tab borderRadius="full"><HStack spacing={2}><Icon as={Sparkles} /><Text>IA</Text></HStack></Tab>
                  </>
                )}
                <Tab borderRadius="full" w="full"><HStack spacing={2}><Icon as={Upload} /><Text>Upload</Text></HStack></Tab>
              </TabList>

              <TabPanels>
                {activeTab === 'cover' && (
                  <>
                    {/* Presets */}
                    <TabPanel p={0}>
                      <SimpleGrid columns={2} spacing={4}>
                        {PRESETS.map((preset) => (
                          <Box 
                            key={preset.id}
                            position="relative"
                            borderRadius="xl"
                            overflow="hidden"
                            cursor="pointer"
                            border="2px solid"
                            borderColor={coverUrl === preset.url ? "brand.500" : "transparent"}
                            onClick={() => { onCoverChange(preset.url); onClose(); }}
                            _hover={{ transform: "scale(1.02)" }}
                            transition="all 0.2s"
                          >
                            <Image src={preset.url} alt={preset.label} h="120px" w="full" objectFit="cover" />
                            <Box position="absolute" bottom={0} left={0} right={0} bg="blackAlpha.700" p={2} backdropFilter="blur(4px)">
                              <Text color="white" fontWeight="bold" fontSize="xs" textAlign="center">{preset.label}</Text>
                            </Box>
                          </Box>
                        ))}
                      </SimpleGrid>
                    </TabPanel>

                    {/* IA */}
                    <TabPanel p={0}>
                      <VStack spacing={6} align="stretch">
                        <FormControl>
                          <FormLabel fontSize="sm" color="whiteAlpha.600">O que você deseja ver na sua capa?</FormLabel>
                          <Input 
                            placeholder="Ex: Uma cidade cyberpunk chuvosa..." 
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            bg="whiteAlpha.50"
                            h="50px"
                            borderRadius="lg"
                          />
                        </FormControl>
                        <HStack spacing={4}>
                          <Button 
                            flex={1}
                            leftIcon={isGenerating ? <Spinner size="xs" /> : <Sparkles size={18} />}
                            colorScheme="brand"
                            onClick={() => handleGenerateAI(false)}
                            isDisabled={!aiPrompt || isGenerating}
                            h="50px"
                          >
                            Gerar Normal
                          </Button>
                          <Tooltip label="Gera uma imagem com o exclusivo estilo Nano Banana">
                            <Button 
                              flex={1}
                              leftIcon={<Icon as={Palette} />}
                              variant="outline"
                              borderColor="yellow.400"
                              color="yellow.400"
                              _hover={{ bg: "yellow.400", color: "black" }}
                              onClick={() => handleGenerateAI(true)}
                              isDisabled={isGenerating}
                              h="50px"
                            >
                              Estilo Nano Banana 🍌
                            </Button>
                          </Tooltip>
                        </HStack>
                      </VStack>
                    </TabPanel>
                  </>
                )}

                {/* Upload (for both) */}
                <TabPanel p={0}>
                  <VStack spacing={4} align="center">
                    <MediaPicker 
                      label={activeTab === 'cover' ? "Upload de Capa" : "Upload de Avatar"}
                      value={activeTab === 'cover' ? coverUrl : avatarUrl}
                      onChange={(url: string) => {
                        if (activeTab === 'cover') onCoverChange(url);
                        else onAvatarChange(url);
                        onClose();
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
