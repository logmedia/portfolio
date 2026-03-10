'use client';

import { 
  Box, 
  Flex, 
  Grid, 
  GridItem,
  HStack, 
  Icon, 
  Input, 
  InputGroup, 
  InputLeftElement, 
  Tag, 
  TagCloseButton, 
  TagLabel, 
  Text, 
  VStack, 
  Tooltip,
  IconButton
} from "@chakra-ui/react";
import { useState, useMemo } from "react";
import { MagnifyingGlass, Plus, Trash } from "phosphor-react";
import type { Stack } from "@/types/content";
import { getIconComponent } from "@/lib/utils/icons";

type StackSelectorProps = {
  allStacks: Stack[];
  selectedStackIds: string[];
  onChange: (selectedIds: string[]) => void;
};

export function StackSelector({ allStacks, selectedStackIds, onChange }: StackSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  const filteredAvailable = useMemo(() => {
    return allStacks.filter(s => 
      !selectedStackIds.includes(s.id) && 
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allStacks, selectedStackIds, searchQuery]);

  const selectedStacks = useMemo(() => {
    return allStacks.filter(s => selectedStackIds.includes(s.id));
  }, [allStacks, selectedStackIds]);

  const handleToggle = (id: string) => {
    if (selectedStackIds.includes(id)) {
      onChange(selectedStackIds.filter(sid => sid !== id));
    } else {
      onChange([...selectedStackIds, id]);
    }
  };

  const handleRemove = (id: string) => {
    onChange(selectedStackIds.filter(sid => sid !== id));
  };

  const onDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("stackId", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const id = e.dataTransfer.getData("stackId");
    if (id && !selectedStackIds.includes(id)) {
      onChange([...selectedStackIds, id]);
    }
  };

  return (
    <VStack spacing={4} align="stretch" w="100%">
      {/* Hidden inputs for form submission */}
      {selectedStackIds.map(id => (
        <input key={id} type="hidden" name="stacks[]" value={id} />
      ))}

      {/* Selected Area (Drop Target) */}
      <Box
        p={4}
        minH="80px"
        bg={isDragOver ? "brand.900" : "blackAlpha.400"}
        borderRadius="lg"
        border="2px dashed"
        borderColor={isDragOver ? "brand.500" : "whiteAlpha.200"}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={onDrop}
        transition="all 0.2s"
        position="relative"
      >
        <Text fontSize="xs" color="whiteAlpha.500" mb={2} fontWeight="bold" textTransform="uppercase">
          Stacks do Projeto ({selectedStacks.length})
        </Text>
        
        <Flex flexWrap="wrap" gap={2}>
          {selectedStacks.map(stack => (
            <Tag 
              key={stack.id} 
              size="md" 
              variant="subtle" 
              colorScheme="brand"
              bg="brand.500"
              color="white"
              boxShadow="0 4px 10px rgba(0,0,0,0.3)"
              borderRadius="full"
              py={1}
            >
              <HStack spacing={1}>
                <Icon as={getIconComponent(stack.icon || "")} fontSize="xs" />
                <TagLabel fontWeight="bold">{stack.name}</TagLabel>
              </HStack>
              <TagCloseButton onClick={() => handleRemove(stack.id)} />
            </Tag>
          ))}
          {selectedStacks.length === 0 && !isDragOver && (
            <Text fontSize="sm" color="whiteAlpha.400" mt={2}>
              Arraste stacks aqui ou clique abaixo para adicionar
            </Text>
          )}
          {isDragOver && (
            <Text fontSize="sm" color="brand.200" mt={2} fontWeight="bold">
              Solte para adicionar ao projeto
            </Text>
          )}
        </Flex>
      </Box>

      {/* Available Stacks with Search */}
      <Box>
        <InputGroup size="sm" mb={3}>
          <InputLeftElement pointerEvents="none">
            <MagnifyingGlass color="gray.500" />
          </InputLeftElement>
          <Input 
            placeholder="Pesquisar stacks disponíveis..." 
            bg="blackAlpha.300" 
            borderColor="whiteAlpha.100"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>

        <Grid templateColumns="repeat(auto-fill, minmax(130px, 1fr))" gap={2} maxH="200px" overflowY="auto" pr={2} sx={{
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-track': { bg: 'transparent' },
          '&::-webkit-scrollbar-thumb': { bg: 'whiteAlpha.200', borderRadius: 'full' },
        }}>
          {filteredAvailable.map(stack => (
            <Box
              key={stack.id}
              p={2}
              bg="whiteAlpha.100"
              borderRadius="md"
              cursor="grab"
              draggable
              onDragStart={(e) => onDragStart(e, stack.id)}
              onClick={() => handleToggle(stack.id)}
              transition="all 0.2s"
              _hover={{ bg: "brand.500", color: "white" }}
              border="1px solid"
              borderColor="whiteAlpha.100"
            >
              <HStack spacing={2}>
                <Icon as={getIconComponent(stack.icon || "")} fontSize="14px" />
                <Text fontSize="xs" fontWeight="medium" isTruncated>{stack.name}</Text>
                <Icon as={Plus} fontSize="10px" ml="auto" color="whiteAlpha.400" />
              </HStack>
            </Box>
          ))}
          {filteredAvailable.length === 0 && (
            <GridItem colSpan={3}>
              <Text fontSize="xs" color="whiteAlpha.500" textAlign="center" py={4}>
                {searchQuery ? "Nenhuma correspondência encontrada." : "Todas as stacks já foram adicionadas."}
              </Text>
            </GridItem>
          )}
        </Grid>
      </Box>
    </VStack>
  );
}
