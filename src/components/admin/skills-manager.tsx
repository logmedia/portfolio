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
  Select,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  VStack,
  useColorModeValue,
  Divider,
  Grid,
} from "@chakra-ui/react";
import { Code, Palette, Database, Lightning, BracketsCurly, Cpu, Plus, Trash } from "phosphor-react";
import { useState, useMemo } from "react";

export type SkillItem = {
  name: string;
  level: number;
  icon: string;
};

interface SkillsManagerProps {
  initialSkills: SkillItem[];
}

const ICON_OPTIONS = [
  { value: "Code", label: "Código", icon: Code },
  { value: "Palette", label: "Design", icon: Palette },
  { value: "Database", label: "Banco de Dados", icon: Database },
  { value: "Lightning", label: "Performance", icon: Lightning },
  { value: "BracketsCurly", label: "Framework", icon: BracketsCurly },
  { value: "Cpu", label: "Sistema", icon: Cpu },
];

const SUGGESTIONS = ["React", "Next.js", "TypeScript", "Node.js", "UI/UX", "Figma", "Supabase", "Tailwind CSS"];

export function SkillsManager({ initialSkills = [] }: SkillsManagerProps) {
  const [skills, setSkills] = useState<SkillItem[]>(initialSkills || []);
  const [newName, setNewName] = useState("");
  const [newLevel, setNewLevel] = useState(50);
  const [newIcon, setNewIcon] = useState("Code");

  const bg = useColorModeValue("blackAlpha.50", "whiteAlpha.50");
  const borderColor = useColorModeValue("blackAlpha.200", "whiteAlpha.200");

  const addSkill = () => {
    if (!newName.trim()) return;
    setSkills([...skills, { name: newName.trim(), level: newLevel, icon: newIcon }]);
    setNewName("");
    setNewLevel(50);
    setNewIcon("Code");
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const updateSkillLevel = (index: number, newLevel: number) => {
    const updated = [...skills];
    updated[index].level = newLevel;
    setSkills(updated);
  };

  // Convert skills back to the legacy string format for the backend action
  const serializedSkills = useMemo(() => {
    return skills.map((s) => `${s.name}|${s.level}|${s.icon}`).join("\n");
  }, [skills]);

  return (
    <Box p={4} bg={bg} borderRadius="md" border="1px solid" borderColor={borderColor}>
      {/* Hidden textarea for native form submission */}
      <textarea name="skills" value={serializedSkills} readOnly style={{ display: "none" }} />

      <VStack spacing={6} align="stretch">
        <Heading size="sm" display="flex" alignItems="center" gap={2}>
          <Icon as={Lightning} color="brand.500" />
          Gerenciador de Habilidades
        </Heading>

        {/* Suggestions */}
        <Box>
          <Text fontSize="xs" fontWeight="bold" color="whiteAlpha.600" mb={2} textTransform="uppercase">
            Sugestões Rápidas:
          </Text>
          <Flex wrap="wrap" gap={2}>
            {SUGGESTIONS.filter((sug) => !skills.some((s) => s.name.toLowerCase() === sug.toLowerCase())).map((suggestion) => (
              <Tag
                key={suggestion}
                size="sm"
                variant="subtle"
                colorScheme="brand"
                cursor="pointer"
                onClick={() => {
                  setNewName(suggestion);
                  // Auto-select icon based on context
                  if (suggestion.includes("UI") || suggestion.includes("Figma") || suggestion.includes("Design")) setNewIcon("Palette");
                  else if (suggestion.includes("Base") || suggestion.includes("SQL")) setNewIcon("Database");
                  else setNewIcon("Code");
                }}
                _hover={{ bg: "brand.500", color: "white" }}
              >
                <TagLabel>{suggestion}</TagLabel>
                <Icon as={Plus} ml={1} />
              </Tag>
            ))}
          </Flex>
        </Box>

        <Divider />

        {/* Add New Form */}
        <Grid templateColumns={{ base: "1fr", md: "2fr 1fr 2fr auto" }} gap={4} alignItems="end">
          <FormControl>
            <FormLabel fontSize="xs" color="whiteAlpha.700">Nome da Habilidade</FormLabel>
            <Input
              size="sm"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Ex: Next.js"
              bg="blackAlpha.300"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="xs" color="whiteAlpha.700">Ícone</FormLabel>
            <Select size="sm" value={newIcon} onChange={(e) => setNewIcon(e.target.value)} bg="blackAlpha.300">
              {ICON_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} style={{ background: "#2D3748" }}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
             <FormLabel fontSize="xs" color="whiteAlpha.700">
               Proficiência: {newLevel}%
             </FormLabel>
             <Slider
               aria-label="slider-proficiencia"
               defaultValue={50}
               min={0}
               max={100}
               step={5}
               value={newLevel}
               onChange={(v) => setNewLevel(v)}
               colorScheme="brand"
               mt={2}
               mb={1} // alinhar com o input
             >
               <SliderTrack bg="whiteAlpha.200">
                 <SliderFilledTrack />
               </SliderTrack>
               <SliderThumb boxSize={4} />
             </Slider>
          </FormControl>

          <Button size="sm" colorScheme="brand" onClick={addSkill} isDisabled={!newName.trim()}>
            Adicionar
          </Button>
        </Grid>

        {/* Active Skills List */}
        {skills.length > 0 && (
          <VStack spacing={4} align="stretch" mt={4}>
            {skills.map((skill, index) => {
              const SelectedIcon = ICON_OPTIONS.find((opt) => opt.value === skill.icon)?.icon || Code;
              return (
                <Flex
                  key={index}
                  p={3}
                  bg="whiteAlpha.50"
                  borderRadius="md"
                  align="center"
                  justify="space-between"
                  border="1px solid"
                  borderColor="whiteAlpha.100"
                  transition="all 0.2s"
                  _hover={{ borderColor: "whiteAlpha.300" }}
                >
                  <HStack spacing={4} flex="1">
                    <Icon as={SelectedIcon} color="brand.400" boxSize={5} />
                    <Box minW="100px">
                      <Text fontWeight="medium" fontSize="sm">{skill.name}</Text>
                    </Box>
                    <Box flex="1" px={4}>
                       <Slider
                         aria-label={`slider-${skill.name}`}
                         min={0}
                         max={100}
                         step={5}
                         value={skill.level}
                         onChange={(v) => updateSkillLevel(index, v)}
                         colorScheme="brand"
                       >
                         <SliderTrack bg="whiteAlpha.200">
                           <SliderFilledTrack />
                         </SliderTrack>
                         <SliderThumb />
                       </Slider>
                    </Box>
                    <Text fontSize="sm" fontWeight="bold" color="whiteAlpha.700" minW="40px" textAlign="right">
                      {skill.level}%
                    </Text>
                  </HStack>
                  <Button
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => removeSkill(index)}
                    ml={4}
                  >
                    <Icon as={Trash} />
                  </Button>
                </Flex>
              );
            })}
          </VStack>
        )}
        
        {skills.length === 0 && (
          <Text fontSize="sm" color="whiteAlpha.400" textAlign="center" py={4}>
            Nenhuma habilidade adicionada ainda. Use as sugestões ou crie uma nova.
          </Text>
        )}
      </VStack>
    </Box>
  );
}
