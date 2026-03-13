import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { GlobalFooter } from "@/components/GlobalFooter";
import { fetchSiteSettings } from "@/lib/supabase/queries";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { TrackingScripts } from "@/components/analytics/tracking-scripts";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "José Renato • Portfolio",
  description:
    "Portfólio interativo com estudos de caso, blog técnico e área administrativa com Supabase.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSettings = await fetchSiteSettings();

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased`}
        suppressHydrationWarning
      >
        <Suspense fallback={null}>
          {siteSettings?.google_analytics_id && (
            <GoogleAnalytics gaId={siteSettings.google_analytics_id} />
          )}
          <TrackingScripts settings={siteSettings} />
        </Suspense>
        <Providers>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <main style={{ flex: 1 }}>
              {children}
            </main>
            <GlobalFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
