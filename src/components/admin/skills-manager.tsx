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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Textarea,
  Center,
} from "@chakra-ui/react";
import { 
  Code, Palette, Database, Lightning, BracketsCurly, Cpu, Plus, Trash, 
  Camera, MusicNotes, ChartBar, Globe, Book, Pen, VideoCamera, 
  SpeakerHigh, Flask, MagnifyingGlass, DotsSixVertical, BezierCurve, FilmStrip,
  Strategy, UserCircle, Briefcase, TrendUp, IdentificationBadge, PaintBrush
} from "phosphor-react";
import * as PhosphorIcons from "phosphor-react";
import { 
  TbBrandAdobePhotoshop, TbBrandAdobeIllustrator, TbBrandAdobeAfterEffect,
  TbBrandAdobeIndesign, TbBrandFigma, TbBrandTailwind, TbBrandNextjs,
  TbBrandReact, TbBrandTypescript, TbBrandNodejs, TbBrandSupabase,
  TbBrandAdobe, TbCheck
} from "react-icons/tb";
import { useState, useMemo } from "react";

export type SkillItem = {
  name: string;
  level: number;
  icon: string;
  color?: string;
  customSvg?: string;
};

interface SkillsManagerProps {
  initialSkills: SkillItem[];
}

// Brand icons map
const BRAND_ICONS: Record<string, any> = {
  TbBrandAdobePhotoshop, TbBrandAdobeIllustrator, TbBrandAdobeAfterEffect,
  TbBrandAdobeIndesign, TbBrandFigma, TbBrandTailwind, TbBrandNextjs,
  TbBrandReact, TbBrandTypescript, TbBrandNodejs, TbBrandSupabase,
  TbBrandAdobe
};

// Selection Colors
const COLOR_OPTIONS = [
  "#3182CE", "#E53E3E", "#38A169", "#D69E2E", "#805AD5", "#D53F8C", 
  "#319795", "#718096", "#00B5D8", "#48BB78", "#F6AD55", "#9F7AEA"
];

// Curated icons for the "Quick Selection"
const QUICK_ICONS = [
  { name: "TbBrandAdobePhotoshop", icon: TbBrandAdobePhotoshop, label: "Photoshop", color: "#31A8FF" },
  { name: "TbBrandAdobeIllustrator", icon: TbBrandAdobeIllustrator, label: "Illustrator", color: "#FF9A00" },
  { name: "TbBrandAdobeAfterEffect", icon: TbBrandAdobeAfterEffect, label: "After Effect", color: "#CF96FD" },
  { name: "TbBrandFigma", icon: TbBrandFigma, label: "Figma", color: "#F24E1E" },
  { name: "Code", icon: Code, label: "Dev" },
  { name: "Palette", icon: Palette, label: "Design" },
  { name: "Camera", icon: Camera, label: "Foto" },
  { name: "MusicNotes", icon: MusicNotes, label: "Música" },
  { name: "VideoCamera", icon: VideoCamera, label: "Vídeo" },
  { name: "TrendUp", icon: TrendUp, label: "Crescimento" },
];

const SUGGESTIONS = [
  "Adobe Photoshop", "Adobe Illustrator", "Premiere Pro", "Figma", 
  "UI/UX Design", "React", "Next.js", "Node.js", "TypeScript",
  "Fotografia Digital", "Edição de Vídeo", "Gestão de Tráfego", "Copywriting",
  "Estratégia SEO", "Inglês Fluente", "Liderança"
];

