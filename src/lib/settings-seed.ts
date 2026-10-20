// Starting values for the settings providers, so the first render already shows saved content.
// Build time: filled by entry-server.tsx from Supabase before each page is prerendered.
// Browser: read from window.__SITE_SETTINGS__, which prerender.js embeds in each page.
// Providers still fetch fresh settings after mount, so later admin edits show up too.

export type SettingsKey = "global" | "home" | "bip" | "about" | "services" | "work" | "contact";

declare global {
  interface Window {
    __SITE_SETTINGS__?: Partial<Record<SettingsKey, unknown>>;
  }
}

export const settingsSeed: Partial<Record<SettingsKey, unknown>> =
  (typeof window !== "undefined" && window.__SITE_SETTINGS__) || {};

export function seededSettings<T>(key: SettingsKey, fallback: T): T {
  const value = settingsSeed[key];
  return value ? ({ ...fallback, ...(value as object) } as T) : fallback;
}
