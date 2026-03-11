import { Header } from "@/components/Header";
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  Button, 
  VStack, 
  HStack, 
  SimpleGrid, 
  Icon, 
  Flex,
  Image as ChakraImage,
  Link
} from "@chakra-ui/react";
import NextLink from "next/link";
import { 
  Github, 
  Zap, 
  Image as ImageIcon, 
  Globe, 
  ArrowRight,
  ShieldCheck,
  Smartphone
} from "lucide-react";

export default function LandingPage() {
  return (
    <Box minH="100vh" bg="#05080c" color="white" overflow="hidden">
      <Header />
      
      {/* Hero Section */}
      <Box 
        position="relative" 
        pt={{ base: 20, md: 32 }} 
        pb={{ base: 16, md: 24 }}
        zIndex={1}
      >
        {/* Background Gradients */}
        <Box 
          position="absolute" 
          top="-10%" 
          left="50%" 
          transform="translateX(-50%)" 
          w="1000px" 
          h="600px" 
          bgGradient="radial(brand.900 0%, transparent 70%)" 
          opacity={0.15} 
          pointerEvents="none"
          zIndex={-1}
        />

        <Container maxW="container.lg">
          <VStack spacing={8} align="center" textAlign="center">
            <Box
              px={4}
              py={1}
              bg="whiteAlpha.100"
              borderWidth="1px"
              borderColor="whiteAlpha.200"
              borderRadius="full"
              fontSize="sm"
              fontWeight="medium"
              color="brand.400"
            >
              🎉 A plataforma definitiva para desenvolvedores
            </Box>
            
            <Heading 
              as="h1" 
              size="4xl" 
              fontWeight="extrabold" 
              lineHeight="shorter"
              bgGradient="linear(to-r, white, whiteAlpha.600)"
              bgClip="text"
              maxW="4xl"
            >
              Crie seu portfólio profissional em segundos
            </Heading>
            
            <Text fontSize="xl" color="whiteAlpha.600" maxW="2xl">
              Sincronize seu GitHub automaticamente, exiba seus melhores projetos e tenha um link único para compartilhar com o mundo.
            </Text>

            <HStack spacing={4} pt={4}>
              <NextLink href="/login" passHref legacyBehavior>
                <Button
                  as="a"
                  size="lg"
                  colorScheme="brand"
                  px={10}
                  h={14}
                  fontSize="md"
                  fontWeight="bold"
                  rightIcon={<Icon as={ArrowRight} />}
                  _hover={{ transform: 'translateY(-2px)', textDecoration: 'none' }}
                  transition="all 0.2s"
                >
                  Criar meu Portfólio
                </Button>
              </NextLink>
              <NextLink href="/explore" passHref legacyBehavior>
                <Button
                  as="a"
                  size="lg"
                  variant="outline"
                  borderColor="whiteAlpha.300"
                  color="white"
                  px={10}
                  h={14}
                  fontSize="md"
                  _hover={{ bg: 'whiteAlpha.100', borderColor: 'whiteAlpha.400', textDecoration: 'none' }}
                >
                  Explorar Talentos
                </Button>
              </NextLink>
            </HStack>

            {/* Dashboard Preview Mockup */}
            <Box 
              mt={20} 
              w="full" 
              position="relative"
              p={4}
              bg="whiteAlpha.50"
              borderRadius="2xl"
              borderWidth="1px"
              borderColor="whiteAlpha.200"
              boxShadow="2xl"
            >
              <Box bg="#0a0f18" borderRadius="xl" overflow="hidden">
                 <Box bg="whiteAlpha.100" px={4} py={2} borderBottom="1px solid" borderColor="whiteAlpha.100" display="flex" gap={2}>
                    <Box w={3} h={3} borderRadius="full" bg="#ff5f56" />
                    <Box w={3} h={3} borderRadius="full" bg="#ffbd2e" />
                    <Box w={3} h={3} borderRadius="full" bg="#27c93f" />
                 </Box>
                 <Flex h={{ base: "300px", md: "500px" }} align="center" justify="center" direction="column" gap={4}>
                    <Icon as={Zap} size={48} color="brand.500" />
                    <Text color="whiteAlpha.400" fontWeight="medium">Interface Administrativa Intuitiva</Text>
                 </Flex>
              </Box>
            </Box>
          </VStack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={24} bg="blackAlpha.200">
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            <FeatureCard 
              icon={Github} 
              title="Sincronização GitHub" 
              description="Conecte sua conta e deixe o sistema puxar sua bio, avatar e contribuições automaticamente."
            />
            <FeatureCard 
              icon={ImageIcon} 
              title="Otimização de Mídia" 
              description="Suba fotos dos seus projetos com conversão automática para WebP e carregamento ultra rápido."
            />
            <FeatureCard 
              icon={Globe} 
              title="Link Único e Profissional" 
              description="Tenha um endereço exclusivo site.com/seu-user para colocar no seu currículo ou LinkedIn."
            />
          </SimpleGrid>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Container maxW="container.lg" py={32}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={20} alignItems="center">
          <VStack align="start" spacing={6}>
            <Heading size="2xl">Tudo o que você precisa em um só lugar</Heading>
            <Text color="whiteAlpha.600" fontSize="lg">
              Nossa plataforma foi desenhada por desenvolvedores para desenvolvedores. Chega de sofrer configurando layouts complexos.
            </Text>
            
            <VStack align="start" spacing={4} pt={4}>
              <BenefitItem icon={Zap} title="Foco no que importa" text="Escreva o conteúdo dos seus projetos e nós cuidamos da apresentação." />
              <BenefitItem icon={ShieldCheck} title="Segurança Avançada" text="Dados protegidos por Row Level Security do Supabase." />
              <BenefitItem icon={Smartphone} title="Totalmente Responsivo" text="Seu portfólio fica perfeito em qualquer tamanho de tela." />
            </VStack>
          </VStack>
          
          <Box 
            bgGradient="linear(to-br, brand.500, brand.900)" 
            borderRadius="3xl" 
            h="400px" 
            w="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            opacity={0.8}
            boxShadow="dark-lg"
          >
            <Icon as={Smartphone} size={120} color="white" />
          </Box>
        </SimpleGrid>
      </Container>

      {/* CTA Final */}
      <Box py={32} position="relative">
        <Box 
          position="absolute" 
          inset={0} 
          bgGradient="linear(to-t, #05080c, brand.900, #05080c)" 
          opacity={0.1}
          zIndex={-1}
        />
        <Container maxW="container.md">
          <VStack spacing={8} textAlign="center">
            <Heading size="2xl">Pronto para elevar sua carreira?</Heading>
            <Text color="whiteAlpha.600" fontSize="lg">
              Comece a construir seu portfólio profissional agora mesmo e faça parte da nossa comunidade.
            </Text>
            <NextLink href="/login" passHref legacyBehavior>
              <Button
                as="a"
                size="xl"
                px={12}
                py={8}
                colorScheme="brand"
                fontSize="xl"
                fontWeight="bold"
                _hover={{ transform: 'scale(1.05)', textDecoration: 'none' }}
                transition="all 0.2s"
                boxShadow="0 0 20px rgba(0, 153, 255, 0.4)"
              >
                Criar meu Portfólio Grátis
              </Button>
            </NextLink>
          </VStack>
        </Container>
      </Box>

      {/* Footer */}
      <Box borderTop="1px solid" borderColor="whiteAlpha.100" py={12}>
        <Container maxW="container.xl">
          <Flex direction={{ base: "column", md: "row" }} justify="space-between" align="center" gap={6}>
            <Text color="whiteAlpha.400" fontSize="sm">
              © 2026 LogMedia Portfolio. Todos os direitos reservados.
            </Text>
            <HStack spacing={8}>
              <Link href="/explore" color="whiteAlpha.600" _hover={{ color: 'brand.500' }}>Explorar</Link>
              <Link href="/login" color="whiteAlpha.600" _hover={{ color: 'brand.500' }}>Login</Link>
              <Link href="#" color="whiteAlpha.600" _hover={{ color: 'brand.500' }}>GTermos</Link>
            </HStack>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}

function FeatureCard({ icon: IconComponent, title, description }: any) {
  return (
    <VStack align="start" spacing={4} p={8} bg="whiteAlpha.50" borderRadius="2xl" border="1px solid" borderColor="whiteAlpha.100">
      <Box bg="brand.500" p={2} borderRadius="lg">
        <Icon as={IconComponent} size={24} color="white" />
      </Box>
      <Heading size="md">{title}</Heading>
      <Text color="whiteAlpha.600">{description}</Text>
    </VStack>
  );
}

function BenefitItem({ icon: IconComponent, title, text }: any) {
  return (
    <HStack align="start" spacing={4}>
      <Icon as={IconComponent} size={24} color="brand.500" mt={1} />
      <Box>
        <Text fontWeight="bold" fontSize="md">{title}</Text>
        <Text color="whiteAlpha.600" fontSize="sm">{text}</Text>
      </Box>
    </HStack>
  );
}
