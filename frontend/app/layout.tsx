import type { Metadata } from "next";
import "./globals.css";
import { HackathonProvider } from "@/components/layout/hackathon-modes";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Daedalus — Career Operating System",
  description: "The intelligent navigation layer for the AI era of work.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className="antialiased selection:bg-[#B0D4E8] selection:text-black">
        <ThemeProvider defaultTheme="light" storageKey="daedalus-theme">
          <TooltipProvider>
            <HackathonProvider>
              {children}
            </HackathonProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
