import type { Metadata } from 'next';
import { StoreProvider } from '@/shared/lib/providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'BotVoronka',
  description: 'Telegram Sales Funnel Builder',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}