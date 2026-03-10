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
import { Trash, PencilSimple, Plus } from "phosphor-react";
import { useState, useTransition } from "react";
import { saveStack, deleteStack } from "@/app/actions";
import type { Stack } from "@/types/content";

type StacksManagementProps = {
  stacks: Stack[];
};

export function StacksManagement({ stacks }: StacksManagementProps) {
  const toast = useToast();
  const [editingStack, setEditingStack] = useState<Stack | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await saveStack(formData);
      if (result.success) {
        toast({ title: "Stack salva com sucesso!", status: "success" });
        setEditingStack(null);
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

  return (
    <Grid templateColumns={{ base: "1fr", md: "1fr 2fr" }} gap={8}>
      <Box>
        <Box as="form" action={handleSubmit} bg="whiteAlpha.50" p={6} borderRadius="xl" border="1px solid" borderColor="whiteAlpha.100">
          <ChakraStack spacing={4}>
            <Text fontWeight="bold" mb={2}>
              {editingStack ? "Editar Stack" : "Nova Stack"}
            </Text>
            <input type="hidden" name="id" value={editingStack?.id || ""} />
            <FormControl isRequired>
              <FormLabel fontSize="sm">Nome</FormLabel>
              <Input name="name" defaultValue={editingStack?.name || ""} placeholder="Ex: React" size="sm" />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Ícone (Phosphor/SimpleIcons)</FormLabel>
              <Input name="icon" defaultValue={editingStack?.icon || ""} placeholder="Ex: FaReact ou BracketsCurly" size="sm" />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Cor (Hex)</FormLabel>
              <Input name="color" defaultValue={editingStack?.color || ""} placeholder="Ex: #61DAFB" size="sm" />
            </FormControl>
            <HStack pt={2}>
              <Button type="submit" size="sm" colorScheme="brand" isLoading={isPending} flex={1}>
                {editingStack ? "Atualizar" : "Criar"}
              </Button>
              {editingStack && (
                <Button size="sm" variant="ghost" onClick={() => setEditingStack(null)}>
                  Cancelar
                </Button>
              )}
            </HStack>
          </ChakraStack>
        </Box>
      </Box>

      <Box bg="whiteAlpha.50" p={6} borderRadius="xl" border="1px solid" borderColor="whiteAlpha.100" overflowX="auto">
        <Table size="sm">
          <Thead>
            <Tr>
              <Th color="whiteAlpha.600">Nome</Th>
              <Th color="whiteAlpha.600">Ícone</Th>
              <Th color="whiteAlpha.600">Cor</Th>
              <Th color="whiteAlpha.600" textAlign="right">Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {stacks.map((stack) => (
              <Tr key={stack.id}>
                <Td fontWeight="medium">{stack.name}</Td>
                <Td color="whiteAlpha.700">{stack.icon || "-"}</Td>
                <Td>
                   <HStack>
                     <Box w={3} h={3} borderRadius="full" bg={stack.color || "gray.500"} />
                     <Text fontSize="xs">{stack.color || "-"}</Text>
                   </HStack>
                </Td>
                <Td textAlign="right">
                  <HStack justify="flex-end" spacing={1}>
                    <IconButton
                      aria-label="Editar"
                      icon={<Icon as={PencilSimple} />}
                      size="xs"
                      variant="ghost"
                      onClick={() => setEditingStack(stack)}
                    />
                    <IconButton
                      aria-label="Excluir"
                      icon={<Icon as={Trash} />}
                      size="xs"
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
                <Td colSpan={4} textAlign="center" py={4} color="whiteAlpha.500">
                  Nenhuma stack cadastrada.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
    </Grid>
  );
}
