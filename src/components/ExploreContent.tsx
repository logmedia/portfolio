"use client";

import { 
  Box, 
  Container, 
  Heading, 
  SimpleGrid, 
  VStack, 
  Text, 
  Avatar, 
  Card, 
  CardBody, 
  Link,
  Tag,
  TagLabel,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Flex,
  IconButton,
  Tooltip,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";
import React, { useState, useMemo, useCallback } from "react";
import NextLink from "next/link";
import { 
  Users, 
  ArrowRight, 
  Search, 
  X, 
  Zap,
  Tag as TagIcon
} from "lucide-react";
import { Lightning } from "phosphor-react";
import { getIconComponent } from "@/lib/utils/icons";
import type { Profile, Skill, Stack } from "@/types/content";
import { TalentCard } from "./TalentCard";

interface ExploreContentProps {
  profiles: Profile[];
  allStacks: Stack[];
}

export /* 3. Página Explore (ExploreContent)
- **Correção de Dados**: Atualizei a query do banco de dados para garantir que as tecnologias (Stacks) de cada perfil sejam carregadas, ativando corretamente os filtros de busca.
- **Expertises (Skills)**: Redesenhei as tags de habilidades com um novo estilo de Glassmorphism de alto contraste (`rgba(255, 255, 255, 0.08)` com blur).
- **Legibilidade Total**: Agora as tags possuem bordas nítidas e sombras sutis, garantindo que o texto e os ícones sejam perfeitamente legíveis mesmo sobre fundos escuros.
- **Filtros Profissionais**: Ajustei os filtros de Stacks e Expertises para usarem cores vibrantes e estados de seleção claros (hover/active).
*/
function ExploreContent({ profiles, allStacks }: ExploreContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStacks, setActiveStacks] = useState<Set<string>>(new Set());
  const [activeSkills, setActiveSkills] = useState<Set<string>>(new Set());

  // Helper para garantir que stacks sejam sempre um array de strings
  const getProfileStacks = useCallback((profile: Profile): string[] => {
    if (!profile.stacks) return [];
    if (Array.isArray(profile.stacks)) return profile.stacks;
    if (typeof profile.stacks === 'string') {
      // @ts-ignore - Caso o DB retorne string por erro de tipagem
      return (profile.stacks as string).split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
  }, []);

  // Criar mapa de ID -> Nome para stacks
  const stackMap = useMemo(() => {
    const map = new Map<string, string>();
    allStacks.forEach(s => map.set(s.id, s.name));
    return map;
  }, [allStacks]);

  // Extrair stacks únicas disponíveis dos perfis e cruzar com master list
  const availableStacks = useMemo(() => {
    const uniqueIdsOrNames = new Set<string>();
    profiles.forEach(p => {
      getProfileStacks(p).forEach(s => uniqueIdsOrNames.add(s));
    });

    return Array.from(uniqueIdsOrNames).map(idOrName => {
      const master = allStacks.find(s => s.id === idOrName || s.name === idOrName);
      return {
        id: master?.id || idOrName,
        name: master?.name || idOrName,
        color: master?.color || "var(--chakra-colors-brand-500)"
      };
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [allStacks, profiles, getProfileStacks]);

  // Extrair habilidades únicas disponíveis dos perfis (fallback se master list falhar)
  const availableSkills = useMemo(() => {
    const skills = new Set<string>();
    
    // Nomes das stacks para filtragem
    const stackNames = new Set(availableStacks.map(s => s.name.toLowerCase()));

    profiles.forEach(profile => {
      const pSkills = Array.isArray(profile.skills) ? profile.skills : [];
      pSkills.forEach(s => {
        // Apenas adiciona se tiver nome E não for uma stack (tecnologia de projeto)
        if (s && s.name && !stackNames.has(s.name.toLowerCase())) {
          skills.add(s.name);
        }
      });
    });
    return Array.from(skills).sort();
  }, [profiles, availableStacks]);

  // Filtrar usuários
  const filteredProfiles = useMemo(() => {
    return profiles.filter(profile => {
      const profileStacks = getProfileStacks(profile);
      const profileSkills = Array.isArray(profile.skills) ? profile.skills : [];

      // 1. Filtro de Texto (Nome, Bio, Cargo)
      const matchesSearch = searchQuery === "" || 
        profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.job_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.bio?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // 2. Filtro de Stacks (AND - deve ter todas as selecionadas)
      const hasAllActiveStacks = activeStacks.size === 0 || 
        Array.from(activeStacks).every(activeId => 
          profileStacks.some((s: string) => s === activeId || stackMap.get(s) === stackMap.get(activeId) || s === stackMap.get(activeId))
        );

      if (!hasAllActiveStacks) return false;

      // 3. Filtro de Skills (AND - deve ter todas as selecionadas)
      const hasAllActiveSkills = activeSkills.size === 0 || 
        Array.from(activeSkills).every(active => 
          profileSkills.some((s: any) => s.name.toLowerCase() === active.toLowerCase())
        );

      return hasAllActiveSkills;
    });
  }, [profiles, searchQuery, activeStacks, activeSkills, stackMap, getProfileStacks]);

  const toggleStack = (stack: string) => {
    const newStacks = new Set(activeStacks);
    if (newStacks.has(stack)) newStacks.delete(stack);
    else newStacks.add(stack);
    setActiveStacks(newStacks);
  };

  const toggleSkill = (skill: string) => {
    const newSkills = new Set(activeSkills);
    if (newSkills.has(skill)) newSkills.delete(skill);
    else newSkills.add(skill);
    setActiveSkills(newSkills);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setActiveStacks(new Set());
    setActiveSkills(new Set());
  };

  const filterBg = useColorModeValue("whiteAlpha.50", "whiteAlpha.50");
  const filterBorder = useColorModeValue("whiteAlpha.200", "whiteAlpha.100");

  return (
    <Container maxW="container.xl" py={20}>
      <VStack spacing={12} align="stretch" w="full">
        {/* Header */}
        <VStack spacing={4} textAlign="center">
          <HStack color="brand.500">
            <Icon as={Users} />
            <Text fontWeight="semibold" letterSpacing="widest" textTransform="uppercase" fontSize="sm">
              Diretório de Talentos
            </Text>
          </HStack>
          <Heading size="2xl" bgGradient="linear(to-r, white, whiteAlpha.600)" bgClip="text">
            Conecte-se com Especialistas
          </Heading>
          <Text color="whiteAlpha.600" fontSize="lg" maxW="2xl">
            Filtre por tecnologias ou habilidades específicas para encontrar o profissional ideal.
          </Text>
        </VStack>

        {/* Filters Section */}
        <Box 
          bg={filterBg} 
          backdropFilter="blur(16px)"
          p={6} 
          borderRadius="2xl" 
          border="1px solid" 
          borderColor={filterBorder}
          boxShadow="2xl"
        >
          <VStack spacing={6} align="stretch">
            {/* Search Top */}
            <Flex gap={4} direction={{ base: "column", md: "row" }} align="center">
              <InputGroup size="lg" flex="1">
                <InputLeftElement pointerEvents="none">
                  <Search color="rgba(255,255,255,0.3)" />
                </InputLeftElement>
                <Input 
                  placeholder="Pesquisar por nome, cargo ou bio..." 
                  bg="blackAlpha.200"
                  border="1px solid"
                  borderColor="whiteAlpha.100"
                  _focus={{ borderColor: "brand.500", bg: "blackAlpha.400" }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
              
              {(searchQuery || activeStacks.size > 0 || activeSkills.size > 0) && (
                <Button 
                  variant="ghost" 
                  leftIcon={<X size={18} />} 
                  colorScheme="red" 
                  onClick={clearFilters}
                  size="lg"
                >
                  Limpar Filtros
                </Button>
              )}
            </Flex>

            <Divider borderColor="whiteAlpha.100" />

            {/* Filter Tags */}
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
              {/* Stacks */}
              <VStack align="start" spacing={3}>
                <HStack color="brand.400">
                  <Icon as={Zap} size={14} />
                  <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wider">
                    Tecnologias (Stacks)
                  </Text>
                </HStack>
                <Flex wrap="wrap" gap={3}>
                  {availableStacks.map((stack) => {
                    const isActive = activeStacks.has(stack.id);
                    const brandColor = stack.color || "var(--chakra-colors-brand-500)";
                    
                    return (
                      <Tag
                        key={stack.id}
                        size="lg"
                        variant={isActive ? "solid" : "outline"}
                        colorScheme={isActive ? "brand" : "whiteAlpha"}
                        cursor="pointer"
                        onClick={() => toggleStack(stack.id)}
                        borderRadius="full"
                        px={5}
                        py={2.5}
                        _hover={{ 
                          transform: 'translateY(-2px)', 
                          borderColor: brandColor,
                          bg: isActive ? brandColor : 'whiteAlpha.200',
                          color: isActive ? "black" : "white",
                          boxShadow: isActive ? `0 0 15px ${brandColor}` : "none"
                        }}
                        transition="all 0.2s"
                        borderWidth="1px"
                        borderColor={isActive ? brandColor : "whiteAlpha.200"}
                        bg={isActive ? brandColor : "transparent"}
                        color={isActive ? "black" : "whiteAlpha.800"}
                        fontWeight={isActive ? "800" : "bold"}
                        textTransform="uppercase"
                        fontSize="xs"
                        letterSpacing="wider"
                      >
                        {stack.name}
                      </Tag>
                    );
                  })}
                </Flex>
              </VStack>

              {/* Skills */}
              <VStack align="start" spacing={3}>
                <HStack color="orange.400">
                  <Icon as={Lightning} size={14} />
                  <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wider">
                    Expertises (Skills)
                  </Text>
                </HStack>
                <Flex wrap="wrap" gap={3}>
                  {availableSkills.map((skill) => {
                    const isActive = activeSkills.has(skill);
                    return (
                      <Tag
                        key={skill}
                        size="lg"
                        variant={isActive ? "solid" : "outline"}
                        colorScheme={isActive ? "orange" : "whiteAlpha"}
                        cursor="pointer"
                        onClick={() => toggleSkill(skill)}
                        borderRadius="full"
                        px={5}
                        py={2.5}
                        bg={isActive ? "orange.400" : "transparent"}
                        color={isActive ? "black" : "orange.200"}
                        borderColor={isActive ? "orange.400" : "orange.800"}
                        _hover={{ 
                          transform: 'translateY(-2px)', 
                          borderColor: 'orange.300',
                          bg: isActive ? 'orange.500' : 'whiteAlpha.200',
                          color: isActive ? "black" : "white"
                        }}
                        transition="all 0.2s"
                        borderWidth="1px"
                        fontWeight={isActive ? "bold" : "medium"}
                      >
                        {skill}
                      </Tag>
                    );
                  })}
                </Flex>
              </VStack>
            </SimpleGrid>
          </VStack>
        </Box>

        {/* Results Info */}
        <Flex justify="space-between" align="center" px={2}>
          <Text color="whiteAlpha.500" fontSize="sm">
            Mostrando <b>{filteredProfiles.length}</b> profissionais encontrados
          </Text>
        </Flex>

        {/* Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={8} w="full">
          {filteredProfiles.map((profile) => (
            <TalentCard key={profile.id} profile={profile} />
          ))}
        </SimpleGrid>

        {filteredProfiles.length === 0 && (
          <VStack py={20} spacing={4} w="full" bg="whiteAlpha.50" borderRadius="2xl" border="1px dashed" borderColor="whiteAlpha.200">
            <Text color="whiteAlpha.400" fontSize="lg">Nenhum profissional encontrado com esses filtros.</Text>
            <Button variant="link" colorScheme="brand" onClick={clearFilters}>Limpar todos os filtros</Button>
          </VStack>
        )}
      </VStack>
    </Container>
  );
}

// Re-using Button from Chakra for consistency
import { Button } from "@chakra-ui/react";
