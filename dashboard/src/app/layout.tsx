import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { ThemeProvider } from '@/components/shared/theme-provider';
import AuthWrapper from '@/components/auth/wrapper';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: '400',
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${poppins.className} overflow-x-hidden`}>
        <AuthWrapper>
          <ThemeProvider attribute="class" defaultTheme="system">
            <main>
              {children}
            </main>
          </ThemeProvider>
        </AuthWrapper>
      </body>
    </html>
  );
}
