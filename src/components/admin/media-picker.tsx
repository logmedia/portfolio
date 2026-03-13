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
  Collapse,
  useDisclosure,
  Grid,
  Portal,
} from '@chakra-ui/react';
import { Image as ImageIcon, Trash, CloudArrowUp, Link as LinkIcon } from 'phosphor-react';
import { MediaLibrary } from './media-library';

interface MediaPickerProps {
  value?: string;
  onChange: (url: string) => void;
  label: string;
  intent?: 'cover' | 'avatar' | 'general';
}

export function MediaPicker({ value, onChange, label, intent = 'general' }: MediaPickerProps) {
  const { isOpen: showUrlInput, onToggle: toggleUrlInput } = useDisclosure();
  const inputName = label === "Foto de Destaque" ? "heroImage" : "gallery";

  return (
    <FormControl>
      {label && <FormLabel fontSize="sm">{label}</FormLabel>}
      
      {/* Hidden input for form submission */}
      <input type="hidden" name={inputName} value={value || ''} />
      
      <Box
        border="1px solid"
        borderColor="whiteAlpha.200"
        borderRadius="xl"
        overflow="hidden"
        bg="blackAlpha.200"
      >
        <Grid templateColumns={value ? "120px 1fr" : "1fr"} minH="100px">
          {/* Thumbnail à esquerda */}
          {value ? (
            <Box
              bg="blackAlpha.500"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRight="1px solid"
              borderColor="whiteAlpha.100"
              position="relative"
              role="group"
              cursor="pointer"
              onClick={() => onChange('')}
            >
              <Image
                src={value}
                alt="Destaque"
                objectFit="cover"
                w="100%"
                h="100%"
                minH="100px"
                fallback={
                  <Skeleton w="100%" h="100px" startColor="whiteAlpha.100" endColor="whiteAlpha.300" />
                }
              />
              <Box
                position="absolute"
                inset={0}
                bg="blackAlpha.700"
                opacity={0}
                _groupHover={{ opacity: 1 }}
                display="flex"
                alignItems="center"
                justifyContent="center"
                transition="all 0.2s"
              >
                <Trash size={20} color="white" />
              </Box>
            </Box>
          ) : null}

          {/* Controles à direita */}
          <VStack
            align="stretch"
            justify="center"
            spacing={3}
            p={4}
          >
            {!value && (
              <HStack spacing={2} color="whiteAlpha.400">
                <Box
                  w="40px"
                  h="40px"
                  borderRadius="lg"
                  bg="whiteAlpha.100"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                >
                  <ImageIcon size={20} />
                </Box>
                <Text fontSize="xs" color="whiteAlpha.400">
                  Nenhuma imagem
                </Text>
              </HStack>
            )}

            <HStack spacing={2}>
              <Popover placement="bottom-start" isLazy>
                <PopoverTrigger>
                  <Button
                    size="xs"
                    variant="outline"
                    leftIcon={<CloudArrowUp size={14} />}
                    borderColor="whiteAlpha.300"
                    _hover={{ bg: 'whiteAlpha.100' }}
                  >
                    {value ? 'Alterar' : 'Enviar'}
                  </Button>
                </PopoverTrigger>
                <Portal>
                  <PopoverContent bg="gray.900" borderColor="whiteAlpha.300" w="480px" boxShadow="dark-lg" zIndex={2000}>
                    <PopoverArrow bg="gray.900" />
                    <PopoverBody p={0}>
                      <MediaLibrary selectedUrl={value} onSelect={(media) => onChange(media.url)} intent={intent} />
                    </PopoverBody>
                  </PopoverContent>
                </Portal>
              </Popover>

              <Button
                size="xs"
                variant="ghost"
                leftIcon={<LinkIcon size={12} />}
                onClick={toggleUrlInput}
                color="whiteAlpha.500"
                _hover={{ color: 'whiteAlpha.800' }}
              >
                URL
              </Button>

              {value && (
                <IconButton
                  aria-label="Remover"
                  icon={<Trash size={12} />}
                  size="xs"
                  variant="ghost"
                  colorScheme="red"
                  onClick={() => onChange('')}
                />
              )}
            </HStack>

            <Collapse in={showUrlInput} animateOpacity>
              <Input
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                bg="blackAlpha.400"
                placeholder="https://..."
                size="xs"
                borderColor="whiteAlpha.200"
              />
            </Collapse>
          </VStack>
        </Grid>
      </Box>
    </FormControl>
  );
}