export function SkillsManager({ initialSkills = [] }: SkillsManagerProps) {
  const [skills, setSkills] = useState<SkillItem[]>(initialSkills || []);
  const [newName, setNewName] = useState("");
  const [newLevel, setNewLevel] = useState(80);
  const [newIcon, setNewIcon] = useState("Code");
  const [newColor, setNewColor] = useState("");
  const [newCustomSvg, setNewCustomSvg] = useState("");
  const [iconSearch, setIconSearch] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const bg = useColorModeValue("blackAlpha.50", "whiteAlpha.50");
  const borderColor = useColorModeValue("blackAlpha.200", "whiteAlpha.200");

  const addSkill = () => {
    if (!newName.trim()) return;
    setSkills([...skills, { 
      name: newName.trim(), 
      level: newLevel, 
      icon: newIcon, 
      color: newColor, 
      customSvg: newCustomSvg 
    }]);
    resetForm();
  };

  const resetForm = () => {
    setNewName("");
    setNewLevel(80);
    setNewIcon("Code");
    setNewColor("");
    setNewCustomSvg("");
    setEditingIndex(null);
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
    if (editingIndex === index) resetForm();
  };

  const updateSkill = (index: number, updates: Partial<SkillItem>) => {
    const updated = [...skills];
    updated[index] = { ...updated[index], ...updates };
    setSkills(updated);
  };

  const serializedSkills = useMemo(() => {
    // Format: name|level|icon|color|customSvgBase64
    return skills.map((s) => {
      const svgBase64 = s.customSvg ? btoa(unescape(encodeURIComponent(s.customSvg))) : "";
      return `${s.name}|${s.level}|${s.icon}|${s.color || ""}|${svgBase64}`;
    }).join("\n");
  }, [skills]);

  // Helper to get Icon Component from string name
  const getIconComponent = (iconName: string, customSvg?: string) => {
    if (iconName === "custom" && customSvg) {
      return () => (
        <Box 
          dangerouslySetInnerHTML={{ __html: customSvg }} 
          boxSize="full"
          sx={{ 'svg': { width: '100%', height: '100%', fill: 'currentColor' } }}
        />
      );
    }
    if (BRAND_ICONS[iconName]) return BRAND_ICONS[iconName];
    return (PhosphorIcons as any)[iconName] || (PhosphorIcons as any)[iconName + "Logo"] || Code;
  };

  const filteredIcons = useMemo(() => {
    const query = iconSearch.trim().toLowerCase();
    if (query.length < 2) return [];
    
    return Object.keys(PhosphorIcons)
      .filter(key => {
        const val = (PhosphorIcons as any)[key];
        const isComponent = typeof val === "function" || (typeof val === "object" && val !== null);
        return isComponent && key.toLowerCase().includes(query);
      })
      .slice(0, 48);
  }, [iconSearch]);

  const CurrentIcon = getIconComponent(
    editingIndex !== null ? skills[editingIndex].icon : newIcon,
    editingIndex !== null ? skills[editingIndex].customSvg : newCustomSvg
  );

  const CurrentColor = editingIndex !== null ? skills[editingIndex].color : newColor;

  const IconPickerPopover = ({ index = -1 }: { index?: number }) => {
    const isEditing = index !== -1;
    const item = isEditing ? skills[index] : null;
    const activeIcon = isEditing ? item?.icon : newIcon;
    const activeColor = isEditing ? item?.color : newColor;
    const activeSvg = isEditing ? item?.customSvg : newCustomSvg;

    const setIcon = (name: string) => isEditing ? updateSkill(index, { icon: name }) : setNewIcon(name);
    const setColor = (color: string) => isEditing ? updateSkill(index, { color }) : setNewColor(color);
    const setSvg = (svg: string) => {
      if (isEditing) {
        updateSkill(index, { icon: "custom", customSvg: svg });
      } else {
        setNewIcon("custom");
        setNewCustomSvg(svg);
      }
    };

    return (
      <PopoverContent bg="gray.800" borderColor="whiteAlpha.200" boxShadow="xl" w="350px">
        <PopoverArrow bg="gray.800" />
        <PopoverCloseButton />
        <PopoverHeader border="none" fontSize="sm" fontWeight="bold" pt={4}>
          Personalizar Ícone
        </PopoverHeader>
        <PopoverBody pb={6}>
          <Tabs size="sm" variant="soft-rounded" colorScheme="brand">
            <TabList mb={4}>
              <Tab fontSize="xs">Biblioteca</Tab>
              <Tab fontSize="xs">Personalizado</Tab>
            </TabList>
            <TabPanels>
              <TabPanel p={0}>
                <VStack spacing={4} align="stretch">
                  <Box>
                    <Text fontSize="10px" color="whiteAlpha.500" mb={3} textTransform="uppercase">Sugestões e Cores</Text>
                    <SimpleGrid columns={5} gap={2} mb={4}>
                      {QUICK_ICONS.map((q) => (
                        <IconButton
                          key={q.name}
                          aria-label={q.label}
                          icon={<Icon as={q.icon} boxSize={5} />}
                          size="sm"
                          variant={activeIcon === q.name ? "solid" : "ghost"}
                          colorScheme={activeIcon === q.name ? "brand" : "whiteAlpha"}
                          onClick={() => {
                            setIcon(q.name);
                            if (q.color) setColor(q.color);
                          }}
                        />
                      ))}
                    </SimpleGrid>
                    <Text fontSize="10px" color="whiteAlpha.500" mb={3} textTransform="uppercase">Cores da Marca</Text>
                    <SimpleGrid columns={6} gap={2}>
                      {COLOR_OPTIONS.map(c => (
                        <Box 
                          key={c} 
                          bg={c} 
                          w="100%" 
                          h="24px" 
                          borderRadius="md" 
                          cursor="pointer" 
                          border={activeColor === c ? "2px solid white" : "none"}
                          onClick={() => setColor(c)}
                        />
                      ))}
                      <IconButton 
                        aria-label="Reset Color" 
                        icon={<Icon as={PaintBrush} />} 
                        size="xs" 
                        variant="ghost" 
                        onClick={() => setColor("")} 
                      />
                    </SimpleGrid>
                  </Box>
                  <Divider borderColor="whiteAlpha.100" />
                  <Box>
                    <Text fontSize="10px" color="whiteAlpha.500" mb={3} textTransform="uppercase">Buscar Biblioteca</Text>
                    <Input 
                      placeholder="Ex: camera, heart..." 
                      size="sm" 
                      bg="blackAlpha.400"
                      value={iconSearch}
                      onChange={(e) => setIconSearch(e.target.value)}
                      mb={3}
                    />
                    <SimpleGrid columns={6} gap={2} maxH="120px" overflowY="auto" px={1}>
                      {filteredIcons.map(iconKey => {
                        const IconComp = (PhosphorIcons as any)[iconKey];
                        return (
                          <IconButton
                            key={iconKey}
                            aria-label={iconKey}
                            icon={<Icon as={IconComp} />}
                            size="xs"
                            variant={activeIcon === iconKey ? "solid" : "ghost"}
                            colorScheme={activeIcon === iconKey ? "brand" : "whiteAlpha"}
                            onClick={() => setIcon(iconKey)}
                          />
                        );
                      })}
                    </SimpleGrid>
                  </Box>
                </VStack>
              </TabPanel>
              <TabPanel p={0}>
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel fontSize="xs" color="whiteAlpha.500">Código SVG</FormLabel>
                    <Textarea 
                      placeholder="Cole aqui o <svg>...</svg>" 
                      size="sm" 
                      fontSize="10px"
                      fontFamily="mono"
                      rows={6}
                      bg="blackAlpha.400"
                      value={activeSvg}
                      onChange={(e) => setSvg(e.target.value)}
                    />
                    <Text fontSize="10px" mt={2} color="whiteAlpha.400">
                      Dica: Garanta que o SVG tenha viewBox e use currentColor para preencher.
                    </Text>
                  </FormControl>
                  <Box>
                     <Text fontSize="10px" color="whiteAlpha.500" mb={3}>Preview</Text>
                     <Center p={4} bg="blackAlpha.300" borderRadius="md" h="80px">
                        {activeSvg ? (
                          <Icon as={getIconComponent("custom", activeSvg)} boxSize={10} color={activeColor || "brand.400"} />
                        ) : (
                          <Text fontSize="xs" color="whiteAlpha.300">Aguardando SVG...</Text>
                        )}
                     </Center>
                  </Box>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </PopoverBody>
      </PopoverContent>
    );
  };

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

        {/* Add New Form */}
        <Grid templateColumns={{ base: "1fr", md: "auto 2fr 1.5fr auto" }} gap={4} alignItems="end" bg="blackAlpha.200" p={4} borderRadius="lg">
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
                  <Icon as={CurrentIcon} boxSize={6} color={newColor || "brand.400"} />
                </Button>
              </PopoverTrigger>
              <IconPickerPopover />
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
              const SkillIcon = getIconComponent(skill.icon, skill.customSvg);
              const skillColor = skill.color || "brand.400";
              
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
                    <Popover placement="bottom-start" gutter={12}>
                      <PopoverTrigger>
                        <Box 
                          p={2} 
                          bg="blackAlpha.400" 
                          borderRadius="lg" 
                          color={skillColor}
                          cursor="pointer"
                          transition="all 0.3s"
                          _hover={{ transform: 'scale(1.1)', boxShadow: `0 0 10px ${skillColor}44` }}
                          _groupHover={{ borderColor: skillColor }}
                        >
                          <Icon as={SkillIcon} boxSize={5} />
                        </Box>
                      </PopoverTrigger>
                      <IconPickerPopover index={index} />
                    </Popover>

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
                         onChange={(v) => updateSkill(index, { level: v })}
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
                    opacity={0.5}
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
