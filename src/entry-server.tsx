import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import { AppProviders, AppRoutes } from "./app";
import { settingsSeed, type SettingsKey } from "./lib/settings-seed";
import {
  fetchAboutSettings,
  fetchBipSettings,
  fetchContactSettings,
  fetchGlobalSettings,
  fetchHomeSettings,
  fetchServicesSettings,
  fetchWorkSettings,
} from "./lib/supabase";

// Loads the saved admin settings from Supabase (falling back to defaults) so prerendered
// pages show the same content visitors see.
export async function loadSettings(): Promise<Partial<Record<SettingsKey, unknown>>> {
  const [global, home, bip, about, services, work, contact] = await Promise.all([
    fetchGlobalSettings(),
    fetchHomeSettings(),
    fetchBipSettings(),
    fetchAboutSettings(),
    fetchServicesSettings(),
    fetchWorkSettings(),
    fetchContactSettings(),
  ]);
  const settings = { global, home, bip, about, services, work, contact };
  Object.assign(settingsSeed, settings);
  return settings;
}

// Build-time render of one public page, used by scripts/prerender.js so crawlers
// that don't run JavaScript still get the full page text and structured data.
export function render(url: string) {
  const helmetContext: { helmet?: any } = {};
  const html = renderToString(
    <AppProviders helmetContext={helmetContext}>
      <StaticRouter location={url}>
        <AppRoutes />
      </StaticRouter>
    </AppProviders>,
  );
  return { html, helmet: helmetContext.helmet };
}
