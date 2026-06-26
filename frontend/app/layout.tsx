import type { Metadata } from "next";
import "./globals.css";
import { HackathonProvider } from "@/components/layout/hackathon-modes";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "Daedalus — Career Operating System",
  description: "The intelligent navigation layer for the AI era of work.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased selection:bg-primary selection:text-primary-foreground transition-colors duration-300">
        <ThemeProvider defaultTheme="dark" storageKey="daedalus-theme">
          <TooltipProvider>
            <HackathonProvider>
              {/* Background orbs — react to theme via CSS vars */}
              <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
                <div className="opacity-20 absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse transition-all duration-1000" />
                <div className="opacity-20 absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-primary/15 rounded-full blur-[120px] transition-all duration-1000" />
              </div>
              {children}
            </HackathonProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
