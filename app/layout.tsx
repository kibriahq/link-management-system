import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LinkProvider } from "@/lib/LinkContext";
import { SidebarProvider } from "@/lib/SidebarContext";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
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
        <LinkProvider>
          <SidebarProvider>
            <Sidebar />
            <TopNav />
            <main className="lg:ml-[240px] pt-16 min-h-screen bg-[#f8f9ff]">
              <div className="max-w-[1440px] mx-auto p-4 lg:p-8">
                {children}
              </div>
            </main>
          </SidebarProvider>
        </LinkProvider>
      </body>
    </html>
  );
}