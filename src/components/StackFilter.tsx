'use client';

import { 
  Box, 
  Flex, 
  Tag, 
  TagLabel, 
  TagLeftIcon, 
  HStack, 
  Text,
  IconButton,
  Tooltip
} from "@chakra-ui/react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { X } from "phosphor-react";
import type { Stack } from "@/types/content";

type StackFilterProps = {
  stacks: Stack[];
};

export function StackFilter({ stacks }: StackFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const activeStackId = searchParams.get("stack");

  const handleToggle = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (activeStackId === id) {
      params.delete("stack");
    } else {
      params.set("stack", id);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearFilter = () => {
    router.push(pathname, { scroll: false });
  };

  if (stacks.length === 0) return null;

  return (
    <Box mb={6}>
      <HStack justify="space-between" mb={3} align="center">
        <Text fontSize="sm" fontWeight="bold" color="whiteAlpha.600" textTransform="uppercase" letterSpacing="wider">
          Filtrar por tecnologia
        </Text>
        {activeStackId && (
          <Tooltip label="Limpar filtro">
            <IconButton
              aria-label="Limpar filtro"
              icon={<X size={14} />}
              size="xs"
              variant="ghost"
              colorScheme="brand"
              onClick={clearFilter}
            />
          </Tooltip>
        )}
      </HStack>
      <Flex gap={2} flexWrap="wrap">
        {stacks.map((stack) => {
          const isActive = activeStackId === stack.id;
          return (
            <Tag
              key={stack.id}
              size="md"
              variant={isActive ? "solid" : "subtle"}
              colorScheme={isActive ? "brand" : "gray"}
              cursor="pointer"
              onClick={() => handleToggle(stack.id)}
              transition="all 0.2s"
              _hover={{ 
                transform: "translateY(-2px)",
                bg: isActive ? "brand.500" : "whiteAlpha.200" 
              }}
              py={2}
              px={3}
              borderRadius="full"
            >
              <Box 
                w={2} 
                h={2} 
                borderRadius="full" 
                bg={stack.color || "brand.400"} 
                mr={2} 
                boxShadow={isActive ? `0 0 10px ${stack.color || "#00e5ff"}` : "none"}
              />
              <TagLabel fontWeight={isActive ? "bold" : "medium"}>{stack.name}</TagLabel>
            </Tag>
          );
        })}
      </Flex>
    </Box>
  );
}
