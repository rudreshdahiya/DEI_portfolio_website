import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchHomeSettings, type HomeSettings, DEFAULT_HOME_SETTINGS } from "@/lib/supabase";

interface HomeSettingsContextValue {
  settings: HomeSettings;
  loading: boolean;
}

const HomeSettingsContext = createContext<HomeSettingsContextValue>({
  settings: DEFAULT_HOME_SETTINGS,
  loading: false,
});

export function HomeSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<HomeSettings>(DEFAULT_HOME_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeSettings()
      .then(setSettings)
      .finally(() => setLoading(false));
  }, []);

  return (
    <HomeSettingsContext.Provider value={{ settings, loading }}>
      {children}
    </HomeSettingsContext.Provider>
  );
}

export function useHomeSettings() {
  return useContext(HomeSettingsContext);
}
