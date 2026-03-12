-- Adiciona campos de WhatsApp e privacidade à tabela de perfis
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS whatsapp_number TEXT,
ADD COLUMN IF NOT EXISTS whatsapp_public BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN public.profiles.whatsapp_number IS 'Número de WhatsApp para contato direto';
COMMENT ON COLUMN public.profiles.whatsapp_public IS 'Define se o WhatsApp deve ser exibido publicamente no portfólio';
