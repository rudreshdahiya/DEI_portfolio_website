import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchContactSettings, type ContactSettings, DEFAULT_CONTACT_SETTINGS } from "@/lib/supabase";

interface ContactSettingsContextValue {
  settings: ContactSettings;
  loading: boolean;
}

const ContactSettingsContext = createContext<ContactSettingsContextValue>({
  settings: DEFAULT_CONTACT_SETTINGS,
  loading: false,
});

export function ContactSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ContactSettings>(DEFAULT_CONTACT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContactSettings()
      .then(setSettings)
      .finally(() => setLoading(false));
  }, []);

  return (
    <ContactSettingsContext.Provider value={{ settings, loading }}>
      {children}
    </ContactSettingsContext.Provider>
  );
}

export function useContactSettings() {
  return useContext(ContactSettingsContext);
}
