"use client";

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Input,
  Tag,
  TagLabel,
  Text,
  VStack,
  useColorModeValue,
  Divider,
  Grid,
  IconButton,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";
import { Plus, Trash, Link as LinkIcon, DotsSixVertical, GithubLogo, LinkedinLogo, TwitterLogo, InstagramLogo, FacebookLogo, YoutubeLogo, GlobeHemisphereWest, DiscordLogo } from "phosphor-react";
import { useState, useMemo, useRef } from "react";

export type SocialItem = {
  label: string;
  url: string;
};

interface SocialsManagerProps {
  initialSocials: SocialItem[];
}

const SUGGESTIONS = [
  { label: "GitHub", url: "https://github.com/" },
  { label: "LinkedIn", url: "https://linkedin.com/in/" },
  { label: "Twitter", url: "https://twitter.com/" },
  { label: "Instagram", url: "https://instagram.com/" },
  { label: "Facebook", url: "https://facebook.com/" },
  { label: "Discord", url: "https://discord.gg/" },
  { label: "YouTube", url: "https://youtube.com/" },
  { label: "Website", url: "https://" },
];

export function SocialsManager({ initialSocials = [] }: SocialsManagerProps) {
  const [socials, setSocials] = useState<SocialItem[]>(
    Array.isArray(initialSocials) ? initialSocials : []
  );
  const [newLabel, setNewLabel] = useState("");
  const [newHandle, setNewHandle] = useState("");
  
  // Drag and drop state
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragCounter = useRef(0);

  const bg = useColorModeValue("blackAlpha.50", "whiteAlpha.50");
  const borderColor = useColorModeValue("blackAlpha.200", "whiteAlpha.200");

  const getBaseUrl = (label: string) => {
    const sug = SUGGESTIONS.find(s => s.label.toLowerCase() === label.toLowerCase());
    if (sug) return sug.url;
    
    const l = label.toLowerCase();
    if (l.includes("github")) return "https://github.com/";
    if (l.includes("linkedin")) return "https://linkedin.com/in/";
    if (l.includes("twitter") || l.includes("x")) return "https://twitter.com/";
    if (l.includes("instagram") || l.includes("ig")) return "https://instagram.com/";
    if (l.includes("facebook")) return "https://facebook.com/";
    if (l.includes("youtube")) return "https://youtube.com/@";
    if (l.includes("discord")) return "https://discord.gg/";
    return "https://";
  };

  const extractHandle = (label: string, fullUrl: string) => {
    const baseUrl = getBaseUrl(label);
    if (fullUrl.startsWith(baseUrl)) {
      return fullUrl.substring(baseUrl.length);
    }
    if (baseUrl === "https://" && fullUrl.startsWith("https://")) {
      return fullUrl.substring(8);
    }
    return fullUrl;
  };

  const addSocial = () => {
    if (!newLabel.trim() || !newHandle.trim()) return;
    const finalUrl = getBaseUrl(newLabel.trim()) + newHandle.trim();
    setSocials([...socials, { label: newLabel.trim(), url: finalUrl }]);
    setNewLabel("");
    setNewHandle("");
  };

  const removeSocial = (index: number) => {
    setSocials(socials.filter((_, i) => i !== index));
  };
  
  const updateSocialUrl = (index: number, url: string) => {
    const updated = [...socials];
    updated[index].url = url;
    setSocials(updated);
  };

  const updateSocialLabel = (index: number, label: string) => {
    const updated = [...socials];
    updated[index].label = label;
    setSocials(updated);
  };

  // Drag and Drop Logic
  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragEnter = (index: number) => {
    dragCounter.current++;
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragOverIndex(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (dropIndex: number) => {
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null);
      setDragOverIndex(null);
      dragCounter.current = 0;
      return;
    }

    const updated = [...socials];
    const [dragged] = updated.splice(dragIndex, 1);
    updated.splice(dropIndex, 0, dragged);
    
    setSocials(updated);
    
    setDragIndex(null);
    setDragOverIndex(null);
    dragCounter.current = 0;
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
    dragCounter.current = 0;
  };

  // Serializar para enviar como um textarea invisivel ao backend form action
  const serializedSocials = useMemo(() => {
    return socials.map((s) => `${s.label}|${s.url}`).join("\n");
  }, [socials]);
  
  const getIconForLabel = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes("github")) return GithubLogo;
    if (l.includes("linkedin")) return LinkedinLogo;
    if (l.includes("twitter") || l.includes("x")) return TwitterLogo;
    if (l.includes("instagram") || l.includes("ig")) return InstagramLogo;
    if (l.includes("facebook")) return FacebookLogo;
    if (l.includes("youtube")) return YoutubeLogo;
    if (l.includes("discord")) return DiscordLogo;
    return GlobeHemisphereWest;
  };

  return (
    <Box p={4} bg={bg} borderRadius="md" border="1px solid" borderColor={borderColor}>
      {/* Hidden textarea to maintain legacy form submission data parsing */}
      <textarea name="socials" value={serializedSocials} readOnly style={{ display: "none" }} />

      <VStack spacing={6} align="stretch">
        <Heading size="sm" display="flex" alignItems="center" gap={2}>
          <Icon as={LinkIcon} color="brand.500" />
          Links & Redes Sociais
        </Heading>

        {/* Suggestions */}
        <Box>
          <Text fontSize="xs" fontWeight="bold" color="whiteAlpha.600" mb={2} textTransform="uppercase">
            Adicionar Rápido:
          </Text>
          <Flex wrap="wrap" gap={2}>
            {SUGGESTIONS.filter((sug) => !socials.some((s) => s.label.toLowerCase() === sug.label.toLowerCase())).map((suggestion) => {
              const SugIcon = getIconForLabel(suggestion.label);
              return (
                <Tag
                  key={suggestion.label}
                  size="sm"
                  variant="subtle"
                  colorScheme="brand"
                  cursor="pointer"
                  onClick={() => {
                    setNewLabel(suggestion.label);
                    setNewHandle("");
                  }}
                  _hover={{ bg: "brand.500", color: "white" }}
                >
                  <Icon as={SugIcon} mr={1} />
                  <TagLabel>{suggestion.label}</TagLabel>
                  <Icon as={Plus} ml={1} />
                </Tag>
              )
            })}
          </Flex>
        </Box>

        <Divider />

        {/* Add New Form */}
        <Grid templateColumns={{ base: "1fr", md: "1fr 2fr auto" }} gap={4} alignItems="end">
          <FormControl>
            <FormLabel fontSize="xs" color="whiteAlpha.700">Plataforma / Nome</FormLabel>
            <Input
              size="sm"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Ex: GitHub"
              bg="blackAlpha.300"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSocial())}
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="xs" color="whiteAlpha.700">Link Completo</FormLabel>
            <InputGroup size="sm">
              <InputLeftAddon bg="blackAlpha.400" border="none" color="whiteAlpha.600" px={3}>
                {getBaseUrl(newLabel)}
              </InputLeftAddon>
              <Input
                value={newHandle}
                onChange={(e) => setNewHandle(e.target.value)}
                placeholder={getBaseUrl(newLabel) === "https://" ? "seusite.com.br" : "seu_usuario"}
                bg="blackAlpha.300"
                border="none"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSocial())}
              />
            </InputGroup>
          </FormControl>

          <Button size="sm" colorScheme="brand" onClick={addSocial} isDisabled={!newLabel.trim() || !newHandle.trim()}>
            Adicionar
          </Button>
        </Grid>

        {/* Active Socials List */}
        {socials.length > 0 && (
          <VStack spacing={3} align="stretch" mt={4}>
            {socials.map((social, index) => {
              const SelectedIcon = getIconForLabel(social.label);
              const isDragging = dragIndex === index;
              const isDragOver = dragOverIndex === index;
              
              return (
                <Flex
                  key={`${social.label}-${index}`}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragEnter={() => handleDragEnter(index)}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(index)}
                  onDragEnd={handleDragEnd}
                  p={3}
                  bg="whiteAlpha.50"
                  borderRadius="md"
                  align="center"
                  justify="space-between"
                  border="1px solid"
                  borderColor={isDragOver ? "brand.400" : "whiteAlpha.100"}
                  opacity={isDragging ? 0.5 : 1}
                  transition="all 0.2s"
                  _hover={{ borderColor: "whiteAlpha.300" }}
                  cursor="grab"
                  _active={{ cursor: "grabbing" }}
                  gap={{ base: 2, md: 4 }}
                  flexDirection={{ base: "column", md: "row" }}
                >
                  <HStack w={{ base: "full", md: "auto" }}>
                     <Box cursor="grab" mr={2}>
                      <DotsSixVertical size={20} color="gray" weight="bold" />
                    </Box>
                    <Icon as={SelectedIcon} color="brand.400" boxSize={5} />
                    <Input 
                      size="sm"
                      value={social.label}
                      onChange={(e) => updateSocialLabel(index, e.target.value)}
                      bg="blackAlpha.300"
                      border="none"
                      fontWeight="bold" 
                      fontSize="sm" 
                      w="100px" 
                      px={2}
                    />
                  </HStack>

                  <HStack flex="1" w="full">
                    <InputGroup size="sm" flex="1">
                       <InputLeftAddon bg="blackAlpha.400" border="none" color="whiteAlpha.600" px={2} fontSize="xs">
                         {getBaseUrl(social.label)}
                       </InputLeftAddon>
                       <Input 
                         value={extractHandle(social.label, social.url)} 
                         onChange={(e) => updateSocialUrl(index, getBaseUrl(social.label) + e.target.value)}
                         bg="blackAlpha.300"
                         border="none"
                         fontSize="xs"
                         placeholder={getBaseUrl(social.label) === "https://" ? "seusite.com" : "seu_usuario"}
                       />
                    </InputGroup>
                    <IconButton
                      aria-label="Remover rede social"
                      icon={<Trash size={16} />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => removeSocial(index)}
                    />
                  </HStack>
                </Flex>
              );
            })}
          </VStack>
        )}
        
        {socials.length === 0 && (
          <Text fontSize="sm" color="whiteAlpha.400" textAlign="center" py={4}>
            Nenhum link adicionado. Use as sugestões acima.
          </Text>
        )}
        
        {socials.length > 0 && (
          <Text fontSize="xs" color="whiteAlpha.400" textAlign="center">
            Arraste os itens pelos pontinhos para reordená-los
          </Text>
        )}
      </VStack>
    </Box>
  );
}
