import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SplashScreen from "@/components/ui/SplashScreen";
import { ThemeProvider } from "@/lib/ThemeContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
      title: "Ghost Note",
      description: "Anonymous Messaging App",
};

export default function RootLayout({
      children,
}: Readonly<{
      children: React.ReactNode;
}>) {
      return (
            <html lang="en" className="light">
                  <body className={inter.className}>
                        <ThemeProvider>
                              <SplashScreen />
                              {children}
                        </ThemeProvider>
                  </body>
            </html>
      );
}
