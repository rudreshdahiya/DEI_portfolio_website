import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchWorkSettings, type WorkSettings, DEFAULT_WORK_SETTINGS } from "@/lib/supabase";

interface WorkSettingsContextValue {
  settings: WorkSettings;
  loading: boolean;
  refresh: () => Promise<void>;
}

const WorkSettingsContext = createContext<WorkSettingsContextValue>({
  settings: DEFAULT_WORK_SETTINGS,
  loading: false,
  refresh: async () => {},
});

export function WorkSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<WorkSettings>(DEFAULT_WORK_SETTINGS);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await fetchWorkSettings();
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
    <WorkSettingsContext.Provider value={{ settings, loading, refresh: load }}>
      {children}
    </WorkSettingsContext.Provider>
  );
}

export function useWorkSettings() {
  return useContext(WorkSettingsContext);
}
