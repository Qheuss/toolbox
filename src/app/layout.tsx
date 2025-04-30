import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import '@/styles/globals.scss';
import '@/styles/reset.css';
import SpaceBackground from '@/components/SpaceBackgroundThree';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SpaceBackground starCount={1000} />
        {children}
      </body>
    </html>
  );
}
