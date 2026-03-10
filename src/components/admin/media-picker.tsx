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
  Icon,
} from '@chakra-ui/react';
import { Image as ImageIcon, Link as LinkIcon, Pencil } from 'phosphor-react';
import { MediaLibrary } from './media-library';

interface MediaPickerProps {
  value?: string;
  onChange: (url: string) => void;
  label: string;
}

export function MediaPicker({ value, onChange, label }: MediaPickerProps) {
  return (
    <FormControl>
      <FormLabel fontSize="sm">{label}</FormLabel>
      <VStack align="stretch" spacing={2}>
        {value && (
          <Box position="relative" borderRadius="lg" overflow="hidden" maxW="200px" border="1px solid" borderColor="whiteAlpha.200">
            <Image src={value} alt="Preview" fallbackSrc="https://via.placeholder.com/200x100?text=Erro+Imagem" />
            <Box position="absolute" top={0} left={0} w="100%" h="100%" bg="blackAlpha.600" opacity={0} _hover={{ opacity: 1 }} display="flex" alignItems="center" justifyContent="center" transition="all 0.2s">
              <Text fontSize="xs" fontWeight="bold">Alterar</Text>
            </Box>
          </Box>
        )}
        
        <HStack>
          <Input 
            name={label === "Foto de Destaque" ? "heroImage" : "gallery"}
            value={value || ''} 
            onChange={(e) => onChange(e.target.value)}
            bg="blackAlpha.300"
            placeholder="URL da imagem..."
            size="sm"
          />
          
          <Popover placement="bottom-end" isLazy>
            <PopoverTrigger>
              <Button size="sm" leftIcon={<ImageIcon size={18} />} colorScheme="brand">
                Mídia
              </Button>
            </PopoverTrigger>
            <PopoverContent bg="gray.900" borderColor="whiteAlpha.300" w="450px" boxShadow="dark-lg" zIndex={2000}>
              <PopoverArrow bg="gray.900" />
              <PopoverBody p={0}>
                <MediaLibrary 
                  selectedUrl={value}
                  onSelect={(media) => onChange(media.url)} 
                />
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </HStack>
      </VStack>
    </FormControl>
  );
}
