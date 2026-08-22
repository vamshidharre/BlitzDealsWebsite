import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'BlitzDeals.de — Amazon Deals & Preisfehler',
    template: '%s | BlitzDeals.de'
  },
  description:
    'Geprüfte Amazon Schnäppchen, Rabatte bis zu 70% und Preisfehler in Echtzeit.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://blitzdeals.de'),
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png'
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
    <html lang="de" className={plusJakarta.variable}>
      <body className="min-h-screen flex flex-col bg-[#fafafa] text-zinc-900 antialiased font-sans selection:bg-zinc-900 selection:text-white">
        <Header />
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
