// Generate random HSL colors that work well together
export function generateColorTheme() {
  // Random base hue (0-360)
  const baseHue = Math.floor(Math.random() * 360);

  // Create complementary hues for variety
  const primaryHue = baseHue;
  const secondaryHue = (baseHue + 30) % 360; // Analogous color
  const accentHue = (baseHue + 180) % 360; // Complementary color

  // Use high saturation and good brightness for vibrant colors
  const saturation = 70 + Math.floor(Math.random() * 20); // 70-90%
  const lightness = 55 + Math.floor(Math.random() * 10); // 55-65%

  return {
    primary: `hsl(${primaryHue}, ${saturation}%, ${lightness}%)`,
    secondary: `hsl(${secondaryHue}, ${saturation}%, ${lightness + 5}%)`,
    accentGreen: `hsl(${accentHue}, 65%, 55%)`,
    accentOrange: `hsl(${(baseHue + 60) % 360}, 75%, 60%)`,

    // Convert to hex for better compatibility
    primaryHex: hslToHex(primaryHue, saturation, lightness),
    secondaryHex: hslToHex(secondaryHue, saturation, lightness + 5),
  };
}

// Convert HSL to Hex
function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Apply theme colors to CSS variables
export function applyTheme(theme: ReturnType<typeof generateColorTheme>) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  root.style.setProperty("--primary-color", theme.primary);
  root.style.setProperty("--secondary-color", theme.secondary);
  root.style.setProperty("--accent-green", theme.accentGreen);
  root.style.setProperty("--accent-orange", theme.accentOrange);
}
