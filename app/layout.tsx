import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/lib/userContext";
import ClientShell from "@/components/ClientShell";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "PlannerHub — AI Planner & Health SaaS",
  description:
    "Your all-in-one AI-powered health, fitness, pregnancy, business, and nutrition planning platform.",
  keywords: "AI planner, health tracker, fitness planner, nutrition scanner, pregnancy tracker",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Sora:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="bg-mesh" />
        <UserProvider>
          <ClientShell>{children}</ClientShell>
        </UserProvider>
      </body>
    </html>
  );
}
