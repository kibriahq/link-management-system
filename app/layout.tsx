import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LinkProvider } from "@/lib/LinkContext";
import { SidebarProvider } from "@/lib/SidebarContext";
import { AuthProvider } from "@/lib/AuthContext";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import Children from "@/components/Children";
import { SpeedInsights } from "@vercel/speed-insights/next"
import InfoProvider from "@/lib/InfoContext";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "LinkEngine - Enterprise URL Management",
  description: "Manage your enterprise URLs with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <SpeedInsights />
        <InfoProvider>
          <AuthProvider>
            <LinkProvider>
              <Children>{children}</Children>
            </LinkProvider>
          </AuthProvider>
        </InfoProvider>
      </body>
    </html>
  );
}