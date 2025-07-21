import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { ClientMSWLoader } from './client-msw-loader'; 
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MonitoCorp Dashboard',
  description: 'Live service monitoring dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ClientMSWLoader /> 
          {children}
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        </Providers>
      </body>
    </html>
  );
}
