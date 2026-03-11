import { Header } from "@/components/Header";
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
  Icon
} from "@chakra-ui/react";
import { fetchAllProfiles } from "@/lib/supabase/queries";
import NextLink from "next/link";
import { Users, ArrowRight } from "lucide-react";

export const revalidate = 3600;

export default async function UserDirectory() {
  const profiles = await fetchAllProfiles();

  return (
    <Box minH="100vh" bgGradient="linear(to-b, #05080c, #040507)">
      <Header />
      
      <Container maxW="container.xl" py={20}>
        <VStack spacing={12} align="center" textAlign="center">
          <VStack spacing={4}>
            <HStack color="brand.500">
              <Icon as={Users} />
              <Text fontWeight="semibold" letterSpacing="widest" textTransform="uppercase" fontSize="sm">
                Diretório de Talentos
              </Text>
            </HStack>
            <Heading size="2xl" bgGradient="linear(to-r, white, whiteAlpha.600)" bgClip="text">
              Descubra Desenvolvedores
            </Heading>
            <Text color="whiteAlpha.600" fontSize="lg" maxW="2xl">
              Navegue pelos portfólios da nossa comunidade e conecte-se com os melhores profissionais.
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={8} w="full">
            {profiles.map((profile) => (
              <NextLink
                key={profile.id}
                href={`/${profile.github_username || profile.id}`}
                passHref
                legacyBehavior
              >
                <Link
                  _hover={{ textDecoration: 'none' }}
                >
                  <Card 
                    bg="whiteAlpha.50" 
                    borderColor="whiteAlpha.100" 
                    borderWidth="1px"
                    _hover={{ 
                      transform: 'translateY(-4px)', 
                      borderColor: 'brand.500', 
                      bg: 'whiteAlpha.100' 
                    }}
                    transition="all 0.3s"
                  >
                    <CardBody p={8}>
                      <VStack spacing={6}>
                        <Avatar 
                          size="2xl" 
                          name={profile.name} 
                          src={profile.avatar_url}
                          border="2px solid"
                          borderColor="brand.500"
                        />
                        <VStack spacing={1}>
                          <Heading size="md" color="white">{profile.name}</Heading>
                          <Text color="whiteAlpha.600" fontSize="sm">{profile.role || 'Desenvolvedor'}</Text>
                        </VStack>
                        
                        {profile.stacks && Array.isArray(profile.stacks) && profile.stacks.length > 0 && (
                          <HStack spacing={2} wrap="wrap" justify="center">
                            {profile.stacks.slice(0, 3).map((stack: any) => (
                              <Tag key={stack} size="sm" variant="subtle" colorScheme="gray">
                                {stack}
                              </Tag>
                            ))}
                          </HStack>
                        )}

                        <HStack color="brand.500" fontWeight="bold">
                          <Text>Ver Portfólio</Text>
                          <Icon as={ArrowRight} />
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>
                </Link>
              </NextLink>
            ))}
          </SimpleGrid>

          {profiles.length === 0 && (
            <Box py={20}>
              <Text color="whiteAlpha.400">Nenhum usuário cadastrado ainda.</Text>
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  );
}
