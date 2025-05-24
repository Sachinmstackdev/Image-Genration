import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { ThemeProvider } from "./providers/ThemeProvider";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Eve AI - Create Amazing AI Art",
  description: "Transform your imagination into stunning visuals with cutting-edge AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} font-sans antialiased`}>
                    <ThemeProvider>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
} 