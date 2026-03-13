"use client";

import { Box, Flex, Text, Link, Icon, Stack, HStack, useColorModeValue } from "@chakra-ui/react";
import { GithubLogo, LinkedinLogo, InstagramLogo, Globe, WhatsappLogo, FacebookLogo, DiscordLogo, YoutubeLogo, TwitterLogo } from "phosphor-react";
import Image from "next/image";
import { SocialShare } from "./social-share";
import { SiteSettings } from "@/types/content";
import { Divider } from "@chakra-ui/react";

interface Profile {
  name: string;
  role: "admin" | "editor";
  job_title?: string;
  bio?: string;
  avatar_url: string;
  cover_url: string;
  socials?: { label: string; url: string }[];
  whatsapp_number?: string;
  whatsapp_public?: boolean;
}

const DEFAULT_PROFILE: Profile = {
  name: "José Renato",
  role: "admin",
  job_title: "Web Developer",
  bio: "Crio experiências web modernas focadas em performance e design.",
  avatar_url: "https://avatars.githubusercontent.com/u/99501874?v=4",
  cover_url:
    "https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?q=60&w=500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};

const iconMap: Record<string, any> = {
  github: GithubLogo,
  linkedin: LinkedinLogo,
  instagram: InstagramLogo,
  facebook: FacebookLogo,
  discord: DiscordLogo,
  youtube: YoutubeLogo,
  twitter: TwitterLogo,
  x: TwitterLogo,
  site: Globe,
};

interface SidebarProps {
  profile?: Partial<Profile>;
  siteSettings?: SiteSettings | null;
}

export function Sidebar({ profile, siteSettings }: SidebarProps) {
  const { name, role, job_title, bio, avatar_url, cover_url, socials, whatsapp_number, whatsapp_public } = { ...DEFAULT_PROFILE, ...profile };

  const bg = useColorModeValue("whiteAlpha.50", "whiteAlpha.50");
  const borderColor = useColorModeValue("whiteAlpha.200", "whiteAlpha.100");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");
  const cardShadow = useColorModeValue("xl", "2xl");

  return (
    <Box
      as="aside"
      bg={bg}
      backdropFilter="blur(16px)"
      borderRadius="2xl"
      overflow="hidden"
      boxShadow={cardShadow}
      border="1px solid"
      borderColor={borderColor}
      mb={6}
    >
      <Box h="120px" w="full" position="relative">
        <Image
          src={cover_url}
          alt={`Cover image for ${name}`}
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          sizes="(max-width: 768px) 100vw, 400px"
          priority
        />
      </Box>
      
      <Stack spacing={4} align="center" px={6} pb={8} position="relative">
        <Box
          mt="-60px"
          w="128px"
          h="128px"
          borderRadius="full"
          border="4px solid"
          borderColor="brand.900"
          outline="2px solid"
          outlineColor="brand.500"
          bg="brand.800"
          boxShadow="xl"
          position="relative"
          overflow="hidden"
          flexShrink={0}
        >
          <Image
            src={avatar_url}
            alt={`${name} avatar`}
            fill
            style={{ objectFit: "cover" }}
            sizes="128px"
            priority
          />
        </Box>
        
        <Stack spacing={1} align="center">
          <Text color={textColor} fontWeight="bold" fontSize="xl" lineHeight="1.2">
            {name}
          </Text>
          <Text fontSize="sm" color="brand.500" fontWeight="semibold" letterSpacing="wider" textTransform="uppercase">
            {profile?.job_title || job_title || role}
          </Text>
        </Stack>

        <Text color={mutedTextColor} fontSize="sm" textAlign="center" lineHeight="1.6" maxW="220px">
          {bio}
        </Text>

        <HStack spacing={4} pt={2}>
          {(Array.isArray(socials) && socials.length > 0 ? socials : [
            { label: "Github", url: "https://github.com" },
            { label: "Linkedin", url: "https://linkedin.com" }
          ]).map((social) => {
            const IconComp = iconMap[social.label.toLowerCase()] || Globe;
            return (
              <Link 
                key={social.label} 
                href={social.url} 
                isExternal 
                color={mutedTextColor} 
                _hover={{ color: "brand.500", transform: "translateY(-2px)" }}
                transition="all 0.2s"
              >
                <Icon as={IconComp} fontSize="24px" />
              </Link>
            );
          })}
          
          {whatsapp_public && whatsapp_number && (
            <Link
              href={`https://wa.me/${whatsapp_number.replace(/\D/g, "")}`}
              isExternal
              color="green.400"
              _hover={{ color: "green.500", transform: "translateY(-2px)" }}
              transition="all 0.2s"
            >
              <Icon as={WhatsappLogo} fontSize="24px" />
            </Link>
          )}
        </HStack>

        {siteSettings && (
          <SocialShare 
            url={typeof window !== 'undefined' ? window.location.href : ''} 
            title={`Confira o portfólio de ${name}`} 
            activeNetworks={siteSettings.social_networks} 
          />
        )}
      </Stack>
    </Box>
  );
}
