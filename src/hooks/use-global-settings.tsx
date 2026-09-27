import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchGlobalSettings, type GlobalSettings, DEFAULT_GLOBAL_SETTINGS } from "@/lib/supabase";

interface GlobalSettingsContextValue {
  settings: GlobalSettings;
  loading: boolean;
  refresh: () => Promise<void>;
}

const GlobalSettingsContext = createContext<GlobalSettingsContextValue>({
  settings: DEFAULT_GLOBAL_SETTINGS,
  loading: false,
  refresh: async () => {},
});

export function GlobalSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<GlobalSettings>(DEFAULT_GLOBAL_SETTINGS);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchGlobalSettings();
      setSettings(data);
    } catch {
      // fall back to defaults silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <GlobalSettingsContext.Provider value={{ settings, loading, refresh: load }}>
      {children}
    </GlobalSettingsContext.Provider>
  );
}

export function useGlobalSettings() {
  return useContext(GlobalSettingsContext);
}
