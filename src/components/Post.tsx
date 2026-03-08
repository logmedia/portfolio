"use client";

import { Box, Flex, Avatar, Text, Link, Textarea, Button, Heading } from "@chakra-ui/react";
import { useState } from "react";

export function Post() {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Box
      as="article"
      bg="rgba(32, 32, 36, 0.4)"
      backdropFilter="blur(16px)"
      borderRadius="2xl"
      p={10}
      mt={8}
      _first={{ mt: 0 }}
      boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
      border="1px solid"
      borderColor="whiteAlpha.100"
      transition="all 0.3s ease"
      _hover={{ boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
    >
      <Flex as="header" align="center" justify="space-between">
        <Flex align="center" gap={4}>
          <Avatar
            size="xl"
            src="https://github.com/logmedia.png"
            name="José Renato"
            border="4px solid"
            borderColor="brand.900" /* matching gray-800 from theme */
            outline="2px solid"
            outlineColor="brand.500"
            bg="brand.800"
          />
          <Flex direction="column">
            <Text color="gray.100" fontWeight="bold" lineHeight="1.6">
              José Renato
            </Text>
            <Text fontSize="sm" color="gray.400" lineHeight="1.6">
              Web Developer
            </Text>
          </Flex>
        </Flex>
        <Text
          as="time"
          fontSize="sm"
          color="gray.400"
          title="10 de junho às 17:00h"
          dateTime="2022-05-11 08:13:30"
        >
          Publicado há 1 hora
        </Text>
      </Flex>
      
      <Box lineHeight="1.6" color="gray.300" mt={6} sx={{ "& > p": { mt: 4 } }}>
        <Text as="p">Fala galeraa 👋</Text>
        <Text as="p">
          Acabei de subir mais um projeto no meu portifa. É um projeto que fiz no
          NLW Return, evento da Rocketseat. O nome do projeto é DoctorCare 🚀
        </Text>
        <Text as="p">
          👉{" "}
          <Link href="#" fontWeight="bold" color="brand.500" _hover={{ color: "brand.300", textDecoration: "none" }} transition="color 0.2s">
            jane.design/doctorcare
          </Link>
        </Text>
        <Text as="p">
          <Link href="#" fontWeight="bold" color="brand.500" _hover={{ color: "brand.300", textDecoration: "none" }} transition="color 0.2s" mr={1}>
            #novoprojeto
          </Link>
          <Link href="#" fontWeight="bold" color="brand.500" _hover={{ color: "brand.300", textDecoration: "none" }} transition="color 0.2s" mr={1}>
            #nlw
          </Link>
          <Link href="#" fontWeight="bold" color="brand.500" _hover={{ color: "brand.300", textDecoration: "none" }} transition="color 0.2s">
            #rocketseat
          </Link>
        </Text>
      </Box>

      <Box
        as="form"
        w="full"
        mt={6}
        pt={6}
        borderTop="1px solid"
        borderColor="whiteAlpha.200"
      >
        <Heading as="strong" size="sm" lineHeight="1.6" color="gray.100" display="block">
          Deixe o seu feedback
        </Heading>
        <Textarea
          w="full"
          bg="rgba(18, 18, 20, 0.5)"
          border="1px solid"
          borderColor="whiteAlpha.100"
          resize="none"
          h={24}
          p={4}
          borderRadius="lg"
          color="gray.100"
          lineHeight="1.4"
          mt={4}
          _focus={{ outline: "none", boxShadow: "0 0 0 2px var(--chakra-colors-brand-500)", borderColor: "transparent" }}
          placeholder="Deixe um comentário"
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            if (!e.target.value) setIsFocused(false);
          }}
        />
        <Box
          as="footer"
          visibility={isFocused ? "visible" : "hidden"}
          maxH={isFocused ? "none" : 0}
          opacity={isFocused ? 1 : 0}
          transition="all 0.3s ease"
          overflow="hidden"
        >
          <Button
            type="submit"
            bg="brand.500"
            color="white"
            py={4}
            px={6}
            mt={4}
            borderRadius="lg"
            border={0}
            fontWeight="bold"
            cursor="pointer"
            transition="all 0.2s ease"
            _hover={{ bg: "brand.300", transform: "scale(1.02)", boxShadow: "0 0 15px rgba(0, 135, 95, 0.3)" }}
            _active={{ transform: "scale(0.98)" }}
          >
            Comentar
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
