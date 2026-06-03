import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'Voidpet Dungeon Build Optimizer',
  description: 'Find the best gear loadouts for your Voidpet Dungeon pets. Math-backed + community-verified builds.',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'VoidOptimizer' },
  openGraph: { title:'Voidpet Dungeon Build Optimizer', type:'website' },
};

export const viewport: Viewport = {
  width: 'device-width', initialScale: 1, maximumScale: 1,
  userScalable: false, themeColor: '#9333ea',
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body style={{ fontFamily: 'Exo 2, system-ui, sans-serif' }}>
        <div className="flex flex-col min-h-dvh">
          <main className="flex-1 pb-20">{children}</main>
          <Navigation />
        </div>
      </body>
    </html>
  );
}
