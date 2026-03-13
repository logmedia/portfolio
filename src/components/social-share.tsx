'use client';

import {
  VStack,
  HStack,
  IconButton,
  Link,
  Tooltip,
  useToast,
  Box,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  FacebookLogo,
  LinkedinLogo,
  TwitterLogo,
  WhatsappLogo,
  Copy,
} from "phosphor-react";
import { SocialNetwork } from "@/types/content";

interface SocialShareProps {
  url: string;
  title: string;
  activeNetworks: SocialNetwork[];
}

export function SocialShare({ url, title, activeNetworks }: SocialShareProps) {
  const toast = useToast();
  
  // Use vertical VStack for Desktop, horizontal HStack for Mobile
  const isMobile = useBreakpointValue({ base: true, md: false });
  const StackComponent = isMobile ? HStack : VStack;

  const shareLinks: Record<string, string> = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(title)}%20${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    instagram: `https://www.instagram.com/`, // Instagram doesn't have a direct share link API, mostly used to link profile or copy URL. Kept as fallback.
  };

  const icons: Record<string, any> = {
    whatsapp: WhatsappLogo,
    linkedin: LinkedinLogo,
    facebook: FacebookLogo,
    twitter: TwitterLogo,
    instagram: LinkedinLogo, // Fallback icon config just in case it reaches here, though Instagram is typically a link to profile not share intent.
  };

  const colors: Record<string, string> = {
    whatsapp: "green.400",
    linkedin: "blue.400",
    facebook: "blue.400",
    twitter: "white",
    instagram: "pink.400",
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copiado!",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "bottom",
    });
  };

  // Only render if there are enabled networks
  const enabledNetworks = activeNetworks.filter(n => n.enabled && icons[n.id]);
  if (enabledNetworks.length === 0) return null;

  return (
    <Box
      position="fixed"
      top={{ base: "auto", md: "50%" }}
      bottom={{ base: "6", md: "auto" }}
      left={{ base: "50%", md: "6" }}
      transform={{ base: "translateX(-50%)", md: "translateY(-50%)" }}
      bg="whiteAlpha.50"
      backdropFilter="blur(16px)"
      border="1px solid"
      borderColor="whiteAlpha.200"
      borderRadius={{ base: "2xl", md: "full" }}
      py={{ base: 2, md: 4 }}
      px={{ base: 4, md: 2 }}
      boxShadow="0 8px 32px rgba(0, 0, 0, 0.4)"
      zIndex={100}
      animation="fadeIn 0.5s ease-out"
    >
      <StackComponent spacing={3}>
        {enabledNetworks.map((network) => {
            const IconComponent = icons[network.id];
            const shareUrl = shareLinks[network.id];
            
            if (!IconComponent || !shareUrl) return null;

            return (
              <Tooltip key={network.id} label={`Compartilhar no ${network.name}`} placement={isMobile ? "top" : "right"} hasArrow>
                <IconButton
                  as={Link}
                  href={shareUrl}
                  isExternal
                  aria-label={`Compartilhar no ${network.name}`}
                  icon={<IconComponent size={22} weight="fill" />}
                  variant="ghost"
                  color="whiteAlpha.700"
                  rounded="full"
                  w={10}
                  h={10}
                  _hover={{ 
                    bg: "whiteAlpha.200", 
                    color: colors[network.id],
                    transform: isMobile ? "translateY(-4px)" : "translateX(4px) scale(1.1)",
                    shadow: `0 0 12px var(--chakra-colors-${colors[network.id].replace('.', '-')})`
                  }}
                  transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                />
              </Tooltip>
            );
        })}
        
        <Box w={isMobile ? "1px" : "full"} h={isMobile ? "24px" : "1px"} bg="whiteAlpha.300" mx="auto" />

        <Tooltip label="Copiar Link" placement={isMobile ? "top" : "right"} hasArrow>
          <IconButton
            aria-label="Copiar Link"
            icon={<Copy size={22} weight="bold" />}
            onClick={copyToClipboard}
            variant="ghost"
            color="whiteAlpha.700"
            rounded="full"
            w={10}
            h={10}
            _hover={{ 
              bg: "whiteAlpha.200", 
              color: "brand.300",
              transform: isMobile ? "translateY(-4px)" : "translateX(4px) scale(1.1)",
              shadow: "0 0 12px var(--chakra-colors-brand-300)"
            }}
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          />
        </Tooltip>
      </StackComponent>
    </Box>
  );
}
