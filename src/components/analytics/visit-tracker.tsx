'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { logVisit } from '@/app/actions';

export function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const handleLog = async () => {
      // Pequeno delay para garantir que métricas do client estejam prontas se necessário
      // e para não competir com recursos críticos de carregamento
      setTimeout(async () => {
        const ua = window.navigator.userAgent;
        const deviceType = /Mobile|Android|iPhone|iPad/i.test(ua) ? 'mobile' : 'desktop';
        
        // Hash simples para o IP (não coletamos o IP real para privacidade, apenas um identificador anônimo)
        // Em um app real, o IP viria do header do servidor, mas aqui simulamos via client fingerprint básico
        const fingerprint = `${ua}-${window.screen.width}x${window.screen.height}`;
        const ipHash = btoa(fingerprint).slice(0, 32);

        await logVisit({
          path: pathname,
          referer: document.referrer || undefined,
          browser: getBrowser(ua),
          os: getOS(ua),
          deviceType,
          ipHash
        });
      }, 1000);
    };

    handleLog();
  }, [pathname]);

  return null;
}

function getBrowser(ua: string) {
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Edge')) return 'Edge';
  return 'Other';
}

function getOS(ua: string) {
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac')) return 'MacOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  return 'Other';
}
