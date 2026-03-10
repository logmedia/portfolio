'use client';

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  HStack,
  Input,
  Stack as ChakraStack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Icon,
  IconButton,
  useToast,
  Text
} from "@chakra-ui/react";
import { Trash, PencilSimple, Plus, MagnifyingGlass } from "phosphor-react";
import { useState, useTransition, useMemo } from "react";
import { saveStack, deleteStack } from "@/app/actions";
import type { Stack } from "@/types/content";
import { PREDEFINED_STACKS, type PredefinedStack } from "@/lib/constants/stacks";

type StacksManagementProps = {
  stacks: Stack[];
};

export function StacksManagement({ stacks }: StacksManagementProps) {
  const toast = useToast();
  const [editingStack, setEditingStack] = useState<Stack | null>(null);
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({ name: "", icon: "", color: "" });

  const filteredLibrary = useMemo(() => {
    return PREDEFINED_STACKS.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSubmit = async (form: FormData) => {
    startTransition(async () => {
      // Overwrite name, icon, color from React state if provided
      // This is because the form action uses FormData which might have old values
      const data = new FormData();
      if (editingStack?.id) data.append("id", editingStack.id);
      data.append("name", formData.name);
      data.append("icon", formData.icon);
      data.append("color", formData.color);

      const result = await saveStack(data);
      if (result.success) {
        toast({ title: "Stack salva com sucesso!", status: "success" });
        handleCancelEdit();
      } else {
        toast({ title: result.message || "Erro ao salvar", status: "error" });
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta stack?")) return;
    
    startTransition(async () => {
      const result = await deleteStack(id);
      if (result.success) {
        toast({ title: "Stack excluída", status: "success" });
      } else {
        toast({ title: result.message || "Erro ao excluir", status: "error" });
      }
    });
  };

  const handleSelectPredefined = (s: PredefinedStack) => {
    setFormData({ name: s.name, icon: s.icon, color: s.color });
    setEditingStack(null);
  };

  const handleEdit = (stack: Stack) => {
    setEditingStack(stack);
    setFormData({ name: stack.name, icon: stack.icon || "", color: stack.color || "" });
  };

  const handleCancelEdit = () => {
    setEditingStack(null);
    setFormData({ name: "", icon: "", color: "" });
  };

  return (
    <Grid templateColumns={{ base: "1fr", lg: "350px 1fr" }} gap={8}>
      <ChakraStack spacing={6}>
        {/* Biblioteca de Sugestões */}
        <Box bg="whiteAlpha.50" p={5} borderRadius="xl" border="1px solid" borderColor="whiteAlpha.100">
          <Text fontWeight="bold" mb={4} fontSize="sm" color="brand.400" textTransform="uppercase" letterSpacing="wider">
            Biblioteca de Stacks
          </Text>
          <FormControl mb={4}>
            <HStack bg="blackAlpha.300" px={3} borderRadius="md" border="1px solid" borderColor="whiteAlpha.100">
              <Icon as={MagnifyingGlass} color="whiteAlpha.400" />
              <Input 
                placeholder="Filtrar biblioteca..." 
                variant="unstyled" 
                size="sm" 
                h="36px"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </HStack>
          </FormControl>
          <Grid templateColumns="repeat(auto-fill, minmax(130px, 1fr))" gap={2} maxH="400px" overflowY="auto" pr={2} sx={{
            '&::-webkit-scrollbar': { width: '4px' },
            '&::-webkit-scrollbar-track': { bg: 'transparent' },
            '&::-webkit-scrollbar-thumb': { bg: 'whiteAlpha.200', borderRadius: 'full' },
          }}>
            {filteredLibrary.map((s) => (
              <Box 
                key={s.name} 
                p={2} 
                bg="whiteAlpha.50" 
                borderRadius="md" 
                cursor="pointer" 
                _hover={{ bg: "brand.500", color: "white" }} 
                transition="all 0.2s"
                onClick={() => handleSelectPredefined(s)}
              >
                <HStack spacing={2}>
                  <Box w={2} h={2} borderRadius="full" bg={s.color} />
                  <Text fontSize="xs" fontWeight="medium" isTruncated>{s.name}</Text>
                </HStack>
                <Text fontSize="10px" color="whiteAlpha.500" mt={1}>{s.category}</Text>
              </Box>
            ))}
          </Grid>
        </Box>

        {/* Formulário de Edição/Criação */}
        <Box as="form" action={handleSubmit} bg="whiteAlpha.50" p={6} borderRadius="xl" border="1px solid" borderColor="whiteAlpha.100">
          <ChakraStack spacing={4}>
            <Text fontWeight="bold" mb={2}>
              {editingStack ? "Editar Projeto Stack" : "Configurar Stacks"}
            </Text>
            <input type="hidden" name="id" value={editingStack?.id || ""} />
            <FormControl isRequired>
              <FormLabel fontSize="sm">Nome</FormLabel>
              <Input 
                name="name" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Ex: React" 
                size="sm" 
                bg="blackAlpha.300"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Ícone Key</FormLabel>
              <Input 
                name="icon" 
                value={formData.icon} 
                onChange={(e) => setFormData({...formData, icon: e.target.value})}
                placeholder="Ex: FaReact ou BracketsCurly" 
                size="sm" 
                bg="blackAlpha.300"
              />
              <Text fontSize="10px" color="whiteAlpha.400" mt={1}>Prefixo Fa (FontAwesome) ou Si (SimpleIcons)</Text>
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Cor (Hex)</FormLabel>
              <Input 
                name="color" 
                value={formData.color} 
                onChange={(e) => setFormData({...formData, color: e.target.value})}
                placeholder="Ex: #61DAFB" 
                size="sm" 
                bg="blackAlpha.300"
              />
            </FormControl>
            <HStack pt={2}>
              <Button type="submit" size="sm" colorScheme="brand" isLoading={isPending} flex={1}>
                {editingStack ? "Salvar Alterações" : "Adicionar à Minha Lista"}
              </Button>
              {(editingStack || formData.name) && (
                <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                  {editingStack ? "Cancelar" : "Limpar"}
                </Button>
              )}
            </HStack>
          </ChakraStack>
        </Box>
      </ChakraStack>

      <Box bg="whiteAlpha.50" p={6} borderRadius="xl" border="1px solid" borderColor="whiteAlpha.100" overflowX="auto" h="fit-content">
        <HStack mb={4} justify="space-between">
          <Text fontWeight="bold">Minhas Stacks Cadastradas</Text>
          <Text fontSize="xs" color="whiteAlpha.500">{stacks.length} tecnologias</Text>
        </HStack>
        <Table size="sm" variant="simple">
          <Thead>
            <Tr>
              <Th color="whiteAlpha.600" borderBottomColor="whiteAlpha.200">Nome</Th>
              <Th color="whiteAlpha.600" borderBottomColor="whiteAlpha.200">Ícone</Th>
              <Th color="whiteAlpha.600" borderBottomColor="whiteAlpha.200">Cor</Th>
              <Th color="whiteAlpha.600" borderBottomColor="whiteAlpha.200" textAlign="right">Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {stacks.map((stack) => (
              <Tr key={stack.id} _hover={{ bg: "whiteAlpha.50" }}>
                <Td fontWeight="medium" py={4}>{stack.name}</Td>
                <Td color="whiteAlpha.700">{stack.icon || "-"}</Td>
                <Td>
                   <HStack>
                     <Box w={3} h={3} borderRadius="full" bg={stack.color || "gray.500"} boxShadow={`0 0 10px ${stack.color || "transparent"}`} />
                     <Text fontSize="xs" color="whiteAlpha.700">{stack.color || "-"}</Text>
                   </HStack>
                </Td>
                <Td textAlign="right">
                  <HStack justify="flex-end" spacing={1}>
                    <IconButton
                      aria-label="Editar"
                      icon={<Icon as={PencilSimple} />}
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(stack)}
                    />
                    <IconButton
                      aria-label="Excluir"
                      icon={<Icon as={Trash} />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => handleDelete(stack.id)}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
            {stacks.length === 0 && (
              <Tr>
                <Td colSpan={4} textAlign="center" py={10} color="whiteAlpha.500">
                  Nenhuma stack cadastrada. Selecione uma na biblioteca acima ⬅️
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
    </Grid>
  );
}
