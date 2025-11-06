"use client";

import { useEffect } from "react";
import { generateColorTheme, applyTheme } from "@/lib/colorTheme";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Generate and apply a random theme on mount
    const theme = generateColorTheme();
    applyTheme(theme);

    // Optional: Log the theme for debugging
    console.log("🎨 Random theme applied:", theme);
  }, []);

  return <>{children}</>;
}
