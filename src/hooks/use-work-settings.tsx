import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchWorkSettings, type WorkSettings, DEFAULT_WORK_SETTINGS } from "@/lib/supabase";

interface WorkSettingsContextValue {
  settings: WorkSettings;
  loading: boolean;
}

const WorkSettingsContext = createContext<WorkSettingsContextValue>({
  settings: DEFAULT_WORK_SETTINGS,
  loading: false,
});

export function WorkSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<WorkSettings>(DEFAULT_WORK_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkSettings()
      .then(setSettings)
      .finally(() => setLoading(false));
  }, []);

  return (
    <WorkSettingsContext.Provider value={{ settings, loading }}>
      {children}
    </WorkSettingsContext.Provider>
  );
}

export function useWorkSettings() {
  return useContext(WorkSettingsContext);
}
