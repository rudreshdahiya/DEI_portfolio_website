import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { ChevronLeft, Save, Plus, Trash2, Check, AlertCircle, Loader2 } from "lucide-react";
import {
  fetchWorkSettings, saveWorkSettings,
  type WorkSettings, type WorkEngagementItem,
  DEFAULT_WORK_SETTINGS,
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

export default function AdminWorkSettings() {
  const [settings, setSettings] = useState<WorkSettings>(DEFAULT_WORK_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    fetchWorkSettings().then(data => { setSettings(data); setLoading(false); });
  }, []);

  const update = useCallback(<K extends keyof WorkSettings>(key: K, value: WorkSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaveStatus("idle");
  }, []);

  const updateEngagement = (i: number, field: keyof WorkEngagementItem, val: string) => {
    const updated = settings.engagements.map((eng, idx) => idx === i ? { ...eng, [field]: val } : eng);
    update("engagements", updated);
  };

  const addEngagement = () => {
    const newEng: WorkEngagementItem = {
      event: "New Conference or Keynote Event",
      org: "Organisation Name",
      year: "2024",
      role: "Keynote Speaker",
      description: "Description of presentation or keynote...",
    };
    update("engagements", [...settings.engagements, newEng]);
  };

  const removeEngagement = (i: number) => {
    update("engagements", settings.engagements.filter((_, idx) => idx !== i));
  };

  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      await saveWorkSettings(settings);
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
          <h1 className="text-xl font-bold text-[#1E1A24]" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>Work & Engagements Page</h1>
          <p className="text-sm text-[#504852]">Keynotes, summits, workshops, & archive entries</p>
        </div>
      </div>

      <div className="flex-1 px-6 md:px-10 py-8 space-y-6 max-w-3xl">
        <div className="bg-white border border-[#E4DEE6] rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-[#1E1A24]">Page Header</h2>
          <div>
            <label className="text-sm font-medium text-[#1E1A24] block mb-1">Page Title</label>
            <input value={settings.hero_title} onChange={e => update("hero_title", e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DEE6] text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-[#1E1A24] block mb-1">Subtitle</label>
            <input value={settings.hero_subtitle} onChange={e => update("hero_subtitle", e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DEE6] text-sm" />
          </div>
        </div>

        <div className="bg-white border border-[#E4DEE6] rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-[#1E1A24]">Speaking & Field Engagements ({settings.engagements.length})</h2>
          <div className="space-y-4">
            {settings.engagements.map((eng, i) => (
              <div key={i} className="p-4 rounded-xl border border-[#E4DEE6] bg-[#F6F4F7] space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#5C2A57]">Engagement #{i + 1}</span>
                  <button type="button" onClick={() => removeEngagement(i)} className="p-1 rounded text-red-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <label className="text-xs font-medium text-[#1E1A24] block mb-1">Event Name</label>
                  <input value={eng.event} onChange={e => updateEngagement(i, "event", e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-[#E4DEE6] bg-white text-xs font-semibold" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-medium text-[#1E1A24] block mb-1">Organisation</label>
                    <input value={eng.org} onChange={e => updateEngagement(i, "org", e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-[#E4DEE6] bg-white text-xs" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#1E1A24] block mb-1">Role (e.g. Keynote)</label>
                    <input value={eng.role} onChange={e => updateEngagement(i, "role", e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-[#E4DEE6] bg-white text-xs" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#1E1A24] block mb-1">Year</label>
                    <input value={eng.year} onChange={e => updateEngagement(i, "year", e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-[#E4DEE6] bg-white text-xs" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-[#1E1A24] block mb-1">Summary / Description</label>
                  <textarea value={eng.description} onChange={e => updateEngagement(i, "description", e.target.value)} rows={2} className="w-full px-3 py-1.5 rounded-lg border border-[#E4DEE6] bg-white text-xs resize-none" />
                </div>
              </div>
            ))}
            <button onClick={addEngagement} className="w-full py-2.5 rounded-xl border border-dashed border-[#5C2A57]/30 text-[#5C2A57] text-xs font-semibold hover:bg-[#5C2A57]/5 flex items-center justify-center gap-1.5">
              <Plus className="w-4 h-4" /> Add Engagement Entry
            </button>
          </div>
        </div>

        <div className="h-4" />
      </div>

      <SaveBar onSave={handleSave} status={saveStatus} />
    </div>
  );
}
