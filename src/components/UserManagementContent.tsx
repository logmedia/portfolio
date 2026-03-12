'use client';

import { useState, useTransition } from "react";
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Badge,
  Text,
  HStack,
  useToast,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Portal,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import { DotsThreeVertical, ShieldCheck, UserCircle, Prohibit, CheckCircle } from "phosphor-react";
import { updateProfileStatus, updateProfileRole } from "@/app/actions";
import type { Profile } from "@/types/content";

interface UserManagementContentProps {
  users: Profile[];
}

export function UserManagementContent({ users: initialUsers }: UserManagementContentProps) {
  const [users, setUsers] = useState<Profile[]>(initialUsers);
  const [isPending, startTransition] = useTransition();
  const toast = useToast();

  const handleToggleStatus = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'blocked' ? 'active' : 'blocked';
    
    startTransition(async () => {
      const result = await updateProfileStatus(userId, newStatus);
      if (result.success) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
        toast({
          title: `Usuário ${newStatus === 'blocked' ? 'bloqueado' : 'desbloqueado'}`,
          status: "success",
          duration: 3000,
        });
      } else {
        toast({ title: result.message, status: "error" });
      }
    });
  };

  const handleToggleRole = (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'editor' : 'admin';
    
    startTransition(async () => {
      const result = await updateProfileRole(userId, newRole);
      if (result.success) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
        toast({
          title: `Permissão alterada para ${newRole}`,
          status: "success",
          duration: 3000,
        });
      } else {
        toast({ title: result.message, status: "error" });
      }
    });
  };

  if (!users || users.length === 0) {
    return (
      <Box p={8} textAlign="center" bg="whiteAlpha.50" borderRadius="xl">
        <Text color="whiteAlpha.500">Nenhum outro usuário encontrado.</Text>
      </Box>
    );
  }

  return (
    <Box bg="whiteAlpha.50" borderRadius="xl" border="1px solid" borderColor="whiteAlpha.100" overflow="hidden">
      <Box overflowX="auto">
        <Table variant="simple">
          <Thead bg="whiteAlpha.100">
            <Tr>
              < Th color="whiteAlpha.600">Usuário</Th>
              <Th color="whiteAlpha.600">Cargo</Th>
              <Th color="whiteAlpha.600">Status</Th>
              <Th color="whiteAlpha.600">Entrou em</Th>
              <Th color="whiteAlpha.600" textAlign="right">Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user.id} _hover={{ bg: "whiteAlpha.50" }} transition="all 0.2s">
                <Td>
                  <HStack spacing={3}>
                    <Avatar size="sm" src={user.avatar_url || ""} name={user.name} />
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="bold" fontSize="sm">{user.name}</Text>
                      <Text fontSize="xs" color="whiteAlpha.500">@{user.github_username || 'sem_username'}</Text>
                    </VStack>
                  </HStack>
                </Td>
                <Td>
                  <Badge 
                    colorScheme={user.role === 'admin' ? "brand" : "gray"} 
                    variant="subtle"
                    px={2}
                    py={0.5}
                    borderRadius="full"
                    fontSize="2xs"
                  >
                    {user.role === 'admin' ? "Administrador" : "Editor"}
                  </Badge>
                </Td>
                <Td>
                  <HStack spacing={2}>
                    <Box 
                      w={2} 
                      h={2} 
                      borderRadius="full" 
                      bg={user.status === 'blocked' ? "red.400" : "green.400"} 
                    />
                    <Text fontSize="xs" color="whiteAlpha.700">
                      {user.status === 'blocked' ? "Bloqueado" : "Ativo"}
                    </Text>
                  </HStack>
                </Td>
                <Td fontSize="xs" color="whiteAlpha.600">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : '-'}
                </Td>
                <Td textAlign="right">
                  <Menu isLazy>
                    <MenuButton
                      as={IconButton}
                      aria-label="Opções"
                      icon={<DotsThreeVertical size={18} />}
                      variant="ghost"
                      size="sm"
                      _hover={{ bg: "whiteAlpha.200" }}
                      isLoading={isPending}
                    />
                    <Portal>
                      <MenuList bg="gray.900" borderColor="whiteAlpha.200">
                        <MenuItem 
                          icon={user.status === 'blocked' ? <CheckCircle size={18} /> : <Prohibit size={18} />} 
                          onClick={() => handleToggleStatus(user.id, user.status || 'active')}
                          bg="transparent"
                          _hover={{ bg: "whiteAlpha.100" }}
                        >
                          {user.status === 'blocked' ? "Desbloquear" : "Bloquear"}
                        </MenuItem>
                        <MenuItem 
                          icon={user.role === 'admin' ? <UserCircle size={18} /> : <ShieldCheck size={18} />} 
                          onClick={() => handleToggleRole(user.id, user.role || 'editor')}
                          bg="transparent"
                          _hover={{ bg: "whiteAlpha.100" }}
                        >
                          {user.role === 'admin' ? "Tornar Editor" : "Tornar Administrador"}
                        </MenuItem>
                      </MenuList>
                    </Portal>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
