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
  Link,
} from "@chakra-ui/react";
import { Envelope, Terminal, ArrowLeft } from "phosphor-react";
import { requestPasswordReset } from "@/app/actions";
import NextLink from "next/link";

export default function ForgotPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [isSent, setIsSent] = useState(false);
  const toast = useToast();

  const bg = useColorModeValue("gray.50", "#05080c");
  const cardBg = useColorModeValue("white", "rgba(32, 32, 36, 0.4)");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const headingColor = useColorModeValue("gray.800", "white");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    startTransition(async () => {
      const result = await requestPasswordReset(email);
      if (!result.success) {
        toast({
          title: "Erro ao solicitar",
          description: result.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      
      setIsSent(true);
      toast({
        title: "E-mail enviado",
        description: "Confira sua caixa de entrada para o link de recuperação.",
        status: "success",
      });
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
              Recuperar Acesso
            </Heading>
            <Text color="whiteAlpha.600" fontFamily="monospace" fontSize="sm">
              SISTEMA_RECOVERY v1.0 // PASSWORD_RESET
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
              {isSent ? (
                <VStack spacing={6} textAlign="center">
                  <Icon as={Envelope} color="brand.400" fontSize="48px" />
                  <Heading size="md">Verifique seu e-mail</Heading>
                  <Text color="whiteAlpha.700" fontSize="sm">
                    Enviamos as instruções de recuperação para você. Não esqueça de checar a pasta de spam.
                  </Text>
                  <Button 
                    as={NextLink} 
                    href="/login" 
                    variant="ghost" 
                    colorScheme="brand"
                  >
                    Voltar para o Login
                  </Button>
                </VStack>
              ) : (
                <form onSubmit={handleSubmit}>
                  <Stack spacing={6}>
                    <Text fontSize="sm" color="whiteAlpha.700" textAlign="center">
                      Informe seu e-mail institucional para receber o link de troca de chave.
                    </Text>
                    
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" color="whiteAlpha.700">Email de Acesso</FormLabel>
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

                    <Button 
                      type="submit" 
                      colorScheme="brand" 
                      size="lg" 
                      borderRadius="xl" 
                      isLoading={isPending}
                      loadingText="Solicitando..."
                      h="60px"
                      fontSize="md"
                      boxShadow="0 4px 15px rgba(59, 130, 246, 0.3)"
                    >
                      Enviar Link de Acesso_
                    </Button>

                    <Button 
                      as={NextLink} 
                      href="/login" 
                      variant="ghost" 
                      size="sm" 
                      leftIcon={<ArrowLeft />}
                      color="whiteAlpha.500"
                      _hover={{ color: "white" }}
                    >
                      Voltar para o Login
                    </Button>
                  </Stack>
                </form>
              )}
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}
