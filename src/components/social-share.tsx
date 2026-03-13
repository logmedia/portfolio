'use client';

import {
  HStack,
  IconButton,
  Link,
  Tooltip,
  useToast,
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
  
  const shareLinks: Record<string, string> = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(title)}%20${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  };

  const icons: Record<string, any> = {
    whatsapp: WhatsappLogo,
    linkedin: LinkedinLogo,
    facebook: FacebookLogo,
    twitter: TwitterLogo,
  };

  const colors: Record<string, string> = {
    whatsapp: "green.500",
    linkedin: "blue.600",
    facebook: "blue.500",
    twitter: "white",
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copiado!",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <HStack spacing={2}>
      {activeNetworks
        .filter(n => n.enabled && icons[n.id])
        .map((network) => {
          const IconComponent = icons[network.id];
          const shareUrl = shareLinks[network.id];
          
          if (!IconComponent || !shareUrl) return null;

          return (
            <Tooltip key={network.id} label={`Compartilhar no ${network.name}`} hasArrow>
              <IconButton
                as={Link}
                href={shareUrl}
                isExternal
                aria-label={`Compartilhar no ${network.name}`}
                icon={<IconComponent size={20} weight="fill" />}
                variant="ghost"
                color={colors[network.id] || "white"}
                _hover={{ 
                  bg: "whiteAlpha.200", 
                  color: colors[network.id],
                  transform: "translateY(-2px)" 
                }}
                transition="all 0.2s"
              />
            </Tooltip>
          );
      })}
      
      <Tooltip label="Copiar Link" hasArrow>
        <IconButton
          aria-label="Copiar Link"
          icon={<Copy size={20} weight="bold" />}
          onClick={copyToClipboard}
          variant="ghost"
          color="whiteAlpha.800"
          _hover={{ 
            bg: "whiteAlpha.200", 
            color: "brand.400",
            transform: "translateY(-2px)" 
          }}
          transition="all 0.2s"
        />
      </Tooltip>
    </HStack>
  );
}
