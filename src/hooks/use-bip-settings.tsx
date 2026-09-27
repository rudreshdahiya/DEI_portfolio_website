import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchBipSettings, type BipSettings, DEFAULT_BIP_SETTINGS } from "@/lib/supabase";

interface BipSettingsContextValue {
  settings: BipSettings;
  loading: boolean;
}

const BipSettingsContext = createContext<BipSettingsContextValue>({
  settings: DEFAULT_BIP_SETTINGS,
  loading: false,
});

export function BipSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<BipSettings>(DEFAULT_BIP_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBipSettings()
      .then(setSettings)
      .finally(() => setLoading(false));
  }, []);

  return (
    <BipSettingsContext.Provider value={{ settings, loading }}>
      {children}
    </BipSettingsContext.Provider>
  );
}

export function useBipSettings() {
  return useContext(BipSettingsContext);
}
