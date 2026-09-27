import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchServicesSettings, type ServicesSettings, DEFAULT_SERVICES_SETTINGS } from "@/lib/supabase";

interface ServicesSettingsContextValue {
  settings: ServicesSettings;
  loading: boolean;
}

const ServicesSettingsContext = createContext<ServicesSettingsContextValue>({
  settings: DEFAULT_SERVICES_SETTINGS,
  loading: false,
});

export function ServicesSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ServicesSettings>(DEFAULT_SERVICES_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServicesSettings()
      .then(setSettings)
      .finally(() => setLoading(false));
  }, []);

  return (
    <ServicesSettingsContext.Provider value={{ settings, loading }}>
      {children}
    </ServicesSettingsContext.Provider>
  );
}

export function useServicesSettings() {
  return useContext(ServicesSettingsContext);
}
