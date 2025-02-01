import 'styles/global.css';

import { Toaster } from 'sonner';
import { Viewport } from 'next';

export const metadata = {
  title: 'Diário Escolar',
  charset: 'utf-8'
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          <div className="flex-1">{children}</div>
        </div>
        <Toaster richColors />
      </body>
    </html>
  );
}
