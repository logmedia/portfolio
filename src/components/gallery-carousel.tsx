'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Image,
  Box,
  Text,
  HStack,
  IconButton,
  useDisclosure,
  Grid,
  Skeleton,
} from '@chakra-ui/react';
import { CaretLeft, CaretRight } from 'phosphor-react';
import type { GalleryItem } from '@/types/content';

interface GalleryCarouselProps {
  items: GalleryItem[];
}

export function GalleryCarousel({ items }: GalleryCarouselProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentIndex, setCurrentIndex] = useState(0);

  const sortedItems = [...items].sort((a, b) => a.order - b.order);

  const goTo = (index: number) => {
    if (index >= 0 && index < sortedItems.length) {
      setCurrentIndex(index);
    }
  };

  const prev = useCallback(() => {
    setCurrentIndex((i) => (i > 0 ? i - 1 : sortedItems.length - 1));
  }, [sortedItems.length]);

  const next = useCallback(() => {
    setCurrentIndex((i) => (i < sortedItems.length - 1 ? i + 1 : 0));
  }, [sortedItems.length]);

  const openAt = (index: number) => {
    setCurrentIndex(index);
    onOpen();
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, prev, next, onClose]);

  if (!sortedItems.length) return null;

  const current = sortedItems[currentIndex];

  return (
    <>
      {/* Grid de thumbnails */}
      <Grid templateColumns="repeat(auto-fill, minmax(180px, 1fr))" gap={4}>
        {sortedItems.map((item, index) => (
          <Box
            key={`${item.url}-${index}`}
            position="relative"
            borderRadius="xl"
            overflow="hidden"
            cursor="pointer"
            onClick={() => openAt(index)}
            role="group"
            border="1px solid"
            borderColor="whiteAlpha.100"
            transition="all 0.3s"
            _hover={{ 
              transform: 'translateY(-4px)', 
              boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
              borderColor: 'brand.400'
            }}
          >
            <Box sx={{ aspectRatio: "16/10" }}>
              <Image
                src={item.url}
                alt={item.caption || `Foto ${index + 1}`}
                objectFit="cover"
                w="100%"
                h="100%"
                fallback={<Skeleton w="100%" h="100%" />}
                transition="transform 0.3s"
                _groupHover={{ transform: 'scale(1.05)' }}
              />
            </Box>
            {item.caption && (
              <Box
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                bg="linear-gradient(transparent, rgba(0,0,0,0.8))"
                px={3}
                py={2}
              >
                <Text fontSize="xs" color="white" noOfLines={1}>
                  {item.caption}
                </Text>
              </Box>
            )}
          </Box>
        ))}
      </Grid>

      {/* Modal Fullscreen Carousel */}
      <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered>
        <ModalOverlay bg="blackAlpha.900" backdropFilter="blur(12px)" />
        <ModalContent bg="transparent" boxShadow="none" maxW="100vw" maxH="100vh" m={0}>
          <ModalCloseButton
            color="white"
            size="lg"
            zIndex={10}
            top={4}
            right={4}
            bg="blackAlpha.500"
            borderRadius="full"
            _hover={{ bg: 'blackAlpha.700' }}
          />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            p={0}
            position="relative"
          >
            {/* Navigation arrows */}
            <IconButton
              aria-label="Anterior"
              icon={<CaretLeft size={32} weight="bold" />}
              position="absolute"
              left={{ base: 2, md: 8 }}
              top="50%"
              transform="translateY(-50%)"
              zIndex={10}
              size="lg"
              variant="ghost"
              color="white"
              bg="blackAlpha.500"
              borderRadius="full"
              _hover={{ bg: 'blackAlpha.700', transform: 'translateY(-50%) scale(1.1)' }}
              onClick={prev}
            />
            <IconButton
              aria-label="Próxima"
              icon={<CaretRight size={32} weight="bold" />}
              position="absolute"
              right={{ base: 2, md: 8 }}
              top="50%"
              transform="translateY(-50%)"
              zIndex={10}
              size="lg"
              variant="ghost"
              color="white"
              bg="blackAlpha.500"
              borderRadius="full"
              _hover={{ bg: 'blackAlpha.700', transform: 'translateY(-50%) scale(1.1)' }}
              onClick={next}
            />

            {/* Main image */}
            <Box
              maxW="90vw"
              maxH="80vh"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Image
                src={current?.url}
                alt={current?.caption || ''}
                objectFit="contain"
                maxW="90vw"
                maxH="75vh"
                borderRadius="xl"
                transition="opacity 0.3s"
              />
            </Box>

            {/* Caption + Progress */}
            <Box
              position="absolute"
              bottom={6}
              left="50%"
              transform="translateX(-50%)"
              textAlign="center"
              maxW="600px"
            >
              {current?.caption && (
                <Text
                  color="white"
                  fontSize="md"
                  fontWeight="medium"
                  mb={2}
                  textShadow="0 2px 8px rgba(0,0,0,0.8)"
                >
                  {current.caption}
                </Text>
              )}
              <HStack justify="center" spacing={1.5}>
                {sortedItems.map((_, idx) => (
                  <Box
                    key={idx}
                    w={idx === currentIndex ? "24px" : "8px"}
                    h="8px"
                    borderRadius="full"
                    bg={idx === currentIndex ? "brand.400" : "whiteAlpha.400"}
                    cursor="pointer"
                    onClick={() => goTo(idx)}
                    transition="all 0.3s"
                    _hover={{ bg: idx === currentIndex ? "brand.300" : "whiteAlpha.600" }}
                  />
                ))}
              </HStack>
              <Text fontSize="xs" color="whiteAlpha.500" mt={1}>
                {currentIndex + 1} / {sortedItems.length}
              </Text>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
