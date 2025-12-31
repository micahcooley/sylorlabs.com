import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "Sylorlabs - Professional Audio Tools & Music Production Software",
  description: "Sylorlabs delivers professional-grade audio tools, VST3 plugins, DAW software, and sample packs for musicians, producers, and audio engineers. Create exceptional sound with our innovative audio production tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
