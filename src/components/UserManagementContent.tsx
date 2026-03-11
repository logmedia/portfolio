"use client";

import { 
  Box, 
  Container, 
  Heading, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Badge, 
  Button, 
  Avatar, 
  HStack, 
  VStack, 
  Text,
  IconButton,
  useToast,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select
} from "@chakra-ui/react";
import { ShieldCheck, UserMinus, UserCheck, Bell, Trash2 } from "lucide-react";
import { useState } from "react";
import { adminUpdateUserStatus, adminDeleteUser, adminSendNotification } from "@/app/actions";

interface UserManagementContentProps {
  users: any[];
}

export function UserManagementContent({ users }: UserManagementContentProps) {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [notifData, setNotifData] = useState({ title: '', content: '', type: 'info' });
  const [loading, setLoading] = useState<string | null>(null);

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    setLoading(userId);
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    const result = await adminUpdateUserStatus(userId, newStatus as any);
    
    if (result.success) {
      toast({
        title: "Sucesso!",
        description: `Usuário ${newStatus === 'active' ? 'ativado' : 'bloqueado'} com sucesso.`,
        status: "success",
        duration: 3000,
      });
    } else {
      toast({
        title: "Erro",
        description: result.message,
        status: "error",
      });
    }
    setLoading(null);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Tem certeza que deseja deletar este usuário? Esta ação é irreversível.")) return;
    
    setLoading(userId);
    const result = await adminDeleteUser(userId);
    
    if (result.success) {
      toast({
        title: "Usuário deletado",
        status: "info",
        duration: 3000,
      });
    } else {
      toast({
        title: "Erro ao deletar",
        description: result.message,
        status: "error",
      });
    }
    setLoading(null);
  };

  const openNotifyModal = (user: any) => {
    setSelectedUser(user);
    setNotifData({ title: '', content: '', type: 'info' });
    onOpen();
  };

  const handleSendNotif = async () => {
    const result = await adminSendNotification(
      selectedUser?.id || null, // null = global
      notifData.title,
      notifData.content,
      notifData.type as any
    );

    if (result.success) {
      toast({
        title: "Notificação enviada!",
        status: "success",
      });
      onClose();
    } else {
      toast({
        title: "Erro ao enviar",
        description: result.message,
        status: "error",
      });
    }
  };

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <VStack align="start" spacing={0}>
            <Heading size="lg">Gestão de Usuários</Heading>
            <Text color="whiteAlpha.600">Administre acessos e envie comunicações globais.</Text>
          </VStack>
          <Button 
            leftIcon={<Bell size={18} />} 
            colorScheme="brand" 
            onClick={() => openNotifyModal(null)}
          >
            Notificação Global
          </Button>
        </HStack>

        <Box bg="whiteAlpha.50" borderRadius="xl" border="1px solid" borderColor="whiteAlpha.100" overflow="hidden">
          <Table variant="simple">
            <Thead bg="whiteAlpha.100">
              <Tr>
                <Th color="whiteAlpha.600">Usuário</Th>
                <Th color="whiteAlpha.600">Função</Th>
                <Th color="whiteAlpha.600">Status</Th>
                <Th color="whiteAlpha.600">Criado em</Th>
                <Th color="whiteAlpha.600" textAlign="right">Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user) => (
                <Tr key={user.id} _hover={{ bg: "whiteAlpha.50" }} transition="all 0.2s">
                  <Td>
                    <HStack spacing={3}>
                      <Avatar size="sm" src={user.avatar_url} name={user.name} />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="bold">{user.name}</Text>
                        <Text fontSize="xs" color="whiteAlpha.500">{user.github_username || 'Sem GitHub'}</Text>
                      </VStack>
                    </HStack>
                  </Td>
                  <Td>
                    <Badge colorScheme={user.role === 'admin' ? 'purple' : 'gray'}>
                      {user.role}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge colorScheme={user.status === 'active' ? 'green' : 'red'}>
                      {user.status === 'active' ? 'Ativo' : 'Bloqueado'}
                    </Badge>
                  </Td>
                  <Td color="whiteAlpha.600" fontSize="sm">
                    {new Date(user.created_at).toLocaleDateString()}
                  </Td>
                  <Td textAlign="right">
                    <HStack spacing={2} justify="end">
                      <IconButton
                        aria-label="Notificar"
                        icon={<Bell size={16} />}
                        size="sm"
                        variant="ghost"
                        onClick={() => openNotifyModal(user)}
                      />
                      <IconButton
                        aria-label={user.status === 'active' ? "Bloquear" : "Ativar"}
                        icon={user.status === 'active' ? <UserMinus size={16} /> : <UserCheck size={16} />}
                        size="sm"
                        colorScheme={user.status === 'active' ? "orange" : "green"}
                        variant="ghost"
                        isLoading={loading === user.id}
                        onClick={() => handleToggleStatus(user.id, user.status)}
                      />
                      <IconButton
                        aria-label="Deletar"
                        icon={<Trash2 size={16} />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        isLoading={loading === user.id}
                        onClick={() => handleDeleteUser(user.id)}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent bg="gray.900" border="1px solid" borderColor="whiteAlpha.200">
          <ModalHeader>
            {selectedUser ? `Notificar: ${selectedUser.name}` : "Enviar Notificação Global"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Título</FormLabel>
                <Input 
                  placeholder="Ex: Novo recurso disponível!" 
                  value={notifData.title}
                  onChange={(e) => setNotifData({...notifData, title: e.target.value})}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Conteúdo</FormLabel>
                <Textarea 
                  placeholder="Escreva sua mensagem aqui..." 
                  value={notifData.content}
                  onChange={(e) => setNotifData({...notifData, content: e.target.value})}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Tipo de Alerta</FormLabel>
                <Select 
                  value={notifData.type}
                  onChange={(e) => setNotifData({...notifData, type: e.target.value})}
                >
                  <option value="info">💡 Informativo (Azul)</option>
                  <option value="success">✅ Sucesso (Verde)</option>
                  <option value="warning">⚠️ Aviso (Laranja)</option>
                  <option value="error">🚨 Erro/Crítico (Vermelho)</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter borderTop="1px solid" borderColor="whiteAlpha.100">
            <Button variant="ghost" mr={3} onClick={onClose}>Cancelar</Button>
            <Button colorScheme="brand" onClick={handleSendNotif}>
              Enviar Agora
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}
