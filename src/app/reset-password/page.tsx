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
} from "@chakra-ui/react";
import { Lock, Eye, EyeSlash, Terminal } from "phosphor-react";
import { updatePassword } from "@/app/actions";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const toast = useToast();
  const router = useRouter();

  const bg = useColorModeValue("gray.50", "#05080c");
  const cardBg = useColorModeValue("white", "rgba(32, 32, 36, 0.4)");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const headingColor = useColorModeValue("gray.800", "white");

  const handleResetPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      toast({
        title: "Senhas não conferem",
        description: "A confirmação de senha deve ser igual à nova senha.",
        status: "warning",
      });
      return;
    }

    startTransition(async () => {
      const result = await updatePassword(password);
      if (!result.success) {
        toast({
          title: "Erro ao atualizar",
          description: result.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      
      toast({
        title: "Senha atualizada!",
        description: "Sua chave de acesso foi renovada. Redirecionando...",
        status: "success",
      });
      
      setTimeout(() => {
        router.push("/login");
      }, 2000);
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
              Nova Chave de Acesso
            </Heading>
            <Text color="whiteAlpha.600" fontFamily="monospace" fontSize="sm">
              SISTEMA_SECURE v1.0 // UPDATE_VAULT
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
              <form onSubmit={handleResetPassword}>
                <Stack spacing={6}>
                  <FormControl isRequired>
                    <FormLabel fontSize="sm" color="whiteAlpha.700">Nova Senha</FormLabel>
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
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel fontSize="sm" color="whiteAlpha.700">Confirmar Nova Senha</FormLabel>
                    <InputGroup size="lg">
                      <Input 
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        bg="blackAlpha.300"
                        borderColor={borderColor}
                        _focus={{ borderColor: "brand.500", boxShadow: "none" }}
                        borderRadius="xl"
                      />
                    </InputGroup>
                  </FormControl>

                  <Button 
                    type="submit" 
                    colorScheme="brand" 
                    size="lg" 
                    borderRadius="xl" 
                    isLoading={isPending}
                    loadingText="Atualizando..."
                    h="60px"
                    fontSize="md"
                    boxShadow="0 4px 15px rgba(59, 130, 246, 0.3)"
                  >
                    Renovar Acesso_
                  </Button>
                </Stack>
              </form>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}
