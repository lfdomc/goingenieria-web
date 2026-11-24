import raw from "@/content/site.json";

export const site = raw;
export type Site = typeof raw;
export type Section = Site["sections"][number];
export type Service = Site["services"][number];
export type ThemeMode = "dark" | "light";

export const absoluteUrl = (path = "/") => new URL(path, site.brand.domain).toString();

/** Enlace wa.me con mensaje codificado. */
export function waLink(message?: string, number = site.contact.whatsapp) {
  const text = encodeURIComponent(message ?? site.contact.whatsappDefaultMessage);
  return `https://wa.me/${number}?text=${text}`;
}

/** Variables CSS derivadas de design.theme: cambiar el JSON cambia el diseño. */
export function themeVars(): Record<string, string> {
  const { theme, dials, mode } = site.design;
  const c = theme.colors[(mode as ThemeMode) ?? "dark"];
  const density = Math.min(10, Math.max(1, dials.density));
  const motion = Math.min(10, Math.max(0, dials.motion));
  return {
    "--c-bg": c.bg,
    "--c-surface": c.surface,
    "--c-surface-2": c.surface2,
    "--c-ink": c.ink,
    "--c-ink-muted": c.inkMuted,
    "--c-accent": c.accent,
    "--c-accent-ink": c.accentInk,
    "--c-border": c.border,
    "--c-blueprint": c.blueprint,
    "--c-water": c.water,
    "--f-display": `"${theme.fonts.display}", system-ui, sans-serif`,
    "--f-body": `"${theme.fonts.body}", system-ui, sans-serif`,
    "--radius": theme.radius,
    "--max-w": theme.maxWidth,
    // density 1 → mucho aire; 10 → compacto
    "--space-section": `${Math.round(176 - density * 11)}px`,
    // motion 0 → sin animación; 10 → máximo
    "--motion-scale": String(motion / 10),
  };
}

export const servicesBy = (discipline: string) => site.services.filter((s) => s.discipline === discipline);

export const fmt = (n: number) => Math.round(n).toLocaleString("es-CR");
