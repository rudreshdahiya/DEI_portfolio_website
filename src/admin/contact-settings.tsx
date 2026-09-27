import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { ChevronLeft, Save, Check, AlertCircle, Loader2 } from "lucide-react";
import {
  fetchContactSettings, saveContactSettings,
  type ContactSettings,
  DEFAULT_CONTACT_SETTINGS,
} from "@/lib/supabase";

function SaveBar({ onSave, status }: { onSave: () => void; status: "idle" | "saving" | "saved" | "error" }) {
  return (
    <div className="sticky bottom-0 z-10 flex items-center justify-between gap-4 px-6 py-4 border-t border-[#E4DEE6]" style={{ background: "rgba(246,244,247,0.95)", backdropFilter: "blur(8px)" }}>
      <div className="flex items-center gap-2 text-sm">
        {status === "saving" && <span className="flex items-center gap-1.5 text-[#504852]"><Loader2 className="w-4 h-4 animate-spin" />Saving…</span>}
        {status === "saved" && <span className="flex items-center gap-1.5 text-green-700"><Check className="w-4 h-4" />Saved! Changes are live.</span>}
        {status === "error" && <span className="flex items-center gap-1.5 text-red-600"><AlertCircle className="w-4 h-4" />Error — please try again.</span>}
      </div>
      <button onClick={onSave} disabled={status === "saving"} className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-60 hover:opacity-90 active:scale-[0.98]" style={{ background: "linear-gradient(135deg,#B84472,#5C2A57)" }}>
        {status === "saving" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Changes
      </button>
    </div>
  );
}

export default function AdminContactSettings() {
  const [settings, setSettings] = useState<ContactSettings>(DEFAULT_CONTACT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    fetchContactSettings().then(data => { setSettings(data); setLoading(false); });
  }, []);

  const update = useCallback(<K extends keyof ContactSettings>(key: K, value: ContactSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaveStatus("idle");
  }, []);

  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      await saveContactSettings(settings);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch {
      setSaveStatus("error");
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-[#5C2A57]" /></div>;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-6 md:px-10 py-6 border-b border-[#E4DEE6] bg-white flex items-center gap-4">
        <Link to="/admin/dashboard" className="p-2 rounded-lg hover:bg-[#F6F4F7] text-[#504852] hover:text-[#1E1A24] transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[#1E1A24]" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>Contact Page</h1>
          <p className="text-sm text-[#504852]">Header text, contact email, & response expectation note</p>
        </div>
      </div>

      <div className="flex-1 px-6 md:px-10 py-8 space-y-6 max-w-3xl">
        <div className="bg-white border border-[#E4DEE6] rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-[#1E1A24]">Page Title & Subtitle</h2>
          <div>
            <label className="text-sm font-medium text-[#1E1A24] block mb-1">Page Heading</label>
            <input value={settings.hero_title} onChange={e => update("hero_title", e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DEE6] text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-[#1E1A24] block mb-1">Intro Subtitle</label>
            <textarea value={settings.hero_subtitle} onChange={e => update("hero_subtitle", e.target.value)} rows={2} className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DEE6] text-sm resize-none" />
          </div>
        </div>

        <div className="bg-white border border-[#E4DEE6] rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-[#1E1A24]">Contact Email & Notes</h2>
          <div>
            <label className="text-sm font-medium text-[#1E1A24] block mb-1">Recipient / Contact Email</label>
            <input value={settings.recipient_email} onChange={e => update("recipient_email", e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DEE6] text-sm font-mono" />
          </div>
          <div>
            <label className="text-sm font-medium text-[#1E1A24] block mb-1">Response Time Note</label>
            <input value={settings.response_time_note} onChange={e => update("response_time_note", e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DEE6] text-sm" />
          </div>
        </div>

        <div className="h-4" />
      </div>

      <SaveBar onSave={handleSave} status={saveStatus} />
    </div>
  );
}
