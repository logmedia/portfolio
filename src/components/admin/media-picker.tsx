'use client';

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Button,
  Input,
  HStack,
  VStack,
  FormControl,
  FormLabel,
  Image,
  Box,
  Text,
  Skeleton,
  IconButton,
  InputGroup,
  InputLeftElement,
  Collapse,
  useDisclosure,
} from '@chakra-ui/react';
import { Image as ImageIcon, Trash, CloudArrowUp, Link as LinkIcon, CaretDown, CaretUp } from 'phosphor-react';
import { MediaLibrary } from './media-library';

interface MediaPickerProps {
  value?: string;
  onChange: (url: string) => void;
  label: string;
}

export function MediaPicker({ value, onChange, label }: MediaPickerProps) {
  const { isOpen: showUrlInput, onToggle: toggleUrlInput } = useDisclosure();
  const inputName = label === "Foto de Destaque" ? "heroImage" : "gallery";

  return (
    <FormControl>
      <FormLabel fontSize="sm">{label}</FormLabel>
      
      {/* Hidden input for form submission */}
      <input type="hidden" name={inputName} value={value || ''} />
      
      <Box
        border="1px solid"
        borderColor={value ? "whiteAlpha.200" : "whiteAlpha.100"}
        borderRadius="xl"
        overflow="hidden"
        bg="blackAlpha.200"
        transition="all 0.2s"
      >
        {/* Thumbnail / Skeleton */}
        <Box
          position="relative"
          w="100%"
          minH="140px"
          bg="blackAlpha.400"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {value ? (
            <>
              <Image
                src={value}
                alt="Imagem de destaque"
                objectFit="cover"
                w="100%"
                maxH="200px"
                fallback={
                  <Skeleton w="100%" h="140px" startColor="whiteAlpha.100" endColor="whiteAlpha.300" />
                }
              />
              {/* Overlay com botão remover */}
              <Box
                position="absolute"
                top={0}
                left={0}
                w="100%"
                h="100%"
                bg="blackAlpha.600"
                opacity={0}
                _hover={{ opacity: 1 }}
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={3}
                transition="all 0.2s"
              >
                <Popover placement="bottom" isLazy>
                  <PopoverTrigger>
                    <Button size="sm" colorScheme="brand" leftIcon={<ImageIcon size={16} />}>
                      Alterar
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent bg="gray.900" borderColor="whiteAlpha.300" w="480px" boxShadow="dark-lg" zIndex={2000}>
                    <PopoverArrow bg="gray.900" />
                    <PopoverBody p={0}>
                      <MediaLibrary selectedUrl={value} onSelect={(media) => onChange(media.url)} />
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
                
                <IconButton
                  aria-label="Remover imagem"
                  icon={<Trash size={16} />}
                  size="sm"
                  colorScheme="red"
                  variant="solid"
                  onClick={() => onChange('')}
                />
              </Box>
            </>
          ) : (
            /* Skeleton placeholder quando não tem imagem */
            <VStack spacing={3} py={6}>
              <Box
                w="64px"
                h="64px"
                borderRadius="xl"
                bg="whiteAlpha.100"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <ImageIcon size={32} color="rgba(255,255,255,0.3)" />
              </Box>
              <VStack spacing={1}>
                <Text fontSize="sm" fontWeight="medium" color="whiteAlpha.500">
                  Nenhuma imagem selecionada
                </Text>
                <Text fontSize="xs" color="whiteAlpha.300">
                  Envie um arquivo ou cole uma URL
                </Text>
              </VStack>
            </VStack>
          )}
        </Box>

        {/* Ações */}
        <HStack p={3} spacing={2} borderTop="1px solid" borderColor="whiteAlpha.100" bg="blackAlpha.300">
          <Popover placement="bottom-start" isLazy>
            <PopoverTrigger>
              <Button size="sm" variant="outline" leftIcon={<CloudArrowUp size={16} />} flex={1} borderColor="whiteAlpha.200" _hover={{ bg: 'whiteAlpha.100' }}>
                Enviar / Biblioteca
              </Button>
            </PopoverTrigger>
            <PopoverContent bg="gray.900" borderColor="whiteAlpha.300" w="480px" boxShadow="dark-lg" zIndex={2000}>
              <PopoverArrow bg="gray.900" />
              <PopoverBody p={0}>
                <MediaLibrary selectedUrl={value} onSelect={(media) => onChange(media.url)} />
              </PopoverBody>
            </PopoverContent>
          </Popover>

          <Button
            size="sm"
            variant="ghost"
            leftIcon={showUrlInput ? <CaretUp size={14} /> : <LinkIcon size={14} />}
            onClick={toggleUrlInput}
            color="whiteAlpha.500"
            _hover={{ color: 'whiteAlpha.800' }}
          >
            URL
          </Button>

          {value && (
            <IconButton
              aria-label="Remover"
              icon={<Trash size={14} />}
              size="sm"
              variant="ghost"
              colorScheme="red"
              onClick={() => onChange('')}
            />
          )}
        </HStack>

        {/* URL Input colapsável */}
        <Collapse in={showUrlInput} animateOpacity>
          <Box px={3} pb={3}>
            <InputGroup size="sm">
              <InputLeftElement>
                <LinkIcon size={14} color="rgba(255,255,255,0.4)" />
              </InputLeftElement>
              <Input
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                bg="blackAlpha.400"
                placeholder="https://exemplo.com/imagem.jpg"
                borderColor="whiteAlpha.200"
              />
            </InputGroup>
          </Box>
        </Collapse>
      </Box>
    </FormControl>
  );
}
