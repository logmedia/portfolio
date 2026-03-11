'use client';

import React from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import { 
  Box, 
  Heading, 
  Text, 
  VStack, 
  HStack, 
  Icon, 
  useColorModeValue,
  Skeleton,
  Tooltip,
} from '@chakra-ui/react';
import { GithubLogo, Info } from 'phosphor-react';

interface GithubActivityProps {
  username?: string;
}

export function GithubActivity({ username }: GithubActivityProps) {
  const cardBg = useColorModeValue('white', 'rgba(32, 32, 36, 0.4)');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  
  if (!username) {
    return (
      <Box 
        p={6} 
        bg={cardBg} 
        borderRadius="2xl" 
        borderWidth="1px" 
        borderColor={borderColor}
        backdropFilter="blur(10px)"
      >
        <VStack align="center" py={4}>
          <Icon as={GithubLogo} fontSize="32px" color="whiteAlpha.300" />
          <Text color="whiteAlpha.600" fontSize="sm">Conecte seu GitHub para ver as atividades</Text>
        </VStack>
      </Box>
    );
  }

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
              <Icon as={GithubLogo} fontSize="20px" color="brand.400" />
            </Box>
            <VStack align="start" spacing={0}>
              <Heading size="sm" color="white">Atividade no GitHub</Heading>
              <Text fontSize="xs" color="whiteAlpha.500">@{username}</Text>
            </VStack>
          </HStack>
          
          <Tooltip label="Dados atualizados em tempo real do GitHub">
            <Icon as={Info} color="whiteAlpha.400" />
          </Tooltip>
        </HStack>

        <Box 
          overflowX="auto" 
          py={2}
          sx={{
            '&::-webkit-scrollbar': {
              height: '4px',
            },
            '&::-webkit-scrollbar-track': {
              bg: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              bg: 'whiteAlpha.200',
              borderRadius: 'full',
            },
          }}
        >
          <GitHubCalendar 
            username={username} 
            colorScheme='dark'
            fontSize={12}
            blockSize={12}
            blockMargin={4}
            labels={{
              totalCount: '{{count}} contribuições no último ano',
            }}
            theme={{
              dark: ['rgba(255, 255, 255, 0.05)', 'rgba(59, 130, 246, 0.2)', 'rgba(59, 130, 246, 0.4)', 'rgba(59, 130, 246, 0.7)', 'rgba(59, 130, 246, 1)'],
            }}
          />
        </Box>
      </VStack>
    </Box>
  );
}
