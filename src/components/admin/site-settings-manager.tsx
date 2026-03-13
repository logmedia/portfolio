'use client';

import { useState, useTransition } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  HStack,
  Heading,
  Text,
  useToast,
  Divider,
  SimpleGrid,
  Card,
  CardBody,
  Switch,
  Icon,
} from "@chakra-ui/react";
import { Globe, ShareNetwork, FacebookLogo, InstagramLogo, LinkedinLogo, TwitterLogo, WhatsappLogo, GithubLogo, ChartLineUp, MagnifyingGlassPlus } from "phosphor-react";
import { saveSiteSettings } from "@/app/actions";
import { SiteSettings, SocialNetwork } from "@/types/content";

interface SiteSettingsManagerProps {
  initialSettings: SiteSettings;
}

const SOCIAL_OPTIONS = [
  { id: 'whatsapp', name: 'WhatsApp', icon: WhatsappLogo, color: 'green.500' },
  { id: 'linkedin', name: 'LinkedIn', icon: LinkedinLogo, color: 'blue.600' },
  { id: 'facebook', name: 'Facebook', icon: FacebookLogo, color: 'blue.500' },
  { id: 'twitter', name: 'Twitter (X)', icon: TwitterLogo, color: 'white' },
  { id: 'instagram', name: 'Instagram', icon: InstagramLogo, color: 'pink.500' },
];

