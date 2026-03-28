import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata = {
  title: "Ghost Note",
  description: "Anonymous messaging for the shadows.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning is REQUIRED here so Next.js doesn't panic 
    // when the server's HTML doesn't perfectly match the browser's Dark Mode HTML
    <html lang="en" suppressHydrationWarning>
      <body className="bg-black text-white antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}