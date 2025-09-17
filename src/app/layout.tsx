

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/globals/Header";
import Footer from "@/components/globals/Footer";
import { ConvexClientProvider } from "@/components/providers/ConvexProvider";
import ChatWidget from "@/components/globals/ChatWidget";
import TutorChatWidget from "@/components/globals/TutorChatWidget";
import WidgetLayout from "@/components/globals/WidgetLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "A-Hunter",
  description: "Find Trusted Workers. Get Jobs Done",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConvexClientProvider>
          <Header/>
          {children}
          <WidgetLayout/>
          <Footer/>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
