import "./globals.css";
// This path looks specifically in the same folder
import { ThemeProvider } from "./theme-provider"; 

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
    <html lang="en" suppressHydrationWarning>
      <body className="bg-black text-white antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}