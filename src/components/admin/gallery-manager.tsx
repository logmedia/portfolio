'use client';

import { useState, useRef } from 'react';
import {
  Box,
  Button,
  Grid,
  Image,
  Text,
  VStack,
  HStack,
  IconButton,
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Badge,
  Skeleton,
} from '@chakra-ui/react';
import { Trash, DotsSixVertical, CloudArrowUp, PencilSimple, Check } from 'phosphor-react';
import { MediaLibrary } from './media-library';
import type { GalleryItem } from '@/types/content';

interface GalleryManagerProps {
  items: GalleryItem[];
  onChange: (items: GalleryItem[]) => void;
}

export function GalleryManager({ items, onChange }: GalleryManagerProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [editingCaption, setEditingCaption] = useState<number | null>(null);
  const [captionValue, setCaptionValue] = useState('');
  const dragCounter = useRef(0);

  const addItem = (url: string) => {
    const newItem: GalleryItem = {
      url,
      caption: '',
      order: items.length,
    };
    onChange([...items, newItem]);
  };

  const removeItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index).map((item, i) => ({ ...item, order: i }));
    onChange(updated);
  };

  const startEditCaption = (index: number) => {
    setEditingCaption(index);
    setCaptionValue(items[index].caption || '');
  };

  const saveCaption = () => {
    if (editingCaption === null) return;
    const updated = [...items];
    updated[editingCaption] = { ...updated[editingCaption], caption: captionValue };
    onChange(updated);
    setEditingCaption(null);
  };

  // Drag and Drop
  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragEnter = (index: number) => {
    dragCounter.current++;
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragOverIndex(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (dropIndex: number) => {
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null);
      setDragOverIndex(null);
      dragCounter.current = 0;
      return;
    }

    const updated = [...items];
    const [dragged] = updated.splice(dragIndex, 1);
    updated.splice(dropIndex, 0, dragged);
    
    const reordered = updated.map((item, i) => ({ ...item, order: i }));
    onChange(reordered);
    
    setDragIndex(null);
    setDragOverIndex(null);
    dragCounter.current = 0;
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
    dragCounter.current = 0;
  };

  return (
    <VStack align="stretch" spacing={3}>
      {/* Grid de thumbnails */}
      {items.length > 0 && (
        <Grid templateColumns="repeat(auto-fill, minmax(140px, 1fr))" gap={3}>
          {items.map((item, index) => (
            <Box
              key={`${item.url}-${index}`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(index)}
              onDragEnd={handleDragEnd}
              position="relative"
              borderRadius="lg"
              overflow="hidden"
              border="2px solid"
              borderColor={dragOverIndex === index ? "brand.400" : "whiteAlpha.200"}
              opacity={dragIndex === index ? 0.5 : 1}
              transition="all 0.15s"
              cursor="grab"
              _active={{ cursor: "grabbing" }}
              role="group"
              bg="blackAlpha.400"
            >
              {/* Thumbnail */}
              <Box sx={{ aspectRatio: "4/3" }} position="relative">
                <Image
                  src={item.url}
                  alt={item.caption || `Foto ${index + 1}`}
                  objectFit="cover"
                  w="100%"
                  h="100%"
                  fallback={<Skeleton w="100%" h="100%" />}
                />
                
                {/* Overlay com ações */}
                <Box
                  position="absolute"
                  inset={0}
                  bg="blackAlpha.700"
                  opacity={0}
                  _groupHover={{ opacity: 1 }}
                  transition="all 0.2s"
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  p={1.5}
                >
                  <HStack justify="space-between">
                    <Box cursor="grab" p={1}>
                      <DotsSixVertical size={16} color="white" weight="bold" />
                    </Box>
                    <Badge fontSize="9px" bg="blackAlpha.600" color="white">
                      {index + 1}/{items.length}
                    </Badge>
                  </HStack>
                  
                  <HStack justify="center" spacing={1}>
                    <IconButton
                      aria-label="Editar legenda"
                      icon={<PencilSimple size={14} />}
                      size="xs"
                      variant="solid"
                      bg="whiteAlpha.300"
                      _hover={{ bg: 'whiteAlpha.500' }}
                      onClick={(e) => { e.stopPropagation(); startEditCaption(index); }}
                    />
                    <IconButton
                      aria-label="Remover"
                      icon={<Trash size={14} />}
                      size="xs"
                      colorScheme="red"
                      onClick={(e) => { e.stopPropagation(); removeItem(index); }}
                    />
                  </HStack>
                </Box>
              </Box>

              {/* Legenda */}
              {editingCaption === index ? (
                <HStack p={1.5} spacing={1}>
                  <Input
                    size="xs"
                    value={captionValue}
                    onChange={(e) => setCaptionValue(e.target.value)}
                    placeholder="Legenda..."
                    bg="blackAlpha.400"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && saveCaption()}
                  />
                  <IconButton
                    aria-label="Salvar"
                    icon={<Check size={12} />}
                    size="xs"
                    colorScheme="brand"
                    onClick={saveCaption}
                  />
                </HStack>
              ) : item.caption ? (
                <Text
                  fontSize="10px"
                  color="whiteAlpha.600"
                  px={2}
                  py={1}
                  noOfLines={1}
                  cursor="pointer"
                  onClick={() => startEditCaption(index)}
                  _hover={{ color: 'whiteAlpha.900' }}
                >
                  {item.caption}
                </Text>
              ) : null}
            </Box>
          ))}
        </Grid>
      )}

      {/* Botão adicionar */}
      <Popover placement="bottom-start" isLazy>
        <PopoverTrigger>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<CloudArrowUp size={16} />}
            borderColor="whiteAlpha.300"
            borderStyle="dashed"
            _hover={{ bg: 'whiteAlpha.100', borderColor: 'brand.400' }}
            w="100%"
          >
            {items.length === 0 ? 'Adicionar fotos à galeria' : 'Adicionar mais fotos'}
          </Button>
        </PopoverTrigger>
        <PopoverContent bg="gray.900" borderColor="whiteAlpha.300" w="480px" boxShadow="dark-lg" zIndex={2000}>
          <PopoverArrow bg="gray.900" />
          <PopoverBody p={0}>
            <MediaLibrary
              selectedUrl=""
              onSelect={(media) => addItem(media.url)}
            />
          </PopoverBody>
        </PopoverContent>
      </Popover>

      {items.length > 0 && (
        <Text fontSize="xs" color="whiteAlpha.400" textAlign="center">
          Arraste para reordenar • Passe o mouse para editar legenda ou remover
        </Text>
      )}
    </VStack>
  );
}
