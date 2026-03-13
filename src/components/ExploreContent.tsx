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
import { useState, useMemo } from "react";
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
import type { Profile, Skill } from "@/types/content";

interface ExploreContentProps {
  profiles: Profile[];
}

export function ExploreContent({ profiles }: ExploreContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStacks, setActiveStacks] = useState<Set<string>>(new Set());
  const [activeSkills, setActiveSkills] = useState<Set<string>>(new Set());

  // Extair todas as stacks e habilidades únicas disponíveis
  const { availableStacks, availableSkills } = useMemo(() => {
    const stacks = new Set<string>();
    const skills = new Set<string>();

    profiles.forEach(profile => {
      profile.stacks?.forEach(s => stacks.add(s));
      profile.skills?.forEach(s => {
        if (s && s.name) skills.add(s.name);
      });
    });

    return {
      availableStacks: Array.from(stacks).sort(),
      availableSkills: Array.from(skills).sort()
    };
  }, [profiles]);

  // Filtrar usuários
  const filteredProfiles = useMemo(() => {
    return profiles.filter(profile => {
      // 1. Filtro de Texto (Nome, Bio, Cargo)
      const matchesSearch = searchQuery === "" || 
        profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.job_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.bio?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // 2. Filtro de Stacks (AND - deve ter todas as selecionadas)
      const hasAllActiveStacks = activeStacks.size === 0 || 
        Array.from(activeStacks).every(active => 
          profile.stacks?.some(s => s.toLowerCase() === active.toLowerCase())
        );

      if (!hasAllActiveStacks) return false;

      // 3. Filtro de Skills (AND - deve ter todas as selecionadas)
      const hasAllActiveSkills = activeSkills.size === 0 || 
        Array.from(activeSkills).every(active => 
          profile.skills?.some(s => s.name.toLowerCase() === active.toLowerCase())
        );

      return hasAllActiveSkills;
    });
  }, [profiles, searchQuery, activeStacks, activeSkills]);

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

  const filterBg = useColorModeValue("whiteAlpha.500", "whiteAlpha.500");
  const filterBorder = useColorModeValue("whiteAlpha.300", "whiteAlpha.200");

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
                    const isActive = activeStacks.has(stack);
                    return (
                      <Tag
                        key={stack}
                        size="lg"
                        variant={isActive ? "solid" : "outline"}
                        colorScheme={isActive ? "brand" : "whiteAlpha"}
                        cursor="pointer"
                        onClick={() => toggleStack(stack)}
                        borderRadius="full"
                        px={5}
                        py={2}
                        _hover={{ 
                          transform: 'translateY(-2px)', 
                          borderColor: 'brand.500',
                          bg: isActive ? 'brand.600' : 'whiteAlpha.200'
                        }}
                        transition="all 0.2s"
                        borderWidth="1px"
                        fontWeight={isActive ? "bold" : "medium"}
                      >
                        {stack}
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
                        py={2}
                        _hover={{ 
                          transform: 'translateY(-2px)', 
                          borderColor: 'orange.500',
                          bg: isActive ? 'orange.600' : 'whiteAlpha.200'
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
            <NextLink
              key={profile.id}
              href={`/${profile.github_username || profile.id}`}
              passHref
              legacyBehavior
            >
              <Link _hover={{ textDecoration: 'none' }} h="full">
                <Card 
                  h="full"
                  bg="whiteAlpha.50" 
                  borderColor="whiteAlpha.100" 
                  borderWidth="1px"
                  _hover={{ 
                    transform: 'translateY(-8px)', 
                    borderColor: 'brand.500', 
                    bg: 'whiteAlpha.100',
                    boxShadow: "0 10px 30px -10px rgba(0, 229, 255, 0.2)"
                  }}
                  transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                  borderRadius="2xl"
                  overflow="hidden"
                >
                  <CardBody p={8}>
                    <VStack spacing={6} h="full">
                      <Box position="relative">
                        <Avatar 
                          size="2xl" 
                          name={profile.name} 
                          src={profile.avatar_url}
                          border="3px solid"
                          borderColor="brand.500"
                          p={1}
                          bg="blackAlpha.500"
                        />
                      </Box>
                      
                      <VStack spacing={2}>
                        <Heading size="md" color="white" textAlign="center">{profile.name}</Heading>
                        <Text color="brand.400" fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="2px">
                          {profile.job_title || 'Profissional'}
                        </Text>
                      </VStack>

                      <Text color="whiteAlpha.500" fontSize="sm" noOfLines={3} textAlign="center" lineHeight="shorter">
                        {profile.bio || "Este profissional ainda não preencheu sua biografia."}
                      </Text>
                      
                      <Box flex="1" w="full">
                        {profile.skills && Array.isArray(profile.skills) && profile.skills.length > 0 && (
                          <HStack spacing={2} wrap="wrap" justify="center">
                            {profile.skills.slice(0, 3).map((skill: any) => (
                              <Tag 
                                key={skill.name} 
                                size="sm" 
                                variant="subtle" 
                                bg={`${skill.color || '#3182ce'}22`}
                                color={skill.color || '#3182ce'}
                                border="1px solid"
                                borderColor={`${skill.color || '#3182ce'}44`}
                              >
                                {skill.name}
                              </Tag>
                            ))}
                            {profile.skills.length > 3 && (
                              <Text fontSize="xs" color="whiteAlpha.400">+{profile.skills.length - 3}</Text>
                            )}
                          </HStack>
                        )}
                      </Box>

                      <HStack color="brand.500" fontWeight="bold" fontSize="sm" pt={4} spacing={2} _groupHover={{ transform: 'translateX(4px)' }} transition="all 0.2s">
                        <Text>Ver Portfólio Completo</Text>
                        <ArrowRight size={16} />
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              </Link>
            </NextLink>
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
