import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sylorlabs - Professional VST3 Audio Tools",
  description: "Sylorlabs is a company dedicated to creating innovative VST3 products for music producers and audio professionals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
