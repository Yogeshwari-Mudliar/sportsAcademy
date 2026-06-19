// src/theme/index.ts
// Single source of truth for the webapp's themeable base color.
// The whole dark dashboard palette is derived from one base color so the
// user can pick any color in Settings and have it applied consistently.

export const DEFAULT_BASE_COLOR = "#012551";
export const THEME_STORAGE_KEY = "themeBaseColor";

export const THEME_PRESETS: { name: string; color: string }[] = [
  { name: "Navy (Default)", color: "#012551" },
  { name: "Midnight", color: "#0b1020" },
  { name: "Forest", color: "#06281f" },
  { name: "Plum", color: "#2a0f3d" },
  { name: "Maroon", color: "#3a0d18" },
  { name: "Slate", color: "#1c2530" },
  { name: "Teal", color: "#04313a" },
];

function clamp(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const num = parseInt(h, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((v) => clamp(v).toString(16).padStart(2, "0"))
      .join("")
  );
}

function mix(hex: string, target: [number, number, number], weight: number): string {
  const [r, g, b] = hexToRgb(hex);
  const [tr, tg, tb] = target;
  return rgbToHex(
    r * (1 - weight) + tr * weight,
    g * (1 - weight) + tg * weight,
    b * (1 - weight) + tb * weight
  );
}

const BLACK: [number, number, number] = [0, 0, 0];
const WHITE: [number, number, number] = [255, 255, 255];

const darken = (hex: string, w: number) => mix(hex, BLACK, w);
const lighten = (hex: string, w: number) => mix(hex, WHITE, w);

export function isValidHexColor(value: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.trim());
}

export interface ThemePalette {
  app: string;
  nav: string;
  panel: string;
  card: string;
  input: string;
}

export function buildPalette(base: string): ThemePalette {
  return {
    app: base,
    nav: darken(base, 0.3),
    panel: lighten(base, 0.08),
    card: lighten(base, 0.08),
    input: darken(base, 0.15),
  };
}

export function applyThemeColor(base: string): void {
  const color = isValidHexColor(base) ? base : DEFAULT_BASE_COLOR;
  const palette = buildPalette(color);
  const root = document.documentElement;
  root.style.setProperty("--bg-app", palette.app);
  root.style.setProperty("--bg-nav", palette.nav);
  root.style.setProperty("--bg-panel", palette.panel);
  root.style.setProperty("--bg-card", palette.card);
  root.style.setProperty("--bg-input", palette.input);
}

export function getStoredThemeColor(): string {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && isValidHexColor(stored)) return stored;
  } catch {
    /* ignore */
  }
  return DEFAULT_BASE_COLOR;
}

export function storeThemeColor(base: string): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, base);
  } catch {
    /* ignore */
  }
}