export function SiteSettingsManager({ initialSettings }: SiteSettingsManagerProps) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [isPending, startTransition] = useTransition();
  const toast = useToast();

  const handleToggleSocial = (networkId: string) => {
    const updatedNetworks = settings.social_networks.map(sn => 
      sn.id === networkId ? { ...sn, enabled: !sn.enabled } : sn
    );
    setSettings({ ...settings, social_networks: updatedNetworks });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    formData.append('socialNetworks', JSON.stringify(settings.social_networks));
    
    startTransition(async () => {
      const result = await saveSiteSettings(formData);
      if (result.success) {
        toast({
          title: "Configurações salvas!",
          status: "success",
          duration: 3000,
        });
      } else {
        toast({
          title: "Erro ao salvar",
          description: result.message,
          status: "error",
          duration: 5000,
        });
      }
    });
  };

  return (
    <Box as="form" onSubmit={handleSave} w="full">
      <Input type="hidden" name="id" value={settings.id} />
      
      <VStack spacing={8} align="stretch">
        <Box>
          <HStack spacing={2} mb={4}>
            <Icon as={Globe} color="brand.400" weight="fill" boxSize={6} />
            <Heading size="md">SEO Geral do Site</Heading>
          </HStack>
          <Card variant="outline" bg="whiteAlpha.50">
            <CardBody>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel>Nome do Site</FormLabel>
                  <Input 
                    name="siteName" 
                    defaultValue={settings.site_name} 
                    bg="blackAlpha.300"
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Título SEO Padrão</FormLabel>
                  <Input 
                    name="seoTitle" 
                    defaultValue={settings.seo_title || ''} 
                    placeholder="Título que aparece na aba do navegador"
                    bg="blackAlpha.300"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Descrição SEO Padrão</FormLabel>
                  <Textarea 
                    name="seoDescription" 
                    defaultValue={settings.seo_description || ''} 
                    placeholder="Descrição para Google e Redes Sociais"
                    bg="blackAlpha.300"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Keywords (separadas por vírgula)</FormLabel>
                  <Input 
                    name="seoKeywords" 
                    defaultValue={settings.seo_keywords?.join(', ') || ''} 
                    placeholder="ex: portfólio, desenvolvedor, criativo"
                    bg="blackAlpha.300"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>URL da Imagem Compartilhável (OG Image)</FormLabel>
                  <Input 
                    name="ogImageUrl" 
                    defaultValue={settings.og_image_url || ''} 
                    placeholder="URL de uma imagem para quando o link do site for compartilhado"
                    bg="blackAlpha.300"
                  />
                </FormControl>
              </VStack>
            </CardBody>
          </Card>
        </Box>

        <Divider borderColor="whiteAlpha.200" />

        <Box>
          <HStack spacing={2} mb={4}>
            <Icon as={ChartLineUp} color="brand.400" weight="fill" boxSize={6} />
            <Heading size="md">Analytics & Webmaster</Heading>
          </HStack>
          <Card variant="outline" bg="whiteAlpha.50">
            <CardBody>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Google Analytics Measurement ID (GA4)</FormLabel>
                  <Input 
                    name="googleAnalyticsId" 
                    defaultValue={settings.google_analytics_id || ''} 
                    placeholder="ex: G-XXXXXXXXXX"
                    bg="blackAlpha.300"
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Google Search Console Verification Code</FormLabel>
                  <Input 
                    name="googleSearchConsoleId" 
                    defaultValue={settings.google_search_console_id || ''} 
                    placeholder="Código de verificação meta tag"
                    bg="blackAlpha.300"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Meta Pixel ID (Facebook/Instagram)</FormLabel>
                  <Input 
                    name="metaPixelId" 
                    defaultValue={settings.meta_pixel_id || ''} 
                    placeholder="ex: 123456789012345 (Apenas números)"
                    bg="blackAlpha.300"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>LinkedIn Insight Tag Partner ID</FormLabel>
                  <Input 
                    name="linkedinInsightTagId" 
                    defaultValue={settings.linkedin_insight_tag_id || ''} 
                    placeholder="ex: 1234567 (Apenas números)"
                    bg="blackAlpha.300"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Microsoft Clarity Project ID</FormLabel>
                  <Input 
                    name="clarityId" 
                    defaultValue={settings.clarity_id || ''} 
                    placeholder="ex: abcdefghij"
                    bg="blackAlpha.300"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Google Tag Manager ID (GTM)</FormLabel>
                  <Input 
                    name="googleTagManagerId" 
                    defaultValue={settings.google_tag_manager_id || ''} 
                    placeholder="ex: GTM-XXXXXXX"
                    bg="blackAlpha.300"
                  />
                </FormControl>
              </VStack>
            </CardBody>
          </Card>
        </Box>

        <Divider borderColor="whiteAlpha.200" />

        <Box>
          <HStack spacing={2} mb={4}>
            <Icon as={ShareNetwork} color="brand.400" weight="fill" boxSize={6} />
            <Heading size="md">Redes de Compartilhamento Social</Heading>
          </HStack>
          <Text fontSize="sm" color="whiteAlpha.600" mb={4}>
            Ative ou desative quais botões de compartilhamento aparecerão nas páginas de projetos e perfis.
          </Text>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
            {SOCIAL_OPTIONS.map((option) => {
              const config = settings.social_networks.find(sn => sn.id === option.id);
              const isEnabled = config?.enabled ?? false;
              
              return (
                <Card key={option.id} variant="outline" bg={isEnabled ? "whiteAlpha.200" : "blackAlpha.200"}>
                  <CardBody p={4}>
                    <HStack justify="space-between" w="full">
                      <HStack spacing={3}>
                        <Icon as={option.icon} color={option.color} boxSize={5} />
                        <Text fontWeight="semibold">{option.name}</Text>
                      </HStack>
                      <Switch 
                        colorScheme="brand" 
                        isChecked={isEnabled} 
                        onChange={() => handleToggleSocial(option.id)}
                      />
                    </HStack>
                  </CardBody>
                </Card>
              );
            })}
          </SimpleGrid>
        </Box>

        <Box pt={4}>
          <Button 
            type="submit" 
            colorScheme="brand" 
            size="lg" 
            w={{ base: "full", md: "auto" }}
            isLoading={isPending}
            loadingText="Salvando..."
          >
            Salvar Configurações
          </Button>
        </Box>
      </VStack>
    </Box>
  );
}
