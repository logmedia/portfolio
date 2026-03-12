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
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Tag,
  TagLabel,
  Text,
  VStack,
  useColorModeValue,
  Divider,
  Grid,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverHeader,
  PopoverArrow,
  PopoverCloseButton,
  SimpleGrid,
  Tooltip,
} from "@chakra-ui/react";
import { 
  Code, Palette, Database, Lightning, BracketsCurly, Cpu, Plus, Trash, 
  Camera, MusicNotes, ChartBar, Globe, Book, Pen, VideoCamera, 
  SpeakerHigh, Flask, MagnifyingGlass, DotsSixVertical, BezierCurve, FilmStrip,
  Strategy, UserCircle, Briefcase, TrendUp
} from "phosphor-react";
import * as PhosphorIcons from "phosphor-react";
import { useState, useMemo } from "react";

export type SkillItem = {
  name: string;
  level: number;
  icon: string;
};

interface SkillsManagerProps {
  initialSkills: SkillItem[];
}

// Curated icons for the "Quick Selection"
const QUICK_ICONS = [
  { name: "Code", icon: Code, label: "Desenvolvimento" },
  { name: "Palette", icon: Palette, label: "Design/Photoshop" },
  { name: "BezierCurve", icon: BezierCurve, label: "Vetor/Illustrator" },
  { name: "FilmStrip", icon: FilmStrip, label: "Vídeo/Premiere" },
  { name: "Camera", icon: Camera, label: "Fotografia" },
  { name: "MusicNotes", icon: MusicNotes, label: "Música" },
  { name: "ChartBar", icon: ChartBar, label: "Marketing/Dados" },
  { name: "Pen", icon: Pen, label: "Escrita/Copy" },
  { name: "Briefcase", icon: Briefcase, label: "Business/Gestão" },
  { name: "TrendUp", icon: TrendUp, label: "Crescimento/SEO" },
];

const SUGGESTIONS = [
  "React", "Adobe Photoshop", "Adobe Illustrator", "Premiere Pro", "Figma", 
  "UI/UX Design", "Estratégia SEO", "Gestão de Tráfego", "Copywriting", 
  "Edição de Vídeo", "Fotografia", "Node.js", "TypeScript", "Inglês Fluente",
  "Liderança", "Scrum/Agile", "Google Analytics", "Social Media"
];

