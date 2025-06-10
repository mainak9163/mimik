import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Footer from "@/components/footer";
import IceCreamCursor from "@/components/ice-cream-cursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Astrapuffs | Intelligent characters",
  description:
    "Astrapuffs is a Agentic NPC multiplayer cozy simulator. Offering unique experiences that only NPCs infused with agentic AI can",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-screen overflow-x-hidden`}
      >
        {children}
        <Toaster richColors />
        <Footer />
        <IceCreamCursor/>
      </body>
    </html>
  );
}
