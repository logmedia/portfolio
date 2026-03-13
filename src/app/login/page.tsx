'use client';

import { useState, useTransition } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
  VStack,
  Icon,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  IconButton,
  HStack,
  Divider,
} from "@chakra-ui/react";
import { Lock, Envelope, Eye, EyeSlash, Terminal, GithubLogo } from "phosphor-react";
import { signIn, signInWithGitHub } from "@/app/actions";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { Link } from "@chakra-ui/react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const toast = useToast();
  const router = useRouter();

  const bg = useColorModeValue("gray.50", "#05080c");
  const cardBg = useColorModeValue("whiteAlpha.800", "whiteAlpha.500");
  const borderColor = useColorModeValue("whiteAlpha.300", "whiteAlpha.200");
  const headingColor = useColorModeValue("gray.800", "white");

  const handleLogin = (formData: FormData) => {
    startTransition(async () => {
      const result = await signIn(formData);
      if (!result.success) {
        toast({
          title: "Erro de autenticação",
          description: result.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      
      toast({
        title: "Acesso autorizado",
        description: "Redirecionando para o terminal admin...",
        status: "success",
      });
      
      router.push("/admin");
      router.refresh();
    });
  };

  const handleGitHubLogin = () => {
    startTransition(async () => {
      const result = await signInWithGitHub();
      if (!result.success) {
        toast({
          title: "Erro ao conectar com GitHub",
          description: result.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      
      if (result.url) {
        window.location.href = result.url;
      }
    });
  };

  return (
    <Box 
      bg={bg} 
      minH="100vh" 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
      position="relative"
      overflow="hidden"
    >
      {/* Background Decor */}
      <Box 
        position="absolute" 
        top="-10%" 
        right="-5%" 
        w="400px" 
        h="400px" 
        bg="brand.500" 
        filter="blur(150px)" 
        opacity="0.1" 
        zIndex={0}
      />
      
      <Container maxW="md" zIndex={1}>
        <VStack spacing={8} align="stretch">
          <VStack spacing={2} align="center">
            <Box 
              p={4} 
              bg="brand.500" 
              borderRadius="2xl" 
              boxShadow="0 0 20px rgba(59, 130, 246, 0.4)"
              mb={4}
            >
              <Icon as={Terminal} color="white" fontSize="32px" />
            </Box>
            <Heading size="xl" color={headingColor} letterSpacing="tight">
              Acesso Restrito
            </Heading>
            <Text color="whiteAlpha.600" fontFamily="monospace" fontSize="sm">
              PORTFOLIO_OS v2.0 // ADMIN_LOGIN
            </Text>
          </VStack>

          <Card 
            bg={cardBg} 
            backdropFilter="blur(16px)" 
            borderColor={borderColor} 
            borderWidth="1px" 
            borderRadius="3xl"
            boxShadow="2xl"
          >
            <CardBody p={8}>
              <form action={handleLogin}>
                <Stack spacing={6}>
                  <FormControl isRequired>
                    <FormLabel fontSize="sm" color="whiteAlpha.700">Identificação (Email)</FormLabel>
                    <InputGroup size="lg">
                      <Input 
                        name="email"
                        type="email" 
                        placeholder="admin@logmedia.com" 
                        bg="blackAlpha.300"
                        borderColor={borderColor}
                        _focus={{ borderColor: "brand.500", boxShadow: "none" }}
                        borderRadius="xl"
                      />
                    </InputGroup>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel fontSize="sm" color="whiteAlpha.700">Chave de Acesso (Senha)</FormLabel>
                    <InputGroup size="lg">
                      <Input 
                        name="password"
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        bg="blackAlpha.300"
                        borderColor={borderColor}
                        _focus={{ borderColor: "brand.500", boxShadow: "none" }}
                        borderRadius="xl"
                      />
                      <InputRightElement width="3.5rem">
                        <IconButton
                          h="1.75rem"
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowPassword(!showPassword)}
                          icon={showPassword ? <EyeSlash /> : <Eye />}
                          aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                          color="whiteAlpha.500"
                          _hover={{ color: "brand.400" }}
                        />
                      </InputRightElement>
                    </InputGroup>
                    <HStack justify="flex-end" mt={2}>
                      <Link 
                        as={NextLink} 
                        href="/forgot-password" 
                        fontSize="xs" 
                        color="whiteAlpha.500"
                        _hover={{ color: "brand.400", textDecoration: "none" }}
                      >
                        Esqueceu sua senha?_
                      </Link>
                    </HStack>
                  </FormControl>

                  <Button 
                    type="submit" 
                    colorScheme="brand" 
                    size="lg" 
                    borderRadius="xl" 
                    isLoading={isPending}
                    loadingText="Autenticando..."
                    h="60px"
                    fontSize="md"
                    boxShadow="0 4px 15px rgba(59, 130, 246, 0.3)"
                  >
                    Iniciar Sessão_
                  </Button>

                  <HStack px={4}>
                    <Divider borderColor="whiteAlpha.100" />
                    <Text fontSize="xs" color="whiteAlpha.400" whiteSpace="nowrap">OU ACESSAR COM</Text>
                    <Divider borderColor="whiteAlpha.100" />
                  </HStack>

                  <Button
                    leftIcon={<Icon as={GithubLogo} weight="fill" />}
                    onClick={handleGitHubLogin}
                    variant="outline"
                    size="lg"
                    borderRadius="xl"
                    h="60px"
                    borderColor="whiteAlpha.200"
                    _hover={{ bg: "whiteAlpha.100", borderColor: "whiteAlpha.300" }}
                    isLoading={isPending}
                    fontSize="md"
                  >
                    GitHub_
                  </Button>
                </Stack>
              </form>
            </CardBody>
          </Card>
          
          <Text textAlign="center" fontSize="xs" color="whiteAlpha.400" fontFamily="monospace">
            ID_TOKEN: 0x{Math.random().toString(16).slice(2, 10).toUpperCase()} // SECURE_CONNECTION: TRUE
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}
