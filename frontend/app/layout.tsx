import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Community Pulse",
  description: "Hackathon project",
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
        <ThemeProvider defaultTheme="system" storageKey="community-pulse-theme">
          <header className="w-full p-4 border-b">
            <div className="container flex justify-between items-center">
              <Link href="/" className="text-xl font-semibold">
                Community Pulse
              </Link>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <div className="space-x-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-brand-green text-white rounded-md hover:bg-opacity-90 transition-all"
                  >
                    Register
                  </Link>
                </div>
              </div>
            </div>
          </header>
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
