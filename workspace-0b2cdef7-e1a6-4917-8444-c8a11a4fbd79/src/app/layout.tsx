import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Taikai Network Clone - Web3 Hackathon Platform",
  description: "A comprehensive Web3 hackathon platform with role-based dashboards and project management.",
  keywords: ["Taikai", "Web3", "Hackathon", "Blockchain", "Next.js", "TypeScript"],
  authors: [{ name: "Development Team" }],
  openGraph: {
    title: "Taikai Network Clone",
    description: "Web3 hackathon platform with role-based access control",
    url: "https://localhost:3000",
    siteName: "Taikai Clone",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Taikai Network Clone",
    description: "Web3 hackathon platform with role-based access control",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