export function SkillsManager({ initialSkills = [] }: SkillsManagerProps) {
  const [skills, setSkills] = useState<SkillItem[]>(initialSkills || []);
  const [newName, setNewName] = useState("");
  const [newLevel, setNewLevel] = useState(80);
  const [newIcon, setNewIcon] = useState("Code");
  const [iconSearch, setIconSearch] = useState("");

  const bg = useColorModeValue("blackAlpha.50", "whiteAlpha.50");
  const borderColor = useColorModeValue("blackAlpha.200", "whiteAlpha.200");

  const addSkill = () => {
    if (!newName.trim()) return;
    setSkills([...skills, { name: newName.trim(), level: newLevel, icon: newIcon }]);
    setNewName("");
    setNewLevel(80);
    // Keep set to Code or try to guess?
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const updateSkillLevel = (index: number, newLevel: number) => {
    const updated = [...skills];
    updated[index].level = newLevel;
    setSkills(updated);
  };

  const serializedSkills = useMemo(() => {
    return skills.map((s) => `${s.name}|${s.level}|${s.icon}`).join("\n");
  }, [skills]);

  // Helper to get Icon Component from string name
  const getIconComponent = (iconName: string) => {
    return (PhosphorIcons as any)[iconName] || (PhosphorIcons as any)[iconName + "Logo"] || Code;
  };

  // Filter Phosphor icons for search (limit to 60 for performance)
  const filteredIcons = useMemo(() => {
    if (!iconSearch) return [];
    return Object.keys(PhosphorIcons)
      .filter(key => key.toLowerCase().includes(iconSearch.toLowerCase()) && typeof (PhosphorIcons as any)[key] === "function")
      .slice(0, 48);
  }, [iconSearch]);

  const CurrentIcon = getIconComponent(newIcon);

  return (
    <Box p={5} bg={bg} borderRadius="xl" border="1px solid" borderColor={borderColor}>
      <textarea name="skills" value={serializedSkills} readOnly style={{ display: "none" }} />

      <VStack spacing={6} align="stretch">
        <Heading size="sm" display="flex" alignItems="center" gap={2}>
          <Icon as={Lightning} color="brand.500" />
          Habilidades & Expertise
        </Heading>

        {/* Suggestions */}
        <Box>
          <Text fontSize="xs" fontWeight="bold" color="whiteAlpha.500" mb={3} textTransform="uppercase" letterSpacing="wider">
            Sugestões Sugeridas:
          </Text>
          <Flex wrap="wrap" gap={2}>
            {SUGGESTIONS.filter((sug) => !skills.some((s) => s.name.toLowerCase() === sug.toLowerCase())).map((suggestion) => (
              <Tag
                key={suggestion}
                size="md"
                variant="subtle"
                colorScheme="whiteAlpha"
                cursor="pointer"
                onClick={() => setNewName(suggestion)}
                _hover={{ bg: "brand.500", color: "white" }}
                transition="all 0.2s"
                borderRadius="full"
              >
                <TagLabel py={1}>{suggestion}</TagLabel>
                <Icon as={Plus} ml={1} />
              </Tag>
            ))}
          </Flex>
        </Box>

        <Divider borderColor="whiteAlpha.100" />

        {/* New Form Design */}
        <Grid templateColumns={{ base: "1fr", md: "auto 2fr 1.5fr auto" }} gap={4} alignItems="end">
          {/* Icon Picker Popover */}
          <FormControl>
            <FormLabel fontSize="xs" color="whiteAlpha.600">Ícone</FormLabel>
            <Popover placement="bottom-start" gutter={12}>
              <PopoverTrigger>
                <Button 
                  size="md" 
                  variant="outline" 
                  borderColor="whiteAlpha.200"
                  _hover={{ bg: 'whiteAlpha.100', borderColor: 'brand.400' }}
                  w="54px"
                  p={0}
                >
                  <Icon as={CurrentIcon} boxSize={6} color="brand.400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent bg="gray.800" borderColor="whiteAlpha.200" boxShadow="xl" w="320px">
                <PopoverArrow bg="gray.800" />
                <PopoverCloseButton />
                <PopoverHeader border="none" fontSize="sm" fontWeight="bold" pt={4}>Selecione um Ícone</PopoverHeader>
                <PopoverBody pb={6}>
                  <VStack spacing={4} align="stretch">
                    <Box>
                      <Text fontSize="10px" color="whiteAlpha.500" mb={3} textTransform="uppercase">Sugestões Rápidas</Text>
                      <SimpleGrid columns={5} gap={2}>
                        {QUICK_ICONS.map((item) => (
                          <Tooltip key={item.name} label={item.label} fontSize="xs">
                            <IconButton
                              aria-label={item.name}
                              icon={<Icon as={item.icon} boxSize={5} />}
                              size="sm"
                              variant={newIcon === item.name ? "solid" : "ghost"}
                              colorScheme={newIcon === item.name ? "brand" : "whiteAlpha"}
                              onClick={() => setNewIcon(item.name)}
                            />
                          </Tooltip>
                        ))}
                      </SimpleGrid>
                    </Box>
                    
                    <Divider borderColor="whiteAlpha.100" />
                    
                    <Box>
                      <Text fontSize="10px" color="whiteAlpha.500" mb={3} textTransform="uppercase">Pesquisar Biblioteca</Text>
                      <Input 
                        placeholder="Ex: heart, guitar..." 
                        size="sm" 
                        variant="filled" 
                        bg="blackAlpha.400"
                        _focus={{ bg: "blackAlpha.500" }}
                        value={iconSearch}
                        onChange={(e) => setIconSearch(e.target.value)}
                        mb={3}
                      />
                      <SimpleGrid columns={6} gap={2} maxH="150px" overflowY="auto" px={1}>
                        {filteredIcons.map(iconKey => {
                          const FoundIcon = PhosphorIcons[iconKey as keyof typeof PhosphorIcons] as any;
                          return (
                            <IconButton
                              key={iconKey}
                              aria-label={iconKey}
                              icon={<Icon as={FoundIcon} />}
                              size="xs"
                              variant={newIcon === iconKey ? "solid" : "ghost"}
                              colorScheme={newIcon === iconKey ? "brand" : "whiteAlpha"}
                              onClick={() => setNewIcon(iconKey)}
                            />
                          );
                        })}
                      </SimpleGrid>
                      {iconSearch && filteredIcons.length === 0 && (
                        <Text fontSize="xs" color="whiteAlpha.400" textAlign="center">Nenhum ícone encontrado</Text>
                      )}
                    </Box>
                  </VStack>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </FormControl>

          <FormControl>
            <FormLabel fontSize="xs" color="whiteAlpha.600">Habilidade / Expertise</FormLabel>
            <Input
              size="md"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Ex: Adobe Photoshop"
              bg="blackAlpha.300"
              borderColor="whiteAlpha.200"
              _focus={{ borderColor: "brand.500" }}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
            />
          </FormControl>

          <FormControl>
             <FormLabel fontSize="xs" color="whiteAlpha.600">
               Proficiência: <Text as="span" color="brand.400" fontWeight="bold">{newLevel}%</Text>
             </FormLabel>
             <Box pt={2}>
              <Slider
                aria-label="slider-proficiencia"
                min={0}
                max={100}
                step={5}
                value={newLevel}
                onChange={(v) => setNewLevel(v)}
                colorScheme="brand"
              >
                <SliderTrack bg="whiteAlpha.200" h="6px" borderRadius="full">
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb boxSize={4} border="2px solid" borderColor="brand.500" />
              </Slider>
             </Box>
          </FormControl>

          <Button 
            size="md" 
            colorScheme="brand" 
            onClick={addSkill} 
            isDisabled={!newName.trim()}
            leftIcon={<Plus weight="bold" />}
            px={8}
          >
            Adicionar
          </Button>
        </Grid>

        {/* Improved Active Skills List */}
        {skills.length > 0 && (
          <VStack spacing={3} align="stretch" mt={4}>
            {skills.map((skill, index) => {
              const SkillIcon = getIconComponent(skill.icon);
              return (
                <Flex
                  key={`${skill.name}-${index}`}
                  p={4}
                  bg="whiteAlpha.50"
                  borderRadius="xl"
                  align="center"
                  border="1px solid"
                  borderColor="whiteAlpha.100"
                  transition="all 0.3s"
                  _hover={{ borderColor: "whiteAlpha.300", bg: "whiteAlpha.100" }}
                  role="group"
                >
                  <HStack spacing={4} flex="1">
                    <Box 
                      p={2} 
                      bg="blackAlpha.400" 
                      borderRadius="lg" 
                      color="brand.400"
                      transition="transform 0.3s"
                      _groupHover={{ transform: 'scale(1.1)' }}
                    >
                      <Icon as={SkillIcon} boxSize={5} />
                    </Box>
                    <Box minW="140px">
                      <Text fontWeight="bold" fontSize="sm">{skill.name}</Text>
                      <Text fontSize="10px" color="whiteAlpha.500" textTransform="uppercase" letterSpacing="wider">Habilidade</Text>
                    </Box>
                    <Box flex="1" px={6}>
                       <Slider
                         aria-label={`slider-${skill.name}`}
                         min={0}
                         max={100}
                         step={5}
                         value={skill.level}
                         onChange={(v) => updateSkillLevel(index, v)}
                         colorScheme="brand"
                       >
                         <SliderTrack bg="whiteAlpha.200" h="5px" borderRadius="full">
                           <SliderFilledTrack />
                         </SliderTrack>
                         <SliderThumb boxSize={3} />
                       </Slider>
                    </Box>
                    <Box minW="50px" textAlign="right">
                      <Text fontSize="sm" fontWeight="black" color="brand.400">
                        {skill.level}%
                      </Text>
                    </Box>
                  </HStack>
                  <IconButton
                    aria-label="Remover"
                    icon={<Trash weight="bold" />}
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => removeSkill(index)}
                    ml={4}
                    opacity={0.3}
                    _groupHover={{ opacity: 1 }}
                  />
                </Flex>
              );
            })}
          </VStack>
        )}
        
        {skills.length === 0 && (
          <Box py={10} textAlign="center" border="2px dashed" borderColor="whiteAlpha.100" borderRadius="xl">
            <Text color="whiteAlpha.400" fontSize="sm">
              Sua lista de expertises está vazia. Comece adicionando uma acima!
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
}
