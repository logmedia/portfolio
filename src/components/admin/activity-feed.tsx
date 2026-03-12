'use client';

import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  Heading,
  useColorModeValue,
  Badge,
  Tooltip,
} from '@chakra-ui/react';
import { 
  Pencil, 
  Plus, 
  Trash, 
  Image as ImageIcon, 
  Stack as StackIcon, 
  User, 
  Clock,
  ArrowCounterClockwise,
  Prohibit
} from 'phosphor-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Activity {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: any;
  created_at: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

const getActionIcon = (action: string) => {
  switch (action) {
    case 'create_project': return Plus;
    case 'update_project': return Pencil;
    case 'trash_project': return Prohibit;
    case 'restore_project': return ArrowCounterClockwise;
    case 'delete_project': return Trash;
    case 'update_profile': return User;
    case 'create_stack': return Plus;
    case 'update_stack': return Pencil;
    case 'delete_stack': return Trash;
    case 'upload_media': return ImageIcon;
    case 'delete_media': return Trash;
    default: return Clock;
  }
};

const getActionColor = (action: string) => {
  if (action.startsWith('create') || action === 'upload_media') return 'green.400';
  if (action.startsWith('update')) return 'blue.400';
  if (action.startsWith('delete') || action === 'trash_project') return 'red.400';
  if (action === 'restore_project') return 'purple.400';
  return 'brand.400';
};

const getActionLabel = (action: string, entityType: string, details: any) => {
  const name = details?.title || details?.name || details?.filename || 'item';
  
  switch (action) {
    case 'create_project': return `Criou o projeto: ${name}`;
    case 'update_project': return `Atualizou o projeto: ${name}`;
    case 'trash_project': return `Moveu para lixeira: ${name}`;
    case 'restore_project': return `Restaurou o projeto: ${name}`;
    case 'delete_project': return `Excluiu o projeto permanentemente`;
    case 'update_profile': return `Atualizou seu perfil`;
    case 'create_stack': return `Criou a stack: ${name}`;
    case 'update_stack': return `Atualizou a stack: ${name}`;
    case 'delete_stack': return `Removeu uma stack`;
    case 'upload_media': return `Enviou arquivo: ${name}`;
    case 'delete_media': return `Removeu um arquivo de mídia`;
    default: return action.replace('_', ' ');
  }
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const cardBg = useColorModeValue('white', 'rgba(32, 32, 36, 0.4)');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  return (
    <Box 
      p={6} 
      bg={cardBg} 
      borderRadius="2xl" 
      borderWidth="1px" 
      borderColor={borderColor}
      backdropFilter="blur(16px)"
      transition="all 0.3s"
      _hover={{ borderColor: "whiteAlpha.300" }}
    >
      <VStack align="stretch" spacing={6}>
        <HStack justify="space-between">
          <HStack spacing={3}>
            <Box p={2} bg="whiteAlpha.100" borderRadius="lg">
              <Icon as={Clock} fontSize="20px" color="brand.400" />
            </Box>
            <VStack align="start" spacing={0}>
              <Heading size="sm" color="white">Últimas Ações</Heading>
              <Text fontSize="xs" color="whiteAlpha.500">Histórico de atividade recente</Text>
            </VStack>
          </HStack>
        </HStack>

        <VStack align="stretch" spacing={4} maxH="400px" overflowY="auto" pr={2} sx={{
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-track': { bg: 'transparent' },
          '&::-webkit-scrollbar-thumb': { bg: 'whiteAlpha.200', borderRadius: 'full' },
        }}>
          {activities.length === 0 ? (
            <Text color="whiteAlpha.400" fontSize="sm" textAlign="center" py={8}>
              Nenhuma atividade registrada ainda.
            </Text>
          ) : (
            activities.map((activity) => (
              <HStack key={activity.id} spacing={4} align="start" py={2} borderBottom="1px solid" borderBottomColor="whiteAlpha.50" _last={{ borderBottom: 'none' }}>
                <Box p={2} bg="whiteAlpha.100" borderRadius="md" mt={1}>
                  <Icon 
                    as={getActionIcon(activity.action)} 
                    color={getActionColor(activity.action)} 
                    fontSize="16px" 
                  />
                </Box>
                <VStack align="start" spacing={0} flex={1}>
                  <Text color="whiteAlpha.900" fontSize="sm" fontWeight="medium">
                    {getActionLabel(activity.action, activity.entity_type, activity.details)}
                  </Text>
                  <Text color="whiteAlpha.500" fontSize="xs">
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true, locale: ptBR })}
                  </Text>
                </VStack>
              </HStack>
            ))
          )}
        </VStack>
      </VStack>
    </Box>
  );
}
