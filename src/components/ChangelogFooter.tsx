"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Text,
  VStack,
  Box,
  Heading,
  HStack,
  Badge,
  Divider,
} from "@chakra-ui/react";
import { Info } from "phosphor-react";
import { CHANGELOG_DATA, CURRENT_VERSION } from "@/lib/constants/changelog";

export function ChangelogFooter() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Text
        fontSize="xs"
        color="whiteAlpha.500"
        cursor="pointer"
        _hover={{ color: "brand.400", textDecoration: "underline" }}
        display="flex"
        alignItems="center"
        gap={1}
        onClick={onOpen}
      >
        <Info size={14} weight="bold" />
        v{CURRENT_VERSION} - Notas de Atualização
      </Text>

      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered scrollBehavior="inside">
        <ModalOverlay backdropFilter="blur(5px)" bg="blackAlpha.700" />
        <ModalContent bg="gray.900" border="1px solid" borderColor="whiteAlpha.200" color="white">
          <ModalHeader pb={2}>
            <Heading size="md" color="brand.400">Changelog & Novidades</Heading>
            <Text fontSize="sm" color="whiteAlpha.600" mt={1} fontWeight="normal">
              Acompanhe a evolução do portfólio.
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody py={6}>
            <VStack spacing={8} align="stretch">
              {CHANGELOG_DATA.map((entry, index) => (
                <Box key={entry.version}>
                  <HStack justify="space-between" mb={3} align="flex-end">
                    <HStack>
                      <Heading size="sm" color="white">{entry.version}</Heading>
                      {index === 0 && <Badge colorScheme="brand" variant="subtle" fontSize="0.6rem">No Ar</Badge>}
                    </HStack>
                    <Text fontSize="xs" color="whiteAlpha.500">{entry.date}</Text>
                  </HStack>
                  <Text fontWeight="semibold" mb={4} fontSize="sm" color="whiteAlpha.800">{entry.title}</Text>
                  
                  <VStack align="stretch" spacing={3}>
                    {entry.changes.map((change, i) => (
                      <HStack key={i} align="start" spacing={3}>
                        <Badge 
                          colorScheme={
                            change.type === "feat" ? "green" 
                            : change.type === "fix" ? "red" 
                            : "blue"
                          }
                          variant="solid"
                          fontSize="0.6rem"
                          px={2}
                          mt={0.5}
                        >
                          {change.type === "feat" ? "NOVO" : change.type === "fix" ? "CORREÇÃO" : "AJUSTE"}
                        </Badge>
                        <Text fontSize="sm" color="whiteAlpha.700" lineHeight="1.4">
                          {change.description}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>

                  {index < CHANGELOG_DATA.length - 1 && <Divider mt={8} borderColor="whiteAlpha.100" />}
                </Box>
              ))}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
