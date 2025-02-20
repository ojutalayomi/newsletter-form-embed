import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Telex Newsletter Form",
  description: "Subscribe to the Telex Newsletter for the latest updates and news.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`h-full ${inter.className}`}>
        <ThemeProvider defaultTheme="system" storageKey="newsletter-ui-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
