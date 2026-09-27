import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchAboutSettings, type AboutSettings, DEFAULT_ABOUT_SETTINGS } from "@/lib/supabase";

interface AboutSettingsContextValue {
  settings: AboutSettings;
  loading: boolean;
  refresh: () => Promise<void>;
}

const AboutSettingsContext = createContext<AboutSettingsContextValue>({
  settings: DEFAULT_ABOUT_SETTINGS,
  loading: false,
  refresh: async () => {},
});

export function AboutSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AboutSettings>(DEFAULT_ABOUT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await fetchAboutSettings();
      setSettings(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const handleUpdate = () => load();
    window.addEventListener("dei-settings-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("dei-settings-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return (
    <AboutSettingsContext.Provider value={{ settings, loading, refresh: load }}>
      {children}
    </AboutSettingsContext.Provider>
  );
}

export function useAboutSettings() {
  return useContext(AboutSettingsContext);
}
