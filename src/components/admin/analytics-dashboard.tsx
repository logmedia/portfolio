'use client';

import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Card,
  CardBody,
  List,
  ListItem,
  Badge,
  Divider,
} from "@chakra-ui/react";
import { Eye, Users, Clock, ChartLine, ListNumbers } from "phosphor-react";

interface AnalyticsSummary {
  totalViews: number;
  uniqueVisitors: number;
  recentViews: number;
  topPages: { path: string; count: number }[];
}

interface AnalyticsDashboardProps {
  summary: AnalyticsSummary;
}

export function AnalyticsDashboard({ summary }: AnalyticsDashboardProps) {
  return (
    <VStack spacing={8} align="stretch" w="full">
      <HStack spacing={2}>
        <Icon as={ChartLine} color="brand.400" boxSize={6} weight="fill" />
        <Heading size="md">Visão Geral do Tráfego</Heading>
      </HStack>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <Card variant="outline" bg="whiteAlpha.50" borderRadius="2xl">
          <CardBody>
            <Stat>
              <StatLabel color="whiteAlpha.600">Total de Visualizações</StatLabel>
              <HStack spacing={3} mt={2}>
                <Icon as={Eye} boxSize={5} color="blue.400" />
                <StatNumber fontSize="3xl">{summary.totalViews}</StatNumber>
              </HStack>
              <StatHelpText>Todo o período</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card variant="outline" bg="whiteAlpha.50" borderRadius="2xl">
          <CardBody>
            <Stat>
              <StatLabel color="whiteAlpha.600">Visitantes Únicos</StatLabel>
              <HStack spacing={3} mt={2}>
                <Icon as={Users} boxSize={5} color="cyan.400" />
                <StatNumber fontSize="3xl">{summary.uniqueVisitors}</StatNumber>
              </HStack>
              <StatHelpText>Identificados por hash</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card variant="outline" bg="whiteAlpha.50" borderRadius="2xl">
          <CardBody>
            <Stat>
              <StatLabel color="whiteAlpha.600">Últimas 24 Horas</StatLabel>
              <HStack spacing={3} mt={2}>
                <Icon as={Clock} boxSize={5} color="green.400" />
                <StatNumber fontSize="3xl">{summary.recentViews}</StatNumber>
              </HStack>
              <StatHelpText>
                <StatArrow type="increase" />
                Visitas recentes
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      <Box pt={4}>
        <HStack spacing={2} mb={6}>
          <Icon as={ListNumbers} color="brand.400" boxSize={6} weight="fill" />
          <Heading size="md">Páginas Mais Visitadas</Heading>
        </HStack>
        
        <Card variant="outline" bg="whiteAlpha.50" borderRadius="2xl">
          <CardBody p={0}>
            <List spacing={0}>
              {summary.topPages.length > 0 ? (
                summary.topPages.map((page, index) => (
                  <ListItem key={page.path}>
                    <HStack justify="space-between" p={4} borderBottom={index < summary.topPages.length - 1 ? "1px solid" : "none"} borderColor="whiteAlpha.100">
                      <HStack spacing={4}>
                        <Badge variant="solid" colorScheme="whiteAlpha" borderRadius="md" w="24px" textAlign="center">
                          {index + 1}
                        </Badge>
                        <Text fontFamily="monospace" fontSize="sm" color="whiteAlpha.800">
                          {page.path}
                        </Text>
                      </HStack>
                      <HStack>
                        <Text fontWeight="bold" color="brand.400">{page.count}</Text>
                        <Text fontSize="xs" color="whiteAlpha.500">views</Text>
                      </HStack>
                    </HStack>
                  </ListItem>
                ))
              ) : (
                <Box p={8} textAlign="center">
                  <Text color="whiteAlpha.500 italic">Nenhum dado de tráfego capturado ainda.</Text>
                </Box>
              )}
            </List>
          </CardBody>
        </Card>
      </Box>

      <Divider borderColor="whiteAlpha.100" />
      
      <Box p={4} borderRadius="xl" bg="blue.900" opacity={0.1} border="1px solid" borderColor="blue.800">
        <Text fontSize="sm" color="blue.200">
          <strong>Tip:</strong> Estes dados são rastreados internamente para feedback imediato. Para análises mais profundas e comportamento do usuário completo, utilize o painel oficial do Google Analytics.
        </Text>
      </Box>
    </VStack>
  );
}
