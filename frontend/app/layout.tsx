import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daedalus — Navigate Your AI-Era Career",
  description: "Stop asking what job AI will take. Start discovering what future you can build.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="bg-scene">
          <div className="bg-orb w-[600px] h-[600px] bg-blue-200/40 top-[-100px] left-[-200px]" style={{ animationDelay: "0s" }} />
          <div className="bg-orb w-[400px] h-[400px] bg-indigo-200/30 top-[20%] right-[-100px]" style={{ animationDelay: "3s", animationDuration: "10s" }} />
          <div className="bg-orb w-[500px] h-[500px] bg-blue-100/50 bottom-[-100px] left-[30%]" style={{ animationDelay: "1.5s", animationDuration: "12s" }} />
        </div>
        {children}
      </body>
    </html>
  );
}
