import type { Metadata } from 'next';
import SpaceBackground from '@/components/SpaceBackgroundThree';
import { Space_Grotesk } from 'next/font/google';

import '@/styles/globals.scss';
import '@/styles/reset.css';
import '@/styles/tailwind.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '700'],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: "Qheuss's Toolbox",
  description:
    "Qheuss's Toolbox is a collection of tools and utilities for everyone.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${spaceGrotesk.variable} antialiased`}>
        <SpaceBackground starCount={1250} />
        {children}
      </body>
    </html>
  );
}
