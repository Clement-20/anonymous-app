import type { Metadata } from "next";
import { Inter } from "next/font/google"; // <--- We use this safe font instead
import "./globals.css";
import SplashScreen from "@/components/ui/SplashScreen";

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
            <html lang="en">
                  <body className={inter.className}>
                        <SplashScreen />
                        {children}
                  </body>
            </html>
      );
}
