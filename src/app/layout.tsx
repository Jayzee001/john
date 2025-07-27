import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutShell from "@/components/LayoutShell";

import { Toaster } from 'sonner';

const geist = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'John Store - Your Premium Shopping Destination',
  description: 'Discover amazing products at great prices. Shop the latest trends in electronics, fashion, home & garden, and more.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

    <html lang="en" className={`${geist.className} ${geistMono.className}`}>
      <body className="flex flex-col min-h-screen">
        <LayoutShell>{children}</LayoutShell>
        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={4000}
        />
      </body>
    </html>
  );
}
