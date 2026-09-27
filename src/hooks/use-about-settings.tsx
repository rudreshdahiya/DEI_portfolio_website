import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchAboutSettings, type AboutSettings, DEFAULT_ABOUT_SETTINGS } from "@/lib/supabase";

interface AboutSettingsContextValue {
  settings: AboutSettings;
  loading: boolean;
}

const AboutSettingsContext = createContext<AboutSettingsContextValue>({
  settings: DEFAULT_ABOUT_SETTINGS,
  loading: false,
});

export function AboutSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AboutSettings>(DEFAULT_ABOUT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutSettings()
      .then(setSettings)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AboutSettingsContext.Provider value={{ settings, loading }}>
      {children}
    </AboutSettingsContext.Provider>
  );
}

export function useAboutSettings() {
  return useContext(AboutSettingsContext);
}
