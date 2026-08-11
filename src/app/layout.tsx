import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'BlitzDeals.de - Die besten Amazon Deals & Preisfehler in Echtzeit',
    template: '%s | BlitzDeals.de'
  },
  description:
    'Finde täglich die besten Schnäppchen, Rabatte bis zu 80% und Preisfehler auf Amazon. Vollautomatisch geprüft und in Echtzeit aktualisiert.',
  keywords: [
    'Amazon Deals',
    'Schnäppchen',
    'Preisfehler',
    'Loot',
    'Rabattcode',
    'Gutscheine',
    'Blitzangebote',
    'Bestpreis',
    'Deals Deutschland'
  ],
  authors: [{ name: 'BlitzDeals' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://blitzdeals.de'),
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png'
  },
  openGraph: {
    title: 'BlitzDeals.de - Die besten Amazon Deals in Echtzeit',
    description:
      'Täglich die besten Rabatte, Sonderangebote und Preisfehler auf Amazon. 100% kostenlos und handverlesen.',
    siteName: 'BlitzDeals.de',
    locale: 'de_DE',
    type: 'website',
    images: [
      {
        url: '/banner.png',
        width: 1200,
        height: 630,
        alt: 'BlitzDeals.de Banner'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BlitzDeals.de - Die besten Amazon Deals in Echtzeit',
    description: 'Täglich die heißesten Amazon Rabatte & Preisfehler.',
    images: ['/banner.png']
  },
  verification: {
    google: 'google4fdfab1ab320b437'
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="dark">
      <body className="min-h-screen flex flex-col bg-[#030712] text-slate-100 antialiased selection:bg-amber-500/30 selection:text-amber-200">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
