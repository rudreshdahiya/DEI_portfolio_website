import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchBipSettings, type BipSettings, DEFAULT_BIP_SETTINGS } from "@/lib/supabase";
import { seededSettings } from "@/lib/settings-seed";

interface BipSettingsContextValue {
  settings: BipSettings;
  loading: boolean;
  refresh: () => Promise<void>;
}

const BipSettingsContext = createContext<BipSettingsContextValue>({
  settings: DEFAULT_BIP_SETTINGS,
  loading: false,
  refresh: async () => {},
});

export function BipSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<BipSettings>(() => seededSettings("bip", DEFAULT_BIP_SETTINGS));
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await fetchBipSettings();
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
    return () => {
      window.removeEventListener("dei-settings-updated", handleUpdate);
    };
  }, []);

  return (
    <BipSettingsContext.Provider value={{ settings, loading, refresh: load }}>
      {children}
    </BipSettingsContext.Provider>
  );
}

export function useBipSettings() {
  return useContext(BipSettingsContext);
}
