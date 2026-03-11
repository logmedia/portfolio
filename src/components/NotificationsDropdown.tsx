"use client";

import { 
  Popover, 
  PopoverTrigger, 
  PopoverContent, 
  PopoverHeader, 
  PopoverBody, 
  PopoverArrow, 
  PopoverCloseButton, 
  IconButton, 
  VStack, 
  Text, 
  Box, 
  Badge, 
  HStack, 
  Circle,
  Divider,
  Button
} from "@chakra-ui/react";
import { Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchNotifications } from "@/lib/supabase/queries";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = async () => {
    const data = await fetchNotifications();
    setNotifications(data);
    setUnreadCount(data.filter(n => !n.is_read).length);
  };

  useEffect(() => {
    loadNotifications();

    // Setup Realtime Subscription
    const supabase = createSupabaseBrowserClient();
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        () => {
          loadNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const markAllAsRead = async () => {
    // Implementar se necessário, por enquanto apenas visual
    setUnreadCount(0);
  };

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Box position="relative">
          <IconButton
            aria-label="Abrir notificações"
            icon={<Bell size={20} />}
            variant="ghost"
            borderRadius="full"
          />
          {unreadCount > 0 && (
            <Circle 
              size="18px" 
              bg="red.500" 
              color="white" 
              position="absolute" 
              top="-1px" 
              right="-1px" 
              fontSize="10px"
              fontWeight="bold"
            >
              {unreadCount}
            </Circle>
          )}
        </Box>
      </PopoverTrigger>
      <PopoverContent bg="gray.900" borderColor="whiteAlpha.100" boxShadow="2xl" w="320px">
        <PopoverArrow bg="gray.900" />
        <PopoverHeader border="none" pt={4} px={4}>
          <HStack justify="space-between">
            <Text fontWeight="bold">Notificações</Text>
            {unreadCount > 0 && (
              <Button size="xs" variant="ghost" colorScheme="brand" onClick={markAllAsRead}>
                Marcar todas como lidas
              </Button>
            )}
          </HStack>
        </PopoverHeader>
        <PopoverBody p={0} maxH="400px" overflowY="auto">
          {notifications.length === 0 ? (
            <Box p={8} textAlign="center">
              <Text color="whiteAlpha.400" fontSize="sm">Nenhuma notificação por enquanto.</Text>
            </Box>
          ) : (
            <VStack align="stretch" spacing={0}>
              {notifications.map((n) => (
                <Box 
                  key={n.id} 
                  p={4} 
                  _hover={{ bg: "whiteAlpha.100" }} 
                  transition="bg 0.2s" 
                  borderTop="1px solid" 
                  borderColor="whiteAlpha.50"
                  cursor="pointer"
                >
                  <VStack align="start" spacing={1}>
                    <HStack w="full" justify="space-between">
                      <Text 
                        fontWeight={!n.is_read ? "bold" : "medium"} 
                        fontSize="sm" 
                        color={n.type === 'error' ? 'red.400' : 'white'}
                      >
                        {n.title}
                      </Text>
                      {!n.is_read && <Circle size="6px" bg="brand.500" />}
                    </HStack>
                    <Text fontSize="xs" color="whiteAlpha.600" noOfLines={3}>
                      {n.content}
                    </Text>
                    <Text fontSize="10px" color="whiteAlpha.400">
                      {new Date(n.created_at).toLocaleDateString()}
                    </Text>
                  </VStack>
                </Box>
              ))}
            </VStack>
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
