import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchContactSettings, type ContactSettings, DEFAULT_CONTACT_SETTINGS } from "@/lib/supabase";

interface ContactSettingsContextValue {
  settings: ContactSettings;
  loading: boolean;
  refresh: () => Promise<void>;
}

const ContactSettingsContext = createContext<ContactSettingsContextValue>({
  settings: DEFAULT_CONTACT_SETTINGS,
  loading: false,
  refresh: async () => {},
});

export function ContactSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ContactSettings>(DEFAULT_CONTACT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await fetchContactSettings();
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
    <ContactSettingsContext.Provider value={{ settings, loading, refresh: load }}>
      {children}
    </ContactSettingsContext.Provider>
  );
}

export function useContactSettings() {
  return useContext(ContactSettingsContext);
}
