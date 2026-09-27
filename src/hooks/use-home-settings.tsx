import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchHomeSettings, type HomeSettings, DEFAULT_HOME_SETTINGS } from "@/lib/supabase";

interface HomeSettingsContextValue {
  settings: HomeSettings;
  loading: boolean;
  refresh: () => Promise<void>;
}

const HomeSettingsContext = createContext<HomeSettingsContextValue>({
  settings: DEFAULT_HOME_SETTINGS,
  loading: false,
  refresh: async () => {},
});

export function HomeSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<HomeSettings>(DEFAULT_HOME_SETTINGS);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await fetchHomeSettings();
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
    <HomeSettingsContext.Provider value={{ settings, loading, refresh: load }}>
      {children}
    </HomeSettingsContext.Provider>
  );
}

export function useHomeSettings() {
  return useContext(HomeSettingsContext);
}
